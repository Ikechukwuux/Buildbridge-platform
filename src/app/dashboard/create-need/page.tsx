import { Metadata } from "next"
import { CreateNeedForm } from "@/components/dashboard/CreateNeedForm"

export const metadata: Metadata = {
  title: "Request Funding | BuildBridge",
  description: "Request tools and equipment to grow your business.",
}

/**
 * DEMO MODE: Auth and profile checks removed.
 * Uses a mock trade category for the form.
 *
 * To re-enable Supabase:
 *   1. Import createClient from "@/lib/supabase/server"
 *   2. Restore auth.getUser() and profile fetch
 *   3. Replace the mock tradeCategory with real profile data
 */
export default async function CreateNeedPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <CreateNeedForm tradeCategory="tailor" />
    </main>
  )
}
