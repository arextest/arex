import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { MenusType, PanesType } from '@/constant';

import Request from './Request';

export default createArexPane(Request, {
  type: PanesType.REQUEST,
  menuType: MenusType.COLLECTION,
  icon: 'Get',
  noPadding: true,
});
