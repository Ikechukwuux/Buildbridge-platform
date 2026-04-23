# BuildBridge Fixes Implementation Plan

This plan addresses the remaining bugs preventing the core flows from completing successfully. 

## 1. AI Impact Statement Generation
**Issue:** The AI fails to generate impact statements.
**Cause:** The DeepSeek API occasionally wraps its JSON response in markdown blocks (e.g., ````json [...] ````), causing `JSON.parse` to throw an error.
**Fix:** Update `/api/impact-statement/route.ts` to detect and strip markdown formatting before attempting to parse the JSON array.

## 2. Photo Upload Failures
**Issue:** The photo upload process fails during both onboarding and dashboard creation.
**Cause:** The server code is attempting to convert the uploaded `File` object into a Node `Buffer` before passing it to Supabase. This conversion is unreliable in Next.js App Router API routes and Server Actions.
**Fix:** Update both `/api/upload-photo/route.ts` and `actions.ts` to pass the native `File` object directly to `supabaseAdmin.storage.from('needs').upload()`, which natively supports `File` objects.

## 3. Congratulatory Page Transition
**Issue:** Submitting a need from the dashboard saves the data but fails to advance to the congratulatory success step.
**Cause:** The `createNeedAction` server action calls `revalidatePath("/dashboard")` upon success. This forces Next.js to purge the router cache and remount the `/dashboard/create-need` layout, resetting the client-side `currentStep` state back to 0.
**Fix:** 
- Remove `revalidatePath("/dashboard")` from the server action.
- Update the "Go to Dashboard" button on the Success Step to trigger the refresh (`router.refresh()` followed by `router.push()`) so the UI transitions smoothly.

## 4. Google Auth Need Creation
**Issue:** Onboarding needs are still not created when a user signs up with Google.
**Cause:** In `app/auth/callback/route.ts`, the database insertion is performed using the regular authenticated client. Because the session has just been created, Row Level Security (RLS) or timing issues with the profile trigger are blocking the `insert` command silently.
**Fix:** Import the Supabase Service Role Key and create an admin client in the callback route. Use this admin client to force the profile upsert and need insertion, bypassing RLS and logging any explicit database errors.

## 5. Demo Email Validation Fix
**Issue:** Using `kolawolesegun@demo.com` throws a validation error.
**Cause:** A typo in the validation logic. The allowed email was hardcoded as `kolowolesegun@demo.com` (with an 'o' instead of an 'a').
**Fix:** Correct the exact string match in `AccountCreationView.tsx`.

## Open Questions
- Does this plan align with your expectations? If so, please approve and I will begin execution immediately.
