import axios from 'axios';

const RUTA_API = process.env.VUE_APP_API; // Asegúrate de reemplazar esto con tu URL real de la API

export default {
  reporteInicio(token,body) {
    return axios.post(`${RUTA_API}/reporte_inicio/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reportePacientesDialisis(token,body){
    return axios.post(`${RUTA_API}/reporte_pacientes_dialisis/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reporteUnidadesActuales(token,body){
    return axios.post(`${RUTA_API}/reporte_unidades_actuales/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reporteEventosAsociados(token,body){
    return axios.post(`${RUTA_API}/reporte_eventos_accesos_vasculares/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reporteMorbilidadHospitalaria(token,body){
    return axios.post(`${RUTA_API}/reporte_morbilidades_hospitalarias/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reporteResultadosClinicos(token,body){
    return axios.post(`${RUTA_API}/reporte_resultados_clinicos/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reporteCalidadMicrobiologica(token,body){
    return axios.post(`${RUTA_API}/reporte_calidad_microbiologicas/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  },
  reporteVacunaciones(token,body){
    return axios.post(`${RUTA_API}/reporte_vacunaciones/`,body, {
      headers: { Authorization:"Bearer " + token }
    });
  }
};