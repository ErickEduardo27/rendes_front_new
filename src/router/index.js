import Dashboard from '@/pages/admin/Dashboard.vue'
import NotFound from '@/pages/error/NotFound.vue'
import Home from '@/pages/Home.vue'
import Ipress from '@/pages/ipress/Ipress.vue'
import Patient from '@/pages/patient/Patient.vue'
import { createRouter, createWebHistory } from 'vue-router'
/* import publicRoutes from '@/routes/public'
import authRoutes from '@/routes/auth'
import dashboardRoutes from '@/routes/dashboard' */

const routes = [
  /* ...publicRoutes,
  ...authRoutes,
  ...dashboardRoutes, */
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/newpatient',
      name: 'Patient',
      component: Patient,
    },
    {
      path: '/ipress',
      name: 'Ipress',
      component: Ipress,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
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
