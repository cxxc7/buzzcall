
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Wifi, WifiOff } from "lucide-react";

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  isWebSocketConnected: boolean;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ 
  children, 
  isWebSocketConnected 
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Status Bar */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">BuzzCall Mobile</span>
        </div>
        <div className="flex items-center gap-2">
          {isWebSocketConnected ? (
            <Wifi className="h-4 w-4 text-green-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {isWebSocketConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="px-3 py-4 space-y-4">
        {children}
      </div>
    </div>
  );
};
