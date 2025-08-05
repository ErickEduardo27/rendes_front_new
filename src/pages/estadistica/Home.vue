<template>
  <div class="p-6 space-y-6">
    <!-- Filtros superiores -->
    <div class="flex flex-wrap items-center gap-4">
      <label>Mes de Reporte:</label>
      <select v-model="filtros.mes" class="border px-2 py-1 rounded">
        <option v-for="mes in meses" :key="mes" :value="mes">{{ mes }}</option>
      </select>

      <select v-model="filtros.anio" class="border px-2 py-1 rounded">
        <option v-for="anio in anios" :key="anio" :value="anio">{{ anio }}</option>
      </select>

      <label>Clínica</label>
      <select v-model="filtros.clinica" class="border px-2 py-1 rounded">
        <option v-for="clinica in clinicas" :key="clinica" :value="clinica">{{ clinica }}</option>
      </select>

      <label>Modalidad de Diálisis</label>
      <select v-model="filtros.modalidad" class="border px-2 py-1 rounded">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Diálisis Peritoneal</option>
      </select>

      <label>Reporte</label>
      <select v-model="filtros.reporte" class="border px-2 py-1 rounded">
        <option v-for="reporte in reportes" :key="reporte" :value="reporte">{{ reporte }}</option>
      </select>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-3 gap-6">
      <!-- Pacientes atendidos -->
      <div class="bg-green-200 p-4 rounded">
        <h2 class="text-2xl font-bold">{{ resumen.totalPacientes }}</h2>
        <p>{{ resumen.descripcion }}</p>
        <p class="mt-2 text-sm bg-green-100 p-2 rounded">{{ resumen.cvcMensaje }}</p>
        <div class="grid grid-cols-4 gap-2 mt-4 text-center">
          <div v-for="(valor, tipo) in resumen.tipoAcceso" :key="tipo">
            <div class="font-semibold">{{ tipo }}</div>
            <div class="text-sm">{{ valor }}</div>
          </div>
        </div>
      </div>

      <!-- Vacunación -->
      <div class="bg-blue-100 p-4 rounded space-y-2">
        <p>{{ resumen.vhb }}</p>
        <p>{{ resumen.covid }}</p>
        <p>{{ resumen.influenza }}</p>
        <p>{{ resumen.neumococo }}</p>
      </div>

      <!-- Serología y resultados clínicos -->
      <div class="space-y-4">
        <div class="bg-yellow-100 p-4 rounded">
          <p>{{ resumen.serologia }}</p>
          <div class="grid grid-cols-3 gap-4 mt-2 text-center">
            <div v-for="campo in ['VHB', 'VHC', 'VIH']" :key="campo">
              <div class="font-semibold">{{ campo }}</div>
              <div class="text-sm">{{ resumen[campo.toLowerCase()] || '-' }}</div>
            </div>
          </div>
        </div>
        <div class="bg-orange-100 p-4 rounded">
          <p class="font-semibold">Resultados Clínicos:</p>
          <div class="grid grid-cols-2 gap-4 mt-2 text-center">
            <div>
              <div>Hb</div>
              <div class="text-sm">{{ resumen.hbRegistrado }}</div>
            </div>
            <div>
              <div>Kt/V</div>
              <div class="text-sm">{{ resumen.ktvRegistrado }}</div>
            </div>
          </div>
          <p class="text-sm mt-2 text-red-600">{{ resumen.alertaHb }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO'];
const anios = [2024, 2025];
const clinicas = ['DA VIDA SAC.', 'SANAR SAC.', 'SALUD RENAL'];
const reportes = ['DA VIDA SAC', 'SANAR SAC'];

const filtros = ref({
  mes: 'JULIO',
  anio: 2025,
  clinica: 'DA VIDA SAC.',
  modalidad: '',
  reporte: 'DA VIDA SAC'
});

const resumen = ref({
  totalPacientes: 92,
  descripcion: '92 pacientes son atendidos en la IPRESS Clínica DA VIDA SAC, de los cuales 36 son mujeres (39%) y 56 varones (61%), así también 42 pacientes tienen 60 años o más (46%).',
  cvcMensaje: '11 pacientes tienen implantado un CVC/T como acceso actual (12%), recuerde que este tipo de acceso es de temporalidad corta y requiere cambiar a un acceso vascular definitivo.',
  tipoAcceso: {
    FAV: 20,
    Autoinjerto: 5,
    Injerto: 1,
    CVCP: 25,
    CVCT: 11,
    'No registrado': 30
  },
  vhb: '82 pacientes cuentan con Esquema completo de vacuna contra VHB (89%), sin embargo 0 no han sido vacunados (0%)',
  covid: '9 pacientes cuentan con Dosis de Refuerzo contra COVID-19 (10%), sin embargo 0 no han sido vacunados (0%)',
  influenza: '1 pacientes se encuentran inmunizados contra influenza (1%), sin embargo 91 no han sido vacunados (99%).',
  neumococo: '54 pacientes se encuentran inmunizados contra Neumococo (59%), sin embargo 38 no han sido vacunados',
  serologia: '0 pacientes tienen VHB (0%), 0 pacientes tienen VHC (0%) o pacientes VIH (0%)',
  vhb: 'No Registrado',
  vhc: 'No Registrado',
  vih: 'No Registrado',
  hbRegistrado: 'Registrado / No Registrado',
  ktvRegistrado: 'Registrado / No Registrado',
  alertaHb: '0 pacientes tienen Hemoglobina (Hb) menor a 10 g/dL (0%). 11 pacientes tienen Kt/V menor a 1.3 (15%).'
});
</script>

<style scoped>
/* Puedes personalizar colores y tipografías aquí si lo deseas */
</style>
