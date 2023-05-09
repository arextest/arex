import { ApiOutlined, DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { createArexMenu } from 'arex-core';
import { ArexMenuFC } from 'arex-core/src';
import React, { useEffect, useMemo, useState } from 'react';

import { MenusType, PanesType } from '@/constant';
import CollectionNode from '@/menus/Collection/CollectionNode';
import { queryUsersByWorkspace } from '@/services/FileSystemService/workspace';
import { useCollections } from '@/store';

const CollectionMenu: ArexMenuFC = ({ onSelect, value }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const selectedKeys = [''];
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand: any = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  function onDrop() {
    console.log('');
  }
  const { collectionsTreeData } = useCollections();
  useEffect(() => {
    queryUsersByWorkspace({ workspaceId: '644a282d3867983e29d1b8f5' }).then((r) => {
      console.log(r);
    });
  }, []);
  const newData = useMemo(() => {
    const loop = (data: any[]): any[] =>
      data.map((item) => {
        const title = <CollectionNode value={item} />;
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(collectionsTreeData);
  }, [collectionsTreeData]);
  return (
    <div>
      <Tree
        treeData={newData}
        showLine={true}
        blockNode={true}
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        onSelect={(keys, info) => {
          // @ts-ignore
          onSelect(keys[0]);
        }}
        switcherIcon={<DownOutlined />}
        draggable={{ icon: false }}
        onDrop={onDrop}
      />
    </div>
  );
};

export default createArexMenu(CollectionMenu, {
  type: MenusType.COLLECTION,
  paneType: PanesType.REQUEST,
  icon: <ApiOutlined />,
});
