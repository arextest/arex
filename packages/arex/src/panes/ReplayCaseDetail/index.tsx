import { FileSearchOutlined } from '@ant-design/icons';
import { createArexPane } from '@arextest/arex-core';
import React from 'react';

import { PanesType } from '@/constant';

import ReplayCaseDetail from './ReplayCaseDetail';

export default createArexPane(ReplayCaseDetail, {
  type: PanesType.CASE_DETAIL,
  icon: <FileSearchOutlined />,
});
