import { css } from '@emotion/react';
import { Badge, Card, Tree } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import { FC } from 'react';

import { SortNode } from '../../../../services/AppSetting.type';
import { useStore } from '../../../../store';

type ResponseTreeProps = Omit<TreeProps, 'treeData'> & {
  sortNodeList?: SortNode[];
  treeData: object;
  title?: string;
};

const ArrayTree: FC<ResponseTreeProps> = (props) => {
  const {
    userInfo: {
      profile: { theme },
    },
  } = useStore();

  function getNodes(object: object, basePath = ''): DataNode[] {
    const entries = Object.entries(object).filter(([, value]) => Array.isArray(value));
    return entries.map(([key, value]) => {
      const path = basePath + key + '/';
      return value && typeof value === 'object'
        ? {
            title: key,
            key: path,
            children: getNodes(value, path),
            icon: props.sortNodeList?.find((node) => node.path === path)?.listPath?.length && (
              <Badge color={theme.split('-')[1]} />
            ), // 已配置过的节点使用圆点进行提示
          }
        : { title: key, key: path, value };
    });
  }

  return (
    <Card
      bordered={false}
      title={`${props.title} (click node to ignore)`}
      bodyStyle={{ padding: '8px 16px' }}
      headStyle={{ padding: '0 16px', margin: '-8px 0' }}
    >
      <Tree
        showIcon
        defaultExpandAll
        {...props}
        selectedKeys={[]}
        treeData={getNodes(props.treeData, '')}
        css={css`
          .ant-tree-icon__customize {
            position: absolute;
            left: -16px;
          }
        `}
      />
    </Card>
  );
};

export default ArrayTree;
