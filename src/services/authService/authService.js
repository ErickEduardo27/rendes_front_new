import axios from 'axios';
const USUARIO = process.env.VUE_APP_USERNAME;
const PASSWORD = process.env.VUE_APP_PASSWORD;
const RUTA_API = process.env.VUE_APP_API;

export const obtenerToken = async () => {
  try {
    const response = await axios.post(`${RUTA_API}/api/token/`, {
      username: USUARIO,
      password: PASSWORD,
    });
    return response.data.access; // Devuelve el token de acceso
  } catch (error) {
    console.error("Error al obtener el token:", error);
    throw error;
  }
};