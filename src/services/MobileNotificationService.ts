
class MobileNotificationService {
  private static instance: MobileNotificationService;
  private isSupported = false;
  private permission: NotificationPermission = 'default';

  static getInstance(): MobileNotificationService {
    if (!MobileNotificationService.instance) {
      MobileNotificationService.instance = new MobileNotificationService();
    }
    return MobileNotificationService.instance;
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Mobile Notification Service...');
    
    // Check if notifications are supported
    this.isSupported = 'Notification' in window;
    
    if (!this.isSupported) {
      console.log('❌ Notifications not supported on this device');
      return;
    }

    // Check current permission
    this.permission = Notification.permission;
    console.log('📱 Current permission:', this.permission);

    // Request permission if needed
    if (this.permission === 'default') {
      await this.requestPermission();
    }

    // Register service worker for background notifications
    await this.registerServiceWorker();
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.log('❌ Notifications not supported');
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      console.log('📱 Permission result:', this.permission);
      
      if (this.permission === 'granted') {
        console.log('✅ Notification permission granted');
        return true;
      } else {
        console.log('❌ Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return false;
    }
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Service Worker registered:', registration);
      } catch (error) {
        console.log('⚠️ Service Worker registration failed:', error);
      }
    }
  }

  async sendMobileNotification(
    title: string, 
    body: string, 
    type: 'call' | 'video' | 'message',
    options: NotificationOptions = {}
  ): Promise<boolean> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.log('❌ Cannot send notification - permission not granted');
      return false;
    }

    try {
      const iconMap = {
        call: '📞',
        video: '📹',
        message: '💬'
      };

      const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
        body,
        icon: '/icons/notification.png',
        badge: '/icons/badge.png',
        tag: `${type}-${Date.now()}`,
        requireInteraction: type === 'call' || type === 'video',
        vibrate: type === 'call' ? [200, 100, 200, 100, 200] : [100, 50, 100],
        data: {
          type,
          timestamp: Date.now(),
          deepLink: `/buzzcall/${type}/demo`
        },
        ...options
      };

      const notification = new Notification(`${iconMap[type]} ${title}`, notificationOptions);

      notification.onclick = () => {
        console.log('📱 Mobile notification clicked');
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds for non-call notifications
      if (type !== 'call') {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      console.log('✅ Mobile notification sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Error sending mobile notification:', error);
      return false;
    }
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Check if device is mobile
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Get device info for debugging
  getDeviceInfo(): any {
    return {
      userAgent: navigator.userAgent,
      isMobile: this.isMobileDevice(),
      notificationSupported: this.isSupported,
      permission: this.permission,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      isAndroid: /Android/i.test(navigator.userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
    };
  }
}

export default MobileNotificationService.getInstance();
