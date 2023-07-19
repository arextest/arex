import { EmptyWrapper, useTranslation } from '@arextest/arex-core';
import { css } from '@emotion/react';
import { Badge, Card, Tree, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useMemo } from 'react';

import { useColorPrimary } from '@/hooks';
import { SortNode } from '@/services/ComparisonService';

type ResponseTreeProps = Omit<TreeProps, 'treeData'> & {
  loading?: boolean;
  sortNodeList?: SortNode[];
  treeData?: object;
  onEditResponse?: () => void;
};

const ArrayTree: FC<ResponseTreeProps> = (props) => {
  const { t } = useTranslation('components');

  const color = useColorPrimary();
  function getNodes(object: object, basePath = ''): DataNode[] {
    const entries = Object.entries(object);
    return (
      entries
        .map(([key, value]) => {
          const losslessValue = value.isLosslessNumber ? value.value : value;

          const path = basePath + key + '/';
          return losslessValue && typeof losslessValue === 'object'
            ? {
                title: key,
                key: path,
                children: getNodes(
                  Array.isArray(losslessValue) ? losslessValue[0] || {} : losslessValue,
                  path,
                ),
                disabled: !Array.isArray(losslessValue),
                icon: props.sortNodeList?.find((node) => node.path === path)?.pathKeyList
                  ?.length && <Badge color={color.name} />, // 已配置过的节点使用圆点进行提示
              }
            : {
                title: key,
                key: path,
                value: losslessValue,
                disabled: !Array.isArray(losslessValue),
              };
        })
        // 过滤非数组子节点
        .filter((item) => item.children || Array.isArray(item.value))
    );
  }

  const nodesData = useMemo(() => getNodes(props.treeData || {}, ''), [props.treeData]);

  return (
    <Card
      size='small'
      title={<Typography.Text ellipsis>{t('appSetting.chooseOneNode')}</Typography.Text>}
    >
      <EmptyWrapper
        loading={props.loading}
        description={t('appSetting.emptyContractTip')}
        empty={!nodesData?.length}
      >
        <Tree
          showIcon
          defaultExpandAll
          {...props}
          selectedKeys={[]}
          treeData={nodesData}
          css={css`
            max-height: calc(100vh - 300px);
            overflow-y: auto;
            .ant-tree-icon__customize {
              float: right;
            }
          `}
        />
      </EmptyWrapper>
    </Card>
  );
};

export default ArrayTree;
