"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Briefcase, Calendar, MapPin, Camera, Edit2, X, Check, Plus, Image as ImageIcon, Sparkles, Trash2, Shield, CreditCard, Building2, Hash, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, formatStateName } from "@/lib/utils";
import { NIGERIA_LOCATIONS } from "@/lib/data/nigeria";

// Compress image client-side to stay under body size limit
function compressImage(file: File, maxDimension: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      let newWidth = width;
      let newHeight = height;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          newWidth = maxDimension;
          newHeight = Math.round((height / width) * maxDimension);
        } else {
          newHeight = maxDimension;
          newWidth = Math.round((width / height) * maxDimension);
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context unavailable")); return; }
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
          resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

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
  onSubmit: (data: { bvn: string; accountNumber: string; accountName: string; bankName: string }) => Promise<void>;
}) {
  const [bvn, setBvn] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bvn.length !== 11 || !/^\d+$/.test(bvn)) {
      setError("BVN must be exactly 11 digits.");
      return;
    }
    if (accountNumber.length !== 10 || !/^\d+$/.test(accountNumber)) {
      setError("Account Number must be exactly 10 digits.");
      return;
    }
    if (!accountName.trim() || !bankName.trim()) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({ bvn, accountNumber, accountName, bankName });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save bank details.");
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
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Bank Verification Number (BVN)</label>
                <input
                  type="text"
                  value={bvn}
                  onChange={(e) => setBvn(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="e.g. 12345678901"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                  required
                  maxLength={11}
                  minLength={11}
                />
              </div>

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
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Guaranty Trust Bank"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Kolawole Segun"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                  required
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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNinModal, setShowNinModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [impactStories, setImpactStories] = useState<any[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
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

      // Fetch verification status
      if (data?.id) {
        const { data: verification } = await supabase
          .from("verifications")
          .select("verified, nin_verified_at, manual_review_required, manual_review_completed")
          .eq("profile_id", data.id)
          .maybeSingle();
        setProfile((prev: any) => ({
          ...prev,
          nin_verified: verification,
        }));
      }

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
    const res = await fetch("/api/identity/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "nin", documentId: nin }),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Verification submission failed");
    }

    // Refresh profile data to get updated verification status
    await fetchProfile();
  };

  const handleBankDetailsSubmit = async (data: { bvn: string; accountNumber: string; accountName: string; bankName: string }) => {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 1000));

    setProfile((prev: any) => ({
      ...prev,
      bvn: data.bvn,
      account_number: data.accountNumber,
      account_name: data.accountName,
      bank_name: data.bankName
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

    setIsUploadingPhoto(true);
    setUploadError(null);
    try {
      // Compress image before upload to stay under body size limit
      const compressedFile = await compressImage(file, 800, 0.7);

      const formData = new FormData();
      formData.append("photo", compressedFile, compressedFile.name);
      formData.append("folder", "avatars");

      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      // Save photo_url to profiles table
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: currentUser.id,
            photo_url: result.url,
            photo_uploaded_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) throw error;

      // Update local state immediately for instant UI feedback
      setProfile((prev: any) => ({
        ...prev,
        photo_url: result.url,
        photo_uploaded_at: new Date().toISOString(),
      }));
      setUploadError(null);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setUploadError(err.message || "Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
      // Reset the file input so the same file can be re-selected
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
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
      {/* Back to Dashboard */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-colors group px-2"
        >
          <div className="p-2 rounded-full bg-surface-variant/20 group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Hero Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative min-h-64 sm:h-80 rounded-[3rem] overflow-hidden bg-primary shadow-2xl pb-36 sm:pb-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="absolute -bottom-1 left-0 right-0 p-4 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-white text-center sm:text-left">
          <div className="relative group">
            {profile?.photo_url ? (
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-[6px] sm:border-8 border-primary shadow-2xl">
                <img
                  src={profile.photo_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-[2rem] sm:rounded-[2.5rem] bg-white text-primary flex items-center justify-center text-4xl sm:text-5xl font-black border-[6px] sm:border-8 border-primary shadow-2xl">
                {isUploadingPhoto ? (
                  <svg className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-primary/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  initial.toUpperCase()
                )}
              </div>
            )}
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-yellow-400 text-[#121212] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex-1 sm:pb-4">
            <h1 className="text-2xl sm:text-5xl font-black tracking-tight">{profile?.full_name || "Artisan"}</h1>
            <p className="opacity-80 font-bold uppercase tracking-widest text-[10px] sm:text-xs mt-1 flex items-center justify-center sm:justify-start gap-2">
              <Briefcase className="w-3 h-3" />
              {tradeLabel}
            </p>
          </div>

          <Button
            onClick={() => setShowEditModal(true)}
            className="sm:mb-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 gap-2 cursor-pointer text-sm px-5 py-2.5"
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
                        {profile?.nin_verified?.verified ? "Verified" : profile?.nin_verified ? "Pending Review" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {profile?.nin_verified?.verified ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                    </div>
                  ) : profile?.nin_verified ? (
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
                {(!profile?.bvn || !profile?.account_number) && (
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
                  <div className="p-3 rounded-2xl bg-green-500/5 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">BVN</p>
                    <p className="text-sm font-bold text-on-surface truncate">
                      {profile?.bvn ? "••••••" + profile.bvn.slice(-4) : "Not provided"}
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
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] bg-error text-white py-4 px-8 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 cursor-pointer"
            onClick={() => setUploadError(null)}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {uploadError}
          </motion.div>
        )}
      </AnimatePresence>
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
