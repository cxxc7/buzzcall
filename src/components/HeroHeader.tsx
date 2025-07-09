
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Bell, Zap, Smartphone } from "lucide-react";

interface HeroHeaderProps {
  isConnected: boolean;
  badgeCount: number;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ isConnected, badgeCount }) => {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative">
          <div className="p-4 buzz-accent-gradient rounded-2xl buzz-glow">
            <Zap className="h-10 w-10 text-background" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center buzz-pulse">
            <Bell className="h-3 w-3 text-background" />
          </div>
        </div>
        <div className="text-left">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BuzzCall
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Enterprise Push Notification Engine
          </p>
          <p className="text-sm text-muted-foreground">
            Real-time • Native Android • Production Ready
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <Badge variant={isConnected ? "default" : "destructive"} className="text-sm px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-current mr-2 buzz-pulse"></div>
          {isConnected ? "FCM Engine Active" : "Engine Offline"}
        </Badge>
        {badgeCount > 0 && (
          <Badge className="bg-destructive text-destructive-foreground px-4 py-2 buzz-glow">
            {badgeCount} Unread Alerts
          </Badge>
        )}
        <Badge variant="outline" className="px-4 py-2">
          <Smartphone className="w-4 h-4 mr-2" />
          Android 15 Compatible
        </Badge>
      </div>
    </div>
  );
};
