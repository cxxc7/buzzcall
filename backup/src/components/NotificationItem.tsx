
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Video, MessageSquare, Check, ExternalLink, Zap, Trash2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'message' | 'video';
  timestamp: Date;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead,
  onDelete
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'call':
        return <Phone className="h-5 w-5 text-green-400" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-400" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-400" />;
      default:
        return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'call':
        return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'video':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'message':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      default:
        return 'bg-muted/20 text-muted-foreground border-border/20';
    }
  };

  const getTypeName = () => {
    switch (notification.type) {
      case 'call':
        return 'Voice Call';
      case 'video':
        return 'Video Conference';
      case 'message':
        return 'Message';
      default:
        return 'Notification';
    }
  };

  const handleDeepLink = () => {
    const deepLinks = {
      call: '/buzzcall/voice-call/simulation',
      video: '/buzzcall/video-conference/simulation',
      message: '/buzzcall/messages/simulation'
    };
    
    const targetUrl = deepLinks[notification.type];
    toast.success(`🎯 Deep Link: Opening ${getTypeName()}`, {
      description: `Navigating to ${targetUrl}`,
      action: {
        label: "Open in New Tab",
        onClick: () => {
          // Create a simple demo page content
          const demoContent = `
            <html>
              <head>
                <title>${getTypeName()} - Demo</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
                  .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                  .header { text-align: center; margin-bottom: 30px; }
                  .icon { font-size: 48px; margin-bottom: 20px; }
                  h1 { color: #333; margin-bottom: 10px; }
                  p { color: #666; line-height: 1.6; }
                  .feature-list { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .feature-list h3 { margin-top: 0; color: #333; }
                  .feature-list li { margin: 8px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="icon">${notification.type === 'call' ? '📞' : notification.type === 'video' ? '📹' : '💬'}</div>
                    <h1>${getTypeName()} Interface</h1>
                    <p>This is a demo of the ${getTypeName().toLowerCase()} feature</p>
                  </div>
                  
                  <div class="feature-list">
                    <h3>🚀 Future Enhancements</h3>
                    <ul>
                      ${notification.type === 'call' ? `
                        <li>Real-time voice calling with WebRTC</li>
                        <li>Call recording and transcription</li>
                        <li>Multi-party conference calls</li>
                        <li>Call quality analytics</li>
                      ` : notification.type === 'video' ? `
                        <li>HD video conferencing</li>
                        <li>Screen sharing capabilities</li>
                        <li>Virtual backgrounds</li>
                        <li>Recording and playback</li>
                      ` : `
                        <li>Rich text messaging</li>
                        <li>File and media sharing</li>
                        <li>Message encryption</li>
                        <li>Group chat functionality</li>
                      `}
                    </ul>
                  </div>
                  
                  <p><strong>Note:</strong> This is a demonstration interface. In a production environment, this would be the actual ${getTypeName().toLowerCase()} interface with full functionality.</p>
                </div>
              </body>
            </html>
          `;
          
          const blob = new Blob([demoContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          
          // Clean up the blob URL after a short delay
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      }
    });
    
    console.log('🔗 Deep link activated:', {
      type: notification.type,
      url: targetUrl,
      timestamp: new Date().toISOString(),
      notificationId: notification.id
    });
    
    // Mark as read when interacted with
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
      toast.success("Notification deleted");
    }
  };

  return (
    <Card className={`transition-all duration-200 buzz-card-gradient border-border/50 hover:border-primary/30 ${
      !notification.read ? 'ring-1 ring-primary/20 bg-primary/5' : ''
    }`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-1 p-2 rounded-lg bg-muted/20 flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h4 className="font-semibold text-foreground truncate text-sm sm:text-base">
                  {notification.title}
                </h4>
                <Badge className={`${getTypeColor()} text-xs`}>
                  {getTypeName()}
                </Badge>
                {!notification.read && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full buzz-pulse"></div>
                    <span className="text-xs text-primary font-medium">NEW</span>
                  </div>
                )}
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {notification.body}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {notification.timestamp.toLocaleTimeString()}
                </span>
                <span>•</span>
                <span>Enterprise</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Button
              size="sm"
              onClick={handleDeepLink}
              className="flex items-center gap-2 buzz-accent-gradient hover:opacity-90 text-xs"
            >
              <ArrowUpRight className="h-3 w-3" />
              Open
            </Button>
            
            {!notification.read && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkAsRead(notification.id)}
                className="flex items-center gap-2 border-border/50 hover:bg-muted/20 text-xs"
              >
                <Check className="h-3 w-3" />
                Read
              </Button>
            )}

            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 border-destructive/20 hover:bg-destructive/10 text-destructive hover:text-destructive text-xs"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
