import { PaneDrawer } from '@arextest/arex-core';
import { DrawerProps } from 'antd';
import React, { FC } from 'react';

import ReplayLogs, { ReplayLogsProps } from './ReplayLogs';

export type ReplayLogsDrawerProps = DrawerProps & ReplayLogsProps;

const ReplayLogsDrawer: FC<ReplayLogsDrawerProps> = (props) => {
  const { planId, request, ...restProps } = props;
  return (
    <PaneDrawer destroyOnClose title={'ReplayLogs'} width={'75%'} {...restProps}>
      <ReplayLogs planId={planId} request={request} />
    </PaneDrawer>
  );
};

export default ReplayLogsDrawer;
