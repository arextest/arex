import styled from '@emotion/styled';
import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { FC } from 'react';

type ObjectFilter = 'object' | 'array';
type IgnoreTreeProps = Omit<TreeProps, 'treeData'> & {
  treeData: object;
  title?: string;
  exclude?: ObjectFilter;
};
const IgnoreTreeWrapper = styled.div`
  .ant-tree-node-selected {
    text-decoration: line-through;
  }
`;

const IgnoreTree: FC<IgnoreTreeProps> = (props) => {
  function getNodes(object: object, basePath = '', exclude?: ObjectFilter): DataNode[] {
    const entries = Object.entries(object).filter(([, value]) => {
      if (!exclude) return true;
      if (exclude === 'object') return Array.isArray(value);
      else if (exclude === 'array') return !Array.isArray(value);
    });
    return entries.map(([key, value]) => {
      const path = basePath + key + '/';
      return value && typeof value === 'object'
        ? { title: key, key: path, children: getNodes(value, path, exclude) }
        : { title: key, key: path, value };
    });
  }

  return (
    <IgnoreTreeWrapper>
      <Card
        title={`${props.title} (click node to ignore)`}
        bodyStyle={{ padding: '8px 16px' }}
        headStyle={{ padding: '0 16px', margin: '-8px 0' }}
      >
        <Tree
          multiple
          defaultExpandAll
          {...props}
          treeData={getNodes(props.treeData, '', props.exclude)}
        />
      </Card>
    </IgnoreTreeWrapper>
  );
};

export default IgnoreTree;
