
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Smartphone, Globe, Clock, Lock } from "lucide-react";

interface BuzzCallInfoPopupProps {
  children: React.ReactNode;
}

export const BuzzCallInfoPopup: React.FC<BuzzCallInfoPopupProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] buzz-card-gradient border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 buzz-accent-gradient rounded-lg">
              <Zap className="h-6 w-6 text-background" />
            </div>
            BuzzCall Enterprise
            <Badge className="bg-primary/20 text-primary">v2.1.0</Badge>
          </DialogTitle>
          <DialogDescription className="text-base">
            Enterprise-grade push notification engine for mission-critical communications
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* Key Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Shield className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">End-to-End Encryption</h4>
                <p className="text-sm text-muted-foreground">RSA-2048 encrypted messaging</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Globe className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">Real-time WebSocket</h4>
                <p className="text-sm text-muted-foreground">Instant message delivery</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Smartphone className="h-5 w-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">Cross-Platform</h4>
                <p className="text-sm text-muted-foreground">Android, iOS, Web support</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <Clock className="h-5 w-5 text-orange-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">Analytics Dashboard</h4>
                <p className="text-sm text-muted-foreground">Real-time delivery metrics</p>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="border-t border-border/50 pt-4">
            <h3 className="font-semibold text-foreground mb-3">Technical Architecture</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Engine:</span>
                <span className="ml-2 text-foreground">Firebase Cloud Messaging</span>
              </div>
              <div>
                <span className="text-muted-foreground">WebSocket:</span>
                <span className="ml-2 text-foreground">wss://ws.buzzcall.enterprise</span>
              </div>
              <div>
                <span className="text-muted-foreground">Encryption:</span>
                <span className="ml-2 text-foreground">RSA-OAEP SHA-256</span>
              </div>
              <div>
                <span className="text-muted-foreground">Storage:</span>
                <span className="ml-2 text-foreground">Local + Cloud Sync</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border-t border-border/50 pt-4">
            <h3 className="font-semibold text-foreground mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">&lt;50ms</div>
                <div className="text-sm text-muted-foreground">Latency</div>
              </div>
              <div className="text-center p-3 bg-purple-500/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">10M+</div>
                <div className="text-sm text-muted-foreground">Messages/Day</div>
              </div>
            </div>
          </div>

          {/* API Information */}
          <div className="border-t border-border/50 pt-4">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Enterprise API Endpoints
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">REST API:</span>
                <span className="text-foreground">https://api.buzzcall.enterprise/v1</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">WebSocket:</span>
                <span className="text-foreground">wss://ws.buzzcall.enterprise/v1</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">Analytics:</span>
                <span className="text-foreground">https://analytics.buzzcall.enterprise</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
