
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Phone, Bell } from "lucide-react";

interface QuickStatsProps {
  notificationCount: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ notificationCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-4 text-center">
          <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">100%</div>
          <div className="text-xs text-muted-foreground">Background Delivery</div>
        </CardContent>
      </Card>
      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-4 text-center">
          <Zap className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">&lt;1s</div>
          <div className="text-xs text-muted-foreground">Notification Latency</div>
        </CardContent>
      </Card>
      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-4 text-center">
          <Phone className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">Native</div>
          <div className="text-xs text-muted-foreground">Java Integration</div>
        </CardContent>
      </Card>
      <Card className="buzz-card-gradient border-border/50">
        <CardContent className="p-4 text-center">
          <Bell className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{notificationCount}</div>
          <div className="text-xs text-muted-foreground">Total Processed</div>
        </CardContent>
      </Card>
    </div>
  );
};
