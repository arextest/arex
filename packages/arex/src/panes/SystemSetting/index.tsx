import { SettingOutlined } from '@ant-design/icons';
import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import SystemSetting from './SystemSetting';

export default createArexPane(SystemSetting, {
  type: PanesType.SYSTEM_SETTING,
  icon: <SettingOutlined />,
});
