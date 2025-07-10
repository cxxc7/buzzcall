
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Users, Zap, Phone, Video, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import NotificationStorageService from '@/services/NotificationStorageService';

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
    byType: { call: 0, video: 0, message: 0 }
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const updateAnalytics = () => {
      const data = NotificationStorageService.getAnalytics();
      setAnalytics(data);

      // Only generate chart data if there are actual notifications
      if (data.total > 0) {
        const notifications = NotificationStorageService.getAllNotifications();
        
        // Create hourly data based on actual notifications
        const hourlyData = new Map();
        const now = new Date();
        
        // Initialize last 24 hours
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
          const hourKey = hour.getHours().toString().padStart(2, '0') + ':00';
          hourlyData.set(hourKey, { time: hourKey, notifications: 0, delivered: 0 });
        }
        
        // Populate with actual notification data
        notifications.forEach(notification => {
          const hour = notification.timestamp.getHours().toString().padStart(2, '0') + ':00';
          if (hourlyData.has(hour)) {
            const existing = hourlyData.get(hour);
            existing.notifications += 1;
            existing.delivered += 1; // Assume all are delivered for now
          }
        });
        
        setChartData(Array.from(hourlyData.values()));
      } else {
        // Show empty state when no notifications
        setChartData([]);
      }
    };

    updateAnalytics();
    const interval = setInterval(updateAnalytics, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'Voice Calls', value: analytics.byType.call, color: '#10B981' },
    { name: 'Video Calls', value: analytics.byType.video, color: '#3B82F6' },
    { name: 'Messages', value: analytics.byType.message, color: '#8B5CF6' },
  ].filter(item => item.value > 0); // Only show types with actual data

  const hasData = analytics.total > 0;

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          Real-time Analytics Dashboard
          {hasData && <Badge className="bg-green-500/20 text-green-400 buzz-pulse">Live</Badge>}
        </CardTitle>
        <CardDescription>
          {hasData ? 
            "Enterprise-grade notification delivery metrics and performance insights" :
            "Analytics will appear here once notifications are sent"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{analytics.total}</div>
            <div className="text-sm text-muted-foreground">Total Delivered</div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{analytics.today}</div>
            <div className="text-sm text-muted-foreground">Today</div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">{analytics.unread}</div>
            <div className="text-sm text-muted-foreground">Unread</div>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {hasData ? "100%" : "0%"}
            </div>
            <div className="text-sm text-muted-foreground">Delivery Rate</div>
          </div>
        </div>

        {/* Charts - Only show if there's data */}
        {hasData ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="bg-muted/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-foreground">24h Delivery Pattern</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="notifications" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="delivered" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div className="bg-muted/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Notification Types</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No notification data yet</p>
            <p className="text-sm">Send some test notifications to see analytics</p>
          </div>
        )}

        {/* Performance Indicators - Only show if there's data */}
        {hasData && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-green-400" />
              <div>
                <div className="font-semibold text-foreground">{analytics.byType.call}</div>
                <div className="text-sm text-muted-foreground">Voice Calls</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-blue-400" />
              <div>
                <div className="font-semibold text-foreground">{analytics.byType.video}</div>
                <div className="text-sm text-muted-foreground">Video Calls</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <div>
                <div className="font-semibold text-foreground">{analytics.byType.message}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
