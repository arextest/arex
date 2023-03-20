import React from 'react';

import { Login, Logs, MainBox, ValidInvitation } from '../pages';
import UpgradeBrowser from '../pages/UpgradeBrowser';
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
    path: '/logs',
    element: <Logs />,
  },
  {
    path: '/click',
    element: <ValidInvitation />,
  },
  {
    path: '/:workspaceId/:workspaceName/:pagesType/:rawId',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId',
    element: <MainBox />,
    auth: true,
  },
  {
    path: '/:workspaceId/:pagesType/:rawId',
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
