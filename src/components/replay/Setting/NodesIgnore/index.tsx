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
    operationName?: string;
    keys: string[];
  }>({ keys: [] });

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
      state.operationName = operationInterface.id;
      state.keys = selected;
    });
  };

  const handleIgnoredNodesCollapseClick = (operationInterface?: OperationInterface) => {
    setActiveOperationInterface(
      operationInterface?.id === activeOperationInterface?.id ? undefined : operationInterface,
    );
  };

  /**
   * TODO 等待接口支持 operationId 参数查询
   * 查询 IgnoreNode
   */
  const { data: ignoreNodeList = [] } = useRequest(
    () => AppSettingService.queryIgnoreNode({ id: props.appId }),
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
    console.log(checkedNodesData);
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
            checkedNodes={checkedNodesData.keys}
            onChange={handleIgnoredNodesCollapseClick}
            onEditResponse={handleEditResponse}
            onSelect={onSelect}
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
                  selectedKeys={checkedNodesData.keys}
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
