"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

const DEMO_USER_KEY = "buildbridge_demo_user";
const DEMO_COOKIE_NAME = "buildbridge_demo_session";

interface DemoUser {
  name?: string;
  phone?: string;
  email?: string;
  verifiedAt: number;
}

interface DemoAuthContextType {
  isAuthenticated: boolean;
  demoUser: DemoUser | null;
  sendDemoOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyDemoOtp: (phone: string, token: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signInDemoEmail: (email: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  clearDemoSession: () => void;
  signOut: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | null>(null);

function loadDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(DEMO_USER_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      // Fallback to persisted name if missing in user object
      if (!user.name) {
        user.name = localStorage.getItem("buildbridge_user_name") || undefined;
      }
      return user;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveDemoUser(user: DemoUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
      // Set cookie for middleware (expires in 7 days)
      document.cookie = `${DEMO_COOKIE_NAME}=true; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
      // Remove cookie
      document.cookie = `${DEMO_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  } catch {
    // ignore
  }
}

/**
 * Normalise a Nigerian phone number to E.164 format (client-side mirror
 * of the server-side helper so we can store a canonical phone in state).
 */
function toE164(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return "+234" + cleaned.slice(1);
  }
  if (cleaned.startsWith("234") && !cleaned.startsWith("+")) {
    return "+" + cleaned;
  }
  if (!cleaned.startsWith("+")) {
    return "+234" + cleaned;
  }
  return cleaned;
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setDemoUser(loadDemoUser());
  }, []);

  // ── REAL Twilio Verify: Send OTP ──────────────────────────────────────────
  const sendDemoOtp = useCallback(async (phone: string) => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

    try {
      let cleanPhone = phone.trim();
      if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
        cleanPhone = "+234" + cleanPhone.slice(1);
      } else if (!cleanPhone.startsWith("+")) {
        cleanPhone = "+234" + cleanPhone;
      }

      // Basic validation: Nigerian phone numbers should be +234 followed by 10 digits
      if (!/^\+234\d{10}$/.test(cleanPhone)) {
        return { success: false, error: "Please enter a valid Nigerian phone number (e.g., 08012345678)." };
      }

      const expiresAt = Date.now() + SESSION_DURATION;
      const session = {
        phone: cleanPhone,
        expiresAt,
      };
      
      setOtpSession(session);
      saveOtpSession(session);

      return { success: true };
    } catch (error) {
      console.error("Failed to send demo OTP:", error);
      return { success: false, error: "Failed to send OTP. Please try again." };
    }
  }, []);

  // ── REAL Twilio Verify: Check OTP ─────────────────────────────────────────
  const verifyDemoOtp = useCallback(async (phone: string, token: string, name?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      let cleanPhone = phone.trim();
      if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
        cleanPhone = "+234" + cleanPhone.slice(1);
      } else if (!cleanPhone.startsWith("+")) {
        cleanPhone = "+234" + cleanPhone;
      }

      // Basic validation: Nigerian phone numbers should be +234 followed by 10 digits
      if (!/^\+234\d{10}$/.test(cleanPhone)) {
        return { success: false, error: "Please enter a valid Nigerian phone number (e.g., 08012345678)." };
      }

      // Check if session exists (either in state or loaded from storage)
      if (!otpSession || otpSession.phone !== cleanPhone) {
        return { success: false, error: "No OTP session found. Please request a new code." };
      }

      if (Date.now() > otpSession.expiresAt) {
        setOtpSession(null);
        saveOtpSession(null);
        return { success: false, error: "OTP has expired. Please request a new code." };
      }

      // MANDATORY DEMO RULE: Only 123456 is valid
      if (token !== DEMO_OTP) {
        return { success: false, error: "Invalid OTP. For demo purposes, use 123456." };
      }

      const user: DemoUser = {
        name: name || (typeof window !== "undefined" ? localStorage.getItem("buildbridge_user_name") || undefined : undefined),
        phone: cleanPhone,
        verifiedAt: Date.now(),
      };

      setOtpSession(null);
      saveOtpSession(null);
      setDemoUser(user);
      saveDemoUser(user);

      return { success: true };
    } catch (error) {
      console.error("Failed to verify demo OTP:", error);
      return { success: false, error: "Failed to verify OTP. Please try again." };
    }
  }, [otpSession]);

  const clearDemoSession = useCallback(() => {
    setOtpSession(null);
    saveOtpSession(null);
  }, []);

  // ── Email sign-in (demo mode — kept simple) ───────────────────────────────
  const signInDemoEmail = useCallback(async (email: string, name?: string) => {
    // Simulation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const user: DemoUser = {
        name: name || (typeof window !== "undefined" ? localStorage.getItem("buildbridge_user_name") || undefined : undefined),
        email,
        verifiedAt: Date.now(),
      };

      setDemoUser(user);
      saveDemoUser(user);

      return { success: true };
    } catch (error) {
      console.error("Failed to sign in with email:", error);
      return { success: false, error: "Failed to sign in. Please try again." };
    }
  }, []);

  const clearDemoSession = useCallback(() => {
    // No OTP session state to clear anymore — Twilio manages it server-side
  }, []);

  const signOut = useCallback(() => {
    setDemoUser(null);
    saveDemoUser(null);
  }, []);

  return (
    <DemoAuthContext.Provider
      value={{
        isAuthenticated: demoUser !== null,
        demoUser,
        sendDemoOtp,
        verifyDemoOtp,
        signInDemoEmail,
        clearDemoSession,
        signOut,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider");
  }
  return context;
}
