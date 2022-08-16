import { Login } from '../components';
import MainBox from '../layouts/MainBox';
import ValidInvitation from '../components/Login/ValidInvitation';

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
