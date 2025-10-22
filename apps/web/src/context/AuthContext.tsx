import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login, register } from "@/api/authService";

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (name: string, username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = async (username: string, password: string) => {
    const data = await login({ username, password });
    const newUser = { id: "", name: data.name ?? "", username };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const registerUser = async (name: string, username: string, password: string) => {
    const data = await register({ name, username, password });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const signOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
