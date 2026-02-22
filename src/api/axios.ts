import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message || "Erro ao processar requisição";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error("Servidor não está respondendo"));
    } else {
      return Promise.reject(new Error("Erro ao fazer requisição"));
    }
  },
);

export default apiClient;
