import { Metadata } from "next"
import { ComingSoonContent } from "./ComingSoonContent"

export const metadata: Metadata = {
  title: "BuildBridge — Coming Soon",
  description: "Donate to the hands that build Nigeria. Be among the first to support a verified artisan when we launch.",
}

export default function ComingSoonPage() {
  return <ComingSoonContent />
}
