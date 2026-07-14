<template>
  <div :class="enModal ? 'form3-shell bg-slate-50' : 'flex h-screen bg-slate-50 overflow-hidden'">
    <div :class="enModal ? 'w-full' : 'flex-1 flex flex-col h-full relative w-full overflow-hidden'">
      
      <header v-if="!enModal" class="flex-none bg-white border-b border-slate-200 shadow-sm z-20 px-4 py-3">
        <button @click="irAlInicio" class="flex items-center gap-2 text-slate-500 hover:text-cyan-700 font-bold text-xs transition-colors group">
          <div class="bg-slate-100 group-hover:bg-cyan-50 p-1 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
        </button>
      </header>

      <main :class="enModal ? 'p-3 w-full' : 'flex-1 overflow-y-auto p-4 w-full custom-scrollbar'">
        <div :class="enModal ? 'space-y-3' : 'max-w-7xl mx-auto space-y-4 pb-8'">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
            <div>
              <label class="form3-meta-label">Periodo de reporte</label>
              <div class="form3-info-box">{{ periodoDisplay }}</div>
            </div>
            <div>
              <label class="form3-meta-label">Clínica (IPRESS)</label>
              <div class="form3-info-box">{{ clinicaDisplay }}</div>
            </div>
            <div>
              <label class="form3-meta-label">Modalidad de diálisis</label>
              <div class="form3-info-box">{{ modalidadDisplay }}</div>
            </div>
          </div>

          <div v-if="paciente && enModal" class="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <span class="font-semibold text-slate-700">Paciente:</span>
            <span>{{ paciente.paciente || '—' }}</span>
            <span class="text-slate-300">|</span>
            <span class="font-semibold text-slate-700">DNI:</span>
            <span>{{ paciente.documento || '—' }}</span>
          </div>

          <div v-if="!iniciarConInfeccion" class="bg-white border border-slate-200 rounded-lg shadow-sm p-3 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-bold text-slate-800">Evento de Infección</h2>
              <p class="text-xs text-slate-500">¿El paciente presentó algún evento infeccioso en este periodo?</p>
            </div>
            
            <div class="flex gap-2">
               <label class="cursor-pointer">
                  <input type="radio" v-model="tieneInfeccion" :value="false" class="peer sr-only">
                  <div class="form3-radio-btn form3-radio-btn--no">NO</div>
               </label>

               <label class="cursor-pointer">
                  <input type="radio" v-model="tieneInfeccion" :value="true" class="peer sr-only">
                  <div class="form3-radio-btn form3-radio-btn--si">SÍ, Registrar</div>
               </label>
            </div>
          </div>

          <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
            <div v-if="tieneInfeccion || iniciarConInfeccion" class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              
              <div class="bg-cyan-600 px-4 py-2.5 flex justify-between items-center">
                <h3 class="text-white font-bold text-sm flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Eventos infecciosos asociados al acceso de diálisis
                </h3>
              </div>

              <div class="p-3 space-y-4">
                <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id" class="relative">
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div class="space-y-0.5">
                      <label class="form3-label">Fecha de evento</label>
                      <input v-model="evento.feEvento" type="date"
                        :min="minFechaEventoInfeccion(evento.feEvento)"
                        :max="rangoFechasPeriodo.max"
                        class="form3-control"
                        @change="onCambioFechaEvento(index)" />
                      <p v-if="rangoFechasPeriodo.min" class="form3-hint">Dentro del periodo ({{ rangoFechasPeriodo.min }} a {{ rangoFechasPeriodo.max }})</p>
                      <p v-if="hintFechaEventoFistula(evento.feEvento)" class="form3-hint text-cyan-800">{{ hintFechaEventoFistula(evento.feEvento) }}</p>
                    </div>

                    <div v-if="evento.feEvento" class="lg:col-span-3">
                      <div class="bg-slate-50 border border-slate-200 rounded-lg p-2.5 h-full">
                        <p class="form3-label mb-1">Acceso vascular vigente en la fecha del evento</p>
                        <template v-if="accesoVigenteEnFechaEvento(evento.feEvento)">
                          <p class="text-xs font-semibold text-slate-800">{{ accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso || accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso_actual || '—' }}</p>
                          <p class="text-[11px] text-slate-600">{{ accesoVigenteEnFechaEvento(evento.feEvento).localizacion_acceso || accesoVigenteEnFechaEvento(evento.feEvento).localizacion_acceso_actual || '—' }}</p>
                          <p class="text-[11px] text-slate-500 mt-0.5">Fecha creación: {{ accesoVigenteEnFechaEvento(evento.feEvento).fecha_creacion_acceso || accesoVigenteEnFechaEvento(evento.feEvento).fecha_creacion_acceso_actual || '—' }}</p>
                          <p
                            v-if="esTipoAccesoFistula(accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso || accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso_actual)"
                            class="text-[11px] text-cyan-800 mt-0.5"
                          >
                            Inicio canulación: {{ accesoVigenteEnFechaEvento(evento.feEvento).fecha_inicio_canulacion || '— (regístrela en Acceso Vascular)' }}
                          </p>
                        </template>
                        <p v-else class="text-xs text-slate-400 italic">No hay registro de acceso vascular para esta fecha.</p>
                      </div>
                    </div>

                    <div class="space-y-0.5 lg:col-span-4">
                       <label class="form3-label">Tipo de infección</label>
                       <select
                         v-model="evento.tpInfeccion"
                         @change="resetearHemocultivo(index)"
                         :disabled="!evento.feEvento || getOpcionesTipoInfeccion(evento.feEvento).length === 0"
                         class="form3-control"
                       >
                         <option value="">Seleccione...</option>
                         <option
                           v-for="op in getOpcionesTipoInfeccion(evento.feEvento)"
                           :key="op.value"
                           :value="op.value"
                         >{{ op.label }}</option>
                       </select>
                       <p v-if="evento.feEvento && !getOpcionesTipoInfeccion(evento.feEvento).length" class="form3-hint text-amber-600">
                         Registre el acceso vascular vigente para esta fecha antes de indicar el tipo de infección.
                       </p>
                    </div>

                    <div class="lg:col-span-4 bg-slate-50 rounded-lg p-2.5 flex flex-wrap gap-x-8 gap-y-2 border border-slate-100">
                       
                       <div class="flex items-center gap-2">
                         <span class="text-xs font-semibold text-slate-700">Trat. Antimicrobial IV</span>
                         <button @click="evento.tratamientoIV = !evento.tratamientoIV"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.tratamientoIV ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.tratamientoIV ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-[10px] font-bold uppercase" :class="evento.tratamientoIV ? 'text-cyan-700' : 'text-slate-400'">{{ evento.tratamientoIV ? 'SÍ' : 'NO' }}</span>
                       </div>

                       <div class="flex items-center gap-2">
                         <span class="text-xs font-semibold text-slate-700">Vancomicina IV</span>
                         <button @click="evento.vancomicinaIV = !evento.vancomicinaIV"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.vancomicinaIV ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.vancomicinaIV ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-[10px] font-bold uppercase" :class="evento.vancomicinaIV ? 'text-cyan-700' : 'text-slate-400'">{{ evento.vancomicinaIV ? 'SÍ' : 'NO' }}</span>
                       </div>

                       <div v-if="mostrarHemocultivo(evento)" class="flex items-center gap-2">
                         <span class="text-xs font-semibold text-slate-700">Hemocultivo (+)</span>
                         <button @click="toggleHemocultivo(evento, index)"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.hemocultivoPositivo ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.hemocultivoPositivo ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-[10px] font-bold uppercase" :class="evento.hemocultivoPositivo ? 'text-cyan-700' : 'text-slate-400'">{{ evento.hemocultivoPositivo ? 'SÍ' : 'NO' }}</span>
                       </div>
                    </div>

                    <div v-if="evento.hemocultivoPositivo && mostrarHemocultivo(evento)" class="lg:col-span-4 animate-fadeIn">
                       <div class="bg-cyan-50 border border-cyan-100 rounded-lg p-2 flex items-center gap-3">
                          <label class="text-xs font-bold text-cyan-800 whitespace-nowrap">Germen identificado:</label>
                          <select v-model="evento.tpGermen" class="form3-control form3-control--inline">
                            <option value="">-- Seleccione --</option>
                            <option v-for="germen in getOpcionesGermenes(evento.tpInfeccion)" :key="germen.value" :value="germen.value">{{ germen.label }}</option>
                          </select>
                       </div>
                    </div>

                    <div v-if="!iniciarConInfeccion" class="lg:col-span-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
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
                        :key="form2AccesoKey"
                        :paciente="paciente"
                        :periodo="periodoNumero"
                        :periodo-ipress="idPeriodoIpress"
                        :id-paciente-atencion="idPacienteAtencion"
                        :desde-formulario-infeccion="true"
                        motivo-cambio-inicial="Complicación infecciosa"
                        @cancelar="cerrarModalAccesoVascular"
                        @guardado="onGuardadoAccesoVascular"
                      />
                    </div>
                  </div>
                </div>

                <ComentarioSupervisorEvaluacion v-if="modoSupervisor" v-model="comentarioSupervisor" />
                <div class="flex justify-end pt-2">
                  <button type="button" @click="guardarInfeccion" class="form3-btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    {{ registroEdicion ? 'Guardar cambios' : 'Guardar registro' }}
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <div v-if="!enModal" class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div class="bg-slate-50 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
              <h3 class="text-slate-700 font-bold text-xs uppercase tracking-wide">Historial de infecciones del periodo</h3>
              <span class="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{{ historialInfecciones.length }} registros</span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="form3-table w-full text-left text-slate-600">
                <thead class="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th class="px-3 py-2 font-bold">Fecha</th>
                    <th class="px-3 py-2 font-bold">Acceso vascular</th>
                    <th class="px-3 py-2 font-bold">Tipo infección</th>
                    <th class="px-3 py-2 font-bold">Germen</th>
                    <th class="px-3 py-2 font-bold text-center">Hemocultivo</th>
                    <th class="px-3 py-2 font-bold text-center">Cambio acceso</th>
                    <th class="px-3 py-2 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="historialInfecciones.length === 0">
                    <td colspan="7" class="px-3 py-6 text-center text-slate-400 italic text-xs">No hay infecciones registradas en este periodo.</td>
                  </tr>
                  <tr v-for="(item, index) in historialTabla" :key="item.id_evento_acceso_vascular || index" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td class="px-3 py-2 font-medium text-slate-800">{{ item.feEvento || item.fecha_evento }}</td>
                    <td class="px-3 py-2">
                      <p class="font-medium text-slate-800">{{ item.acceso.tipo }}</p>
                      <p v-if="item.acceso.localizacion" class="text-[10px] text-slate-500 mt-0.5">{{ item.acceso.localizacion }}</p>
                    </td>
                    <td class="px-3 py-2">
                      <span v-if="item.tpInfeccion === '1'">Bacteremia</span>
                      <span v-else-if="item.tpInfeccion === '2'">Local</span>
                      <span v-else-if="item.tpInfeccion === '4'">Fungemia</span>
                      <span v-else>{{ item.tpInfeccion || '—' }}</span>
                    </td>
                    <td class="px-3 py-2 italic text-slate-500">{{ item.germenLabel || getNombreGermen(item.tpGermen) || item.germen || '-' }}</td>
                    <td class="px-3 py-2 text-center">
                      <span v-if="item.hemocultivoPositivo || item.hemocultivo_positivo === 'SÍ'" class="text-red-600 font-bold text-[10px] bg-red-50 px-1.5 py-0.5 rounded">POS (+)</span>
                      <span v-else class="text-slate-400 text-[10px]">NEG (-)</span>
                    </td>
                    <td class="px-3 py-2 text-center">
                       <span v-if="item.obligoCambioAcceso" class="text-red-600 font-bold text-xs">SÍ</span>
                       <span v-else class="text-slate-400 text-xs">NO</span>
                    </td>
                    <td class="px-3 py-2 text-right">
                      <button v-if="!item.id_evento_acceso_vascular" type="button" @click="eliminarDelHistorial(index)" class="text-red-400 hover:text-red-600 transition-colors p-0.5" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <span v-else class="text-slate-300 text-[10px]">—</span>
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
import { getAllIpress, postAllIpress, patchAllIpress } from "@/services/ipress/Ipress.service";
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';
import {
  accesoVigenteEnFechaEvento as resolverAccesoVigenteEnFecha,
  esTipoAccesoFistula,
  minFechaEventoSegunAcceso,
} from '@/utils/accesoVascularValidacion';
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue';
import ComentarioSupervisorEvaluacion from '@/components/evaluacion/ComentarioSupervisorEvaluacion.vue';
import { useEdicionSupervisor } from '@/composables/useEdicionSupervisor';
import es from 'element-plus/dist/locale/es.mjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const props = defineProps({
  paciente: { type: Object, default: null },
  idPacienteAtencion: { type: [Number, String], default: null },
  registroEdicion: { type: Object, default: null },
  iniciarConInfeccion: { type: Boolean, default: false },
  fechaEventoInicial: { type: String, default: '' },
  modoSupervisor: { type: Boolean, default: false },
});
const emit = defineEmits(['cancelar', 'guardado']);
const { comentarioSupervisor, guardarComoSupervisor } = useEdicionSupervisor(props);
const enModal = computed(() => props.idPacienteAtencion != null && props.idPacienteAtencion !== '');

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const idPeriodoIpress = ref(null);
const periodoNumero = computed(() => {
  const v = periodoGlobal?.value ?? periodoGlobal;
  if (v == null || v === '') return null;
  return Number(v);
});
const periodos = ref([]);
const clinicasLista = ref([]);

