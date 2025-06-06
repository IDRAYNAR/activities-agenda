// @ts-check

/** @type {import("@sentry/nextjs").BrowserOptions} */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4a6e2dc39c9b910ba092626801f6e898@o4509310083137536.ingest.de.sentry.io/4509311496880208",
  integrations: [
    Sentry.browserTracingIntegration(),
    // Sentry.browserProfilingIntegration(),
    // Sentry.replayIntegration({ // Conserver l'intégration Replay si elle était déjà là
    //   // Additional Replay configuration goes in here, for example:
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
  ],
  // Tracing
  tracesSampleRate: 0.1, //  Capture 10% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Set profilesSampleRate to 0.1 to profile a portion of transactions.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.1 and profilesSampleRate of 0.1 would
  // results in 1% of transactions being profiled (0.1*0.1=0.01)
  profilesSampleRate: 0.1,

  // Debugging - vous pouvez le conserver ou le supprimer selon vos besoins
  debug: false,

  // Conserver la configuration Replay si elle était là
  replaysOnErrorSampleRate: 0.1,
  replaysSessionSampleRate: 0.01,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;