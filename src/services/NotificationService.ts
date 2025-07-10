import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/RootNavigation';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'video' | 'message';
  timestamp: Date;
  read: boolean;
  data?: any;
}

class NotificationService {
  private static instance: NotificationService;
  private fcmToken: string | null = null;
  private isInitialized = false;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure push notifications
      PushNotification.configure({
        onRegister: (token) => {
          console.log('Push notification token:', token);
        },
        onNotification: (notification) => {
          console.log('Local notification received:', notification);
          if (notification.userInteraction) {
            this.handleNotificationTap(notification);
          }
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },
        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });

      // Create notification channels for Android
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'calls',
            channelName: 'Voice & Video Calls',
            channelDescription: 'Incoming voice and video calls',
            importance: Importance.HIGH,
            vibrate: true,
          },
          (created) => console.log(`Channel 'calls' created: ${created}`)
        );

        PushNotification.createChannel(
          {
            channelId: 'messages',
            channelName: 'Messages',
            channelDescription: 'New messages and chats',
            importance: Importance.DEFAULT,
            vibrate: true,
          },
          (created) => console.log(`Channel 'messages' created: ${created}`)
        );
      }

      // Get FCM token
      this.fcmToken = await messaging().getToken();
      console.log('FCM Token:', this.fcmToken);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize NotificationService:', error);
      throw error;
    }
  }

  handleForegroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    console.log('Handling foreground message:', remoteMessage);
    
    const { notification, data } = remoteMessage;
    if (!notification) return;

    const notificationData: NotificationData = {
      id: Date.now().toString(),
      title: notification.title || 'BuzzCall',
      body: notification.body || '',
      type: (data?.type as any) || 'message',
      timestamp: new Date(),
      read: false,
      data: data,
    };

    // Store notification
    this.storeNotification(notificationData);

    // Show local notification for foreground messages
    if (data?.type === 'call' || data?.type === 'video') {
      this.showCallNotification(notificationData);
    } else {
      this.showMessageNotification(notificationData);
    }
  }

  handleNotificationTap(notification: any): void {
    console.log('Notification tapped:', notification);
    
    const data = notification.data || {};
    const type = data.type || 'message';

    switch (type) {
      case 'call':
      case 'video':
        navigate('Call', { type, id: data.id || Date.now().toString() });
        break;
      case 'message':
        navigate('History');
        break;
      default:
        navigate('Home');
    }
  }

  private showCallNotification(notificationData: NotificationData): void {
    PushNotification.localNotification({
      channelId: 'calls',
      title: notificationData.title,
      message: notificationData.body,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      priority: 'high',
      importance: 'high',
      autoCancel: false,
      ongoing: true,
      actions: ['Answer', 'Decline'],
      userInfo: notificationData.data,
    });
  }

  private showMessageNotification(notificationData: NotificationData): void {
    PushNotification.localNotification({
      channelId: 'messages',
      title: notificationData.title,
      message: notificationData.body,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      userInfo: notificationData.data,
    });
  }

  async storeNotification(notification: NotificationData): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      const notifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      notifications.unshift(notification);
      
      // Keep only last 100 notifications
      if (notifications.length > 100) {
        notifications.splice(100);
      }
      
      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  async getStoredNotifications(): Promise<NotificationData[]> {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      const notifications = stored ? JSON.parse(stored) : [];
      return notifications.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    } catch (error) {
      console.error('Failed to get stored notifications:', error);
      return [];
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      const notifications: NotificationData[] = stored ? JSON.parse(stored) : [];
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem('notifications');
      PushNotification.cancelAllLocalNotifications();
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  // Simulate backend notification for testing
  async sendTestNotification(type: 'call' | 'video' | 'message', customMessage?: string): Promise<void> {
    const titles = {
      call: '📞 Incoming Call',
      video: '📹 Video Call', 
      message: '💬 New Message'
    };

    const defaultMessages = {
      call: 'John Doe is calling you',
      video: 'Team meeting starting now',
      message: 'You have a new message'
    };

    const mockRemoteMessage: FirebaseMessagingTypes.RemoteMessage = {
      messageId: Date.now().toString(),
      notification: {
        title: titles[type],
        body: customMessage || defaultMessages[type],
      },
      data: {
        type,
        id: Date.now().toString(),
        sender: 'demo_sender',
      },
    };

    // Simulate delay like real FCM
    setTimeout(() => {
      this.handleForegroundMessage(mockRemoteMessage);
    }, 1000);
  }

  getFCMToken(): string | null {
    return this.fcmToken;
  }

  async getBadgeCount(): Promise<number> {
    const notifications = await this.getStoredNotifications();
    return notifications.filter(n => !n.read).length;
  }
}

export default NotificationService.getInstance();