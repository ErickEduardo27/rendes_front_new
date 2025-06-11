import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router/index'; // Asegúrate de importar tu router
import { obtenerToken } from '../services/authService/authService';
import consultaPeriodo from '../services/script/consultaPeriodo';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    activeRoute: '',
    drawerBar: false,
    periodoSelect: null,
    arrayPeriodos: []
  },
  mutations: {
    setActiveRoute(state, route) {
      state.activeRoute = route;
    },
    toggleDrawerBar(state) {
      state.drawerBar = !state.drawerBar;
    },
    setDrawerBar(state, value) {
      state.drawerBar = value;
    },
    setPeriodoSelect(state, periodo) {
      state.periodoSelect = periodo;
    },
     setArrayPeriodos(state, periodos) {
       state.arrayPeriodos = periodos;
     }
  },
  actions: {
    async fetchArrayPeriodos({ commit }) {
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      consultaPeriodo
        .consultaPeriodo(token, body)
        .then((res) => {
          const periodos = res.data;
          commit('setArrayPeriodos', periodos);
        })
        .catch((res) => {
          console.error('Error al obtener los periodos:', error);
        });
    },
    updateActiveRoute({ commit }, route) {
      commit('setActiveRoute', route);
    },
    toggleDrawerBar({ commit }) {
      commit('toggleDrawerBar');
    },
    setDrawerBar({ commit }, value) {
      commit('setDrawerBar', value);
    },
    setPeriodoSelect({ commit }, periodo) {
      commit('setPeriodoSelect', periodo);
    },
  },
  getters: {
    periodoSelect: state => state.periodoSelect,
    arrayPeriodos: state => state.arrayPeriodos
  }

});