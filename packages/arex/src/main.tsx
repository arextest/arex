import './useWork';
import 'allotment/dist/style.css';
import 'antd/dist/reset.css';
import '@arextest/arex-core/dist/style.css';
import './style/style.css';
import 'dayjs/locale/zh-cn';
// import './helpers/adapter';
import './assets/css/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import App from './App';

console.log('mode', import.meta.env.MODE);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  React.createElement(
    import.meta.env.MODE === 'electron' ? HashRouter : BrowserRouter,
    {},
    <App />,
  ),
);
