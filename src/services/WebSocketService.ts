
class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private connectionCallbacks: ((connected: boolean) => void)[] = [];

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async connect(endpoint: string = 'wss://ws.buzzcall.enterprise/v1'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔄 Attempting to connect to BuzzCall WebSocket...');
        this.ws = new WebSocket(endpoint);
        
        this.ws.onopen = () => {
          console.log('🔗 BuzzCall WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyConnectionChange(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            // Only try to parse if it looks like JSON
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

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.notifyConnectionChange(false);
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect(endpoint);
          }
        };

        this.ws.onerror = (error) => {
          console.log('⚠️ WebSocket connection failed - using fallback mode');
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
    setTimeout(() => {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect(endpoint).catch(() => {
        console.log('🔄 Reconnection failed');
      });
    }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
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
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default WebSocketService.getInstance();
