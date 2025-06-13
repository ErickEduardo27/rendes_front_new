import Principal from '@/layouts/principal.vue'
import Dashboard from '@/pages/admin/Dashboard.vue'
import Login from '@/pages/auth/loginForm/Login.vue'
import NotFound from '@/pages/error/NotFound.vue'
import Home from '@/pages/inicio/Home.vue'
import Ipress from '@/pages/ipress/Ipress.vue'
import Patient from '@/pages/registros/index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Principal',
    component: Principal,
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
        path: '/ipress',
        name: 'Ipress',
        component: () => import('@/pages/ipress/Ipress.vue'),
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
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
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }
  next()
})

export default router
