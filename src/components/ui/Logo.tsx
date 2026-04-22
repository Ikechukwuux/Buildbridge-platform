"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "primary" | "white";
  className?: string;
  link?: boolean;
  onClick?: () => void;
}

export function Logo({ 
  variant = "primary", 
  className, 
  link = true,
  onClick 
}: LogoProps) {
  const content = (
    <div className={cn("relative h-6 w-[150px]", className)}>
      <Image
        src="/buildbridge-logo-primary.svg"
        alt="BuildBridge"
        fill
        className={cn(
          "object-contain transition-all",
          variant === "white" && "brightness-0 invert"
        )}
        priority
      />
    </div>
  );

  if (link) {
    return (
      <Link href="/" onClick={onClick} className="flex items-center group cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
