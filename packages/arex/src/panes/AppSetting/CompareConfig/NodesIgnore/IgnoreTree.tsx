import { styled, useTranslation } from '@arextest/arex-core';
import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
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
    const losslessValue = value.isLosslessNumber ? value.value : value;
    const isSimpleArray =
      Array.isArray(losslessValue) && ['number', 'string'].includes(typeof losslessValue[0]);
    const isObject = typeof losslessValue === 'object';

    const path = basePath + key + '/';

    return losslessValue && isObject && !isSimpleArray
      ? {
          title: key,
          key: path,
          children: getNodes(
            Array.isArray(losslessValue) ? losslessValue[0] || {} : losslessValue,
            path,
          ),
        }
      : { title: key, key: path, lossLessValue: losslessValue };
  });
}

const IgnoreTree: FC<IgnoreTreeProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);

  console.log(props.treeData, getNodes(props.treeData, ''));
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
