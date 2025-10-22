import api from "./api";

interface RegisterData {
  name: string;
  username: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  const { accessToken, refreshToken } = response.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return response.data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const response = await api.post("/auth/refresh-token", { refreshToken });
  localStorage.setItem("accessToken", response.data.accessToken);

  return response.data;
};
