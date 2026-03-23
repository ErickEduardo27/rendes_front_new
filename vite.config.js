import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/rendes#/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Proxy para todas las rutas de API (excepto las que son del frontend)
      '^/(api|ipress|paciente|pacientes|usuarios|perfiles|periodos|periodoIpress|indexIpress|usuarioIpress|etiologia|pacientesDialisis|listado_pacientes_dialisis_por_ipress_periodo|unidadesActuales|morbilidadesHospitalarias|eventosAccesosVasculares|vacunaciones|resultadosClinicos|redes|indexRedes|indexPacientes|PacienteRegistro|asignaciones|consultar-dni|reporte_resultados|resumen_registros)': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})