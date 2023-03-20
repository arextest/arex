import { CodeOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NodesIgnore from '../../../../appSetting/NodesIgnore';
import NodesSort, { SettingNodesSortRef } from '../../../../appSetting/NodesSort';
import { Label, SpaceBetweenWrapper } from '../../../../styledComponents';

export type CompareConfigProps = {
  interfaceId: string;
  operationId?: string | null;
};
const CompareConfig: FC<CompareConfigProps> = (props) => {
  const { t } = useTranslation(['components', 'common']);
  const nodeSortRef = useRef<SettingNodesSortRef>(null);

  return (
    <div style={{ padding: '8px 0' }}>
      <SpaceBetweenWrapper>
        <Space size='large'>
          <Typography.Text type='secondary'>
            <Label>InterfaceId</Label>
            {props.interfaceId}
          </Typography.Text>
          <Typography.Text type='secondary'>
            <Label>OperationId</Label>
            {props.operationId}
          </Typography.Text>
        </Space>

        <Button
          size='small'
          key='editResponse'
          icon={<CodeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            nodeSortRef.current?.onEditResponse?.({
              id: props.interfaceId,
              operationName: 'NodeSort',
            });
          }}
        >
          {t('appSetting.editResponse')}
        </Button>
      </SpaceBetweenWrapper>

      <NodesIgnore interfaceId={props.interfaceId} operationId={props.operationId} />

      <NodesSort
        modalTree
        ref={nodeSortRef}
        interfaceId={props.interfaceId}
        operationId={props.operationId}
      />
    </div>
  );
};

export default CompareConfig;
