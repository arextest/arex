import './i18n';
import './assets/css/index.css';
import './theme/style.css';
import 'allotment/dist/style.css';
import 'antd/dist/reset.css';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';

import * as Sentry from '@sentry/react';
import { ClickToComponent } from 'click-to-react-component';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
if (import.meta.env.MODE !== 'development') {
  Sentry.init({
    dsn: 'https://bd34e6a640f44ebdad2e05fd993474bd@sentry-performance.ctrip.com/3',
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <ClickToComponent />
    <App />
  </BrowserRouter>,
);
