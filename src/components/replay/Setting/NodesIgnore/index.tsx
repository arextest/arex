import { useRequest } from 'ahooks';
import { Button, Col, message, Row } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import React, { FC, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';

import { tryParseJsonString, tryPrettierJsonString } from '../../../../helpers/utils';
import AppSettingService from '../../../../services/AppSetting.service';
import { OperationInterface } from '../../../../services/AppSetting.type';
import { EditAreaPlaceholder } from '../../../styledComponents';
import IgnoreTree from './IgnoreTree';
import PathCollapse from './PathCollapse';
import ResponseRaw from './ResponseRaw';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

const GLOBAL_KEY = '__global__';

const NodesIgnore: FC<{ appId: string }> = (props) => {
  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    operationId?: string;
    operationName?: string;
    exclusionsList: string[]; // TODO add id
  }>({ exclusionsList: [] });

  const [activeOperationInterface, setActiveOperationInterface] = useState<OperationInterface>();
  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(AppSettingService.queryInterfacesList, {
    defaultParams: [{ id: props.appId }],
    onSuccess(res) {
      console.log(res);
    },
  });

  const handleIgnoreTreeSelect: TreeProps['onSelect'] = (_, info) => {
    const selected = info.selectedNodes.map((node) => node.key.toString());

    setCheckedNodesData((state) => {
      state.operationId = activeOperationInterface!.id;
      state.operationName = activeOperationInterface!.operationName;
      state.exclusionsList = selected;
    });
  };

  /**
   * 查询 IgnoreNode
   */
  const {
    data: ignoreNodeList = [],
    run: queryIgnoreNode,
    mutate: setIgnoreNodeList,
  } = useRequest(
    () =>
      AppSettingService.queryIgnoreNode({
        appId: props.appId,
        operationId: activeOperationInterface?.id,
      }),
    {
      ready: !!activeOperationInterface,
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
   * 更新 IgnoreNode
   */
  const { run: updateIgnoreNode } = useRequest(AppSettingService.updateIgnoreNode, {
    manual: true,
    onSuccess(res) {
      console.log(res);
    },
  });

  /**
   * 删除 IgnoreNode
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
    mutate: setInterfaceResponse,
    run: queryInterfaceResponse,
  } = useRequest(
    () => AppSettingService.queryInterfaceResponse({ id: activeOperationInterface!.id }),
    {
      ready: !!activeOperationInterface?.id,
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
  const handleEditResponse = (operationInterface: OperationInterface) => {
    console.log('setNodesEditMode to Raw', { operationInterface });
    setActiveOperationInterface(operationInterface);

    setNodesEditMode(NodesEditMode.Raw);
  };
  /**
   * 保存某个 interface 的 response
   * @param value
   */
  const handleResponseSave = (value?: string) => {
    const parsed = value && tryParseJsonString(value, 'Invalid JSON');
    if (parsed) {
      updateInterfaceResponse({
        id: activeOperationInterface!.id,
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
          <h3>Global</h3>
          {/* TODO */}
          {/*<PathCollapse*/}
          {/*  activeKey={activeKey}*/}
          {/*  checkedNodes={checkedNodesData.global}*/}
          {/*  onChange={handleIgnoredNodesCollapseClick}*/}
          {/*  onSelect={handleIgnoreTreeSelect}*/}
          {/*/>*/}

          <br />

          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={operationList}
            activeKey={activeOperationInterface?.id}
            checkedNodes={ignoreNodeList}
            onChange={(data) =>
              setActiveOperationInterface(
                data?.id === activeOperationInterface?.id ? undefined : data,
              )
            }
            onEditResponse={handleEditResponse}
            onDelete={(path) => batchDeleteIgnoreNode([{ id: path.id }])}
          />
        </Col>

        <Col span={13}>
          <EditAreaPlaceholder
            dashedBorder
            title='Edit Area (Click interface to start)'
            ready={!!activeOperationInterface}
          >
            {nodesEditMode === NodesEditMode.Tree ? (
              <>
                <IgnoreTree
                  treeData={interfaceResponseParsed}
                  selectedKeys={checkedNodesData.exclusionsList}
                  title={activeOperationInterface?.operationName}
                  onSelect={handleIgnoreTreeSelect}
                  onSave={handleIgnoreSave}
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

export default NodesIgnore;
