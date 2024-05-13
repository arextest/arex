import { HistoryOutlined } from '@ant-design/icons';
import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { MenusType, PanesType } from '@/constant';

import Replay from './Replay';

export default createArexPane(Replay, {
  type: PanesType.REPLAY,
  menuType: MenusType.APP,
  icon: <HistoryOutlined />,
});
