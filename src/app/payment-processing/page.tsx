import { PaymentProcessingContent } from "./PaymentProcessingContent"

export const metadata = {
  title: "How Payments Work · BuildBridge",
  description:
    "Step-by-step breakdown of how donations flow on BuildBridge: collection, the 3% platform fee, milestone-based release, and what happens if proof isn't uploaded.",
}

export default function PaymentProcessingPage() {
  return <PaymentProcessingContent />
}
