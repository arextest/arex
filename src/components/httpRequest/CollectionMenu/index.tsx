import './index.less';

import { DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Empty, Input, Tooltip, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { DirectoryTreeProps } from 'antd/lib/tree';
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';

import { NodeType } from '../../../constant';
import { CollectionService } from '../../../services/CollectionService';
import { useStore } from '../../../store';
import CollectionTitleRender from './CollectionTitleRender';

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
};
export type CollectionProps = {
  workspaceId?: string;
  onSelect: (key: string, node: nodeType) => void;
};

export type CollectionRef = {
  setSelectedKeys: (keys: React.Key[]) => void;
};

// eslint-disable-next-line react/display-name
const Collection = forwardRef(
  ({ workspaceId, onSelect }: CollectionProps, ref: ForwardedRef<CollectionRef>) => {
    // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
    useImperativeHandle(ref, () => ({
      setSelectedKeys,
    }));

    const _useParams = useParams();

    const setCollectionTreeData = useStore((state) => state.setCollectionTreeData);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    // TODO 抽取公共 selectedKeys 至全局 store，并实现与 MenuSelect 的共用，方便panesChange时触发更改相应的 MainMenu 并高亮
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const { data: treeData = [], run: fetchTreeData } = useRequest(
      () => CollectionService.listCollection({ id: workspaceId as string }),
      {
        ready: !!workspaceId,
        refreshDeps: [workspaceId],
      },
    );

    useEffect(() => {
      // setColl
      if (treeData.length > 0) {
        setCollectionTreeData(treeData);
        console.log(treeData, 'ree');
      }
    }, [treeData]);

    const onExpand: any = (newExpandedKeys: string[]) => {
      setExpandedKeys(newExpandedKeys);
      // setAutoExpandParent(false);
    };

    const handleSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
      setSelectedKeys(keys);
      onSelect &&
        onSelect(keys[0] as string, {
          title: info.node.title,
          key: info.node.key,
          nodeType: info.node.nodeType,
        });
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
    // function expandSpecifyKeys(keys: string[], p, nodeType) {
    //   console.log([...expandedKeys, ...keys], p);
    //   setExpandedKeys([...expandedKeys, p[p.length - 1]]);
    //   setSelectedKeys([...keys]);
    //
    //   const newPanes = [...mainBoxPanes];
    //   newPanes.push({
    //     closable: true,
    //     title: nodeType === 1 ? 'New Request' : 'New Case',
    //     key: keys[0],
    //     pageType: 'request',
    //     qid: keys[0],
    //     nodeType: nodeType,
    //   });
    //   setMainBoxPanes(newPanes);
    //   setMainBoxActiveKey(keys[0]);
    // }

    const { run: createCollection } = useRequest(
      () =>
        CollectionService.addItem({
          id: _useParams.workspaceId,
          nodeName: 'New Collection',
          nodeType: 3,
          parentPath: [],
          userName: 'zt',
        }),
      {
        manual: true,
        onSuccess() {
          fetchTreeData();
        },
      },
    );

    useEffect(() => {
      generateList(treeData);
    }, [treeData]);

    return (
      <div className={'collection'}>
        <div className={'collection-header'}>
          <Tooltip placement='bottomLeft' title={'Create New'} mouseEnterDelay={0.5}>
            <Button
              className={'collection-header-create'}
              icon={<PlusOutlined />}
              type='text'
              size='small'
              onClick={createCollection}
            />
          </Tooltip>
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
          onExpand={onExpand}
          onSelect={handleSelect}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          titleRender={(val) => (
            <CollectionTitleRender
              updateDirectoryTreeData={fetchTreeData}
              val={val}
              treeData={treeData}
              // callbackOfNewRequest={expandSpecifyKeys} // TODO 暂时禁用待优化
              callbackOfNewRequest={() => {}}
            />
          )}
        />
        <Empty style={{ display: treeData.length > 0 ? 'none' : 'block' }}>
          <Button type='primary' onClick={createCollection}>
            New
          </Button>
        </Empty>
      </div>
    );
  },
);

export default Collection;
