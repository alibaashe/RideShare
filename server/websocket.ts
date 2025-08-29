import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

interface ClientInfo {
  userId?: string;
  bookingId?: string;
  ws: WebSocket;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ClientInfo> = new Map();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.wss.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(ws: WebSocket, req: any) {
    const clientId = Date.now().toString();
    
    const clientInfo: ClientInfo = {
      ws
    };
    
    this.clients.set(clientId, clientInfo);
    
    console.log(`WebSocket client connected: ${clientId}`);
    
    // Send connection confirmation
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to Sombeder Service',
      clientId
    }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(clientId, message);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${clientId}`);
      this.clients.delete(clientId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      this.clients.delete(clientId);
    });
  }

  private handleMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'join_booking':
        client.bookingId = message.bookingId;
        this.sendToClient(clientId, {
          type: 'booking_joined',
          bookingId: message.bookingId
        });
        break;

      case 'ping':
        this.sendToClient(clientId, { type: 'pong' });
        break;

      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  public sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  public broadcastToBooking(bookingId: string, message: any) {
    this.clients.forEach((client, clientId) => {
      if (client.bookingId === bookingId) {
        this.sendToClient(clientId, message);
      }
    });
  }

  public notifyRideUpdate(bookingId: string, status: string, location?: { lat: number; lng: number }) {
    this.broadcastToBooking(bookingId, {
      type: 'ride_update',
      bookingId,
      status,
      location,
      timestamp: new Date().toISOString()
    });
  }
}