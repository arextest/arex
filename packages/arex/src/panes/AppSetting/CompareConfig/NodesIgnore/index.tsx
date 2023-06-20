import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { App, AutoComplete, Button, Card, Input, InputRef, List, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { SmallTextButton, SpaceBetweenWrapper, useTranslation } from 'arex-core';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { EditAreaPlaceholder } from '@/components';
import PaneDrawer from '@/components/PaneDrawer';
import { CONFIG_TYPE } from '@/panes/AppSetting/CompareConfig';
import CompareConfigTitle from '@/panes/AppSetting/CompareConfig/CompareConfigTitle';
import { ComparisonService } from '@/services';
import { OperationId } from '@/services/ApplicationService';
import { IgnoreNodeBase, InterfaceIgnoreNode, QueryIgnoreNode } from '@/services/ComparisonService';

import IgnoreTree, { getNodes } from './IgnoreTree';

const GLOBAL_OPERATION_ID = '__global__';

type CheckedNodesData = {
  operationId?: OperationId<'Global'>;
  exclusionsList: string[];
};

export type NodesIgnoreProps = {
  appId: string;
  interfaceId?: string;
  configType: CONFIG_TYPE;
  responseParsed: { [p: string]: any };
};

const NodesIgnore: FC<NodesIgnoreProps> = (props) => {
  const { message } = App.useApp();
  const [t] = useTranslation(['components', 'common']);

  const searchRef = useRef<InputRef>(null);
  const editInputRef = useRef<any>(null);

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
        operationId: props.interfaceId === GLOBAL_OPERATION_ID ? null : props.interfaceId,
      }),
    {
      ready: props.interfaceId !== undefined,
      refreshDeps: [props.interfaceId],
      onBefore() {
        setIgnoreNodeList([]);
      },
      onSuccess: convertIgnoreNode,
    },
  );

  function convertIgnoreNode(data: QueryIgnoreNode[]) {
    props.appId &&
      setCheckedNodesData((state) => {
        state.operationId = props.interfaceId;
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
        handleExitEdit();
        queryIgnoreNode();
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  const handleExitEdit = () => {
    setEditMode(false);
    setIgnoredKey(undefined);
  };

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

  const handleIgnoreTreeSelect: TreeProps['onSelect'] = (_, info) => {
    const selected = info.selectedNodes.map((node) => node.key.toString());

    setCheckedNodesData((state) => {
      state.operationId = props.interfaceId;
      state.exclusionsList = selected;
    });
  };

  const handleIgnoreAdd = () => {
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
      <CompareConfigTitle
        title='Nodes Ignore'
        onSearch={() => {
          setSearch('');
          setTimeout(() => searchRef.current?.focus());
        }}
        onAdd={handleIgnoreAdd}
      />

      <Card size='small' bodyStyle={{ padding: 0 }} style={{ marginTop: '8px' }}>
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
              <List.Item style={{ padding: '0 8px' }}>
                <SpaceBetweenWrapper width={'100%'}>
                  <AutoComplete
                    size='small'
                    placeholder='Ignored key'
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
                    <SmallTextButton icon={<CloseOutlined />} onClick={handleExitEdit} />
                    <SmallTextButton icon={<CheckOutlined />} onClick={handleEditSave} />
                  </span>
                </SpaceBetweenWrapper>
              </List.Item>
            )
          }
          renderItem={(node) => (
            <List.Item>
              <SpaceBetweenWrapper width={'100%'}>
                <Typography.Text ellipsis>{node.exclusions.join('/')}</Typography.Text>
                <SmallTextButton
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteIgnoreNode({ id: node.id })}
                />
              </SpaceBetweenWrapper>
            </List.Item>
          )}
          locale={{ emptyText: t('appSetting.noIgnoredNodes') }}
        />
      </Card>

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
        open={openIgnoreModal}
        onClose={() => {
          setOpenIgnoreModal(false);
          convertIgnoreNode(ignoreNodeList);
        }}
      >
        <EditAreaPlaceholder
          dashedBorder
          title={t('appSetting.editArea')}
          ready={props.interfaceId !== GLOBAL_OPERATION_ID}
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
