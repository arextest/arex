import { Login } from '../components';
import MainBox from '../layouts/MainBox';

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
    path: '/:workspaceId/workspace/:workspaceName',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:rType/:rTypeId',
    element: <MainBox />,
  },
];
