"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronRight, ChevronLeft, Mic, MicOff, 
  Sparkles, Camera, MapPin, CheckCircle2,
  Loader2, AlertCircle, Info, Target
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { createClient } from "@/lib/supabase/client";
import { NIGERIA_LOCATIONS } from "@/lib/data/nigeria";
import { cn } from "@/lib/utils";

interface CreateNeedFlowProps {
  onClose: () => void;
}

export function CreateNeedFlow({ onClose }: CreateNeedFlowProps) {
  const [phase, setPhase] = useState<"A" | "B" | "C">("A");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const voice = useVoiceInput();

  // Form State
  const [formData, setFormData] = useState({
    state: "",
    lga: "",
    trade: "",
    amount: "",
    story_raw: "", // Raw input from voice/text
    generated: {
      title: "",
      story: "",
      impact: ""
    },
    photo: null as File | null,
    photo_url: "",
    geotag: null as { lat: number, lng: number } | null
  });

  // Phase A validation
  const isPhaseAValid = formData.state && formData.lga && formData.trade && formData.amount;

  // Handle AI Content Generation
  const generateAIContent = async () => {
    if (!formData.story_raw) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: "Artisan with skills", // can be refined
          product: formData.trade,
          community: formData.lga + ", " + formData.state,
          equipment: formData.story_raw,
          isSelf: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          generated: {
            title: `Support a skilled ${formData.trade} in ${formData.lga}`,
            story: data.story,
            impact: `One new tool will empower ${formData.trade} growth.`
          }
        }));
        setPhase("B");
      } else {
        setError(data.error || "Failed to generate story.");
      }
    } catch (err) {
      setError("AI Service unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentLGAs = formData.state ? (NIGERIA_LOCATIONS[formData.state as keyof typeof NIGERIA_LOCATIONS] || []) : [];

  const handleGeotag = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({
          ...prev,
          geotag: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
      });
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!profile) throw new Error("Profile required");

      // 1. Upload Photo (Mocked for now, simplified)
      let photo_url = "https://images.unsplash.com/photo-1544027993-37dbfe43552e?q=80&w=600";
      
      // 2. Create Need
      const { error: insertError } = await supabase
        .from('needs')
        .insert({
          profile_id: profile.id,
          item_name: formData.generated.title,
          item_cost: parseInt(formData.amount),
          story: formData.generated.story,
          impact_statement: formData.generated.impact,
          photo_url: photo_url,
          photo_geotag_lat: formData.geotag?.lat,
          photo_geotag_lng: formData.geotag?.lng,
          status: 'active'
        });

      if (insertError) throw insertError;
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-on-surface/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-2xl bg-surface rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <PlusIcon phase={phase} />
            </div>
            <div>
              <h2 className="text-xl font-black text-on-surface">Launch your Need</h2>
              <div className="flex gap-1 mt-1">
                <div className={cn("h-1 w-8 rounded-full transition-colors", phase === "A" ? "bg-primary" : "bg-primary/20")} />
                <div className={cn("h-1 w-8 rounded-full transition-colors", phase === "B" ? "bg-primary" : "bg-primary/20")} />
                <div className={cn("h-1 w-8 rounded-full transition-colors", phase === "C" ? "bg-primary" : "bg-primary/20")} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-surface-variant/20 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          <AnimatePresence mode="wait">
            {phase === "A" && (
              <motion.div 
                key="A"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-on-surface">The Essentials</h3>
                  <p className="text-on-surface-variant font-medium">Where and what do you need?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progressive Disclosure simulation */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-black uppercase tracking-widest opacity-40 ml-4">State</label>
                    <select 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="h-16 rounded-2xl border-2 border-outline-variant bg-white px-6 font-bold focus:border-primary outline-none appearance-none"
                    >
                      <option value="">Select State</option>
                      {NIGERIA_LOCATIONS.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                    </select>
                  </div>

                  {formData.state && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
                      <label className="text-sm font-black uppercase tracking-widest opacity-40 ml-4">LGA</label>
                      <select 
                        value={formData.lga}
                        onChange={(e) => setFormData({...formData, lga: e.target.value})}
                        className="h-16 rounded-2xl border-2 border-outline-variant bg-white px-6 font-bold focus:border-primary outline-none"
                      >
                        <option value="">Select Local Gov</option>
                        {currentLGAs.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  )}

                  {formData.lga && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
                      <label className="text-sm font-black uppercase tracking-widest opacity-40 ml-4">Trade</label>
                      <Input 
                        placeholder="e.g. Tailor, Mechanic"
                        value={formData.trade}
                        onChange={(e) => setFormData({...formData, trade: e.target.value})}
                        className="h-16 rounded-2xl border-2 placeholder:opacity-30"
                      />
                    </div>
                  )}

                  {formData.trade && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
                      <label className="text-sm font-black uppercase tracking-widest opacity-40 ml-4">Amount (₦)</label>
                      <Input 
                        type="number"
                        placeholder="₦ 50,000"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="h-16 rounded-2xl border-2 placeholder:opacity-30"
                      />
                    </div>
                  )}
                </div>

                {isPhaseAValid && (
                  <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/20 space-y-4 animate-in zoom-in-95">
                    <div className="flex items-center gap-3 text-primary font-black">
                      <Sparkles className="w-5 h-5" />
                      Tell us your story
                    </div>
                    <div className="relative">
                      <Textarea 
                         placeholder="Explain why you need this... (or use the mic below)"
                         value={formData.story_raw}
                         onChange={(e) => setFormData({...formData, story_raw: e.target.value})}
                         className="min-h-[150px] rounded-3xl border-2 resize-none pr-16 placeholder:opacity-20"
                      />
                      <button 
                        onClick={() => voice.isListening ? voice.stopListening() : voice.startListening()}
                        className={cn(
                          "absolute bottom-4 right-4 h-12 w-12 rounded-full flex items-center justify-center transition-all shadow-xl",
                          voice.isListening ? "bg-error text-white animate-pulse" : "bg-primary text-white hover:scale-110"
                        )}
                      >
                        {voice.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs font-medium text-on-surface-variant px-4 italic">
                      {voice.isListening ? "Listening... speak clearly about your tools and goals." : "Tesla's Law: We'll use AI to format your intent into a professional story."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {phase === "B" && (
              <motion.div 
                key="B"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-on-surface underline decoration-primary decoration-4">The AI Narrative</h3>
                  <p className="text-on-surface-variant font-medium">Review and polish your generated story.</p>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">Generated Title</label>
                    <Input 
                      value={formData.generated.title}
                      onChange={(e) => setFormData(prev => ({...prev, generated: {...prev.generated, title: e.target.value}}))}
                      className="h-14 rounded-2xl border-2 font-black text-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">The Impact Statement</label>
                    <Input 
                      value={formData.generated.impact}
                      onChange={(e) => setFormData(prev => ({...prev, generated: {...prev.generated, impact: e.target.value}}))}
                      className="h-14 rounded-2xl border-2 italic text-primary font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-4">Full Narrative</label>
                    <Textarea 
                      value={formData.generated.story}
                      onChange={(e) => setFormData(prev => ({...prev, generated: {...prev.generated, story: e.target.value}}))}
                      className="min-h-[200px] rounded-3xl border-2 leading-relaxed"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "C" && (
              <motion.div 
                key="C"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-on-surface">Trust & Verification</h3>
                  <p className="text-on-surface-variant font-medium">Add a photo and your location to build trust.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button className="aspect-square rounded-[3rem] border-4 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group">
                      <div className="h-16 w-16 rounded-full bg-surface-variant/20 flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Camera className="w-8 h-8" />
                      </div>
                      <span className="font-black text-on-surface-variant uppercase tracking-widest text-xs">Upload Cover Photo</span>
                   </button>

                   <div className="space-y-6">
                      <div className="p-8 bg-surface-variant/20 rounded-[2.5rem] border border-outline-variant flex flex-col gap-4">
                         <div className="flex items-center gap-3">
                            <MapPin className="text-primary w-5 h-5" />
                            <h4 className="font-black text-on-surface">Geotagging</h4>
                         </div>
                         <p className="text-sm font-medium text-on-surface-variant">Adding your coordinates proves you are listing from your reported location. <span className="text-primary font-bold"> Artisians with tags get funded 2x faster.</span></p>
                         <Button 
                           onClick={handleGeotag}
                           variant={formData.geotag ? "secondary" : "outline"}
                           className="rounded-2xl h-12"
                         >
                           {formData.geotag ? "Location Verified ✓" : "Verify Location"}
                         </Button>
                      </div>

                      <div className="flex flex-col gap-2 p-6 bg-yellow-400/10 rounded-3xl border border-yellow-400/20">
                         <div className="flex items-center gap-2 text-yellow-600 font-black text-sm">
                            <Info className="w-4 h-4" />
                            Success Preview
                         </div>
                         <p className="text-xs font-medium text-yellow-800">Your need will be displayed on the public wall with an 'Identity Verified' badge if you complete NIN check later.</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-outline-variant bg-surface-variant/5 flex justify-between items-center">
          {phase !== "A" ? (
             <Button variant="ghost" onClick={() => phase === "B" ? setPhase("A") : setPhase("B")} className="px-8 font-black">
                <ChevronLeft className="mr-2 w-4 h-4" /> Back
             </Button>
          ) : <div />}

          <div className="flex gap-4">
             {phase === "A" ? (
               <Button 
                 disabled={!formData.story_raw || isLoading} 
                 onClick={generateAIContent}
                 isLoading={isLoading}
                 className="px-10 rounded-2xl h-14 font-black shadow-xl"
               >
                 Review Story <ChevronRight className="ml-2 w-4 h-4" />
               </Button>
             ) : phase === "B" ? (
               <Button onClick={() => setPhase("C")} className="px-10 rounded-2xl h-14 font-black shadow-xl">
                 Continue to Verification <ChevronRight className="ml-2 w-4 h-4" />
               </Button>
             ) : (
               <Button 
                 isLoading={isLoading} 
                 onClick={handleFinish}
                 className="px-10 rounded-2xl h-14 font-black bg-primary text-white shadow-xl shadow-primary/20"
               >
                 Launch my Need! <CheckCircle2 className="ml-2 w-4 h-4" />
               </Button>
             )}
          </div>
        </div>

        {error && (
          <div className="absolute bottom-24 left-8 right-8 bg-error text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-shake">
            <AlertCircle className="shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function PlusIcon({ phase }: { phase: string }) {
  if (phase === "A") return <Target className="w-6 h-6" />;
  if (phase === "B") return <Sparkles className="w-6 h-6" />;
  return <ShieldCheck className="w-6 h-6" />;
}

function ShieldCheck({ className }: { className?: string }) {
  return <CheckCircle2 className={className} />;
}
