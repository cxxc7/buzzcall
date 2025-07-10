
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Settings, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import WebSocketService from '@/services/WebSocketService';

interface WebSocketControlProps {
  isConnected: boolean;
  onConnectionChange: (connected: boolean) => void;
}

export const WebSocketControl: React.FC<WebSocketControlProps> = ({ 
  isConnected, 
  onConnectionChange 
}) => {
  const [customUrl, setCustomUrl] = useState('wss://ws.buzzcall.enterprise/v1');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await WebSocketService.connect(customUrl);
      toast.success('WebSocket connected successfully!');
    } catch (error) {
      toast.error('Failed to connect WebSocket');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    WebSocketService.disconnect();
    toast.info('WebSocket disconnected');
  };

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-primary" />
          WebSocket Connection Control
        </CardTitle>
        <CardDescription>
          Manage real-time connection settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Status:</span>
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? "Connected" : "Offline"}
          </Badge>
        </div>

        <div className="space-y-2">
          <Label htmlFor="websocket-url">WebSocket URL</Label>
          <Input
            id="websocket-url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="wss://ws.buzzcall.enterprise/v1"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Enter your custom WebSocket endpoint or use the default enterprise URL
          </p>
        </div>

        <div className="flex gap-2">
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect}
              variant="outline"
              className="flex items-center gap-2"
            >
              <WifiOff className="h-4 w-4" />
              Disconnect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
