import Index from '../layouts/MainBox';

export default [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/*',
    element: <Index />,
  },
];
