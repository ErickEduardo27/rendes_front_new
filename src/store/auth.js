import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TokenService } from '@/services/api/token.service'
import { AuthService } from '@/services/authService/authService'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = ref(!!TokenService.getToken())
    const isLoading = ref(true)

    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
    }

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData))
        user.value = userData
        isAuthenticated.value = true
    }

    const logout = () => {
        TokenService.clearTokens();
        localStorage.removeItem('user')
        user.value = null
        isAuthenticated.value = false
    }

    const fetchUser = async () => {
        const token = TokenService.getToken()
        if (!token) {
            isLoading.value = false
            user.value = null
            return
        }

        try {
            const data = await AuthService.me()
            user.value = data
            isAuthenticated.value = true
        } catch (error) {
            console.error('Error al cargar usuario logueado:', error)
            logout()
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        fetchUser
    }
})
