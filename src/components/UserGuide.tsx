
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, ChevronUp, Smartphone, Globe, Zap, Shield } from "lucide-react";

export const UserGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Quick Start Guide</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
        <CardDescription>
          Learn how to use the notification system
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400">Step 1</Badge>
                <span className="font-medium text-sm">Send Notifications</span>
              </div>
              <p className="text-sm text-muted-foreground pl-4">
                Use the "Enterprise Backend Simulator" to send test notifications. 
                Enter your custom message and select the notification type.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400">Step 2</Badge>
                <span className="font-medium text-sm">View & Interact</span>
              </div>
              <p className="text-sm text-muted-foreground pl-4">
                Check the "Live Notification Feed" to see your notifications. 
                Click "Open" to simulate deep linking.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-400">Step 3</Badge>
                <span className="font-medium text-sm">Real-time Connection</span>
              </div>
              <p className="text-sm text-muted-foreground pl-4">
                Use the WebSocket Control to connect to real-time services. 
                Default URL: wss://ws.buzzcall.enterprise/v1
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-500/20 text-orange-400">Step 4</Badge>
                <span className="font-medium text-sm">Monitor Analytics</span>
              </div>
              <p className="text-sm text-muted-foreground pl-4">
                View real-time analytics and performance metrics in the dashboard below.
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              Mobile Usage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>Open in mobile browser</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-400" />
                <span>Allow notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                <span>Test all features</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
