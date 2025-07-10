
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
        title: notificationType === 'call' ? '📞 BuzzCall Incoming' : 
               notificationType === 'video' ? '📹 BuzzCall Video Conference' : '💬 BuzzCall Message',
        body: customMessage || (
          notificationType === 'call' ? 'Enterprise call incoming from BuzzCall system...' :
          notificationType === 'video' ? 'Video conference request via BuzzCall platform' :
          'Priority message delivered through BuzzCall engine'
        ),
        data: {
          type: notificationType,
          userId: recipientId,
          deepLink: `/buzzcall/${notificationType}/${recipientId}`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          source: 'BuzzCall Enterprise API'
        }
      };

      console.log('🚀 BuzzCall Enterprise API Trigger:', payload);
      
      // Simulate network request with enterprise-grade latency
      toast.info('Processing through BuzzCall API...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Use the existing NotificationService instead of creating browser notifications directly
      await NotificationService.sendTestNotification(notificationType as 'call' | 'video' | 'message');
      
      toast.success('✅ Enterprise notification delivered successfully!');
      
    } catch (error) {
      console.error('❌ BuzzCall API Error:', error);
      toast.error('Failed to process through BuzzCall API');
    }
  };

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Server className="h-6 w-6 text-primary" />
          </div>
          Enterprise Backend Simulator
        </CardTitle>
        <CardDescription>
          Simulate real-world BuzzCall API triggers from enterprise backend systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="backend-url" className="text-sm font-semibold">API Endpoint</Label>
            <Input
              id="backend-url"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="https://api.buzzcall.enterprise/v1"
              className="bg-muted/20 border-border/50"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="recipient" className="text-sm font-semibold">Target User ID</Label>
            <Input
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="user_enterprise_001"
              className="bg-muted/20 border-border/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="notification-type" className="text-sm font-semibold">Notification Type</Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger className="bg-muted/20 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="call">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-green-400" />
                    Enterprise Voice Call
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-blue-400" />
                    Video Conference
                  </div>
                </SelectItem>
                <SelectItem value="message">
                  <div className="flex items-center gap-3">
                    <Send className="h-4 w-4 text-purple-400" />
                    Priority Message
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="custom-message" className="text-sm font-semibold">Custom Payload</Label>
            <Input
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Custom enterprise message..."
              className="bg-muted/20 border-border/50"
            />
          </div>
        </div>

        <Button 
          onClick={simulateBackendTrigger}
          className="w-full h-14 text-lg font-semibold buzz-accent-gradient hover:opacity-90 transition-all"
        >
          <Zap className="h-5 w-5 mr-3" />
          Trigger BuzzCall Enterprise API
        </Button>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong className="text-primary">Production Ready:</strong> This simulates enterprise backend FCM integration</p>
            <p><strong className="text-primary">Native Processing:</strong> Java modules handle notifications in killed app state</p>
            <p><strong className="text-primary">Smart Routing:</strong> Deep links navigate to specific app screens automatically</p>
            <p><strong className="text-primary">API Endpoints:</strong> Use the URLs above for your backend integration</p>
            <p><strong className="text-primary">WebSocket URL:</strong> wss://ws.buzzcall.enterprise/v1 (for real-time updates)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
