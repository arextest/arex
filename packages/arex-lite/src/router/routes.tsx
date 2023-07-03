import { RouterPath } from '@arextest/arex-core';
import { Spin } from 'antd';
import React, { FC, lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import Home from '@/pages';

export type Routes = {
  path: string;
  component: React.LazyExoticComponent<FC> | FC;
  children?: Routes[];
};

// TODO: add your routes here
const OthersRouter: Routes[] = [
  {
    path: '/login',
    component: lazy(() => import('../pages/Login')),
  },
];

const routes: Routes[] = Object.values(RouterPath)
  .map<Routes>((path) => ({
    path,
    component: Home,
  }))
  .concat(OthersRouter);

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
