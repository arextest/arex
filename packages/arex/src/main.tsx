import '@arextest/arex-core/dist/style.css';
import '@/utils/electrionOverride';
import 'dayjs/locale/zh-cn';
import './style/style.css';
import './useWorker';
import './utils/axiosGuard';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import { isClientProd } from '@/constant';
import { initSentry } from '@/utils/sentry';

import App from './App';

initSentry();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  React.createElement(isClientProd ? HashRouter : BrowserRouter, {}, <App />),
);
