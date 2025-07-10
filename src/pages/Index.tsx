import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NotificationService from '@/services/NotificationService';
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

  useEffect(() => {
    // Initialize all BuzzCall services
    const initBuzzCall = async () => {
      try {
        // Initialize core notification service
        await NotificationService.initialize();
        setIsConnected(true);
        
        // Initialize end-to-end encryption
        await EncryptionService.initialize();
        setIsEncryptionReady(true);
        
        // Try to initialize WebSocket (non-blocking)
        try {
          await WebSocketService.connect();
          setIsWebSocketConnected(true);
        } catch (error) {
          console.log('📡 WebSocket unavailable - using fallback mode');
          setIsWebSocketConnected(false);
        }
        
        // Listen for WebSocket connection changes
        WebSocketService.onConnectionChange((connected) => {
          setIsWebSocketConnected(connected);
          if (connected) {
            toast.success('🔗 Real-time connection established');
          }
        });
        
        // Load stored notifications
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
        
        // Listen for real-time notifications
        NotificationService.onNotificationReceived(async (notification) => {
          const newNotification: Notification = {
            id: Date.now().toString(),
            title: notification.title || 'BuzzCall Alert',
            body: notification.body || '',
            type: notification.data?.type || 'message',
            timestamp: new Date(),
            read: false
          };
          
          // Store notification with encryption if needed
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
          
          // Send real-time update via WebSocket if connected
          if (WebSocketService.isConnected()) {
            WebSocketService.send({
              type: 'notification_received',
              data: newNotification
            });
          }
        });

        // Handle smart deep linking
        NotificationService.onNotificationTap((notification) => {
          console.log('🎯 BuzzCall deep link activated:', notification);
          toast.success(`Smart Navigation: ${notification.title}`);
        });

        // Subscribe to WebSocket events
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

    // Cleanup on unmount
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
    
    // Update storage
    NotificationStorageService.markAsRead(id);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setBadgeCount(0);
    NotificationStorageService.clearHistory();
    toast.success('All notifications cleared');
  };

  return (
    <div className="min-h-screen buzz-gradient">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
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

        <AnalyticsDashboard />

        <TechnicalSpecs 
          isConnected={isConnected}
          isWebSocketConnected={isWebSocketConnected}
          isEncryptionReady={isEncryptionReady}
        />

      </div>
    </div>
  );
};

export default Index;
