import { NextResponse } from "next/server";

// Revenir à force-dynamic car cette route est conçue pour générer des erreurs
export const dynamic = "force-dynamic";

// Supprimer la revalidation statique
// export const revalidate = 3600;

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}
// A faulty API route to test Sentry's error monitoring
export function GET() {
  throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
  return NextResponse.json({ data: "Testing Sentry Error..." });
}
