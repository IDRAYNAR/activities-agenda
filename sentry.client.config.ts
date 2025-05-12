// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://1f6759c75107b5a3443ce3460c581d27@o4507622359171072.ingest.de.sentry.io/4509310130978896",
  
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration()
  ],
  
  // Tracing configuration
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  
  // Set tracePropagationTargets to your domain and API endpoints
  tracePropagationTargets: ["activities-agenda.vercel.app", /^https:\/\/activities-agenda\.vercel\.app\/api\/activities/],
  
  // Set profilesSampleRate to 1.0 to profile every transaction
  profilesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true,
}); 