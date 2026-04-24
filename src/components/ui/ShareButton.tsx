"use client"

import * as React from "react"
import { Share2 } from "lucide-react"
import { Button, ButtonProps } from "./Button"
import { handleShare } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ShareButtonProps extends Omit<ButtonProps, "onClick"> {
  title: string;
  text: string;
  url?: string;
  iconOnly?: boolean;
}

export function ShareButton({ title, text, url, className, variant = "ghost", size = "sm", children, iconOnly = false, ...props }: ShareButtonProps) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let shareUrl = url || window.location.href;
    if (shareUrl.startsWith('/')) {
      shareUrl = `${window.location.origin}${shareUrl}`;
    }
    
    handleShare(title, text, shareUrl);
  };

  if (iconOnly) {
    return (
      <button 
        className={cn("flex items-center justify-center transition-colors", className)}
        onClick={onClick}
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </button>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={onClick}
      {...props}
    >
      {children || (
        <>
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </>
      )}
    </Button>
  )
}
