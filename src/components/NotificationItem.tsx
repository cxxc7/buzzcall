
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Video, MessageSquare, Check, ExternalLink } from "lucide-react";
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
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'call':
        return <Phone className="h-5 w-5 text-green-600" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'call':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'message':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeepLink = () => {
    const deepLinks = {
      call: '/call/simulation',
      video: '/video/simulation',
      message: '/chat/simulation'
    };
    
    toast.success(`Deep link activated: ${deepLinks[notification.type]}`);
    console.log('Deep link navigation:', deepLinks[notification.type]);
    
    // Mark as read when interacted with
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${
      !notification.read ? 'ring-2 ring-blue-200 bg-blue-50' : 'bg-white'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {notification.title}
                </h4>
                <Badge variant="outline" className={getTypeColor()}>
                  {notification.type}
                </Badge>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-2">
                {notification.body}
              </p>
              
              <p className="text-xs text-gray-400">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeepLink}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Open
            </Button>
            
            {!notification.read && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkAsRead(notification.id)}
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Read
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
