<template>
  <div class="p-6 space-y-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
    <!-- Filtros superiores -->
    <!-- <div class="flex flex-wrap items-center gap-4 bg-white/80 p-4 rounded-lg shadow mb-4">
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600">Mes de Reporte</label>
        <select v-model="filtros.mes" class="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-200">
          <option v-for="mes in meses" :key="mes" :value="mes">{{ mes }}</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600">Año</label>
        <select v-model="filtros.anio" class="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-200">
          <option v-for="anio in anios" :key="anio" :value="anio">{{ anio }}</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label class="text-xs font-semibold text-gray-600">Clínica</label>
        <select v-model="filtros.clinica" class="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-200">
          <option v-for="clinica in clinicas" :key="clinica" :value="clinica">{{ clinica }}</option>
        </select>
      </div>
    </div> -->
     <div class="flex items-center gap-4 mb-4 flex-wrap">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" @change="searchPeriodoIpress">
        <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">{{ periodo.periodo }}
        </option>
      </select>
      <div class="d-flex align-items-center">
        <label>Clínica</label>
        <el-autocomplete v-model="clinicaSeleccionada" :fetch-suggestions="querySearch" clearable
          placeholder="Ingrese algo" @select="handleSelect" :value-key="'ipress'" style="margin: 0 1rem;width: 400px;"/>
      </div>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Pacientes atendidos -->
      <div class="bg-gradient-to-br from-green-200 to-green-50 p-6 rounded-xl shadow-lg flex flex-col gap-2 relative overflow-hidden">
        <div class="absolute right-4 top-4 text-green-400 text-4xl opacity-20">👩‍⚕️</div>
        <h2 class="text-4xl font-extrabold text-green-700 flex items-center gap-2">
          {{ resumen.totalPacientes }}
          <span class="text-base font-normal text-green-900 bg-white/70 px-2 py-0.5 rounded-full shadow">Pacientes</span>
        </h2>
        <p class="text-gray-700 mt-2">{{ resumen.descripcion }}</p>
        <div class="mt-2 text-xs bg-green-100/80 p-2 rounded flex items-center gap-2">
          <span class="text-green-600 text-lg">⚠️</span> {{ resumen.cvcMensaje }}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4 text-center">
          <div v-for="(valor, tipo) in resumen.tipoAcceso" :key="tipo" class="bg-white/80 rounded p-2 shadow text-green-800">
            <div class="font-semibold text-xs uppercase tracking-wide">{{ tipo }}</div>
            <div class="text-lg font-bold">{{ valor }}</div>
          </div>
        </div>
      </div>

      <!-- Vacunación -->
      <div class="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl shadow-lg flex flex-col gap-2 relative overflow-hidden">
        <div class="absolute right-4 top-4 text-blue-400 text-4xl opacity-20">💉</div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2"><span class="text-blue-600">🦠</span> <span>{{ resumen.vhb }}</span></div>
          <div class="flex items-center gap-2"><span class="text-blue-600">💉</span> <span>{{ resumen.covid }}</span></div>
          <div class="flex items-center gap-2"><span class="text-blue-600">🌡️</span> <span>{{ resumen.influenza }}</span></div>
          <div class="flex items-center gap-2"><span class="text-blue-600">🫁</span> <span>{{ resumen.neumococo }}</span></div>
        </div>
      </div>

      <!-- Serología y resultados clínicos -->
      <div class="space-y-4">
        <div class="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl shadow-lg">
          <div class="flex items-center gap-2 mb-2"><span class="text-yellow-500 text-lg">🧪</span> <span class="font-semibold">Serología</span></div>
          <p class="text-gray-700">{{ resumen.serologia }}</p>
          <div class="grid grid-cols-3 gap-4 mt-2 text-center">
            <div v-for="campo in ['VHB', 'VHC', 'VIH']" :key="campo" class="bg-white/80 rounded p-2 shadow text-yellow-800">
              <div class="font-semibold">{{ campo }}</div>
              <div class="text-sm">{{ resumen[campo.toLowerCase()] || '-' }}</div>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-br from-orange-100 to-orange-50 p-6 rounded-xl shadow-lg">
          <div class="flex items-center gap-2 mb-2"><span class="text-orange-500 text-lg">📊</span> <span class="font-semibold">Resultados Clínicos</span></div>
          <div class="grid grid-cols-2 gap-4 mt-2 text-center">
            <div class="bg-white/80 rounded p-2 shadow text-orange-800">
              <div>Hb</div>
              <div class="text-sm font-bold">{{ resumen.hbRegistrado }}</div>
            </div>
            <div class="bg-white/80 rounded p-2 shadow text-orange-800">
              <div>Kt/V</div>
              <div class="text-sm font-bold">{{ resumen.ktvRegistrado }}</div>
            </div>
          </div>
          <p class="text-xs mt-2 text-red-600 flex items-center gap-1"><span>⚠️</span>{{ resumen.alertaHb }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAllIpress } from '@/services/ipress/Ipress.service';
