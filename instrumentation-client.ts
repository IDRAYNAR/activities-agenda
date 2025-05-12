// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1f6759c75107b5a3443ce3460c581d27@o4507622359171072.ingest.de.sentry.io/4509310130978896",

  // Add all necessary integrations
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
  ],

  // Tracing configuration
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  
  // Set tracePropagationTargets to your domain and API endpoints
  tracePropagationTargets: ["activities-agenda.vercel.app", /^https:\/\/activities-agenda\.vercel\.app\/api/],
  
  // Set profilesSampleRate to 1.0 to profile every transaction
  profilesSampleRate: 1.0,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;