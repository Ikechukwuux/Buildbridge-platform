"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { 
  Hammer, ShoppingBag, Target, ArrowRight, ArrowLeft, 
  MapPin, Sparkles, Camera, Clock, Users, CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NIGERIA_LOCATIONS } from "@/lib/data/nigeria";
import { createClient } from "@/lib/supabase/client";

interface NeedStepFlowProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export function NeedStepFlow({ onComplete, onSkip }: NeedStepFlowProps) {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    otherCategory: "",
    type: "" as "tools" | "materials" | "equipment" | "other" | "",
    itemName: "",
    cost: "",
    state: "",
    lga: "",
    story: "",
    impact: "",
    condition: "",
    timeline: "30",
    photoUrl: "",
    vouch: ""
  });

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateData = (fields: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      updateData({ photoUrl: data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalSubmit = () => {
    onComplete(formData);
  };

  const currentLGAs = NIGERIA_LOCATIONS.find(s => s.state === formData.state || s.id === formData.state)?.lgas || [];

  return (
    <div className="flex flex-col gap-8 w-full min-h-[500px]">
      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Step {step} of {totalSteps}</span>
          <button 
            onClick={onSkip}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-primary transition-colors"
          >
            Skip to Signup →
          </button>
        </div>
        <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
          <motion.div 
            initial={false}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
          />
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-grow flex flex-col gap-6"
          >
            {/* Step 1: Trade & Need Type */}
            {step === 1 && (
              <StepWrapper title="What's your trade & need?" subtitle="Tell us about your craft and the type of support you need.">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">1. Your Trade</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Tailor', icon: '👗', color: 'bg-pink-100' },
                        { label: 'Carpenter', icon: '🪚', color: 'bg-orange-100' },
                        { label: 'Welder', icon: '👨‍🏭', color: 'bg-blue-100' },
                        { label: 'Cobbler', icon: '👞', color: 'bg-amber-100' },
                        { label: 'Baker', icon: '🥖', color: 'bg-yellow-100' },
                        { label: 'Mechanic', icon: '🔧', color: 'bg-gray-100' },
                        { label: 'Electrician', icon: '⚡', color: 'bg-indigo-100' },
                        { label: 'Other', icon: '✨', color: 'bg-purple-100' }
                      ].map(cat => (
                        <button
                          key={cat.label}
                          onClick={() => updateData({ category: cat.label })}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border-2 transition-all active:scale-[0.98]",
                            formData.category === cat.label 
                              ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                              : "bg-white border-outline-variant hover:border-primary/30"
                          )}
                        >
                          <div className="text-xl">{cat.icon}</div>
                          <span className="font-bold text-sm tracking-tight">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                    {formData.category === 'Other' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                        <Input 
                          placeholder="Please specify your trade..."
                          value={formData.otherCategory}
                          onChange={(e) => updateData({ otherCategory: e.target.value })}
                          className="h-12 text-sm font-semibold rounded-xl border-2 focus:border-primary"
                        />
                      </motion.div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">2. Type of Need</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'tools', label: 'Hand Tools', icon: Hammer },
                        { id: 'materials', label: 'Materials', icon: ShoppingBag },
                        { id: 'equipment', label: 'Heavy Equipment', icon: Target },
                        { id: 'other', label: 'Other Support', icon: Sparkles },
                      ].map(type => (
                        <SelectionCard 
                          key={type.id}
                          label={type.label}
                          icon={type.icon}
                          selected={formData.type === type.id}
                          onClick={() => updateData({ type: type.id as any })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 2: Item Details */}
            {step === 2 && (
              <StepWrapper title="Item Details" subtitle="Be specific so backers know what they are funding.">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Item Name</h3>
                    <Input 
                      placeholder="e.g. Industrial Sewing Machine (Singer)"
                      value={formData.itemName}
                      onChange={(e) => updateData({ itemName: e.target.value })}
                      className="h-14 text-lg font-semibold rounded-2xl border-2 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Estimated Cost (₦)</h3>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-primary">₦</span>
                      <input 
                        type="number"
                        placeholder="50,000"
                        value={formData.cost}
                        onChange={(e) => updateData({ cost: e.target.value })}
                        className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-10 text-xl font-extrabold outline-none transition-all placeholder:text-on-surface-variant/30"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Condition</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['Brand New', 'Refurbished', 'Used'].map(c => {
                        const val = c.toLowerCase().replace(' ', '_');
                        return (
                          <button
                            key={c}
                            onClick={() => updateData({ condition: val })}
                            className={cn(
                              "p-3 rounded-xl border-2 font-bold text-sm transition-all",
                              formData.condition === val 
                                ? "bg-primary border-primary text-white" 
                                : "bg-white border-outline-variant hover:border-primary/30"
                            )}
                          >
                            {c}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <StepWrapper title="Where are you located?" subtitle="Select your state and local community.">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">State</h3>
                    <select 
                      value={formData.state}
                      onChange={(e) => updateData({ state: e.target.value, lga: "" })}
                      className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-4 text-lg font-bold bg-white outline-none"
                    >
                      <option value="">Select State</option>
                      {NIGERIA_LOCATIONS.map(s => <option key={s.id} value={s.state}>{s.state}</option>)}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Local Government Area (LGA)</h3>
                    <select 
                      value={formData.lga}
                      onChange={(e) => updateData({ lga: e.target.value })}
                      className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-4 text-lg font-bold bg-white outline-none"
                      disabled={!formData.state}
                    >
                      <option value="">Select LGA</option>
                      {currentLGAs.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                    </select>
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 4: Story & Impact */}
            {step === 4 && (
              <StepWrapper title="Your Story & Impact" subtitle="Why is this important and how will it change things?">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3 flex justify-between items-center">
                      Your Story
                      {formData.story.length > 10 && (
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={async () => {
                            setIsUploading(true);
                            try {
                              const res = await fetch("/api/generate-story", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  experience: "Artisan",
                                  product: formData.category,
                                  community: formData.lga + ", " + formData.state,
                                  equipment: formData.story,
                                  isSelf: true
                                })
                              });
                              const data = await res.json();
                              if (data.success) {
                                updateData({ story: data.story });
                              } else {
                                alert(data.error || "Failed to enhance story");
                              }
                            } catch (err) {
                              alert("AI Service unavailable.");
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                          className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Enhance with AI
                        </button>
                      )}
                    </h3>
                    <Textarea 
                      placeholder="Share your journey and how this will help you grow..."
                      value={formData.story}
                      onChange={(e) => updateData({ story: e.target.value })}
                      className="min-h-[120px] rounded-[1.5rem] border-2 focus:border-primary p-4 text-base font-medium resize-none placeholder:text-on-surface-variant/40"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Expected Impact (Optional)</h3>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                      <input 
                        placeholder="e.g. Training 2 apprentices"
                        value={formData.impact}
                        onChange={(e) => updateData({ impact: e.target.value })}
                        className="w-full h-14 rounded-2xl border-2 border-outline-variant focus:border-primary px-12 text-base font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 5: Timeline & Photo */}
            {step === 5 && (
              <StepWrapper title="Timeline & Photo" subtitle="When do you need it, and can you share a picture?">
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Urgency</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: '7', label: '1 Week' },
                        { id: '14', label: '2 Weeks' },
                        { id: '30', label: '1 Month' },
                        { id: '60', label: '2 Months' },
                        { id: '90', label: '3 Months' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => updateData({ timeline: t.id })}
                          className={cn(
                            "p-3 rounded-xl border-2 font-bold text-sm transition-all",
                            formData.timeline === t.id 
                              ? "bg-primary border-primary text-white" 
                              : "bg-white border-outline-variant hover:border-primary/30"
                          )}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-3">Workspace Photo (Optional)</h3>
                    <label className={cn(
                      "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[1.5rem] transition-all cursor-pointer relative overflow-hidden",
                      formData.photoUrl 
                        ? "border-green-500 bg-green-50" 
                        : "border-primary/20 bg-primary/5 hover:border-primary/40"
                    )}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        disabled={isUploading}
                      />
                      
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs font-black text-primary uppercase tracking-widest">Uploading...</p>
                        </div>
                      ) : formData.photoUrl ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={formData.photoUrl} alt="Uploaded" className="w-20 h-20 object-cover rounded-xl shadow-md" />
                          <p className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Uploaded
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Camera className="w-8 h-8 text-primary opacity-60" />
                          <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Tap to Upload</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </StepWrapper>
            )}

            {/* Step 6: Review */}
            {step === 6 && (
              <StepWrapper title="Review your Need" subtitle="Everything looks good! Ready to create your account?">
                <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">The Need</p>
                      <h3 className="text-xl font-black text-on-surface">{formData.itemName}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Estimated Cost</p>
                      <h3 className="text-xl font-black text-primary">₦{parseInt(formData.cost || '0').toLocaleString()}</h3>
                    </div>
                  </div>
                  <div className="h-px bg-primary/10" />
                  <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {formData.lga}, {formData.state}
                  </div>
                  {formData.photoUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden h-24 border border-primary/10">
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </StepWrapper>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {step > 1 && (
          <Button 
            variant="ghost" 
            onClick={prevStep}
            className="h-16 px-6 rounded-full font-black text-on-surface-variant"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>
        )}
        
        {step < totalSteps ? (
          <Button 
            onClick={nextStep}
            disabled={!isStepValid(step, formData) || isUploading}
            className="h-16 flex-1 rounded-full text-lg font-black shadow-xl shadow-primary/20"
          >
            <span>Next Step</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        ) : (
          <Button 
            onClick={handleFinalSubmit}
            className="h-16 flex-1 rounded-full text-lg font-black shadow-xl shadow-primary/20 bg-green-600 hover:bg-green-700 text-white"
          >
            <span>Complete & Signup</span>
            <CheckCircle2 className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function StepWrapper({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">{title}</h2>
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SelectionCard({ label, icon: Icon, selected, onClick }: { label: string, icon?: any, selected?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left active:scale-[0.98]",
        selected 
          ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
          : "bg-white border-outline-variant hover:border-primary/30 text-on-surface"
      )}
    >
      {Icon && <Icon className={cn("w-6 h-6", selected ? "text-white" : "text-primary")} />}
      <div className="flex-grow">
        <p className={cn("text-base font-bold", selected ? "text-white" : "text-on-surface")}>{label}</p>
      </div>
      {selected && <CheckCircle2 className="w-5 h-5 text-white" />}
    </button>
  );
}

function isStepValid(step: number, data: any) {
  switch (step) {
    case 1: return !!data.category && (data.category !== 'Other' || data.otherCategory.length >= 2) && !!data.type;
    case 2: return data.itemName.length >= 3 && !!data.cost && parseInt(data.cost) > 0 && !!data.condition;
    case 3: return !!data.state && !!data.lga;
    case 4: return data.story.length >= 10;
    case 5: return !!data.timeline;
    default: return true;
  }
}
