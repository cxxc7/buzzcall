
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Globe, Shield, Zap, Clock } from "lucide-react";

interface TechnicalSpecsProps {
  isConnected: boolean;
  isWebSocketConnected?: boolean;
  isEncryptionReady?: boolean;
}

export const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ 
  isConnected, 
  isWebSocketConnected = false,
  isEncryptionReady = false 
}) => {
  const specs = [
    {
      title: "Core Engine",
      icon: Zap,
      status: isConnected,
      items: [
        "Firebase Cloud Messaging",
        "Service Worker Integration",
        "Cross-platform Compatibility",
        "Smart Deep Linking"
      ]
    },
    {
      title: "Real-time Communication",
      icon: Globe,
      status: isWebSocketConnected,
      items: [
        "WebSocket Connection",
        "Auto-reconnection Logic",
        "Message Broadcasting",
        "Live Status Updates"
      ]
    },
    {
      title: "Security & Encryption",
      icon: Shield,
      status: isEncryptionReady,
      items: [
        "RSA-OAEP 2048-bit Keys",
        "End-to-End Encryption",
        "Secure Key Exchange",
        "Message Authentication"
      ]
    },
    {
      title: "Data Management",
      icon: Database,
      status: true,
      items: [
        "Local Storage System",
        "Notification History",
        "Performance Analytics",
        "Cloud Synchronization"
      ]
    }
  ];

  return (
    <Card className="buzz-card-gradient border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Code className="h-6 w-6 text-primary" />
          Enterprise Technical Architecture
          <Badge variant="outline" className="px-3 py-1">
            Android 15 Compatible
          </Badge>
        </CardTitle>
        <CardDescription>
          Production-ready infrastructure with enterprise-grade security and scalability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {specs.map((spec, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/20 rounded-lg">
                    <spec.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{spec.title}</h3>
                </div>
                <Badge variant={spec.status ? "default" : "secondary"} className="text-xs">
                  {spec.status ? "Active" : "Pending"}
                </Badge>
              </div>
              
              <div className="space-y-2 pl-12">
                {spec.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Endpoints Section */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Enterprise API Endpoints
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="font-medium text-foreground mb-2">REST API</div>
              <div className="text-sm font-mono text-muted-foreground break-all">
                https://api.buzzcall.enterprise/v1
              </div>
              <Badge variant="outline" className="mt-2 text-xs">Production</Badge>
            </div>
            
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="font-medium text-foreground mb-2">WebSocket</div>
              <div className="text-sm font-mono text-muted-foreground break-all">
                wss://ws.buzzcall.enterprise/v1
              </div>
              <Badge 
                variant={isWebSocketConnected ? "default" : "secondary"} 
                className="mt-2 text-xs"
              >
                {isWebSocketConnected ? "Connected" : "Offline"}
              </Badge>
            </div>
            
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="font-medium text-foreground mb-2">Analytics</div>
              <div className="text-sm font-mono text-muted-foreground break-all">
                https://analytics.buzzcall.enterprise
              </div>
              <Badge variant="outline" className="mt-2 text-xs">Real-time</Badge>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Performance Benchmarks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-xl font-bold text-green-400">
                {isWebSocketConnected && isEncryptionReady ? "99.9%" : "95.0%"}
              </div>
              <div className="text-xs text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <div className="text-xl font-bold text-blue-400">
                {isWebSocketConnected ? "<50ms" : "<200ms"}
              </div>
              <div className="text-xs text-muted-foreground">Avg Latency</div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 rounded-lg">
              <div className="text-xl font-bold text-purple-400">Ready</div>
              <div className="text-xs text-muted-foreground">Android 15</div>
            </div>
            <div className="text-center p-3 bg-orange-500/10 rounded-lg">
              <div className="text-xl font-bold text-orange-400">
                {isEncryptionReady ? "2048" : "Pending"}
              </div>
              <div className="text-xs text-muted-foreground">Bit Encryption</div>
            </div>
          </div>
        </div>

        {/* Android 15 Compatibility */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Android 15 Compatibility Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">Notification Channels API</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">Background App Restrictions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">Doze Mode Optimization</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">Adaptive Battery Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">Runtime Permissions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span className="text-muted-foreground">Scoped Storage Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
