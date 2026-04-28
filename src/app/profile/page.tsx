"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Mail, Briefcase, Calendar, MapPin, Camera, Edit2, X, Check, Plus, Image as ImageIcon, Sparkles, Trash2, ArrowLeft, Shield, CreditCard, Building2, Hash, AlertCircle, CheckCircle2, Settings, MessageCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, formatStateName } from "@/lib/utils";
import { NIGERIA_LOCATIONS } from "@/lib/data/nigeria";

// Edit Profile Modal
function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSave: (data: any) => Promise<void>;
}) {
  const [name, setName] = useState(profile?.full_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [state, setStateVal] = useState(profile?.location_state || "");
  const [lga, setLgaVal] = useState(profile?.location_lga || "");
  const [trade, setTrade] = useState(profile?.trade_category || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map DB state (e.g. "lagos") to display name (e.g. "Lagos")
  const stateDisplayName = NIGERIA_LOCATIONS.find(s => s.id === state)?.state || state

  const currentLGAs = NIGERIA_LOCATIONS.find(
    s => s.id === state
  )?.lgas || []

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setBio(profile.bio || "");
      setStateVal(profile.location_state || "");
      setLgaVal(profile.location_lga || "");
      setTrade(profile.trade_category || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await onSave({
        full_name: name.trim(),
        bio: bio.trim(),
        location_state: state,
        location_lga: lga,
        trade_category: trade,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const TRADE_OPTIONS = [
    { id: "tailor", label: "Tailor" },
    { id: "carpenter", label: "Carpenter" },
    { id: "baker", label: "Baker" },
    { id: "electrician", label: "Electrician" },
    { id: "hair_stylist", label: "Barber / Hair Stylist" },
    { id: "welder", label: "Welder" },
    { id: "mechanic", label: "Mechanic" },
    { id: "plumber", label: "Plumber" },
    { id: "cobbler", label: "Cobbler" },
    { id: "food_processor", label: "Food Processor" },
    { id: "market_trader", label: "Market Trader" },
    { id: "blacksmith", label: "Blacksmith" },
    { id: "other", label: "Other" },
  ];

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
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-on-surface">Edit Profile</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community about yourself and your craft..."
                  rows={4}
                  className="w-full rounded-2xl border-2 border-outline-variant focus:border-primary p-5 font-medium text-on-surface transition-all outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Trade Category</label>
                <select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select trade</option>
                  {TRADE_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">State</label>
                <select
                  value={stateDisplayName}
                  onChange={(e) => {
                    const found = NIGERIA_LOCATIONS.find(s => s.state === e.target.value)
                    setStateVal(found?.id || "")
                    setLgaVal("")
                  }}
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select state</option>
                  {NIGERIA_LOCATIONS.map((s) => (
                    <option key={s.id} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Local Government Area (LGA)</label>
                <select
                  value={lga}
                  onChange={(e) => setLgaVal(e.target.value)}
                  disabled={!state}
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none appearance-none bg-white cursor-pointer disabled:opacity-40"
                >
                  <option value="">Select LGA</option>
                  {currentLGAs.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm font-bold text-error text-center bg-error/5 p-3 rounded-xl border border-error/20">{error}</p>
              )}

              <Button type="submit" isLoading={isLoading} className="h-14 rounded-2xl font-black text-lg mt-2">
                Save
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Verify NIN Modal
function VerifyNinModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nin: string) => Promise<void>;
}) {
  const [nin, setNin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nin.length !== 11 || !/^\d+$/.test(nin)) {
      setError("NIN must be exactly 11 digits.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(nin);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit NIN.");
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
              <h2 className="text-2xl font-black text-on-surface">Verify Identity</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-on-surface-variant font-medium mb-6">
              Please enter your 11-digit National Identity Number (NIN) to verify your identity.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">NIN</label>
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="e.g. 12345678901"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                  required
                  maxLength={11}
                  minLength={11}
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-error text-center bg-error/5 p-3 rounded-xl border border-error/20">{error}</p>
              )}

              <Button type="submit" isLoading={isLoading} className="h-14 rounded-2xl font-black text-lg mt-2">
                Submit for Review
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Add Bank Details Modal
function AddBankDetailsModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { accountNumber: string; accountName: string; bankName: string }) => Promise<void>;
}) {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber.length !== 10 || !/^\d+$/.test(accountNumber)) {
      setError("Account Number must be exactly 10 digits.");
      return;
    }
    if (!bankName.trim()) {
      setError("Please select a bank.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const bankCodeMatch = bankName.match(/^(\d{3})/);
      const code = bankCodeMatch?.[1] || "";
      
      if (!code) {
        throw new Error("Invalid bank code. Please select a valid bank.");
      }

      let response;
      let data;
      
      try {
        response = await fetch('/api/verify-bank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bank_code: code, account_number: accountNumber }),
        });
      } catch (fetchErr: any) {
        console.error("Fetch network error:", fetchErr);
        throw new Error("Network error: " + fetchErr.message);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        throw new Error("Server error: " + text.slice(0, 100));
      }

      data = await response.json();
      console.log("Verify response:", data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.status === false || data.success === false) {
        throw new Error(data.message || "Account verification failed");
      }
      
      if (!data.account_name) {
        console.log("API response data:", data);
        throw new Error("No account name returned. Response: " + JSON.stringify(data));
      }
      
      const verifiedAccountName = data.account_name;
      
      setAccountName(verifiedAccountName);
      await onSubmit({ accountNumber, accountName: verifiedAccountName, bankName });
      onClose();
    } catch (err: any) {
      console.error("Bank verification error:", err);
      setError(err.message || "Failed to verify account. Please check your details and try again.");
    } finally {
      setIsVerifying(false);
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
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-on-surface">Payment Information</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit account number"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                  required
                  maxLength={10}
                  minLength={10}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Bank Name</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none bg-white appearance-none"
                  required
                >
                  <option value="">Select Bank</option>
                  <option value="044|Access Bank">Access Bank</option>
                  <option value="023|Citi Bank">Citi Bank</option>
                  <option value="063|Diamond Trust Bank">Diamond Trust Bank</option>
                  <option value="050|Ecobank">Ecobank</option>
                  <option value="025|Fidelity Bank">Fidelity Bank</option>
                  <option value="011|First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="058|Guaranty Trust Bank (GTBank)">Guaranty Trust Bank (GTBank)</option>
                  <option value="030|Heritage Bank">Heritage Bank</option>
                  <option value="082|Keystone Bank">Keystone Bank</option>
                  <option value="014|Polarisco Bank">Polarisco Bank</option>
                  <option value="039|Stanbic IBTC Bank">Stanbic IBTC Bank</option>
                  <option value="076|Standard Chartered Bank">Standard Chartered Bank</option>
                  <option value="068|Sterling Bank">Sterling Bank</option>
                  <option value="032|Union Bank of Nigeria">Union Bank of Nigeria</option>
                  <option value="033|United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                  <option value="215|Unity Bank">Unity Bank</option>
                  <option value="035|Wema Bank">Wema Bank</option>
                  <option value="057|Zenith Bank">Zenith Bank</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={isVerifying ? "Verifying..." : "Will be auto-verified"}
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none bg-gray-50"
                  readOnly
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-error text-center bg-error/5 p-3 rounded-xl border border-error/20">{error}</p>
              )}

              <Button type="submit" isLoading={isLoading} className="h-14 rounded-2xl font-black text-lg mt-2">
                Save Bank Details
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNinModal, setShowNinModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [impactStories, setImpactStories] = useState<any[]>([]);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setProfile(data);

      // Fetch impact stories
      if (data?.id) {
        const { data: stories } = await supabase
          .from("impact_stories")
          .select("*")
          .eq("profile_id", data.id)
          .order("created_at", { ascending: false });
        if (stories) setImpactStories(stories);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [supabase]);

  const handleProfileSave = async (data: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Update auth metadata
    await supabase.auth.updateUser({
      data: { full_name: data.full_name },
    });

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: data.full_name,
          bio: data.bio,
          location_state: data.location_state,
          location_lga: data.location_lga,
          trade_category: data.trade_category,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) throw error;

    // Refresh profile data
    await fetchProfile();
  };

  const handleNinSubmit = async (nin: string) => {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 1000));

    // In a real flow, this would call an API like Dojah/Prembly to verify NIN.
    // Since columns don't exist in DB schema yet, we just update local state to reflect UI changes
    setProfile((prev: any) => ({
      ...prev,
      nin_verified: 'pending' // custom state
    }));
  };

  const handleBankDetailsSubmit = async (data: { accountNumber: string; accountName: string; bankName: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const bankNameMatch = data.bankName.match(/\|(.+)$/);
    const displayBankName = bankNameMatch?.[1] || data.bankName;

    const { error } = await supabase
      .from("profiles")
      .update({
        account_number: data.accountNumber,
        account_name: data.accountName,
        bank_name: displayBankName,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) throw error;

    setProfile((prev: any) => ({
      ...prev,
      account_number: data.accountNumber,
      account_name: data.accountName,
      bank_name: displayBankName
    }));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Create local preview URLs
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      newImages.push(url);
    }
    setGalleryImages((prev) => [...prev, ...newImages]);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setUploadError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ photo_url: publicUrl })
        .eq('user_id', user.id);

      setProfile((prev: any) => ({ ...prev, photo_url: publicUrl }));
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setUploadError(err.message || 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 animate-pulse space-y-8">
        <div className="h-48 w-full bg-surface-variant/30 rounded-[2.5rem]" />
        <div className="h-96 w-full bg-surface-variant/20 rounded-[2.5rem]" />
      </div>
    );
  }

  const initial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U";
  const tradeLabel = profile?.trade_category
    ? profile.trade_category.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
    : "Member";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-colors group px-2"
      >
        <div className="p-2 rounded-full bg-surface-variant/20 group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        Back
      </motion.button>

      <div className="flex items-center justify-end gap-2">
        <Link 
          href="/dashboard/account"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface hover:bg-primary/5 text-on-surface-variant hover:text-primary font-bold transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button 
          onClick={() => window.location.href = 'mailto:support@buildbridge.com'}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface hover:bg-primary/5 text-on-surface-variant hover:text-primary font-bold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </button>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface hover:bg-error/5 text-on-surface-variant hover:text-error font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>

      {/* Hero Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 sm:h-80 rounded-[3rem] overflow-hidden bg-primary shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="absolute -bottom-1 left-0 right-0 p-8 flex flex-col sm:flex-row items-end gap-6 text-white">
          <div className="relative group">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.full_name || 'Profile'}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] object-cover border-8 border-primary shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-white text-primary flex items-center justify-center text-5xl font-black border-8 border-primary shadow-2xl">
                {initial.toUpperCase()}
              </div>
            )}
            <button 
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute bottom-2 right-2 p-2 bg-yellow-400 text-[#121212] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isUploadingAvatar ? (
                <div className="w-5 h-5 animate-spin border-2 border-[#121212] border-t-transparent rounded-full" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          <div className="flex-grow pb-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{profile?.full_name || "Artisan"}</h1>
            <p className="opacity-80 font-bold uppercase tracking-widest text-xs mt-1 flex items-center gap-2">
              <Briefcase className="w-3 h-3" />
              {tradeLabel}
            </p>
          </div>

          <Button
            onClick={() => setShowEditModal(true)}
            className="mb-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 gap-2 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col gap-8">

        {/* TOP ROW: Contact Info + About Me */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-1/3 flex"
          >
            <Card className="p-8 rounded-[2rem] border-outline-variant/30 space-y-6 w-full flex flex-col h-full">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant/60">Contact Information</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Email</p>
                    <p className="text-sm font-bold text-on-surface">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-secondary/5 text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Joined</p>
                    <p className="text-sm font-bold text-on-surface">
                      {new Date(user?.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-tertiary/5 text-tertiary group-hover:bg-tertiary group-hover:text-white transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Location</p>
                    <p className="text-sm font-bold text-on-surface">
                      {[profile?.location_lga, formatStateName(profile?.location_state)].filter(Boolean).join(", ") || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* About Me */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-2/3 flex"
          >
            <Card className="p-10 rounded-[2.5rem] border-outline-variant/30 bg-surface relative overflow-hidden w-full flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <User className="w-64 h-64" />
              </div>

              <div className="relative z-10 space-y-6 flex flex-col h-full">
                <h2 className="text-3xl font-black text-on-surface">About Me</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed font-medium flex-grow">
                  {profile?.bio || `Professional ${tradeLabel} dedicated to high-quality work and community impact. Let's build something amazing together.`}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 mt-auto">
                  {[
                    { label: "Verified", value: profile?.badge_level ? "Level " + (profile.badge_level.match(/\d/)?.[0] || "0") : "Level 0" },
                    { label: "Impact", value: `${impactStories.length} ${impactStories.length === 1 ? "Story" : "Stories"}` },
                    { label: "Gallery", value: `${galleryImages.length} Photos` },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-surface-variant/20 border border-outline-variant/30">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                      <p className="text-lg font-black text-on-surface">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* BOTTOM ROW: Compliance & Payment + Gallery & Impact Wall */}
        <div className="flex flex-col lg:flex-row items-stretch gap-8">

          {/* Left Column (Compliance + Payment) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-1/3 flex flex-col gap-8 h-fit"
          >

            {/* Compliance Section */}
            <Card className="p-8 rounded-[2rem] border-outline-variant/30 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant/60">Compliance</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-yellow-500/5 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">National ID (NIN)</p>
                      <p className="text-sm font-bold text-on-surface">
                        {profile?.nin_verified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {profile?.nin_verified === true ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                    </div>
                  ) : profile?.nin_verified === 'pending' ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNinModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Payment Information Section */}
            <Card className="p-8 rounded-[2rem] border-outline-variant/30 space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant/60">Payment Information</h3>
                {(!profile?.account_number) && (
                  <button
                    onClick={() => setShowBankModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-variant/50 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    Add Details
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-blue-500/5 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Bank Name</p>
                    <p className="text-sm font-bold text-on-surface truncate">
                      {profile?.bank_name || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-blue-500/5 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Account Number</p>
                    <p className="text-sm font-bold text-on-surface truncate">
                      {profile?.account_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-purple-500/5 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Account Name</p>
                    <p className="text-sm font-bold text-on-surface truncate">
                      {profile?.account_name || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-2xl bg-orange-500/5 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Bank Name</p>
                    <p className="text-sm font-bold text-on-surface truncate">
                      {profile?.bank_name || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right Column (Gallery + Impact Wall) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-2/3 flex h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* My Gallery - Interactive */}
              <Card className="p-8 rounded-[2rem] border-outline-variant/30 group hover:border-primary/30 transition-all flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-on-surface">My Gallery</h3>
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-on-surface-variant font-medium mb-4">Showcase your best work to the community.</p>

                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="flex-grow flex flex-col justify-end">
                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {galleryImages.map((img, index) => (
                        <div key={index} className="relative group/img rounded-2xl overflow-hidden aspect-square">
                          <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeGalleryImage(index)}
                              className="p-2 bg-error text-white rounded-full hover:scale-110 transition-transform"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => galleryInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all cursor-pointer"
                      >
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold">Add More</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full h-40 rounded-2xl bg-surface-variant/10 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant font-bold hover:border-primary hover:text-primary transition-all cursor-pointer group mt-4"
                    >
                      <ImageIcon className="w-8 h-8 mb-2 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm">+ Add Photos</span>
                      <span className="text-[10px] opacity-50 mt-1">Showcase your craft</span>
                    </button>
                  )}
                </div>
              </Card>

              {/* Impact Wall - Interactive */}
              <Card className="p-8 rounded-[2rem] border-outline-variant/30 group hover:border-secondary/30 transition-all flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-on-surface">Impact Wall</h3>
                  <a
                    href="/impact"
                    className="p-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-sm text-on-surface-variant font-medium mb-4">Stories of lives changed through your work.</p>

                <div className="flex-grow flex flex-col justify-end">
                  {impactStories.length > 0 ? (
                    <div className="flex flex-col gap-3 mt-4">
                      {impactStories.slice(0, 3).map((story, index) => (
                        <div key={index} className="p-4 rounded-2xl bg-surface-variant/10 border border-outline-variant/30 hover:border-secondary/30 transition-all">
                          <p className="text-sm font-bold text-on-surface line-clamp-2">{story.title || story.description}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant/50 mt-1">
                            {new Date(story.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {impactStories.length > 3 && (
                        <a href="/impact" className="text-xs font-black text-secondary hover:underline text-center">
                          View all {impactStories.length} stories →
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="h-40 rounded-2xl bg-surface-variant/10 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant font-bold mt-4">
                      <Sparkles className="w-8 h-8 mb-2 opacity-40" />
                      <span className="text-sm">No stories yet</span>
                      <span className="text-[10px] opacity-50 mt-1">Complete a funded need to share your story</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleProfileSave}
      />

      {/* Verify NIN Modal */}
      <VerifyNinModal
        isOpen={showNinModal}
        onClose={() => setShowNinModal(false)}
        onSubmit={handleNinSubmit}
      />

      {/* Add Bank Details Modal */}
      <AddBankDetailsModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        onSubmit={handleBankDetailsSubmit}
      />
    </div>
  );
}
