import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Register() {
  const { registerUser } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await registerUser(name, username, password);
      alert("Usuário registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      alert("Erro ao registrar usuário.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome completo"
      />
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuário"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
      />
      <Button type="submit">Registrar</Button>
    </form>
  );
}
