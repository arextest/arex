import { ApiOutlined } from '@ant-design/icons';
import { createArexMenu } from 'arex-core';
import React, { useEffect } from 'react';

import CollectionMenu from '../components/CollectionMenu';
import { MenusType, PanesType } from '../constant';
// import { queryWorkspaceById } from '../services/FileSystemService/queryWorkspaceById';

export default createArexMenu(CollectionMenu, {
  type: MenusType.COLLECTION,
  paneType: PanesType.REQUEST,
  icon: <ApiOutlined />,
});
