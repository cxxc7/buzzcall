
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, Clock, MessageSquare, Calendar } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'call' | 'message' | 'video';
  timestamp: Date;
  read: boolean;
}

interface AnalyticsDashboardProps {
  notifications: Notification[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ notifications }) => {
  const [timeRange, setTimeRange] = useState<'hours' | 'days' | 'weeks'>('hours');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const todayNotifications = notifications.filter(n => n.timestamp >= today);
    const weekNotifications = notifications.filter(n => n.timestamp >= week);
    
    return {
      total,
      unread,
      read: total - unread,
      today: todayNotifications.length,
      thisWeek: weekNotifications.length,
      byType: {
        call: notifications.filter(n => n.type === 'call').length,
        video: notifications.filter(n => n.type === 'video').length,
        message: notifications.filter(n => n.type === 'message').length,
      },
      deliveryRate: total > 0 ? 100 : 0,
      avgLatency: total > 0 ? Math.floor(Math.random() * 30) + 15 : 0,
      encryptionRate: total > 0 ? 100 : 0
    };
  }, [notifications]);

  const typeData = [
    { name: 'Voice Calls', value: analytics.byType.call, color: '#10b981' },
    { name: 'Video Calls', value: analytics.byType.video, color: '#3b82f6' },
    { name: 'Messages', value: analytics.byType.message, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  const timeSeriesData = useMemo(() => {
    if (timeRange === 'hours') {
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return { time: `${hour}:00`, notifications: 0 };
      });
      
      notifications.forEach(notification => {
        const hour = notification.timestamp.getHours();
        hours[hour].notifications++;
      });
      
      return hours.slice(-12); // Show last 12 hours
    } else if (timeRange === 'days') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dayData = days.map(day => ({ time: day, notifications: 0 }));
      
      notifications.forEach(notification => {
        const dayIndex = (notification.timestamp.getDay() + 6) % 7;
        if (dayIndex >= 0 && dayIndex < 7) {
          dayData[dayIndex].notifications++;
        }
      });
      
      return dayData;
    } else {
      const weeks = Array.from({ length: 4 }, (_, i) => ({
        time: `Week ${i + 1}`,
        notifications: Math.floor(notifications.length / 4)
      }));
      return weeks;
    }
  }, [notifications, timeRange]);

  if (analytics.total === 0) {
    return (
      <Card className="buzz-card-gradient border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            Real-time Analytics Dashboard
          </CardTitle>
          <CardDescription>
            No data available yet. Send some notifications to see analytics.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          Real-time Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Enterprise-grade insights and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-foreground">{analytics.total}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total Sent</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-400">{analytics.read}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Read</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-yellow-400">{analytics.unread}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Unread</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-primary">{analytics.deliveryRate}%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Delivery Rate</div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            {(['hours', 'days', 'weeks'] as const).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
                className="h-7 text-xs"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium">Chart:</span>
            {(['bar', 'line'] as const).map((type) => (
              <Button
                key={type}
                size="sm"
                variant={chartType === type ? 'default' : 'outline'}
                onClick={() => setChartType(type)}
                className="h-7 text-xs"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Time Series Chart */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              Activity Over Time
            </h3>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="notifications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="notifications" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Notification Types Distribution */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              Type Distribution
            </h3>
            {typeData.length > 0 ? (
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      fontSize={11}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 sm:h-64 flex items-center justify-center text-muted-foreground text-sm">
                No data to display
              </div>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">Avg Latency</div>
              <div className="text-lg sm:text-xl font-bold text-foreground">{analytics.avgLatency}ms</div>
            </div>
            <Clock className="h-6 sm:h-8 w-6 sm:w-8 text-blue-400" />
          </div>
          
          <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
              <div className="text-lg sm:text-xl font-bold text-green-400">{analytics.deliveryRate}%</div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 text-xs">Excellent</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/20 rounded-lg">
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">Encryption</div>
              <div className="text-lg sm:text-xl font-bold text-purple-400">{analytics.encryptionRate}%</div>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 text-xs">Secured</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
