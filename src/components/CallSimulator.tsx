
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Video, Send, Server } from "lucide-react";
import { toast } from "sonner";

export const CallSimulator: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState('http://localhost:3001');
  const [recipientId, setRecipientId] = useState('user123');
  const [notificationType, setNotificationType] = useState('call');
  const [customMessage, setCustomMessage] = useState('');

  // Simulate backend API for triggering notifications
  const simulateBackendTrigger = async () => {
    try {
      const payload = {
        recipientId,
        type: notificationType,
        title: notificationType === 'call' ? '📞 Incoming Call' : 
               notificationType === 'video' ? '📹 Video Call' : '💬 New Message',
        body: customMessage || (
          notificationType === 'call' ? 'Someone is calling you...' :
          notificationType === 'video' ? 'Someone wants to video chat' :
          'You have a new message'
        ),
        data: {
          type: notificationType,
          userId: recipientId,
          deepLink: `/${notificationType}/${recipientId}`,
          timestamp: new Date().toISOString()
        }
      };

      console.log('Simulating backend API call:', payload);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate FCM trigger (this would normally be done by your backend)
      const options: NotificationOptions = {
        body: payload.body,
        icon: `/icons/${notificationType}.png`,
        badge: '/icons/badge.png',
        data: payload.data,
        requireInteraction: notificationType === 'call' || notificationType === 'video',
      };

      // Add actions only if supported (this is not standard in all browsers)
      if (notificationType === 'call' && 'ServiceWorkerRegistration' in window) {
        (options as any).actions = [
          { action: 'answer', title: 'Answer' },
          { action: 'decline', title: 'Decline' }
        ];
      }

      const notification = new Notification(payload.title, options);

      notification.onclick = () => {
        toast.success(`Deep link activated: ${payload.data.deepLink}`);
        notification.close();
      };

      toast.success('Backend notification triggered successfully!');
      
    } catch (error) {
      console.error('Backend simulation error:', error);
      toast.error('Failed to trigger backend notification');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Backend Notification Simulator
        </CardTitle>
        <CardDescription>
          Simulate triggering notifications from a backend API (like your Node.js server)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backend-url">Backend URL</Label>
            <Input
              id="backend-url"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="http://localhost:3001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient ID</Label>
            <Input
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="user123"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notification-type">Notification Type</Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Voice Call
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Call
                  </div>
                </SelectItem>
                <SelectItem value="message">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Message
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Input
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Custom notification message..."
            />
          </div>
        </div>

        <Button 
          onClick={simulateBackendTrigger}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          <Server className="h-4 w-4 mr-2" />
          Trigger from "Backend" API
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Note:</strong> This simulates how your backend would trigger FCM notifications.</p>
          <p><strong>Real implementation:</strong> Your Node.js server would call FCM API with the device token.</p>
          <p><strong>Native Android:</strong> The native module would handle these notifications even when app is killed.</p>
        </div>
      </CardContent>
    </Card>
  );
};
