
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
        return 'Priority Message';
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
    
    // Enhanced deep linking simulation
    const targetUrl = deepLinks[notification.type];
    toast.success(`🎯 BuzzCall Deep Link: Opening ${getTypeName()}`, {
      description: `Navigating to ${targetUrl}`,
      action: {
        label: "Open in New Tab",
        onClick: () => window.open(targetUrl, '_blank')
      }
    });
    
    console.log('🔗 Enhanced deep link activated:', {
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
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1 p-2 rounded-lg bg-muted/20">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h4 className="font-semibold text-foreground truncate">
                  {notification.title}
                </h4>
                <Badge className={getTypeColor()}>
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
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {notification.timestamp.toLocaleTimeString()}
                </span>
                <span>•</span>
                <span>BuzzCall Engine</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4 flex-wrap">
            <Button
              size="sm"
              onClick={handleDeepLink}
              className="flex items-center gap-2 buzz-accent-gradient hover:opacity-90"
            >
              <ArrowUpRight className="h-3 w-3" />
              Open
            </Button>
            
            {!notification.read && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkAsRead(notification.id)}
                className="flex items-center gap-2 border-border/50 hover:bg-muted/20"
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
                className="flex items-center gap-2 border-destructive/20 hover:bg-destructive/10 text-destructive hover:text-destructive"
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
