import { Spin } from 'antd';
import { RouterPath } from 'arex-core';
import React, { FC, lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import Home from '../pages';

export type Routes = {
  path: string;
  component: React.LazyExoticComponent<FC> | FC;
  children?: Routes[];
};

const routes: Routes[] = Object.values(RouterPath)
  .map<Routes>((path) => ({
    path,
    component: Home,
  }))
  .concat([
    {
      path: '/playground',
      component: lazy(() => import('../pages/Playground')),
    },
    {
      path: '/login',
      component: lazy(() => import('../pages/Login')),
    },
  ]);

const syncRouter = (table: Routes[]): RouteObject[] =>
  table.map((route) => ({
    path: route.path,
    element: (
      <Suspense fallback={<Spin style={{ padding: '8px' }} />}>
        <route.component />
      </Suspense>
    ),
    children: route.children && syncRouter(route.children),
  }));

export default syncRouter(routes);
