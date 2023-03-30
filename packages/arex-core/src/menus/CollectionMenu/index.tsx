import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { FC } from 'react';

import { MethodEnum, NodeTypeEnum } from '../../constant';
import { CollectionMenuWrapper } from './CollectionMenuWrapper';
import SearchHeader from './SearchHeader';

export interface CollectionTreeNode {
  id: string;
  key: string;
  method: MethodEnum;
  nodeType: NodeTypeEnum;
  title: string;
  children: Array<CollectionTreeNode>;
}

export interface CollectionMenuProps {
  value: string;
  onSelect: (e: any, y: any) => void;
  onClickRunTest: () => void;
  onClickRunCompare: () => void;
  collectionTreeData: CollectionTreeNode[];
}

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

function treeFind<T>(tree: T[], func: (item: T) => boolean): T | undefined {
  for (const data of tree) {
    if (func(data)) return data;
    // @ts-ignore
    if (data.children) {
      // @ts-ignore
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return undefined;
}

const CollectionMenu: FC<CollectionMenuProps> = ({
  collectionTreeData,
  onSelect,
  onClickRunCompare,
}) => {
  const handleSelect = (keys: any, info: any) => {
    const t = treeFind(collectionTreeData, (node: any) => node.key === keys[0]);
    if (t && keys.length && onSelect) {
      onSelect(keys[0] as string, {
        title: t.title,
        key: t.key,
        nodeType: t.nodeType,
      });
    }
  };
  return (
    <CollectionMenuWrapper>
      <SearchHeader onClickRunCompare={onClickRunCompare} />
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandedKeys={['0-0-0']}
        onSelect={handleSelect}
        treeData={collectionTreeData}
      />
    </CollectionMenuWrapper>
  );
};

export default CollectionMenu;
