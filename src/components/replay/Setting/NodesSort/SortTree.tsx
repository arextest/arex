import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { FC } from 'react';

type SortTreeProps = Omit<TreeProps, 'treeData'> & {
  treeData?: any[];
  title?: string;
};

const SortTree: FC<SortTreeProps> = (props) => {
  function getNodes(data?: any[] | object, basePath = ''): DataNode[] {
    if (!data || (Array.isArray(data) && !data?.length)) return [];

    const sample = Array.isArray(data) ? data[0] : data;

    if (['number', 'string'].includes(typeof sample))
      return [{ title: '%value%', key: basePath + '%value%/' }];

    const entries = Object.entries(sample);
    return entries.map(([key, value]) => {
      const path = basePath + key + '/';
      return value && typeof value === 'object'
        ? {
            title: key,
            key: path,
            children: getNodes(Array.isArray(value) ? value[0] || [] : value, path),
          }
        : { title: key, key: path, value: path };
    });
  }

  return (
    <Card
      bordered={false}
      title={`${props.title} (choose key to sort)`}
      bodyStyle={{ padding: '8px 16px' }}
      headStyle={{ padding: '0 16px', margin: '-8px 0' }}
    >
      <Tree
        {...props}
        checkable
        checkStrictly
        defaultExpandAll
        autoExpandParent
        selectedKeys={[]}
        treeData={getNodes(props.treeData, '')}
      />
    </Card>
  );
};

export default SortTree;
