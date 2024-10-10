// src/services/websocketService.js
export default class WebSocketService {
    constructor(url, protocols) {
      this.url = url;
      this.protocols = protocols;
      this.socket = null;
    }
  
    connect() {
      this.socket = new WebSocket(this.url, this.protocols);
      this.socket.onopen = this.onOpen;
      this.socket.onmessage = this.onMessage;
      this.socket.onclose = this.onClose;
      this.socket.onerror = this.onError;
    }
  
    onOpen(event) {
      console.log('WebSocket connection opened:', event);
    }
  
    onMessage(event) {
      console.log('Message received:', event.data);
    }
  
    onClose(event) {
      console.log('WebSocket connection closed:', event);
    }
  
    onError(event) {
      console.error('WebSocket error:', event);
    }
  
    sendMessage(message) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.error('WebSocket is not open. Ready state:', this.socket.readyState);
      }
    }
  }
  