import { HistoryOutlined } from '@ant-design/icons';
import { createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import ReplayCase from './ReplayCase';

export default createArexPane(ReplayCase, {
  type: PanesType.REPLAY_CASE,
  icon: <HistoryOutlined />,
});
