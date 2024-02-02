import { DownOutlined } from '@ant-design/icons';
import {
  CategoryKey,
  EmptyWrapper,
  getLocalStorage,
  Operator,
  RequestMethodEnum,
  SearchDataType,
  StructuredFilter,
  styled,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest } from 'ahooks';
import { Button, ConfigProvider, Tag, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import { cloneDeep } from 'lodash';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY, MenusType, PanesType } from '@/constant';
import { FileSystemService, ReportService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
import { negate } from '@/utils';
import treeFilter from '@/utils/treeFilter';

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
  onSelect?: DirectoryTreeProps<CollectionTreeType>['onSelect'];
}
const CollectionSelect: FC<CollectionSelectProps> = (props) => {
  const {
    expandable = [CollectionNodeType.folder, CollectionNodeType.interface, CollectionNodeType.case],
  } = props;
  const { t } = useTranslation(['components']);

  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const { activeWorkspaceId } = useWorkspaces();
  const { activePane, setActiveMenu, reset: resetPane } = useMenusPanes();
  const { loading, collectionsTreeData, collectionsFlatData, getCollections, getPath } =
    useCollections();

  const [searchValue, setSearchValue] = useState<SearchDataType>();
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [expandedKeys, setExpandedKeys] = useState<string[]>(); // TODO 初始化展开的节点

  useEffect(() => {
    getCollections();
  }, []);

  // auto expand by active pane id
  useEffect(() => {
    if (activePane && activePane.type === PanesType.REQUEST) {
      const [workspaceId, nodeTypeStr, id] = activePane.id.split('-');
      const path = getPath(id).map((item) => item.id);
      setActiveMenu(MenusType.COLLECTION);
      setExpandedKeys((expand) => [...(expand || []), ...path]);
    }
  }, [activePane]);

  const { data: labelData = [] } = useRequest(
    () => ReportService.queryLabels({ workspaceId: activeWorkspaceId }),
    {
      ready: !!activeWorkspaceId,
      refreshDeps: [activeWorkspaceId],
    },
  );

  const filterTreeData = useMemo(
    // filter nodeType === 3 是为了隐藏第一层级只显示文件夹类型（由于新增请求时会新增一个临时的request到树形目录的第一层）
    // TODO filter 逻辑待优化
    () =>
      searchValue?.keyword
        ? treeFilter(searchValue.keyword, cloneDeep(collectionsTreeData), 'nodeName')
        : collectionsTreeData,
    [collectionsTreeData, searchValue?.keyword],
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
          label: <Tag color={label.color}>{label.labelName}</Tag>,
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
    props.onSelect?.(keys, info);
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

  const { run: move } = useRequest(FileSystemService.moveCollectionItem, {
    manual: true,
    onSuccess(success) {
      success && getCollections();
    },
  });

  const onDrop = useCallback<NonNullable<DirectoryTreeProps<CollectionTreeType>['onDrop']>>(
    (value) => {
      /**
       * 节点拖动规则:
       * 1. CollectionNodeType.folder 只能直属于 CollectionNodeType.folder
       * 2. CollectionNodeType.request 只能直属于 CollectionNodeType.folder
       * 3. CollectionNodeType.case 只能直属于 CollectionNodeType.request
       */
      const dragNodeType = value.dragNode.nodeType;
      let parentNodeType = CollectionNodeType.folder;

      const dragPos = value.dragNode.pos
        .split('-')
        .slice(1) // remove root node
        .map((p) => Number(p));
      const nodePos = value.node.pos
        .split('-')
        .slice(1) // remove root node
        .map((p) => Number(p));

      let dragTree = cloneDeep(collectionsTreeData);
      let nodeTree = cloneDeep(collectionsTreeData);
      const fromNodePath: string[] = [];
      const toParentPath: string[] = [];
      let toIndex = value.dropPosition;

      dragPos.forEach((p) => {
        fromNodePath.push(dragTree[p].infoId);
        dragTree = dragTree[p].children;
      });

      nodePos.forEach((p) => {
        toParentPath.push(nodeTree[p].infoId);
        parentNodeType = nodeTree[p].nodeType;
        nodeTree = nodeTree[p].children;
      });

      // console.log(value);
      // console.log(dragNodeType, parentNodeType);
      // 校验拖拽节点是否合规: 3,3 || 1,3 || 2,1

      if (
        (dragNodeType === CollectionNodeType.folder &&
          parentNodeType !== CollectionNodeType.folder) ||
        (dragNodeType === CollectionNodeType.interface &&
          // @ts-ignore
          parentNodeType === CollectionNodeType.case) ||
        (dragNodeType === CollectionNodeType.case &&
          (parentNodeType as CollectionNodeType) === CollectionNodeType.folder)
      )
        return console.error('拖拽节点不合规');

      // 同类型拖拽，层级自动提升
      if (dragNodeType === parentNodeType) {
        // 文件夹拖动的情况
        if (dragNodeType === CollectionNodeType.folder) {
          if (dragPos.length === nodePos.length && value.dropToGap) {
            // console.log('文件夹平级的情况');
            toParentPath.pop();
          } else {
            // console.log('文件夹嵌套拖进的情况');
            value.dropToGap && toParentPath.pop();
          }
        } else {
          toIndex++;
          toParentPath.pop();
        }
      } else toIndex = 0;

      move({
        id: activeWorkspaceId,
        fromNodePath,
        toParentPath,
        toIndex: toIndex < 0 ? 0 : toIndex,
      });
    },
    [activeWorkspaceId, collectionsTreeData, move],
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
        loading={loading}
        description={
          <Button type='primary' onClick={createCollection}>
            {t('collection.create_new')}
          </Button>
        }
      >
        <StructuredFilter
          size='small'
          className={'collection-header-search'}
          showSearchButton={false}
          prefix={props.menu}
          labelDataSource={labelData.map((item) => ({
            id: item.id,
            name: item.labelName,
            color: item.color,
          }))}
          options={options}
          placeholder={'Search for Name or Id'}
          onChange={handleChange}
        />
        <ConfigProvider theme={{ token: { motion: false } }}>
          <CollectionTree
            showLine
            blockNode
            height={props.height}
            selectedKeys={props.selectedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            switcherIcon={<DownOutlined />}
            treeData={filterTreeData}
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
        </ConfigProvider>
      </EmptyWrapper>
    </div>
  );
};

export default CollectionSelect;
