# BuildBridge Platform — 17-Point Enhancement Plan (v3 — Final)

> All open questions resolved. All user feedback incorporated. Ready for implementation approval.

---

## Decisions Log

| Question | Decision |
|---|---|
| Demo user mechanism | Tied to Supabase user with email `kolowolesegun@demo.com` |
| Storage bucket | Does not exist — create via Supabase MCP |
| Google OAuth placement | "Sign up with Google" button below email/password form in signup |
| Timeline range | 7–90 days, default 30 ✓ |
| Trust page | Investigate and fix if broken |
| AI provider | **DeepSeek** — both routes already use `DEEPSEEK_API_KEY` (`sk-9ceb...`). Enhancements extend the same API calls |
| Auth verification | No phone OTP in current signup. Test via email/password or Google OAuth |

---

## Proposed Changes

---

### Phase 1: Core Auth, Database & Infrastructure (Items #7, #8, #5-bucket, #17)

---

#### Item #7 — Users Not Captured in Database on Signup

**Root Cause:** `adminSyncPhoneUser()` syncs to `public.users` but does NOT create a `public.profiles` row. Profile only gets created later during need submission.

##### [MODIFY] [auth.ts](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/actions/auth.ts)

- In `adminSyncPhoneUser()`, after upserting `public.users`, also upsert `public.profiles` with `user_id` and `full_name`.

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- After `createOrSignInUserWithPhone()` succeeds (~line 568), call `syncUserRecord()` to ensure both `public.users` + `public.profiles` exist.
- Import `syncUserRecord` from `@/app/actions/auth`.

---

#### Item #8 — Google OAuth for Signup & Login

##### [MODIFY] [AccountCreationView.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/auth/AccountCreationView.tsx)

- Add a "Sign up with Google" button below the "Create My Account" submit button, separated by an "OR" divider.
- Accept a new `onGoogleAuth` prop from the parent component.

##### [MODIFY] [HighVelocityAuth.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/auth/HighVelocityAuth.tsx)

