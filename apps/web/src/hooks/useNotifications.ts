import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'sonner';

export function useNotifications(userId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3004', { query: { userId } });

      socketRef.current.on('notification', (data) => {
        console.log('Nova notificação:', data);
        toast.info(data.content);
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);
}
