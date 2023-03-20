import { useRequest } from 'ahooks';
import { Space, Typography } from 'antd';
import React, { FC } from 'react';

import AppSettingService from '../../../../../services/AppSetting.service';
import PathCollapse from '../../../../appSetting/NodesIgnore/PathCollapse';
import { Label } from '../../../../styledComponents';

export type CompareConfigProps = {
  interfaceId: string;
  operationId?: string;
};
const CompareConfig: FC<CompareConfigProps> = (props) => {
  const {
    data: ignoreNodeList = [],
    loading: loadingIgnoreNode,
    run: queryIgnoreNode,
  } = useRequest(
    () =>
      AppSettingService.queryInterfaceIgnoreNode({
        interfaceId: props.interfaceId,
        operationId: props.operationId,
      }),
    {
      onSuccess(res) {
        console.log('queryInterfaceIgnoreNode', res);
      },
    },
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

      <PathCollapse
        manualEdit
        interfaceId={props.interfaceId}
        loadingPanel={loadingIgnoreNode}
        interfaces={[{ id: props.interfaceId, operationName: 'Node Ignore' }]}
        activeKey={props.interfaceId}
        ignoreNodes={ignoreNodeList}
        onReloadNodes={queryIgnoreNode}
      />
    </>
  );
};

export default CompareConfig;
