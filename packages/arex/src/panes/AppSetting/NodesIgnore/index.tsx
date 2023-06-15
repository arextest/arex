import { useRequest } from 'ahooks';
import { App, Col, Divider, Row } from 'antd';
import { DataNode, TreeProps } from 'antd/lib/tree';
import {
  tryParseJsonString,
  tryPrettierJsonString,
  tryStringifyJson,
  useTranslation,
} from 'arex-core';
import React, { FC, useMemo, useState } from 'react';

import { EditAreaPlaceholder } from '@/components';
import {
  ApplicationService,
  ComparisonService,
  ConfigService,
  FileSystemService,
} from '@/services';
import { QueryIgnoreNode, QueryInterfaceIgnoreNode } from '@/services/ComparisonService';

import IgnoreTree, { getNodes } from './IgnoreTree';
import PathCollapse, { InterfacePick } from './PathCollapse';
import PathCollapseHeader from './PathCollapseHeader';
import ResponseRaw from './ResponseRaw';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const GLOBAL_OPERATION_ID = '__global__';

export type SettingNodeIgnoreProps = {
  appId?: string; // 在 AppSetting 中设置
  // 以下 props 不应与上面 props 同时定义
  interfaceId?: string; // 在 Request 中设置
  operationId?: string | null; // 在 Request 中设置
};

// type CheckedNodesData = {
//   operationId?: OperationId<'Global'>;
//   operationName?: string;
//   exclusionsList: string[];
// };

