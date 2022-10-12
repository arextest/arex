import { useRequest } from 'ahooks';
import { Button, Col, message, Row } from 'antd';
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
    exclusionsList: string[];
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

  const onSelect = (operationInterface: OperationInterface, selected: string[]) => {
    setCheckedNodesData((state) => {
      state.operationId = operationInterface.id;
      state.operationName = operationInterface.operationName;
      state.exclusionsList = selected;
    });
  };

  const handleIgnoredNodesCollapseClick = (operationInterface?: OperationInterface) => {
    setIgnoreNodeList([]);
    setActiveOperationInterface(
      operationInterface?.id === activeOperationInterface?.id ? undefined : operationInterface,
    );
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
      onSuccess(res) {
        console.log({ queryIgnoreNode: res });
        // setCheckedNodesData()
      },
    },
  );

  /**
   * 批量新增 IgnoreNode
   */
  const { run: insertIgnoreNode } = useRequest(AppSettingService.batchInsertIgnoreNode, {
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
  const { run: deleteIgnoreNode } = useRequest(AppSettingService.deleteIgnoreNode, {
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
  const handleDeleteNode = (path: OperationInterface) => {
    console.log(path);
    deleteIgnoreNode({ id: path.id });
  };

  /**
   * 请求 InterfaceResponse
   */
  const { data: interfaceResponse, run: queryInterfaceResponse } = useRequest(
    () => AppSettingService.queryInterfaceResponse({ id: activeOperationInterface!.id }),
    {
      ready: !!activeOperationInterface?.id,
      refreshDeps: [activeOperationInterface],
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

    insertIgnoreNode(
      exclusionsList.map((path) => ({
        appId: props.appId,
        operationId, // null 时目标为 Global
        exclusions: path.split('/').filter(Boolean),
      })),
    );
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
          {/*  onSelect={onSelect}*/}
          {/*/>*/}

          <br />

          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={operationList}
            activeKey={activeOperationInterface?.id}
            checkedNodes={ignoreNodeList}
            onChange={handleIgnoredNodesCollapseClick}
            onEditResponse={handleEditResponse}
            onDelete={handleDeleteNode}
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
                  onSelect={(selectKeys, info) =>
                    onSelect(
                      activeOperationInterface as OperationInterface,
                      info.selectedNodes.map((node) => node.key.toString()),
                    )
                  }
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
