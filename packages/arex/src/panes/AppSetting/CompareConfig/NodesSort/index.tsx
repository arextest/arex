import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { css, PaneDrawer, SpaceBetweenWrapper, useTranslation } from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { App, Button, ButtonProps, Card, Collapse, Input, InputRef, List, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { CarouselRef } from 'antd/lib/carousel';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

import { CONFIG_TYPE } from '@/panes/AppSetting/CompareConfig';
import { ComparisonService } from '@/services';
import { SortNode } from '@/services/ComparisonService';

import CompareConfigTitle from '../CompareConfigTitle';
import ArrayTree from './ArrayTree';
import SortTree from './SortTree';
import TreeCarousel from './TreeCarousel';

enum TreeEditModeEnum {
  ArrayTree,
  SortTree,
}

const ActiveKey = 'sort';

export type NodesSortProps = {
  appId?: string;
  operationId?: string;
  dependencyId?: string;
  sortArrayPath?: string[];
  readOnly?: boolean;
  loadingContract?: boolean;
  configType: CONFIG_TYPE;
  contractParsed: { [key: string]: any };
  onAdd?: () => void;
  onClose?: () => void;
};

const NodesSort: FC<NodesSortProps> = (props) => {
  const { message } = App.useApp();
  const { t } = useTranslation(['components', 'common']);

  const searchRef = useRef<InputRef>(null);
  const treeCarouselRef = React.useRef<CarouselRef>(null);
  const [treeEditMode, setTreeEditMode] = useState<TreeEditModeEnum>(TreeEditModeEnum.ArrayTree);

  const [activeKey, setActiveKey] = useState<string | string[]>([ActiveKey]);
  const [search, setSearch] = useState<string | false>(false);
  const [sortArray, setSortArray] = useState<any[]>();
  const [activeSortNode, setActiveSortNode] = useState<SortNode>();

  const [checkedNodesData, setCheckedNodesData] = useImmer<{
    path?: string;
    pathKeyList: string[];
  }>({ pathKeyList: [] });

  // 控制 SortTree 组件防止在获取到有效的 treeData 数据前渲染，导致 defaultExpandAll 失效
  const [treeReady, setTreeReady] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);

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
      ComparisonService.querySortNode({
        appId: props.appId as string,
        operationId: props.operationId,
        dependencyId: props.configType === CONFIG_TYPE.DEPENDENCY ? props.dependencyId : undefined,
      }),
    {
      ready: !!(
        props.appId &&
        ((props.configType === CONFIG_TYPE.INTERFACE && props.operationId) || // INTERFACE ready
          (props.configType === CONFIG_TYPE.DEPENDENCY && props.dependencyId))
      ),
      refreshDeps: [props.configType, props.operationId, props.dependencyId],
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

  // 切换配置类型时清空数据
  useEffect(() => {
    setSortNodeList([]);
  }, [props.configType]);

  // 外部指定 sortArrayPath 时，直接打开第二层 TreeCarousel
  useEffect(() => {
    props.sortArrayPath && handleEditCollapseItem(props.sortArrayPath?.join('/') || '' + '/');
  }, [props.sortArrayPath, props.contractParsed]);

  const SaveSortNodeOptions = {
    manual: true,
    onSuccess(success: boolean) {
      if (success) {
        setOpenSortModal(false);
        querySortNode();
        treeCarouselRef.current?.goTo(0);
        message.success('Update successfully');
      } else {
        message.error('Update failed');
      }
    },
  };

  /**
   * 新增 SortNode
   */
  const { run: insertSortNode } = useRequest(ComparisonService.insertSortNode, SaveSortNodeOptions);

  /**
   * 更新 SortNode
   */
  const { run: updateSortNode } = useRequest(ComparisonService.updateSortNode, SaveSortNodeOptions);

  const handleSaveSort = () => {
    const params = {
      listPath: checkedNodesData?.path?.split('/').filter(Boolean) || [],
      keys: checkedNodesData.pathKeyList.map((key) => key?.split('/').filter(Boolean)),
    };
    if (activeSortNode) {
      updateSortNode({ id: activeSortNode.id, ...params });
    } else if (props.appId && props.operationId) {
      insertSortNode({
        ...params,
        appId: props.appId,
        operationId: props.operationId,
        dependencyId: props.configType === CONFIG_TYPE.DEPENDENCY ? props.dependencyId : undefined,
      });
    }
  };

  const sortNodesFiltered = useMemo(
    () =>
      typeof search === 'string' && search
        ? sortNodeList.filter((node) => node.path.toLowerCase().includes(search.toLowerCase()))
        : sortNodeList,
    [sortNodeList, search],
  );

  /**
   * 删除 SortNode
   */
  const { run: deleteSortNode } = useRequest(ComparisonService.deleteSortNode, {
    manual: true,
    onSuccess(success) {
      if (success) {
        querySortNode();
        message.success(t('message.delSuccess', { ns: 'common' }));
      } else {
        message.error(t('message.delFailed', { ns: 'common' }));
      }
    },
  });
  const handleSearch: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    setTimeout(() => searchRef.current?.focus());

    setSearch('');
  };

  const handleAddSortNode: ButtonProps['onClick'] = (e) => {
    activeKey?.[0] === ActiveKey && e.stopPropagation();
    props.onAdd?.();
    setOpenSortModal(true);
    // TODO empty construct tip
    // if (Object.keys(props.contractParsed).length) setOpenSortModal(true);
    // else message.info('empty response, please sync response first');
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

    try {
      handleSetSortArray(path);
    } catch (error) {
      console.warn('failed to analytic path');
    }

    setTreeEditMode(TreeEditModeEnum.SortTree);
    setOpenSortModal(true);
    setTreeReady(true);

    setTimeout(() => treeCarouselRef.current?.goTo(1)); // 防止初始化时 treeCarouselRef 未绑定
  };

  // 获取待排序操作的数组结构
  const handleSetSortArray = (key: string) => {
    let value: any = undefined;
    key
      .split('/')
      .filter(Boolean)
      .forEach((k, i) => {
        value = i === 0 ? props.contractParsed[k] : Array.isArray(value) ? value[0]?.[k] : value[k];
      });

    setSortArray(value);
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

  /**
   * 取消编辑 nodes sort
   */
  const handleCancelEdit = () => {
    props.onClose?.();
    setTreeEditMode(TreeEditModeEnum.ArrayTree);
    treeCarouselRef.current?.goTo(0);
    setActiveSortNode(undefined);
    setOpenSortModal(false);
  };

  return (
    <>
      <Collapse
        size='small'
        activeKey={activeKey}
        items={[
          {
            key: ActiveKey,
            label: (
              <CompareConfigTitle
                title='Nodes Sort'
                readOnly={props.readOnly}
                onSearch={handleSearch}
                onAdd={handleAddSortNode}
              />
            ),
            children: (
              <Card bordered={false} size='small' bodyStyle={{ padding: 0 }}>
                <List
                  size='small'
                  loading={loadingSortNode}
                  dataSource={sortNodesFiltered}
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
                  renderItem={(sortNode) => (
                    <List.Item>
                      <SpaceBetweenWrapper width={'100%'}>
                        <Typography.Text ellipsis>{sortNode.path}</Typography.Text>
                        <span style={{ flexShrink: 0 }}>
                          <span style={{ marginRight: '8px' }}>
                            {`${sortNode.pathKeyList.length} keys`}
                          </span>

                          {!props.readOnly && (
                            <div className='sort-node-list-item' style={{ display: 'inline' }}>
                              <Button
                                type='text'
                                size='small'
                                icon={<EditOutlined />}
                                onClick={() => handleEditCollapseItem(sortNode.path, sortNode)}
                              />
                              <Button
                                type='text'
                                size='small'
                                icon={<DeleteOutlined />}
                                onClick={() => deleteSortNode({ id: sortNode.id })}
                              />
                            </div>
                          )}
                        </span>
                      </SpaceBetweenWrapper>
                    </List.Item>
                  )}
                  locale={{ emptyText: t('appSetting.noSortNodes') }}
                />
              </Card>
            ),
          },
        ]}
        onChange={setActiveKey}
        css={css`
          .ant-collapse-content-box {
            padding: 0 !important;
          }
        `}
      />

      <PaneDrawer
        title={
          <SpaceBetweenWrapper>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {t('appSetting.nodesSort')}
            </Typography.Title>

            {treeEditMode === TreeEditModeEnum.SortTree && (
              <Button size='small' type='primary' onClick={handleSaveSort}>
                {t('save', { ns: 'common' })}
              </Button>
            )}
          </SpaceBetweenWrapper>
        }
        open={openSortModal}
        onClose={handleCancelEdit}
      >
        <TreeCarousel ref={treeCarouselRef} beforeChange={(from, to) => setTreeEditMode(to)}>
          <ArrayTree
            loading={props.loadingContract}
            treeData={props.contractParsed}
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
      </PaneDrawer>
    </>
  );
};

export default NodesSort;
