import { PaneDrawer } from '@arextest/arex-core';
import { DrawerProps } from 'antd';
import React, { FC } from 'react';

import { useTranslation } from '../../hooks';
import ReplayLogs, { ReplayLogsProps } from './ReplayLogs';

export type ReplayLogsDrawerProps = DrawerProps & ReplayLogsProps;

const ReplayLogsDrawer: FC<ReplayLogsDrawerProps> = (props) => {
  const { planId, request, ...restProps } = props;
  const { t } = useTranslation();

  return (
    <PaneDrawer destroyOnClose title={t('replayLogs.logs')} width={'75%'} {...restProps}>
      <ReplayLogs planId={planId} request={request} />
    </PaneDrawer>
  );
};

export default ReplayLogsDrawer;
