# BuildBridge — Pre-Launch Checklist

## Database

- [x] Run `supabase/migrations/008_production_fixes.sql` on the correct Supabase project
- [ ] Confirm all tables exist: `profiles`, `needs`, `pledges`, `verifications`, `vouches`, `waitlist`, `account_deletion_requests`, `impact_wall_submissions`

## Authentication & Admin

- [x] Set admin user's `app_metadata` to `{"role": "admin"}` via the set-admin script
- [ ] Verify `/admin` is inaccessible to non-admin accounts

## Environment Variables (production secrets)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` — production Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — production anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — production service role key
- [ ] `NEXT_PUBLIC_SITE_URL` — set to `https://buildbridge.ng` (or your domain)
- [ ] `IDENTITY_SALT` — generate with `openssl rand -hex 32`, never reuse across environments
- [ ] `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_VERIFY_SERVICE_SID` — live Twilio credentials
- [ ] `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — production Upstash instance
- [ ] `DEEPSEEK_API_KEY` — live DeepSeek key for AI story/impact generation

## Paystack (requires business KYC — start early, can take several days)

- [ ] Complete business KYC in Paystack dashboard (Settings → Business Settings)
  - Business name, type, RC/BN number, settlement bank account
- [ ] Receive live keys once KYC is approved
- [ ] Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` to `pk_live_...`
- [ ] Set `PAYSTACK_SECRET_KEY` to `sk_live_...`
- [ ] Set webhook URL in Paystack dashboard → Settings → API Keys & Webhooks:
  `https://buildbridge.ng/api/webhooks/paystack`
- [ ] Enable Transfers in Paystack dashboard (Settings → Preferences → Transfers)
- [ ] Enable **"Disable OTP for Transfers"** so automated disbursements don't require manual OTP per payout
- [ ] Fund your Paystack balance before approving the first disbursement

## Artisan Disbursement Flow

- [ ] Build a bank details form in the artisan dashboard so artisans can enter their `bank_account_number` and `bank_code` before disbursement can be triggered
  - These fields were added to `profiles` in migration 008 but there is no UI for them yet

## Identity Verification

- [ ] Integrate Dojah or Prembly API in `src/app/api/identity/verify/route.ts`
  - Replace the current manual-review-only flow with a real NIN/BVN API call
  - Add `DOJAH_API_KEY` / `DOJAH_APP_ID` (or Prembly equivalent) to environment variables

## Assets & SEO

- [ ] Add `/public/og-image.png` (1200×630 px) for social sharing cards
- [ ] Confirm favicon `/public/buildbridge-favicon.png` is final

## Pre-Launch Testing

- [ ] End-to-end test: register → create need → pledge (test card) → admin approves → proof submitted → disbursement triggered
- [ ] Confirm Paystack webhook is receiving events (Paystack dashboard → Settings → Webhook logs)
- [ ] Confirm OTP flow works on a real Nigerian phone number (Twilio live account)
- [ ] Test `/admin` is blocked for a regular artisan account
- [ ] Test identity verification submission routes correctly to admin review queue
