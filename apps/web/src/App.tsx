import { AuthModal } from "./components/auth/AuthModal";
import { Button } from "./components/ui/button";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1>oi</h1>
      <h1 className="text-3xl font-bold mb-6">Sistema de Tarefas Colaborativo</h1>
      {user ? (
        <div className="space-y-2 text-center">
          <p>Olá, <strong>{user.username}</strong> 👋</p>
          <Button onClick={signOut} variant="destructive">
            Sair
          </Button>
        </div>
      ) : (
        <AuthModal />
      )}
    </div>
  );
}

export default App;
