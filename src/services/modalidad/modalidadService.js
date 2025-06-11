import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  getModalidades(token) {
    return axios.get(`${RUTA_API}/modalidades/`, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  postModalidades(token,body) {
    return axios.post(`${RUTA_API}/modalidades/`,{body}, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};