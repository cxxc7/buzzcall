
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Native notification service that works with the Android Java module
 * Handles FCM tokens, background notifications, and native features
 */
export class NativeNotificationService {
  private static instance: NativeNotificationService;
  
  static getInstance(): NativeNotificationService {
    if (!NativeNotificationService.instance) {
      NativeNotificationService.instance = new NativeNotificationService();
    }
    return NativeNotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await this.initializeNative();
    } else {
      console.log('Running in web mode - native features limited');
    }
  }

  private async initializeNative(): Promise<void> {
    // Request permissions
    const permissionStatus = await PushNotifications.requestPermissions();
    
    if (permissionStatus.receive === 'granted') {
      // Register with FCM
      await PushNotifications.register();
      
      // Listen for registration
      PushNotifications.addListener('registration', (token) => {
        console.log('FCM Token:', token.value);
        // Send token to your backend
        this.sendTokenToBackend(token.value);
      });

      // Listen for incoming notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        this.handleForegroundNotification(notification);
      });

      // Listen for notification actions
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Push notification action performed:', action);
        this.handleNotificationAction(action);
      });
    }
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    try {
      // Send FCM token to your backend
      const response = await fetch('/api/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform: Capacitor.getPlatform(),
          userId: 'current_user_id' // Replace with actual user ID
        })
      });
      
      if (response.ok) {
        console.log('Token registered successfully');
      }
    } catch (error) {
      console.error('Failed to register token:', error);
    }
  }

  private handleForegroundNotification(notification: any): void {
    // Handle notification when app is in foreground
    if (notification.data?.type === 'call') {
      this.showNativeCallNotification(notification);
    } else {
      this.showNativeMessageNotification(notification);
    }
  }

  private handleNotificationAction(action: any): void {
    const { actionId, notification } = action;
    
    switch (actionId) {
      case 'answer':
        console.log('Call answered');
        // Navigate to call screen
        window.location.href = `/call/${notification.data?.userId}`;
        break;
        
      case 'decline':
        console.log('Call declined');
        // Handle call decline
        break;
        
      default:
        // Default tap action - handle deep linking
        if (notification.data?.deepLink) {
          window.location.href = notification.data.deepLink;
        }
    }
  }

  async showNativeCallNotification(data: any): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const NotificationHelper = Capacitor.Plugins.NotificationHelper;
      
      await NotificationHelper.showCallNotification({
        title: data.title || 'Incoming Call',
        body: data.body || 'Someone is calling you',
        callerName: data.data?.callerName || 'Unknown',
        callType: data.data?.callType || 'voice'
      });
    }
  }

  async showNativeMessageNotification(data: any): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const NotificationHelper = Capacitor.Plugins.NotificationHelper;
      
      await NotificationHelper.showMessageNotification({
        title: data.title || 'New Message',
        body: data.body || 'You have a new message',
        sender: data.data?.sender || 'Unknown',
        deepLink: data.data?.deepLink || '/'
      });
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const NotificationHelper = Capacitor.Plugins.NotificationHelper;
      await NotificationHelper.setBadgeCount({ count });
    }
  }

  async clearAllNotifications(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const NotificationHelper = Capacitor.Plugins.NotificationHelper;
      await NotificationHelper.clearAllNotifications();
    }
  }
}

export default NativeNotificationService.getInstance();
