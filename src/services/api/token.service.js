import axios from 'axios';

const baseURL = import.meta.env.VITE_API || 'http://127.0.0.1:8010';

class TokenService {
    static ACCESS_TOKEN_KEY = 'access_token';
    static REFRESH_TOKEN_KEY = 'refresh_token';

    static getToken() {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    static getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    static saveToken(token) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    static saveRefreshToken(token) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    static clearTokens() {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    /** Llama al backend api/token/refresh/ con el refresh token. Retorna { accessToken }. */
    static async refreshToken(refreshToken) {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, { refresh: refreshToken }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        if (!response.data || !response.data.access) {
            throw new Error('Invalid refresh response');
        }
        return { accessToken: response.data.access };
    }
}

export { TokenService };