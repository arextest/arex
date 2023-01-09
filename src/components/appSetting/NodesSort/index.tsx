import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App, Button, Card, Carousel, Col, Row, Space } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { TreeProps } from 'antd/lib/tree';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { tryParseJsonString, tryPrettierJsonString } from '../../../helpers/utils';
import AppSettingService from '../../../services/AppSetting.service';
import { OperationInterface, SortNode } from '../../../services/AppSetting.type';
import { FileSystemService } from '../../../services/FileSystem.service';
import { EditAreaPlaceholder, SpaceBetweenWrapper } from '../../styledComponents';
import EmptyResponse from '../NodesIgnore/EmptyResponse';
import ResponseRaw from '../NodesIgnore/ResponseRaw';
import ArrayTree from './ArrayTree';
import PathCollapse from './PathCollapse';
import SortTree from './SortTree';

enum NodesEditMode {
  'Tree' = 'Tree',
  'Raw' = 'Raw',
}

enum TreeEditModeEnum {
  ArrayTree,
  SortTree,
}
const TreeEditMode = ['ArrayTree', 'SortTree'];

const TreeCarousel = styled(Carousel)`
  .slick-dots-bottom {
    position: relative;
    margin: 12px 0 0 0;
  }
  .slick-dots.slick-dots-bottom {
    li > button {
      height: 4px;
      border-radius: 2px;
      background-color: ${(props) => props.theme.colorTextTertiary}!important;
    }
    * > li.slick-active > button {
      background-color: ${(props) => props.theme.colorTextQuaternary}!important;
    }
  }
`;

export type SettingNodesSortProps = {
  appId?: string; // 在 AppSetting 中设置
  // 以下 props 不应与上面 props 同时定义
  interfaceId?: string; // 在 Request 中设置
  operationId?: string | null; // 在 Request 中设置
};

