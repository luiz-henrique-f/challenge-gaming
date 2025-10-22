import { useAuth } from "../context/AuthContext";

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) window.location.href = "/";
  return user;
}
