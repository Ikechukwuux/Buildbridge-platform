import React from "react";
import { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us | BuildBridge",
  description: "Learn about the BuildBridge mission and our story of empowering Nigerian artisans.",
};

export default function AboutPage() {
  return <AboutContent />;
}
