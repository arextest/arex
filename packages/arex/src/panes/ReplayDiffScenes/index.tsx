import { ApartmentOutlined } from '@ant-design/icons';
import { createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import ReplayDiffScenes from './ReplayDiffScenes';

export default createArexPane(ReplayDiffScenes, {
  type: PanesType.DIFF_SCENES,
  icon: <ApartmentOutlined />,
});
