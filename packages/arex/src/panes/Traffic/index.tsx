import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { Icon } from '@/components';
import { PanesType } from '@/constant';

import Traffic from './Traffic';

export default createArexPane(Traffic, {
  type: PanesType.Traffic,
  icon: <Icon name='Cctv' />,
});
