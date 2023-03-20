import styled from '@emotion/styled';
import { Button, Card, Spin, Tree, Typography } from 'antd';
import { TreeProps } from 'antd/es';
import { DataNode } from 'antd/lib/tree';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { SpaceBetweenWrapper } from '../../styledComponents';
import EmptyResponse from './EmptyResponse';

type IgnoreTreeProps = Omit<TreeProps, 'treeData'> & {
  loading?: boolean;
  treeData: object;
  title?: string;
  onSave?: () => void;
  onEditResponse?: () => void;
};
// const IgnoreTreeWrapper = styled.div`
//   .ant-tree-node-selected {
//     text-decoration: line-through;
//   }
// `;

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
    // <IgnoreTreeWrapper>
    <>
      <SpaceBetweenWrapper style={{ paddingBottom: '8px' }}>
        <Typography.Title level={5}>{t('appSetting.dataStructure')}</Typography.Title>
        {/*<Button size='small' type='primary' onClick={() => props.onSave && props.onSave()}>*/}
        {/*  {t('save', { ns: 'common' })}*/}
        {/*</Button>*/}
      </SpaceBetweenWrapper>

      <Card size='small' title={`${props.title} (${t('appSetting.clickToIgnore')})`}>
        <Spin spinning={props.loading}>
          {Object.keys(props.treeData).length ? (
            <Tree
              multiple
              defaultExpandAll
              {...props}
              treeData={getNodes(props.treeData, '')}
              // @ts-ignore
              height={'calc(100vh - 240px)'}
            />
          ) : (
            <EmptyResponse onClick={props.onEditResponse} />
          )}
        </Spin>
      </Card>
    </>
    // </IgnoreTreeWrapper>
  );
};

export default IgnoreTree;
