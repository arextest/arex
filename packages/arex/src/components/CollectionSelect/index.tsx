import { DownOutlined } from '@ant-design/icons';
import {
  CategoryKey,
  css,
  EmptyWrapper,
  getLocalStorage,
  Operator,
  RequestMethodEnum,
  SearchDataType,
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
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CollectionSearchedList from '@/components/CollectionSelect/CollectionSearchedList';
import { CollectionNodeType, EMAIL_KEY, MenusType, PanesType } from '@/constant';
import { FileSystemService, ReportService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
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
  const { activePane, setActiveMenu } = useMenusPanes();
  const {
    loading,
    collectionsTreeData,
    collectionsFlatData,
    getCollections,
    getPath,
    moveCollectionNode,
  } = useCollections();

  const searchRef = useRef<StructuredFilterRef>(null);

  const [searchValue, setSearchValue] = useState<SearchDataType>();
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [expandedKeys, setExpandedKeys] = useState<string[]>(); // TODO 初始化展开的节点

  // auto expand by active pane id
  useEffect(() => {
    if (activePane && activePane.type === PanesType.REQUEST) {
      const [workspaceId, nodeTypeStr, id] = activePane.id.split('-');
      setActiveMenu(MenusType.COLLECTION);

      if (workspaceId !== activeWorkspaceId) {
        getCollections({ workspaceId, infoId: id, nodeType: parseInt(nodeTypeStr) }).then(() =>
          setExpandedKeys([...getPath(id).map((item) => item.id)]),
        );
      } else {
        const path = getPath(id).map((item) => item.id);
        setExpandedKeys((expand) => [...(expand || []), ...path]);
      }
    }
  }, [activePane]);

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
      Array.from(collectionsFlatData).map(([key, value]) => ({
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
    if (expandable?.includes(info.node.nodeType)) {
      setExpandedKeys((expandedKeys) => {
        return expandedKeys?.includes(info.node.infoId)
          ? expandedKeys.filter((key) => key !== info.node.infoId)
          : [...(expandedKeys || []), info.node.infoId];
      });
    }
    props.onSelect?.(keys, info.node);
  };

  const handleChange = (value: SearchDataType) => {
    const { keyword, structuredValue = [] } = value;
    let newExpandedKeys;
    if (!structuredValue?.length && !keyword) {
      // newExpandedKeys = dataList.map((item) => item.title);
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

          return keywordFiltered && structuredFiltered
            ? collectionsFlatData.get(item.key)?.pid
            : null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      setExpandedKeys(newExpandedKeys as string[]);
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
        empty={!loading && !collectionsTreeData.length}
        description={
          <Button type='primary' onClick={createCollection}>
            {t('collection.create_new')}
          </Button>
        }
      >
        <StructuredFilter
          size='small'
          className='collection-header-search'
          // @ts-ignore
          ref={searchRef}
          showSearchButton={false}
          prefix={props.menu}
          labelDataSource={labelData.map((item) => ({
            id: item.id,
            name: item.labelName,
            color: item.color,
          }))}
          options={options}
          // placeholder={'Search for Name'}
          onChange={handleChange}
        />
        <ConfigProvider theme={{ token: { motion: false } }}>
          {searchValue?.keyword || searchValue?.structuredValue?.length ? (
            <CollectionSearchedList
              height={props.height}
              workspaceId={activeWorkspaceId}
              searchValue={searchValue}
              onSelect={(keys, data) => {
                getCollections({
                  workspaceId: activeWorkspaceId,
                  infoId: keys[0].toString(),
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
              height={props.height}
              selectedKeys={props.selectedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              switcherIcon={<DownOutlined />}
              treeData={collectionsTreeData}
              loadData={handleLoadData}
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
            />
          )}
        </ConfigProvider>
      </EmptyWrapper>
    </div>
  );
};

export default CollectionSelect;
