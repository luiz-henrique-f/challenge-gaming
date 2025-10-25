import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Register from "@/components/auth/RegisterForm"

export function LoginPage() {
  const { loginUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    try {
      await loginUser(username, password);
      navigate({ to: '/tasks' });
    } catch(error) {
      toast.error("Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0F172A] text-white overflow-hidden relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/20 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full animate-pulse delay-300"></div>
      </div>

      <section className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 relative">
        <Link
          to="/"
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="text-center max-w-md">
          <img
            src="/task-login.svg"
            alt="Controle financeiro"
            className="w-80 h-80 object-contain mx-auto drop-shadow-2xl mb-6"
          />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Controle de tarefas simplificado
          </h1>
          <p className="text-gray-400 mt-4 leading-relaxed">
            Gerencie suas tarefas, planeje projetos e alcance a produtividade máxima com praticidade e segurança.
          </p>
        </div>
      </section>

      <section className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <Card className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10" />

          <CardContent className="relative z-10 p-8 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-3 shadow-lg">
                <img
                  src="/icon.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                TaskFlow
              </h2>
              <p className="text-gray-400 mt-2 text-center text-sm">
                Seu assistente inteligente de produtividade
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-full h-px bg-blue-900/50"></div>
                <span className="px-4 text-sm text-gray-400 whitespace-nowrap">
                  Entrar com
                </span>
                <div className="w-full h-px bg-blue-900/50"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Usuário" 
                  className="bg-[#0B0F19] border-blue-900/40 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Senha" 
                  className="bg-[#0B0F19] border-blue-900/40 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div>
                <p className="text-center text-sm text-gray-400">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors cursor-pointer"
                    disabled={isLoading}
                  >
                    Registre-se
                  </button>
                </p>
              </div>
            </div>

            {/* Termos */}
            <p className="text-center text-xs text-gray-400 mt-8">
              Ao continuar, você concorda com nossos{" "}
              <a
                href="#"
                className="text-blue-400 hover:underline font-medium"
              >
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a
                href="#"
                className="text-blue-400 hover:underline font-medium"
              >
                Política de Privacidade
              </a>
              .
            </p>

            {/* Rodapé */}
            {/* <div className="mt-6 flex justify-center text-gray-500 text-sm">
              <LogIn className="w-4 h-4 mr-2" />
              <span>Versão 1.0.0</span>
            </div> */}
          </CardContent>
        </Card>
      </section>

      {/* Modal de Registro */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#121620] border border-blue-900/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Criar Nova Conta
            </DialogTitle>
          </DialogHeader>
          
          <Register onSuccess={handleRegisterSuccess} />
        </DialogContent>
      </Dialog>
    </main>
  )
}