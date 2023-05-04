import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import React, { useEffect } from 'react';

import { queryWorkspaceById } from '../../services/FileSystemService/queryWorkspaceById';

const CollectionMenu = () => {
  useEffect(() => {
    queryWorkspaceById({ id: '644a282d3867983e29d1b8f5' }).then((r) => {
      console.log(r);
    });
  }, []);
  const treeData: DataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
            {
              title: 'leaf',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: 'leaf',
              key: '0-0-1-0',
            },
          ],
        },
        {
          title: 'parent 1-2',
          key: '0-0-2',
          children: [
            {
              title: 'leaf',
              key: '0-0-2-0',
            },
            {
              title: 'leaf',
              key: '0-0-2-1',
            },
          ],
        },
      ],
    },
  ];
  return (
    <div>
      <Tree treeData={treeData} />
    </div>
  );
};

export default CollectionMenu;
