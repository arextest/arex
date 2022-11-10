import './i18n';
import 'jsoneditor/dist/jsoneditor.min.css';
import './assets/css/jsoneditor.less';
import 'allotment/dist/style.css';
import './assets/css/index.less';

import { ClickToComponent } from 'click-to-react-component';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
    <ClickToComponent />
  </BrowserRouter>,
);
