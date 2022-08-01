import './index.less';

import { DashOutlined, DownOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Spin, Tooltip, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { DirectoryTreeProps } from 'antd/lib/tree';
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';

import { CollectionService } from '../../../services/CollectionService';
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

export type CollectionProps = {
  treeData: any;
  fetchTreeData: () => void;
  loading?: boolean;
  setMainBoxPanes: (p: any) => void;
  mainBoxPanes: any[];
  setMainBoxActiveKey: (p: any) => void;
};

export type CollectionRef = {
  setSelectedKeys: (keys: React.Key[]) => void;
};

// eslint-disable-next-line react/display-name
const Collection = forwardRef(
  (
    {
      treeData,
      fetchTreeData,
      loading,
      setMainBoxPanes,
      mainBoxPanes,
      setMainBoxActiveKey,
    }: CollectionProps,
    ref: ForwardedRef<CollectionRef>,
  ) => {
    // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
    useImperativeHandle(ref, () => ({
      setSelectedKeys,
    }));

    const _useParams = useParams();
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const onExpand: any = (newExpandedKeys: string[]) => {
      setExpandedKeys(newExpandedKeys);
      // setAutoExpandParent(false);
    };

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
      if (keys.length > 0) {
        setSelectedKeys(keys);
      }

      if (
        keys[0] &&
        info.node.nodeType !== 3 &&
        !mainBoxPanes.map((i) => i.key).includes(keys[0])
      ) {
        const newPanes = [...mainBoxPanes];
        newPanes.push({
          title: info.node.title,
          key: keys[0],
          pageType: 'request',
          qid: keys[0],
          nodeType: info.node.nodeType,
        });
        setMainBoxPanes(newPanes);
      }

      if (
        keys[0] &&
        info.node.nodeType === 3 &&
        !mainBoxPanes.map((i) => i.key).includes(keys[0])
      ) {
        const newPanes = [...mainBoxPanes];
        newPanes.push({
          title: info.node.title,
          key: keys[0],
          pageType: 'folder',
          qid: keys[0],
          nodeType: 3,
        });
        setMainBoxPanes(newPanes);
      }

      if (keys[0]) {
        setMainBoxActiveKey(keys[0]);
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
    function expandSpecifyKeys(keys: string[], p, nodeType) {
      console.log([...expandedKeys, ...keys], p);
      setExpandedKeys([...expandedKeys, p[p.length - 1]]);
      setSelectedKeys([...keys]);

      const newPanes = [...mainBoxPanes];
      newPanes.push({
        closable: true,
        title: nodeType === 1 ? 'New Request' : 'New Case',
        key: keys[0],
        pageType: 'request',
        qid: keys[0],
        nodeType: nodeType,
      });
      setMainBoxPanes(newPanes);
      setMainBoxActiveKey(keys[0]);
    }

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
              onClick={() => {
                CollectionService.addItem({
                  id: _useParams.workspaceId,
                  nodeName: 'New Collection',
                  nodeType: 3,
                  parentPath: [],
                  userName: 'zt',
                }).then(() => {
                  fetchTreeData();
                });
              }}
            />
          </Tooltip>
          <Input
            disabled={true}
            className={'collection-header-search'}
            size='small'
            placeholder=''
            prefix={<MenuOutlined />}
            onChange={onChange}
          />
          {/*<Tooltip*/}
          {/*  placement="bottomLeft"*/}
          {/*  title={"View more actions"}*/}
          {/*  mouseEnterDelay={0.5}*/}
          {/*>*/}
          {/*  <Button className={"collection-header-view"} type="text" size="small">*/}
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
          onSelect={onSelect}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          titleRender={(val) => (
            <CollectionTitleRender
              updateDirectorytreeData={() => {
                fetchTreeData();
              }}
              val={val}
              treeData={treeData}
              callbackOfNewRequest={expandSpecifyKeys}
            />
          )}
        />
        <Empty style={{ display: treeData.length > 0 ? 'none' : 'block' }}>
          <Button
            type='primary'
            onClick={() => {
              CollectionService.addItem({
                id: _useParams.workspaceId,
                nodeName: 'New Collection',
                nodeType: 3,
                parentPath: [],
                userName: 'zt',
              }).then(() => {
                fetchTreeData();
              });
            }}
          >
            New
          </Button>
        </Empty>
      </div>
    );
  },
);

export default Collection;
