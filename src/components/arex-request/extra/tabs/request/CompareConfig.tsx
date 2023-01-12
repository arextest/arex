import { Divider, Space, Typography } from 'antd';
import React, { FC } from 'react';

import NodesIgnore from '../../../../appSetting/NodesIgnore';
import NodesSort from '../../../../appSetting/NodesSort';
import { Label } from '../../../../styledComponents';

export type CompareConfigProps = {
  interfaceId: string;
  operationId?: string | null;
};
const CompareConfig: FC<CompareConfigProps> = (props) => {
  return (
    <div style={{ padding: '8px 0' }}>
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

      <NodesIgnore interfaceId={props.interfaceId} operationId={props.operationId} />

      <Divider style={{ margin: '0 0 16px 0' }} />

      <NodesSort interfaceId={props.interfaceId} operationId={props.operationId} />
    </div>
  );
};

export default CompareConfig;
