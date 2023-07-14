import { css, EmptyWrapper, useTranslation } from '@arextest/arex-core';
import { Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import React, { FC } from 'react';

type SortTreeProps = Omit<TreeProps, 'treeData'> & {
  treeData?: any[];
  title?: string;
};

const SortTree: FC<SortTreeProps> = (props) => {
  const { t } = useTranslation('components');

  function getNodes(data?: any[] | object, basePath = ''): DataNode[] {
    if (!data || (Array.isArray(data) && !data?.length)) return [];

    const sample = Array.isArray(data) ? data[0] : data;

    if (['number', 'string'].includes(typeof sample))
      return [{ title: '%value%', key: basePath + '%value%/' }];

    const entries = Object.entries<any>(sample);
    return entries.map(([key, value]) => {
      const losslessValue = value.isLosslessNumber ? value.value : value;

      const path = basePath + key + '/';
      return losslessValue && typeof losslessValue === 'object'
        ? {
            title: key,
            key: path,
            children: getNodes(
              Array.isArray(losslessValue) ? losslessValue[0] || [] : losslessValue,
              path,
            ),
          }
        : { title: key, key: path, value: path };
    });
  }

  return (
    <Card size='small' title={t('appSetting.chooseOnekey')}>
      <EmptyWrapper
        loading={false}
        description={t('appSetting.emptyContractTip')}
        empty={!Object.keys(props.treeData || {}).length}
      >
        <Tree
          {...props}
          checkable
          checkStrictly
          defaultExpandAll
          autoExpandParent
          selectedKeys={[]}
          treeData={getNodes(props.treeData, '')}
          css={css`
            max-height: calc(100vh - 300px);
            overflow-y: auto;
          `}
        />
      </EmptyWrapper>
    </Card>
  );
};

export default SortTree;
