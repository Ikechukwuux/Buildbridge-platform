"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card } from "./Card"
import { ProgressBar } from "./ProgressBar"
import { Skeleton } from "./Skeleton"
import { Badge } from "./Badge"
import { Button } from "./Button"
import {
  Calendar,
  Heart,
  ShieldCheck,
  ShieldAlert,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  Trash2,
  PencilLine,
  Clock,
  TrendingUp,
  XCircle,
  Sparkles
} from "lucide-react"
import { cn, handleShare, formatStateName } from "@/lib/utils"
import { type Need, type Profile } from "@/types"
import { TRADE_ICONS_MAP } from "@/lib/constants"

import Link from "next/link"

interface NeedCardProps {
  need: Need & { profile?: Profile & { name?: string; full_name?: string } };
  className?: string;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  /** When true, shows owner-specific actions (Verify Now / Share Need) instead of public "Back now" */
  isDashboard?: boolean;
}

function getLocationDisplay(need: NeedCardProps['need']): string {
  const lga = need.location_lga || need.profile?.location_lga
  const state = formatStateName(need.location_state || need.profile?.location_state)
  return [lga, state].filter(Boolean).join(", ") || "Location not provided"
}

export function NeedCard({ need, className, onClick, onDelete, onEdit, isDashboard = false }: NeedCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/needs/${need.id}`);
    }
  };

  const formattedCost = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(need.item_cost / 100);

  const percentage = (need.funded_amount / need.item_cost) * 100;
  const isCompleted = need.status === 'completed' || percentage >= 100;

  const deadlineDate = new Date(need.deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, diffDays);
  const isDeadlinePassed = diffDays <= 0;
  const isNearlyFunded = percentage >= 80 && percentage < 100 && !isDeadlinePassed;
  const isFullyFunded = percentage >= 100;
  const isPartiallyFundedDeadline = isDeadlinePassed && percentage > 0 && percentage < 100;
  const isZeroPledgesDeadline = isDeadlinePassed && need.pledge_count === 0;
  const amountLeft = need.item_cost - need.funded_amount;
  const formattedAmountLeft = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amountLeft / 100);

  // Progress bar color and label
  let progressColor = "bg-primary";
  let progressLabel = "";
  if (isFullyFunded) {
    progressColor = "bg-green-500";
    progressLabel = "Fully Funded ✓";
  } else if (isNearlyFunded) {
    progressColor = "bg-green-500";
    progressLabel = `Almost there — just ${formattedAmountLeft} left`;
  } else if (isPartiallyFundedDeadline) {
    progressColor = "bg-on-surface-variant/40";
    progressLabel = "Closed — Partially Funded";
  } else if (isZeroPledgesDeadline) {
    progressColor = "bg-on-surface-variant/40";
    // This state is private dashboard only, not shown in browse feed
  }

  // Detect verification status from profile badge_level
  const isUnverified = !need.profile?.badge_level || need.profile.badge_level === 'level_0_unverified';

  // Button text and state
  let buttonText = "Back now";
  let buttonDisabled = false;
  let buttonClassName = "bg-primary text-white shadow-primary/20";
  let buttonIcon: React.ReactNode = null;
  let buttonHref: string | null = null;

  if (isDashboard && !isFullyFunded && !isCompleted && !isPartiallyFundedDeadline && !isZeroPledgesDeadline) {
    // Owner dashboard: active need
    buttonText = "Share Need";
    buttonClassName = "bg-primary text-white shadow-primary/20";
    buttonIcon = <Share2 className="h-3.5 w-3.5" />;
  } else if (isFullyFunded) {
    buttonText = "View Story";
    buttonClassName = "bg-primary/10 text-primary shadow-none";
  } else if (isPartiallyFundedDeadline || isZeroPledgesDeadline) {
    buttonText = "Closed";
    buttonDisabled = true;
    buttonClassName = "bg-surface-variant/20 text-on-surface-variant shadow-none cursor-not-allowed";
  } else if (isCompleted) {
    buttonText = "View Impact";
    buttonClassName = "bg-primary/10 text-primary shadow-none";
  }

  const TradeIcon = (need.profile?.trade_category && TRADE_ICONS_MAP[need.profile.trade_category]) || MoreHorizontal;

  const badgeLevel = need.profile?.badge_level === 'level_4_platform_verified' ? 4
    : need.profile?.badge_level === 'level_3_established' ? 3
      : need.profile?.badge_level === 'level_2_trusted_tradesperson' ? 2
        : need.profile?.badge_level === 'level_1_community_member' ? 1 : 0;

  const [imageError, setImageError] = React.useState(false);

  return (
    <Card
      hoverLift
      onClick={handleCardClick}
      className={cn(
        "overflow-hidden flex flex-col h-full bg-surface rounded-[2rem] cursor-pointer group transition-all",
        isCompleted && "ring-2 ring-primary/20 bg-primary/5",
        className
      )}
    >
      {/* Visual Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-variant/30">
        {need.photo_url && !imageError ? (
          <img
            src={need.photo_url}
            alt={need.item_name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <TradeIcon className="h-16 w-16" style={{ color: 'var(--color-primary)', opacity: 0.15 }} />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-white/90 backdrop-blur-sm border border-white/20 text-on-surface shadow-sm">
          <TradeIcon className="h-3.5 w-3.5 text-primary" />
          {need.profile?.trade_category?.replace("_", " ")}
        </div>

        {/* Status Badge */}
        {need.status === 'pending_review' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-warning text-on-warning shadow-xl">
            <Clock className="h-3 w-3" />
            Pending Review
          </div>
        )}
        {need.status === 'active' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-success text-on-success shadow-xl">
            <TrendingUp className="h-3 w-3" />
            Active
          </div>
        )}
        {need.status === 'rejected' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-error text-on-error shadow-xl">
            <XCircle className="h-3 w-3" />
            Rejected
          </div>
        )}
        {need.status === 'funded' && !isCompleted && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-success text-on-success shadow-xl">
            <Sparkles className="h-3 w-3" />
            Fully Funded
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary text-on-primary shadow-xl animate-pulse">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        )}
        {need.status === 'active' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-green-500 text-white shadow-xl">
            <TrendingUp className="h-3 w-3" />
            Active
          </div>
        )}
        {need.status === 'rejected' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white shadow-xl">
            <XCircle className="h-3 w-3" />
            Rejected
          </div>
        )}
        {need.status === 'funded' && !isCompleted && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-teal-500 text-white shadow-xl">
            <Sparkles className="h-3 w-3" />
            Fully Funded
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary text-white shadow-xl animate-pulse">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        )}

        {/* Dashboard Owner Actions */}
        {isDashboard && (
          <>
            <button
              className="absolute bottom-4 left-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-outline/30 hover:bg-white flex items-center justify-center text-on-surface transition-colors shadow-lg cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit();
              }}
              title="Edit Need"
            >
              <PencilLine className="h-5 w-5" />
            </button>
            <button
              className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-error/30 hover:bg-error/10 flex items-center justify-center text-error transition-colors shadow-lg cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
              title="Delete Need"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col flex-grow p-6 gap-6">
        {/* Artisan Info */}
        <div className="flex items-end gap-4">
          <div className="relative shrink-0">
            <img
              src={need.profile?.photo_url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e9ddff' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='40' font-weight='bold' fill='%236750A4'%3E${(need.profile?.full_name || need.profile?.name || 'A').charAt(0)}%3C/text%3E%3C/svg%3E`}
              alt={need.profile?.full_name || need.profile?.name || "Tradesperson"}
              className="h-12 w-12 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            {need.profile?.badge_level === 'level_4_platform_verified' && (
              <div className="absolute -bottom-1 -right-1 rounded-full p-1 bg-green-500 border-2 border-white shadow-lg">
                <ShieldCheck className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-lg font-black truncate text-on-surface leading-none">
              {need.profile?.full_name || need.profile?.name || "Verified Artisan"}
            </h3>
            <div className="flex items-center mt-0.5">
              <span className="text-sm font-medium text-on-surface-variant truncate">
                {getLocationDisplay(need)}
              </span>
            </div>
          </div>
        </div>

        {/* Need Story */}
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-black leading-[1.1] text-on-surface group-hover:text-primary transition-colors">
            {need.item_name}
          </h4>
          <p className="text-base line-clamp-2 leading-relaxed font-medium text-on-surface-variant">
            {need.story}
          </p>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-on-surface">
                  {Math.min(100, Math.floor(percentage))}%
                </span>
                <span className="text-sm font-bold text-on-surface-variant">
                  raised
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-black tracking-widest text-on-surface-variant mb-1 block">
                Days Left
              </span>
              <span className="text-base font-black text-on-surface bg-on-surface-variant/10 px-3 py-1 rounded-full">
                {isDeadlinePassed ? "Ended" : daysRemaining}
              </span>
            </div>
          </div>

          {/* Progress Label */}
          {progressLabel && (
            <div className="text-xs font-black uppercase tracking-widest text-center py-1 px-3 rounded-full bg-surface-variant/20 text-on-surface-variant">
              {progressLabel}
            </div>
          )}

          <div className="relative h-3 w-full bg-surface-variant/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, percentage)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", progressColor)}
            />
          </div>

          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-on-surface-variant/60">
            <span>₦{new Intl.NumberFormat().format(need.funded_amount / 100)} raised</span>
            <span>Goal: {formattedCost}</span>
          </div>
        </div>

        {/* Divider & Actions */}
        <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge level={badgeLevel as 0 | 1 | 2 | 3 | 4} />
          </div>
          <Button
            className={cn(
              "h-10 rounded-xl px-4 font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-1.5",
              buttonClassName,
              buttonDisabled && "cursor-not-allowed"
            )}
            disabled={buttonDisabled}
            onClick={(e: React.MouseEvent) => {
              if (buttonHref) {
                e.stopPropagation();
                router.push(buttonHref);
              } else if (isDashboard && buttonText === "Share Need") {
                e.stopPropagation();
                const needUrl = `${window.location.origin}/needs/${need.id}`;
                handleShare(`Help ${need.profile?.name || "Verified Artisan"} get a ${need.item_name}`, `Support ${need.profile?.name || "this artisan"}'s need on BuildBridge!`, needUrl);
              }
            }}
          >
            {buttonIcon}
            {buttonText}
          </Button>
        </div>

      </div>
    </Card>
  );
}

export function NeedCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="flex flex-col p-5 gap-4 flex-grow">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2 flex-grow">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex flex-col gap-3 mt-auto pt-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-2.5 w-full" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}