- Implement `handleGoogleAuth()` that:
  1. Sets cookies: `auth_flow=signup`, `auth_next=/dashboard`
  2. Calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '${baseUrl}/auth/callback' } })`
- Pass `handleGoogleAuth` to `AccountCreationView` as `onGoogleAuth` prop.

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- In `handleGoogleAuth()` (~line 584), set auth cookies before redirect (matching LoginForm pattern).
- Simplify `redirectTo` to `${baseUrl}/auth/callback` (remove query params).

##### [MODIFY] [callback/route.ts](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/auth/callback/route.ts)

- In signup branch, populate `full_name` on profile from `user.user_metadata`.
- Clear auth cookies after reading.

---

#### Item #5 (Infrastructure) — Create Supabase Storage Bucket

##### Create `needs` storage bucket via Supabase MCP

- Create a public bucket named `needs`.
- Add storage policy: authenticated users can upload to `needs/*`.
- Add public read policy so photo URLs are accessible without auth.

---

#### Item #17 — Trust & Badges Page

The page exists but user reported it didn't open.

##### [MODIFY] [page.tsx (trust)](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/trust/page.tsx)

- Investigate rendering issues (missing imports, hydration errors, nav links).
- Test in browser and fix if broken.

---

### Phase 2: Onboarding Flow Enhancements (Items #1, #2, #6, #16)

---

#### Item #1 — "Who are you fundraising for?"

> Already exists in `CREATE_STEPS` (`who_for` step). No change needed.

---

#### Item #2 — Fix Padding on Location Form Input Fields

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- In `renderLocationTrade()`, update `<select>` elements for State, LGA, and Trade Category to match Input component padding: `p-4 px-5 h-14 rounded-2xl font-bold`.

---

#### Item #6 — Name Input Field Persistence

> Already exists in onboarding "Create Account" step.

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- Verify `formData.fullName` persists through to `public.profiles.full_name` after auth.
- Update label hint: *"This can be a nickname — you can update it later."*

---

#### Item #16 — Email/Password Signup Validation

##### [MODIFY] [AccountCreationView.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/auth/AccountCreationView.tsx)

- Email validation: regex check when identifier contains `@`.
- Phone validation: 11 digits starting with `0`, or 10 digits.
- Password: min 8 chars, at least 1 number.
- Inline error messages. Disable submit until valid.

---

### Phase 3: AI Features, Photo Upload & Timeline (Items #3, #4, #5, #10)

---

#### Item #3 — AI Enhance Feature for Story (DeepSeek)

Both the existing story generation and the new enhance feature use the **DeepSeek API** (`https://api.deepseek.com/chat/completions`) with the `DEEPSEEK_API_KEY` already in `.env`.

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- In `renderTheStory()` → "Write" tab (~line 1492), add an "✨ AI Enhance" button below the textarea.
- Clicking it calls a new `handleEnhanceStory()` function that sends the existing story to `/api/generate-story` with `enhanceExisting: true`.

##### [MODIFY] [generate-story/route.ts](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/api/generate-story/route.ts)

- Add `enhanceExisting` and `existingStory` parameters.
- When `enhanceExisting` is true, use this DeepSeek prompt:
  > *"You are BuildBridge AI. Polish and improve this existing crowdfunding story while keeping the author's authentic voice. Make it more compelling for potential backers. Keep it 50-80 words, dignified and honest."*
- Send `existingStory` as the user message content.
- Same DeepSeek API call (`deepseek-chat` model, `temperature: 0.7`).

---

#### Item #4 — AI Suggestions for Expected Impact (3 options via DeepSeek)

The existing `/api/impact-statement` route already uses **DeepSeek**. We enhance it to return 3 context-aware suggestions.

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- Add `impactSuggestions: string[]` to component state.
- Update `handleGenerateImpactStatement()` to request 3 suggestions via a new `count` param.
- In `renderAIImpact()`, render 3 selectable cards. User clicks one to select, or edits manually.
- Add "🔄 Generate new suggestions" button.

##### [MODIFY] [impact-statement/route.ts](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/api/impact-statement/route.ts)

- Accept `count` parameter (default 3).
- Update the DeepSeek system prompt:
  > *"Generate exactly {count} different 1-sentence impact statements. Each should be specific, dignified, and under 200 characters. Return them as a JSON array of strings."*
- Parse the DeepSeek response as a JSON array.
- Return `{ statements: string[] }` instead of `{ statement: string }`.
- Backwards-compatible: if `count` is 1 or not provided in legacy calls, still return single `statement`.

---

#### Item #5 — Fix Photo Upload (Server-Side Route)

##### [NEW] [upload-photo/route.ts](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/api/upload-photo/route.ts)

- Server-side API route using `SUPABASE_SERVICE_ROLE_KEY` (bypasses storage RLS).
- Accepts `FormData` with photo file.
- Validates: JPEG/PNG/WebP only, max 5MB.
- Uploads to `needs` bucket, returns public URL.

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- Update `handlePhotoUpload()` to use `/api/upload-photo` instead of direct Supabase client calls.
- Show specific error messages. Add loading spinner.

---

#### Item #10 — Extend Timeline (7–90 days)

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- Add `timelineDays: 30` to `formData`.
- Add timeline selector in the `goal_amount` step (below amount input). Selectable pills:
  - 7 days — "Quick sprint"
  - 14 days — "Two weeks"
  - **30 days** — "Standard" (default, highlighted)
  - 60 days — "Extended"
  - 90 days — "Long-term"
- Update `handleSubmitNeed()` to use `formData.timelineDays` for deadline.

---

### Phase 4: Dashboard, Detail Page & Demo User (Items #9, #11, #12, #13, #14, #15)

---

#### Item #9 — Active Needs Card Missing Data

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- In `handleSubmitNeed()`: save **full** story text (remove `.slice(0, 150)`) and **full** impact statement (remove `.slice(0, 200)`).

##### [MODIFY] [page.tsx (dashboard)](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/dashboard/page.tsx)

- Verify profile data passed to `NeedCard` includes `full_name`, `location_state`, `location_lga`, `trade_category`, `vouch_count`, `badge_level`.

---

#### Item #11 — Standardize Review Summary Cards

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- Add missing review cards in `renderReviewLaunch()`:
  - **Story** — truncated preview + "Edit →"
  - **Timeline** — selected duration
  - **Who For** — "Myself" or "Someone else"
- Consistent styling: `p-6 bg-surface-variant/30 rounded-2xl`.

---

#### Item #12 — Need Detail Page: Real DB Queries

##### [MODIFY] [needs/[id]/page.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/dashboard/needs/%5Bid%5D/page.tsx)

- Replace `DEMO_NEEDS.find()` with real Supabase query (join needs + profiles).
- Keep `DEMO_NEEDS` fallback only for IDs starting with `demo-`.
- Build activity timeline from real dates. Show empty state for contributors if none exist.
- Add loading/error states.

---

#### Item #13 — Image Display Fallbacks

##### [MODIFY] [NeedCard.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/ui/NeedCard.tsx)

- Add `onError` on `<img>` to swap to gradient placeholder with trade icon.

##### [MODIFY] [needs/[id]/page.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/dashboard/needs/%5Bid%5D/page.tsx)

- Add `onError` on hero image. Show styled placeholder if URL fails.

---

#### Item #14 — Congratulatory Redirect Flow

##### [MODIFY] [NeedCreationFlow.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/components/need-creation/NeedCreationFlow.tsx)

- Add celebratory CSS animation (confetti/sparkle effect) to the share screen.
- Add prominent inline "View on Dashboard →" CTA button.

---

#### Item #15 — Demo User (Kolawole Segun)

##### [MODIFY] [page.tsx (dashboard)](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/dashboard/page.tsx)

- After fetching user, check `user.email === 'kolowolesegun@demo.com'`.
- If yes, override profile and needs with demo dataset:
  - **Profile:** Kolawole Segun, Tailor, Mushin Lagos, `level_2_trusted_tradesperson`, 12 vouches
  - **Need 1 (completed):** Industrial Sewing Machine, ₦350,000, 100% funded, 18 backers
  - **Need 2 (active):** Beading Machine, ₦400,000, 40% funded, 6 backers, 20 days left
- Non-demo users with no needs → existing empty state.

##### [MODIFY] [needs/[id]/page.tsx](file:///d:/Users/hp/Desktop/Buildbridge-platform-ikechukwuux/src/app/dashboard/needs/%5Bid%5D/page.tsx)

- Keep `DEMO_NEEDS` for demo IDs. Real DB query for all other IDs.

---

## File Change Summary

| File | Action | Items |
|---|---|---|
| `src/app/actions/auth.ts` | MODIFY | #7 |
| `src/components/need-creation/NeedCreationFlow.tsx` | MODIFY | #2, #3, #5, #6, #7, #8, #9, #10, #11, #14 |
| `src/components/auth/AccountCreationView.tsx` | MODIFY | #8, #16 |
| `src/components/auth/HighVelocityAuth.tsx` | MODIFY | #8 |
| `src/app/auth/callback/route.ts` | MODIFY | #8 |
| `src/app/api/generate-story/route.ts` | MODIFY | #3 |
| `src/app/api/impact-statement/route.ts` | MODIFY | #4 |
| `src/app/api/upload-photo/route.ts` | **NEW** | #5 |
| `src/app/dashboard/page.tsx` | MODIFY | #9, #15 |
| `src/app/dashboard/needs/[id]/page.tsx` | MODIFY | #12, #13, #15 |
| `src/components/ui/NeedCard.tsx` | MODIFY | #13 |
| `src/app/trust/page.tsx` | MODIFY (if broken) | #17 |
| Supabase storage bucket `needs` | **CREATE** | #5 |

---

## Verification Plan

### Build Check
- `npm run build` after each phase.

### Phase 1
- Create a new user via email/password signup → verify `public.users` AND `public.profiles` rows exist in Supabase.
- Sign up via Google OAuth → verify same DB rows + redirect to dashboard.
- Confirm `needs` storage bucket exists and accepts uploads.
- Navigate to `/trust` → confirm page loads correctly.

### Phase 2
- Walk through onboarding → verify location dropdowns have consistent padding.
- Verify name input saves to profile `full_name`.
- Test invalid email format → confirm validation error.
- Test short password → confirm validation error.

### Phase 3
- Write a story manually → click "✨ AI Enhance" → confirm DeepSeek returns polished version.
- Reach Impact step → confirm 3 DeepSeek-generated suggestions appear as selectable cards.
- Upload a photo via new `/api/upload-photo` route → confirm success.
- Select different timeline options → confirm deadline updates on review.

### Phase 4
- Create a need → verify all data on dashboard NeedCard and detail page.
- Login as `kolowolesegun@demo.com` → confirm demo dashboard with pre-populated data.
- Login as new user → confirm empty state.
- Test broken image URLs → confirm fallback placeholder renders.
