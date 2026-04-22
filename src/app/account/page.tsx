"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Bell, Phone, Mail, Key, Trash2, X, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onToggle, disabled = false }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        enabled ? "bg-primary" : "bg-outline-variant/40",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out",
          enabled ? "translate-x-[22px]" : "translate-x-[1px]",
          "mt-[1px]"
        )}
      />
    </button>
  );
}

// Password Change Dialog
function PasswordChangeDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const supabase = createClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-on-surface">Change Password</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-black text-on-surface">Password Updated!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 pr-12 font-bold text-on-surface transition-all outline-none"
                      required
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 pr-12 font-bold text-on-surface transition-all outline-none"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-error shrink-0" />
                    <p className="text-sm font-bold text-error">{error}</p>
                  </div>
                )}

                <Button type="submit" isLoading={isLoading} className="h-14 rounded-2xl font-black text-lg mt-2">
                  Update Password
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Phone Link Dialog
function PhoneLinkDialog({ isOpen, onClose, currentPhone, onSuccess }: { isOpen: boolean; onClose: () => void; currentPhone: string; onSuccess: (phone: string) => void }) {
  const supabase = createClient();
  const [phone, setPhone] = useState(currentPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Format phone
      let cleanPhone = phone.trim();
      if (cleanPhone.startsWith("0") && cleanPhone.length === 11) {
        cleanPhone = "+234" + cleanPhone.slice(1);
      } else if (!cleanPhone.startsWith("+")) {
        cleanPhone = "+234" + cleanPhone;
      }

      // Update phone in auth
      const { error: updateError } = await supabase.auth.updateUser({
        phone: cleanPhone,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        // Also update profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ phone_number: cleanPhone, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);
        }

        setSuccess(true);
        onSuccess(cleanPhone);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update phone number.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-on-surface/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-on-surface">{currentPhone ? "Update" : "Link"} Phone Number</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-black text-on-surface">Phone Number Updated!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0801 234 5678"
                    className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                    required
                  />
                  <p className="text-xs text-on-surface-variant/50 font-medium ml-1">Nigerian numbers will be auto-formatted with +234</p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-error/5 border border-error/20 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-error shrink-0" />
                    <p className="text-sm font-bold text-error">{error}</p>
                  </div>
                )}

                <Button type="submit" isLoading={isLoading} className="h-14 rounded-2xl font-black text-lg mt-2">
                  {currentPhone ? "Update" : "Link"} Phone
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [impactUpdates, setImpactUpdates] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [emailVerifyMsg, setEmailVerifyMsg] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch profile to get phone number
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
          setPhoneNumber(profileData.phone_number || user.phone || "");
        } else {
          setPhoneNumber(user.phone || "");
        }
      }

      setIsLoading(false);
    };
    fetchUser();
  }, [supabase]);

  const handleEmailVerify = async () => {
    try {
      // Resend email verification
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user?.email,
      });

      if (error) {
        setEmailVerifyMsg("Failed to send verification email: " + error.message);
      } else {
        setEmailVerifyMsg("Verification email sent! Check your inbox.");
      }

      setTimeout(() => setEmailVerifyMsg(null), 5000);
    } catch (err) {
      setEmailVerifyMsg("Failed to send verification email.");
      setTimeout(() => setEmailVerifyMsg(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 animate-pulse space-y-6">
        <div className="h-20 w-1/3 bg-surface-variant/30 rounded-2xl" />
        <div className="h-64 w-full bg-surface-variant/20 rounded-3xl" />
        <div className="h-64 w-full bg-surface-variant/20 rounded-3xl" />
      </div>
    );
  }

  const isEmailVerified = user?.email_confirmed_at != null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-on-surface tracking-tight flex items-center gap-4">
          <Settings className="w-10 h-10 text-primary" />
          Settings
        </h1>
        <p className="text-on-surface-variant font-medium">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-8">
        {/* Security & Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="rounded-[2.5rem] border-outline-variant/30 overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30 bg-surface flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-on-surface">Security & Privacy</h2>
            </div>

            <div className="divide-y divide-outline-variant/20 bg-white/50">
              {/* Phone Number */}
              <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-on-surface-variant/40" />
                  <div>
                    <p className="text-sm font-black text-on-surface">Phone Number</p>
                    <p className="text-sm font-medium text-on-surface-variant/60">
                      {phoneNumber || "Not linked"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPhoneDialog(true)}
                  className="rounded-full px-6 h-10 text-xs font-black uppercase tracking-widest border-outline-variant hover:border-primary hover:text-primary transition-all"
                >
                  {phoneNumber ? "Update" : "Link"}
                </Button>
              </div>

              {/* Email Address */}
              <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-on-surface-variant/40" />
                  <div>
                    <p className="text-sm font-black text-on-surface">Email Address</p>
                    <p className="text-sm font-medium text-on-surface-variant/60 flex items-center gap-2">
                      {user?.email}
                      {isEmailVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </p>
                    {emailVerifyMsg && (
                      <p className={cn(
                        "text-xs font-bold mt-1",
                        emailVerifyMsg.includes("Failed") ? "text-error" : "text-primary"
                      )}>
                        {emailVerifyMsg}
                      </p>
                    )}
                  </div>
                </div>
                {!isEmailVerified && (
                  <Button
                    variant="outline"
                    onClick={handleEmailVerify}
                    className="rounded-full px-6 h-10 text-xs font-black uppercase tracking-widest border-outline-variant hover:border-primary hover:text-primary transition-all"
                  >
                    Verify
                  </Button>
                )}
              </div>

              {/* Password */}
              <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/5 transition-colors">
                <div className="flex items-center gap-4">
                  <Key className="w-5 h-5 text-on-surface-variant/40" />
                  <div>
                    <p className="text-sm font-black text-on-surface">Password</p>
                    <p className="text-sm font-medium text-on-surface-variant/60">••••••••</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordDialog(true)}
                  className="rounded-full px-6 h-10 text-xs font-black uppercase tracking-widest border-outline-variant hover:border-primary hover:text-primary transition-all"
                >
                  Change
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-[2.5rem] border-outline-variant/30 overflow-hidden">
            <div className="p-8 border-b border-outline-variant/30 bg-surface flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-secondary/5 text-secondary">
                <Bell className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-on-surface">Notifications</h2>
            </div>

            <div className="divide-y divide-outline-variant/20 bg-white/50">
              {/* Impact Updates Toggle */}
              <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/5 transition-colors">
                <div className="flex-grow">
                  <p className="text-sm font-black text-on-surface">Impact Updates</p>
                  <p className="text-sm font-medium text-on-surface-variant/60">
                    Get notified when your needs receive backing or reach milestones
                  </p>
                </div>
                <ToggleSwitch
                  enabled={impactUpdates}
                  onToggle={() => setImpactUpdates(!impactUpdates)}
                />
              </div>

              {/* Marketing Toggle */}
              <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/5 transition-colors">
                <div className="flex-grow">
                  <p className="text-sm font-black text-on-surface">Marketing</p>
                  <p className="text-sm font-medium text-on-surface-variant/60">
                    Receive news about platform features and community stories
                  </p>
                </div>
                <ToggleSwitch
                  enabled={marketingEnabled}
                  onToggle={() => setMarketingEnabled(!marketingEnabled)}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-outline-variant/30"
        >
          <Card className="p-8 rounded-[2rem] border-error/20 bg-error/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-black text-error">Danger Zone</h3>
              <p className="text-sm text-error/60 font-medium">Permanently delete your account and all associated data.</p>
            </div>
            <Button className="bg-error text-white hover:bg-error/90 rounded-full h-12 px-8 font-black gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <PasswordChangeDialog isOpen={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />
      <PhoneLinkDialog
        isOpen={showPhoneDialog}
        onClose={() => setShowPhoneDialog(false)}
        currentPhone={phoneNumber}
        onSuccess={(newPhone) => setPhoneNumber(newPhone)}
      />
    </div>
  );
}
