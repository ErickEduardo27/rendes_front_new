export default [
    {
        path: '/dashboard',
        component: () => import('@/layouts/DefaultLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'DashboardHome',
                component: () => import('@/views/Dashboard.vue'),
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/Profile.vue'),
            },
        ],
    },
]
