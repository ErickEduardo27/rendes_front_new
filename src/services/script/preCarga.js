import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  preCarga(token,body) {
    return axios.post(`${RUTA_API}/pre_carga/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  consultaPreCarga(token,body) {
    return axios.post(`${RUTA_API}/consulta_precarga/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};