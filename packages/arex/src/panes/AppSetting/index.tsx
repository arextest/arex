import { ControlOutlined } from '@ant-design/icons';
import { createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import AppSetting from './AppSetting';

export default createArexPane(AppSetting, {
  type: PanesType.APP_SETTING,
  icon: <ControlOutlined />,
});
