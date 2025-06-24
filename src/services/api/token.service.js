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

    /* static async refreshToken(refreshToken: string): Promise<Tokens> {
        // Implementa la lógica para refrescar el token
        const response = await apiClient.post<RefreshTokenResponse>(
            '/auth/refresh-token'
            , { refreshToken }
        );

        if (!response.data.accessToken || !response.data.refreshToken) {
            throw new Error('Invalid token response format');
        }
    
        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
        };
    } */
}

export { TokenService };