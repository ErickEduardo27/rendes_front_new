import axios from 'axios';
import { TokenService } from "@/services/api/token.service";
import { useAuthStore } from '@/store/auth';
import router from '@/router/index'

// Si VITE_API no está definido, usa '' para que use rutas relativas y el proxy de Vite funcione
const baseURL = import.meta.env.VITE_API || 'http://127.0.0.1:8010';

class ApiClient {
  constructor() {
    this.instance = axios.create({
      baseURL,
      timeout: 100000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = TokenService.getToken();
        if (token && !this.isPublicEndpoint(config.url)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const authStore = useAuthStore();
        if (error.response) {
          if (error.response.status === 401) {
            // No intentar refresh si el 401 fue en la propia petición de refresh
            const isRefreshRequest = error.config?.url?.includes?.('token/refresh');
            const alreadyRetried = error.config?.__retry401;
            const refreshToken = TokenService.getRefreshToken();

            if (!isRefreshRequest && !alreadyRetried && refreshToken) {
              try {
                const newTokens = await TokenService.refreshToken(refreshToken);
                TokenService.saveToken(newTokens.accessToken);
                error.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                error.config.__retry401 = true;
                return this.instance(error.config);
              } catch (e) {
                // Refresh falló: limpiar y redirigir a login
              }
            }
            authStore.logout();
            TokenService.clearTokens();
            alert('Tu sesión ha expirado. Por favor vuelve a iniciar sesión.');
            router.push('/login');
          }
          return Promise.reject(this.transformErrorData(error.response));
        }
        return Promise.reject(this.transformNetworkError(error));
      }
    );
  }

  transformErrorData(errorResponse) {
    return {
      data: errorResponse.data,
      status: errorResponse.status,
      message: errorResponse.statusText || 'Error occurred',
      error: errorResponse.data?.error || 'Unknown error',
      headers: errorResponse.headers,
      config: errorResponse.config
    };
  }

  transformNetworkError(error) {
    return {
      data: null,
      status: 0,
      message: 'Network Error',
      error: error.message || 'Failed to connect to server',
      config: error.config
    };
  }

  isPublicEndpoint(url) {
    const publicEndpoints = [
      '/login',
    ];
    return publicEndpoints.some(endpoint => url?.includes(endpoint));
  }

  async handle401Error(error) {
    try {
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        const newTokens = await TokenService.refreshToken(refreshToken);
        TokenService.saveToken(newTokens.accessToken);
        TokenService.saveRefreshToken(newTokens.refreshToken);

        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return this.instance(originalRequest);
      }
    } catch (e) {
      TokenService.clearTokens();
      window.location.href = '/login';
    }
  }

  // Métodos HTTP
  async get(url, config = {}) {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}, config = {}) {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch(url, data = {}, config = {}) {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.instance.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();