import Login from '../pages/Login';
import MainBox from '../pages/MainBox';
// import Welcome from '../pages/welcome';
const router = [
  {
    path: '/',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:paneType/:rawId',
    element: <MainBox />,
  },
  // {
  //   path: '/welcome',
  //   element: <Welcome />,
  // },
  {
    path: '/login',
    element: <Login />,
  },
];
export default router;
