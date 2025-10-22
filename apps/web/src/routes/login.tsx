import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { createFileRoute } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleClickSignOut = () => {
    signOut();
    navigate({ to: '/login' });

  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-3xl font-bold mb-6">Sistema de Tarefas Colaborativo</h1>
      {user ? (
        <div className="space-y-2 text-center">
          <p>Olá, <strong>{user.username}</strong> 👋</p>
          <Button onClick={handleClickSignOut} variant="destructive">
            Sair
          </Button>
        </div>
      ) : (
        <AuthModal />
      )}
    </div>
  );
}
