# Implementation Plan: Sign-Up (v2) & Backer Flows

This plan outlines the steps required to align the application with the `Sign-Up.md` and `Backer-Flow.md` specifications. It involves significant UX restructuring to prioritize intent over identity, frictionless guest backing, and seamless trust signals.

## User Review Required

> [!IMPORTANT]
> **To make Google Auth work, you must complete these manual steps in the Google Cloud and Supabase Consoles:**
> 1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project (if you don't have one).
> 2. Configure the **OAuth consent screen**.
> 3. Create **OAuth 2.0 Client IDs** (Web application).
>    - Add your Supabase project's callback URL to "Authorized redirect URIs": `https://<YOUR-SUPABASE-PROJECT-ID>.supabase.co/auth/v1/callback`
> 4. Copy your **Client ID** and **Client Secret**.
> 5. Go to your **Supabase Dashboard** -> Authentication -> Providers -> Google.
>    - Enable it, paste the Client ID and Secret.
>    - Turn on "Skip nonce check" if prompted for testing.
> 6. Add your local dev URL (e.g., `http://localhost:3000/auth/callback`) to Supabase Auth -> URL Configuration -> Redirect URLs.

## Proposed Changes

### 1. Tradesperson Sign-Up Flow (OnboardingForm.tsx)

The current `OnboardingForm` starts directly with "Identity / Name" and pushes Auth to the end (`/signup`). We will restructure this completely.

#### [MODIFY] src/components/onboarding/OnboardingForm.tsx
- **Redesign Step Logic:** Overhaul `STEPS` to match the 11-screen spec:
  1. **Who for?** (Myself / Someone else) - *New*
  2. **Amount** (Goal amount + dynamic verification guidance) - *New*
  3. **Account Creation** (Inline Phone / Email / Google). Redirects to Google OAuth, or shows inline OTP/Email fields. - *Moved from `/signup`*
  4. **How it Works** (3-screen carousel). - *New*
  5. **Trade Category** (Icon grid). - *Update existing*
  6. **Location** (State/LGA). - *Keep existing*
  7. **Photo** (Upload). - *Keep existing*
  8. **Story** (Write / Record / AI-Generate). - *Add new AI Generation tab.*
  9. **Profile Preview**. - *New*
  10. **Terms**. - *Update existing*
  11. **Profile Created (Level 0)**. - *New*
- **Persist State:** Use `localStorage` aggressively to ensure if a user bounces out for Google Auth, they return precisely to Step 4 with their Amount and "Who for" selections intact.

#### [NEW] src/app/api/generate-story/route.ts
- Create a new API route to securely wrap an LLM call for the AI Story Generation tab (Screen 8).
- *Question for you:* Do we have an OpenAI or Anthropic API key, or should I mock the AI generation step with a delayed hardcoded response for the demo?

#### [NEW] src/app/auth/callback/route.ts
- Required for Google Auth redirect. Captures the OAuth code from the URL and exchanges it for a Supabase session.

---

### 2. Backer Flow (Guest Checkout & Tipping)

The current flow forces the user to log in before backing, and calculates processing/platform fees by subtracting them from the pledge.

#### [MODIFY] src/components/pledge/PledgeFlow.tsx
- **Remove Auth Wall:** Delete the `if (!user)` check that redirects to `/login`.
- **Change Fee Architecture:**
  - *Current:* Pledge = ₦5000. Tradesperson gets ₦5000 - 5% platform - 1.5% processing.
  - *New:* Pledge = ₦5000. Tradesperson gets ₦5000. Platform fee is 0%. Add an optional **Tip Slider** (0% to 30%, default 10%) that adds to the *Backer's* total cost.
- **Add "Zero Tip" Card:** Implement the gentle nudge card if the tipper selects 0%.
- **Add Backer Preferences:** Add the 3 checkboxes (Anonymous, Newsletter, Contact tradesperson) to the checkout confirm screen.

#### [MODIFY] src/app/needs/[id]/page.tsx
- Reorganize the Need Details Page layout to exactly match the spec:
  - Add the AI Impact Statement as a styled pull quote under the progress bar.
  - Add Trust Signals Block (Escrow disclosure, geotagged photo hint).
  - Add the "Recent Backers" section.

#### [MODIFY] src/components/auth/SignupForm.tsx
- *Optional:* Since `OnboardingForm` will now handle inline Account Creation (Screen 3), `SignupForm.tsx` can either be heavily scaled down or removed completely to prevent flow duplication.

## Open Questions

> [!WARNING]
> 1. **AI Generation:** For the "Generate with AI" tab, do you want me to use a real API (like OpenAI), or build a mock/simulated AI response for demo purposes? Use the deepseek API in .env
> 2. **Authentication Switch:** By moving Google and real Email/Password auth into the flow, do you want us to formally disable `DemoAuthContext.tsx` and switch entirely to realistic Supabase Auth for this flow? (Note: Phone OTP will still require Twilio as configured previously). Yes
> 3. **Stripe/Paystack:** The spec mentions Stripe for international backers. Shall we stick to just Paystack for this MVP implementation, or do you need a Stripe UI as well? Use Paystack for the MVP for now.

## Verification Plan

### Automated/Manual Verification
- Run local dev server.
- Test "Myself" vs "Someone Else" persistence through Google Auth redirect.
- Test the new Tip Slider logic (Total Charged = Pledge + Tip) and ensure 100% of Pledge is directed to the tradesperson.
- Test Guest checkout (Backer) -> confirm the auth wall no longer redirects to `/login`.
