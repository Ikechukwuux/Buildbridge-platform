import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Forgot Password | BuildBridge",
  description: "Reset your BuildBridge account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="h-80 w-full max-w-lg bg-white/50 animate-pulse rounded-[2.5rem]" />}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
