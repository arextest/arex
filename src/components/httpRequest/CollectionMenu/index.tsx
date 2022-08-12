import { DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Empty, Input, Spin, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/lib/tree';
import React, { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NodeType } from '../../../constant';
import { CollectionService } from '../../../services/CollectionService';
import { TooltipButton } from '../../index';
import CollectionTitle from './CollectionTitle';

const CollectionMenuWrapper = styled.div`
  height: 100%;
  .ant-spin-nested-loading,
  .ant-spin {
    height: 100%;
    max-height: 100% !important;
  }

  .collection-header {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
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

  .collection-title-render {
    display: flex;
    .right {
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
  }
  .ant-tree-node-content-wrapper {
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
`;

const dataList: { key: React.Key; title: string }[] = [];
const generateList = (data: DataNode[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title }: any = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

export type nodeType = {
  title: string;
  key: string;
  nodeType: NodeType;
} & DataNode;

export type CollectionProps = {
  value?: string;
  onSelect: (key: string, node: nodeType) => void;
  onGetData: (data: NodeList[]) => void;
};

const Collection: FC<CollectionProps> = ({ value, onSelect, onGetData }) => {
  const params = useParams();

  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // TODO
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const {
    data: treeData = [],
    loading,
    run: fetchTreeData,
  } = useRequest(() => CollectionService.listCollection({ id: params.workspaceId as string }), {
    ready: !!params.workspaceId,
    refreshDeps: [params.workspaceId],
    onSuccess: (res) => {
      if (res.length) {
        onGetData && onGetData(res);
        generateList(treeData);
      }
    },
  });

  const handleSelect: DirectoryTreeProps<nodeType>['onSelect'] = (keys, info) => {
    if (keys.length && onSelect) {
      onSelect(keys[0] as string, {
        title: info.node.title,
        key: info.node.key,
        nodeType: info.node.nodeType,
      });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let newExpandedKeys;
    if (value == '') {
      newExpandedKeys = dataList.map((item) => item.title);
    } else {
      newExpandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  // 对外的函数
  // 展开指定的数组
  function expandSpecifyKeys(keys: string[], p: string[], nodeType: NodeType) {
    const key = keys[0];
    const maps: { [key: string]: string } = {
      '1': 'New Request',
      '2': 'New Case',
      '3': 'New Folder',
    };
    setExpandedKeys([...expandedKeys, p[p.length - 1]]);
    onSelect &&
      onSelect(key, {
        title: maps[nodeType],
        key,
        nodeType,
      });
  }

  const { run: createCollection } = useRequest(
    () =>
      CollectionService.addItem({
        id: params.workspaceId,
        nodeName: 'New Collection',
        nodeType: 3,
        parentPath: [],
        userName: localStorage.getItem('email'),
      }),
    {
      manual: true,
      onSuccess() {
        fetchTreeData();
      },
    },
  );

  return (
    <CollectionMenuWrapper>
      <Spin spinning={loading}>
        {!loading && !treeData.length ? (
          <Empty>
            <Button type='primary' onClick={createCollection}>
              New
            </Button>
          </Empty>
        ) : (
          <>
            <div className={'collection-header'}>
              <TooltipButton
                icon={<PlusOutlined />}
                type='text'
                size='small'
                className={'collection-header-create'}
                onClick={createCollection}
                placement='bottomLeft'
                title={'Create New'}
              />
              <Input
                className={'collection-header-search'}
                size='small'
                placeholder=''
                prefix={<MenuOutlined />}
                onChange={onChange}
              />
              {/*<Tooltip placement='bottomLeft' title={'View more actions'} mouseEnterDelay={0.5}>*/}
              {/*  <Button className={'collection-header-view'} type='text' size='small'>*/}
              {/*    <DashOutlined />*/}
              {/*  </Button>*/}
              {/*</Tooltip>*/}
            </div>

            <Tree
              autoExpandParent
              blockNode={true}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
              onSelect={handleSelect}
              switcherIcon={<DownOutlined />}
              treeData={treeData}
              titleRender={(val) => (
                <CollectionTitle
                  updateDirectoryTreeData={fetchTreeData}
                  val={val}
                  treeData={treeData}
                  callbackOfNewRequest={expandSpecifyKeys} // TODO 暂时禁用待优化
                />
              )}
            />
          </>
        )}
      </Spin>
    </CollectionMenuWrapper>
  );
};

export default Collection;
