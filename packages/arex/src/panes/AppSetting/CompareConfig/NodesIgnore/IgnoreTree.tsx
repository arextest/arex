import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { styled, useTranslation } from 'arex-core';
import React, { FC } from 'react';

type IgnoreTreeProps = Omit<TreeProps, 'treeData'> & {
  loading?: boolean;
  treeData: object;
};

const IgnoreTreeWrapper = styled.div`
  .ant-tree-node-selected {
    text-decoration: line-through;
  }
`;

export function getNodes(object: object, basePath = ''): DataNode[] {
  const entries = Object.entries(object);
  return entries.map(([key, value]) => {
    const path = basePath + key + '/';
    const isSimpleArray = Array.isArray(value) && ['number', 'string'].includes(typeof value[0]);
    const isObject = typeof value === 'object';

    return value && isObject && !isSimpleArray
      ? {
          title: key,
          key: path,
          children: getNodes(Array.isArray(value) ? value[0] || {} : value, path),
        }
      : { title: key, key: path, value };
  });
}

const IgnoreTree: FC<IgnoreTreeProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);

  // 过滤出 object 类型的节点
  return (
    <IgnoreTreeWrapper>
      <Card size='small' title={t('appSetting.clickToIgnore')}>
        <Tree
          multiple
          defaultExpandAll
          {...props}
          treeData={getNodes(props.treeData, '')}
          // @ts-ignore
          height={'calc(100vh - 240px)'}
        />
      </Card>
    </IgnoreTreeWrapper>
  );
};

export default IgnoreTree;
