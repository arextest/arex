import { SettingOutlined } from '@ant-design/icons';
import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import UserSetting from './UserSetting';

export default createArexPane(UserSetting, {
  type: PanesType.USER_SETTING,
  icon: <SettingOutlined />,
});
