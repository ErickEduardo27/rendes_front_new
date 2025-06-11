import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  getTipoPacientes(token) {
    return axios.get(`${RUTA_API}/tipoPacientes/`, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  postTipoPacientes(token,body) {
    return axios.post(`${RUTA_API}/tipoPacientes/`,{body}, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};