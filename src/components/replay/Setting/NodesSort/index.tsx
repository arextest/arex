import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Card, Carousel, Col, message, Row, Space } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { TreeProps } from 'antd/lib/tree';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { tryParseJsonString, tryPrettierJsonString } from '../../../../helpers/utils';
import AppSettingService from '../../../../services/AppSetting.service';
import { OperationInterface, SortNode } from '../../../../services/AppSetting.type';
import { EditAreaPlaceholder, SpaceBetweenWrapper } from '../../../styledComponents';
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
      background-color: ${(props) => props.theme.color.text.disabled}!important;
    }
    * > li.slick-active > button {
      background-color: ${(props) => props.theme.color.text.watermark}!important;
    }
  }
`;

const NodesSort: FC<{ appId: string }> = (props) => {
  const { t } = useTranslation('common');

  const treeCarousel = useRef<CarouselRef>(null);

  const [activeOperationInterface, setActiveOperationInterface] =
    useState<OperationInterface<'Interface'>>();
  const [activeSortNode, setActiveSortNode] = useState<SortNode>();
  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    path?: string;
    pathKeyList: string[];
  }>({ pathKeyList: [] });

  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);
  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.ArrayTree);

  const [sortArray, setSortArray] = useState<any[]>();

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [], loading: loadingOperationList } = useRequest(() =>
    AppSettingService.queryInterfacesList<'Interface'>({ id: props.appId }),
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
      AppSettingService.querySortNode({
        appId: props.appId,
        operationId: activeOperationInterface!.id,
      }),
    {
      ready: !!activeOperationInterface,
      refreshDeps: [activeOperationInterface?.id],
      onBefore() {
        setSortNodeList([]);
      },
      onSuccess() {
        handleCancelEditResponse();
      },
    },
  );

  /**
   * 更新 SortNode
   */
  const { run: insertSortNode } = useRequest(AppSettingService.insertSortNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        querySortNode();
        treeCarousel.current?.goTo(0);
        message.success('Update successfully');
      } else {
        message.error('Update failed');
      }
    },
  });

  /**
   * 获取 InterfaceResponse
   */
  const {
    data: interfaceResponse,
    run: queryInterfaceResponse,
    loading: loadingInterfaceResponse,
  } = useRequest(
    () => AppSettingService.queryInterfaceResponse({ id: activeOperationInterface!.id }),
    {
      ready: !!activeOperationInterface?.id,
      refreshDeps: [activeOperationInterface],
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
  const handleEditResponse = (operationInterface: OperationInterface<'Interface'>) => {
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
  };

  // 获取待排序操作的数组结构
  const handleSetSortArray = (key: string) => {
    let value: any = undefined;
    key
      .split('/')
      .filter(Boolean)
      .forEach((k, i) => {
        value = i === 0 ? interfaceResponseParsed[k] : value[k];
      });

    setSortArray(value);
  };

  /**
   * 取消编辑 response
   * @param reloadResponse 是否重新加载 interfaceResponse
   */
  const handleCancelEditResponse = (reloadResponse?: boolean) => {
    setNodesEditMode(NodesEditMode.Tree);
    setTreeEditMode(TreeEditModeEnum.ArrayTree);
    treeCarousel.current?.goTo(0);
    setActiveSortNode(undefined);
    reloadResponse && queryInterfaceResponse();
  };

  const handleSortTreeChecked: TreeProps['onCheck'] = (checkedKeys) => {
    setCheckedNodesData((state) => {
      state.pathKeyList = checkedKeys as string[];
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

  const handleSaveSort = () => {
    // TODO 1.区分 insert 和 update, 2. 添加 loading 状态
    if (activeOperationInterface) {
      insertSortNode({
        appId: props.appId,
        operationId: activeOperationInterface.id,
        listPath: checkedNodesData?.path?.split('/').filter(Boolean) || [],
        keys: checkedNodesData.pathKeyList.map((key) => key?.split('/').filter(Boolean)),
      });
    }
  };

  return (
    <>
      <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={10}>
          <PathCollapse
            title='Interfaces'
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
                  <TreeCarousel ref={treeCarousel} beforeChange={(from, to) => setTreeEditMode(to)}>
                    <div>
                      <ArrayTree
                        title={activeOperationInterface?.operationName}
                        treeData={interfaceResponseParsed}
                        loading={loadingInterfaceResponse}
                        sortNodeList={sortNodeList}
                        onSelect={(selectedKeys) => {
                          handleEditCollapseItem(
                            selectedKeys[0] as string,
                            sortNodeList.find((node) => node.path === selectedKeys[0]),
                          );
                        }}
                      />
                    </div>

                    <div>
                      <SortTree
                        title={checkedNodesData.path}
                        treeData={sortArray}
                        checkedKeys={checkedNodesData.pathKeyList}
                        onCheck={handleSortTreeChecked}
                        onSelect={handleSortTreeSelected}
                      />
                    </div>
                  </TreeCarousel>
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
    </>
  );
};

export default NodesSort;
