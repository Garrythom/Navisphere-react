import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mirrors the old Django tracking_lookup rate limit (django-ratelimit, 15/min per IP,
// block=False — request still goes through, the page just shows a "too many attempts"
// message instead of performing the lookup). In-memory per-instance counter: an
// intentional tradeoff over a shared store like Upstash Redis, see supabase/README.md.

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 15;

const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [key, value] of buckets) {
      if (now > value.resetAt) buckets.delete(key);
    }
  }

  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

export function proxy(request: NextRequest) {
  const limited = isRateLimited(getClientIp(request));

  const requestHeaders = new Headers(request.headers);
  if (limited) {
    requestHeaders.set("x-rate-limited", "1");
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: "/tracking",
};
