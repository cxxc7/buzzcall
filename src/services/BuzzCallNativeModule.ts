import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { BuzzCallNotification } = NativeModules;

interface CallNotificationParams {
  title?: string;
  body?: string;
  callerName?: string;
  callType?: 'voice' | 'video';
  callId?: string;
}

interface MessageNotificationParams {
  title?: string;
  body?: string;
  sender?: string;
  messageId?: string;
  deepLink?: string;
}

interface DeviceInfo {
  platform: string;
  apiLevel: number;
  manufacturer: string;
  model: string;
  version: string;
}

class BuzzCallNativeModule {
  private eventEmitter: NativeEventEmitter | null = null;

  constructor() {
    if (Platform.OS === 'android' && BuzzCallNotification) {
      this.eventEmitter = new NativeEventEmitter(BuzzCallNotification);
    }
  }

  /**
   * Show a full-screen call notification with answer/decline actions
   */
  async showCallNotification(params: CallNotificationParams): Promise<{ status: string; callId: string }> {
    if (Platform.OS !== 'android' || !BuzzCallNotification) {
      throw new Error('BuzzCall native module not available on this platform');
    }

    return BuzzCallNotification.showCallNotification({
      title: params.title || 'Incoming Call',
      body: params.body || 'Someone is calling you',
      callerName: params.callerName || 'Unknown Caller',
      callType: params.callType || 'voice',
      callId: params.callId || Date.now().toString(),
    });
  }

  /**
   * Show a message notification with deep linking
   */
  async showMessageNotification(params: MessageNotificationParams): Promise<{ status: string; messageId: string }> {
    if (Platform.OS !== 'android' || !BuzzCallNotification) {
      throw new Error('BuzzCall native module not available on this platform');
    }

    return BuzzCallNotification.showMessageNotification({
      title: params.title || 'New Message',
      body: params.body || 'You have a new message',
      sender: params.sender || 'Unknown',
      messageId: params.messageId || Date.now().toString(),
      deepLink: params.deepLink || 'buzzcall://history',
    });
  }

  /**
   * Set the app badge count
   */
  async setBadgeCount(count: number): Promise<{ success: boolean; count: number; note?: string }> {
    if (Platform.OS !== 'android' || !BuzzCallNotification) {
      return { success: false, count: 0, note: 'Not supported on this platform' };
    }

    return BuzzCallNotification.setBadgeCount(count);
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<{ status: string; message: string }> {
    if (Platform.OS !== 'android' || !BuzzCallNotification) {
      throw new Error('BuzzCall native module not available on this platform');
    }

    return BuzzCallNotification.clearAllNotifications();
  }

  /**
   * Get device information
   */
  async getDeviceInfo(): Promise<DeviceInfo> {
    if (Platform.OS !== 'android' || !BuzzCallNotification) {
      return {
        platform: Platform.OS,
        apiLevel: 0,
        manufacturer: 'Unknown',
        model: 'Unknown',
        version: Platform.Version?.toString() || 'Unknown',
      };
    }

    return BuzzCallNotification.getDeviceInfo();
  }

  /**
   * Listen to notification actions (answer, decline, etc.)
   */
  onNotificationAction(callback: (data: any) => void): () => void {
    if (!this.eventEmitter) {
      return () => {};
    }

    const subscription = this.eventEmitter.addListener('NotificationAction', callback);
    return () => subscription.remove();
  }

  /**
   * Check if the native module is available
   */
  isAvailable(): boolean {
    return Platform.OS === 'android' && !!BuzzCallNotification;
  }
}

export default new BuzzCallNativeModule();