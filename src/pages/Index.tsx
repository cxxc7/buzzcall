
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Phone, Video, MessageSquare, Settings, Zap, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";
import NotificationService from '@/services/NotificationService';
import { NotificationItem } from '@/components/NotificationItem';
import { CallSimulator } from '@/components/CallSimulator';
import { TechnicalSpecs } from '@/components/TechnicalSpecs';

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
    // Initialize BuzzCall notification engine
    const initNotifications = async () => {
      try {
        await NotificationService.initialize();
        setIsConnected(true);
        
        // Listen for real-time notifications
        NotificationService.onNotificationReceived((notification) => {
          const newNotification: Notification = {
            id: Date.now().toString(),
            title: notification.title || 'BuzzCall Alert',
            body: notification.body || '',
            type: notification.data?.type || 'message',
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setBadgeCount(prev => prev + 1);
        });

        // Handle smart deep linking
        NotificationService.onNotificationTap((notification) => {
          console.log('BuzzCall deep link activated:', notification);
          toast.success(`Smart Navigation: ${notification.title}`);
        });

      } catch (error) {
        console.error('BuzzCall engine initialization failed:', error);
        toast.error('Failed to initialize BuzzCall engine');
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
    toast.success('All notifications cleared');
  };

  return (
    <div className="min-h-screen buzz-gradient">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Hero Header */}
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

        {/* Quick Stats */}
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
              <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
              <div className="text-xs text-muted-foreground">Total Processed</div>
            </CardContent>
          </Card>
        </div>

        {/* Call Simulator */}
        <CallSimulator />

        {/* Notification Controls */}
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
            
            {notifications.length > 0 && (
              <Button 
                onClick={clearAllNotifications}
                variant="outline"
                className="w-full h-12 border-destructive/20 hover:bg-destructive/10 transition-all"
              >
                Clear All Notifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Live Notifications Feed */}
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
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <TechnicalSpecs isConnected={isConnected} />

      </div>
    </div>
  );
};

export default Index;
