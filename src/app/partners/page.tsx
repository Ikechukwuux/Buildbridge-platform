import React from "react";
import { Metadata } from "next";
import { PartnersContent } from "./PartnersContent";

export const metadata: Metadata = {
  title: "Partner with Us | BuildBridge",
  description: "Join BuildBridge as a market association, NGO, or institution to scale local impact.",
};

export default function CollaboratePage() {
  return <PartnersContent />;
}
