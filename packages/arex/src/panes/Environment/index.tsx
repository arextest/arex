import { DeploymentUnitOutlined } from '@ant-design/icons';
import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import Environment from './Environment';

export default createArexPane(Environment, {
  type: PanesType.ENVIRONMENT,
  menuType: PanesType.ENVIRONMENT,
  icon: <DeploymentUnitOutlined />,
});
