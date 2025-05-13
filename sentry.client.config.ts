// @ts-check

/** @type {import("@sentry/nextjs").BrowserOptions} */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4a6e2dc39c9b910ba092626801f6e898@o4509310083137536.ingest.de.sentry.io/4509311496880208",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration({ // Conserver l'intégration Replay si elle était déjà là
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
  // results in 25% of transactions being profiled (0.5*0.5=0.25)
  profilesSampleRate: 1.0,

  // Debugging - vous pouvez le conserver ou le supprimer selon vos besoins
  debug: false,

  // Conserver la configuration Replay si elle était là
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;