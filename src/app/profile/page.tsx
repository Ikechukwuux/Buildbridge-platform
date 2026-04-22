"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Mail, Briefcase, Calendar, MapPin, Camera, Edit2, X, Check, Plus, Image as ImageIcon, Sparkles, Trash2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

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
  const [location, setLocation] = useState(profile?.location || "Nigeria");
  const [trade, setTrade] = useState(profile?.trade_category || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "Nigeria");
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
        location: location.trim(),
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
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-5 font-bold text-on-surface transition-all outline-none"
                />
              </div>

              {error && (
                <p className="text-sm font-bold text-error text-center bg-error/5 p-3 rounded-xl border border-error/20">{error}</p>
              )}

              <Button type="submit" isLoading={isLoading} className="h-14 rounded-2xl font-black text-lg mt-2">
                Save Changes
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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [impactStories, setImpactStories] = useState<any[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);
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
          location: data.location,
          trade_category: data.trade_category,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) throw error;

    // Refresh profile data
    await fetchProfile();
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
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-white text-primary flex items-center justify-center text-5xl font-black border-8 border-primary shadow-2xl">
              {initial.toUpperCase()}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-yellow-400 text-black rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
              <Camera className="w-5 h-5" />
            </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="p-8 rounded-[2rem] border-outline-variant/30 space-y-6">
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
                  <p className="text-sm font-bold text-on-surface">{profile?.location || "Nigeria"}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Areas */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-8"
        >
          <Card className="p-10 rounded-[2.5rem] border-outline-variant/30 bg-surface relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <User className="w-64 h-64" />
             </div>
             
             <div className="relative z-10 space-y-6">
                <h2 className="text-3xl font-black text-on-surface">About Me</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
                  {profile?.bio || `Professional ${tradeLabel} dedicated to high-quality work and community impact. Let's build something amazing together.`}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* My Gallery - Interactive */}
             <Card className="p-8 rounded-[2rem] border-outline-variant/30 group hover:border-primary/30 transition-all">
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

                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
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
                    className="w-full h-40 rounded-2xl bg-surface-variant/10 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant font-bold hover:border-primary hover:text-primary transition-all cursor-pointer group"
                  >
                    <ImageIcon className="w-8 h-8 mb-2 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm">+ Add Photos</span>
                    <span className="text-[10px] opacity-50 mt-1">Showcase your craft</span>
                  </button>
                )}
             </Card>

             {/* Impact Wall - Interactive */}
             <Card className="p-8 rounded-[2rem] border-outline-variant/30 group hover:border-secondary/30 transition-all">
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
                
                {impactStories.length > 0 ? (
                  <div className="flex flex-col gap-3">
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
                  <div className="h-40 rounded-2xl bg-surface-variant/10 border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center text-on-surface-variant font-bold">
                    <Sparkles className="w-8 h-8 mb-2 opacity-40" />
                    <span className="text-sm">No stories yet</span>
                    <span className="text-[10px] opacity-50 mt-1">Complete a funded need to share your story</span>
                  </div>
                )}
             </Card>
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleProfileSave}
      />
    </div>
  );
}
