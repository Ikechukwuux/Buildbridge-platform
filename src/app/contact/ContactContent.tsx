"use client";

import React, { useState } from "react";
import { InfoLayout } from "@/components/layout/InfoLayout";
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  HelpCircle, 
  Plus, 
  Minus,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const faqs = [
  {
    question: "Who can join BuildBridge as a tradesperson?",
    answer: "Any skilled tradesperson or micro-entrepreneur in Nigeria with a verifiable craft—including mechanics, tailors, stylists, and more. You'll need a valid NIN and a community vouch to get started."
  },
  {
    question: "How are the funds disbursed?",
    answer: "Funds are typically sent directly to the verified vendor for your tools or equipment, or released to you upon proof of purchase. This ensures transparency for our backers."
  },
  {
    question: "Is there a fee for using the platform?",
    answer: "BuildBridge adds a small platform fee to every pledge to cover verification costs, payment processing, and escrow services. Tradespeople receive the exact amount requested for their need."
  },
  {
    question: "How can I vouch for someone?",
    answer: "If you are a member of a registered market association or a verified peer on the platform, you can vouch for a tradesperson from their profile page."
  }
];

export function ContactContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <InfoLayout
      heroTitle="We're here to help"
      heroSubtitle="Have a question or need support? Our team is available to ensure your BuildBridge experience is seamless."
    >
      <div className="space-y-16">
        {/* Support Channels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <motion.a 
             href="https://wa.me/2348077827613?text=Hello%20BuildBridge%20Support%2C%20I%20need%20some%20assistance." 
             target="_blank"
             whileHover={{ y: -5 }}
             className="flex flex-col items-center p-10 rounded-[2.5rem] bg-green-50 border border-green-100 text-center hover:bg-green-100/50 transition-all group"
           >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                 <MessageCircle size={32} />
              </div>
              <h3 className="text-headline-small font-bold text-green-900 mb-2 italic">WhatsApp Support</h3>
              <p className="text-green-700 text-sm mb-6 italic">Chat with our team for immediate assistance.</p>
              <Button variant="outline" className="rounded-full border-green-200 text-green-700 hover:bg-green-600 hover:text-white">
                 Start Chat
              </Button>
           </motion.a>

           <motion.a 
             href="mailto:support@buildbridge.africa"
             whileHover={{ y: -5 }}
             className="flex flex-col items-center p-10 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-center hover:bg-primary/10 transition-all group"
           >
              <div className="w-16 h-16 rounded-2xl bg-white shadow-premium flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                 <Mail size={32} />
              </div>
              <h3 className="text-headline-small font-bold text-on-surface mb-2 italic">Email Support</h3>
              <p className="text-on-surface-variant text-sm mb-6 italic">Send us a detailed inquiry via email.</p>
              <Button variant="outline" className="rounded-full">
                 Send Email
              </Button>
           </motion.a>
        </section>

        {/* FAQ Section */}
        <section className="pt-8">
           <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="text-primary" size={28} />
              <h3 className="text-display-small font-bold text-on-surface italic">Common Questions</h3>
           </div>

           <div className="space-y-4">
              {faqs.map((faq, index) => (
                 <div 
                   key={index} 
                   className="border border-outline-variant rounded-2xl overflow-hidden bg-white/50"
                 >
                    <button 
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-colors"
                    >
                       <span className="font-bold text-on-surface italic">{faq.question}</span>
                       <div className="text-primary">
                          {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                       </div>
                    </button>
                    <AnimatePresence>
                       {openFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/50"
                          >
                             <div className="p-6 pt-0 text-on-surface-variant leading-relaxed italic text-sm border-t border-outline-variant/30">
                                {faq.answer}
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              ))}
           </div>
        </section>

        {/* Visit Us / Office Placeholder */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-10 border border-outline-variant flex flex-col md:flex-row gap-12 items-center">
           <div className="space-y-6 flex-1">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                 <MapPin size={16} /> Our Headquarters
              </div>
              <h3 className="text-headline-large font-bold text-on-surface mb-2 italic underline decoration-primary/30">Lagos, Nigeria</h3>
              <p className="text-on-surface-variant italic leading-relaxed">
                While we are a digital-first platform, we maintain a physical presence for our field operations 
                across major Nigerian market hubs.
              </p>
              <div className="pt-4 flex gap-8 border-t border-outline-variant/30 text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
                 <div>Mon - Fri <span className="block text-primary">9am - 5pm</span></div>
                 <div>Sat <span className="block text-primary">10am - 2pm</span></div>
              </div>
           </div>
           <div className="flex-1 w-full aspect-video rounded-2xl bg-white/50 border border-outline-variant flex items-center justify-center p-8 grayscale opacity-50 relative overflow-hidden">
             {/* Map Placeholder Graphic */}
              <div className="absolute inset-0 bg-primary/5 mesh-bg opacity-30" />
              <div className="relative text-center">
                 <MapPin size={48} className="text-primary mx-auto mb-4" />
                 <p className="text-xs font-bold italic">Building the infrastructure of trust across the nation</p>
              </div>
           </div>
        </section>
      </div>
    </InfoLayout>
  );
}
