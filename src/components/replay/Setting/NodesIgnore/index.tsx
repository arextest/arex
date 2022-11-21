import { useRequest } from 'ahooks';
import { Col, message, Row } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString, tryPrettierJsonString } from '../../../../helpers/utils';
import AppSettingService from '../../../../services/AppSetting.service';
import { OperationId } from '../../../../services/AppSetting.type';
import { EditAreaPlaceholder } from '../../../styledComponents';
import IgnoreTree from './IgnoreTree';
import PathCollapse, { InterfacePick } from './PathCollapse';
import ResponseRaw from './ResponseRaw';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const GLOBAL_OPERATION_ID = '__global__';

const SettingNodesIgnore: FC<{ appId: string }> = (props) => {
  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    operationId?: OperationId<'Global'>;
    operationName?: string;
    exclusionsList: string[];
  }>({ exclusionsList: [] });

  const [activeOperationInterface, setActiveOperationInterface] = useState<InterfacePick>();
  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [], loading: loadingOperationList } = useRequest(() =>
    AppSettingService.queryInterfacesList<'Global'>({ id: props.appId }),
  );

  const handleIgnoreTreeSelect: TreeProps['onSelect'] = (_, info) => {
    const selected = info.selectedNodes.map((node) => node.key.toString());

    setCheckedNodesData((state) => {
      state.operationId = activeOperationInterface!.id;
      state.operationName = activeOperationInterface!.operationName;
      state.exclusionsList = selected;
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
  } = useRequest(
    () =>
      AppSettingService.queryIgnoreNode({
        appId: props.appId,
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
      onSuccess(res) {
        setCheckedNodesData((state) => {
          state.operationId = activeOperationInterface!.id;
          state.operationName = activeOperationInterface!.operationName;
          state.exclusionsList = res.map((item) => item.path);
        });
      },
    },
  );

  /**
   * 批量新增 IgnoreNode
   */
  const { run: batchInsertIgnoreNode } = useRequest(AppSettingService.batchInsertIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
        message.success('Update successfully');
      } else {
        message.error('Update failed');
      }
    },
  });

  /**
   * 批量删除 IgnoreNode
   */
  const { run: batchDeleteIgnoreNode } = useRequest(AppSettingService.batchDeleteIgnoreNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryIgnoreNode();
        message.success('Delete successfully');
      } else {
        message.error('Delete failed');
      }
    },
  });

  /**
   * 请求 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    loading: loadingInterfaceResponse,
    run: queryInterfaceResponse,
    mutate: setInterfaceResponse,
  } = useRequest(
    () => AppSettingService.queryInterfaceResponse({ id: activeOperationInterface!.id as string }),
    {
      ready: !!activeOperationInterface?.id && activeOperationInterface?.id !== GLOBAL_OPERATION_ID,
      refreshDeps: [activeOperationInterface],
      onBefore() {
        setInterfaceResponse();
      },
      onSuccess(res) {
        console.log({ queryInterfaceResponse: res });
      },
    },
  );
  const interfaceResponseParsed = useMemo<{ [key: string]: any }>(() => {
    const res = interfaceResponse?.operationResponse;
    if (res) return tryParseJsonString<object>(res) || {};
    else return {};
  }, [interfaceResponse]);

  /**
   * 更新 InterfaceResponse
   */
  const { run: updateInterfaceResponse } = useRequest(AppSettingService.updateInterfaceResponse, {
    manual: true,
    onSuccess(success) {
      if (success) {
        queryInterfaceResponse();
        message.success('Update successfully');
      } else {
        message.error('Update failed');
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
   * @param value
   */
  const handleResponseSave = (value?: string) => {
    const parsed = value && tryParseJsonString(value, 'Invalid JSON');
    if (!!activeOperationInterface?.id && parsed) {
      updateInterfaceResponse({
        id: activeOperationInterface.id,
        operationResponse: JSON.stringify(parsed),
      });
      handleCancelEditResponse(true);
    }
  };

  const handleCancelEditResponse = (reloadResponse?: boolean) => {
    setNodesEditMode(NodesEditMode.Tree);
    reloadResponse && queryInterfaceResponse();
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
  };

  return (
    <>
      <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={10}>
          <PathCollapse
            manualEdit
            title='Global'
            appId={props.appId}
            loadingPanel={loadingIgnoreNode}
            interfaces={[{ id: GLOBAL_OPERATION_ID, operationName: 'Global' }]}
            activeKey={activeOperationInterface?.id}
            ignoreNodes={ignoreNodeList}
            onChange={(data, maintain) =>
              setActiveOperationInterface(
                data?.id !== activeOperationInterface?.id || maintain ? data : undefined,
              )
            }
            onReloadNodes={queryIgnoreNode}
          />

          <PathCollapse
            title='Interfaces'
            appId={props.appId}
            loading={loadingOperationList}
            loadingPanel={loadingIgnoreNode}
            interfaces={operationList}
            activeKey={activeOperationInterface?.id}
            ignoreNodes={ignoreNodeList}
            onChange={(data, maintain) =>
              setActiveOperationInterface(
                data?.id !== activeOperationInterface?.id || maintain ? data : undefined,
              )
            }
            onEditResponse={handleEditResponse}
            onReloadNodes={queryIgnoreNode}
          />
        </Col>

        <Col span={13}>
          <EditAreaPlaceholder
            dashedBorder
            title='Edit Area (Click interface to start)'
            ready={
              !!activeOperationInterface && activeOperationInterface.id !== GLOBAL_OPERATION_ID
            }
          >
            {nodesEditMode === NodesEditMode.Tree ? (
              <>
                <IgnoreTree
                  title={activeOperationInterface?.operationName}
                  treeData={interfaceResponseParsed}
                  selectedKeys={checkedNodesData.exclusionsList}
                  loading={loadingInterfaceResponse}
                  onSelect={handleIgnoreTreeSelect}
                  onSave={handleIgnoreSave}
                  onEditResponse={handleEditResponse}
                />
              </>
            ) : (
              <ResponseRaw
                value={tryPrettierJsonString(interfaceResponse?.operationResponse || '')}
                onSave={handleResponseSave}
                onCancel={handleCancelEditResponse}
              />
            )}
          </EditAreaPlaceholder>
        </Col>
      </Row>
    </>
  );
};

export default SettingNodesIgnore;
