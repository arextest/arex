import { createArexPane } from 'arex-core';
import React from 'react';

import { MenusType, PanesType } from '@/constant';

import BatchRun from './BatchRun';

export default createArexPane(BatchRun, {
  type: PanesType.BATCH_RUN,
  menuType: MenusType.COLLECTION,
  noPadding: true,
});
