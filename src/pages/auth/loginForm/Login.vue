<template>
    <div :class="{ dark: isDark }">
        <LoadingOverlay :active="loading" :is-full-page="true" :can-cancel="false" :color="isDark ? '#60a5fa' : '#2563eb'" :background="isDark ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)'" :loader="loaderType" :width="64" :height="64" :z-index="9999"/>
        <div
            class="min-h-screen bg-gradient-to-b from-[#effdff] to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 relative">
            <button @click="toggleDarkMode"
                class="absolute top-4 right-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-md hover:scale-105 transition">
                <SunIcon v-if="isDark" class="w-5 h-5 text-yellow-400" />
                <MoonIcon v-else class="w-5 h-5 text-gray-600" />
            </button>

            <div
                class="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8 text-gray-800 dark:text-gray-100">
                <div class="flex flex-col items-center mb-6 relative">
                    <div class="relative">
                        <div class="absolute inset-0 rounded-full blur-[90px] bg-blue-400 opacity-50 scale-125 z-0">
                        </div>
                        <img src="@/assets/logo_mini.png" alt="essalud-image"
                            class="relative w-24 h-24 z-10 rounded-full" />
                    </div>
                    <h1 class="text-2xl font-semibold mt-2">EsSalud</h1>
                    <p class="text-sm text-blue-600 dark:text-blue-300">Sistema de Gestión Médica</p>
                </div>

                <h2 class="text-lg font-bold text-center mb-1">Iniciar Sesión</h2>
                <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Ingresa tus credenciales para acceder al sistema
                </p>


                <form class="space-y-4" @submit.prevent="handleLogin">

                    <div>
                        <label class="text-sm font-medium block mb-1">Nombre de Usuario</label>
                        <div
                            class="flex items-center border border-[#d6f0f8] dark:border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300 bg-white dark:bg-gray-800">
                            <UserIcon class="w-5 h-5 text-gray-400 mr-2" />
                            <input type="text" v-model="username"
                                class="w-full text-sm outline-none bg-transparent text-gray-800 dark:text-gray-100"
                                placeholder="ej. doctor01" />
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-medium block mb-1">Contraseña</label>
                        <div
                            class="flex items-center border border-[#d6f0f8] dark:border-gray-600 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300 bg-white dark:bg-gray-800">
                            <LockClosedIcon class="w-5 h-5 text-gray-400 mr-2" />
                            <input type="password" v-model="password"
                                class="w-full text-sm outline-none bg-transparent text-gray-800 dark:text-gray-100"
                                placeholder="••••••" />
                            <EyeIcon class="w-5 h-5 text-gray-400 ml-2 cursor-pointer" />
                        </div>
                    </div>

                    <div class="flex items-center text-sm">
                        <input type="checkbox" id="remember" class="mr-2" />
                        <label for="remember">Recordar sesión</label>
                    </div>

                    <button type="submit"
                        class="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition">
                        Iniciar Sesión
                    </button>
                </form>

                <div class="text-center mt-6 text-sm">
                    <p class="mb-2">¿Necesitas ayuda para acceder?</p>
                    <div class="flex justify-center gap-2">
                        <button
                            class="border border-blue-500 text-blue-500 px-3 py-1 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-gray-700">
                            Soporte Técnico
                        </button>
                        <button
                            class="border border-blue-500 text-blue-500 px-3 py-1 rounded-md text-sm hover:bg-blue-50 dark:hover:bg-gray-700">
                            Manual de Usuario
                        </button>
                    </div>
                </div>

                <div class="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    © 2025 EsSalud. Todos los derechos reservados.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import LoadingOverlay from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';


import { AuthService } from '@/services/authService/authService'
import { useAuthStore } from '@/store/auth'
import { UserIcon, LockClosedIcon, EyeIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const isDark = ref(localStorage.getItem('theme') === 'dark')
const loading = ref(false)
const loaderType = ref('dots'); // Puedes cambiar a 'spinner', 'bars', 'dots', etc.


const toggleDarkMode = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

const handleLogin = async (e) => {
    e.preventDefault()
    loading.value = true

    const credentials = {
        usuario: username.value,
        password: password.value,
    }
    try {
        await AuthService.login(credentials)

        const userData = await AuthService.me();

        authStore.login(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userData.token)
        localStorage.setItem('perfil', userData.datosPerfil.perfil)
        await router.push('/')

    Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        text: 'Bienvenido al sistema',
        timer: 3000,
        showConfirmButton: false,
    });
    } catch (err) {
        console.error('Error durante el login:', err)
                Swal.fire({
                    icon: 'error',
                    title: '¡Acceso denegado!',
                    text: 'Usuario o contraseña incorrectos',
                });
    } finally {
        loading.value = false
    }
}

</script>
