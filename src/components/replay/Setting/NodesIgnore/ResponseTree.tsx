import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { FC } from 'react';

const ResponseTreeWrapper = styled.div`
  .ant-tree-node-selected {
    text-decoration: line-through;
  }
`;

const ResponseTree: FC<Omit<TreeProps, 'treeData'> & { treeData: object; title?: string }> = (
  props,
) => {
  function getNodes(object: object, basePath = ''): DataNode[] {
    return Object.entries(object).map(([key, value]) => {
      const path = basePath + key + '/';
      return value && typeof value === 'object'
        ? { title: key, key: path, children: getNodes(value, path) }
        : { title: key, key: path, value };
    });
  }

  return (
    <ResponseTreeWrapper>
      <Card
        title={`${props.title} (click node to ignore)`}
        bodyStyle={{ padding: '8px 16px' }}
        headStyle={{ padding: '0 16px', margin: '-8px 0' }}
      >
        <Tree defaultExpandAll {...props} treeData={getNodes(props.treeData)} />
      </Card>
    </ResponseTreeWrapper>
  );
};

export default ResponseTree;
