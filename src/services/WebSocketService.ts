
class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  async connect(endpoint: string = 'wss://ws.buzzcall.enterprise/v1'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(endpoint);
        
        this.ws.onopen = () => {
          console.log('🔗 BuzzCall WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('📨 Real-time message received:', data);
          
          if (data.type && this.messageHandlers.has(data.type)) {
            this.messageHandlers.get(data.type)?.(data);
          }
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected, attempting reconnect...');
          this.handleReconnect(endpoint);
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect(endpoint: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        console.log(`🔄 Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect(endpoint);
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  subscribe(messageType: string, handler: (data: any) => void): void {
    this.messageHandlers.set(messageType, handler);
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default WebSocketService.getInstance();
