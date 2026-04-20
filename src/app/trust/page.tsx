import React from "react";
import { Metadata } from "next";
import { TrustContent } from "./TrustContent";

export const metadata: Metadata = {
  title: "Trust & Safety | BuildBridge",
  description: "Learn about the BuildBridge verification stack and our commitment to security.",
};

export default function TrustPage() {
  return <TrustContent />;
}
