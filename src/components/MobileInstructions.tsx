
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Bell, 
  Settings, 
  Chrome, 
  Wifi,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play
} from "lucide-react";
import MobileNotificationService from '@/services/MobileNotificationService';

export const MobileInstructions: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const info = MobileNotificationService.getDeviceInfo();
    setDeviceInfo(info);
    setPermission(MobileNotificationService.getPermissionStatus());
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await MobileNotificationService.requestPermission();
    setPermission(MobileNotificationService.getPermissionStatus());
    
    if (granted) {
      // Send a test notification
      await MobileNotificationService.sendMobileNotification(
        'BuzzCall Activated!',
        'You can now receive notifications on your mobile device',
        'message'
      );
    }
  };

  const handleTestNotification = async (type: 'call' | 'video' | 'message') => {
    const messages = {
      call: { title: '📞 Incoming Call', body: 'Someone is calling you' },
      video: { title: '📹 Video Conference', body: 'Join the video meeting' },
      message: { title: '💬 New Message', body: 'You have a new message' }
    };
    
    await MobileNotificationService.sendMobileNotification(
      messages[type].title,
      messages[type].body,
      type
    );
  };

  if (!deviceInfo) return null;

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Smartphone className="h-6 w-6 text-primary" />
          Mobile Setup Guide
        </CardTitle>
        <CardDescription>
          Complete setup for mobile notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Device Status */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm">Device Type</span>
            <Badge variant={deviceInfo.isMobile ? "default" : "secondary"}>
              {deviceInfo.isMobile ? 'Mobile Device' : 'Desktop'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              {deviceInfo.notificationSupported ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              <Badge variant={deviceInfo.notificationSupported ? "default" : "destructive"}>
                {deviceInfo.notificationSupported ? 'Supported' : 'Not Supported'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
            <span className="text-sm">Permission</span>
            <div className="flex items-center gap-2">
              {permission === 'granted' ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : permission === 'denied' ? (
                <XCircle className="h-4 w-4 text-red-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-400" />
              )}
              <Badge variant={permission === 'granted' ? "default" : "secondary"}>
                {permission === 'granted' ? 'Granted' : permission === 'denied' ? 'Denied' : 'Not Asked'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        {deviceInfo.isMobile && (
          <div className="space-y-4">
            <h4 className="font-semibold text-base">Mobile Setup Steps:</h4>
            
            {permission !== 'granted' && (
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-orange-400">Enable Notifications</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Allow notifications to receive call and message alerts
                </p>
                <Button onClick={handleEnableNotifications} className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </Button>
              </div>
            )}

            {permission === 'granted' && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="font-medium text-green-400">Ready to Use!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your device is ready to receive notifications
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={() => handleTestNotification('call')} variant="outline" className="justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Test Call Notification
                  </Button>
                  <Button onClick={() => handleTestNotification('video')} variant="outline" className="justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Test Video Notification
                  </Button>
                  <Button onClick={() => handleTestNotification('message')} variant="outline" className="justify-start">
                    <Play className="h-4 w-4 mr-2" />
                    Test Message Notification
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Browser Instructions */}
        {deviceInfo.isAndroid && (
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Chrome className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-blue-400">Chrome Android</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Open in Chrome browser</p>
              <p>• Allow notifications when prompted</p>
              <p>• Keep the tab open in background</p>
              <p>• Add to home screen for best experience</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
