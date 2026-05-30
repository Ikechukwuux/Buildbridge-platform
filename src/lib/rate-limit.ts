import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"
import type { NextRequest } from "next/server"

const isRedisConfigured = Boolean(process.env.UPSTASH_REDIS_REST_URL)

type Limiter = Ratelimit

const cache = new Map<string, Limiter>()

/**
 * Build (and memoise) a sliding-window rate limiter.
 *
 * @param prefix   Unique namespace, e.g. "payment_init"
 * @param max      Max requests per window
 * @param window   Window expressed in @upstash/ratelimit duration syntax: "1 m", "10 m", "1 h"
 */
function makeLimiter(prefix: string, max: number, window: `${number} ${"s" | "m" | "h"}`): Limiter | null {
  if (!isRedisConfigured) return null
  const key = `${prefix}::${max}::${window}`
  const existing = cache.get(key)
  if (existing) return existing
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix: `bb:rl:${prefix}`,
    analytics: false,
  })
  cache.set(key, limiter)
  return limiter
}

/**
 * Brief-mandated limits (Section 04, Section 08):
 * - Payment initiation: 5/min/IP
 * - Account creation: 3/hour/IP
 * - Login attempts: 5/10 min/IP before lockout
 * - OTP send: 5/10 min/IP
 */
export const RateLimiters = {
  payment: () => makeLimiter("payment", 5, "1 m"),
  accountCreate: () => makeLimiter("account_create", 3, "1 h"),
  login: () => makeLimiter("login", 5, "10 m"),
  otpSend: () => makeLimiter("otp_send", 5, "10 m"),
  otpVerify: () => makeLimiter("otp_verify", 5, "10 m"),
} as const

/**
 * Pull the caller's IP from the request. Vercel + most proxies set
 * x-forwarded-for to a comma-separated list; the first entry is the client.
 */
export function getClientIp(req: NextRequest | Request): string {
  const headers = req.headers
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return headers.get("x-real-ip") || "anonymous"
}

/**
 * Returns a 429 Response when the caller is over the limit, or `null` to
 * continue. When Redis is not configured (e.g. local dev without Upstash
 * credentials), returns `null` so flows still work.
 */
export async function enforceRateLimit(
  limiter: Limiter | null,
  identifier: string
): Promise<Response | null> {
  if (!limiter) return null

  const { success, limit, reset, remaining } = await limiter.limit(identifier)
  if (success) return null

  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  const body = {
    success: false,
    error: "Too many requests. Please slow down and try again shortly.",
    retry_after_seconds: retryAfter,
  }
  return new Response(JSON.stringify(body), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(reset),
    },
  })
}
