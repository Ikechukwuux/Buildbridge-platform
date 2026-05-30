"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  CreditCard,
  ShieldCheck,
  Banknote,
  Camera,
  AlertCircle,
  Receipt,
  Lock,
  ArrowRight,
} from "lucide-react"
import { PremiumPageLayout } from "@/components/layout/PremiumPageLayout"

const STEPS = [
  {
    number: "01",
    icon: CreditCard,
    title: "You make a donation",
    description:
      "Pledge via Paystack — card, bank transfer, USSD, or bank account. The full pledge amount is charged at checkout. No hidden fees, no upsells.",
    accent: "from-blue-500/10 to-blue-500/0 text-blue-600",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Funds are held securely",
    description:
      "Your donation is held in a secured Paystack subaccount tied to the artisan's need — not in BuildBridge's general account. Funds don't move until milestones are met.",
    accent: "from-emerald-500/10 to-emerald-500/0 text-emerald-600",
  },
  {
    number: "03",
    icon: Receipt,
    title: "A 3% platform fee is deducted",
    description:
      "3% of every pledge keeps BuildBridge running — payment processing, verification, fraud monitoring, and improving the platform. The remaining 97% is the artisan's portion.",
    accent: "from-primary/10 to-primary/0 text-primary",
  },
  {
    number: "04",
    icon: Camera,
    title: "Artisan uploads proof",
    description:
      "When the artisan crosses a funding milestone, they're notified to purchase the equipment and upload proof — photo of the receipt, the tool itself, or a short video.",
    accent: "from-amber-500/10 to-amber-500/0 text-amber-600",
  },
  {
    number: "05",
    icon: Banknote,
    title: "Admin reviews and releases funds",
    description:
      "Our team reviews the proof within 1–2 business days. Once approved, the milestone amount is transferred directly to the artisan's bank account. Every release is logged.",
    accent: "from-indigo-500/10 to-indigo-500/0 text-indigo-600",
  },
]

const FAQ_ITEMS = [
  {
    q: "Is BuildBridge an investment platform?",
    a: "No. BuildBridge is a donation platform. You are supporting an artisan — there is no return, no interest, and no equity. Every pledge is a contribution, not an investment.",
  },
  {
    q: "What happens if the artisan doesn't upload proof?",
    a: "If proof isn't uploaded within 30 days of being notified, BuildBridge first nudges the artisan repeatedly. If they still don't respond, the campaign is paused, the milestone amount stays held, and we contact backers about a partial refund.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — if a campaign is cancelled, flagged as fraudulent, or fails to release proof within our cure window, you can request a refund of any pledged amount that hasn't been disbursed yet. Contact support@buildbridge.africa within 60 days of your pledge.",
  },
  {
    q: "Why a 3% platform fee?",
    a: "BuildBridge has to verify artisans, monitor for fraud, process payments, and host the platform itself. The 3% fee — well below standard crowdfunding platforms — is what makes that sustainable so we don't need to charge artisans anything to list.",
  },
  {
    q: "Is my card information stored on BuildBridge?",
    a: "No. All card and account details are handled directly by Paystack — a PCI-DSS compliant payment processor. BuildBridge never sees or stores your payment credentials.",
  },
]

export function PaymentProcessingContent() {
  return (
    <PremiumPageLayout
      eyebrow="HOW PAYMENTS WORK"
      titlePlain="From your pledge"
      titleAccent="to the artisan."
      subtitle="A clear, end-to-end breakdown of how every donation flows on BuildBridge — from card swipe to artisan's bank account."
    >
      <div className="flex flex-col gap-20">
        {/* Fee breakdown headline card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="p-6 rounded-[1.5rem] bg-primary/5 border border-primary/15 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest font-black text-primary">
              Of every ₦100 donated
            </p>
            <p className="text-4xl font-black text-on-surface tracking-tight">₦97</p>
            <p className="text-sm font-medium text-on-surface-variant">
              goes to the artisan after a 3% platform fee.
            </p>
          </div>
          <div className="p-6 rounded-[1.5rem] bg-surface-variant/30 border border-outline-variant/30 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">
              Held securely
            </p>
            <p className="text-4xl font-black text-on-surface tracking-tight">0 days</p>
            <p className="text-sm font-medium text-on-surface-variant">
              Funds never sit in BuildBridge's account — they're held in Paystack subaccounts.
            </p>
          </div>
          <div className="p-6 rounded-[1.5rem] bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest font-black text-emerald-700">
              Released only after proof
            </p>
            <p className="text-4xl font-black text-on-surface tracking-tight">1–2 days</p>
            <p className="text-sm font-medium text-on-surface-variant">
              Typical admin review window after the artisan uploads proof.
            </p>
          </div>
        </motion.section>

        {/* The Flow */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <p className="text-[10px] uppercase tracking-widest font-black text-primary">
              The flow
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface">
              Five steps. Nothing hidden.
            </h2>
          </div>

          <ol className="flex flex-col gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.li
                  key={step.number}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative p-6 md:p-8 rounded-[1.75rem] border border-outline-variant/30 bg-white flex gap-5 md:gap-8 items-start`}
                >
                  <div className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 ${step.accent}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant/50">
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-on-surface tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-base text-on-surface-variant font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </section>

        {/* What if proof isn't uploaded */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] p-8 md:p-10 border border-amber-400/40 bg-amber-50/70 flex gap-5 items-start"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-black text-on-surface tracking-tight">
              What if the artisan doesn't upload proof?
            </h3>
            <p className="text-base font-medium text-on-surface-variant leading-relaxed">
              Funds aren't released without proof. Our system nudges artisans automatically at day 3,
              7, and 14. If proof still hasn't arrived within 30 days, the campaign is paused, the
              artisan loses their trust score, and we work with backers on a refund of any
              undisbursed portion. Your money never moves until something real has been bought.
            </p>
          </div>
        </motion.section>

        {/* FAQ */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 max-w-2xl">
            <p className="text-[10px] uppercase tracking-widest font-black text-primary">
              Common questions
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-on-surface">
              Frequently asked
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map(item => (
              <details
                key={item.q}
                className="group rounded-[1.5rem] border border-outline-variant/30 bg-white overflow-hidden"
              >
                <summary className="px-6 py-5 cursor-pointer flex items-center justify-between gap-4 list-none">
                  <p className="text-base md:text-lg font-black text-on-surface">
                    {item.q}
                  </p>
                  <span className="text-on-surface-variant/50 group-open:rotate-45 transition-transform text-2xl font-light leading-none">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 -mt-1 text-sm md:text-base font-medium text-on-surface-variant leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Security strip */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] p-8 md:p-12 bg-on-surface text-surface flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-yellow-400/15 text-yellow-400 flex items-center justify-center shrink-0">
            <Lock className="h-7 w-7" />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-2xl font-black tracking-tight">Built on PCI-DSS infrastructure.</h3>
            <p className="text-base font-medium text-white/70 leading-relaxed">
              All payments are processed by Paystack — a licensed Nigerian payment processor with
              PCI-DSS compliance. Card details never touch BuildBridge servers. Connections are
              encrypted end-to-end with TLS 1.3.
            </p>
          </div>
        </motion.section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/browse"
            className="flex-1 h-14 rounded-full bg-primary text-on-primary font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Browse open needs
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/trust"
            className="flex-1 h-14 rounded-full border-2 border-outline-variant text-on-surface font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors"
          >
            How verification works
          </Link>
        </div>
      </div>
    </PremiumPageLayout>
  )
}
