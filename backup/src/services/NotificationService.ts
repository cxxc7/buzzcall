
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

  async sendCustomNotification(type: 'call' | 'video' | 'message', customMessage?: string): Promise<void> {
    const titles = {
      call: '📞 Incoming Call',
      video: '📹 Video Call',
      message: '💬 New Message'
    };

    const defaultMessages = {
      call: 'Someone is calling you',
      video: 'Video conference invitation',
      message: 'You have a new message'
    };

    const notification = {
      title: titles[type],
      body: customMessage || defaultMessages[type],
      icon: `/icons/${type}.png`,
      data: { 
        type, 
        userId: `user_${Date.now()}`, 
        deepLink: `/buzzcall/${type}/demo` 
      }
    };
    
    setTimeout(() => {
      this.notificationCallbacks.forEach(callback => callback(notification));
      
      if ('Notification' in window && Notification.permission === 'granted') {
        const options: NotificationOptions = {
          body: notification.body,
          icon: notification.icon,
          badge: '/icons/badge.png',
          data: notification.data,
          requireInteraction: type === 'call' || type === 'video',
        };

        const browserNotification = new Notification(notification.title, options);

        browserNotification.onclick = () => {
          this.tapCallbacks.forEach(callback => callback(notification));
          browserNotification.close();
        };
      }
    }, 1000);
  }

  async sendTestNotification(type: 'call' | 'video' | 'message'): Promise<void> {
    return this.sendCustomNotification(type);
  }

  // Simulate backend API call
  async triggerFromBackend(type: string, customMessage?: string): Promise<void> {
    console.log('Triggering notification from backend:', { type, customMessage });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.sendCustomNotification(type as any, customMessage);
        resolve();
      }, 500);
    });
  }

  getFCMToken(): string | null {
    return this.fcmToken;
  }
}

export default NotificationService.getInstance();
