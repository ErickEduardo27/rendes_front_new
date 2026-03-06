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
        path: 'tablas',
        name: 'Tablas',
        component: () => import('@/pages/tablas/Home.vue')
      },
      {
        path: 'estadistica',
        name: 'Estadistica',
        component: () => import('@/pages/estadistica/Home.vue')
      },
      {
        path: 'ipress',
        name: 'Ipress',
        component: () => import('@/pages/ipress/Ipress.vue'),
      },
      {
        path: 'pacientes',
        name: 'pacientes',
        component: () => import('@/pages/pacientes/Pacientes.vue'),
      },
      {
        path: 'perfiles',
        name: 'perfiles',
        component: () => import('@/pages/perfiles/Perfiles.vue'),
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/pages/usuarios/Usuarios.vue'),
      },
      {
        path: 'calidad-agua',
        name: 'CalidadMicrobiologica',
        component: () => import('@/pages/calidad-agua/CalidadMicrobiologica.vue'),
      },
      {
        path: 'movimientos',
        name: 'Movimientos',
        component: () => import('@/pages/movimientos/movimientos.vue'),
      },
      {
        path: 'acceso-vascular',
        name: 'AccesoVascular',
        component: () => import('@/pages/registros/accesoActual/index.vue'),
      },
      {
        path: 'eventos-infecciosos',
        name: 'EventosInfecciosos',
        component: () => import('@/pages/registros/eventosInfecciosos/index.vue'),
      },
      {
        path: 'morbilidad-hospitalaria',
        name: 'MorbilidadHospitalaria',
        component: () => import('@/pages/registros/morbilidadHospitalaria/index.vue'),
      },
      {
        path: 'resultados-clinicos',
        name: 'ResultadosClinicos',
        component: () => import('@/pages/registros/resultadosClinicos/index.vue'),
      },
      {
        path: 'vacunacion',
        name: 'Vacunacion',
        component: () => import('@/pages/registros/vacunacion/index.vue'),
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
