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
        meta: { bloqueadoSupervisor: true },
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
        meta: { bloqueadoSupervisor: true },
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/pages/usuarios/Usuarios.vue'),
        meta: { bloqueadoSupervisor: true },
      },
      {
        path: 'calidad-agua',
        name: 'CalidadMicrobiologica',
        component: () => import('@/pages/calidad-agua/CalidadMicrobiologica.vue'),
        meta: { bloqueadoSupervisor: true },
      },
      {
        path: 'movimientos',
        name: 'Movimientos',
        component: () => import('@/pages/movimientos/movimientos.vue'),
      },
      {
        path: 'inicio-trr',
        name: 'InicioTRR',
        component: () => import('@/pages/registros/inicioTrr/index.vue'),
        meta: { bloqueadoSupervisor: true },
      },
      {
        path: 'acceso-vascular',
        name: 'AccesoVascular',
        component: () => import('@/pages/registros/accesoActual/index.vue'),
        meta: { mostrarNotificarRegistros: true, bloqueadoSupervisor: true },
      },
      {
        path: 'evaluacion',
        name: 'Evaluacion',
        component: () => import('@/pages/evaluacion/EvaluacionRegistros.vue'),
        meta: { requiresAuth: true, requiresEvaluador: true },
      },
      {
        path: 'reporte-supervisor',
        name: 'ReporteSupervisor',
        component: () => import('@/pages/reporte/ReporteSupervisor.vue'),
        meta: { requiresAuth: true, requiresEvaluador: true },
      },
      {
        path: 'notificaciones',
        name: 'Notificaciones',
        component: () => import('@/pages/notificaciones/Notificaciones.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'eventos-infecciosos',
        name: 'EventosInfecciosos',
        component: () => import('@/pages/registros/eventosInfecciosos/index.vue'),
        meta: { mostrarNotificarRegistros: true, bloqueadoSupervisor: true },
      },
      {
        path: 'morbilidad-hospitalaria',
        name: 'MorbilidadHospitalaria',
        component: () => import('@/pages/registros/morbilidadHospitalaria/index.vue'),
        meta: { mostrarNotificarRegistros: true, bloqueadoSupervisor: true },
      },
      {
        path: 'resultados-clinicos',
        name: 'ResultadosClinicos',
        component: () => import('@/pages/registros/resultadosClinicos/index.vue'),
        meta: { mostrarNotificarRegistros: true, bloqueadoSupervisor: true },
      },
      {
        path: 'vacunacion',
        name: 'Vacunacion',
        component: () => import('@/pages/registros/vacunacion/index.vue'),
        meta: { mostrarNotificarRegistros: true, bloqueadoSupervisor: true },
      },
      {
        path: 'descarga-datos-analista',
        name: 'DescargaMasivaAnalista',
        component: () => import('@/pages/analista/DescargaMasivaDatos.vue'),
        meta: { requiresAnalista: true },
      },
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


function perfilEsEvaluador(user) {
  const p = user?.datosPerfil?.perfil || (typeof localStorage !== 'undefined' ? localStorage.getItem('perfil') : '') || ''
  return ['supervisor', 'admin'].includes(String(p).trim().toLowerCase())
}

function perfilEsAnalista(user) {
  const p = user?.datosPerfil?.perfil || (typeof localStorage !== 'undefined' ? localStorage.getItem('perfil') : '') || ''
  return String(p).trim().toLowerCase().includes('analista')
}

function perfilEsSupervisor(user) {
  const p = user?.datosPerfil?.perfil || (typeof localStorage !== 'undefined' ? localStorage.getItem('perfil') : '') || ''
  return String(p).trim().toLowerCase().includes('supervisor')
}

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore) // 👈 REACTIVO

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next({ name: 'Login' })
  }

  if (to.meta.requiresEvaluador && !perfilEsEvaluador(authStore.user)) {
    return next({ name: 'Inicio' })
  }

  if (to.meta.requiresAnalista && !perfilEsAnalista(authStore.user)) {
    return next({ name: 'Inicio' })
  }

  if (to.matched.some((r) => r.meta?.bloqueadoSupervisor) && perfilEsSupervisor(authStore.user)) {
    return next({ name: 'Inicio' })
  }

  if (to.name === 'Login' && isAuthenticated.value) {
    return next({ name: 'Inicio' })
  }

  next()
})

export default router
