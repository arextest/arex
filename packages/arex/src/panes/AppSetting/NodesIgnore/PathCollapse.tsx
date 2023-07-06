import {
  CheckOutlined,
  CloseOutlined,
  CodeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  css,
  SmallTextButton,
  SpaceBetweenWrapper,
  styled,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import {
  App,
  AutoComplete,
  Button,
  Collapse,
  CollapseProps,
  Input,
  List,
  Spin,
  Typography,
} from 'antd';
import React, { FC, ReactNode, SyntheticEvent, useMemo, useRef, useState } from 'react';

import { ComparisonService } from '@/services';
import { OperationId, OperationInterface } from '@/services/ApplicationService';
import {
  IgnoreNodeBase,
  InterfaceIgnoreNode,
  QueryInterfaceIgnoreNode,
} from '@/services/ComparisonService';

export type InterfacePick = Pick<OperationInterface, 'id' | 'operationName'>;

const PathCollapseWrapper = styled.div`
  margin-bottom: 16px;
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  .ant-collapse-header-text {
    width: calc(100% - 80px);
  }
  .ant-spin-nested-loading {
    width: 100%;
  }
  .disabled-node {
    cursor: not-allowed;
  }
`;

export interface PathCollapseProps extends Omit<CollapseProps, 'activeKey' | 'onChange'> {
  appId?: string;
  interfaceId?: string; // collection - interface
  title?: ReactNode;
  options?: { value: string }[]; // AutoComplete options
  height?: string;
  activeKey?: OperationId<'Global'>;
  interfaces: InterfacePick[];
  ignoreNodes: QueryInterfaceIgnoreNode[];
  loading?: boolean;
  loadingPanel?: boolean;
  manualEdit?: boolean;
  onChange?: (path?: InterfacePick, maintain?: boolean) => void;
  onReloadNodes?: () => void;
  onEditResponse?: (operationInterface: InterfacePick) => void;
}

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const editInputRef = useRef<any>(null);
  const [ignoredKey, setIgnoredKey] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState<boolean | string>(false);

  const ignoreNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? props.ignoreNodes.filter((node) =>
            node.exclusions.join('/').toLowerCase().includes(search.toLowerCase()),
          )
        : props.ignoreNodes,
    [props.ignoreNodes, search],
  );

  const handleAddKey = (e: SyntheticEvent, path: InterfacePick) => {
    e.stopPropagation();
    if (props.manualEdit) {
      setEditMode(true);
      setTimeout(() =>
        editInputRef.current?.focus({
          cursor: 'start',
        }),
      );
    }
    props.onChange?.(path, true);
  };

  /**
   * 新增 Global IgnoreNode 数据
   */
  const { run: insertIgnoreNode } = useRequest(ComparisonService.insertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
        handleExitEdit();
        props.onReloadNodes?.();
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });
  const handleEditSave = () => {
    if (!ignoredKey) {
      message.warning(t('appSetting.emptyKey'));
      return;
    }

    let params: IgnoreNodeBase | InterfaceIgnoreNode = {
      operationId: undefined,
      appId: props.appId,
      exclusions: ignoredKey.split('/').filter(Boolean),
    };

    props.interfaceId &&
      (params = { ...params, compareConfigType: 1, fsInterfaceId: props.interfaceId });

    insertIgnoreNode(params);
  };

  /**
   * 删除 IgnoreNode
   */
  const { run: deleteIgnoreNode } = useRequest(ComparisonService.deleteIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        props.onReloadNodes?.();
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  const collapseItems = useMemo<CollapseProps['items']>(
    () =>
      props.interfaces.map((path) => ({
        key: String(path.id),
        label: <Typography.Text ellipsis>{path.operationName}</Typography.Text>,
        extra: [
          <TooltipButton
            key='add'
            icon={<PlusOutlined />}
            title={t('appSetting.addKey')}
            onClick={(e) => handleAddKey(e, path)}
          />,
          <SmallTextButton
            key='search'
            icon={<SearchOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSearch('');
              props.onChange?.(path, true);
            }}
          />,
          !props.manualEdit && (
            <TooltipButton
              key='editResponse'
              icon={<CodeOutlined />}
              title={t('appSetting.editResponse')}
              onClick={(e) => {
                e.stopPropagation();
                props.onEditResponse?.(path);
              }}
            />
          ),
        ],
        children: (
          <List
            size='small'
            dataSource={ignoreNodesFiltered}
            loading={props.loadingPanel}
            header={
              search !== false && (
                <SpaceBetweenWrapper style={{ padding: '0 16px' }}>
                  <Input.Search
                    size='small'
                    onSearch={(value) => {
                      setSearch(value);
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  <Button
                    size='small'
                    type='text'
                    icon={<CloseOutlined />}
                    onClick={() => setSearch(false)}
                  />
                </SpaceBetweenWrapper>
              )
            }
            footer={
              editMode && (
                <List.Item style={{ padding: '0 8px' }}>
                  <SpaceBetweenWrapper width={'100%'}>
                    <AutoComplete
                      size='small'
                      placeholder='Ignored key'
                      ref={editInputRef}
                      options={props.options}
                      filterOption={(inputValue, option) =>
                        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      value={ignoredKey}
                      onChange={setIgnoredKey}
                      style={{ width: '100%' }}
                    />
                    <span style={{ display: 'flex', marginLeft: '8px' }}>
                      <SmallTextButton icon={<CloseOutlined />} onClick={handleExitEdit} />
                      <SmallTextButton icon={<CheckOutlined />} onClick={handleEditSave} />
                    </span>
                  </SpaceBetweenWrapper>
                </List.Item>
              )
            }
            renderItem={(node) => (
              <List.Item>
                <Spin
                  indicator={<></>}
                  spinning={!!props.interfaceId && !node.compareConfigType}
                  wrapperClassName={
                    !!props.interfaceId && !node.compareConfigType ? 'disabled-node' : ''
                  }
                >
                  <SpaceBetweenWrapper width={'100%'}>
                    <Typography.Text ellipsis>{node.exclusions.join('/')}</Typography.Text>
                    <SmallTextButton
                      icon={<DeleteOutlined />}
                      onClick={() => deleteIgnoreNode({ id: node.id })}
                    />
                  </SpaceBetweenWrapper>
                </Spin>
              </List.Item>
            )}
            locale={{ emptyText: t('appSetting.noIgnoredNodes') }}
          />
        ),
      })),
    [
      deleteIgnoreNode,
      editMode,
      handleAddKey,
      handleEditSave,
      ignoreNodesFiltered,
      ignoredKey,
      props,
      search,
      t,
    ],
  );

  const handleExitEdit = () => {
    setIgnoredKey('');
    setEditMode(false);
  };

  return (
    <PathCollapseWrapper>
      <h3>{props.title}</h3>
      <Spin spinning={props.loading || false}>
        <Collapse
          {...props}
          accordion
          activeKey={props.activeKey || undefined}
          items={collapseItems}
          onChange={([id]) =>
            props.onChange?.(
              props.interfaces.find((i) => i.id === id),
              false,
            )
          }
          css={css`
            height: ${props.height};
            overflow-y: auto;
            .ant-collapse-extra {
              flex-shrink: 0;
            }
          `}
        />
      </Spin>
    </PathCollapseWrapper>
  );
};

export default PathCollapse;
