import axios from 'axios';
const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  consultaPeriodoActualizacion(token,body) {
    return axios.post(`${RUTA_API}/consulta_periodo_actualizacion/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  consultaPeriodoActivo(token,body) {
    return axios.post(`${RUTA_API}/consulta_periodo_activo/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  consultaPeriodoInactivo(token,body) {
    return axios.post(`${RUTA_API}/consulta_periodo_inactivo/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  consultaPeriodo(token,body) {
    return axios.post(`${RUTA_API}/consulta_periodo/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  consultaPeriodoEstado(token,body) {
    return axios.post(`${RUTA_API}/consulta_periodo_estado/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};