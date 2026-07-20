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
    // Escucha en todas las interfaces: localhost y la IP de la red (ej. 10.0.54.88)
    host: true,
    port: 5173,
    strictPort: false,
    // Túneles ngrok (y similares) cambian el host en cada sesión
    allowedHosts: [
      '.ngrok-free.app',
      '.ngrok-free.dev',
      '.ngrok.app',
      '.ngrok.io',
    ],
    proxy: {
      // Proxy para todas las rutas de API (excepto las que son del frontend)
      '^/(api|ipress|paciente|pacientes|pacienteAtencion|usuarios|perfiles|periodos|periodoIpress|indexIpress|usuarioIpress|etiologia|pacientesDialisis|listado_pacientes_dialisis_por_ipress_periodo|unidadesActuales|morbilidadesHospitalarias|eventosAccesosVasculares|vacunaciones|resultadosClinicos|modalidades|redes|indexRedes|indexPacientes|PacienteRegistro|asignaciones|consultar-dni|reporte_resultados|resumen_registros|consulta_periodo_ipress)': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      // Reportes SQL (descarga masiva analista, etc.)
      '^/reporte_': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '^/consulta_periodo_ipress': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})