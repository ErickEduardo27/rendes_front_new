<template>
  <div class="pb-10 bg-gray-50/50 min-h-screen">
    
    <div class="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <FiltroSuperior
        v-model:periodo="periodoSeleccionado"
        v-model:clinica="idClinicaSeleccionada"
        v-model:modalidad="modalidadSeleccionada"
        @change="handleFiltroChange"
      />
    </div>

    <div class="flex items-center gap-4 my-4">
      <button 
        @click="emitNuevoRegistro"
        class="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all duration-200 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Nuevo Registro
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      <div class="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-4 border-b border-green-200 pb-3">
          <p class="text-3xl font-black text-green-700">{{ stats.total }}</p>
          <p class="text-sm font-bold text-green-800 uppercase tracking-wide bg-green-200/50 px-3 py-1 rounded-full">Pacientes</p>
        </div>
        
        <p class="text-sm text-green-900 mb-4 leading-relaxed">
          <strong>{{ stats.total }}</strong> pacientes son atendidos en {{ clinicaSeleccionada }}, de los cuales 
          <strong>{{ stats.mujeres }}</strong> son mujeres ({{ stats.pctMujeres }}%) y 
          <strong>{{ stats.varones }}</strong> varones ({{ stats.pctVarones }}%), así también 
          <strong>{{ stats.mayores60 }}</strong> pacientes tienen 60 años o más ({{ stats.pctMayores60 }}%).
        </p>

        <div v-if="stats.cvct > 0" class="flex items-start gap-2 bg-yellow-100/80 p-3 rounded-lg border border-yellow-300 mb-4">
          <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <p class="text-[11px] text-yellow-800 font-medium leading-tight">
            {{ stats.cvct }} pacientes tienen implantado un CVC/T como acceso actual ({{ stats.pctCvct }}%), recuerde que este tipo de acceso es de temporalidad corta y requiere cambiar a un acceso vascular definitivo.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-white rounded-lg p-2 border border-green-100 shadow-sm"><p class="text-[10px] font-bold text-gray-500">FAV</p><p class="text-lg font-black text-green-700">{{ stats.fav }}</p></div>
          <div class="bg-white rounded-lg p-2 border border-green-100 shadow-sm"><p class="text-[10px] font-bold text-gray-500">AUTOINJERTO</p><p class="text-lg font-black text-green-700">{{ stats.autoinjerto }}</p></div>
          <div class="bg-white rounded-lg p-2 border border-green-100 shadow-sm"><p class="text-[10px] font-bold text-gray-500">INJERTO</p><p class="text-lg font-black text-green-700">{{ stats.injerto }}</p></div>
          <div class="bg-white rounded-lg p-2 border border-green-100 shadow-sm"><p class="text-[10px] font-bold text-gray-500">CVCP</p><p class="text-lg font-black text-green-700">{{ stats.cvcp }}</p></div>
          <div class="bg-white rounded-lg p-2 border border-green-100 shadow-sm"><p class="text-[10px] font-bold text-gray-500">CVCT</p><p class="text-lg font-black text-green-700">{{ stats.cvct }}</p></div>
          <div class="bg-white rounded-lg p-2 border border-green-100 shadow-sm"><p class="text-[10px] font-bold text-gray-500">NO REGISTRADO</p><p class="text-lg font-black text-green-700">{{ stats.no_registrado_acceso }}</p></div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-4 border-b border-blue-200 pb-3 text-blue-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          <h3 class="font-bold text-lg">Inmunización</h3>
        </div>
        
        <ul class="space-y-4 text-sm text-blue-900 leading-relaxed">
          <li class="flex gap-2">
            <span class="text-blue-500 mt-1">💊</span>
            <p><strong>{{ stats.vac_covid }}</strong> pacientes cuentan con Dosis de Refuerzo contra COVID-19 ({{ stats.pctCovid }}%), sin embargo {{ stats.no_vac_covid }} no han sido vacunados.</p>
          </li>
          <li class="flex gap-2">
            <span class="text-blue-500 mt-1">🌡️</span>
            <p><strong>{{ stats.vac_influenza }}</strong> pacientes se encuentran inmunizados contra Influenza ({{ stats.pctInfluenza }}%), sin embargo {{ stats.no_vac_influenza }} no han sido vacunados.</p>
          </li>
          <li class="flex gap-2">
            <span class="text-blue-500 mt-1">🛡️</span>
            <p><strong>{{ stats.vac_neumococo }}</strong> pacientes se encuentran inmunizados contra Neumococo ({{ stats.pctNeumococo }}%), sin embargo {{ stats.no_vac_neumococo }} no han sido vacunados.</p>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-6">
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-sm flex-1">
          <div class="flex items-center gap-2 mb-3 text-yellow-800 border-b border-yellow-200 pb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            <h3 class="font-bold">Serología</h3>
          </div>
          <p class="text-xs text-yellow-800 mb-3">
            {{ stats.vhb }} pacientes tienen VHB ({{ stats.pctVhb }}%), {{ stats.vhc }} pacientes tienen VHC ({{ stats.pctVhc }}%) o pacientes VIH ({{ stats.pctVih }}%).
          </p>
          <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold text-yellow-700">
            <div class="bg-white p-2 rounded border border-yellow-100 shadow-sm"><p>VHB</p><span class="text-yellow-500 font-normal">Registrado</span></div>
            <div class="bg-white p-2 rounded border border-yellow-100 shadow-sm"><p>VHC</p><span class="text-yellow-500 font-normal">Registrado</span></div>
            <div class="bg-white p-2 rounded border border-yellow-100 shadow-sm"><p>VIH</p><span class="text-yellow-500 font-normal">Registrado</span></div>
          </div>
        </div>

        <div class="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm flex-1">
          <div class="flex items-center gap-2 mb-3 text-orange-800 border-b border-orange-200 pb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <h3 class="font-bold">Resultados Clínicos</h3>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-center text-xs font-bold text-orange-700 mb-3">
            <div class="bg-white p-2 rounded border border-orange-100 shadow-sm"><p>Hb</p><span class="text-orange-500 font-normal">{{ stats.con_hb }} Registrados</span></div>
            <div class="bg-white p-2 rounded border border-orange-100 shadow-sm"><p>Kt/V</p><span class="text-orange-500 font-normal">{{ stats.con_ktv }} Registrados</span></div>
          </div>

          <p class="text-[11px] text-orange-800 flex items-start gap-1">
            <svg class="w-3 h-3 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            {{ stats.hb_baja }} pacientes tienen Hemoglobina (Hb) menor a 10 g/dL ({{ stats.pctHbBaja }}%). {{ stats.ktv_bajo }} pacientes tienen Kt/V menor a 1.3 ({{ stats.pctKtvBajo }}%).
          </p>
        </div>

      </div>

    </div>

    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Directorio de Pacientes:</h3>
      
      <div class="flex gap-4 mb-4">
        <input v-model="filtroNombre" placeholder="Buscar por nombre..." class="border border-gray-300 px-3 py-2 rounded-lg w-64 shadow-sm focus:ring-2 focus:ring-sky-200 focus:outline-none" />
        <input v-model="filtroDni" placeholder="Buscar por DNI..." class="border border-gray-300 px-3 py-2 rounded-lg w-48 shadow-sm focus:ring-2 focus:ring-sky-200 focus:outline-none" />
      </div>

      <div class="grid grid-cols-6 font-bold text-xs text-gray-500 uppercase tracking-wider border-b-2 pb-2 mb-3">
        <span class="col-span-3 pl-2">Nombre del Paciente</span>
        <span class="text-center">Documento</span>
        <span class="text-center">Modalidad</span>
        <span class="text-center">Estado</span>
      </div>

      <div v-if="pacientesPaginados.length === 0" class="text-center text-gray-500 py-10">
        No se encontraron pacientes para los filtros seleccionados.
      </div>

      <div v-for="paciente in pacientesPaginados" :key="paciente.paciente" class="border border-gray-100 rounded-lg mb-2 p-3 bg-gray-50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
        <div class="grid grid-cols-6 items-center">
          <div class="col-span-3 font-semibold text-gray-800 pl-2">
            {{ paciente.paciente }}
          </div>
          <div class="text-center text-sm font-mono text-gray-600">
            {{ paciente.documento || 'S/N' }}
          </div>
          <div class="text-center">
            <span class="text-xs font-bold px-2 py-1 rounded-full" :class="paciente.modalidad == 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'">
              {{ paciente.modalidad == 1 ? "HEMO" : "PERITONEAL" }}
            </span>
          </div>
          <div class="text-center text-sm font-medium text-green-600">
            {{ paciente.estado || 'ACTIVO' }}
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-6 bg-gray-100 p-2 rounded-lg border border-gray-200">
        <button class="px-4 py-1.5 rounded-md bg-white border shadow-sm hover:bg-gray-50 disabled:opacity-50 text-sm font-semibold" :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>
        <span class="text-sm font-bold text-gray-600">Página {{ paginaActual }} de {{ totalPaginas || 1 }}</span>
        <button class="px-4 py-1.5 rounded-md bg-white border shadow-sm hover:bg-gray-50 disabled:opacity-50 text-sm font-semibold" :disabled="paginaActual === totalPaginas || totalPaginas === 0" @click="paginaActual++">Siguiente</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getAllIpress } from "@/services/ipress/Ipress.service";
