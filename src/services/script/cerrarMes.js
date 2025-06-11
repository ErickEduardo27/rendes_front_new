import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  cerrarMes(token,body) {
    return axios.post(`${RUTA_API}/cerrar_mes/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};