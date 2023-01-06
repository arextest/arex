import React from 'react';

import { Login, MainBox, ValidInvitation } from '../views';
import UpgradeBrowser from '../views/UpgradeBrowser';

const router = [
  {
    path: '/',
    element: <MainBox />,
    auth: true,
  },
  {
    path: '/upgradebrowser',
    element: <UpgradeBrowser />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/click',
    element: <ValidInvitation />,
  },

  {
    path: '/:workspaceId/workspace/:workspaceName',
    element: <MainBox />,
    auth: true,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:rType/:rTypeId',
    element: <MainBox />,
    auth: true,
  },
];

const FreePath = router.reduce<string[]>((list, cur) => {
  if (!cur.auth) {
    list.push(cur.path);
  }
  return list;
}, []);

export default router;
export { FreePath };
