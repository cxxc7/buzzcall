
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Filter, Trash2, SortAsc, SortDesc, Clock, MessageSquare, Phone, Video } from "lucide-react";
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
  onDeleteNotification?: (id: string) => void;
  onClearAll?: () => void;
}

export const LiveNotificationsFeed: React.FC<LiveNotificationsFeedProps> = ({ 
  notifications, 
  badgeCount, 
  onMarkAsRead,
  onDeleteNotification,
  onClearAll
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'type'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'call' | 'message' | 'video' | 'unread'>('all');

  const filteredAndSortedNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply filters
    if (filterType === 'unread') {
      filtered = notifications.filter(n => !n.read);
    } else if (filterType !== 'all') {
      filtered = notifications.filter(n => n.type === filterType);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  }, [notifications, sortBy, filterType]);

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
        {notifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort:</span>
              <Button
                size="sm"
                variant={sortBy === 'newest' ? 'default' : 'outline'}
                onClick={() => setSortBy('newest')}
                className="h-8"
              >
                <SortDesc className="h-3 w-3 mr-1" />
                Newest
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'oldest' ? 'default' : 'outline'}
                onClick={() => setSortBy('oldest')}
                className="h-8"
              >
                <SortAsc className="h-3 w-3 mr-1" />
                Oldest
              </Button>
              <Button
                size="sm"
                variant={sortBy === 'type' ? 'default' : 'outline'}
                onClick={() => setSortBy('type')}
                className="h-8"
              >
                <Filter className="h-3 w-3 mr-1" />
                Type
              </Button>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm font-medium">Filter:</span>
              <Button
                size="sm"
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                className="h-8"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterType === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilterType('unread')}
                className="h-8"
              >
                <Badge className="w-2 h-2 p-0 mr-1" />
                Unread
              </Button>
              <Button
                size="sm"
                variant={filterType === 'call' ? 'default' : 'outline'}
                onClick={() => setFilterType('call')}
                className="h-8"
              >
                <Phone className="h-3 w-3 mr-1" />
                Calls
              </Button>
              <Button
                size="sm"
                variant={filterType === 'video' ? 'default' : 'outline'}
                onClick={() => setFilterType('video')}
                className="h-8"
              >
                <Video className="h-3 w-3 mr-1" />
                Video
              </Button>
              <Button
                size="sm"
                variant={filterType === 'message' ? 'default' : 'outline'}
                onClick={() => setFilterType('message')}
                className="h-8"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Messages
              </Button>
            </div>

            {notifications.length > 0 && onClearAll && (
              <Button
                size="sm"
                variant="destructive"
                onClick={onClearAll}
                className="h-8 ml-auto"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        )}

        {filteredAndSortedNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/20 flex items-center justify-center">
              <Bell className="h-10 w-10 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {notifications.length === 0 ? "No notifications yet" : "No notifications match your filters"}
            </h3>
            <p className="text-sm">
              {notifications.length === 0 
                ? "Use the control center above to test BuzzCall's notification engine"
                : "Try adjusting your filters to see more notifications"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDeleteNotification}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
