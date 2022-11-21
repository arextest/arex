import { Login, MainBox, ValidInvitation } from '../views';
import UpgradeBrowser from '../views/UpgradeBrowser';

export default [
  {
    path: '/',
    element: <MainBox />,
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
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:rType/:rTypeId',
    element: <MainBox />,
  },
];
