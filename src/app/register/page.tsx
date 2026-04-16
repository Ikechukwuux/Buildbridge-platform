import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Account | BuildBridge",
  description: "Join BuildBridge and start raising funding for your trade.",
};

export default function RegisterPage() {
  redirect("/signup");
  
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
