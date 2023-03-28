import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { App, Card, Carousel, Col, Modal, Row } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { TreeProps } from 'antd/lib/tree';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { tryParseJsonString, tryPrettierJsonString } from '../../../helpers/utils';
import AppSettingService from '../../../services/AppSetting.service';
import { OperationInterface, SortNode } from '../../../services/AppSetting.type';
import { FileSystemService } from '../../../services/FileSystem.service';
import { EditAreaPlaceholder, SpaceBetweenWrapper } from '../../styledComponents';
import EmptyResponse from '../NodesIgnore/EmptyResponse';
import PathCollapseHeader from '../NodesIgnore/PathCollapseHeader';
import ResponseRaw from '../NodesIgnore/ResponseRaw';
import ActionButton from './ActionButton';
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
  modalTree?: boolean; // Modal 模式
  appId?: string; // 在 AppSetting 中设置
  // 以下 props 不应与上面 props 同时定义
  interfaceId?: string; // 在 Request 中设置
  operationId?: string | null; // 在 Request 中设置
};

export type SettingNodesSortRef = {
  onEditResponse: (operationInterface?: OperationInterface<'Interface'>) => void;
  getOperationResponse: () => string | undefined | null;
};

const SettingNodesSort = forwardRef<SettingNodesSortRef, SettingNodesSortProps>((props, ref) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const TreeEditMode = useMemo(() => {
    return [t('appSetting.arrayTree'), t('appSetting.sortTree')];
  }, []);

  const treeCarousel = useRef<CarouselRef>(null);

  const DefaultInterface: OperationInterface<'Interface'> = {
    id: props.interfaceId || '',
    operationName: 'NodeSort',
  };

  const [activeOperationInterface, setActiveOperationInterface] = useState<
    OperationInterface<'Interface'> | undefined
  >(props.interfaceId ? DefaultInterface : undefined);
  const [activeSortNode, setActiveSortNode] = useState<SortNode>();
  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    path?: string;
    pathKeyList: string[];
  }>({ pathKeyList: [] });

  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);
  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.ArrayTree);

  // Interfaces search keyword
  const [keyword, setKeyword] = useState<string | boolean>(false);

  const [sortArray, setSortArray] = useState<any[]>();

  const [rawResponse, setRawResponse] = useState<string>();

  // 控制 SortTree 组件防止在获取到有效的 treeData 数据前渲染，导致 defaultExpandAll 失效
  const [treeReady, setTreeReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * 请求 InterfacesList
   */
  const {
    data: operationList = props.appId ? [] : [DefaultInterface],
    loading: loadingOperationList,
  } = useRequest(
    () => AppSettingService.queryInterfacesList<'Interface'>({ id: props.appId as string }),
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

  /**
   * 获取 SortNode
   */
  const {
    data: sortNodeList = [],
    loading: loadingSortNode,
    run: querySortNode,
    mutate: setSortNodeList,
  } = useRequest(
    (listPath?: string[]) =>
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
      onSuccess(res, [listPath]) {
        // 新增 SortNode 时设置 activeSortNode, 防止继续新增
        if (listPath) {
          const pathKey = listPath.join('_');
          // 获取新增的 node
          const node = res.find((node) => node.listPath.join('_') === pathKey);
          node && setActiveSortNode(node);
        }
        // 由于增量调用，取消状态重置
        // props.appId && handleCancelEditResponse(false, false);
      },
    },
  );

  /**
   * 新增 SortNode
   */
  const { run: insertSortNode } = useRequest(AppSettingService.insertSortNode, {
    manual: true,
    onSuccess(success: boolean, [params]) {
      if (success) {
        // 将新增的 node 设置为 activeNode
        querySortNode(params.listPath);
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  /**
   * 更新 SortNode
   */
  const { run: updateSortNode } = useRequest(AppSettingService.updateSortNode, {
    manual: true,
    onSuccess(success: boolean) {
      if (success) {
        querySortNode();
        message.success(t('message.updateSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.updateFailed', { ns: 'common' }));
      }
    },
  });

  // 保存方式更改为增量式调用
  const handleSaveSort = (data: typeof checkedNodesData) => {
    const params = {
      listPath: data?.path?.split('/').filter(Boolean) || [],
      keys: data.pathKeyList.map((key) => key?.split('/').filter(Boolean)),
    };

    if (activeSortNode) {
      updateSortNode({ id: activeSortNode.id, ...params });
    } else if (activeOperationInterface?.id) {
      insertSortNode({
        ...params,
        appId: props.appId,
        operationId: activeOperationInterface?.id,
        compareConfigType: props.interfaceId && '1',
        fsInterfaceId: props.interfaceId,
      });
    }

    setModalOpen(false);
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
      // @ts-ignore
      props.interfaceId
        ? FileSystemService.queryInterface({ id: props.interfaceId })
        : AppSettingService.queryInterfaceResponse({
            id: activeOperationInterface?.id as string,
          }),
    {
      ready: !!activeOperationInterface?.id,
      refreshDeps: [activeOperationInterface],
      onBefore() {
        setInterfaceResponse(undefined);
        setTreeReady(false);
      },
      onSuccess(res) {
        setRawResponse(tryPrettierJsonString(res?.operationResponse || ''));
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
  const { run: updateInterfaceResponse } = useRequest(
    (params) =>
      props.interfaceId
        ? FileSystemService.saveInterface(params)
        : AppSettingService.updateInterfaceResponse(params),
    {
      manual: true,
      onSuccess(success) {
        if (success) {
          queryInterfaceResponse();
          message.success(t('message.updateSuccess', { ns: 'common' }));
        } else {
          message.error(t('message.updateFailed', { ns: 'common' }));
        }
      },
    },
  );

  useImperativeHandle(
    ref,
    () => ({
      onEditResponse: handleEditResponse,
      getOperationResponse: () => interfaceResponse?.operationResponse,
    }),
    [interfaceResponse],
  );

  /**
   * 开始编辑某个 interface 的 response
   * @param operationInterface
   */
  const handleEditResponse = (operationInterface?: OperationInterface<'Interface'>) => {
    operationInterface && setActiveOperationInterface(operationInterface);
    setNodesEditMode(NodesEditMode.Raw);
    setModalOpen(true);
  };

  /**
   * 保存某个 interface 的 response
   */
  const handleResponseSave = () => {
    const parsed = rawResponse && tryParseJsonString(rawResponse, 'Invalid JSON');
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
    maintain && setModalOpen(true); // action for {Add Sort Key}
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

    setModalOpen(true);
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
    setModalOpen(false);
  };

  const handleSortTreeChecked: TreeProps['onCheck'] = (checkedKeys) => {
    console.log({ checkedKeys });
    setCheckedNodesData((state) => {
      state.pathKeyList = (checkedKeys as { checked: string[]; halfChecked: string[] }).checked;

      handleSaveSort(state);
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

        handleSaveSort(state);
      });
    }
  };

  return (
    <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
      <Col span={props.modalTree ? 24 : 10}>
        <PathCollapse
          interfaceId={props.interfaceId}
          title={
            props.interfaceId ? undefined : (
              <PathCollapseHeader
                search={keyword}
                onChange={(search) => setKeyword(search ? '' : search)}
                onSearch={setKeyword}
              />
            )
          }
          height={'calc(100vh - 168px)'}
          loading={loadingOperationList}
          loadingPanel={loadingSortNode}
          interfaces={operationListFiltered}
          activeKey={activeOperationInterface?.id}
          activeCollapseKey={activeSortNode}
          sortNodes={sortNodeList}
          onEdit={handleEditCollapseItem}
          onChange={handleNodesCollapseClick}
          onEditResponse={handleEditResponse}
          onReloadNodes={querySortNode}
        />
      </Col>

      <Col span={props.modalTree ? 0 : 13}>
        {React.createElement(
          props.modalTree ? Modal : 'div',
          {
            open: modalOpen,
            onCancel: () => setModalOpen(false),
            onOk() {
              handleResponseSave();
            },
            // footer: (
            //   <ActionButton
            //     onSave={nodesEditMode === NodesEditMode.Tree ? handleSaveSort : handleResponseSave}
            //     onCancel={handleCancelEditResponse}
            //   />
            // ),
          },
          <EditAreaPlaceholder
            dashedBorder
            title={t('appSetting.editArea')}
            ready={!!activeOperationInterface}
          >
            {nodesEditMode === NodesEditMode.Tree ? (
              <>
                <SpaceBetweenWrapper style={{ paddingBottom: '8px' }}>
                  <h3>{TreeEditMode[treeEditMode]}</h3>
                  {/*{treeEditMode === TreeEditModeEnum.SortTree && !props.modalTree && (*/}
                  {/*  <ActionButton*/}
                  {/*    small*/}
                  {/*    onSave={handleSaveSort}*/}
                  {/*    onCancel={handleCancelEditResponse}*/}
                  {/*  />*/}
                  {/*)}*/}
                </SpaceBetweenWrapper>

                <Card bodyStyle={{ padding: 0 }}>
                  {Object.keys(interfaceResponseParsed).length ? (
                    <TreeCarousel
                      ref={treeCarousel}
                      beforeChange={(from, to) => setTreeEditMode(to)}
                    >
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
                hiddenAction={!!props.interfaceId}
                value={rawResponse}
                onChange={setRawResponse}
                onSave={handleResponseSave}
                onCancel={handleCancelEditResponse}
              />
            )}
          </EditAreaPlaceholder>,
        )}
      </Col>
    </Row>
  );
});

export default SettingNodesSort;
