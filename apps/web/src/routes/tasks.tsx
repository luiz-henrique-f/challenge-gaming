import { useAuth } from '@/context/AuthContext';
import { TasksPage } from '@/tasks/page';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/global/header';

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate({ to: '/login', replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-pattern text-white">
      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117]/90 via-[#0B0F19]/95 to-[#0A0E14]/90" />

      {/* Conteúdo */}
      <div className="relative z-10">
        <Header />
        <main className="flex flex-col items-center justify-center mt-3.5 px-8 text-center w-full max-w-7xl mx-auto">
          {/* <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
            Sistema de Tarefas Colaborativo
          </h1> */}

          <TasksPage />

          {/* {user ? (
            <div className="mt-8 space-y-2">
              <p className="text-gray-300">
                Olá, <strong className="text-blue-400">{user.username}</strong> 👋
              </p>
              <Button onClick={handleClickSignOut} variant="destructive">
                Sair
              </Button>
            </div>
          ) : (
            <AuthModal />
          )} */}
        </main>
      </div>
    </div>
  );
}
