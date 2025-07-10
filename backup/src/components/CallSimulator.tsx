
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Video, Send, Server, Zap } from "lucide-react";
import { toast } from "sonner";
import NotificationService from '@/services/NotificationService';

export const CallSimulator: React.FC = () => {
  const [backendUrl, setBackendUrl] = useState('https://api.buzzcall.enterprise/v1');
  const [recipientId, setRecipientId] = useState('user_enterprise_001');
  const [notificationType, setNotificationType] = useState('call');
  const [customMessage, setCustomMessage] = useState('');

  // Simulate enterprise backend API for triggering notifications
  const simulateBackendTrigger = async () => {
    try {
      const payload = {
        recipientId,
        type: notificationType,
        title: notificationType === 'call' ? '📞 Incoming Call' : 
               notificationType === 'video' ? '📹 Video Conference' : '💬 New Message',
        body: customMessage || (
          notificationType === 'call' ? 'Someone is calling you' :
          notificationType === 'video' ? 'Video conference invitation' :
          'You have a new message'
        ),
        data: {
          type: notificationType,
          userId: recipientId,
          deepLink: `/buzzcall/${notificationType}/${recipientId}`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          source: 'Enterprise API'
        }
      };

      console.log('🚀 Enterprise API Trigger:', payload);
      
      toast.info('Processing through API...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      await NotificationService.triggerFromBackend(notificationType, customMessage);
      
      toast.success('✅ Enterprise notification delivered successfully!');
      
    } catch (error) {
      console.error('❌ API Error:', error);
      toast.error('Failed to process through API');
    }
  };

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Server className="h-5 w-5 text-primary" />
          </div>
          Enterprise Backend Simulator
        </CardTitle>
        <CardDescription className="text-sm">
          Simulate real-world API triggers from enterprise backend systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backend-url" className="text-sm font-medium">API Endpoint</Label>
            <Input
              id="backend-url"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="https://api.buzzcall.enterprise/v1"
              className="bg-muted/20 border-border/50 text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">Target User ID</Label>
            <Input
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="user_enterprise_001"
              className="bg-muted/20 border-border/50 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notification-type" className="text-sm font-medium">Notification Type</Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger className="bg-muted/20 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="call">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-400" />
                    Voice Call
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-400" />
                    Video Conference
                  </div>
                </SelectItem>
                <SelectItem value="message">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-purple-400" />
                    Message
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-message" className="text-sm font-medium">Custom Message</Label>
            <Input
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter your custom notification message..."
              className="bg-muted/20 border-border/50 text-sm"
            />
          </div>
        </div>

        <Button 
          onClick={simulateBackendTrigger}
          className="w-full h-12 text-base font-semibold buzz-accent-gradient hover:opacity-90 transition-all"
        >
          <Zap className="h-4 w-4 mr-2" />
          Trigger Enterprise API
        </Button>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong className="text-primary">Production Ready:</strong> Enterprise backend FCM integration</p>
            <p><strong className="text-primary">Deep Links:</strong> Navigate to specific app screens automatically</p>
            <p><strong className="text-primary">WebSocket:</strong> wss://ws.buzzcall.enterprise/v1 (real-time updates)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
