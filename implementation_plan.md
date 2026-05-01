# Performance Audit & Redis Caching Implementation Plan

This plan details a platform-wide performance enhancement strategy for BuildBridge. It addresses the Next.js caching issues we experienced earlier by replacing heavy, opaque framework caching with a precise, Redis-backed caching layer. It also includes front-end optimization techniques to reduce load times.

## User Review Required

> [!IMPORTANT]
> To implement Redis, we will use **Upstash Redis** (which is already in your `package.json`). 
> You will need to create a free Redis database at [upstash.com](https://upstash.com/) and provide the following environment variables:
> `UPSTASH_REDIS_REST_URL`
> `UPSTASH_REDIS_REST_TOKEN`
> 
> **Are you okay with creating an Upstash account for this, or do you already have one?**

## Proposed Changes

### 1. Redis Caching Layer (`@upstash/redis`)

We will introduce a dedicated caching utility to handle high-traffic, read-heavy pages. This replaces `revalidate = 0` with a smart cache that guarantees speed without sacrificing freshness.

#### [NEW] `src/lib/redis.ts`
- Create a Redis client singleton using `@upstash/redis`.
- Implement wrapper functions: `getCachedData(key, fetcher, ttl)` and `invalidateCache(key)`.

#### [MODIFY] `src/app/browse/page.tsx` (Browse Needs)
- Wrap the Supabase `needs` fetch inside the Redis caching utility.
- Set a Time-to-Live (TTL) of 60 seconds.

#### [MODIFY] `src/app/impact/page.tsx` (Impact Wall)
- Remove `export const revalidate = 0;` (which currently forces a slow database query on every single page load).
- Wrap the `impact_wall_submissions` fetch inside the Redis caching utility with a TTL of 30 seconds.

#### [MODIFY] `src/app/actions/impact.ts` & `src/app/dashboard/create-need/actions.ts`
- Integrate `invalidateCache()` calls. When a user submits a new need or impact story, the server action will automatically delete the corresponding Redis key. This ensures the user instantly sees their submission on the next page load, while still maintaining high performance for all other visitors.

---

### 2. Front-End Performance & Asset Optimization

The platform currently loads heavy libraries and raw images, which slows down the Initial Page Load (LCP).

#### [MODIFY] All Image Components (`ImpactCard`, `NeedCard`, `OnboardingForm`)
- Replace standard HTML `<img>` tags with Next.js `<Image>` components.
- This will automatically compress, resize, and convert images to WebP format, drastically reducing data usage on mobile devices.

#### [MODIFY] Heavy Third-Party Libraries
- Ensure `framer-motion` features are properly optimized (using `LazyMotion` if the bundle size is too large).
- Verify that `lottie-react` (used for success confetti) is strictly lazy-loaded via `next/dynamic` to prevent it from blocking the main JavaScript thread during initial page load.

---

### 3. Database Query Optimization (Supabase)

#### [MODIFY] Supabase Queries
- Analyze the queries in `/browse` and `/impact`. Currently, we are pulling nested relations (e.g., `profiles(full_name, location_lga)`). We will ensure we only select the explicit columns required for the UI, minimizing payload size over the network.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify bundle sizes (specifically checking if the JavaScript payload for `/browse` and `/impact` has decreased).
- Monitor Next.js server console logs to verify that Redis cache hits and misses are functioning properly.

### Manual Verification
- **Speed Test**: Open the network tab and simulate Fast 3G throttling to observe the loading speed of images and JSON payloads.
- **Cache Invalidation Test**: Submit a new story on the Impact Wall and verify it appears immediately (triggering a Redis cache purge), while subsequent reloads hit the fast Redis cache.
