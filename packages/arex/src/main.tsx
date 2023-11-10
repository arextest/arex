import '@arextest/arex-core/dist/style.css';
import '@/utils/electrionOverride';
import 'dayjs/locale/zh-cn';
import './style/style.css';
import './useWork';
import './utils/axiosGuard';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import { isClientProd } from '@/constant';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  React.createElement(isClientProd ? HashRouter : BrowserRouter, {}, <App />),
);
