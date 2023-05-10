import { DownOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import { ArexMenuFC, EmptyWrapper, getLocalStorage, useTranslation } from 'arex-core';
import React, { useMemo, useState } from 'react';

import { CollectionNodeType, EMAIL_KEY, PanesType } from '@/constant';
import { useNavPane } from '@/hooks';
import { FileSystemService } from '@/services';
import { CollectionType } from '@/services/FileSystemService';
import { useCollections, useWorkspaces } from '@/store';

// import CollectionTitle from './NodeTitle';

const CollectionMenuWrapper = styled.div`
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
    .collection-header-search {
    }
    .collection-header-view {
      margin: 0 5px;
    }
  }

  .ant-tree {
    background-color: transparent;
  }

  .ant-tree-title {
    width: 100%;
    .collection-title-render {
      color: ${(props) => props.theme.colorTextSecondary};
      display: flex;
      .right {
        float: right;
      }
      .left {
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        .content {
          overflow: hidden; //超出的文本隐藏
          text-overflow: ellipsis; //溢出用省略号显示
          white-space: nowrap; //溢出不换行
        }
      }
      :hover {
        color: ${(props) => props.theme.colorText};
      }
    }
  }

  .ant-tree-node-selected {
    .collection-title-render {
      color: ${(props) => props.theme.colorText};
    }
  }

  .ant-tree-node-content-wrapper {
    width: 10%;
    overflow-y: visible; //解决拖拽图标被隐藏
    // overflow-x: clip;
    // overflow-x: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;

const Collection: ArexMenuFC = (props) => {
  const { t } = useTranslation(['components']);
  const { activeWorkspaceId } = useWorkspaces();
  const { loading, collectionsTreeData, getCollections } = useCollections();
  // useLabels()

  const navPane = useNavPane();
  const userName = getLocalStorage<string>(EMAIL_KEY) as string;

  const selectedKeys = useMemo(() => (props.value ? [props.value] : []), [props.value]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const handleSelect: DirectoryTreeProps<CollectionType & DataNode>['onSelect'] = (keys, info) => {
    console.log({ keys, info });

    if (info.node.nodeType !== CollectionNodeType.folder) {
      const method = info.node.method && info.node.method.toLowerCase();

      navPane({
        type: PanesType.REQUEST,
        id: info.node.infoId,
        icon: (method && method.replace(method[0], method[0].toUpperCase())) || undefined,
      });
    }
  };

  const onExpand = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  // 对外的函数
  // 展开指定的数组
  // function expandSpecifyKeys(keys: string[], p: string[], nodeType: CollectionNodeType) {
  //   const key = keys[0];
  //   const maps: { [key: string]: string } = {
  //     '1': 'New Request',
  //     '2': 'New Case',
  //     '3': 'New Folder',
  //   };
  //   setExpandedKeys([...expandedKeys, p[p.length - 1]]);
  //   handleCollectionMenuClick(key, {
  //     title: maps[nodeType],
  //     key,
  //     nodeType,
  //   });
  // }

  const { run: createCollection } = useRequest(
    () =>
      FileSystemService.addCollection({
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
    <CollectionMenuWrapper>
      <EmptyWrapper
        empty={!loading && !collectionsTreeData.length}
        loading={loading}
        description={
          <Button type='primary' onClick={createCollection}>
            {t('collection.create_new')}
          </Button>
        }
      >
        <Tree
          showLine
          blockNode
          // height={treeHeight - 62}
          autoExpandParent={autoExpandParent}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          switcherIcon={<DownOutlined />}
          // @ts-ignore
          treeData={collectionsTreeData}
          fieldNames={{ title: 'nodeName', key: 'infoId', children: 'children' }}
          // onDrop={onDrop}
          // @ts-ignore
          onExpand={onExpand}
          onSelect={handleSelect}
          draggable={{ icon: false }}
          // titleRender={(val) => (
          //   <CollectionTitle
          //     keyword={searchValue?.keyword}
          //     updateDirectoryTreeData={fetchTreeData}
          //     val={val}
          //     treeData={treeData}
          //     callbackOfNewRequest={expandSpecifyKeys} // TODO 暂时禁用待优化
          //   />
          // )}
        />
      </EmptyWrapper>
    </CollectionMenuWrapper>
  );
};

export default Collection;