const SettingNodesIgnore: FC<SettingNodeIgnoreProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const [rawResponse, setRawResponse] = useState<string>();
  // Interfaces search keyword
  const [keyword, setKeyword] = useState<string | boolean>(false);

  // const [checkedNodesData, setCheckedNodesData] = useImmer<CheckedNodesData>({ exclusionsList: [] });

  const [activeOperationInterface, setActiveOperationInterface] = useState<
    InterfacePick | undefined
  >({
    id: props.interfaceId ?? GLOBAL_OPERATION_ID,
    operationName: props.interfaceId ? 'NodeIgnore' : 'Global',
  });
  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [], loading: loadingOperationList } = useRequest(
    () => ApplicationService.queryInterfacesList<'Global'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
    },
  );
  const operationListFiltered = useMemo(
    () =>
      typeof keyword === 'string' && keyword
        ? operationList.filter((item) =>
            item.operationName.toLowerCase().includes(keyword.toLowerCase()),
          )
        : operationList,
    [operationList, keyword],
  );

  const handleIgnoreTreeSelect: TreeProps['onSelect'] = ([path], info) => {
    // const selected = info.selectedNodes.map((node) => node.key.toString());
    insertIgnoreNode({
      appId: props.appId,
      operationId: activeOperationInterface!.id, // null 时目标为 Global
      exclusions: path.toString().split('/').filter(Boolean),
    });
  };

  /**
   * 获取 IgnoreNode
   */
  const {
    data: ignoreNodeList = [],
    loading: loadingIgnoreNode,
    run: queryIgnoreNode,
    mutate: setIgnoreNodeList,
  } = useRequest<QueryIgnoreNode[] | QueryInterfaceIgnoreNode[], []>(
    () =>
      props.interfaceId
        ? ComparisonService.queryInterfaceIgnoreNode({
            interfaceId: props.interfaceId,
            operationId: props.operationId,
          })
        : ComparisonService.queryIgnoreNode({
            appId: props.appId as string,
            operationId:
              activeOperationInterface!.id === GLOBAL_OPERATION_ID
                ? null
                : activeOperationInterface!.id,
          }),
    {
      ready: activeOperationInterface !== undefined,
      refreshDeps: [activeOperationInterface],
      onBefore() {
        setIgnoreNodeList([]);
      },
    },
  );

  /**
   * 单个新增 IgnoreNode
   */
  const { run: insertIgnoreNode } = useRequest(ComparisonService.insertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
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
  // const { run: batchDeleteIgnoreNode } = useRequest(ApplicationService.batchDeleteIgnoreNode, {
  //   manual: true,
  //   onSuccess(success) {
  //     if (success) {
  //       queryIgnoreNode();
  //       message.success(t('message.delSuccess', { ns: 'common' }));
  //     } else {
  //       message.error(t('message.delFailed', { ns: 'common' }));
  //     }
  //   },
  // });

  /**
   * 请求 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    mutate: setInterfaceResponse,
    run: queryInterfaceResponse,
    loading: loadingInterfaceResponse,
  } = useRequest(
    () =>
      // @ts-ignore
      props.interfaceId
        ? FileSystemService.queryInterface({ id: props.interfaceId })
        : ConfigService.queryInterfaceResponse({
            id: activeOperationInterface?.id as string,
          }),
    {
      ready: !!activeOperationInterface?.id,
      refreshDeps: [activeOperationInterface],
      onBefore() {
        setInterfaceResponse();
      },
      onSuccess(res) {
        setRawResponse(tryPrettierJsonString(res?.operationResponse || ''));
      },
    },
  );
  const interfaceResponseParsed = useMemo<{ [key: string]: any }>(() => {
    const res = interfaceResponse?.operationResponse;
    if (res) return JSON.parse(res) || {};
    else return {};
  }, [interfaceResponse]);

  /**
   * 更新 InterfaceResponse
   */
  const { run: updateInterfaceResponse } = useRequest(ConfigService.updateInterfaceResponse, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryInterfaceResponse();
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  /**
   * 开始编辑某个 interface 的 response
   * @param operationInterface
   */
  const handleEditResponse = (operationInterface?: InterfacePick) => {
    operationInterface && setActiveOperationInterface(operationInterface);

    setNodesEditMode(NodesEditMode.Raw);
  };
  /**
   * 保存某个 interface 的 response
   */
  const handleResponseSave = () => {
    const parsed = rawResponse && tryParseJsonString(rawResponse, 'Invalid JSON');
    if (!!activeOperationInterface?.id && parsed) {
      updateInterfaceResponse({
        id: activeOperationInterface.id,
        operationResponse: tryStringifyJson(parsed),
      });
      handleCancelEditResponse(true);
    }
  };

  const handleCancelEditResponse = (reloadResponse?: boolean) => {
    setNodesEditMode(NodesEditMode.Tree);
    reloadResponse && queryInterfaceResponse();
  };

  // const handleIgnoreSave = (data: CheckedNodesData) => {
  // const { operationId = null, exclusionsList } = data;
  // const exclusionsListPrev = ignoreNodeList.map((item) => item.path);

  // const add: string[] = [],
  //   remove: string[] = [];
  //
  // // 计算新旧集合的差集，分别进行增量更新和批量删除
  // Array.from(new Set([...exclusionsListPrev, ...exclusionsList])).forEach((path) => {
  //   if (exclusionsListPrev.includes(path) && exclusionsList.includes(path)) return;
  //   else if (exclusionsListPrev.includes(path))
  //     remove.push(ignoreNodeList.find((item) => item.path === path)!.id);
  //   else add.push(path);
  // });

  // 增量更新

  // exclusionsList.length &&
  //   batchInsertIgnoreNode(
  //     exclusionsList.map((path) => ({
  //       appId: props.appId,
  //       operationId, // null 时目标为 Global
  //       exclusions: path.split('/').filter(Boolean),
  //     })),
  //   );

  // 批量删除
  // remove.length && batchDeleteIgnoreNode(remove.map((id) => ({ id })));
  // };

  function getPath(nodeList: DataNode[], pathList: string[], basePath = '') {
    nodeList.forEach((node) => {
      pathList.push(basePath ? basePath + '/' + node.title : (node.title as string));
      node.children && getPath(node.children, pathList, node.title as string);
    });
  }

  const nodePath = useMemo(() => {
    const pathList: string[] = [];
    getPath(getNodes(interfaceResponseParsed, ''), pathList);
    return pathList.map((value) => ({ value }));
  }, [interfaceResponseParsed]);

  return (
    <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
      <Col span={props.interfaceId ? 24 : 10}>
        <PathCollapse
          manualEdit
          appId={props.appId}
          interfaceId={props.interfaceId}
          title={props.interfaceId ? undefined : t('appSetting.global')}
          options={nodePath}
          loadingPanel={loadingIgnoreNode}
          interfaces={[
            {
              id: props.interfaceId ?? GLOBAL_OPERATION_ID,
              operationName: props.interfaceId ? 'NodeIgnore' : 'Global',
            },
          ]}
          activeKey={activeOperationInterface?.id}
          // @ts-ignore
          ignoreNodes={ignoreNodeList}
          onChange={(data, maintain) =>
            setActiveOperationInterface(
              data?.id !== activeOperationInterface?.id || maintain ? data : undefined,
            )
          }
          onReloadNodes={queryIgnoreNode}
        />

        <Divider style={{ margin: '8px 0' }} />

        {props.appId && (
          <PathCollapse
            title={
              <PathCollapseHeader
                search={keyword}
                onChange={(search) => setKeyword(search ? '' : search)}
                onSearch={setKeyword}
              />
            }
            appId={props.appId}
            loading={loadingOperationList}
            loadingPanel={loadingIgnoreNode}
            interfaces={operationListFiltered}
            activeKey={activeOperationInterface?.id}
            height={'calc(100vh - 280px)'}
            // @ts-ignore
            ignoreNodes={ignoreNodeList}
            onChange={(data, maintain) =>
              setActiveOperationInterface(
                data?.id !== activeOperationInterface?.id || maintain ? data : undefined,
              )
            }
            onEditResponse={handleEditResponse}
            onReloadNodes={queryIgnoreNode}
          />
        )}
      </Col>

      {props.appId && (
        <Col span={13}>
          <EditAreaPlaceholder
            dashedBorder
            title={t('appSetting.editArea')}
            ready={
              !!activeOperationInterface && activeOperationInterface.id !== GLOBAL_OPERATION_ID
            }
          >
            {nodesEditMode === NodesEditMode.Tree ? (
              <IgnoreTree
                title={activeOperationInterface?.operationName}
                treeData={interfaceResponseParsed}
                loading={loadingInterfaceResponse}
                // selectedKeys={checkedNodesData.exclusionsList}
                // onSave={handleIgnoreSave}
                onSelect={handleIgnoreTreeSelect}
                onEditResponse={handleEditResponse}
              />
            ) : (
              <ResponseRaw
                value={rawResponse}
                onChange={setRawResponse}
                onSave={handleResponseSave}
                onCancel={handleCancelEditResponse}
              />
            )}
          </EditAreaPlaceholder>
        </Col>
      )}
    </Row>
  );
};

export default SettingNodesIgnore;
