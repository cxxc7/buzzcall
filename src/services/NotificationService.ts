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

  private getRandomMessages() {
    return {
      call: [
        "Incoming call from Alex Johnson",
        "Sarah wants to talk - urgent", 
        "Conference call starting now",
        "Your manager is calling",
        "Client meeting reminder call"
      ],
      video: [
        "Video meeting with the team",
        "Sarah wants to video chat",
        "Join the product demo now",
        "Weekly standup is starting",
        "Client presentation ready"
      ],
      message: [
        "Can we reschedule our meeting?",
        "Great work on the project!",
        "The files you requested are ready",
        "Don't forget about tomorrow's deadline",
        "New task assigned to you",
        "Meeting moved to 3 PM",
        "Your report has been approved",
        "Urgent: Please review the proposal"
      ]
    };
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
    const messages = this.getRandomMessages();
    const randomMessage = messages[type][Math.floor(Math.random() * messages[type].length)];
    
    const notifications = {
      call: {
        title: '📞 Incoming Call',
        body: randomMessage,
        icon: '/icons/call.png',
        data: { type: 'call', userId: 'caller_' + Date.now(), deepLink: '/buzzcall/voice-call/simulation' }
      },
      video: {
        title: '📹 Video Call',
        body: randomMessage,
        icon: '/icons/video.png',
        data: { type: 'video', userId: 'video_' + Date.now(), deepLink: '/buzzcall/video-conference/simulation' }
      },
      message: {
        title: '💬 New Message',
        body: randomMessage,
        icon: '/icons/message.png',
        data: { type: 'message', chatId: 'chat_' + Date.now(), deepLink: '/buzzcall/messages/simulation' }
      }
    };

    const notification = notifications[type];
    
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
