
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Shield, Globe, Clock } from "lucide-react";

interface QuickStatsProps {
  notificationCount: number;
  isWebSocketConnected?: boolean;
  isEncryptionReady?: boolean;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ 
  notificationCount, 
  isWebSocketConnected = false,
  isEncryptionReady = false 
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">{notificationCount}</div>
          <div className="text-sm text-muted-foreground">Total Notifications</div>
          <Badge variant="outline" className="mt-2 text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            +23% this week
          </Badge>
        </CardContent>
      </Card>

      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Globe className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
          <div className="text-sm text-muted-foreground">Delivery Rate</div>
          <Badge 
            variant={isWebSocketConnected ? "default" : "secondary"} 
            className="mt-2 text-xs"
          >
            {isWebSocketConnected ? "Real-time Active" : "Connecting..."}
          </Badge>
        </CardContent>
      </Card>

      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">&lt;50ms</div>
          <div className="text-sm text-muted-foreground">Avg Latency</div>
          <Badge variant="outline" className="mt-2 text-xs bg-green-500/10 text-green-400">
            Excellent
          </Badge>
        </CardContent>
      </Card>

      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">RSA-2048</div>
          <div className="text-sm text-muted-foreground">Encryption</div>
          <Badge 
            variant={isEncryptionReady ? "default" : "secondary"} 
            className="mt-2 text-xs"
          >
            {isEncryptionReady ? "E2E Ready" : "Initializing..."}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
