import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/login/Home.vue')
  },
  {
    path: '/go',
    name: 'Go',
    component: () => import('../views/modulos/menuLayout.vue'),
    children: [
      {
        path: 'inicio',
        name: 'Inicio',
        component: () => import('../views/modulos/inicio/index.vue')
      },
      {
        path: 'registros',
        name: 'Registros',
        component: () => import('../views/modulos/formularios/menuFormulario.vue')
      },
      {
        path: 'pacientes',
        name: 'Pacientes',
        component: () => import('../views/modulos/gestion/pacientes/index.vue')
      },
      {
        path: 'ipress',
        name: 'Ipress',
        component: () => import('../views/modulos/gestion/ipress/index.vue')
      },
      {
        path: 'asignacion',
        name: 'Asignacion',
        component: () => import('../views/modulos/gestion/asignacion/index.vue')
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: () => import('../views/modulos/gestion/usuarios/index.vue')
      },
      {
        path: 'perfiles',
        name: 'Perfiles',
        component: () => import('../views/modulos/gestion/perfiles/index.vue')
      },
      {
        path: 'carga-masiva-pacientes',
        name: 'CargaMasivaPacientes',
        component: () => import('../views/modulos/gestion/carga_masiva_pacientes/index.vue')
      },
      {
        path: 'abrir-mes',
        name: 'AbrirMes',
        component: () => import('../views/modulos/gestion_clinica/abrir_mes/index.vue')
      },
      {
        path: 'cerrar-mes',
        name: 'CerrarMes',
        component: () => import('../views/modulos/gestion_clinica/cerrar_mes/index.vue')
      },
      {
        path: 'pre-carga',
        name: 'PreCarga',
        component: () => import('../views/modulos/gestion_clinica/pre_carga/index.vue')
      },
      {
        path: 'estadistica',
        name: 'Estadistica',
        component: () => import('../views/modulos/estadisticas/index.vue')
      },
    ],
  },
]
const router = new VueRouter({
  /* mode: 'history', */
  /* base: '', */
  routes
});

router.afterEach((to) => {
  store.dispatch('updateActiveRoute', to.fullPath);
});

export default router
