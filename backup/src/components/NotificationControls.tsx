
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Video, MessageSquare, Settings } from "lucide-react";
import NotificationService from '@/services/NotificationService';

interface NotificationControlsProps {
  hasNotifications: boolean;
  onClearAll: () => void;
}

export const NotificationControls: React.FC<NotificationControlsProps> = ({ 
  hasNotifications, 
  onClearAll 
}) => {
  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          BuzzCall Control Center
        </CardTitle>
        <CardDescription>
          Test enterprise-grade push notifications with smart routing and deep linking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => NotificationService.sendTestNotification('call')}
            className="flex items-center gap-3 h-12 buzz-accent-gradient hover:opacity-90 transition-all"
          >
            <Phone className="h-5 w-5" />
            Voice Call Alert
          </Button>
          
          <Button 
            onClick={() => NotificationService.sendTestNotification('video')}
            className="flex items-center gap-3 h-12 bg-blue-600 hover:bg-blue-700 transition-all"
          >
            <Video className="h-5 w-5" />
            Video Conference
          </Button>
          
          <Button 
            onClick={() => NotificationService.sendTestNotification('message')}
            className="flex items-center gap-3 h-12 bg-purple-600 hover:bg-purple-700 transition-all"
          >
            <MessageSquare className="h-5 w-5" />
            Instant Message
          </Button>
        </div>
        
        {hasNotifications && (
          <Button 
            onClick={onClearAll}
            variant="outline"
            className="w-full h-12 border-destructive/20 hover:bg-destructive/10 transition-all"
          >
            Clear All Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