import FiltroSuperior from '@/components/FiltroSuperior.vue'; 

// ==========================================
// VARIABLES DE ESTADO Y FILTROS
// ==========================================
const pacientes = ref([]);
const filtroNombre = ref("");
const filtroDni = ref("");
const paginaActual = ref(1);
const pacientesPorPagina = 10; // Aumenté a 10 porque ya no hay botones gigantes

const modalidadSeleccionada = ref(null); 
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL');
const idClinicaSeleccionada = ref(62877); 
const periodoSeleccionado = ref(94); 
const idPeriodoIpress = ref(17);
const emit = defineEmits(['nuevo-registro']);

// ==========================================
// BÚSQUEDA Y FILTRADO DE LA LISTA
// ==========================================
const pacientesFiltrados = computed(() => {
  const nombre = filtroNombre.value.trim().toLowerCase();
  const dni = filtroDni.value.trim().toLowerCase();
  
  return pacientes.value.filter(p => {
    const coincideNombre = !nombre || (p.paciente && p.paciente.toLowerCase().includes(nombre));
    const coincideDni = !dni || (p.documento && p.documento.toLowerCase().includes(dni));
    let coincideModalidad = true;
    if (modalidadSeleccionada.value && modalidadSeleccionada.value !== 'todos') {
        const modNum = modalidadSeleccionada.value === 'HEMO' ? 1 : 2; 
        if (p.modalidad != modNum) coincideModalidad = false;
    }
    return coincideNombre && coincideDni && coincideModalidad;
  });
});

const totalPaginas = computed(() => Math.ceil(pacientesFiltrados.value.length / pacientesPorPagina));
const pacientesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * pacientesPorPagina;
  return pacientesFiltrados.value.slice(inicio, inicio + pacientesPorPagina);
});

watch([filtroNombre, filtroDni, modalidadSeleccionada], () => { paginaActual.value = 1; });

// ==========================================
// MOTOR DE ESTADÍSTICAS DEL MEGA DASHBOARD
// ==========================================
const stats = computed(() => {
  const lista = pacientesFiltrados.value;
  const total = lista.length;

  // Función de ayuda para calcular porcentajes sin NaN
  const getPct = (num) => total === 0 ? 0 : Math.round((num / total) * 100);

  if (total === 0) return { total: 0, mujeres: 0, varones: 0, pctMujeres: 0, pctVarones: 0, mayores60: 0, pctMayores60: 0, fav: 0, autoinjerto: 0, injerto: 0, cvcp: 0, cvct: 0, no_registrado_acceso: 0, pctCvct: 0, vac_covid: 0, no_vac_covid: 0, pctCovid: 0, vac_influenza: 0, no_vac_influenza: 0, pctInfluenza: 0, vac_neumococo: 0, no_vac_neumococo: 0, pctNeumococo: 0, vhb: 0, vhc: 0, vih: 0, pctVhb: 0, pctVhc: 0, pctVih: 0, con_hb: 0, con_ktv: 0, hb_baja: 0, pctHbBaja: 0, ktv_bajo: 0, pctKtvBajo: 0 };

  // --- 1. DEMOGRAFÍA ---
  // NOTA: Asegúrate que 'sexo' sea el nombre de la variable que viene de tu API (puede ser 'genero')
  const mujeres = lista.filter(p => p.sexo === 'F' || p.genero === 'F').length;
  const varones = total - mujeres; 
  
  // Asumiendo que la API trae 'edad'. Si trae fecha de nacimiento, habría que calcularla.
  const mayores60 = lista.filter(p => (p.edad && parseInt(p.edad) >= 60)).length;

  // --- 2. ACCESOS VASCULARES ---
  // NOTA: Asumiendo nombres de tipo de acceso. Ajusta los strings a como vengan de la BD.
  const fav = lista.filter(p => p.tipo_acceso === 'FAV' || p.tipo_acceso?.includes('FAV')).length;
  const autoinjerto = lista.filter(p => p.tipo_acceso === 'AUTOINJERTO' || p.tipo_acceso?.includes('Autólogo')).length;
  const injerto = lista.filter(p => p.tipo_acceso === 'INJERTO' || p.tipo_acceso?.includes('Protésico')).length;
  const cvcp = lista.filter(p => p.tipo_acceso === 'CVCP' || p.tipo_acceso?.includes('Larga Permanencia')).length;
  const cvct = lista.filter(p => p.tipo_acceso === 'CVCT' || p.tipo_acceso?.includes('Temporal')).length;
  const no_registrado_acceso = total - (fav + autoinjerto + injerto + cvcp + cvct);

  // --- 3. VACUNACIÓN ---
  // Aquí usamos la variable "cantidad_de_vacunaciones" o variables booleanas si tuvieras.
  // Como es un mock para mostrar el diseño, usaré números simulados sobre los que tienen vacunas registradas
  const con_vacunas = lista.filter(p => p.cantidad_de_vacunaciones > 0).length;
  const vac_covid = con_vacunas; // Simulado
  const vac_influenza = Math.floor(con_vacunas * 0.8); // Simulado
  const vac_neumococo = Math.floor(con_vacunas * 0.9); // Simulado

  // --- 4. SEROLOGÍA ---
  // Simulación: ajusta con 'p.vhb === true' etc., si lo tienes en el backend
  const vhb = lista.filter(p => p.VHB === 'POSITIVO' || p.VHB === true).length;
  const vhc = lista.filter(p => p.VHC === 'POSITIVO' || p.VHC === true).length;
  const vih = lista.filter(p => p.VIH === 'POSITIVO' || p.VIH === true).length;

  // --- 5. RESULTADOS CLÍNICOS ---
  const con_resultados = lista.filter(p => p.cantidad_de_resultados_clinicos > 0).length;
  const con_hb = con_resultados;
  const con_ktv = con_resultados;
  
  // Ejemplo de alerta: Si tuvieras los valores exactos, harías p.valor_hb < 10.
  const hb_baja = lista.filter(p => p.valor_hb && parseFloat(p.valor_hb) < 10).length;
  const ktv_bajo = lista.filter(p => p.valor_ktv && parseFloat(p.valor_ktv) < 1.3).length;

  return {
    total,
    mujeres, pctMujeres: getPct(mujeres),
    varones, pctVarones: getPct(varones),
    mayores60, pctMayores60: getPct(mayores60),
    
    fav, autoinjerto, injerto, cvcp, cvct, no_registrado_acceso, pctCvct: getPct(cvct),
    
    vac_covid, no_vac_covid: total - vac_covid, pctCovid: getPct(vac_covid),
    vac_influenza, no_vac_influenza: total - vac_influenza, pctInfluenza: getPct(vac_influenza),
    vac_neumococo, no_vac_neumococo: total - vac_neumococo, pctNeumococo: getPct(vac_neumococo),

    vhb, vhc, vih, pctVhb: getPct(vhb), pctVhc: getPct(vhc), pctVih: getPct(vih),

    con_hb, con_ktv, 
    hb_baja, pctHbBaja: getPct(hb_baja),
    ktv_bajo, pctKtvBajo: getPct(ktv_bajo)
  };
});

