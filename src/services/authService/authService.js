import { ENDPOINTS } from "@/services/api/endpoints";
import { TokenService } from "../api/token.service";
import { apiClient } from "../api/ApiClient";

export const AuthService = {

    login: async (credentials) => {
        try {
            const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);

            const token = response;

            if (!token.access || !token.refresh) {
                throw new Error('Tokens no recibidos en la respuesta');
            }

            console.log(token)

            TokenService.saveToken(token.access);
            TokenService.saveRefreshToken(token.refresh);
        } catch (error) {
            console.error('Error en AuthService.login:', error);
            throw error;
        }
    },

    register: async (userData) => {
        return apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    },

    refreshToken: async () => {
        return apiClient.post(ENDPOINTS.AUTH.REFRESH);
    },

    me: async () => {
        return apiClient.get(ENDPOINTS.AUTH.ME);
    },

};