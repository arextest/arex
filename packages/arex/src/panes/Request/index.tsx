import { HistoryOutlined } from '@ant-design/icons';
import { createArexPane } from 'arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import Request from './Request';

export default createArexPane(Request, {
  type: PanesType.REQUEST,
  icon: <HistoryOutlined />,
});
