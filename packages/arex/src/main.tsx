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

import App from './App';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://dbce6335a11036ae21b7a6c31fad3db5@o1083554.ingest.us.sentry.io/4507209052192768",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  React.createElement(isClientProd ? HashRouter : BrowserRouter, {}, <App />),
);
