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
  const totalSteps = 12;
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
    timeline: "within_1_month",
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `needs/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('needs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('needs')
        .getPublicUrl(filePath);

      updateData({ photoUrl: publicUrl });
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
            {/* Step 1: Category */}
            {step === 1 && (
              <StepWrapper title="What's your trade?" subtitle="Choose the category that best describes your work.">
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
                      onClick={() => { 
                        updateData({ category: cat.label }); 
                        if (cat.label !== 'Other') nextStep(); 
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all gap-3 active:scale-[0.98]",
                        formData.category === cat.label 
                          ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                          : "bg-white border-outline-variant hover:border-primary/30"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner",
                        formData.category === cat.label ? "bg-white/20" : cat.color
                      )}>
                        {cat.icon}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {formData.category === 'Other' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <Input 
                      placeholder="Please specify your trade..."
                      value={formData.otherCategory}
                      onChange={(e) => updateData({ otherCategory: e.target.value })}
                      className="h-16 text-lg font-semibold rounded-2xl border-2 focus:border-primary placeholder:font-medium placeholder:text-on-surface-variant/50"
                      autoFocus
                    />
                  </motion.div>
                )}
              </StepWrapper>
            )}

            {/* Step 2: Need Type */}
            {step === 2 && (
              <StepWrapper title="What kind of support?" subtitle="Select the type of need you have.">
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'tools', label: 'Hand Tools', icon: Hammer, desc: 'Small essential equipment' },
                    { id: 'materials', label: 'Materials', icon: ShoppingBag, desc: 'Fabric, wood, metal, etc.' },
                    { id: 'equipment', label: 'Heavy Equipment', icon: Target, desc: 'Industrial machines & generators' },
                    { id: 'other', label: 'Other Support', icon: Sparkles, desc: 'Something else entirely' },
                  ].map(type => (
                    <div key={type.id} className="flex flex-col gap-2">
                      <SelectionCard 
                        label={type.label}
                        icon={type.icon}
                        description={type.desc}
                        selected={formData.type === type.id}
                        onClick={() => { updateData({ type: type.id as any }); if(type.id !== 'other') nextStep(); }}
                      />
                      {type.id === 'other' && formData.type === 'other' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="px-2"
                        >
                          <Input 
                            placeholder="Please specify your need type..."
                            value={formData.itemName}
                            onChange={(e) => updateData({ itemName: e.target.value })}
                            className="h-14 rounded-2xl border-primary focus:ring-primary placeholder:font-medium placeholder:text-on-surface-variant/50"
                            autoFocus
                          />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 3: Item Name */}
            {step === 3 && (
              <StepWrapper title="What exactly do you need?" subtitle="Be specific so backers know what they are funding.">
                <Input 
                  placeholder="e.g. Industrial Sewing Machine (Singer)"
                  value={formData.itemName}
                  onChange={(e) => updateData({ itemName: e.target.value })}
                  className="h-16 text-xl font-semibold rounded-2xl border-2 focus:border-primary placeholder:font-medium placeholder:text-on-surface-variant/50"
                  autoFocus
                />
              </StepWrapper>
            )}

            {/* Step 4: Cost */}
            {step === 4 && (
              <StepWrapper title="How much does it cost?" subtitle="Enter the estimated price in Naira (₦).">
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-primary">₦</span>
                  <input 
                    type="number"
                    placeholder="50,000"
                    value={formData.cost}
                    onChange={(e) => updateData({ cost: e.target.value })}
                    className="w-full h-20 rounded-[2rem] border-2 border-outline-variant focus:border-primary px-14 text-3xl font-extrabold outline-none transition-all placeholder:font-medium placeholder:text-on-surface-variant/30"
                    autoFocus
                  />
                </div>
              </StepWrapper>
            )}

            {/* Step 5: State */}
            {step === 5 && (
              <StepWrapper title="Where are you located?" subtitle="Select your state in Nigeria.">
                <select 
                  value={formData.state}
                  onChange={(e) => updateData({ state: e.target.value })}
                  className="w-full h-16 rounded-2xl border-2 border-outline-variant focus:border-primary px-6 text-lg font-bold bg-white outline-none"
                >
                  <option value="">Select State</option>
                  {NIGERIA_LOCATIONS.map(s => <option key={s.id} value={s.state}>{s.state}</option>)}
                </select>
              </StepWrapper>
            )}

            {/* Step 6: LGA */}
            {step === 6 && (
              <StepWrapper title="Your local community?" subtitle="Which LGA do you operate from?">
                <select 
                  value={formData.lga}
                  onChange={(e) => updateData({ lga: e.target.value })}
                  className="w-full h-16 rounded-2xl border-2 border-outline-variant focus:border-primary px-6 text-lg font-bold bg-white outline-none"
                  disabled={!formData.state}
                >
                  <option value="">Select LGA</option>
                  {currentLGAs.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                </select>
              </StepWrapper>
            )}

            {/* Step 7: Story */}
            {step === 7 && (
              <StepWrapper title="Tell us your story" subtitle="Why is this important for your business?">
                <Textarea 
                  placeholder="Share your journey and how this will help you grow..."
                  value={formData.story}
                  onChange={(e) => updateData({ story: e.target.value })}
                  className="min-h-[160px] rounded-[2rem] border-2 focus:border-primary p-8 text-lg font-medium leading-relaxed resize-none placeholder:font-normal placeholder:text-on-surface-variant/40"
                />
              </StepWrapper>
            )}

            {/* Step 8: Impact */}
            {step === 8 && (
              <StepWrapper title="What's the impact? (Optional)" subtitle="How many lives will this change? (e.g. 5 jobs created)">
                <div className="relative">
                  <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                  <input 
                    placeholder="e.g. Training 2 apprentices"
                    value={formData.impact}
                    onChange={(e) => updateData({ impact: e.target.value })}
                    className="w-full h-16 rounded-2xl border-2 border-outline-variant focus:border-primary px-16 text-lg font-bold outline-none"
                  />
                </div>
              </StepWrapper>
            )}

            {/* Step 9: Condition */}
            {step === 9 && (
              <StepWrapper title="Condition of the item?" subtitle="Are you buying new or refurbished?">
                <div className="flex flex-col gap-3">
                  {['Brand New', 'Refurbished', 'Used'].map(c => (
                    <SelectionCard 
                      key={c} 
                      label={c} 
                      selected={formData.condition === c.toLowerCase().replace(' ', '_')}
                      onClick={() => { 
                        updateData({ condition: c.toLowerCase().replace(' ', '_') }); 
                        nextStep(); 
                      }}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 10: Timeline */}
            {step === 10 && (
              <StepWrapper title="How urgent is this?" subtitle="When do you hope to get this item?">
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'within_1_month', label: 'Within a month', icon: Clock },
                    { id: 'within_3_months', label: 'Next 3 months', icon: Clock },
                    { id: 'whenever_possible', label: 'Whenever possible', icon: Clock },
                  ].map(t => (
                    <SelectionCard 
                      key={t.id} 
                      label={t.label}
                      icon={t.icon}
                      selected={formData.timeline === t.id}
                      onClick={() => { updateData({ timeline: t.id }); nextStep(); }}
                    />
                  ))}
                </div>
              </StepWrapper>
            )}

            {/* Step 11: Photo */}
            {step === 11 && (
              <StepWrapper title="Add a photo (Optional)" subtitle="A photo of your workshop or current tools builds trust.">
                <label className={cn(
                  "flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-[2.5rem] transition-all cursor-pointer relative overflow-hidden",
                  formData.photoUrl 
                    ? "border-green-500 bg-green-50" 
                    : "border-primary/10 bg-primary/5 hover:border-primary/30"
                )}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    disabled={isUploading}
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-black text-primary uppercase tracking-widest">Uploading...</p>
                    </div>
                  ) : formData.photoUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <img src={formData.photoUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-2xl shadow-lg" />
                      <p className="text-sm font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Image Uploaded
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest">Click to Upload Photo</p>
                    </div>
                  )}
                </label>
              </StepWrapper>
            )}

            {/* Step 12: Review */}
            {step === 12 && (
              <StepWrapper title="Review your Need" subtitle="Everything looks good! Ready to create your account?">
                <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">The Need</p>
                      <h3 className="text-2xl font-black text-on-surface">{formData.itemName}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Estimated Cost</p>
                      <h3 className="text-2xl font-black text-primary">₦{parseInt(formData.cost || '0').toLocaleString()}</h3>
                    </div>
                  </div>
                  <div className="h-px bg-primary/10" />
                  <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {formData.lga}, {formData.state}
                  </div>
                  {formData.photoUrl && (
                    <div className="mt-4 rounded-2xl overflow-hidden h-32 border-2 border-primary/10">
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
            className="h-16 px-8 rounded-full font-black text-on-surface-variant"
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">{title}</h2>
        <p className="text-on-surface-variant font-medium leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SelectionCard({ label, icon: Icon, description, selected, onClick }: { label: string, icon?: any, description?: string, selected?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-5 text-left active:scale-[0.98]",
        selected 
          ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
          : "bg-white border-outline-variant hover:border-primary/30 text-on-surface"
      )}
    >
      {Icon && <Icon className={cn("w-8 h-8", selected ? "text-white" : "text-primary")} />}
      <div className="flex-grow">
        <p className={cn("text-lg font-bold", selected ? "text-white" : "text-on-surface")}>{label}</p>
        {description && <p className={cn("text-sm font-medium opacity-60", selected ? "text-white/80" : "text-on-surface-variant")}>{description}</p>}
      </div>
      {selected && <CheckCircle2 className="w-6 h-6 text-white" />}
    </button>
  );
}

function isStepValid(step: number, data: any) {
  switch (step) {
    case 1: return !!data.category && (data.category !== 'Other' || data.otherCategory.length >= 2);
    case 2: return !!data.type && (data.type !== 'other' || data.itemName.length > 0);
    case 3: return data.itemName.length >= 3;
    case 4: return !!data.cost && parseInt(data.cost) > 0;
    case 5: return !!data.state;
    case 6: return !!data.lga;
    case 7: return data.story.length >= 10;
    case 8: return true; // Impact is now optional
    case 9: return !!data.condition; // Condition is now required
    default: return true;
  }
}
