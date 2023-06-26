import { SettingOutlined } from '@ant-design/icons';
import { createArexMenu } from '@arextest/arex-core';
import React from 'react';

import { AppMenu } from '@/components';
import { MenusType, PanesType } from '@/constant';

export default createArexMenu((props) => <AppMenu {...props} />, {
  type: MenusType.APP_SETTING,
  paneType: PanesType.APP_SETTING,
  icon: <SettingOutlined />,
});
