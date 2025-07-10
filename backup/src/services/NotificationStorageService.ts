interface StoredNotification {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'message' | 'video';
  timestamp: Date;
  read: boolean;
  encrypted: boolean;
  deviceId: string;
  targetUserId?: string;
}

class NotificationStorageService {
  private static instance: NotificationStorageService;
  private storageKey = 'buzzcall_notifications';
  private maxStorageSize = 1000; // Maximum notifications to store

  static getInstance(): NotificationStorageService {
    if (!NotificationStorageService.instance) {
      NotificationStorageService.instance = new NotificationStorageService();
    }
    return NotificationStorageService.instance;
  }

  async storeNotification(notification: Omit<StoredNotification, 'id' | 'timestamp'>): Promise<string> {
    const stored: StoredNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    const existing = this.getAllNotifications();
    const updated = [stored, ...existing];

    // Keep only the most recent notifications
    if (updated.length > this.maxStorageSize) {
      updated.splice(this.maxStorageSize);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(updated));
    console.log('💾 Notification stored:', stored.id);
    
    return stored.id;
  }

  getAllNotifications(): StoredNotification[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const notifications = JSON.parse(stored);
      return notifications.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    } catch (error) {
      console.error('❌ Failed to retrieve notifications:', error);
      return [];
    }
  }

  getNotificationsByType(type: string): StoredNotification[] {
    return this.getAllNotifications().filter(n => n.type === type);
  }

  getUnreadNotifications(): StoredNotification[] {
    return this.getAllNotifications().filter(n => !n.read);
  }

  markAsRead(id: string): boolean {
    const notifications = this.getAllNotifications();
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
      return true;
    }
    
    return false;
  }

  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ Notification history cleared');
  }

  getAnalytics() {
    const notifications = this.getAllNotifications();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      today: notifications.filter(n => n.timestamp >= today).length,
      thisWeek: notifications.filter(n => n.timestamp >= week).length,
      byType: {
        call: notifications.filter(n => n.type === 'call').length,
        video: notifications.filter(n => n.type === 'video').length,
        message: notifications.filter(n => n.type === 'message').length,
      }
    };
  }
}

export default NotificationStorageService.getInstance();
