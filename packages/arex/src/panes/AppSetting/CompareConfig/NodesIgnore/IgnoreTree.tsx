import { EmptyWrapper, styled, useTranslation } from '@arextest/arex-core';
import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import React, { FC, useMemo } from 'react';

import { getIgnoreNodes } from './utils';

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
  const treeData = useMemo(() => getIgnoreNodes(props.treeData, ''), [props.treeData]);

  return (
    <IgnoreTreeWrapper>
      <Card size='small' title={t('appSetting.clickToIgnore')}>
        <EmptyWrapper
          loading={props.loading}
          empty={!Object.keys(props.treeData).length}
          description={t('appSetting.emptyContractTip')}
        >
          <Tree multiple defaultExpandAll height={800} {...props} treeData={treeData} />
        </EmptyWrapper>
      </Card>
    </IgnoreTreeWrapper>
  );
};

export default IgnoreTree;
