"use client";

import React, { useState } from "react";
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout";
import { MessageCircle, Mail, MapPin, HelpCircle, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const faqs = [
  { question: "Who can join BuildBridge as a tradesperson?", answer: "Any skilled tradesperson or micro-entrepreneur in Nigeria with a verifiable craft—including mechanics, tailors, stylists, and more. You'll need a valid NIN and a community vouch to get started." },
  { question: "How are the funds disbursed?", answer: "Funds are typically sent directly to the verified vendor for your tools or equipment, or released to you upon proof of purchase. This ensures transparency for our backers." },
  { question: "Is there a fee for using the platform?", answer: "BuildBridge deducts a small 3% platform fee from each pledge to keep the platform running and improving. The remaining 97% of every Naira pledged goes directly to the tradesperson." },
  { question: "How can I vouch for someone?", answer: "If you are a member of a registered market association or a verified peer on the platform, you can vouch for a tradesperson from their profile page." }
];

export function ContactContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PremiumPageLayout eyebrow="GET IN TOUCH" titlePlain="We're here to" titleAccent="help." subtitle="Have a question or need support? Our team is available to ensure your BuildBridge experience is seamless.">
      <div className="space-y-20">
        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <motion.a 
             href="https://wa.me/2348077827613?text=Hello%20BuildBridge%20Support%2C%20I%20need%20some%20assistance." 
             target="_blank"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             whileHover={{ y: -4 }}
             className="flex flex-col items-center p-10 rounded-[1.5rem] border border-outline-variant/30 text-center transition-shadow hover:shadow-md group"
             style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
           >
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                 <MessageCircle size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>WhatsApp Support</h3>
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>Chat with our team for immediate assistance.</p>
              <Button variant="outline" className="rounded-full font-black border-2 border-green-500/30 text-green-600 hover:bg-green-600 hover:text-white transition-all">
                 Start Chat
              </Button>
           </motion.a>

           <motion.a 
             href="mailto:support@buildbridge.africa"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             whileHover={{ y: -4 }}
             className="flex flex-col items-center p-10 rounded-[1.5rem] border border-outline-variant/30 text-center transition-shadow hover:shadow-md group"
             style={{ background: 'var(--color-surface-container)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
           >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                 <Mail size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight mb-2" style={{ color: 'var(--color-on-surface)' }}>Email Support</h3>
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>Send us a detailed inquiry via email.</p>
              <Button variant="outline" className="rounded-full font-black border-2">
                 Send Email
              </Button>
           </motion.a>
        </div>

        {/* FAQ Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="text-primary" size={20} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-on-surface)' }}>Common Questions</h3>
           </div>

           <div className="space-y-3">
              {faqs.map((faq, index) => (
                 <div key={index} className="rounded-[1.5rem] overflow-hidden border border-outline-variant/30" style={{ background: 'var(--color-surface-container)' }}>
                    <button 
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-colors"
                    >
                       <span className="font-black text-sm md:text-base" style={{ color: 'var(--color-on-surface)' }}>{faq.question}</span>
                       <div className="text-primary shrink-0 ml-4">
                          {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                       </div>
                    </button>
                    <AnimatePresence>
                       {openFaq === index && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                             <div className="p-6 pt-0 text-sm font-medium leading-relaxed border-t border-outline-variant/30" style={{ color: 'var(--color-on-surface-variant)' }}>
                                {faq.answer}
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              ))}
           </div>
        </motion.section>

        {/* Visit Us / Office */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] p-8 sm:p-12 border border-primary/10 flex flex-col md:flex-row gap-12 items-center" style={{ background: 'var(--color-primary-container)' }}>
           <div className="space-y-6 flex-1">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-on-primary-container)' }}>
                 <MapPin size={14} className="inline mr-1" /> Our Headquarters
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--color-on-primary-container)' }}>Lagos, Nigeria</h3>
              <p className="text-base font-medium leading-relaxed" style={{ color: 'var(--color-on-primary-container)', opacity: 0.7 }}>
                While we are a digital-first platform, we maintain a physical presence for our field operations 
                across major Nigerian market hubs.
              </p>
              <div className="pt-4 flex gap-8 border-t border-white/20 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-on-primary-container)', opacity: 0.6 }}>
                 <div>Mon - Fri <span className="block text-primary font-black text-sm normal-case">9am - 5pm</span></div>
                 <div>Sat <span className="block text-primary font-black text-sm normal-case">10am - 2pm</span></div>
              </div>
           </div>
           <div className="flex-1 w-full aspect-video rounded-[1.5rem] bg-white/50 border border-outline-variant/30 flex items-center justify-center p-8 relative overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'var(--color-primary)', filter: 'blur(60px)' }} />
              <div className="relative text-center">
                 <MapPin size={48} className="text-primary mx-auto mb-4 opacity-40" />
                 <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-on-surface-variant)' }}>Building the infrastructure of trust across the nation</p>
              </div>
           </div>
        </motion.section>
      </div>
    </PremiumPageLayout>
  );
}
