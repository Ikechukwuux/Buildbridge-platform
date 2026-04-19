"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, X } from "lucide-react"
import { Button } from "./Button"
import { Input } from "./Input"
import { cn } from "@/lib/utils"

interface SessionExpiredModalProps {
  isOpen?: boolean
  onClose?: () => void
  onConfirm?: (credentials: { otp?: string; password?: string }) => void
  authType?: "otp" | "password"
}

export function SessionExpiredModal({ 
  isOpen = false, 
  onClose, 
  onConfirm,
  authType = "otp"
}: SessionExpiredModalProps) {
  const [otp, setOtp] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (onConfirm) {
      onConfirm(authType === "otp" ? { otp } : { password })
    }
    
    setIsLoading(false)
    setOtp("")
    setPassword("")
    if (onClose) onClose()
  }
  
  const handleClose = () => {
    if (onClose) onClose()
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={handleClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-surface rounded-t-3xl shadow-2xl border-t border-outline-variant max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8 max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-title-large font-black text-on-surface">
                    You've been away for a while
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-surface-variant rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-on-surface-variant" />
                </button>
              </div>
              
              <p className="text-body-large text-on-surface-variant mb-8">
                Please confirm it's still you to continue.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {authType === "otp" ? (
                  <div className="space-y-3">
                    <label htmlFor="otp" className="text-label-medium font-bold text-on-surface block">
                      Enter the 6-digit code sent to your phone
                    </label>
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="text-center text-3xl font-black h-16 tracking-widest"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label htmlFor="password" className="text-label-medium font-bold text-on-surface block">
                      Enter your password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                )}
                
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full h-12 text-lg font-bold"
                >
                  Confirm and continue
                </Button>
                
                <p className="text-center text-body-small text-on-surface-variant">
                  Your in-progress action will be preserved and retried automatically.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}