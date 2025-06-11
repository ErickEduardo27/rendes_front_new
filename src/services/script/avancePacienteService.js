import axios from 'axios';
import { obtenerToken } from '../authService/authService';
const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  async postCalcularAvance(body) {
    const token = await obtenerToken();
    return axios.post(`${RUTA_API}/calcular_avance_por_paciente/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};