const periodoVisibleId = computed(() => periodoNumero.value ?? periodoGlobal?.value ?? null);
const clinicaVisibleId = computed(() => clinicaGlobal?.value ?? clinicaGlobal ?? null);
const modalidadVisibleId = computed(() => modalidadGlobal?.value ?? modalidadGlobal ?? null);

const periodoTexto = computed(() => {
  const idPeriodo = periodoVisibleId.value;
  if (idPeriodo == null) return '';
  const lista = Array.isArray(periodos.value) ? periodos.value : [];
  const item = lista.find((per) => String(per.id_periodo) === String(idPeriodo));
  return item?.periodo || '';
});

const clinicaTexto = computed(() => {
  const idClinica = clinicaVisibleId.value;
  if (idClinica == null || idClinica === '') return '';
  const lista = Array.isArray(clinicasLista.value) ? clinicasLista.value : [];
  const item = lista.find((ip) => String(ip.id_ipress) === String(idClinica));
  return item?.nombre_corto || item?.ipress || '';
});

const modalidadTexto = computed(() => {
  const equivalencias = {
    1: 'Hemodiálisis',
    2: 'Diálisis Peritoneal',
    3: 'Trasplante',
  };
  return equivalencias[Number(modalidadVisibleId.value)] || '';
});

const periodoDisplay = computed(() => periodoTexto.value || '—');
const clinicaDisplay = computed(() => clinicaTexto.value || '—');
const modalidadDisplay = computed(() => modalidadTexto.value || '—');
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
const form2AccesoKey = ref(0);
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
  if (tipoInfeccion === 'Fungemia' || tipoInfeccion === '4') {
    return opcionesGermenes.filter(g => g.value === 'Hongos');
  }
  return opcionesGermenes.filter(g => g.value !== 'Hongos');
};

