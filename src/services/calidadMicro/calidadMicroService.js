import axios from 'axios';
const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  get(token,body) {
    return axios.get(`${RUTA_API}/calidadMicrobiologicas/?id_usuario_ipress=${body.id_usuario_ipress}&id_periodo_ipress=${body.id_periodo_ipress}&id_paciente=${body.id_paciente}`, {
      headers: { Authorization:"Bearer " + token }
    });
  },
};