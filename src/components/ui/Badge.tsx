import * as React from "react"
import { Shield, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export type BadgeLevelType = 0 | 1;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  level: BadgeLevelType;
  showLabel?: boolean;
}

const levelConfig: Record<number, { bg: string; color: string; icon: React.ElementType; label: string }> = {
  0: {
    bg: 'var(--color-surface-variant)',
    color: 'var(--color-on-surface-variant)',
    icon: Shield,
    label: "Unverified",
  },
  1: {
    bg: '#dcfce7',
    color: '#166534',
    icon: ShieldCheck,
    label: "Community Vouched",
  },
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, level, children, showLabel = true, ...props }, ref) => {

    const config = levelConfig[level] || levelConfig[0];
    const Icon = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold text-sm shadow-sm transition-colors duration-200 hover:opacity-80 cursor-pointer",
          className
        )}
        style={{ background: config.bg, color: config.color }}
        {...props}
      >
        <Icon className="h-4 w-4" />
        {showLabel && (children || config.label)}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
