import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import {
  CategoryKey,
  css,
  EmptyWrapper,
  getLocalStorage,
  Operator,
  RequestMethodEnum,
  SearchDataType,
  SpaceBetweenWrapper,
  StructuredFilter,
  styled,
  useTranslation,
} from '@arextest/arex-core';
import { StructuredFilterRef } from '@arextest/arex-core/src/components/StructuredFilter';
import { useRequest } from 'ahooks';
import { Button, ConfigProvider, Tag, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import { cloneDeep } from 'lodash';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import CollectionSearchedList, {
  CollectionSearchedListRef,
} from '@/components/CollectionSelect/CollectionSearchedList';
import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService, ReportService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useWorkspaces } from '@/store';
import { negate } from '@/utils';

import CollectionNodeTitle, { CollectionNodeTitleProps } from './CollectionNodeTitle';

const CollectionTree = styled(Tree<CollectionType>)`
  .ant-tree-node-selected {
    background-color: ${(props) => props.theme.colorPrimaryBgHover} !important;
  }
`;

export type CollectionTreeType = CollectionType & DataNode;
export interface CollectionSelectProps {
  readOnly?: boolean;
  height?: number;
  selectedKeys?: DirectoryTreeProps<CollectionTreeType>['selectedKeys'];
  menu?: React.ReactNode;
  expandable?: CollectionNodeType[];
  selectable?: CollectionNodeType[];
  onSelect?: (key: React.Key[], node: CollectionTreeType) => void;
}
const CollectionSelect: FC<CollectionSelectProps> = (props) => {
  const {
    expandable = [CollectionNodeType.folder, CollectionNodeType.interface, CollectionNodeType.case],
  } = props;
  const { t } = useTranslation(['components']);

  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const { activeWorkspaceId } = useWorkspaces();
  const {
    loading,
    expandedKeys,
    loadedKeys,
    collectionsTreeData,
    collectionsFlatData,
    setExpandedKeys,
    setLoadedKeys,
    getCollections,
    getPath,
    moveCollectionNode,
  } = useCollections();

  const searchRef = useRef<StructuredFilterRef>(null);
  const collectionSearchedListRef = useRef<CollectionSearchedListRef>(null);
  const treeRef = useRef<{
    scrollTo: (params: {
      key: string | number;
      align?: 'top' | 'bottom' | 'auto';
      offset?: number;
    }) => void;
  }>(null);

  const [searchValue, setSearchValue] = useState<SearchDataType>();
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [activeKey, setActiveKey] = useState<string>();

  const [showSearchInput, setShowSearchInput] = useState(false);

  const searching = useMemo(
    () => !!searchValue?.keyword || !!searchValue?.structuredValue?.length,
    [searchValue],
  );

  const { data: labelData = [] } = useRequest(
    () => ReportService.queryLabels({ workspaceId: activeWorkspaceId }),
    {
      ready: !!activeWorkspaceId,
      refreshDeps: [activeWorkspaceId],
    },
  );

  const handleLoadData: TreeProps<CollectionType>['loadData'] = (treeNode) =>
    new Promise<void>((resolve) =>
      resolve(
        getCollections({
          workspaceId: activeWorkspaceId,
          parentIds: getPath(treeNode.infoId).map((item) => item.id),
        }),
      ),
    );

  const dataList: { key: string; title: string; labelIds: string | null }[] = useMemo(
    () =>
      Object.entries(collectionsFlatData).map(([key, value]) => ({
        key,
        title: value.nodeName,
        labelIds: value.labelIds,
      })),
    [collectionsFlatData],
  );

  const options = useMemo(
    () => [
      {
        category: CategoryKey.Label,
        operator: [Operator.EQ, Operator.NE],
        value: labelData.map((label) => ({
          label: (
            <Tag
              color={label.color}
              css={css`
                height: 16px;
                line-height: 16px;
              `}
            >
              {label.labelName}
            </Tag>
          ),
          key: label.id,
        })),
      },
    ],
    [labelData],
  );

  const handleSelect: DirectoryTreeProps<CollectionTreeType>['onSelect'] = (keys, info) => {
    const infoId = info.node.infoId;
    if (expandable?.includes(info.node.nodeType)) {
      setExpandedKeys(
        expandedKeys?.includes(infoId)
          ? expandedKeys.filter((key) => key !== infoId)
          : [...expandedKeys, infoId],
      );
    }
    setActiveKey(infoId);
    props.onSelect?.(keys, info.node);
  };

  const handleChange = (value: SearchDataType) => {
    const { keyword, structuredValue = [] } = value;
    let newExpandedKeys;
    if (!structuredValue?.length && !keyword) {
      // TODO: 以事件驱动滚动，防止滚动到未加载的节点
      activeKey && treeRef.current?.scrollTo({ key: activeKey, align: 'top', offset: 64 });
      activeKey && setExpandedKeys([...expandedKeys, ...getPath(activeKey).map((item) => item.id)]);
    } else {
      newExpandedKeys = dataList
        .map((item) => {
          const lowerCaseKeyword = keyword?.toLowerCase() || '';
          const keywordFiltered =
            !keyword ||
            (lowerCaseKeyword &&
              (item.title.toLowerCase().includes(lowerCaseKeyword) ||
                item.key.toLowerCase().includes(lowerCaseKeyword)));
          let structuredFiltered = true;

          for (let i = 0; i < structuredValue.length; i++) {
            const structured = structuredValue[i];

            if (structured.category === CategoryKey.Label) {
              // search for labelIds
              const include = negate(
                item.labelIds?.includes(structured.value as string),
                structured.operator === Operator.NE,
              );

              if (!include) {
                structuredFiltered = false;
                break;
              }
            }
          }
          return keywordFiltered && structuredFiltered ? collectionsFlatData[item.key]?.pid : null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setExpandedKeys([...expandedKeys, ...(newExpandedKeys as string[])]);
    }
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const { run: createCollection } = useRequest(
    () =>
      FileSystemService.addCollectionItem({
        id: activeWorkspaceId,
        userName,
      }),
    {
      manual: true,
      onSuccess() {
        getCollections();
      },
    },
  );

  const onDrop = useCallback<NonNullable<DirectoryTreeProps<CollectionTreeType>['onDrop']>>(
    (info) => {
      const dragKey = info.dragNode.infoId;
      const dropKey = info.node.infoId;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

      const dragNodeType = info.dragNode.nodeType;
      let dropNodeType = CollectionNodeType.folder;
      // let dragTree = cloneDeep(collectionsTreeData);
      let nodeTree = cloneDeep(collectionsTreeData);

      dropPos.slice(1, info.dropToGap ? -1 : undefined).forEach((p) => {
        const index = Number(p);
        dropNodeType = nodeTree[index].nodeType;
        nodeTree = nodeTree[index].children;
      });

      /**
       * 校验拖拽节点是否合规
       * 节点拖动规则:
       * 1. CollectionNodeType.folder 只能直属于 CollectionNodeType.folder
       * 2. CollectionNodeType.interface 只能直属于 CollectionNodeType.folder
       * 3. CollectionNodeType.case 只能直属于 CollectionNodeType.interface
       */
      if (
        (dragNodeType === CollectionNodeType.folder &&
          dropNodeType !== CollectionNodeType.folder) ||
        (dragNodeType === CollectionNodeType.interface &&
          // @ts-ignore
          dropNodeType !== CollectionNodeType.folder) ||
        // @ts-ignore
        (dragNodeType === CollectionNodeType.case && dropNodeType !== CollectionNodeType.interface)
      )
        return console.error('Dragging nodes is not compliant');

      moveCollectionNode(dragKey, dropKey, info.dropToGap, dropPosition);
    },
    [collectionsTreeData, moveCollectionNode],
  );

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys as string[]);
    setAutoExpandParent(false);
  };

  const handleAddNode: CollectionNodeTitleProps['onAddNode'] = (infoId, nodeType) => {
    handleSelect([infoId], {
      // @ts-ignore
      node: {
        infoId,
        nodeType,
        method: RequestMethodEnum.GET,
      },
    });
    setExpandedKeys([...(expandedKeys || []), infoId]);
  };

  return (
    <div className='collection-content-wrapper'>
      <EmptyWrapper
        empty={!loading && !collectionsTreeData?.length}
        description={
          <Button type='primary' onClick={createCollection}>
            {t('collection.create_new')}
          </Button>
        }
      >
        <div>
          {!props.menu || showSearchInput ? (
            <StructuredFilter
              size='small'
              className='collection-header-search'
              key='search-input'
              // @ts-ignore
              ref={searchRef}
              showSearchButton={'simple'}
              labelDataSource={labelData.map((item) => ({
                id: item.id,
                name: item.labelName,
                color: item.color,
              }))}
              options={options}
              placeholder={'Search for Name'}
              onChange={handleChange}
              onSearch={() => collectionSearchedListRef.current?.search()}
              onCancel={() => {
                setSearchValue(undefined);
                setShowSearchInput(false);
              }}
            />
          ) : (
            <SpaceBetweenWrapper style={{ margin: '3.5px 0' }}>
              <div>{props.menu}</div>
              <Button
                type='text'
                size='small'
                key='menus'
                icon={<SearchOutlined />}
                onClick={() => setShowSearchInput(true)}
              />
            </SpaceBetweenWrapper>
          )}
        </div>

        <ConfigProvider theme={{ token: { motion: false } }}>
          {searching ? (
            <CollectionSearchedList
              ref={collectionSearchedListRef}
              height={props.height}
              workspaceId={activeWorkspaceId}
              searchValue={searchValue}
              onSelect={(keys, data) => {
                const infoId = keys[0].toString();
                getCollections({
                  workspaceId: activeWorkspaceId,
                  infoId,
                  nodeType: data.node.nodeType,
                }).then(() => {
                  handleSelect(keys, data);
                });
              }}
            />
          ) : (
            <CollectionTree
              showLine
              blockNode
              // @ts-ignore
              ref={treeRef}
              height={props.height}
              selectedKeys={props.selectedKeys}
              loadedKeys={loadedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              switcherIcon={<DownOutlined />}
              treeData={collectionsTreeData}
              loadData={handleLoadData}
              onLoad={(keys) => {
                setLoadedKeys([...loadedKeys, ...(keys as string[])]);
              }}
              fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
              onDrop={onDrop}
              onExpand={onExpand}
              onSelect={handleSelect}
              draggable={!props.readOnly && { icon: false }}
              titleRender={(data) => (
                <CollectionNodeTitle
                  data={data}
                  readOnly={props.readOnly}
                  keyword={searchValue?.keyword}
                  onAddNode={handleAddNode}
                  selectable={props.selectable}
                />
              )}
              onDragLeave={({ event, node }) => {
                // auto scroll when drag to edge
                if (event.clientY < 120) {
                  treeRef.current?.scrollTo({ key: node.infoId, align: 'top', offset: 48 });
                } else if (event.clientY > (props.height || 0) + 100) {
                  treeRef.current?.scrollTo({ key: node.infoId, align: 'bottom', offset: 48 });
                }
              }}
            />
          )}
        </ConfigProvider>
      </EmptyWrapper>
    </div>
  );
};

export default CollectionSelect;
