import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: 'https://899ab2ff4de2e35d05c8d76b7a18a596@o1083554.ingest.us.sentry.io/4507525394006016',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
  Sentry.setTag('user', localStorage.getItem('email') || 'anonymous');
};
