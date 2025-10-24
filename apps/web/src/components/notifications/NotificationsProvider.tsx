import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/context/AuthContext';

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.id) {
    useNotifications(user.id);
  }

  return <>{children}</>;
}