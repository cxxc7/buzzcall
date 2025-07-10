
class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private connectionCallbacks: ((connected: boolean) => void)[] = [];
  private isManuallyDisconnected = false;

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async connect(endpoint: string = 'wss://ws.buzzcall.enterprise/v1'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔄 Attempting to connect to WebSocket...');
        this.isManuallyDisconnected = false;
        this.ws = new WebSocket(endpoint);
        
        const connectionTimeout = setTimeout(() => {
          if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error('Connection timeout'));
          }
        }, 10000); // 10 second timeout
        
        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('🔗 WebSocket connected successfully');
          this.reconnectAttempts = 0;
          this.notifyConnectionChange(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            if (event.data.trim().startsWith('{') || event.data.trim().startsWith('[')) {
              const data = JSON.parse(event.data);
              console.log('📨 Real-time message received:', data);
              
              if (data.type && this.messageHandlers.has(data.type)) {
                this.messageHandlers.get(data.type)?.(data);
              }
            } else {
              console.log('📨 Non-JSON message received:', event.data);
            }
          } catch (error) {
            console.log('📨 Message received (non-JSON):', event.data);
          }
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log('🔌 WebSocket disconnected', event.code, event.reason);
          this.notifyConnectionChange(false);
          
          if (!this.isManuallyDisconnected && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect(endpoint);
          }
        };

        this.ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.log('⚠️ WebSocket connection failed - demo endpoints are simulated');
          this.notifyConnectionChange(false);
          reject(error);
        };
      } catch (error) {
        console.log('⚠️ WebSocket not available - using fallback mode');
        this.notifyConnectionChange(false);
        reject(error);
      }
    });
  }

  private handleReconnect(endpoint: string): void {
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
    setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect(endpoint).catch(() => {
        console.log('🔄 Reconnection failed');
      });
    }, delay);
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => callback(connected));
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  subscribe(messageType: string, handler: (data: any) => void): void {
    this.messageHandlers.set(messageType, handler);
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.log('📡 WebSocket offline - storing message locally');
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  disconnect(): void {
    this.isManuallyDisconnected = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getConnectionStatus(): { connected: boolean; attempts: number; maxAttempts: number } {
    return {
      connected: this.isConnected(),
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }
}

export default WebSocketService.getInstance();
