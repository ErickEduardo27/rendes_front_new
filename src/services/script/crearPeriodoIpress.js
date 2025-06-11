import axios from 'axios';
const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
    crearPeriodoIpress(token,body) {
        return axios.post(`${RUTA_API}/crear_periodo_ipress/`,body, {
        headers: { Authorization:"Bearer " + token }
        });
    }
};