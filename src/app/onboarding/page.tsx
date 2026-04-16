import { Metadata } from "next"
import { OnboardingForm } from "@/components/onboarding/OnboardingForm"

export const metadata: Metadata = {
  title: "Onboarding | BuildBridge",
  description: "Complete your profile to start requesting funding for your niche craft.",
}

/**
 * DEMO MODE: Supabase auth/profile checks removed.
 * The OnboardingForm handles the full flow client-side.
 *
 * To re-enable real Supabase:
 *   1. Import createClient from "@/lib/supabase/server"
 *   2. Restore the auth.getUser() and profile check
 *   3. Redirect to /dashboard if profile already exists
 */
export default async function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <OnboardingForm />
    </main>
  )
}
