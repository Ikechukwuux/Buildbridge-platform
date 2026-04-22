"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Bell, Phone, Mail, Key, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AccountPage() {
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8 animate-pulse space-y-6">
        <div className="h-20 w-1/3 bg-surface-variant/30 rounded-2xl" />
        <div className="h-64 w-full bg-surface-variant/20 rounded-3xl" />
        <div className="h-64 w-full bg-surface-variant/20 rounded-3xl" />
      </div>
    );
  }

  const sections = [
    {
      title: "Security & Privacy",
      icon: Shield,
      color: "text-primary",
      bg: "bg-primary/5",
      items: [
        { label: "Phone Number", value: user?.phone || "Not linked", icon: Phone, action: "Link" },
        { label: "Email Address", value: user?.email, icon: Mail, action: "Verify" },
        { label: "Password", value: "••••••••", icon: Key, action: "Change" },
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "text-secondary",
      bg: "bg-secondary/5",
      items: [
        { label: "Impact Updates", value: "Enabled", action: "Toggle" },
        { label: "Marketing", value: "Disabled", action: "Toggle" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-on-surface tracking-tight flex items-center gap-4">
          <Settings className="w-10 h-10 text-primary" />
          Settings
        </h1>
        <p className="text-on-surface-variant font-medium">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="rounded-[2.5rem] border-outline-variant/30 overflow-hidden">
               <div className="p-8 border-b border-outline-variant/30 bg-surface flex items-center gap-4">
                 <div className={cn("p-3 rounded-2xl", section.bg, section.color)}>
                    <section.icon className="w-6 h-6" />
                 </div>
                 <h2 className="text-xl font-black text-on-surface">{section.title}</h2>
               </div>
               
               <div className="divide-y divide-outline-variant/20 bg-white/50">
                  {section.items.map((item) => (
                    <div key={item.label} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-variant/5 transition-colors">
                       <div className="flex items-center gap-4">
                          {item.icon && <item.icon className="w-5 h-5 text-on-surface-variant/40" />}
                          <div>
                            <p className="text-sm font-black text-on-surface">{item.label}</p>
                            <p className="text-sm font-medium text-on-surface-variant/60">{item.value}</p>
                          </div>
                       </div>
                       <Button variant="outline" className="rounded-full px-6 h-10 text-xs font-black uppercase tracking-widest border-outline-variant hover:border-primary hover:text-primary transition-all">
                         {item.action}
                       </Button>
                    </div>
                  ))}
               </div>
            </Card>
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-outline-variant/30"
        >
          <Card className="p-8 rounded-[2rem] border-error/20 bg-error/5 flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-black text-error">Danger Zone</h3>
                <p className="text-sm text-error/60 font-medium">Permanently delete your account and all associated data.</p>
             </div>
             <Button className="bg-error text-white hover:bg-error/90 rounded-full h-12 px-8 font-black gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
             </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
