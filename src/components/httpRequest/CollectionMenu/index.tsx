import { DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useRequest } from 'ahooks';
import { Button, Empty, Input, Spin, Tree } from 'antd';
import type { DataNode, DirectoryTreeProps, TreeProps } from 'antd/lib/tree';
import React, { FC, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from './../../../store';
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
    color: ${(props) => props.theme.color.text.secondary};
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
    :hover {
      color: ${(props) => props.theme.color.text.primary};
    }
  }
  .ant-tree-node-selected {
    .collection-title-render {
      color: ${(props) => props.theme.color.text.primary};
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
  cRef: any;
};

const Collection: FC<CollectionProps> = ({ value, onSelect, onGetData, cRef }) => {
  const params = useParams();
  const {
    userInfo: { email: userName },
    workspaces,
  } = useStore();

  const selectedKeys = useMemo(() => (value ? [value] : []), [value]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // TODO
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  useImperativeHandle(cRef, () => ({
    fetchTreeData: () => {
      fetchTreeData();
    },
  }));

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
        // generateList(treeData);
        generateList(res);
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

  const onExpand = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
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
        userName,
      }),
    {
      manual: true,
      onSuccess() {
        fetchTreeData();
      },
    },
  );

  // 树拖拽
  const onDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dragNodeType = info.dragNode.nodeType;
    const dropPos = info.node.pos.split('-');
    const dragPos = info.dragNode.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = JSON.parse(JSON.stringify(treeData));

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).children || []).length > 0 && // Has children
      (info.node as any).expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    // fromNodePath和toParentPath
    let fromNodePath = null;
    let toParentPath = null;
    let toIndex = 0;
    let NodeAll: any[] = [];
    const dfsNode = (d: any, key: string | number, NodeArray: any[]) => {
      d.children.forEach((e: any) => {
        dfsNode(e, key, [...NodeArray, e.key]);
      });
      if (!d.children.length) {
        NodeAll.push(NodeArray);
      }
    };
    //fromNodePath
    treeData.map((e: any) => {
      let arr = [e.key];
      dfsNode(e, dragKey, arr);
    });
    NodeAll = NodeAll.filter((e) => e.includes(dragKey))[0];
    fromNodePath = NodeAll.splice(0, NodeAll.indexOf(dragKey) + 1);
    NodeAll = [];
    //toParentPath
    data.map((e: any) => {
      let arr = [e.key];
      dfsNode(e, dragKey, arr);
    });
    NodeAll = NodeAll.filter((e) => e.includes(dragKey))[0];
    toParentPath = NodeAll.splice(0, NodeAll.indexOf(dragKey));
    if (!toParentPath.length) toParentPath = null;
    NodeAll = [];

    //计算toIndex
    const dfsNodeIndex = (d: any, key: string | number) => {
      let arr: any = [];
      let res = null;
      let resP: any = [];
      d.forEach((e: any) => {
        arr.push(e);
      });
      while (arr.length) {
        let temp = arr.shift();
        temp.children.forEach((e: any) => {
          if (e.key == key) {
            resP = temp;
            res = [temp.key];
          }
          arr.push(e);
        });
      }
      return [resP, res];
    };

    //判断不成立的情况
    if (dfsNodeIndex(data, dragKey)[0].nodeType) {
      if (dragNodeType == 2 && dfsNodeIndex(data, dragKey)[0].nodeType !== 1) return;
      if (dragNodeType == 3 && dfsNodeIndex(data, dragKey)[0].nodeType !== 3) return;
      if (dragNodeType == 1 && dfsNodeIndex(data, dragKey)[0].nodeType !== 3) return;
    } else {
      if (dragNodeType !== 3) return;
    }

    let fromNode = dfsNodeIndex(treeData, dragKey)[1];
    let toNode = dfsNodeIndex(data, dragKey)[1];
    let Td = dfsNodeIndex(treeData, dragKey)[0].children;
    let Dd = dfsNodeIndex(data, dragKey)[0].children;
    let tIndex = 0;
    let dIndex = 0;
    if (fromNode == null && toNode == null) {
      data.forEach((e: any, i: number) => {
        if (e.key == dragKey) dIndex = i;
      });
      treeData.forEach((e: any, i: number) => {
        if (e.key == dragKey) tIndex = i;
      });
      if (tIndex < dIndex) {
        toIndex = dIndex + 1;
      } else {
        toIndex = dIndex;
      }
    } else if (toNode == null || fromNode == null) {
      data.forEach((e: any, i: number) => {
        if (e.key == dragKey) toIndex = i;
      });
    } else if (fromNode[0] == toNode[0]) {
      Dd.forEach((e: any, i: number) => {
        if (e.key == dragKey) dIndex = i;
      });
      Td.forEach((e: any, i: number) => {
        if (e.key == dragKey) tIndex = i;
      });
      if (tIndex < dIndex) {
        toIndex = dIndex + 1;
      } else {
        toIndex = dIndex;
      }
    } else {
      Dd.forEach((e: any, i: number) => {
        if (e.key == dragKey) toIndex = i;
      });
    }
    // console.log({fromNodePath,id:workspaces[0].id,toParentPath,toIndex});

    CollectionService.move({ fromNodePath, id: params.workspaceId, toParentPath, toIndex }).then(
      (res) => {
        if (res.body.success) {
          fetchTreeData();
        }
      },
    );
  };

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
              autoExpandParent={autoExpandParent}
              blockNode={true}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              onExpand={onExpand}
              onSelect={handleSelect}
              switcherIcon={<DownOutlined />}
              treeData={treeData}
              onDrop={onDrop}
              draggable={{ icon: false }}
              titleRender={(val) => (
                <CollectionTitle
                  searchValue={searchValue}
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
