
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NotificationService from '@/services/NotificationService';
import { HeroHeader } from '@/components/HeroHeader';
import { QuickStats } from '@/components/QuickStats';
import { CallSimulator } from '@/components/CallSimulator';
import { NotificationControls } from '@/components/NotificationControls';
import { LiveNotificationsFeed } from '@/components/LiveNotificationsFeed';
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
        
        <HeroHeader isConnected={isConnected} badgeCount={badgeCount} />
        
        <QuickStats notificationCount={notifications.length} />

        <CallSimulator />

        <NotificationControls 
          hasNotifications={notifications.length > 0} 
          onClearAll={clearAllNotifications} 
        />

        <LiveNotificationsFeed 
          notifications={notifications}
          badgeCount={badgeCount}
          onMarkAsRead={markAsRead}
        />

        <TechnicalSpecs isConnected={isConnected} />

      </div>
    </div>
  );
};

export default Index;