import { onMounted, ref } from 'vue';
const periodoSeleccionado = ref(94)
const idClinicaSeleccionada = ref(62877)
const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO'];
const anios = [2024, 2025];
const clinicas = ['DA VIDA SAC.', 'SANAR SAC.', 'SALUD RENAL'];
const reportes = ['DA VIDA SAC', 'SANAR SAC'];
const ipress = ref([])
const periodoIpress = ref([])
const periodos = ref([])
const idPerido = ref(94)
const idIpress = ref(62877)
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL')
const filtros = ref({
  mes: 'JULIO',
  anio: 2025,
  clinica: 'DA VIDA SAC.',
  modalidad: '',
  reporte: 'DA VIDA SAC'
});

const resumen = ref({
  totalPacientes: 92,
  descripcion: '92 pacientes son atendidos en Centro Nacional de Salud Renal, de los cuales 36 son mujeres (39%) y 56 varones (61%), así también 42 pacientes tienen 60 años o más (46%).',
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

const fetchPeriodoIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodoIpress/");
    periodoIpress.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const handleSelect = (item) => {
  idClinicaSeleccionada.value = item.id_ipress; // ID u otros datos
  searchPeriodoIpress();
};
const querySearch = (queryString, cb) => {
  const results = queryString
    ? ipress.value.filter(r =>
      r.ipress?.toLowerCase().includes(queryString.toLowerCase())
    )
    : ipress.value;
  cb(results);
};
const fetchReporte = async () => {
  try {
    const respuesta = await getAllIpress("/reporte_resultados/");
    /* periodos.value = respuesta; */

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchIpress = async (url = null) => {
  try {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario.id_usuario) {
      ipress.value = [];
      return;
    }
    // Obtener asignaciones del usuario
    const asignaciones = await getAllIpress(`/asignaciones/?usuario=${usuario.id_usuario}`);
    const idsAsignados = asignaciones.map(a => a.ipress);
    // Obtener solo las IPRESS asignadas
    const todasIpress = await getAllIpress(url ?? "/ipress/");
    ipress.value = todasIpress.filter(i => idsAsignados.includes(i.id_ipress));
  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
    ipress.value = [];
  }
};
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
onMounted(() => {
  fetchPeriodoIpress();
  fetchIpress();
  fetchPeriodo();
  fetchReporte();
});
</script>

<style scoped>
/* Personalización visual para el dashboard */
.shadow-lg {
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04);
}
.rounded-xl {
  border-radius: 1rem;
}
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientMove 6s ease-in-out infinite;
}
@keyframes gradientMove {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}
.font-extrabold {
  font-weight: 800;
}
.font-semibold {
  font-weight: 600;
}
.font-bold {
  font-weight: 700;
}
.text-4xl {
  font-size: 2.25rem;
}
.text-green-700 {
  color: #15803d;
}
.text-green-900 {
  color: #14532d;
}
.text-green-600 {
  color: #16a34a;
}
.text-blue-600 {
  color: #2563eb;
}
.text-blue-400 {
  color: #60a5fa;
}
.text-yellow-500 {
  color: #eab308;
}
.text-yellow-800 {
  color: #854d0e;
}
.text-orange-500 {
  color: #f97316;
}
.text-orange-800 {
  color: #9a3412;
}
.bg-white\/80 {
  background: rgba(255,255,255,0.8);
}
.bg-green-100\/80 {
  background: rgba(220,252,231,0.8);
}
.min-h-screen {
  min-height: 100vh;
}
.tracking-wide {
  letter-spacing: 0.05em;
}
.uppercase {
  text-transform: uppercase;
}
.text-xs {
  font-size: 0.75rem;
}
.text-base {
  font-size: 1rem;
}
.text-lg {
  font-size: 1.125rem;
}
.text-sm {
  font-size: 0.875rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-4 {
  padding: 1rem;
}
.rounded {
  border-radius: 0.5rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-8 {
  gap: 2rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-8 {
  margin-top: 2rem;
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}
.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 2rem;
}
</style>
