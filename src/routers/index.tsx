import MainBox from '../layouts/mainbox/mainbox';

export default [
  {
    path: '/',
    element: <MainBox />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/*',
    element: <MainBox />,
  },
];
