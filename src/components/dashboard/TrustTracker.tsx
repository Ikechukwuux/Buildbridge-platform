import * as React from "react"
import { Badge, type BadgeLevelType } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Button } from "@/components/ui/Button"
import { ArrowRight, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react"

interface TrustTrackerProps {
  currentLevel: BadgeLevelType;
  vouches: number;
  onVouchRequest: () => void;
}

export function TrustTracker({ currentLevel, vouches, onVouchRequest }: TrustTrackerProps) {

  const safeLevel = (currentLevel === 0 || currentLevel === 1) ? currentLevel : 0

  const getNextMilestone = () => {
    switch (safeLevel) {
      case 0:
        return {
          title: "Level 1: Community Vouched",
          task: `${Math.max(0, 3 - vouches)} more community vouches needed`,
          progress: Math.min(100, (vouches / 3) * 100),
          cta: "Copy Vouch Link"
        }
      case 1:
        return {
          title: "Community Vouched",
          task: "Your profile is trusted by the community!",
          progress: 100,
          cta: "Copy Vouch Link"
        }
      default:
        return {
          title: "Get Vouched",
          task: "Build trust through community vouches",
          progress: 0,
          cta: "Copy Vouch Link"
        }
    }
  }

  const next = getNextMilestone()

  return (
    <Card className="p-6 bg-white border border-outline-variant/50 shadow-sm rounded-[2rem] overflow-hidden flex flex-col gap-6">
      {/* Current Status Header */}
      <div className="flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
               <ShieldCheck className="h-3 w-3" />
               Trust Tier
            </p>
            <div className="relative inline-flex mt-1">
               <Badge level={safeLevel} className="scale-110 origin-left" />
            </div>
         </div>
         {next.progress === 100 && (
            <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
               <CheckCircle2 className="h-6 w-6" />
            </div>
         )}
      </div>

      {/* Next Step Progress Area */}
      <div className="flex flex-col gap-5 p-5 rounded-3xl border" style={{ background: 'rgba(0,0,0,0.03)', borderColor: 'var(--color-outline-variant)' }}>
         <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
               <p className="text-[10px] uppercase font-black tracking-widest" style={{ color: 'var(--color-primary)' }}>Next Milestone</p>
               <h3 className="text-sm font-black" style={{ color: 'var(--color-on-surface)' }}>{next.title}</h3>
            </div>
            <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ color: 'var(--color-primary)', background: 'var(--color-primary-container)', border: '1px solid var(--color-primary)' }}>
               {Math.min(100, Math.round(next.progress || 0))}%
            </span>
         </div>

         <div className="flex flex-col gap-3">
            <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-surface-variant)' }}>
              <div
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${Math.min(100, next.progress || 0)}%`, background: 'var(--color-primary)' }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold leading-tight" style={{ color: 'var(--color-on-surface-variant)' }}>
               <div className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--color-primary)' }} />
               {next.task}
            </div>
         </div>

         <div className="flex flex-col gap-2 pt-1">
            <Button onClick={onVouchRequest} className="w-full rounded-xl py-5 h-auto text-xs font-black uppercase tracking-widest gap-2" variant="secondary">
              {next.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
         </div>
      </div>
    </Card>
  )
}
