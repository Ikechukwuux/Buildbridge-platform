import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Onboarding | BuildBridge",
  description: "Complete your profile to start requesting funding for your niche craft.",
}

export default async function OnboardingPage() {
  redirect("/dashboard/create-need")
}
