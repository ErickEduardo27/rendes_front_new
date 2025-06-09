export default [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/Login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/Register.vue'),
      },
    ],
  },
]
