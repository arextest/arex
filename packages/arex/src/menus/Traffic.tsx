import { createArexMenu } from '@arextest/arex-core';
import React from 'react';

import { Icon } from '@/components';
import { MenusType, PanesType } from '@/constant';

import { ReplayMenu } from './Replay';

export default createArexMenu((props) => <ReplayMenu paneType={PanesType.Traffic} {...props} />, {
  type: MenusType.Traffic,
  paneType: PanesType.Traffic,
  icon: <Icon name='Cctv' />,
});
