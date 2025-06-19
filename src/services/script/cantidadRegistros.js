import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  cantidadRegistrosAbiertos(token,body) {
    return axios.post(`${RUTA_API}/cantidad_registros_abiertos/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  cantidadRegistrosCerrados(token,body) {
    return axios.post(`${RUTA_API}/cantidad_registros_cerrados/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  cantidadRegistros(token,body){
    return axios.post(`${RUTA_API}/cantidad_registros/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};