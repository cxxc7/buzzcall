
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NotificationService from '@/services/NotificationService';
import MobileNotificationService from '@/services/MobileNotificationService';
import WebSocketService from '@/services/WebSocketService';
import EncryptionService from '@/services/EncryptionService';
import NotificationStorageService from '@/services/NotificationStorageService';
import { HeroHeader } from '@/components/HeroHeader';
import { QuickStats } from '@/components/QuickStats';
import { CallSimulator } from '@/components/CallSimulator';
import { NotificationControls } from '@/components/NotificationControls';
import { LiveNotificationsFeed } from '@/components/LiveNotificationsFeed';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { TechnicalSpecs } from '@/components/TechnicalSpecs';
import { WebSocketControl } from '@/components/WebSocketControl';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { MobileInstructions } from '@/components/MobileInstructions';
import { UserGuide } from '@/components/UserGuide';

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
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isEncryptionReady, setIsEncryptionReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const initBuzzCall = async () => {
      try {
        // Check if mobile device
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(mobile);

        // Initialize services
        await NotificationService.initialize();
        setIsConnected(true);
        
        await EncryptionService.initialize();
        setIsEncryptionReady(true);
        
        // Initialize mobile notifications if on mobile
        if (mobile) {
          await MobileNotificationService.initialize();
        }
        
        try {
          await WebSocketService.connect();
          setIsWebSocketConnected(true);
        } catch (error) {
          console.log('📡 WebSocket unavailable - using fallback mode');
          setIsWebSocketConnected(false);
        }
        
        WebSocketService.onConnectionChange((connected) => {
          setIsWebSocketConnected(connected);
          if (connected) {
            toast.success('🔗 Real-time connection established');
          }
        });
        
        const storedNotifications = NotificationStorageService.getAllNotifications();
        const formattedNotifications = storedNotifications.map(stored => ({
          id: stored.id,
          title: stored.title,
          body: stored.body,
          type: stored.type,
          timestamp: stored.timestamp,
          read: stored.read
        }));
        setNotifications(formattedNotifications);
        setBadgeCount(storedNotifications.filter(n => !n.read).length);
        
        NotificationService.onNotificationReceived(async (notification) => {
          const newNotification: Notification = {
            id: Date.now().toString(),
            title: notification.title || 'BuzzCall Alert',
            body: notification.body || '',
            type: notification.data?.type || 'message',
            timestamp: new Date(),
            read: false
          };
          
          // Send mobile notification if on mobile device
          if (mobile) {
            await MobileNotificationService.sendMobileNotification(
              newNotification.title,
              newNotification.body,
              newNotification.type
            );
          }
          
          await NotificationStorageService.storeNotification({
            title: newNotification.title,
            body: newNotification.body,
            type: newNotification.type,
            read: false,
            encrypted: true,
            deviceId: 'web-demo',
            targetUserId: 'demo_user_123'
          });
          
          setNotifications(prev => [newNotification, ...prev]);
          setBadgeCount(prev => prev + 1);
          
          if (WebSocketService.isConnected()) {
            WebSocketService.send({
              type: 'notification_received',
              data: newNotification
            });
          }
        });

        NotificationService.onNotificationTap((notification) => {
          console.log('🎯 BuzzCall deep link activated:', notification);
          toast.success(`Smart Navigation: ${notification.title}`);
        });

        WebSocketService.subscribe('notification_update', (data) => {
          console.log('📨 Real-time notification update:', data);
          toast.info('Real-time sync active');
        });

        toast.success('🚀 BuzzCall Enterprise Engine Activated');

      } catch (error) {
        console.error('❌ BuzzCall engine initialization failed:', error);
        toast.error('BuzzCall initialized with limited features');
      }
    };

    initBuzzCall();

    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setBadgeCount(prev => Math.max(0, prev - 1));
    NotificationStorageService.markAsRead(id);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setBadgeCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setBadgeCount(0);
    NotificationStorageService.clearHistory();
    toast.success('All notifications cleared');
  };

  const content = (
    <>
      <HeroHeader 
        isConnected={isConnected} 
        badgeCount={badgeCount}
        isWebSocketConnected={isWebSocketConnected}
        isEncryptionReady={isEncryptionReady}
      />
      
      <QuickStats 
        notificationCount={notifications.length}
        isWebSocketConnected={isWebSocketConnected}
        isEncryptionReady={isEncryptionReady}
      />

      {isMobile && <MobileInstructions />}

      <UserGuide />

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        <CallSimulator />
        <WebSocketControl 
          isConnected={isWebSocketConnected}
          onConnectionChange={setIsWebSocketConnected}
        />
      </div>

      <NotificationControls 
        hasNotifications={notifications.length > 0} 
        onClearAll={clearAllNotifications} 
      />

      <LiveNotificationsFeed 
        notifications={notifications}
        badgeCount={badgeCount}
        onMarkAsRead={markAsRead}
        onDeleteNotification={deleteNotification}
        onClearAll={clearAllNotifications}
      />

      <AnalyticsDashboard 
        notifications={notifications}
      />

      <TechnicalSpecs 
        isConnected={isConnected}
        isWebSocketConnected={isWebSocketConnected}
        isEncryptionReady={isEncryptionReady}
      />
    </>
  );

  if (isMobile) {
    return (
      <MobileOptimizedLayout isWebSocketConnected={isWebSocketConnected}>
        {content}
      </MobileOptimizedLayout>
    );
  }

  return (
    <div className="min-h-screen buzz-gradient">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        {content}
      </div>
    </div>
  );
};

export default Index;
