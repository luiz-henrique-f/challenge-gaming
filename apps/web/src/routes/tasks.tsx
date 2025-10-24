import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { TasksPage } from '@/tasks/page';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/tasks')({
  // beforeLoad: ({ location }) => {
  //   const isAuthenticated = localStorage.getItem('token')
    
  //   if (!isAuthenticated) {
  //     throw redirect({
  //       to: '/login',
  //       search: {
  //         redirect: location.href,
  //       },
  //     })
  //   }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (!user) {
        navigate({ to: '/login', replace: true });
      }
    }, [user, navigate]);
  
    const handleClickSignOut = async () => {
      await signOut();
    };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-3xl font-bold mb-6">Sistema de Tarefas Colaborativoss</h1>
        
        <div>oi</div>
        <TasksPage />
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
