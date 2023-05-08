import { ApiOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import { createArexMenu } from 'arex-core';
import { ArexMenu, ArexMenuFC } from 'arex-core/src';
import React, { FC, useEffect } from 'react';

// import CollectionMenu from '../../components/CollectionMenu';
import { MenusType, PanesType } from '@/constant';
import { queryUsersByWorkspace } from '@/services/FileSystemService/workspace';
import { useCollections } from '@/store';

import useNavPane from '../../hooks/useNavPane';
// import { queryWorkspaceById } from '../services/FileSystemService/queryWorkspaceById';
const CollectionMenu: ArexMenuFC = ({ onSelect, value }) => {
  const { collections, collectionsTreeData } = useCollections();
  useEffect(() => {
    queryUsersByWorkspace({ workspaceId: '644a282d3867983e29d1b8f5' }).then((r) => {
      console.log(r);
    });
  }, []);

  return (
    <div>
      <Tree
        treeData={collectionsTreeData}
        onSelect={(_, node) => {
          // console.log('');
          // @ts-ignore
          onSelect(_[0], { data: 'test123' });
        }}
      />
    </div>
  );
};

export default createArexMenu(CollectionMenu, {
  type: MenusType.COLLECTION,
  paneType: PanesType.REQUEST,
  icon: <ApiOutlined />,
});
