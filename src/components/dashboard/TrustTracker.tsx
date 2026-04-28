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
  
  const getNextMilestone = () => {
    switch (currentLevel) {
      case 0:
        return {
          title: "Level 1: Community Vouched",
          task: `${3 - vouches} more community vouches needed`,
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
        return null
    }
  }

  const next = getNextMilestone()

  return (
    <Card className="p-6 bg-white border border-outline-variant/50 shadow-sm rounded-[2rem] overflow-hidden flex flex-col gap-6">
      {/* Current Status Header */}
      <div className="flex items-center justify-between">
         <div className="flex flex-col gap-1">
            <p className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em] opacity-60 flex items-center gap-1.5">
               <ShieldCheck className="h-3 w-3" />
               Trust Tier
            </p>
            <div className="relative inline-flex mt-1">
               <Badge level={currentLevel} className="scale-110 origin-left" />
            </div>
         </div>
         {next?.progress === 100 && (
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success">
               <CheckCircle2 className="h-6 w-6" />
            </div>
         )}
      </div>

      {/* Next Step Progress Area */}
      <div className="flex flex-col gap-5 p-5 bg-surface-variant/20 rounded-3xl border border-white/50">
         <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
               <p className="text-[10px] uppercase font-black text-primary tracking-widest opacity-80">Next Milestone</p>
               <h3 className="text-sm font-black text-on-surface">{next?.title}</h3>
            </div>
            <span className="text-xs font-black text-primary bg-white px-2 py-0.5 rounded-lg border border-primary/10">
               {Math.min(100, Math.round(next?.progress || 0))}%
            </span>
         </div>
         
         <div className="flex flex-col gap-3">
            <ProgressBar percentage={next?.progress || 0} className="h-2.5 bg-white shadow-inner" />
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold leading-tight">
               <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
               {next?.task}
            </div>
         </div>
         
          <div className="flex flex-col gap-2 pt-1">
             <Button onClick={onVouchRequest} className="w-full rounded-xl py-5 h-auto text-xs font-black uppercase tracking-widest gap-2 bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10 shadow-none">
               {next?.cta}
               <ArrowRight className="h-3.5 w-3.5" />
             </Button>
            <Button variant="ghost" className="w-full h-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-primary transition-colors">
               Trust Logic Specs
               <ExternalLink className="h-3 w-3 ml-1.5" />
            </Button>
         </div>
      </div>
    </Card>
  )
}
