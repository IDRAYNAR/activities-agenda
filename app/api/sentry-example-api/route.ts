import { NextResponse } from "next/server";

// Changed from force-dynamic to allow caching
export const dynamic = "force-static";

// Add cache revalidation settings
export const revalidate = 3600; // revalidate every hour

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
