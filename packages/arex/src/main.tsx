import './userWorker';
import 'allotment/dist/style.css';
import 'antd/dist/reset.css';
import './style/style.css';
// import 'arex-core/dist/style.css';
import 'dayjs/locale/zh-cn';
import './helpers/adapter';
import './assets/css/index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
