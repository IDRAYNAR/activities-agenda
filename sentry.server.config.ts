// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// @ts-check

/** @type {import("@sentry/nextjs").NodeOptions} */

import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://4a6e2dc39c9b910ba092626801f6e898@o4509310083137536.ingest.de.sentry.io/4509311496880208",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Définir le taux d'échantillonnage pour le profilage (relatif à tracesSampleRate)
  profilesSampleRate: 1.0,

  // Ajouter l'intégration de Profiling
  integrations: [
    nodeProfilingIntegration(),
  ],

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
