import React from "react";
import { Metadata } from "next";
import { CareersContent } from "./CareersContent";

export const metadata: Metadata = {
  title: "Careers | BuildBridge",
  description: "Join the team building the trust infrastructure for the next billion micro-entrepreneurs.",
};

export default function CareersPage() {
  return <CareersContent />;
}
