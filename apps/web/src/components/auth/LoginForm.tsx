import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
// import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from '@tanstack/react-router';

export default function Login() {
  const { loginUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    try{
    e.preventDefault();
    await loginUser(username, password);
    navigate({ to: '/tasks' });
    
    // toast.success("Login efetuado com sucesso.");
    }catch(error){
      toast.error("Erro ao entrar. Verifique suas credenciais.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuário" />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
      <Button type="submit">Entrar</Button>
    </form>
  );
}
