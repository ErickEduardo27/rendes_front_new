import axios from 'axios';
import { obtenerToken } from '../authService/authService';
const USUARIO = process.env.VUE_APP_USERNAME;
const PASSWORD = process.env.VUE_APP_PASSWORD;
const RUTA_API = process.env.VUE_APP_API;

export const periodoIpress = async (body) => {
  const token = await obtenerToken();
  try {
    const response = await axios.post(`${RUTA_API}/consulta_periodo_ipress/`,body, {headers: { Authorization:"Bearer " + token }});
    return response.data.length!==0?response.data[0].i:null;
  } catch (error) {
    console.error("Error al obtener el servicio:", error);
    throw error;
  }
};