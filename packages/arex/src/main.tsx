import 'allotment/dist/style.css';
import 'antd/dist/reset.css';
import '@arextest/arex-core/dist/style.css';
import './style/style.css';
import 'dayjs/locale/zh-cn';
import './helpers/adapter';
import './assets/css/index.css';

import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
if (import.meta.env.MODE !== 'development') {
  Sentry.init({
    dsn: 'https://93269396efbd4d9eb84c60aabe220cb5@o4505063820034048.ingest.sentry.io/4505418776510464',
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
