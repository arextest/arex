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
import { type DirectoryTreeProps, EventDataNode } from 'antd/lib/tree';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CollectionSearchedList, {
  CollectionSearchedListRef,
} from '@/components/CollectionSelect/CollectionSearchedList';
import { CollectionNodeType, EMAIL_KEY } from '@/constant';
import { FileSystemService, ReportService } from '@/services';
import { CollectionType, PathInfo } from '@/services/FileSystemService';
import { useCollections, useWorkspaces } from '@/store';

import CollectionNodeTitle, { CollectionNodeTitleProps } from './CollectionNodeTitle';

const CollectionTree = styled(Tree<CollectionType>)`
  .ant-tree-node-selected {
    background-color: ${(props) => props.theme.colorPrimaryBgHover} !important;
  }
`;

export type CollectionTreeType = CollectionType<
  Partial<EventDataNode<CollectionType> & { pathInfo: PathInfo[] }>
>;
export interface CollectionSelectProps {
  readOnly?: boolean;
  height?: number;
  selectedKeys?: DirectoryTreeProps<CollectionTreeType>['selectedKeys'];
  menu?: React.ReactNode;
  expandable?: CollectionNodeType[];
  selectable?: CollectionNodeType[];
  onSelect?: (key: React.Key, node: CollectionTreeType) => void;
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
    collectionsTreeData,
    setExpandedKeys,
    addCollectionNode,
    moveCollectionNode,
  } = useCollections();

  const [activePose, setActivePos] = useState<number[]>([]);
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

  const handleSelect = (keys: string, node: CollectionTreeType) => {
    const infoId = node.infoId;
    setActiveKey(infoId);

    if (expandable?.includes(node.nodeType)) {
      setExpandedKeys(
        expandedKeys?.includes(infoId)
          ? expandedKeys.filter((key) => key !== infoId)
          : [...expandedKeys, infoId],
      );
    }
    props.onSelect?.(keys, node);
  };

  const handleClick = (node: CollectionTreeType) => {
    node.pos &&
      setActivePos(
        node.pos
          .split('-')
          .map((pos) => Number(pos))
          .slice(1) || [],
      );
  };

  const { run: createCollection } = useRequest(
    () =>
      FileSystemService.addCollectionItem({
        id: activeWorkspaceId,
        userName,
      }),
    {
      manual: true,
      onSuccess(res) {
        addCollectionNode({
          infoId: res.infoId,
          nodeType: CollectionNodeType.folder,
          nodeName: 'New Folder',
          pathOrIndex: [0],
        });
      },
    },
  );

  const onDrop = useCallback<NonNullable<DirectoryTreeProps<CollectionTreeType>['onDrop']>>(
    ({
      dragNode,
      node,
      dropPosition,
      /**
       * dropToGap 是一个布尔值，指示是否将拖拽节点放置在目标节点的 "间隙" 中。
       * 如果 dropToGap 为 true，表示将节点放置在目标节点的前或后。
       * 如果 dropToGap 为 false，表示将节点放置为目标节点的子节点。
       */
      dropToGap,
    }) => {
      const dragKey = dragNode.infoId;
      const dropKey = node.infoId;
      const dragPos = dragNode.pos.split('-').map(Number);
      const dropPos = node.pos.split('-').map(Number);

      /**
       * calculatedDropPosition 是一个数值，指示拖拽节点相对于目标节点的位置。
       * -1：放置在目标节点之前。
       * 0：放置为目标节点的子节点。
       * 1：放置在目标节点之后。
       */
      const calculatedDropPosition = dropPosition - dropPos[dropPos.length - 1];

      // console.log('原始：', dragPos, dropPos, dropToGap, calculatedDropPosition);

      // 修正 dropPosition
      const realDropPos = [...dropPos];
      if (!dropToGap) {
        if (realDropPos.length >= dragPos.length && realDropPos > dragPos) {
          // 跨层级向下拖拽，考虑到 dragNode 的占位, 与 drag 对齐的末尾 - 1
          realDropPos[dragPos.length - 1] = Math.max(realDropPos[dragPos.length - 1] - 1, 0);
        }

        realDropPos.push(0);
      } else if (calculatedDropPosition !== -1) {
        const dragPosCopy = [...dragPos];
        const dropPosCopy = [...dropPos];
        const lastDragPos = dragPosCopy.pop() || 0;
        const lastDropPos = dropPosCopy.pop() || 0;
        if (
          (dragPosCopy.join('-') === dropPosCopy.join('-') && lastDropPos < lastDragPos) ||
          dragPosCopy.join('-') !== dropPosCopy.join('-')
        ) {
          const lastDropPos = realDropPos.pop() || 0;
          realDropPos.push(lastDropPos + 1);
        }
      }

      // console.log('修正', dragPos, realDropPos);

      moveCollectionNode({
        dragPos,
        dropPos: realDropPos,
      });
    },
    [collectionsTreeData, moveCollectionNode],
  );

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys as string[]); // bugfix: 当子节点展开时，父节点无法关闭
  };

  const handleAddNode: CollectionNodeTitleProps['onAddNode'] = (infoId, nodeType) => {
    handleSelect(infoId, {
      infoId,
      nodeType,
      method: RequestMethodEnum.GET,
      nodeName: nodeType === CollectionNodeType.interface ? 'New Request' : 'case',
      caseSourceType: CollectionNodeType.case,
      labelIds: null,
      children: [],
    });
    setExpandedKeys([...(expandedKeys || []), infoId]);
  };

  return (
    <div className='collection-content-wrapper'>
      <EmptyWrapper
        loading={loading}
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
              showSearchButton='simple'
              labelDataSource={labelData.map((item) => ({
                id: item.id,
                name: item.labelName,
                color: item.color,
              }))}
              options={options}
              placeholder={'Search for Name'}
              onChange={setSearchValue}
              onSearch={() => collectionSearchedListRef.current?.search()}
              onCancel={() => {
                setSearchValue(undefined);
                setShowSearchInput(false);
                activeKey &&
                  setTimeout(() =>
                    treeRef.current?.scrollTo({ key: activeKey, align: 'top', offset: 64 }),
                  );
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
                onClick={() => {
                  setShowSearchInput(true);
                  setTimeout(() => searchRef.current?.focus());
                }}
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
              onSelect={handleSelect}
            />
          ) : (
            <CollectionTree
              showLine
              blockNode
              autoExpandParent={false}
              // @ts-ignore
              ref={treeRef}
              height={props.height}
              selectedKeys={props.selectedKeys}
              expandedKeys={expandedKeys}
              switcherIcon={<DownOutlined />}
              treeData={collectionsTreeData}
              fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
              onDrop={onDrop}
              onExpand={onExpand}
              onSelect={(keys, data) => {
                const classList = (
                  (data.nativeEvent?.target as HTMLElement)?.parentNode as HTMLElement
                )?.classList as DOMTokenList;
                const clickFromMenu =
                  classList?.contains('node-menu-icon') || classList?.contains('node-menu');
                if (clickFromMenu) return;

                keys.length && handleSelect(keys[0].toString(), data.node);
              }}
              onClick={(e, node) => handleClick(node)}
              draggable={!props.readOnly && { icon: false }}
              titleRender={(data) => (
                <CollectionNodeTitle
                  data={data}
                  pos={activePose}
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
