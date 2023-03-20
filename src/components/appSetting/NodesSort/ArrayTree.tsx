import { css } from '@emotion/react';
import { Badge, Card, Spin, Tree, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useColorPrimary } from '../../../hooks';
import { SortNode } from '../../../services/AppSetting.type';

type ResponseTreeProps = Omit<TreeProps, 'treeData'> & {
  sortNodeList?: SortNode[];
  loading?: boolean;
  treeData: object;
  title?: string;
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
          const path = basePath + key + '/';
          return value && typeof value === 'object'
            ? {
                title: key,
                key: path,
                children: getNodes(Array.isArray(value) ? value[0] || {} : value, path),
                disabled: !Array.isArray(value),
                icon: props.sortNodeList?.find((node) => node.path === path)?.pathKeyList
                  ?.length && <Badge color={color.name} />, // 已配置过的节点使用圆点进行提示
              }
            : { title: key, key: path, value, disabled: !Array.isArray(value) };
        })
        // 过滤非数组子节点
        .filter((item) => item.children || Array.isArray(item.value))
    );
  }

  const nodesData = useMemo(() => getNodes(props.treeData, ''), [props.treeData]);

  return (
    <Card
      bordered={false}
      title={
        <Typography.Text ellipsis>{`${props.title} (${t(
          'appSetting.chooseOneNode',
        )})`}</Typography.Text>
      }
      bodyStyle={{ padding: '8px 16px' }}
      headStyle={{ padding: '0 16px', margin: '-8px 0' }}
    >
      <Spin spinning={props.loading}>
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
      </Spin>
    </Card>
  );
};

export default ArrayTree;
