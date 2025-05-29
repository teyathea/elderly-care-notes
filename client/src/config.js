export const config = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
  SOCKET_OPTIONS: {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  }
}; 