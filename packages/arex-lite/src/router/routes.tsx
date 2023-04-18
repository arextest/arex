import React, { FC, lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

export type Routes = {
  path: string;
  component: React.LazyExoticComponent<FC>;
  children?: Routes[];
};

const routes: Routes[] = [
  {
    path: '/',
    component: lazy(() => import('../pages')),
  },
  {
    path: '/:workspaceId/workspace/:workspaceName/:paneType/:rawId',
    component: lazy(() => import('../pages')),
  },

  {
    path: '/login',
    component: lazy(() => import('../pages/Login')),
  },
];

const syncRouter = (table: Routes[]): RouteObject[] =>
  table.map((route) => ({
    path: route.path,
    element: (
      <Suspense fallback={<div>loading...</div>}>
        <route.component />
      </Suspense>
    ),
    children: route.children && syncRouter(route.children),
  }));

export default syncRouter(routes);
