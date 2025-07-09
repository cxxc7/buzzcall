
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Phone, Video, MessageSquare, Settings, Send } from "lucide-react";
import { toast } from "sonner";
import NotificationService from '@/services/NotificationService';
import { NotificationItem } from '@/components/NotificationItem';
import { CallSimulator } from '@/components/CallSimulator';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'message' | 'video';
  timestamp: Date;
  read: boolean;
}

const Index = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize notification service
    const initNotifications = async () => {
      try {
        await NotificationService.initialize();
        setIsConnected(true);
        
        // Listen for notifications
        NotificationService.onNotificationReceived((notification) => {
          const newNotification: Notification = {
            id: Date.now().toString(),
            title: notification.title || 'New Notification',
            body: notification.body || '',
            type: notification.data?.type || 'message',
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setBadgeCount(prev => prev + 1);
        });

        // Handle notification tap (deep linking)
        NotificationService.onNotificationTap((notification) => {
          console.log('Notification tapped:', notification);
          toast.success(`Opened from notification: ${notification.title}`);
        });

      } catch (error) {
        console.error('Failed to initialize notifications:', error);
        toast.error('Failed to initialize notifications');
      }
    };

    initNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setBadgeCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setBadgeCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WhatsApp-Style Notifications</h1>
              <p className="text-gray-600">Real-time push notifications with native Android support</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-sm">
              {isConnected ? "Connected to FCM" : "Disconnected"}
            </Badge>
            {badgeCount > 0 && (
              <Badge variant="secondary" className="bg-red-500 text-white">
                {badgeCount} unread
              </Badge>
            )}
          </div>
        </div>

        {/* Call Simulator */}
        <CallSimulator />

        {/* Notification Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Controls
            </CardTitle>
            <CardDescription>
              Test different types of notifications and deep linking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => NotificationService.sendTestNotification('call')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Phone className="h-4 w-4" />
                Simulate Call
              </Button>
              
              <Button 
                onClick={() => NotificationService.sendTestNotification('video')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Video className="h-4 w-4" />
                Simulate Video Call
              </Button>
              
              <Button 
                onClick={() => NotificationService.sendTestNotification('message')}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <MessageSquare className="h-4 w-4" />
                Simulate Message
              </Button>
            </div>
            
            {notifications.length > 0 && (
              <Button 
                onClick={clearAllNotifications}
                variant="outline"
                className="w-full"
              >
                Clear All Notifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Notifications</span>
              {badgeCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {badgeCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Notifications received in real-time with deep linking support
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet. Try sending a test notification!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Firebase Info */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration</CardTitle>
            <CardDescription>
              FCM token and connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {isConnected ? "Connected" : "Disconnected"}</p>
              <p><strong>Platform:</strong> Web (Capacitor-ready for native)</p>
              <p><strong>Features:</strong> Background notifications, Deep linking, Badge counts</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Index;
