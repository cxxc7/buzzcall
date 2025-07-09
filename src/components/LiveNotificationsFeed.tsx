
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { NotificationItem } from '@/components/NotificationItem';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'message' | 'video';
  timestamp: Date;
  read: boolean;
}

interface LiveNotificationsFeedProps {
  notifications: Notification[];
  badgeCount: number;
  onMarkAsRead: (id: string) => void;
}

export const LiveNotificationsFeed: React.FC<LiveNotificationsFeedProps> = ({ 
  notifications, 
  badgeCount, 
  onMarkAsRead 
}) => {
  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-primary" />
            Live Notification Feed
          </span>
          {badgeCount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground buzz-pulse">
              {badgeCount} New
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Real-time push notifications with enterprise-grade delivery and smart deep linking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
              <Bell className="h-10 w-10 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-sm">Use the control center above to test BuzzCall's notification engine</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
