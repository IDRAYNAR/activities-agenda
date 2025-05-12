// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://1f6759c75107b5a3443ce3460c581d27@o4507622359171072.ingest.de.sentry.io/4509310130978896",
  
  integrations: [
    nodeProfilingIntegration(),
  ],
  
  // Tracing must be enabled for profiling to work
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: 'trace',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true,
});
