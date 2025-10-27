import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: false,
});

// === Interceptor para injetar o token de acesso ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Interceptor para refresh automático E rate limiting ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⬇️ TRATAMENTO PARA RATE LIMITING (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limit excedido. Tente novamente em ${retryAfter} segundos.`);
      
      // Aqui você pode mostrar uma notificação para o usuário
      if (typeof window !== 'undefined') {
        // Exemplo usando alert (substitua por seu sistema de notificação)
        console.log(`Muitas requisições! Tente novamente em ${retryAfter} segundos.`);
      }
      
      return Promise.reject(error);
    }

    // ⬇️ CÓDIGO EXISTENTE PARA REFRESH TOKEN (401)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          "http://localhost:3001/api/auth/refresh-token",
          { refreshToken }
        );

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro ao atualizar token:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;