function normalizarTipoAccesoVascular(tipoAcceso) {
  const t = String(tipoAcceso || '').trim().toUpperCase();
  if (!t) return '';
  if (t === 'CVCT' || t.includes('TEMPORAL')) return 'CVCT';
  if (t === 'CVCLP' || t.includes('LARGA PERMANENCIA') || t.includes('PERMANENCIA')) return 'CVCLP';
  if (t === 'FAV' || t.includes('FÍSTULA') || t.includes('FISTULA') || t.includes('ARTERIOVENOSA')) return 'FAV';
  if (t.includes('INJERTO') && (t.includes('AUT') || t.includes('AUTÓLOGO'))) return 'INJERTO';
  if (t.includes('INJERTO') && (t.includes('PROT') || t.includes('PROTÉSICO'))) return 'INJERTO';
  if (t.includes('INJERTO')) return 'INJERTO';
  return 'OTRO';
}

function getOpcionesTipoInfeccion(fechaEvento) {
  const acceso = accesoVigenteEnFechaEvento(fechaEvento);
  if (!acceso) return [];
  const tipo = normalizarTipoAccesoVascular(acceso.tipo_acceso || acceso.tipo_acceso_actual);

  if (tipo === 'CVCT' || tipo === 'CVCLP') {
    return [
      { value: 'Bacteremia', label: 'Bacteremia' },
      { value: 'Infección de orificio de salida', label: 'Infección de orificio de salida' },
      { value: 'Túnelitis', label: 'Túnelitis' },
      { value: 'Fungemia', label: 'Fungemia' },
    ];
  }
  if (tipo === 'FAV' || tipo === 'INJERTO') {
    return [
      { value: 'Bacteremia', label: 'Bacteremia' },
      { value: 'Infección local', label: 'Infección local' },
      { value: 'Fungemia', label: 'Fungemia' },
    ];
  }
  return [
    { value: 'Bacteremia', label: 'Bacteremia' },
    { value: 'Infección local', label: 'Infección local' },
    { value: 'Infección de orificio de salida', label: 'Infección de orificio de salida' },
    { value: 'Túnelitis', label: 'Túnelitis' },
    { value: 'Fungemia', label: 'Fungemia' },
  ];
}

/** Hemocultivo solo para Bacteremia y Fungemia. */
function mostrarHemocultivo(evento) {
  if (!evento?.tpInfeccion) return false;
  const tp = String(evento.tpInfeccion || '');
  return tp === 'Bacteremia' || tp === 'Fungemia';
}

function onCambioFechaEvento(index) {
  const evento = eventosInfecciosos.value[index];
  if (!evento) return;
  evento.tpInfeccion = '';
  resetearHemocultivo(index);
  const acceso = accesoVigenteEnFechaEvento(evento.feEvento);
  if (acceso && esTipoAccesoFistula(acceso.tipo_acceso || acceso.tipo_acceso_actual)) {
    const canul = String(acceso.fecha_inicio_canulacion || '').trim().slice(0, 10);
    if (canul && evento.feEvento && evento.feEvento < canul) {
      ElMessage.warning('La fecha del evento no puede ser anterior al inicio de canulación de la fístula.');
      evento.feEvento = '';
    }
  }
}

function minFechaEventoInfeccion(fechaEvento) {
  const rangoMin = rangoFechasPeriodo.value.min;
  const acceso = accesoVigenteEnFechaEvento(fechaEvento);
  const minAcceso = minFechaEventoSegunAcceso(acceso);
  if (rangoMin && minAcceso) return rangoMin > minAcceso ? rangoMin : minAcceso;
  return rangoMin || minAcceso || undefined;
}

function hintFechaEventoFistula(fechaEvento) {
  const acceso = accesoVigenteEnFechaEvento(fechaEvento);
  if (!acceso || !esTipoAccesoFistula(acceso.tipo_acceso || acceso.tipo_acceso_actual)) return '';
  const canul = String(acceso.fecha_inicio_canulacion || '').trim().slice(0, 10);
  if (!canul) return 'Fístula: registre la fecha de inicio de canulación en Acceso Vascular.';
  return `Fístula: el evento debe ser desde el inicio de canulación (${canul}).`;
}

const getNombreGermen = (valor) => {
  const g = opcionesGermenes.find(op => op.value === valor);
  return g ? g.label : '';
};

function germenAValor(germen) {
  if (!germen) return '';
  const g = opcionesGermenes.find((op) => op.value === germen || op.label === germen);
  return g?.value || germen;
}

function esValorSi(val) {
  if (val === true || val === 1 || val === '1') return true;
  const s = String(val ?? '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return s === 'SI' || s === 'S' || s === 'TRUE' || s === 'YES';
}

function cargarRegistroEdicion(registro) {
  if (!registro) return;
  tieneInfeccion.value = true;
  eventosInfecciosos.value = [{
    id: registro.id_evento_acceso_vascular || Date.now(),
    feEvento: registro.fecha_evento || '',
    tpInfeccion: registro.tipo_infeccion || '',
    tratamientoIV: esValorSi(registro.antmicrobial),
    vancomicinaIV: esValorSi(registro.vancomicina),
    hemocultivoPositivo: esValorSi(registro.hemocultivo_positivo),
    tpGermen: germenAValor(registro.germen),
  }];
  form.obligoCambioAcceso = false;
}

function aplicarInicioDesdeAcceso() {
  if (!props.iniciarConInfeccion || props.registroEdicion) return;
  tieneInfeccion.value = true;
  eventosInfecciosos.value = [{
    id: Date.now(),
    feEvento: props.fechaEventoInicial || '',
    tpInfeccion: '',
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tpGermen: '',
  }];
}


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
  return resolverAccesoVigenteEnFecha(unidadesPaciente.value, fechaEvento);
}

function etiquetaAccesoEnFecha(fechaEvento) {
  const acceso = accesoVigenteEnFechaEvento(fechaEvento);
  if (!acceso) {
    return { tipo: '—', localizacion: '' };
  }
  return {
    tipo: acceso.tipo_acceso || acceso.tipo_acceso_actual || '—',
    localizacion: acceso.localizacion_acceso || acceso.localizacion_acceso_actual || '',
  };
}

const historialTabla = computed(() =>
  historialInfecciones.value.map((item) => ({
    ...item,
    acceso: etiquetaAccesoEnFecha(item.feEvento || item.fecha_evento),
  }))
);

async function fetchPeriodos() {
  try {
    const respuesta = await getAllIpress('/periodos/');
    periodos.value = respuesta;
  } catch (error) { console.error(error); }
}

async function fetchClinicas() {
  try {
    const res = await getAllIpress('/ipress/');
    clinicasLista.value = Array.isArray(res) ? res : (res?.results || []);
  } catch (error) {
    console.error(error);
    clinicasLista.value = [];
  }
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
      tratamientoIV: esValorSi(item.antmicrobial),
      vancomicinaIV: esValorSi(item.vancomicina),
      hemocultivoPositivo: esValorSi(item.hemocultivo_positivo),
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
}

watch(() => form.obligoCambioAcceso, async (val) => {
  if (props.iniciarConInfeccion) return;
  if (val === true) {
    form2AccesoKey.value += 1;
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
    const opciones = getOpcionesTipoInfeccion(evento.feEvento);
    if (evento.tpInfeccion && !opciones.some((op) => op.value === evento.tpInfeccion)) {
      evento.tpInfeccion = '';
    }
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

    const acceso = accesoVigenteEnFechaEvento(eventoActual.feEvento);
    if (!acceso) {
      ElMessage.warning('No hay acceso vascular vigente para la fecha del evento.');
      return;
    }
    if (esTipoAccesoFistula(acceso.tipo_acceso || acceso.tipo_acceso_actual)) {
      const canul = String(acceso.fecha_inicio_canulacion || '').trim().slice(0, 10);
      if (!canul) {
        ElMessage.warning('Para fístula, registre la fecha de inicio de canulación en Acceso Vascular.');
        return;
      }
      if (eventoActual.feEvento < canul) {
        ElMessage.warning('La fecha del evento no puede ser anterior al inicio de canulación de la fístula.');
        return;
      }
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
      const idEdicion = props.registroEdicion?.id_evento_acceso_vascular;
      if (idEdicion) {
        if (props.modoSupervisor) {
          await guardarComoSupervisor('eventosAccesosVasculares', idEdicion, payload);
        } else {
          await patchAllIpress(`/eventosAccesosVasculares/${idEdicion}/`, payload);
        }
        ElMessage.success('Evento infeccioso actualizado.');
      } else {
        await postAllIpress('/eventosAccesosVasculares/', payload);
        ElMessage.success('Evento infeccioso registrado.');
      }
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

watch(() => props.registroEdicion, (registro) => {
  if (registro) cargarRegistroEdicion(registro);
}, { immediate: true });

onMounted(async () => {
  await Promise.all([fetchPeriodos(), fetchClinicas()]);
  if (props.paciente?.id_paciente) {
    await fetchUnidadesActualesPaciente();
    if (enModal.value) {
      if (props.registroEdicion) cargarRegistroEdicion(props.registroEdicion);
      else aplicarInicioDesdeAcceso();
      fetchHistorialEventosApi();
      fetchPeriodoIpress();
    }
  }
});
</script>

<style scoped>
.form3-meta-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 0.2rem;
}

.form3-info-box {
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.form3-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #64748b;
}

.form3-hint {
  font-size: 0.625rem;
  color: #94a3b8;
  margin-top: 0.15rem;
}

.form3-shell input.form3-control,
.form3-shell select.form3-control {
  display: block;
  width: 100%;
  box-sizing: border-box;
  min-height: 1.75rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2;
  color: #1e293b;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  outline: none;
}

.form3-shell input.form3-control:focus,
.form3-shell select.form3-control:focus {
  border-color: #0891b2;
  box-shadow: 0 0 0 2px rgb(8 145 178 / 0.15);
}

.form3-shell select.form3-control:disabled {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.form3-control--inline {
  background: transparent;
  border: none;
  padding: 0;
  min-height: auto;
}

.form3-radio-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
}

.form3-radio-btn--no {
  color: #475569;
}

.peer:checked + .form3-radio-btn--no {
  background: #334155;
  color: #fff;
  border-color: #334155;
}

.form3-radio-btn--si {
  color: #0e7490;
  border-color: #a5f3fc;
}

.peer:checked + .form3-radio-btn--si {
  background: #0891b2;
  color: #fff;
  border-color: #0891b2;
}

.form3-chip {
  padding: 0.3rem 0.6rem;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  font-size: 0.625rem;
  font-weight: 700;
  color: #64748b;
  transition: all 0.15s;
}

.peer:checked + .form3-chip--no {
  background: #475569;
  color: #fff;
  border-color: #475569;
}

.peer:checked + .form3-chip--si {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
}

.form3-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: #0891b2;
  border: 1px solid #0891b2;
  cursor: pointer;
  transition: background-color 0.15s;
}

.form3-btn-primary:hover {
  background: #0e7490;
}

.form3-table {
  font-size: 0.6875rem;
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>