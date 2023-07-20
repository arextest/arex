import { EmptyWrapper, styled, useTranslation } from '@arextest/arex-core';
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

const IgnoreTree: FC<IgnoreTreeProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);

  // 过滤出 object 类型的节点
  return (
    <IgnoreTreeWrapper>
      <Card size='small' title={t('appSetting.clickToIgnore')}>
        <EmptyWrapper
          loading={props.loading}
          empty={!Object.keys(props.treeData).length}
          description={t('appSetting.emptyContractTip')}
        >
          <Tree multiple defaultExpandAll {...props} treeData={getNodes(props.treeData, '')} />
        </EmptyWrapper>
      </Card>
    </IgnoreTreeWrapper>
  );
};

export default IgnoreTree;
