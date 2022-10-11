import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Card, Carousel, Col, message, Row } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import React, { FC, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImmer } from 'use-immer';

import { tryParseJsonString, tryPrettierJsonString } from '../../../../helpers/utils';
import AppSettingService from '../../../../services/AppSetting.service';
import { OperationInterface } from '../../../../services/AppSetting.type';
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

  const [activeOperationInterface, setActiveOperationInterface] = useState<OperationInterface>();
  const [activeCollapseKey, setActiveCollapseKey] = useState<string>();

  const [nodesEditMode, setNodesEditMode] = useState<NodesEditMode>(NodesEditMode.Tree);
  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.ArrayTree);

  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    [key: string]: // interface
    {
      [key: string]: // path
      string[];
    }; // sorted keys
  }>({});

  const [sortArray, setSortArray] = useState<any[]>();

  /**
   * 请求 InterfacesList
   */
  const { data: operationList = [] } = useRequest(AppSettingService.queryInterfacesList, {
    defaultParams: [{ id: props.appId }],
    onSuccess(res) {
      console.log(res);
    },
  });

  /**
   * 请求 InterfaceResponse
   */
  const { data: interfaceResponse, run: queryInterfaceResponse } = useRequest(
    () => AppSettingService.queryInterfaceResponse({ id: activeOperationInterface!.id }),
    {
      ready: !!activeOperationInterface?.id,
      refreshDeps: [activeOperationInterface],
      onSuccess(res) {
        console.log(res);
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
    setTreeEditMode(TreeEditModeEnum.ArrayTree);
    treeCarousel.current?.goTo(0);

    reloadResponse && queryInterfaceResponse();
  };

  /**
   *
   * @param checked
   */
  const handleSortTreeChecked = (checked: string[]) => {
    // TODO 将更新操作转移至 handleSaveSort
    activeOperationInterface &&
      activeCollapseKey &&
      setCheckedNodesData((state) => {
        if (!state[activeOperationInterface.id]) {
          state[activeOperationInterface.id] = {};
        }
        state[activeOperationInterface.id][activeCollapseKey] = checked;
      });
  };

  /**
   * handle click Collapse or PlusButton
   * @param operationInterface
   * @param maintain always expand panel
   */
  const handleNodesCollapseClick = (
    operationInterface?: OperationInterface,
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

  const handleEditCollapseItem = (key?: string) => {
    if (key) {
      setActiveCollapseKey(key);
      handleSetSortArray(key);
    }
    setNodesEditMode(NodesEditMode.Tree);
    setTreeEditMode(TreeEditModeEnum.SortTree);
    treeCarousel.current?.goTo(1);
  };

  const handleDeleteCollapseItem = (key: string) => {
    activeOperationInterface &&
      setCheckedNodesData((state) => {
        delete state[activeOperationInterface?.id][key];
      });
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

  const handleSaveSort = () => {
    // TODO 转移 handleSortTreeChecked 中的更新操作
    console.log(
      'handleSaveSort',
      activeOperationInterface?.operationName + '/' + activeCollapseKey,
      checkedNodesData[activeOperationInterface?.id || '']?.[activeCollapseKey || ''],
    );
  };

  return (
    <>
      <Row justify='space-between' style={{ margin: 0, flexWrap: 'nowrap' }}>
        <Col span={10}>
          <h3>Interfaces</h3>
          <PathCollapse
            interfaces={operationList}
            activeKey={activeOperationInterface?.id}
            activeCollapseKey={activeCollapseKey}
            checkedNodes={checkedNodesData}
            onEdit={handleEditCollapseItem}
            onChange={handleNodesCollapseClick}
            onEditResponse={handleEditResponse}
            onDelete={handleDeleteCollapseItem}
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
                    <Button
                      size='small'
                      onClick={handleSaveSort}
                      style={{
                        float: 'right',
                      }}
                    >
                      {t('save')}
                    </Button>
                  )}
                </SpaceBetweenWrapper>

                <Card bodyStyle={{ padding: 0 }}>
                  <TreeCarousel ref={treeCarousel} beforeChange={(from, to) => setTreeEditMode(to)}>
                    <div>
                      <ArrayTree
                        title={activeOperationInterface?.operationName}
                        treeData={interfaceResponseParsed}
                        selectedKeys={[activeCollapseKey as string]}
                        sortedKeys={checkedNodesData[activeOperationInterface?.id || '']}
                        onSelect={(selectedKeys, info) => {
                          // 选中待排序数组对象
                          handleEditCollapseItem(info.selectedNodes[0].key.toString());
                        }}
                      />
                    </div>

                    <div>
                      {activeCollapseKey && (
                        <SortTree
                          title={activeCollapseKey}
                          treeData={sortArray}
                          checkedKeys={
                            checkedNodesData[activeOperationInterface?.id || '']?.[
                              activeCollapseKey
                            ]
                          }
                          onCheck={(checkedKeys, info) =>
                            handleSortTreeChecked(
                              info.checkedNodes.map((node) => node.key.toString()),
                            )
                          }
                        />
                      )}
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
