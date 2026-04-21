import React from "react";
import { Metadata } from "next";
import { TermsContent } from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service | BuildBridge",
  description: "Read the BuildBridge terms of service and our community standards for trust and accountability.",
};

export default function TermsPage() {
  return <TermsContent />;
}
