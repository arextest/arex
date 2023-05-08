import { GlobalOutlined } from '@ant-design/icons';
import { createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import Workspace from './Workspace';

export default createArexPane(Workspace, {
  type: PanesType.WORKSPACE,
  icon: <GlobalOutlined />,
});
