# BuildBridge Implementation Plan: Fixing the Core Flow

## Goal Description
The previous implementations were mistakenly applied to `NeedCreationFlow.tsx`, which is deprecated/dead code. The platform currently uses two distinct flows for Need creation:
1. **Onboarding Flow:** `HighVelocityAuth.tsx` + `NeedStepFlow.tsx` + `AccountCreationView.tsx`
2. **Dashboard Create Flow:** `CreateNeedForm.tsx` + `actions.ts`

This plan addresses all 9 user issues by migrating the fixed logic (AI features, photo upload, timeline, Google Auth state, and data truncation) to these active files.

## User Review Required
> [!WARNING]
> This plan targets the correct files (`HighVelocityAuth`, `NeedStepFlow`, `CreateNeedForm`). I will remove the old `NeedCreationFlow.tsx` to prevent future confusion. Please confirm if you want me to proceed with these changes.

## Open Questions
- **Email Verification:** To prevent "random emails" from signing up (Issue #8), we can either enforce email confirmation in Supabase (which requires users to click a link in their email), or we can add strict regex/domain validation on the frontend. Which do you prefer? For this plan, I'll add strict frontend validation.

## Proposed Changes

### 1. Google Auth State Loss (Issue #1)
During onboarding, if a user fills out their Need and clicks "Sign up with Google", the `discoveryData` is lost because it's not saved before the redirect.
#### [MODIFY] `src/components/auth/HighVelocityAuth.tsx`
- Before calling `signInWithOAuth`, serialize `discoveryData` and save it to a cookie (`discovery_data`).
#### [MODIFY] `src/app/auth/callback/route.ts`
- Read the `discovery_data` cookie. If it exists, parse it and insert the Need into the database for the newly authenticated user, then clear the cookie.

### 2. AI Enhance Feature (Issue #2)
#### [MODIFY] `src/components/auth/NeedStepFlow.tsx`
- Add the "✨ AI Enhance" button to the Story step.
- Call the `/api/generate-story` endpoint to enhance the user's raw input.
#### [MODIFY] `src/components/dashboard/CreateNeedForm.tsx`
- Replace the "TODO: Integrate DeepSeek AI" comment with the actual API call to `/api/impact-statement` to generate 3 impact options.
- Add AI enhance to the Story step.

### 3. Timeline Formatting (Issue #3)
#### [MODIFY] `src/components/auth/NeedStepFlow.tsx` & `HighVelocityAuth.tsx`
- Update the timeline options to map exactly to days (e.g., 7, 14, 30, 60, 90).
- Ensure `HighVelocityAuth.tsx` calculates the exact deadline date based on the chosen timeline, rather than hardcoding 30 days.

### 4. Photo Upload Failures (Issue #6 & 4)
#### [MODIFY] `src/components/auth/NeedStepFlow.tsx`
- The current `handleFileUpload` tries to upload directly to Supabase storage. This fails because the user is unauthenticated during onboarding.
- Update it to send a `FormData` POST request to the secure `/api/upload-photo` endpoint.
#### [MODIFY] `src/app/dashboard/create-need/actions.ts`
- The server action currently relies on the user's session to upload to storage. Update it to use the `SUPABASE_SERVICE_ROLE_KEY` to completely bypass any RLS issues, ensuring "Submit for Review" works every time.

### 5. Congratulatory Page (Issue #5)
#### [MODIFY] `src/components/dashboard/CreateNeedForm.tsx`
- Instead of immediately calling `router.push("/dashboard")`, render a celebratory Step 7 (using `framer-motion`) with a "View on Dashboard" button.

### 6. Nickname Allowed Label (Issue #7)
#### [MODIFY] `src/components/auth/AccountCreationView.tsx`
- Update the Full Name input label to include: "This can be a nickname".

### 7. Email Validation (Issue #8)
#### [MODIFY] `src/components/auth/AccountCreationView.tsx`
- Add strict email regex validation to ensure only properly formatted emails can proceed.

### 8. Need Data Corruption & Truncation (Issue #9)
#### [MODIFY] `src/components/auth/HighVelocityAuth.tsx`
- **Cost Parsing:** Fix the bug where `parseFloat(discoveryData.cost)` returns `NaN` because the cost string includes "₦" or commas. Parse it correctly.
- **Truncation:** Remove the `.substring(0, 150)` and `.substring(0, 200)` limits on the `story` and `impact_statement` fields so the full text is saved.
#### [MODIFY] `src/app/dashboard/create-need/actions.ts`
- Remove the `.slice(0, 150)` truncation for the dashboard create flow as well.

## Verification Plan

### Automated Tests
- Build verification via `npm run build`.

### Manual Verification
- Walk through the entire Onboarding flow with a new user. 
- Upload a photo while unauthenticated to verify the `/api/upload-photo` bypass works.
- Click "Sign up with Google" and verify the Need is created correctly upon redirect.
- Ensure the AI features load seamlessly.
