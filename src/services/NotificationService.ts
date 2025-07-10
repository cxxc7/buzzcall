
// Firebase Cloud Messaging Service for WhatsApp-style notifications
class NotificationService {
  private static instance: NotificationService;
  private fcmToken: string | null = null;
  private notificationCallbacks: ((notification: any) => void)[] = [];
  private tapCallbacks: ((notification: any) => void)[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    console.log('Initializing notification service...');
    
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    }

    // Simulate FCM token generation
    this.fcmToken = 'mock_fcm_token_' + Date.now();
    console.log('FCM Token:', this.fcmToken);

    // Listen for messages when app is in foreground
    this.setupForegroundListener();
    
    // Setup service worker for background notifications
    this.setupBackgroundListener();
  }

  private setupForegroundListener(): void {
    // This would typically integrate with Firebase
    console.log('Setting up foreground notification listener');
  }

  private setupBackgroundListener(): void {
    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  onNotificationReceived(callback: (notification: any) => void): void {
    this.notificationCallbacks.push(callback);
  }

  onNotificationTap(callback: (notification: any) => void): void {
    this.tapCallbacks.push(callback);
  }

  async sendTestNotification(type: 'call' | 'video' | 'message'): Promise<void> {
    const notifications = {
      call: {
        title: '📞 Incoming Call',
        body: 'John Doe is calling you...',
        icon: '/icons/call.png',
        data: { type: 'call', userId: 'john_doe', deepLink: '/call/john_doe' }
      },
      video: {
        title: '📹 Video Call',
        body: 'Sarah wants to video chat',
        icon: '/icons/video.png',
        data: { type: 'video', userId: 'sarah', deepLink: '/video/sarah' }
      },
      message: {
        title: '💬 New Message',
        body: 'Hey! How are you doing?',
        icon: '/icons/message.png',
        data: { type: 'message', chatId: 'chat_123', deepLink: '/chat/chat_123' }
      }
    };

    const notification = notifications[type];
    
    // Simulate receiving notification
    setTimeout(() => {
      this.notificationCallbacks.forEach(callback => callback(notification));
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        const options: NotificationOptions = {
          body: notification.body,
          icon: notification.icon,
          badge: '/icons/badge.png',
          data: notification.data,
          requireInteraction: type === 'call' || type === 'video', // Keep call notifications visible
        };

        // Create notification without actions (they cause errors in regular browser notifications)
        const browserNotification = new Notification(notification.title, options);

        browserNotification.onclick = () => {
          this.tapCallbacks.forEach(callback => callback(notification));
          browserNotification.close();
        };
      }
    }, 1000); // Simulate network delay
  }

  // Simulate backend API call
  async triggerFromBackend(type: string, data: any): Promise<void> {
    // This would typically make an HTTP request to your backend
    console.log('Triggering notification from backend:', { type, data });
    
    // Simulate backend response
    return new Promise((resolve) => {
      setTimeout(() => {
        this.sendTestNotification(type as any);
        resolve();
      }, 500);
    });
  }

  getFCMToken(): string | null {
    return this.fcmToken;
  }
}

export default NotificationService.getInstance();
