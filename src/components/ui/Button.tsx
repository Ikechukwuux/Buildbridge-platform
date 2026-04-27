import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

    const baseStyles = "inline-flex items-center justify-center rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-bold cursor-pointer";

    const sizeStyles = {
      sm: "h-10 px-4 text-sm",
      md: "h-14 px-6 text-base",
      lg: "h-16 px-8 text-lg",
    };

    const variantStyles = {
      primary: "shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5",
      secondary: "border-2 hover:opacity-80",
      ghost: "bg-transparent hover:opacity-80",
      outline: "border-2 hover:opacity-80", // Added outline style
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return { background: 'var(--color-primary)', color: 'var(--color-on-primary)' };
        case "secondary":
          return { background: 'var(--color-surface)', color: 'var(--color-primary)', borderColor: 'var(--color-outline-variant)' };
        case "ghost":
          return { background: 'transparent', color: 'var(--color-primary)' };
        case "outline":
          return { background: 'transparent', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }; // Added outline logic
        default:
          return { background: 'var(--color-primary)', color: 'var(--color-on-primary)' };
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        style={getVariantStyles()}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }