<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <div class="flex-1 flex flex-col h-full relative w-full overflow-hidden">
      
      <header class="flex-none bg-white border-b border-slate-200 shadow-sm z-20 px-6 py-4">
        <div class="mb-4">
          <button @click="irAlInicio" class="flex items-center gap-2 text-slate-500 hover:text-cyan-700 font-bold text-sm transition-colors group">
            <div class="bg-slate-100 group-hover:bg-cyan-50 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
          </button>
        </div>
        <div v-if="paciente && enModal" class="mb-4 flex flex-wrap items-center gap-3 text-sm">
          <span class="font-bold text-slate-700">Paciente:</span>
          <span class="text-slate-800">{{ paciente.paciente || '—' }}</span>
          <span class="text-slate-400">|</span>
          <span class="font-bold text-slate-700">DNI:</span>
          <span class="text-slate-800">{{ paciente.documento || '—' }}</span>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6 w-full custom-scrollbar">
        <div class="max-w-7xl mx-auto space-y-6 pb-10">

          <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-base font-bold text-slate-800">Evento de Infección</h2>
              <p class="text-sm text-slate-500">¿El paciente presentó algún evento infeccioso en este periodo?</p>
            </div>
            
            <div class="flex gap-3">
               <label class="cursor-pointer">
                  <input type="radio" v-model="tieneInfeccion" :value="false" class="peer sr-only">
                  <div class="px-5 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-bold transition-all
                              peer-checked:bg-slate-700 peer-checked:text-white peer-checked:border-slate-700 peer-checked:shadow-md
                              hover:bg-slate-50 flex items-center gap-2 min-w-[100px] justify-center">
                     NO
                  </div>
               </label>

               <label class="cursor-pointer">
                  <input type="radio" v-model="tieneInfeccion" :value="true" class="peer sr-only">
                  <div class="px-5 py-2 rounded-lg border border-cyan-300 text-cyan-700 text-sm font-bold transition-all
                              peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 peer-checked:shadow-md
                              hover:bg-cyan-50 flex items-center gap-2 min-w-[120px] justify-center">
                     SÍ, Registrar
                  </div>
               </label>
            </div>
          </div>

          <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
            <div v-if="tieneInfeccion" class="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              
              <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
                <h3 class="text-white font-bold text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Eventos Infecciosos Asociados al Acceso de Diálisis
                </h3>
              </div>

              <div class="p-6 space-y-8">
                <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id" class="relative">
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="space-y-1">
                      <label class="block text-xs font-bold text-slate-500 uppercase">Fecha de Evento</label>
                      <input v-model="evento.feEvento" type="date"
                        :min="rangoFechasPeriodo.min"
                        :max="rangoFechasPeriodo.max"
                        class="w-full border border-slate-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-700 bg-white" />
                      <p v-if="rangoFechasPeriodo.min" class="text-xs text-slate-500 mt-1">Debe estar dentro del periodo seleccionado ({{ rangoFechasPeriodo.min }} a {{ rangoFechasPeriodo.max }})</p>
                    </div>

                    <div class="space-y-1 lg:col-span-3">
                       <label class="block text-xs font-bold text-slate-500 uppercase">Tipo de Infección</label>
                       <select v-model="evento.tpInfeccion" @change="resetearHemocultivo(index)" 
                         class="w-full border border-slate-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 text-slate-700">
                         <option value="">Seleccione...</option>
                         <option value="Bacteremia">Bacteremia</option>
                         <option value="Local">Local</option>
                         <option value="Fungemia">Fungemia</option>
                       </select>
                    </div>

                    <div class="lg:col-span-4 bg-slate-50 rounded-lg p-4 flex flex-wrap gap-x-12 gap-y-4 border border-slate-100">
                       
                       <div class="flex items-center gap-3">
                         <span class="text-sm font-semibold text-slate-700">Trat. Antimicrobial IV</span>
                         <button @click="evento.tratamientoIV = !evento.tratamientoIV"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.tratamientoIV ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.tratamientoIV ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-xs font-bold uppercase" :class="evento.tratamientoIV ? 'text-cyan-700' : 'text-slate-400'">{{ evento.tratamientoIV ? 'SÍ' : 'NO' }}</span>
                       </div>

                       <div class="flex items-center gap-3">
                         <span class="text-sm font-semibold text-slate-700">Vancomicina IV</span>
                         <button @click="evento.vancomicinaIV = !evento.vancomicinaIV"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.vancomicinaIV ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.vancomicinaIV ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-xs font-bold uppercase" :class="evento.vancomicinaIV ? 'text-cyan-700' : 'text-slate-400'">{{ evento.vancomicinaIV ? 'SÍ' : 'NO' }}</span>
                       </div>

                       <div class="flex items-center gap-3">
                         <span class="text-sm font-semibold text-slate-700">
                           {{ evento.tpInfeccion === '2' ? 'Cultivo (+)' : 'Hemocultivo (+)' }}
                         </span>
                         <button @click="toggleHemocultivo(evento, index)"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.hemocultivoPositivo ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.hemocultivoPositivo ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-xs font-bold uppercase" :class="evento.hemocultivoPositivo ? 'text-cyan-700' : 'text-slate-400'">{{ evento.hemocultivoPositivo ? 'SÍ' : 'NO' }}</span>
                       </div>
                    </div>

                    <div v-if="evento.hemocultivoPositivo" class="lg:col-span-4 animate-fadeIn">
                       <div class="bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex items-center gap-4">
                          <label class="text-sm font-bold text-cyan-800 whitespace-nowrap">Germen Identificado:</label>
                          <select v-model="evento.tpGermen" class="w-full bg-transparent border-0 text-sm font-medium text-cyan-900 focus:ring-0 cursor-pointer">
                            <option value="">-- Seleccione --</option>
                            <option v-for="germen in getOpcionesGermenes(evento.tpInfeccion)" :key="germen.value" :value="germen.value">{{ germen.label }}</option>
                          </select>
                       </div>
                    </div>

                    <div v-if="evento.feEvento" class="lg:col-span-4">
                      <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p class="text-xs font-bold text-slate-500 uppercase mb-2">Acceso vascular vigente en la fecha del evento</p>
                        <template v-if="accesoVigenteEnFechaEvento(evento.feEvento)">
                          <p class="text-sm font-semibold text-slate-800">{{ accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso || accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso_actual || '—' }}</p>
                          <p class="text-xs text-slate-600">{{ accesoVigenteEnFechaEvento(evento.feEvento).localizacion_acceso || accesoVigenteEnFechaEvento(evento.feEvento).localizacion_acceso_actual || '—' }}</p>
                          <p class="text-xs text-slate-500 mt-1">Fecha creación: {{ accesoVigenteEnFechaEvento(evento.feEvento).fecha_creacion_acceso || accesoVigenteEnFechaEvento(evento.feEvento).fecha_creacion_acceso_actual || '—' }}</p>
                        </template>
                        <p v-else class="text-sm text-slate-400 italic">No hay registro de acceso vascular para esta fecha.</p>
                      </div>
                    </div>

                    <div class="lg:col-span-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                       <div>
                         <p class="text-sm font-bold text-slate-700">Impacto en el Acceso Vascular</p>
                         <p class="text-xs text-slate-500">¿Esta infección obligó a realizar un cambio de acceso?</p>
                       </div>
                       <div class="flex gap-3">
                          <label class="cursor-pointer">
                             <input type="radio" v-model="form.obligoCambioAcceso" :value="false" class="peer sr-only">
                             <div class="px-4 py-2 rounded-md border border-slate-300 text-slate-500 text-xs font-bold transition-all peer-checked:bg-slate-600 peer-checked:text-white peer-checked:border-slate-600 hover:bg-slate-50">
                                NO, se mantuvo
                             </div>
                          </label>
                          <label class="cursor-pointer">
                             <input type="radio" v-model="form.obligoCambioAcceso" :value="true" class="peer sr-only">
                             <div class="px-4 py-2 rounded-md border border-slate-300 text-slate-500 text-xs font-bold transition-all peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500 hover:bg-red-50">
                                SÍ, hubo cambio
                             </div>
                          </label>
                       </div>
                    </div>

                  </div>
                </div>

                <!-- Modal Acceso Vascular (al marcar SÍ hubo cambio) -->
                <div v-if="mostrarModalAccesoVascular && paciente && idPacienteAtencion" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                  <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
                      <h3 class="font-bold text-white">Registro de cambio de acceso vascular</h3>
                      <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalAccesoVascular">✕</button>
                    </div>
                    <div class="p-4 overflow-y-auto flex-1">
                      <Form2Hemodialisis
                        :paciente="paciente"
                        :periodo="periodoNumero"
                        :periodo-ipress="idPeriodoIpress"
                        :id-paciente-atencion="idPacienteAtencion"
                        @cancelar="cerrarModalAccesoVascular"
                        @guardado="onGuardadoAccesoVascular"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button @click="guardarInfeccion" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Guardar Registro
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 class="text-slate-700 font-bold text-sm uppercase tracking-wide">Historial de Infecciones del Periodo</h3>
              <span class="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{{ historialInfecciones.length }} Registros</span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-slate-600">
                <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-3 font-bold">Fecha</th>
                    <th class="px-6 py-3 font-bold">Tipo Infección</th>
                    <th class="px-6 py-3 font-bold">Germen</th>
                    <th class="px-6 py-3 font-bold text-center">Hemocultivo</th>
                    <th class="px-6 py-3 font-bold text-center">Cambio Acceso</th>
                    <th class="px-6 py-3 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="historialInfecciones.length === 0">
                    <td colspan="6" class="px-6 py-8 text-center text-slate-400 italic">No hay infecciones registradas en este periodo.</td>
                  </tr>
                  <tr v-for="(item, index) in historialInfecciones" :key="item.id_evento_acceso_vascular || index" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-800">{{ item.feEvento || item.fecha_evento }}</td>
                    <td class="px-6 py-4">
                      <span v-if="item.tpInfeccion === '1'">Bacteremia</span>
                      <span v-else-if="item.tpInfeccion === '2'">Local</span>
                      <span v-else-if="item.tpInfeccion === '4'">Fungemia</span>
                      <span v-else>{{ item.tpInfeccion || '—' }}</span>
                    </td>
                    <td class="px-6 py-4 italic text-slate-500">{{ item.germenLabel || getNombreGermen(item.tpGermen) || item.germen || '-' }}</td>
                    <td class="px-6 py-4 text-center">
                      <span v-if="item.hemocultivoPositivo || item.hemocultivo_positivo === 'SÍ'" class="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">POS (+)</span>
                      <span v-else class="text-slate-400 text-xs">NEG (-)</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                       <span v-if="item.obligoCambioAcceso" class="text-red-600 font-bold">SÍ</span>
                       <span v-else class="text-slate-400">NO</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button v-if="!item.id_evento_acceso_vascular" @click="eliminarDelHistorial(index)" class="text-red-400 hover:text-red-600 transition-colors p-1" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <span v-else class="text-slate-300 text-xs">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElConfigProvider } from 'element-plus';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue';
import es from 'element-plus/dist/locale/es.mjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const props = defineProps({
  paciente: { type: Object, default: null },
  idPacienteAtencion: { type: [Number, String], default: null }
});
const emit = defineEmits(['cancelar', 'guardado']);
const enModal = computed(() => props.idPacienteAtencion != null && props.idPacienteAtencion !== '');

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const idPeriodoIpress = ref(null);
const periodoNumero = computed(() => {
  const v = periodoGlobal?.value ?? periodoGlobal;
  if (v == null || v === '') return null;
  return Number(v);
});
const periodos = ref([]);
const rangoFechasPeriodo = computed(() => {
  const lista = Array.isArray(periodos.value) ? periodos.value : [];
  const periodoId = periodoNumero.value ?? periodoGlobal?.value ?? periodoGlobal;
  const p = lista.find(per => per.id_periodo === periodoId);
  if (!p || !p.periodo) return { min: null, max: null };
  const parts = String(p.periodo).trim().split('-');
  if (parts.length < 2) return { min: null, max: null };
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month)) return { min: null, max: null };
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return {
    min: firstDay.toISOString().split('T')[0],
    max: lastDay.toISOString().split('T')[0]
  };
});
const mostrarModalAccesoVascular = ref(false);
const unidadesPaciente = ref([]);

const router = useRouter();

const tieneInfeccion = ref(null); 
const form = reactive({ obligoCambioAcceso: false });
const historialInfecciones = ref([]); // Lista para el historial

const eventosInfecciosos = ref([
  {
    id: Date.now(),
    feEvento: '',
    tpInfeccion: '',
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tpGermen: '',
  }
]);

const opcionesGermenes = [
  { value: 'Staphylococcus aureus', label: 'Staphylococcus aureus' },
  { value: 'Staphylococcus epidermidis', label: 'Staphylococcus epidermidis' },
  { value: 'Escherichia coli', label: 'Escherichia coli' },
  { value: 'Enterobacter cloacae', label: 'Enterobacter cloacae' },
  { value: 'Pseudomonas aeruginosa', label: 'Pseudomonas aeruginosa' },
  { value: 'Klebsiella oxytoca', label: 'Klebsiella oxytoca' },
  { value: 'Enterobacter aerogenes', label: 'Enterobacter aerogenes' },
  { value: 'Proteus mirabilis', label: 'Proteus mirabilis' },
  { value: 'Enterobacter hormaechei', label: 'Enterobacter hormaechei' },
  { value: 'Staphylococcus haemolyticus', label: 'Staphylococcus haemolyticus' },
  { value: 'Staphylococcus especies', label: 'Staphylococcus especies' },
  { value: 'Stenotrophomona maltophilia', label: 'Stenotrophomona maltophilia' },
  { value: 'Acinetobacter baumannii', label: 'Acinetobacter baumannii' },
  { value: 'Hongos', label: 'Hongos' }
];

const getOpcionesGermenes = (tipoInfeccion) => {
  if (tipoInfeccion === '4' || tipoInfeccion === 'Fungemia') return opcionesGermenes.filter(g => g.value === '14');
  return opcionesGermenes.filter(g => g.value !== '14');
};

const getNombreGermen = (valor) => {
  const g = opcionesGermenes.find(op => op.value === valor);
  return g ? g.label : '';
};


async function fetchUnidadesActualesPaciente() {
  const idPaciente = props.paciente?.id_paciente;
  if (!idPaciente) {
    unidadesPaciente.value = [];
    return;
  }
  try {
    const res = await getAllIpress('/unidadesActuales/?id_paciente=' + idPaciente);
    unidadesPaciente.value = Array.isArray(res) ? res : (res?.results || []);
  } catch (e) {
    unidadesPaciente.value = [];
  }
}

function accesoVigenteEnFechaEvento(fechaEvento) {
  if (!fechaEvento || !unidadesPaciente.value.length) return null;
  const ordenados = [...unidadesPaciente.value]
    .filter(u => u.fecha_creacion_acceso || u.fecha_creacion_acceso_actual)
    .map(u => ({ ...u, fecha: u.fecha_creacion_acceso || u.fecha_creacion_acceso_actual }))
    .filter(u => u.fecha <= fechaEvento)
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  return ordenados[0] || null;
}

async function fetchPeriodos() {
  try {
    const respuesta = await getAllIpress('/periodos/');
    periodos.value = respuesta;
  } catch (error) { console.error(error); }
}

async function fetchPeriodoIpress() {
  const idPeriodo = periodoGlobal?.value ?? periodoGlobal;
  const idIpress = clinicaGlobal?.value ?? clinicaGlobal;
  if (idPeriodo == null || idIpress == null) return;
  try {
    idPeriodoIpress.value = await resolverIdPeriodoIpress(idPeriodo, idIpress);
  } catch (e) {
    idPeriodoIpress.value = null;
  }
}

async function fetchHistorialEventosApi() {
  const idPaciente = props.paciente?.id_paciente;
  if (!idPaciente || !enModal.value) return;
  try {
    const res = await getAllIpress('/eventosAccesosVasculares/?id_paciente=' + idPaciente);
    const lista = Array.isArray(res) ? res : (res?.results || []);
    historialInfecciones.value = lista.map(item => ({
      id_evento_acceso_vascular: item.id_evento_acceso_vascular,
      feEvento: item.fecha_evento,
      tpInfeccion: item.tipo_infeccion,
      tratamientoIV: item.antmicrobial === 'SÍ',
      vancomicinaIV: item.vancomicina === 'SÍ',
      hemocultivoPositivo: item.hemocultivo_positivo === 'SÍ',
      tpGermen: item.germen,
      germenLabel: item.germen,
      obligoCambioAcceso: false
    }));
  } catch (e) {
    historialInfecciones.value = [];
  }
}

function cerrarModalAccesoVascular() {
  mostrarModalAccesoVascular.value = false;
  form.obligoCambioAcceso = false;
}

function onGuardadoAccesoVascular() {
  cerrarModalAccesoVascular();
  fetchUnidadesActualesPaciente();
  emit('guardado');
}

watch(() => form.obligoCambioAcceso, async (val) => {
  if (val === true) {
    mostrarModalAccesoVascular.value = true;
  }
});

const irAlInicio = () => {
  if (enModal.value) emit('cancelar');
  else router.back();
};

const resetearHemocultivo = (index) => {
  if (eventosInfecciosos.value[index]) {
    const evento = eventosInfecciosos.value[index];
    evento.hemocultivoPositivo = false;
    evento.tpGermen = '';
  }
};

const toggleHemocultivo = (evento, index) => {
  evento.hemocultivoPositivo = !evento.hemocultivoPositivo;
  if (!evento.hemocultivoPositivo) evento.tpGermen = '';
};

const guardarInfeccion = async () => {
  try {
    const eventoActual = eventosInfecciosos.value[0];

    if (!eventoActual.feEvento || !eventoActual.tpInfeccion) {
      ElMessage.warning('Complete la fecha y el tipo de infección.');
      return;
    }
    const rango = rangoFechasPeriodo.value;
    if (rango.min && rango.max && (eventoActual.feEvento < rango.min || eventoActual.feEvento > rango.max)) {
      ElMessage.warning(`La fecha del evento debe estar dentro del periodo seleccionado (${rango.min} a ${rango.max}).`);
      return;
    }

    if (enModal.value && props.idPacienteAtencion) {
      const payload = {
        id_paciente_atencion: Number(props.idPacienteAtencion),
        tipo_infeccion: eventoActual.tpInfeccion,
        fecha_evento: eventoActual.feEvento,
        antmicrobial: eventoActual.tratamientoIV ? 'SÍ' : 'NO',
        vancomicina: eventoActual.vancomicinaIV ? 'SÍ' : 'NO',
        hemocultivo_positivo: eventoActual.hemocultivoPositivo ? 'SÍ' : 'NO',
        germen: getNombreGermen(eventoActual.tpGermen) || eventoActual.tpGermen || ''
      };
      await postAllIpress('/eventosAccesosVasculares/', payload);
      ElMessage.success('Evento infeccioso registrado.');
      await fetchHistorialEventosApi();
      emit('guardado');
      tieneInfeccion.value = false;
      eventosInfecciosos.value = [{
        id: Date.now(),
        feEvento: '',
        tpInfeccion: '',
        tratamientoIV: false,
        vancomicinaIV: false,
        hemocultivoPositivo: false,
        tpGermen: ''
      }];
      form.obligoCambioAcceso = false;
      return;
    }

    historialInfecciones.value.push({
      ...eventoActual,
      obligoCambioAcceso: form.obligoCambioAcceso
    });
    ElMessage.success('Infección registrada en el historial.');
    tieneInfeccion.value = false;
    eventosInfecciosos.value = [{
      id: Date.now(),
      feEvento: '',
      tpInfeccion: '',
      tratamientoIV: false,
      vancomicinaIV: false,
      hemocultivoPositivo: false,
      tpGermen: ''
    }];
    form.obligoCambioAcceso = false;
    if (form.obligoCambioAcceso === true) {
      ElMessage.info('Redirigiendo al formulario de Acceso...');
      router.push('/Form3Hemodialisis');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('Error al guardar');
  }
};

const eliminarDelHistorial = (index) => {
  historialInfecciones.value.splice(index, 1);
  ElMessage.success('Registro eliminado del historial.');
};

// ... Fetch functions (fetchPeriodos, fetchClinicas) se mantienen igual ...
// Solo asegúrate de llamarlas en onMounted

onMounted(() => {
  fetchPeriodos();
  if (enModal.value && props.paciente?.id_paciente) {
    fetchUnidadesActualesPaciente();
    fetchHistorialEventosApi();
    fetchPeriodoIpress();
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>