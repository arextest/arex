import { ApiOutlined } from '@ant-design/icons';
import { createArexMenu } from 'arex-core';
import React from 'react';

import { MenusType, PanesType } from '@/constant';

import Collection from './Collection';

export default createArexMenu(Collection, {
  type: MenusType.COLLECTION,
  paneType: PanesType.REQUEST,
  icon: <ApiOutlined />,
});
