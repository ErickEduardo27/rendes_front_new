import Principal from '@/layouts/principal.vue'
import Dashboard from '@/pages/admin/Dashboard.vue'
import Login from '@/pages/auth/loginForm/Login.vue'
import NotFound from '@/pages/error/NotFound.vue'
import Home from '@/pages/inicio/Home.vue'
import Ipress from '@/pages/ipress/Ipress.vue'
import Patient from '@/pages/registros/index.vue'
import { TokenService } from '@/services/api/token.service'
import { useAuthStore } from '@/store/auth'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Principal',
    component: Principal,
    meta: { requiresAuth: true },
    children: [
      {
        path: '', // Cuando accedas a "/"
        name: 'Inicio',
        component: () => import('@/pages/inicio/Home.vue')
      },
      {
        path: 'newpatient',
        name: 'Patient',
        component: () => import('@/pages/registros/index.vue')
      },
      {
        path: 'ipress',
        name: 'Ipress',
        component: () => import('@/pages/ipress/Ipress.vue'),
      },
      {
        path: 'calidad-agua',
        name: 'CalidadMicrobiologica',
        component: () => import('@/pages/calidad-agua/CalidadMicrobiologica.vue'),
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  }
]

const router = createRouter({
  history: createWebHistory('/rendes#/'),
  routes,
})


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore) // 👈 REACTIVO

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next({ name: 'Login' })
  }

  if (to.name === 'Login' && isAuthenticated.value) {
    return next({ name: 'Inicio' })
  }

  next()
})

export default router
