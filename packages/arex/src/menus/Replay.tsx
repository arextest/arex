import { HistoryOutlined } from '@ant-design/icons';
import { createArexMenu } from 'arex-core';
import React from 'react';

import { AppMenu } from '@/components';
import { MenusType, PanesType } from '@/constant';

export default createArexMenu((props) => <AppMenu {...props} />, {
  type: MenusType.REPLAY,
  paneType: PanesType.REPLAY,
  icon: <HistoryOutlined />,
});