const SettingNodesSort: FC<SettingNodesSortProps> = (props) => {
  const { message } = App.useApp();

  const { t } = useTranslation('common');

  const treeCarousel = useRef<CarouselRef>(null);

  const [activeOperationInterface, setActiveOperationInterface] = useState<
    OperationInterface<'Interface'> | undefined
  >(
    props.interfaceId
      ? {
          id: props.interfaceId,
          operationName: 'NodeSort',
        }
      : undefined,
  );
  const [activeSortNode, setActiveSortNode] = useState<SortNode>();
  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    path?: string;
    pathKeyList: string[];
  }>({ pathKeyList: [] });

  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);
  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.ArrayTree);

  const [sortArray, setSortArray] = useState<any[]>();

  // 控制 SortTree 组件防止在获取到有效的 treeData 数据前渲染，导致 defaultExpandAll 失效
  const [treeReady, setTreeReady] = useState(false);

  /**
   * 请求 InterfacesList
   */
  const {
    data: operationList = props.appId
      ? []
      : [activeOperationInterface as OperationInterface<'Interface'>],
    loading: loadingOperationList,
  } = useRequest(
    () => AppSettingService.queryInterfacesList<'Interface'>({ id: props.appId as string }),
    {
      ready: !!props.appId,
    },
  );

  /**
   * 获取 SortNode
   */
  const {
    data: sortNodeList = [],
    loading: loadingSortNode,
    run: querySortNode,
    mutate: setSortNodeList,
  } = useRequest(
    () =>
      props.interfaceId
        ? AppSettingService.queryInterfaceSortNode({
            interfaceId: props.interfaceId,
            operationId: props.operationId,
          })
        : AppSettingService.querySortNode({
            appId: props.appId as string,
            operationId: activeOperationInterface!.id,
          }),
    {
      ready: !!activeOperationInterface,
      refreshDeps: [activeOperationInterface?.id],
      onBefore() {
        setSortNodeList([]);
      },
      onSuccess() {
        props.appId && handleCancelEditResponse(false, false);
      },
    },
  );

  const SaveSortNodeOptions = {
    manual: true,
    onSuccess(success: boolean) {
      if (success) {
        querySortNode();
        treeCarousel.current?.goTo(0);
        message.success('Update successfully');
      } else {
        message.error('Update failed');
      }
    },
  };

  /**
   * 新增 SortNode
   */
  const { run: insertSortNode } = useRequest(AppSettingService.insertSortNode, SaveSortNodeOptions);

  /**
   * 更新 SortNode
   */
  const { run: updateSortNode } = useRequest(AppSettingService.updateSortNode, SaveSortNodeOptions);

  const handleSaveSort = () => {
    const params = {
      listPath: checkedNodesData?.path?.split('/').filter(Boolean) || [],
      keys: checkedNodesData.pathKeyList.map((key) => key?.split('/').filter(Boolean)),
    };
    if (activeSortNode) {
      updateSortNode({ id: activeSortNode.id, ...params });
    } else if (props.appId && activeOperationInterface?.id) {
      insertSortNode({
        ...params,
        appId: props.appId,
        operationId: activeOperationInterface.id,
      });
    }
  };

  /**
   * 获取 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    mutate: setInterfaceResponse,
    run: queryInterfaceResponse,
    loading: loadingInterfaceResponse,
  } = useRequest(
    () =>
      AppSettingService.queryInterfaceResponse({
        id: activeOperationInterface?.id as string,
      }),
    {
      ready: !!activeOperationInterface?.id,
      refreshDeps: [activeOperationInterface],
      onBefore() {
        setInterfaceResponse(undefined);
        setTreeReady(false);
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
  const handleEditResponse = (operationInterface?: OperationInterface<'Interface'>) => {
    operationInterface && setActiveOperationInterface(operationInterface);
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
        id: activeOperationInterface?.id as string,
        operationResponse: JSON.stringify(parsed),
      });
      handleCancelEditResponse(true);
    }
  };

  /**
   * handle click Collapse or PlusButton
   * @param operationInterface
   * @param maintain always expand panel
   */
  const handleNodesCollapseClick = (
    operationInterface?: OperationInterface<'Interface'>,
    maintain?: boolean,
  ) => {
    const { id } = operationInterface || {};
    setNodesEditMode(NodesEditMode.Tree);
    setTreeEditMode(TreeEditModeEnum.ArrayTree);
    treeCarousel.current?.goTo(0);

    setActiveOperationInterface(
      id !== activeOperationInterface?.id || maintain ? operationInterface : undefined,
    );
    if (id) {
      handleSetSortArray(id);
    }
  };

  /**
   * 点击 PathCollapseItem 或 ArrayTreeItem 时
   * @param path
   * @param sortNode 点击 ArrayTreeItem 新的未配置节点时 sortNode 为 undefined
   */
  const handleEditCollapseItem = (path: string, sortNode?: SortNode) => {
    setActiveSortNode(sortNode);
    setCheckedNodesData((state) => {
      state.path = path;
      state.pathKeyList = sortNode?.pathKeyList || [];
    });

    handleSetSortArray(path);
    setNodesEditMode(NodesEditMode.Tree);
    setTreeEditMode(TreeEditModeEnum.SortTree);
    treeCarousel.current?.goTo(1);

    setTreeReady(true);
  };

  // 获取待排序操作的数组结构
  const handleSetSortArray = (key: string) => {
    let value: any = undefined;
    key
      .split('/')
      .filter(Boolean)
      .forEach((k, i) => {
        value =
          i === 0 ? interfaceResponseParsed[k] : Array.isArray(value) ? value[0]?.[k] : value[k];
      });

    setSortArray(value);
  };

  /**
   * 取消编辑 response
   * @param reloadResponse 是否重新加载 interfaceResponse
   * @param nodesEditMode
   */
  const handleCancelEditResponse = (
    reloadResponse?: boolean,
    nodesEditMode: NodesEditMode | false = NodesEditMode.Tree,
  ) => {
    nodesEditMode && setNodesEditMode(nodesEditMode);
    setTreeEditMode(TreeEditModeEnum.ArrayTree);
    treeCarousel.current?.goTo(0);
    setActiveSortNode(undefined);
    reloadResponse && queryInterfaceResponse();
  };

  const handleSortTreeChecked: TreeProps['onCheck'] = (checkedKeys) => {
    setCheckedNodesData((state) => {
      state.pathKeyList = (checkedKeys as { checked: string[]; halfChecked: string[] }).checked;
    });
  };

  const handleSortTreeSelected: TreeProps['onSelect'] = (selectedKeys) => {
    const key = selectedKeys[0] as string;
    if (key) {
      setCheckedNodesData((state) => {
        const includes = state.pathKeyList.includes(key);
        state.pathKeyList = includes
          ? state.pathKeyList.filter((pathKey) => pathKey !== key)
          : [...state.pathKeyList, key];
      });
    }
  };

  return (
    <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
      <Col span={10}>
        <PathCollapse
          interfaceId={props.interfaceId}
          title={props.interfaceId ? undefined : 'Interfaces'}
          expandIcon={props.interfaceId ? () => <></> : undefined}
          loading={loadingOperationList}
          loadingPanel={loadingSortNode}
          interfaces={operationList}
          activeKey={activeOperationInterface?.id}
          activeCollapseKey={activeSortNode}
          sortNodes={sortNodeList}
          onEdit={handleEditCollapseItem}
          onChange={handleNodesCollapseClick}
          onEditResponse={handleEditResponse}
          onReloadNodes={querySortNode}
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
              <SpaceBetweenWrapper style={{ paddingBottom: '8px' }}>
                <h3>{TreeEditMode[treeEditMode]}</h3>
                {treeEditMode === TreeEditModeEnum.SortTree && (
                  <Space>
                    <Button size='small' onClick={() => handleCancelEditResponse()}>
                      {t('cancel')}
                    </Button>
                    <Button size='small' type='primary' onClick={handleSaveSort}>
                      {t('save')}
                    </Button>
                  </Space>
                )}
              </SpaceBetweenWrapper>

              <Card bodyStyle={{ padding: 0 }}>
                {Object.keys(interfaceResponseParsed).length ? (
                  <TreeCarousel ref={treeCarousel} beforeChange={(from, to) => setTreeEditMode(to)}>
                    <ArrayTree
                      title={activeOperationInterface?.operationName}
                      treeData={interfaceResponseParsed}
                      loading={loadingInterfaceResponse}
                      sortNodeList={sortNodeList}
                      onSelect={(selectedKeys) =>
                        handleEditCollapseItem(
                          selectedKeys[0] as string,
                          sortNodeList.find((node) => node.path === selectedKeys[0]),
                        )
                      }
                    />

                    {treeReady && (
                      <SortTree
                        title={checkedNodesData.path}
                        treeData={sortArray}
                        checkedKeys={checkedNodesData.pathKeyList}
                        onCheck={handleSortTreeChecked}
                        onSelect={handleSortTreeSelected}
                      />
                    )}
                  </TreeCarousel>
                ) : (
                  <EmptyResponse onClick={handleEditResponse} />
                )}
              </Card>
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
  );
};

export default SettingNodesSort;
