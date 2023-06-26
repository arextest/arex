import {
  CloseOutlined,
  CodeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, Button, Collapse, CollapseProps, Input, List, Spin, Typography } from 'antd';
import {
  css,
  SmallTextButton,
  SpaceBetweenWrapper,
  styled,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import React, { FC, ReactNode, useMemo, useState } from 'react';

import { ComparisonService } from '@/services';
import { OperationId, OperationInterface } from '@/services/ApplicationService';
import { SortNode } from '@/services/ComparisonService';

export interface PathCollapseProps extends Omit<CollapseProps, 'activeKey' | 'onChange'> {
  activeCollapseKey?: SortNode;
  activeKey?: OperationId<'Interface'>;
  height?: string;
  interfaceId?: string;
  interfaces: OperationInterface<'Interface'>[];
  loading?: boolean;
  loadingPanel?: boolean;
  onChange: (operationInterface?: OperationInterface<'Interface'>, maintain?: boolean) => void;
  onEdit?: (path: string, sortNode?: SortNode) => void;
  onEditResponse?: (operationInterface: OperationInterface<'Interface'>) => void;
  onReloadNodes?: () => void;
  sortNodes: SortNode[];
  title?: ReactNode;
}

const CollapseWrapper = styled.div`
  .ant-collapse-content-box {
    padding: 0 !important;
  }
  .ant-collapse-header-text {
    width: calc(100% - 80px);
  }
  .active-item {
    background-color: ${(props) => props.theme.colorPrimaryBg};
    transition: background-color 200ms ease;
  }
  .ant-spin-nested-loading {
    width: 100%;
  }
  .disabled-node {
    cursor: not-allowed;
  }
`;

const PathCollapse: FC<PathCollapseProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [search, setSearch] = useState<boolean | string>(false);

  const sortNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? props.sortNodes.filter((node) => node.path.toLowerCase().includes(search.toLowerCase()))
        : props.sortNodes,
    [props.sortNodes, search],
  );

  const handleEdit = (sortNode: SortNode) => props.onEdit && props.onEdit(sortNode.path, sortNode);

  /**
   * 删除 IgnoreNode
   */
  const { run: deleteIgnoreNode } = useRequest(ComparisonService.deleteSortNode, {
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

  return (
    <CollapseWrapper>
      {props.title && <h3>{props.title}</h3>}
      <Spin spinning={props.loading || false}>
        <Collapse
          {...props}
          accordion
          activeKey={props.activeKey || undefined}
          onChange={([id]) =>
            props.onChange && props.onChange(props.interfaces.find((i) => i.id === id))
          }
          css={css`
            height: ${props.height};
            overflow-y: auto;
            .ant-collapse-extra {
              flex-shrink: 0;
            }
          `}
        >
          {props.interfaces.map((i) => (
            <Collapse.Panel
              key={String(i.id)}
              header={<Typography.Text ellipsis>{i.operationName}</Typography.Text>}
              extra={
                <>
                  <TooltipButton
                    key='add'
                    icon={<PlusOutlined />}
                    title={t('appSetting.addSortKey')}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onChange?.(i, true);
                    }}
                  />
                  <SmallTextButton
                    key='search'
                    icon={<SearchOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearch('');
                      props.onChange?.(i, true);
                    }}
                  />
                  {!props.interfaceId && (
                    <TooltipButton
                      key='editResponse'
                      icon={<CodeOutlined />}
                      title={t('appSetting.editResponse')}
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onEditResponse?.(i);
                      }}
                    />
                  )}
                </>
              }
            >
              <List
                size='small'
                loading={props.loadingPanel}
                dataSource={sortNodesFiltered}
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
                renderItem={(sortNode) => (
                  <List.Item
                    className={
                      `${props.activeKey}_${props.activeCollapseKey?.id}` ===
                      `${i.id}_${sortNode.id}`
                        ? 'active-item'
                        : ''
                    }
                  >
                    <Spin
                      indicator={<></>}
                      spinning={!!props.interfaceId && !sortNode.compareConfigType}
                      wrapperClassName={
                        !!props.interfaceId && !sortNode.compareConfigType ? 'disabled-node' : ''
                      }
                    >
                      <SpaceBetweenWrapper width={'100%'}>
                        <Typography.Text ellipsis>{sortNode.path}</Typography.Text>
                        <span style={{ flexShrink: 0 }}>
                          <span style={{ marginRight: '8px' }}>
                            {`${sortNode.pathKeyList.length} keys`}
                          </span>
                          <Button
                            type='text'
                            size='small'
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(sortNode)}
                          />
                          <Button
                            type='text'
                            size='small'
                            icon={<DeleteOutlined />}
                            onClick={() => deleteIgnoreNode({ id: sortNode.id })}
                          />
                        </span>
                      </SpaceBetweenWrapper>
                    </Spin>
                  </List.Item>
                )}
                locale={{ emptyText: t('appSetting.noSortNodes') }}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Spin>
    </CollapseWrapper>
  );
};

export default PathCollapse;
