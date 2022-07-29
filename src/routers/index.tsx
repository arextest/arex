import MainBox from '../layouts/MainBox';

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
