import React from "react";
import { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | BuildBridge",
  description: "Get in touch with the BuildBridge support team via WhatsApp or Email.",
};

export default function ContactPage() {
  return <ContactContent />;
}
