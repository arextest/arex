import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { Icon } from '@/components';
import { PanesType } from '@/constant';
import RecordedCase from '@/panes/Replay/AppTopBar/RecordedCase/RecordedCase';

import Traffic from './Traffic';

// @ts-ignore
export default createArexPane(RecordedCase, {
  // TODO did not pass the appName props
  type: PanesType.Traffic,
  icon: <Icon name='Cctv' />,
});
