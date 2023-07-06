import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  css,
  PaneDrawer,
  SmallTextButton,
  SpaceBetweenWrapper,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import {
  App,
  AutoComplete,
  Button,
  ButtonProps,
  Card,
  Collapse,
  Input,
  InputRef,
  List,
  Typography,
} from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { EditAreaPlaceholder } from '@/components';
import { CONFIG_TYPE } from '@/panes/AppSetting/CompareConfig';
import CompareConfigTitle from '@/panes/AppSetting/CompareConfig/CompareConfigTitle';
import { ComparisonService } from '@/services';
import { OperationId } from '@/services/ApplicationService';
import { IgnoreNodeBase, QueryIgnoreNode } from '@/services/ComparisonService';

import IgnoreTree, { getNodes } from './IgnoreTree';
const ActiveKey = 'sort';

type CheckedNodesData = {
  operationId?: OperationId<'Global'>;
  exclusionsList: string[];
};

export type NodesIgnoreProps = {
  appId: string;
  operationId?: string;
  readOnly?: boolean;
  configType: CONFIG_TYPE;
  responseParsed: { [p: string]: any };
};

const NodesIgnore: FC<NodesIgnoreProps> = (props) => {
  const { message } = App.useApp();
  const [t] = useTranslation(['components', 'common']);

  const searchRef = useRef<InputRef>(null);
  const editInputRef = useRef<any>(null);

  const [activeKey, setActiveKey] = useState<string | string[]>([ActiveKey]);
  const [search, setSearch] = useState<string | false>(false);
  const [editMode, setEditMode] = useState(false);

  const [openIgnoreModal, setOpenIgnoreModal] = useState(false);

  const [checkedNodesData, setCheckedNodesData] = useImmer<CheckedNodesData>({
    exclusionsList: [],
  });

  const [ignoredKey, setIgnoredKey] = useState<string>();

  /**
   * 获取 IgnoreNode
   */
  const {
    data: ignoreNodeList = [],
    loading: loadingIgnoreNode,
    run: queryIgnoreNode,
    mutate: setIgnoreNodeList,
  } = useRequest(
    () =>
      ComparisonService.queryIgnoreNode({
        appId: props.appId,
        operationId: props.configType === CONFIG_TYPE.GLOBAL ? null : props.operationId,
      }),
    {
      ready: !!props.appId,
      refreshDeps: [props.operationId, props.configType],
      onBefore() {
        setIgnoreNodeList([]);
      },
      onSuccess: convertIgnoreNode,
    },
  );

  function convertIgnoreNode(data: QueryIgnoreNode[]) {
    setCheckedNodesData((state) => {
      state.operationId = props.operationId;
      state.exclusionsList = data.map((item) => item.path);
    });
  }

  const ignoreNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? ignoreNodeList.filter((node) =>
            node.exclusions.join('/').toLowerCase().includes(search.toLowerCase()),
          )
        : ignoreNodeList,
    [ignoreNodeList, search],
  );

  function getPath(nodeList: DataNode[], pathList: string[], basePath = '') {
    nodeList.forEach((node) => {
      pathList.push(basePath ? basePath + '/' + node.title : (node.title as string));
      node.children && getPath(node.children, pathList, node.title as string);
    });
  }

  const nodePath = useMemo(() => {
    const pathList: string[] = [];
    getPath(getNodes(props.responseParsed, ''), pathList);
    return pathList.map((value) => ({ value }));
  }, [props.responseParsed]);

  /**
   * 删除 IgnoreNode
   */
  const { run: handleDeleteIgnoreNode } = useRequest(ComparisonService.deleteIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  /**
   * 批量新增 IgnoreNode
   */
  const { run: batchInsertIgnoreNode } = useRequest(ComparisonService.batchInsertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  /**
   * 批量删除 IgnoreNode
   */
  const { run: batchDeleteIgnoreNode } = useRequest(ComparisonService.batchDeleteIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });

  /**
   * 新增 Global IgnoreNode 数据
   */
  const { run: insertIgnoreNode } = useRequest(ComparisonService.insertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        message.success(t('message.updateSuccess', { ns: 'common' }));
        handleGlobalEditExit();
        queryIgnoreNode();
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  const handleGlobalEditExit = () => {
    setEditMode(false);
    setIgnoredKey(undefined);
  };

  const handleGlobalEditSave = () => {
    if (!ignoredKey) {
      message.warning(t('appSetting.emptyKey'));
      return;
    }

    const params: IgnoreNodeBase = {
      operationId: undefined,
      appId: props.appId,
      exclusions: ignoredKey.split('/').filter(Boolean),
    };

    insertIgnoreNode(params);
  };

  const handleIgnoreTreeSelect: TreeProps['onSelect'] = (_, info) => {
    const selected = info.selectedNodes.map((node) => node.key.toString());

    setCheckedNodesData((state) => {
      state.operationId = props.operationId;
      state.exclusionsList = selected;
    });
  };

  const handleSearch: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    setSearch('');
    setTimeout(() => searchRef.current?.focus());
  };

  const handleIgnoreAdd: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    setTimeout(() => editInputRef.current?.focus());

    if (props.configType === CONFIG_TYPE.GLOBAL) {
      setEditMode(true);
    } else if (props.configType === CONFIG_TYPE.INTERFACE) {
      if (Object.keys(props.responseParsed).length) setOpenIgnoreModal(true);
      else message.info('empty response, please sync response first');
    }
  };

  const handleIgnoreSave = () => {
    const { operationId = null, exclusionsList } = checkedNodesData;
    const exclusionsListPrev = ignoreNodeList.map((item) => item.path);

    const add: string[] = [],
      remove: string[] = [];

    // 计算新旧集合的差集，分别进行增量更新和批量删除
    Array.from(new Set([...exclusionsListPrev, ...exclusionsList])).forEach((path) => {
      if (exclusionsListPrev.includes(path) && exclusionsList.includes(path)) return;
      else if (exclusionsListPrev.includes(path))
        remove.push(ignoreNodeList.find((item) => item.path === path)!.id);
      else add.push(path);
    });

    // 增量更新
    add.length &&
      batchInsertIgnoreNode(
        add.map((path) => ({
          appId: props.appId,
          operationId, // null 时目标为 Global
          exclusions: path.split('/').filter(Boolean),
        })),
      );

    // 批量删除
    remove.length && batchDeleteIgnoreNode(remove.map((id) => ({ id })));

    setOpenIgnoreModal(false);
  };

  return (
    <>
      <Collapse
        size='small'
        activeKey={activeKey}
        items={[
          {
            key: ActiveKey,
            label: (
              <CompareConfigTitle
                title='Nodes Ignore'
                readOnly={props.readOnly}
                onSearch={handleSearch}
                onAdd={handleIgnoreAdd}
              />
            ),
            children: (
              <Card bordered={false} size='small' bodyStyle={{ padding: 0 }}>
                <List
                  size='small'
                  dataSource={ignoreNodesFiltered}
                  loading={loadingIgnoreNode}
                  header={
                    search !== false && (
                      <SpaceBetweenWrapper style={{ padding: '0 16px' }}>
                        <Input.Search
                          size='small'
                          ref={searchRef}
                          placeholder='Search for ignored key'
                          onChange={(e) => setSearch(e.target.value)}
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
                      <List.Item style={{ padding: '0 16px' }}>
                        <SpaceBetweenWrapper width={'100%'}>
                          <AutoComplete
                            size='small'
                            placeholder='Input key to ignore'
                            ref={editInputRef}
                            options={nodePath}
                            filterOption={(inputValue, option) =>
                              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            value={ignoredKey}
                            onChange={setIgnoredKey}
                            style={{ width: '100%' }}
                          />
                          <span style={{ display: 'flex', marginLeft: '8px' }}>
                            <SmallTextButton
                              icon={<CloseOutlined />}
                              onClick={handleGlobalEditExit}
                            />
                            <SmallTextButton
                              icon={<CheckOutlined />}
                              onClick={handleGlobalEditSave}
                            />
                          </span>
                        </SpaceBetweenWrapper>
                      </List.Item>
                    )
                  }
                  renderItem={(node) => (
                    <List.Item>
                      <SpaceBetweenWrapper width={'100%'}>
                        <Typography.Text ellipsis>{node.exclusions.join('/')}</Typography.Text>
                        {!props.readOnly && (
                          <SmallTextButton
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteIgnoreNode({ id: node.id })}
                          />
                        )}
                      </SpaceBetweenWrapper>
                    </List.Item>
                  )}
                  locale={{ emptyText: t('appSetting.noIgnoredNodes') }}
                />
              </Card>
            ),
          },
        ]}
        onChange={setActiveKey}
        css={css`
          .ant-collapse-content-box {
            padding: 0 !important;
          }
        `}
      />
      <PaneDrawer
        title={
          <SpaceBetweenWrapper>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Nodes Ignore
            </Typography.Title>
            <Button size='small' type='primary' onClick={handleIgnoreSave}>
              {t('save', { ns: 'common' })}
            </Button>
          </SpaceBetweenWrapper>
        }
        bodyStyle={{ padding: '8px 0' }}
        open={openIgnoreModal}
        onClose={() => {
          setOpenIgnoreModal(false);
          convertIgnoreNode(ignoreNodeList);
        }}
      >
        <EditAreaPlaceholder
          ready={!!props.responseParsed}
          dashedBorder
          title={t('appSetting.editArea')}
        >
          <IgnoreTree
            treeData={props.responseParsed}
            selectedKeys={checkedNodesData.exclusionsList}
            onSelect={handleIgnoreTreeSelect}
          />
        </EditAreaPlaceholder>
      </PaneDrawer>
    </>
  );
};

export default NodesIgnore;