// ==========================================
// FUNCIONES DE API Y EVENTOS
// ==========================================
const handleFiltroChange = (evento) => {
    if (evento.tipo === 'clinica' || evento.tipo === 'periodo') {
        searchPeriodoIpress();
    }
};

const emitNuevoRegistro = () => {
  emit('nuevo-registro', {
    periodo: periodoSeleccionado.value,
    idPeriodoIpress: idPeriodoIpress.value,
    idClinica: idClinicaSeleccionada.value,
    nombreClinica: clinicaSeleccionada.value,
    modalidad: modalidadSeleccionada.value 
  });
};

const periodoIpress = ref([]);
const periodos = ref([]);

function searchPeriodoIpress() {
  const resultado = periodoIpress.value.find(
    item => item.id_ipress === idClinicaSeleccionada.value && item.periodo === periodoSeleccionado.value
  );
  if (resultado) idPeriodoIpress.value = resultado.id_periodo_ipress;
  fetchPacientes();
}

const fetchPacientes = async () => {
  try {
    const respuesta = await getAllIpress("/resumen_registros/" + idClinicaSeleccionada.value + "/" + periodoSeleccionado.value + "/");
    pacientes.value = respuesta;
  } catch (error) { console.error('Error al obtener Pacientes:', error); }
};

const fetchPeriodoIpress = async () => {
  try {
    const respuesta = await getAllIpress("/periodoIpress/");
    periodoIpress.value = respuesta;
  } catch (error) { console.error('Error al obtener Periodo IPRESS:', error); }
};

onMounted(() => {
  fetchPeriodoIpress();
  fetchPacientes();
});
</script>

<style scoped>
/* Elimina el scroll horizontal oculto si lo hubiera */
</style>