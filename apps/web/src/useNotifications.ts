import { useEffect } from 'react';
import io from 'socket.io-client';

export function useNotifications(userId: string) {
  useEffect(() => {
    const socket = io('http://localhost:3004', {
      query: { userId },
    });

    socket.on('notification', (data) => {
      console.log('Nova notificação:', data);
      // Ex: mostrar toast com shadcn/ui
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
}
