import { DownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import { ArexMenuFC, EmptyWrapper, getLocalStorage, styled, useTranslation } from 'arex-core';
import React, { useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import CollectionNodeTitle from '@/menus/Collection/CollectionNodeTitle';
import { FileSystemService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useWorkspaces } from '@/store';

const CollectionNodeTitleWrapper = styled.div`
  width: 100%;
  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }

  .collection-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .collection-header-create {
      margin-right: 5px;
      span.action {
        font-weight: bold;
      }
    }
    .collection-header-view {
      margin: 0 5px;
    }
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

export type CollectionTreeType = CollectionType & DataNode;

const Collection: ArexMenuFC = (props) => {
  const { t } = useTranslation(['components']);
  const { activeWorkspaceId } = useWorkspaces();
  const { loading, collectionsTreeData, collectionsFlatData, getCollections } = useCollections();
  // useLabels()

  const navPane = useNavPane();
  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const selectedKeys = useMemo(() => (props.value ? [props.value] : []), [props.value]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const handleSelect: DirectoryTreeProps<CollectionTreeType>['onSelect'] = (keys, info) => {
    console.log({ keys, info });

    if (info.node.nodeType !== CollectionNodeType.folder) {
      const method = info.node.method && info.node.method.toLowerCase();

      navPane({
        type: PanesType.REQUEST,
        id: info.node.infoId,
        icon: (method && method.replace(method[0], method[0].toUpperCase())) || undefined,
        data: info.node,
      });
    }
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys as string[]);
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

  return (
    <CollectionNodeTitleWrapper>
      <EmptyWrapper
        empty={!loading && !collectionsTreeData.length}
        loading={loading}
        description={
          <Button type='primary' onClick={createCollection}>
            {t('collection.create_new')}
          </Button>
        }
      >
        <Tree<CollectionType>
          showLine
          blockNode
          autoExpandParent
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          switcherIcon={<DownOutlined />}
          treeData={collectionsTreeData}
          fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
          // onDrop={onDrop}
          onExpand={onExpand}
          onSelect={handleSelect}
          draggable={{ icon: false }}
          titleRender={(data) => (
            <CollectionNodeTitle
              keyword={''}
              data={data}
              onAddNode={(infoId) => {
                props.onSelect?.(infoId, { infoId });
                setExpandedKeys([...expandedKeys, infoId]);
              }}
            />
          )}
        />
      </EmptyWrapper>
    </CollectionNodeTitleWrapper>
  );
};

export default Collection;
