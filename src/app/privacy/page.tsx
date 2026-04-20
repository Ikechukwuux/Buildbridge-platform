import React from "react";
import { Metadata } from "next";
import { PrivacyContent } from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | BuildBridge",
  description: "Read the BuildBridge privacy policy and learn how we protect your data in compliance with NDPR.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
