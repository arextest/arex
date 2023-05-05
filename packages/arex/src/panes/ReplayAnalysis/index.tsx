import { DiffOutlined } from '@ant-design/icons';
import { createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '../../constant';
import ReplayAnalysis from './ReplayAnalysis';

export default createArexPane(ReplayAnalysis, {
  type: PanesType.REPLAY_ANALYSIS,
  icon: <DiffOutlined />,
});
