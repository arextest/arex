import { Login, MainBox, ValidInvitation } from '../views';

export default [
  {
    path: '/',
    element: <MainBox />,
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
