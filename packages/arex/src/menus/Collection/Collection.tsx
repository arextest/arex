import { DownOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ArexMenuFC,
  CategoryKey,
  EmptyWrapper,
  getLocalStorage,
  Operator,
  RequestMethodEnum,
  SearchDataType,
  StructuredFilter,
  styled,
  TooltipButton,
  useTranslation,
} from '@arextest/arex-core';
import { useRequest, useSize } from 'ahooks';
import { App, Button, Tag, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Icon, WorkspacesMenu } from '@/components';
import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import CollectionNodeTitle, {
  CollectionNodeTitleProps,
} from '@/menus/Collection/CollectionNodeTitle';
import CollectionsImportExport from '@/menus/Collection/ImportExport';
import { FileSystemService, ReportService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useMenusPanes, useWorkspaces } from '@/store';
import { negate } from '@/utils';
import treeFilter from '@/utils/treeFilter';

const CollectionWrapper = styled.div`
  width: 100%;
  overflow: hidden;

  .collection-content-wrapper {
    padding: 8px 8px;
  }

  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }

  .collection-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .ant-tree {
    background-color: transparent;
  }

  .ant-tree-node-selected .content {
    color: ${(props) => props.theme.colorText};
  }

  .ant-tree-node-content-wrapper {
    width: 10%;
    overflow-y: visible; //解决拖拽图标被隐藏
    overflow-x: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;

const CollectionTree = styled(Tree<CollectionType>)`
  .ant-tree-node-selected {
    background-color: ${(props) => props.theme.colorPrimaryBgHover} !important;
  }
`;

export type CollectionTreeType = CollectionType & DataNode;

const Collection: ArexMenuFC = (props) => {
  const { t } = useTranslation(['components']);
  const { message } = App.useApp();
  const navPane = useNavPane();
  const size = useSize(() => document.getElementById('arex-menu-wrapper'));

  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const { activeWorkspaceId, workspaces, getWorkspaces, setActiveWorkspaceId } = useWorkspaces();
  const { activePane, reset: resetPane } = useMenusPanes();
  const { loading, collectionsTreeData, collectionsFlatData, getCollections } = useCollections();

  const [searchValue, setSearchValue] = useState<SearchDataType>();
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // requestId structure: workspaceId-nodeTypeStr-id
  const selectedKeys = useMemo(() => {
    const id = props.value?.split('-')?.[2];
    return id ? [id] : undefined;
  }, [props.value]);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // TODO 初始化展开的节点
  const [showModalImportExport, setShowModalImportExport] = useState(false);

  useEffect(() => {
    getCollections();
  }, []);

  // auto expand by active pane id
  useEffect(() => {
    activePane &&
      activePane.type === PanesType.REQUEST &&
      setExpandedKeys((expandedKeys) => Array.from(new Set([...expandedKeys, activePane.id])));
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

  const workspacesOptions = useMemo(
    () =>
      workspaces.map((workspace) => ({
        value: workspace.id,
        label: workspace.workspaceName,
      })),
    [workspaces],
  );

  const handleSelect: DirectoryTreeProps<CollectionTreeType>['onSelect'] = (keys, info) => {
    if (info.node.nodeType !== CollectionNodeType.folder) {
      const icon =
        info.node.nodeType === CollectionNodeType.interface
          ? info.node.method || undefined
          : info.node.nodeType === CollectionNodeType.case
          ? info.node.caseSourceType === 1
            ? 'arex'
            : 'case'
          : undefined;

      navPane({
        type: PanesType.REQUEST,
        id: `${activeWorkspaceId}-${info.node.nodeType}-${info.node.infoId}`,
        name: info.node.nodeName,
        icon,
      });
    }
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

  const { run: remove } = useRequest(FileSystemService.moveCollectionItem, {
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

      remove({
        id: activeWorkspaceId,
        fromNodePath,
        toParentPath,
        toIndex: toIndex < 0 ? 0 : toIndex,
      });
    },
    [activeWorkspaceId, collectionsTreeData, remove],
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
    setExpandedKeys([...expandedKeys, infoId]);
  };

  const { run: createWorkspace } = useRequest(FileSystemService.createWorkspace, {
    manual: true,
    onSuccess: (res) => {
      if (res.success) {
        message.success(t('workSpace.createSuccess'));
        resetPane();
        getWorkspaces(res.workspaceId);
      }
    },
  });

  const handleAddWorkspace = (workspaceName: string) => {
    createWorkspace({ userName, workspaceName });
  };

  const handleEditWorkspace = (workspaceId: string) => {
    navPane({
      type: PanesType.WORKSPACE,
      id: workspaceId,
    });
  };

  return (
    <CollectionWrapper>
      <WorkspacesMenu
        value={activeWorkspaceId}
        options={workspacesOptions}
        onChange={setActiveWorkspaceId}
        onAdd={handleAddWorkspace}
        onEdit={handleEditWorkspace}
      />

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
            prefix={
              <div
                style={{
                  height: '27px',
                  marginRight: '8px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'center',
                }}
              >
                <TooltipButton
                  icon={<PlusOutlined />}
                  type='text'
                  size='small'
                  title={t('collection.create_new')}
                  onClick={createCollection}
                />

                <TooltipButton
                  icon={<Icon name='ArchiveRestore' />}
                  title={t('collection.import_export')}
                  onClick={() => {
                    setShowModalImportExport(true);
                  }}
                />

                <TooltipButton
                  icon={<PlayCircleOutlined />}
                  title={t('collection.batch_run')}
                  onClick={() => {
                    navPane({
                      type: PanesType.BATCH_RUN,
                      id: activeWorkspaceId,
                    });
                  }}
                />
              </div>
            }
            labelDataSource={labelData.map((item) => ({
              id: item.id,
              name: item.labelName,
              color: item.color,
            }))}
            options={options}
            placeholder={'Search for Name or Id'}
            onChange={handleChange}
          />
          <CollectionTree
            showLine
            blockNode
            height={size?.height && size.height - 100}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            switcherIcon={<DownOutlined />}
            treeData={filterTreeData}
            fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
            onDrop={onDrop}
            onExpand={onExpand}
            onSelect={handleSelect}
            draggable={{ icon: false }}
            titleRender={(data) => (
              <CollectionNodeTitle
                data={data}
                keyword={searchValue?.keyword}
                onAddNode={handleAddNode}
              />
            )}
          />
          {/*弹框*/}
          <CollectionsImportExport
            show={showModalImportExport}
            onHideModal={() => {
              setShowModalImportExport(false);
            }}
          />
        </EmptyWrapper>
      </div>
    </CollectionWrapper>
  );
};

export default Collection;
