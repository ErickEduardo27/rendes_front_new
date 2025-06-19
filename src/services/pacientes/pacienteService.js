import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  getPacientes(token) {
    return axios.get(`${RUTA_API}/paciente/`, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  postPacientes(token,body) {
    return axios.post(`${RUTA_API}/paciente/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};