import { useRequest } from 'ahooks';
import { Space, Typography } from 'antd';
import React, { FC } from 'react';

import AppSettingService from '../../../../../services/AppSetting.service';
import NodesIgnore from '../../../../appSetting/NodesIgnore';
import NodesSort from '../../../../appSetting/NodesSort';
import { Label } from '../../../../styledComponents';

export type CompareConfigProps = {
  interfaceId: string;
  operationId?: string | null;
};
const CompareConfig: FC<CompareConfigProps> = (props) => {
  useRequest(() =>
    AppSettingService.queryInterfaceSortNode({
      interfaceId: props.interfaceId,
      operationId: props.operationId,
    }),
  );

  return (
    <>
      <Space size='large'>
        <Typography.Text type='secondary'>
          <Label>interfaceId</Label>
          {props.interfaceId}
        </Typography.Text>
        <Typography.Text type='secondary'>
          <Label>operationId</Label>
          {props.operationId}
        </Typography.Text>
      </Space>

      <NodesIgnore interfaceId={props.interfaceId} operationId={props.operationId} />

      {/*<NodesSort  interfaceId={props.interfaceId} />*/}
    </>
  );
};

export default CompareConfig;
