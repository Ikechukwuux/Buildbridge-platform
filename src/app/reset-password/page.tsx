import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reset Password | BuildBridge",
  description: "Set a new password for your BuildBridge account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="h-80 w-full max-w-lg bg-white/50 animate-pulse rounded-[2.5rem]" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
