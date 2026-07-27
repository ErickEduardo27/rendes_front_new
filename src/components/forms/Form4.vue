
<template>
    <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
        
        <div class="border-l-4 border-cyan-600 pl-3 my-6">
            <h2 class="text-xl font-bold text-gray-800">Morbimorbilidad</h2>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 items-start">
            
            <div class="flex-1 w-full space-y-6">
                
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                    
                    <div v-if="!modoCompletarAlta" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Búsqueda de Diagnóstico por CIE-10</label>
                            <input v-model="form.filtroCodigo" type="text" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-gray-50 focus:bg-white" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Buscar de Diagnótico por Descripción</label>
                            <input v-model="form.filtroDescripcion" type="text" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-gray-50 focus:bg-white" />
                        </div>
                    </div>

                    <div v-if="modoCompletarAlta && form.seleccionados.length" class="mb-4">
                        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Diagnósticos del registro (solo complete la fecha de alta)</h3>
                        <ul class="space-y-1 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3">
                            <li v-for="item in form.seleccionados" :key="item.id"><strong>{{ item.codigo }}</strong> – {{ item.descripcion }}</li>
                        </ul>
                    </div>

                    <div v-if="!modoCompletarAlta && mostrarLista" class="border border-gray-200 rounded-md max-h-48 overflow-y-auto bg-white">
                        <div v-for="item in resultadosFiltrados" :key="item.id" class="flex items-center gap-3 p-3 border-b border-gray-100 last:border-0 hover:bg-cyan-50 transition-colors">
                            <input type="checkbox" :value="item" v-model="form.seleccionados" class="w-4 h-4 text-cyan-600 rounded border-gray-300 focus:ring-cyan-500 cursor-pointer" @change="onDiagnosticoSeleccionado($event)" />
                            <span class="text-sm text-gray-700 cursor-default"><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
                        </div>
                    </div>
                    <p v-if="!modoCompletarAlta && hayBusqueda && !mostrarLista" class="italic text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200">No se encontraron resultados.</p>

                    <div v-if="!modoCompletarAlta && form.seleccionados.length" class="pt-2">
                        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Diágnosticos seleccionados:</h3>
                        <ul class="space-y-2">
                            <li v-for="item in form.seleccionados" :key="item.id" class="bg-cyan-50 border border-cyan-100 p-3 rounded-md flex justify-between items-center">
                                <span class="text-sm text-cyan-900"><strong>{{ item.codigo }}</strong> - {{ item.descripcion }}</span>
                                <button @click="quitarSeleccion(item)" class="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-semibold transition-colors">Quitar</button>
                            </li>
                        </ul>
                    </div>

                    <div v-if="modoCompletarAlta" class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p class="text-sm font-medium text-amber-800">Registro sin fecha de alta. Complete la fecha de alta de hospitalización (debe estar dentro del periodo seleccionado).</p>
                    </div>

                    <hr class="border-gray-100 my-4" />

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fecha de Inicio de Hospitalización</label>
                            <FechaInput v-model="form.fIniHos" :min="modoCompletarAlta ? undefined : rangoFechasPeriodo.min" :max="modoCompletarAlta ? undefined : rangoFechasPeriodo.max" :readonly="modoCompletarAlta" input-class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white" />
                            <p v-if="!modoCompletarAlta && rangoFechasPeriodo.min" class="text-xs text-gray-500 mt-1">Dentro del periodo ({{ rangoFechasPeriodo.min }} a {{ rangoFechasPeriodo.max }})</p>
                        </div>
                        <div v-if="form.desenlace !== 'Fallecimiento'">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fecha de Alta de Hospitalización</label>
                            <FechaInput v-model="form.fAltHos" :min="minFechaAlta" :max="maxFechaAlta" :has-error="errorFechaAlta" input-class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white" />
                            <p v-if="maxFechaAlta" class="text-xs text-gray-500 mt-1">No debe salir del periodo (máx. {{ maxFechaAlta }})</p>
                            <div v-if="errorFechaAlta" class="text-red-500 text-xs mt-1.5 font-medium">{{ errorFechaAlta }}</div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Desenlace</label>
                            <select v-model="form.desenlace" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                                <option value="">Seleccione</option>
                                <option value="Alta">Alta</option>
                                <option value="Fallecimiento">Fallecimiento</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fuente</label>
                            <select v-model="form.fuente" :disabled="modoCompletarAlta" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white" :class="{ 'bg-gray-100 cursor-not-allowed': modoCompletarAlta }">
                                <option value="">Seleccione</option>
                                <option value="Epicrisis">Epicrisis</option>
                                <option value="Informe de Alta">Informe de Alta</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="form.desenlace === 'Fallecimiento'" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fecha de Fallecimiento <span class="text-red-500">*</span></label>
                                <FechaInput
                                    v-model="form.fechaFallecimiento"
                                    :min="minFechaAlta || rangoFechasPeriodo.min"
                                    :max="rangoFechasPeriodo.max"
                                    input-class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white"
                                />
                                <p v-if="rangoFechasPeriodo.max" class="text-xs text-gray-500 mt-1">Dentro del periodo (máx. {{ rangoFechasPeriodo.max }})</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Causa de Muerte (CIE-10) <span class="text-red-500">*</span>
                            </label>

                            <div
                                v-if="form.causaMuerte"
                                class="bg-rose-50 border border-rose-100 p-3 rounded-md flex justify-between items-center gap-3"
                            >
                                <span class="text-sm text-rose-900">
                                    <strong>{{ causaMuerteCodigoMostrar }}</strong>
                                    <span v-if="causaMuerteDescripcionMostrar"> – {{ causaMuerteDescripcionMostrar }}</span>
                                </span>
                                <button
                                    type="button"
                                    class="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-xs font-semibold transition-colors shrink-0"
                                    @click="quitarCausaMuerte"
                                >
                                    Quitar
                                </button>
                            </div>

                            <template v-else>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Código CIE-10</label>
                                        <input
                                            v-model="form.filtroCodigoCausa"
                                            type="text"
                                            placeholder="Ej. J96.0"
                                            class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Descripción</label>
                                        <input
                                            v-model="form.filtroDescripcionCausa"
                                            type="text"
                                            placeholder="Mín. 3 caracteres"
                                            class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div
                                    v-if="mostrarListaCausaMuerte"
                                    class="border border-gray-200 rounded-md max-h-48 overflow-y-auto bg-white"
                                >
                                    <button
                                        v-for="item in resultadosCausaMuerte"
                                        :key="`causa-${item.id}`"
                                        type="button"
                                        class="w-full text-left flex items-start gap-3 p-3 border-b border-gray-100 last:border-0 hover:bg-rose-50 transition-colors"
                                        @click="seleccionarCausaMuerte(item)"
                                    >
                                        <span class="text-sm text-gray-700">
                                            <strong>{{ item.codigo }}</strong> - {{ item.descripcion }}
                                        </span>
                                    </button>
                                </div>
                                <p
                                    v-else-if="hayBusquedaCausaMuerte"
                                    class="italic text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-200"
                                >
                                    No se encontraron resultados.
                                </p>
                                <p v-else class="text-xs text-gray-400 mt-1">
                                    Busque por código o descripción (mín. 3 letras) y seleccione la causa de muerte.
                                </p>
                            </template>
                        </div>
                    </div>
                </div>

                <ComentarioSupervisorEvaluacion v-if="modoSupervisor" v-model="comentarioSupervisor" />
                <div class="flex justify-end gap-3 mt-4">
                    <button @click="$emit('cancelar')" class="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                        Cancelar
                    </button>
                    <button @click="solicitarRegistro()" class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        {{ modoCompletarAlta ? 'Guardar fecha de alta' : (idMorbilidadEdicion ? 'Guardar cambios' : 'Registrar') }}
                    </button>
                </div>
            </div>
            
        </div>

        <!-- Confirmación: efecto de la hospitalización sobre movimientos -->
        <div
            v-if="mostrarModalEfectoMovimiento"
            class="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div class="bg-cyan-700 px-5 py-4">
                    <h3 class="text-white font-bold text-base">Confirmación de hospitalización</h3>
                    <p class="text-cyan-100 text-xs mt-1">Seleccione una opción obligatoria antes de registrar.</p>
                </div>
                <div class="p-5 space-y-3">
                    <label
                        v-for="op in opcionesEfectoDisponibles"
                        :key="op.value"
                        class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                        :class="efectoMovimientoSeleccionado === op.value
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-slate-200 hover:border-cyan-300 hover:bg-slate-50'"
                    >
                        <input
                            v-model="efectoMovimientoSeleccionado"
                            type="radio"
                            class="mt-1 text-cyan-600 focus:ring-cyan-500"
                            :value="op.value"
                            name="efecto_movimiento_hospitalizacion"
                        />
                        <span class="text-sm text-slate-800 leading-snug">{{ op.label }}</span>
                    </label>
                    <p v-if="efectoMovimientoSeleccionado === '1'" class="text-xs text-slate-500 pl-1">
                        Se generará egreso con la fecha de inicio de hospitalización y reingreso con la fecha de alta.
                    </p>
                    <p v-else-if="efectoMovimientoSeleccionado === '2'" class="text-xs text-slate-500 pl-1">
                        Se generará egreso automático
                        {{ form.desenlace === 'Fallecimiento' ? 'con la fecha de fallecimiento' : 'con la fecha de inicio de hospitalización' }}.
                    </p>
                    <p v-else-if="efectoMovimientoSeleccionado === '3'" class="text-xs text-slate-500 pl-1">
                        Solo se guardará el registro de hospitalización; no se crearán movimientos.
                    </p>
                    <p v-if="errorEfectoMovimiento" class="text-xs text-red-600 font-medium">{{ errorEfectoMovimiento }}</p>
                </div>
                <div class="px-5 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
                        :disabled="guardandoFormulario"
                        @click="cancelarModalEfecto"
                    >
                        Volver
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50"
                        :disabled="guardandoFormulario"
                        @click="confirmarYRegistrar"
                    >
                        {{ guardandoFormulario ? 'Guardando…' : 'Confirmar y registrar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getAllIpress, postAllIpress, patchAllIpress } from '@/services/ipress/Ipress.service';
import ComentarioSupervisorEvaluacion from '@/components/evaluacion/ComentarioSupervisorEvaluacion.vue';
import { useEdicionSupervisor } from '@/composables/useEdicionSupervisor';
import Swal from 'sweetalert2';
import {
    OPCIONES_EFECTO_HOSPITALIZACION,
    EFECTO_HOSP,
    aplicarEfectoMovimientoHospitalizacion,
} from '@/utils/movimientosHospitalizacion';

async function alertaSwal(texto, { title = 'Atención', icon = 'warning' } = {}) {
    await Swal.fire({
        title,
        text: texto,
        icon,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#008f9c',
    });
}

// 👇 defineProps debe estar fuera de cualquier función
const props = defineProps({
    paciente: {
        type: Object,
        required: true
    },
    periodo: {
        type: Number,
        default: null
    },
    idPacienteAtencion: {
        type: [Number, String],
        default: null
    },
    registroEdicion: {
        type: Object,
        default: null
    },
    modoSupervisor: { type: Boolean, default: false },
})

const { paciente, periodo, idPacienteAtencion } = props

const emit = defineEmits(['cancelar', 'guardado'])

const { comentarioSupervisor, guardarComoSupervisor } = useEdicionSupervisor(props);

const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo

const periodos = ref([]);
const rangoFechasPeriodo = computed(() => {
  const lista = Array.isArray(periodos.value) ? periodos.value : [];
  const pid = periodo ?? periodoSeleccionado;
  if (pid == null || pid === '') return { min: null, max: null };
  const pidNum = Number(pid);
  const p = lista.find(per => Number(per.id_periodo) === pidNum || String(per.id_periodo) === String(pid));
  if (!p || !p.periodo) return { min: null, max: null };
  const periodoStr = String(p.periodo).trim();
  const parts = periodoStr.split('-');
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

const ultimoRegistroHospitalizacion = ref(null);
const modoCompletarAlta = ref(false);
const idMorbilidadCompletar = ref(null);
const idMorbilidadEdicion = ref(null);

const mostrarModalEfectoMovimiento = ref(false);
const efectoMovimientoSeleccionado = ref('');
const errorEfectoMovimiento = ref('');
const guardandoFormulario = ref(false);

const opcionesEfectoDisponibles = computed(() => {
    const esFallecimiento = form.value.desenlace === 'Fallecimiento';
    const tieneAlta = Boolean(form.value.fAltHos);
    return OPCIONES_EFECTO_HOSPITALIZACION.filter((op) => {
        if (op.requiereAlta && (esFallecimiento || !tieneAlta)) return false;
        return true;
    });
});

/** Pide confirmación de efecto (movimientos) solo en registro nuevo o completar alta. */
const debeConfirmarEfectoMovimiento = computed(() => {
    if (idMorbilidadEdicion.value != null) return false;
    if (idPacienteAtencion == null || idPacienteAtencion === '') return false;
    return true;
});

function toInputDate(value) {
    if (value == null || value === '') return '';
    const s = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
}

function registroTieneAlta(registro) {
    return Boolean(toInputDate(registro?.fecha_alta_hospitalizacion));
}

function limpiarFormularioNuevo() {
    modoCompletarAlta.value = false;
    idMorbilidadCompletar.value = null;
    form.value.fIniHos = '';
    form.value.fAltHos = '';
    form.value.desenlace = '';
    form.value.fechaFallecimiento = '';
    form.value.causaMuerte = '';
    form.value.fuente = '';
    form.value.seleccionados = [];
    form.value.filtroCodigo = '';
    form.value.filtroDescripcion = '';
    form.value.filtroCodigoCausa = '';
    form.value.filtroDescripcionCausa = '';
    errorFechaAlta.value = '';
}

function diagnosticosDesdeRegistro(registro) {
    const codigos = (registro?.codigo_diagnostico || '').split(',').map((c) => c.trim()).filter(Boolean);
    const diagnosticos = (registro?.diagnostico || '').split(',').map((d) => d.trim()).filter(Boolean);
    const sel = [];
    codigos.forEach((cod, i) => {
        const item = items.value.find((it) => String(it.codigo).trim() === cod);
        if (item) sel.push(item);
        else if (diagnosticos[i]) sel.push({ id: 9000 + i, codigo: cod, descripcion: diagnosticos[i] });
        else sel.push({ id: 9000 + i, codigo: cod, descripcion: cod });
    });
    return sel;
}

function cargarRegistroEdicion(registro) {
    if (!registro) return;
    modoCompletarAlta.value = false;
    idMorbilidadCompletar.value = null;
    idMorbilidadEdicion.value = registro.id_morbilidad_hospitalaria;
    form.value.fIniHos = toInputDate(registro.fecha_hospitalizacion);
    form.value.fAltHos = toInputDate(registro.fecha_alta_hospitalizacion);
    form.value.desenlace = registro.desenlace || '';
    form.value.fechaFallecimiento = toInputDate(registro.fecha_fallecimiento);
    form.value.causaMuerte = registro.causa_muerte || '';
    form.value.fuente = registro.fuente || '';
    form.value.seleccionados = diagnosticosDesdeRegistro(registro);
    form.value.filtroCodigo = '';
    form.value.filtroDescripcion = '';
    form.value.filtroCodigoCausa = '';
    form.value.filtroDescripcionCausa = '';
}

const items = ref([
    { id: 1, codigo: 'J96.0', descripcion: 'Insuficiencia respiratoria aguda' },
    /*{ id: 2, codigo: 'N18.6', descripcion: 'Enfermedad Renal Terminal' },*/
    { id: 3, codigo: 'A41.9', descripcion: 'Septicemia, no especificada' },
    { id: 4, codigo: 'K92.2', descripcion: 'Hemorragia gastrointestinal, no especificada' },
    { id: 5, codigo: 'J15.9', descripcion: 'Neumonía bacteriana, no especificada' },
    { id: 6, codigo: 'I10.X', descripcion: 'Hipertensión esencial (primaria)' },
    { id: 7, codigo: 'K65.9', descripcion: 'Peritonitis, no especificada' },
    { id: 8, codigo: 'J90.X', descripcion: 'Derrame pleural no clasificado en otra parte' },
    { id: 9, codigo: 'K65.0', descripcion: 'Peritonitis aguda' },
    { id: 10, codigo: 'E87.5', descripcion: 'Hiperpotasemia' },
    { id: 11, codigo: 'I77.0', descripcion: 'Fístula arteriovenosa, adquirida' },
    { id: 12, codigo: 'D64.9', descripcion: 'Anemia de tipo no especificado' },
    { id: 13, codigo: 'T82.5', descripcion: 'Complicación mecánica de otros dispositivos e implantes cardiovasculares' },
    { id: 14, codigo: 'A09.X', descripcion: 'Diarrea y gastroenteritis de origen presumiblemente infeccioso' },
    { id: 15, codigo: 'Z54.0', descripcion: 'Convalecencia consecutiva a cirugía' },
    { id: 16, codigo: 'J81.X', descripcion: 'Edema pulmonar' },
    { id: 17, codigo: 'E11.5', descripcion: 'Diabetes mellitus no insulinodependiente, con complicaciones circulatorias periféricas' },
    { id: 18, codigo: 'K92.0', descripcion: 'Hematemesis' },
    { id: 19, codigo: 'T85.6', descripcion: 'Complicación mecánica de otros dispositivos protésicos, implantes e injertos internos especificados' },
    { id: 20, codigo: 'I63.9', descripcion: 'Infarto cerebral, no especificado' },
    { id: 21, codigo: 'E87.7', descripcion: 'Sobrecarga de líquidos' },
    { id: 22, codigo: 'Z51.4', descripcion: 'Atención preparatoria para tratamiento subsecuente, no clasificado en  otra parte' },
    { id: 23, codigo: 'J18.8', descripcion: 'Otras neumonías, de microorganismo no especificado' },
    { id: 24, codigo: 'S72.0', descripcion: 'Fractura del cuello de fémur' },
    { id: 25, codigo: 'J15.8', descripcion: 'Otras neumonías bacterianas' },
    { id: 26, codigo: 'K65.8', descripcion: 'Otras peritonitis' },
    /*{ id: 27, codigo: 'N18.5', descripcion: 'Insuficiencia Renal Crónica Estadio 4' },*/
    { id: 28, codigo: 'D50.0', descripcion: 'Anemia por deficiencia de hierro secundaria a pérdida de sangre (crónica)' },
    { id: 29, codigo: 'E11.7', descripcion: 'Diabetes mellitus no insulinodependiente, con complicaciones múltiples' },
    { id: 30, codigo: 'I50.9', descripcion: 'Insuficiencia cardíaca, no especificada' },
    { id: 31, codigo: 'I63.4', descripcion: 'Infarto cerebral debido a embolia de arterias cerebrales' },
    { id: 32, codigo: 'J13.X', descripcion: 'Neumonía debida a Streptococcus pneumoniae' },
    { id: 33, codigo: 'R50.9', descripcion: 'Fiebre, no especificada' },
    { id: 34, codigo: 'E21.1', descripcion: 'Hiperparatiroidismo secundario no clasificado en otra parte' },
    { id: 35, codigo: 'L03.9', descripcion: 'Celulitis de sitio no especificado' },
    { id: 36, codigo: 'R10.4', descripcion: 'Otros dolores abdominales y los no especificados' },
    { id: 37, codigo: 'R57.9', descripcion: 'Choque, no especificado' },
    { id: 38, codigo: 'A49.9', descripcion: 'Infección bacteriana, no especificada' },
    { id: 39, codigo: 'I12.0', descripcion: 'Enfermedad renal hipertensiva con insuficiencia renal' },
    { id: 40, codigo: 'M32.1', descripcion: 'Lupus eritematoso sistémico con compromiso de órganos o sistemas' },
    { id: 41, codigo: 'N17.9', descripcion: 'Insuficiencia renal aguda, no especificada' },
    { id: 42, codigo: 'Z45.2', descripcion: 'Asistencia y ajuste de dispositivos de acceso vascular' },
    { id: 43, codigo: 'Z94.0', descripcion: 'Trasplante de riñón' },
    { id: 44, codigo: 'I21.9', descripcion: 'Infarto agudo del miocardio, sin otra especificación' },
    { id: 45, codigo: 'I95.9', descripcion: 'Hipotensión, no especificada' },
    { id: 46, codigo: 'N40.X', descripcion: 'Hiperplasia de la próstata' },
    { id: 47, codigo: 'E10.5', descripcion: 'Diabetes mellitus insulinodependiente, con complicaciones circulatorias  periféricas' },
    { id: 48, codigo: 'A97.1', descripcion: 'El dengue hemorrágico con señales de advertencia' },
    { id: 49, codigo: 'C90.0', descripcion: 'Mieloma múltiple' },
    { id: 50, codigo: 'D63.8', descripcion: 'Anemia en otras enfermedades crónicas clasificadas en otra parte (*)' },
    { id: 51, codigo: 'E16.2', descripcion: 'Hipoglicemia, no especificada' },
    { id: 52, codigo: 'I50.0', descripcion: 'Insuficiencia cardíaca congestiva' },
    { id: 53, codigo: 'K42.9', descripcion: 'Hernia umbilical sin obstrucción ni gangrena' },
    { id: 54, codigo: 'K80.2', descripcion: 'Cálculo de la vesícula biliar sin colecistitis' },
    { id: 55, codigo: 'S72.1', descripcion: 'Fractura pertrocanteriana' },
    { id: 56, codigo: 'T82.3', descripcion: 'Complicación mecánica de otros injertos vasculares' },
    { id: 57, codigo: 'J84.9', descripcion: 'Enfermedad pulmonar intersticial, no especificada' },
    { id: 58, codigo: 't82.9', descripcion: 'Complicación no especificada de dispositivo protésico, implante e injerto cardiovascular' },
    { id: 59, codigo: 'D50.9', descripcion: 'Anemia por deficiencia de hierro sin otra especificación' },
    { id: 60, codigo: 'I61.9', descripcion: 'Hemorragia intraencefálica, no especificada' },
    { id: 61, codigo: 'I64.X', descripcion: 'Accidente vascular encefálico agudo, no especificado como hemorrágico o  isquémico' },
    { id: 62, codigo: 'L98.4', descripcion: 'Ulcera crónica de la piel, no clasificada en otra parte' },
    { id: 63, codigo: 'R56.8', descripcion: 'Otras convulsiones y las no especificadas' },
    { id: 64, codigo: 'C64.X', descripcion: 'Tumor maligno del riñón, excepto de la pelvis renal' },
    { id: 65, codigo: 'D46.4', descripcion: 'Anemia refractaria, sin otra especificación' },
    { id: 66, codigo: 'H43.1', descripcion: 'Hemorragia del vítreo' },
    { id: 67, codigo: 'J18.0', descripcion: 'Bronconeumonía, no especificada' },
    { id: 68, codigo: 'R00.1', descripcion: 'Bradicardia, no especificada' },
    { id: 69, codigo: 'R10.0', descripcion: 'Abdomen agudo' },
    { id: 70, codigo: 'R57.1', descripcion: 'Choque hipovolémico' },
    { id: 71, codigo: 'T80.2', descripcion: 'Infecciones consecutivas a infusión, transfusión e inyección terapéutica' },
    { id: 72, codigo: 'Z49.0', descripcion: 'Cuidados preparatorios para diálisis' },
    { id: 73, codigo: 'J47.X', descripcion: 'Bronquiectasia' },
    { id: 74, codigo: 'K40.9', descripcion: 'Hernia inguinal unilateral o no especificada, sin obstrucción ni gangrena' },
    { id: 75, codigo: 'K67.0', descripcion: 'Peritonitis por clamidias (A74.8+) (*)' },
    { id: 76, codigo: 'K81.1', descripcion: 'Colecistitis crónica' },
    { id: 77, codigo: 'Z46.8', descripcion: 'Prueba y ajuste de otros dispositivos especificados' },
    { id: 78, codigo: 'A40.3', descripcion: 'Septicemia debida a Streptococcus pneumoniae' },
    { id: 79, codigo: 'A90.X', descripcion: 'Fiebre del dengue [dengue clásico]' },
    { id: 80, codigo: 'E11.9', descripcion: 'Diabetes mellitus no insulinodependiente, sin mención de complicación' },
    { id: 81, codigo: 'I11.9', descripcion: 'Enfermedad cardíaca hipertensiva sin insuficiencia cardíaca (congestiva)' },
    { id: 82, codigo: 'I20.9', descripcion: 'Angina de pecho, no especificada' },
    { id: 83, codigo: 'I49.9', descripcion: 'Arritmia cardíaca, no especificada' },
    { id: 84, codigo: 'I87.9', descripcion: 'Trastorno venoso, no especificado' },
    { id: 85, codigo: 'K85.9', descripcion: 'Pancreatitis aguda, no especificada' },
    { id: 86, codigo: 'M32.9', descripcion: 'Lupus eritematoso sistémico, sin otra especificación' },
    { id: 87, codigo: 'R73.9', descripcion: 'Hiperglicemia, no especificada' },
    { id: 88, codigo: 'S06.5', descripcion: 'Hemorragia subdural traumática' },
    { id: 89, codigo: 'A04.9', descripcion: 'Infección intestinal bacteriana, no especificada' },
    { id: 90, codigo: 'E10.7', descripcion: 'Diabetes mellitus insulinodependiente, con complicaciones múltiples' },
    { id: 91, codigo: 'E11.2', descripcion: 'Diabetes mellitus no insulinodependiente, con complicaciones renales' },
    { id: 92, codigo: 'E21.3', descripcion: 'Hiperparatiroidismo, sin otra especificación' },
    { id: 93, codigo: 'E87.6', descripcion: 'Hipopotasmia' },
    { id: 94, codigo: 'H36.0', descripcion: 'Retinopatía diabética (E10-E14+ con cuarto carácter común .3) (*)' },
    { id: 95, codigo: 'I11.0', descripcion: 'Enfermedad cardíaca hipertensiva con insuficiencia cardíaca (congestiva)' },
    { id: 96, codigo: 'I12.9', descripcion: 'Enfermedad renal hipertensiva sin insuficiencia renal' },
    { id: 97, codigo: 'I67.4', descripcion: 'Encefalopatía hipertensiva' },
    { id: 98, codigo: 'I82.2', descripcion: 'Embolia y trombosis de vena cava' },
    { id: 99, codigo: 'K35.9', descripcion: 'Apendicitis aguda, no especificada' },
    { id: 100, codigo: 'K52.9', descripcion: 'Colitis y gastroenteritis no infecciosas, no especificadas' },
    { id: 101, codigo: 'K81.0', descripcion: 'Colecistitis aguda' },
    { id: 102, codigo: 'L02.4', descripcion: 'Absceso cutáneo, furúnculo y ántrax de miembro' },
    { id: 103, codigo: 'M05.2', descripcion: 'Vasculitis reumatoide' },
    { id: 104, codigo: 'Q61.2', descripcion: 'Riñón poliquístico, autosómico dominante' },
    { id: 105, codigo: 'R07.4', descripcion: 'Dolor en el pecho, no especificado' },
    { id: 106, codigo: 'R18.X', descripcion: 'Ascitis' },
    { id: 107, codigo: 'R57.2', descripcion: 'Shock séptico' },
    { id: 108, codigo: 'T80.9', descripcion: 'Complicaciones no especificadas consecutivas a infusión, transfusión e inyección terapéutica' },
    { id: 109, codigo: 'T81.0', descripcion: 'Hemorragia y hematoma que complican un procedimiento, no clasificados en otra parte' },
    { id: 110, codigo: 'T85.9', descripcion: 'Complicación no especificada de dispositivo protésico, implante e injerto interno' },
    { id: 111, codigo: 'Y84.9', descripcion: 'Procedimiento médico no especificado' },
    { id: 112, codigo: 'A15.0', descripcion: 'Tuberculosis del pulmón, confirmada por hallazgo microscópico del bacilo tuberculoso en esputo, con o sin cultivo' },
    { id: 113, codigo: 'A41.8', descripcion: 'Otras septicemias especificadas' },
    { id: 114, codigo: 'A56.2', descripcion: 'Infecciones del tracto genitourinario debidas a clamidias, sin otra especificación' },
    { id: 115, codigo: 'A91.X', descripcion: 'Fiebre del dengue hemorrágico' },
    { id: 116, codigo: 'E11.8', descripcion: 'Diabetes mellitus no insulinodependiente, con complicaciones no especificadas' },
    { id: 117, codigo: 'E13.5', descripcion: 'Diabetes mellitus especificada, con complicaciones circulatorias periféricas' },
    { id: 118, codigo: 'E87.8', descripcion: 'Otros trastornos del equilibrio de los electrólitos y de los líquidos, no clasificados en otra parte' },
    { id: 119, codigo: 'G25.3', descripcion: 'Mioclonía' },
    { id: 120, codigo: 'I48.X', descripcion: 'Fibrilación y aleteo auricular' },
    { id: 121, codigo: 'I74.2', descripcion: 'Embolia y trombosis de arterias de los miembros superiores' },
    { id: 122, codigo: 'I74.9', descripcion: 'Embolia y trombosis de arteria no especificada' },
    { id: 123, codigo: 'I80.3', descripcion: 'Flebitis y tromboflebitis de los miembros inferiores, no especificada' },
    { id: 124, codigo: 'I95.8', descripcion: 'Otros tipos de hipotensión' },
    { id: 125, codigo: 'J12.0', descripcion: 'Neumonía debida a adenovirus' },
    { id: 126, codigo: 'J15.7', descripcion: 'Neumonía debida a Mycoplasma pneumoniae' },
    { id: 127, codigo: 'J18.2', descripcion: 'Neumonía hipostática, no especificada' },
    { id: 128, codigo: 'K43.9', descripcion: 'Hernia ventral sin obstrucción ni gangrena' },
    { id: 129, codigo: 'K56.4', descripcion: 'Otras obstrucciones del intestino' },
    { id: 130, codigo: 'K81.9', descripcion: 'Colecistitis, no especificada' },
    { id: 131, codigo: 'K83.0', descripcion: 'Colangitis' },
    { id: 132, codigo: 'K92.1', descripcion: 'Melena' },
    { id: 133, codigo: 'L12.9', descripcion: 'Penfigoide, no especificado' },
    { id: 134, codigo: 'M54.5', descripcion: 'Lumbago no especificado' },
    { id: 135, codigo: 'R07.2', descripcion: 'Dolor precordial' },
    { id: 136, codigo: 'S72.9', descripcion: 'Fractura del fémur, parte no especificada' },
    { id: 137, codigo: 'U07.1', descripcion: 'COVID-19, virus identificado' },
    { id: 138, codigo: 'Y84.0', descripcion: 'Cateterización cardíaca' },
    { id: 139, codigo: 'Z45.9', descripcion: 'Asistencia y ajuste de dispositivo implantado no especificado' },
    { id: 140, codigo: 'Z76.8', descripcion: 'Personas en contacto con los servicios de salud en otras circunstancias especificadas' },
    { id: 141, codigo: 'Z98.8', descripcion: 'Otros estados postquirúrgicos especificados' },
    { id: 142, codigo: 'A08.5', descripcion: 'Otras infecciones intestinales especificadas' },
    { id: 143, codigo: 'A09.9', descripcion: 'Gastroenteritis y colitis de origen no especificado' },
    { id: 144, codigo: 'A49.8', descripcion: 'Otras infecciones bacterianas de sitio no especificado' },
    { id: 145, codigo: 'A97.2', descripcion: 'Fiebre hemorrágica de dengue grave' },
    { id: 146, codigo: 'C50.9', descripcion: 'Tumor maligno de la mama, parte no especificada' },
    { id: 147, codigo: 'C61.X', descripcion: 'Tumor maligno de la próstata' },
    { id: 148, codigo: 'D50.8', descripcion: 'Otras anemias por deficiencia de hierro' },
    { id: 149, codigo: 'D53.9', descripcion: 'Anemia nutricional, no especificada' },
    { id: 150, codigo: 'D68.9', descripcion: 'Defecto de la coagulación, no especificado' },
    { id: 151, codigo: 'E10.1', descripcion: 'Diabetes mellitus insulinodependiente, con cetoacidosis' },
    { id: 152, codigo: 'E10.9', descripcion: 'Diabetes mellitus insulinodependiente, sin mención de complicación' },
    { id: 153, codigo: 'E13.7', descripcion: 'Diabetes mellitus especificada, con complicaciones múltiples' },
    { id: 154, codigo: 'E21.2', descripcion: 'Etros tipos de hiperparatiroidismo' },
    { id: 155, codigo: 'F05.9', descripcion: 'Delirio, no especificado' },
    { id: 156, codigo: 'G40.2', descripcion: 'Epilepsia y síndromes epilépticos sintomáticos relacionados con localizaciones (focales) (parciales) y con ataques parciales complejos' },
    { id: 157, codigo: 'G40.9', descripcion: 'Epilepsia, tipo no especificado' },
    { id: 158, codigo: 'G45.9', descripcion: 'Isquemia cerebral transitoria, sin otra especificación' },
    { id: 159, codigo: 'H33.0', descripcion: 'Desprendimiento de la retina con ruptura' },
    { id: 160, codigo: 'I46.9', descripcion: 'Paro cardíaco, no especificado' },
    { id: 161, codigo: 'I47.1', descripcion: 'Taquicardia supraventricular' },
    { id: 162, codigo: 'I51.9', descripcion: 'Enfermedad cardíaca, no especificada' },
    { id: 163, codigo: 'I67.9', descripcion: 'Enfermedad cerebrovascular, no especificada' },
    { id: 164, codigo: 'I73.9', descripcion: 'Enfermedad vascular periférica, no especificada' },
    { id: 165, codigo: 'I80.1', descripcion: 'Flebitis y tromboflebitis de la vena femoral' },
    { id: 166, codigo: 'I82.8', descripcion: 'Embolia y trombosis de otras venas especificadas' },
    { id: 167, codigo: 'I87.1', descripcion: 'Compresión de vena' },
    { id: 168, codigo: 'I95.0', descripcion: 'Hipotensión idiopática' },
    { id: 169, codigo: 'J20.0', descripcion: 'Bronquitis aguda debida a Mycoplasma pneumoniae' },
    { id: 170, codigo: 'J20.9', descripcion: 'Bronquitis aguda, no especificada' },
    { id: 171, codigo: 'J68.1', descripcion: 'Edema pulmonar agudo debido a inhalación de gases, humos, vapores y sustancias químicas' },
    { id: 172, codigo: 'J80.X', descripcion: 'Síndrome de dificultad respiratoria del adulto' },
    { id: 173, codigo: 'K42.0', descripcion: 'Hernia umbilical con obstrucción, sin gangrena' },
    { id: 174, codigo: 'K60.5', descripcion: 'Fístula anorrectal' },
    { id: 175, codigo: 'K62.5', descripcion: 'Hemorragia del ano y del recto' },
    { id: 176, codigo: 'K80.5', descripcion: 'Cálculo de conducto biliar sin colangitis ni colecistitis' },
    { id: 177, codigo: 'M31.8', descripcion: 'Otras vasculopatías necrotizantes especificadas' },
    { id: 178, codigo: 'M80.9', descripcion: 'Osteoporosis no especificada, con fractura patológica' },
    /*{ id: 179, codigo: 'N18.0', descripcion: 'Insuficiencia renal terminal' },*/
    { id: 180, codigo: 'N93.9', descripcion: 'Hemorragia vaginal y uterina anormal, no especificada' },
    { id: 181, codigo: 'P71.1', descripcion: 'Otra hipocalcemia neonatal' },
    { id: 182, codigo: 'P74.3', descripcion: 'Alteraciones del equilibrio del potasio en el recién nacido' },
    { id: 183, codigo: 'R57.0', descripcion: 'Choque cardiogénico' },
    { id: 184, codigo: 'S27.0', descripcion: 'Neumotórax traumático' },
    { id: 185, codigo: 's72.4', descripcion: 'Fractura de la epífisis inferior del fémur' },
    { id: 186, codigo: 'T81.7', descripcion: 'Complicaciones vasculares consecutivas a procedimiento, no clasificadas en otra parte' },
    { id: 187, codigo: 'Z44.9', descripcion: 'Prueba y ajuste de dispositivo protésico externo no especificado' },
    { id: 188, codigo: 'Z49.2', descripcion: 'Otras diálisis' },
    { id: 189, codigo: 'z99.2', descripcion: 'Dependencia de diálisis renal' },
    { id: 190, codigo: 'A09.0', descripcion: 'Otras  gastroenteritis y colitis de origen infeccioso no especificadas' },
    { id: 191, codigo: 'A18.0', descripcion: 'Tuberculosis de huesos y articulaciones (+)' },
    { id: 192, codigo: 'A20.2', descripcion: 'Peste neumónica' },
    { id: 193, codigo: 'A31.0', descripcion: 'Infecciones por micobacterias pulmonares' },
    { id: 194, codigo: 'A31.9', descripcion: 'Infección por micobacteria, no especificada' },
    { id: 195, codigo: 'A40.9', descripcion: 'Septicemia estreptocócica, no especificada' },
    { id: 196, codigo: 'A41.2', descripcion: 'Septicemia debida a estafilococo no especificado' },
    { id: 197, codigo: 'B95.3', descripcion: 'Streptococcus pneumoniae como causa de enfermedades clasificadas en otros capítulos' },
    { id: 198, codigo: 'C18.9', descripcion: 'Tumor maligno del colon, parte no especificada' },
    { id: 199, codigo: 'C50.0', descripcion: 'Tumor maligno del pezón y aréola mamaria' },
    { id: 200, codigo: 'C67.9', descripcion: 'Tumor maligno de la vejiga urinaria, parte no especificada' },
    { id: 201, codigo: 'C75.0', descripcion: 'Tumor maligno de la glándula paratiroides' },
    { id: 202, codigo: 'C78.6', descripcion: 'Tumor maligno secundario del peritoneo y del retroperitoneo' },
    { id: 203, codigo: 'C83.9', descripcion: 'Linfoma no Hodgkin difuso, sin otra especificación' },
    { id: 204, codigo: 'D21.0', descripcion: 'Tumor benigno del tejido conjuntivo y de otros tejidos blandos de cabeza, cara y cuello' },
    { id: 205, codigo: 'D25.9', descripcion: 'Leiomioma del útero, sin otra especificación' },
    { id: 206, codigo: 'D38.1', descripcion: 'Tumor de comportamiento incierto o desconocido de la tráquea, de los bronquios y del pulmón' },
    { id: 207, codigo: 'D51.9', descripcion: 'Anemia por deficiencia de vitamina B12, sin otra especificación' },
    { id: 208, codigo: 'D62.X', descripcion: 'Anemia posthemorrágica aguda' },
    { id: 209, codigo: 'D63.0', descripcion: 'Anemia en enfermedad neoplásica (C00-D48+) (*)' },
    { id: 210, codigo: 'D68.3', descripcion: 'Trastorno hemorrágico debido a anticoagulantes circulantes' },
    { id: 211, codigo: 'E04.1', descripcion: 'Nódulo tiroideo solitario no tóxico' },
    { id: 212, codigo: 'E10.2', descripcion: 'Diabetes mellitus insulinodependiente, con complicaciones renales' },
    { id: 213, codigo: 'E14.1', descripcion: 'Diabetes mellitus, no especificada, con cetoacidosis' },
    { id: 214, codigo: 'E21.0', descripcion: 'Hiperparatiroidismo primario' },
    { id: 215, codigo: 'E89.2', descripcion: 'Hipoparatiroidismo consecutivo a procedimientos' },
    { id: 216, codigo: 'g31.2', descripcion: 'Degeneración del sistema nervioso debida al alcohol' },
    { id: 217, codigo: 'G40.8', descripcion: 'Otras epilepsias' },
    { id: 218, codigo: 'G51.0', descripcion: 'Parálisis de Bell' },
    { id: 219, codigo: 'G61.9', descripcion: 'Polineuropatía inflamatoria, no especificada' },
    { id: 220, codigo: 'H44.1', descripcion: 'Otras endoftalmitis' },
    { id: 221, codigo: 'I13.1', descripcion: 'Enfermedad cardiorrenal hipertensiva con insuficiencia renal' },
    { id: 222, codigo: 'I15.1', descripcion: 'Hipertensión secundaria a otros trastornos renales' },
    { id: 223, codigo: 'I25.5', descripcion: 'Cardiomiopatía isquémica' },
    { id: 224, codigo: 'I32.0', descripcion: 'Pericarditis en enfermedades bacterianas clasificadas en otra parte (*)' },
    { id: 225, codigo: 'I35.0', descripcion: 'Estenosis (de la válvula) aórtica' },
    { id: 226, codigo: 'I47.9', descripcion: 'Taquicardia paroxística, no especificada' },
    { id: 227, codigo: 'I60.9', descripcion: 'Hemorragia subaracnoidea, no especificada' },
    { id: 228, codigo: 'I61.2', descripcion: 'Hemorragia intracerebral en hemisferio, no especificada' },
    { id: 229, codigo: 'I63.5', descripcion: 'Infarto cerebral debido a oclusión o estenosis no especificada de arterias cerebrales' },
    { id: 230, codigo: 'I67.1', descripcion: 'Aneurisma cerebral, sin ruptura' },
    { id: 231, codigo: 'I67.2', descripcion: 'Aterosclerosis cerebral' },
    { id: 232, codigo: 'I74.1', descripcion: 'Embolia y trombosis de otras porciones y las no especificadas de la aorta' },
    { id: 233, codigo: 'I77.1', descripcion: 'Estrechez arterial' },
    { id: 234, codigo: 'I77.6', descripcion: 'Arteritis, no especificada' },
    { id: 235, codigo: 'I79.2', descripcion: 'Angiopatía periférica en enfermedades clasificadas en otra parte (*)' },
    { id: 236, codigo: 'I79.8', descripcion: 'Otros trastornos de arterias, arteriolas y vasos capilares en enfermedades clasificadas en otra parte (*)' },
    { id: 237, codigo: 'I80.2', descripcion: 'Flebitis y tromboflebitis de otros vasos profundos de los miembros inferiores' },
    { id: 238, codigo: 'I80.9', descripcion: 'Flebitis y tromboflebitis de sitio no especificado' },
    { id: 239, codigo: 'I82.0', descripcion: 'Síndrome de Budd-Chiari' },
    { id: 240, codigo: 'I87.8', descripcion: 'Otros trastornos venosos especificados' },
    { id: 241, codigo: 'J12.9', descripcion: 'Neumonía viral, no especificada' },
    { id: 242, codigo: 'J15.0', descripcion: 'Neumonía debida a Klebsiella pneumoniae' },
    { id: 243, codigo: 'J16.8', descripcion: 'Neumonía debida a otros microorganismos infecciosos especificados' },
    { id: 244, codigo: 'J84.1', descripcion: 'Otras enfermedades pulmonares intersticiales con fibrosis' },
    { id: 245, codigo: 'J96.1', descripcion: 'Insuficiencia respiratoria crónica' },
    { id: 246, codigo: 'J96.9', descripcion: 'Insuficiencia respiratoria, no especificada' },
    { id: 247, codigo: 'K25.3', descripcion: 'Ulcera gástrica, aguda sin hemorragia ni perforación' },
    { id: 248, codigo: 'K26.0', descripcion: 'Ulcera duodenal, aguda con hemorragia' },
    { id: 249, codigo: 'K26.6', descripcion: 'Ulcera duodenal, crónica o no especificada, con hemorragia y perforación' },
    { id: 250, codigo: 'K29.7', descripcion: 'Gastritis, no especificada' },
    { id: 251, codigo: 'K40.2', descripcion: 'Hernia inguinal bilateral, sin obstrucción ni gangrena' },
    { id: 252, codigo: 'K42.1', descripcion: 'Hernia umbilical con gangrena' },
    { id: 253, codigo: 'K52.8', descripcion: 'Otras colitis y gastroenteritis no infecciosas especificadas' },
    { id: 254, codigo: 'K56.5', descripcion: 'Adherencias [bridas] intestinales con obstrucción' },
    { id: 255, codigo: 'K59.1', descripcion: 'Diarrea funcional' },
    { id: 256, codigo: 'K63.2', descripcion: 'Fístula del intestino' },
    { id: 257, codigo: 'K66.1', descripcion: 'Hemoperitoneo' },
    { id: 258, codigo: 'K72.0', descripcion: 'Insuficiencia hepática aguda o subaguda' },
    { id: 259, codigo: 'K86.3', descripcion: 'Seudoquiste del páncreas' },
    { id: 260, codigo: 'L03.2', descripcion: 'Celulitis de la cara' },
    { id: 261, codigo: 'L04.8', descripcion: 'Linfadenitis aguda de otros sitios' },
    { id: 262, codigo: 'L89.9', descripcion: 'Úlcera de decúbito y la zona de presión, no especificado' },
    { id: 263, codigo: 'L95.9', descripcion: 'Vasculitis limitada a la piel, sin otra especificación' },
    { id: 264, codigo: 'L97.X', descripcion: 'Ulcera de miembro inferior, no clasificada en otra parte' },
    { id: 265, codigo: 'M00.9', descripcion: 'Artritis piógena, no especificada' },
    { id: 266, codigo: 'M17.0', descripcion: 'Gonartrosis primaria, bilateral' },
    { id: 267, codigo: 'M30.3', descripcion: 'Síndrome mucocutáneo linfonodular [Kawasaki]' },
    { id: 268, codigo: 'M31.3', descripcion: 'Granulomatosis de Wegener' },
    { id: 269, codigo: 'M46.2', descripcion: 'Osteomielitis de vértebra' },
    { id: 270, codigo: 'M46.4', descripcion: 'Discitis, no especificada' },
    { id: 271, codigo: 'M79.6', descripcion: 'Dolor en miembro' },
    { id: 272, codigo: 'N02.9', descripcion: 'Hematuria recurrente y persistente, no especificada' },
    { id: 273, codigo: 'N15.1', descripcion: 'Absceso renal y perirrenal' },
    { id: 274, codigo: 'N39.9', descripcion: 'Trastorno del sistema urinario, no especificado' },
    { id: 275, codigo: 'N42.9', descripcion: 'Trastorno de la próstata, no especificado' },
    { id: 276, codigo: 'N43.3', descripcion: 'Hidrocele, no especificado' },
    { id: 277, codigo: 'P36.9', descripcion: 'Sepsis bacteriana del recién nacido, no especificada' },
    { id: 278, codigo: 'Q20.0', descripcion: 'Tronco arterioso común' },
    { id: 279, codigo: 'Q61.3', descripcion: 'Riñón poliquístico, tipo no especificado' },
    { id: 280, codigo: 'R04.0', descripcion: 'Epistaxis' },
    { id: 281, codigo: 'R04.2', descripcion: 'Hemoptisis' },
    { id: 282, codigo: 'R10.3', descripcion: 'Dolor localizado en otras partes inferiores del abdomen' },
    { id: 283, codigo: 'R31.X', descripcion: 'Hematuria, no especificada' },
    { id: 284, codigo: 'R39.2', descripcion: 'Uremia extrarrenal' },
    { id: 285, codigo: 'R42.X', descripcion: 'Mareo y desvanecimiento' },
    { id: 286, codigo: 'R52.0', descripcion: 'Dolor agudo' },
    { id: 287, codigo: 'S06.9', descripcion: 'Traumatismo intracraneal, no especificado' },
    { id: 288, codigo: 'S32.0', descripcion: 'Fractura de vértebra lumbar' },
    { id: 289, codigo: 'S42.2', descripcion: 'Fractura de la epífisis superior del húmero' },
    { id: 290, codigo: 'S82.0', descripcion: 'Fractura de la rótula' },
    { id: 291, codigo: 'S82.9', descripcion: 'Fractura de la pierna, parte no especificada' },
    { id: 292, codigo: 'T81.4', descripcion: 'Infección consecutiva a procedimiento, no clasificada en otra parte' },
    { id: 293, codigo: 'T82.0', descripcion: 'Complicación mecánica de prótesis de válvula cardíaca' },
    { id: 294, codigo: 'T82.7', descripcion: 'Infección y reacción inflamatoria debidas a otros dispositivos, implantes e injertos cardiovasculares' },
    { id: 295, codigo: 'T83.0', descripcion: 'Complicación mecánica de catéter urinario (fijo)' },
    { id: 296, codigo: 'T83.9', descripcion: 'Complicación no especificada de dispositivo protésico, implante e injerto genitourinario' },
    { id: 297, codigo: 'Y83.6', descripcion: 'Remoción de otro órgano (parcial) (total)' },
    { id: 298, codigo: 'Z01.8', descripcion: 'Otros exámenes especiales especificados' },
    { id: 299, codigo: 'Z45.8', descripcion: 'Asistencia y ajuste de otros dispositivos implantados' },
    { id: 300, codigo: 'Z48.8', descripcion: 'Otros cuidados especificados posteriores a la cirugía' },
    { id: 301, codigo: 'Z48.9', descripcion: 'Cuidado posterior a la cirugía, no especificado' },
    { id: 302, codigo: 'Z90.5', descripcion: 'Ausencia adquirida de riñón' },
    { id: 303, codigo: 'Z95.5', descripcion: 'Presencia de angioplastia, injertos y prótesis coronarias' },
    { id: 304, codigo: 'A01.1', descripcion: 'Fiebre paratifoidea A' },
    { id: 305, codigo: 'A02.2', descripcion: 'Infecciones localizadas debidas a Salmonella' },
    { id: 306, codigo: 'A02.9', descripcion: 'Infección debida a Salmonella, no especificada' },
    { id: 307, codigo: 'A04.4', descripcion: 'Otras infecciones intestinales debidas a Escherichia coli' },
    { id: 308, codigo: 'A04.7', descripcion: 'Enterocolitis debida a Clostridium difficile' },
    { id: 309, codigo: 'A04.8', descripcion: 'Otras infecciones intestinales bacterianas especificadas' },
    { id: 310, codigo: 'A08.0', descripcion: 'Enteritis debida a rotavirus' },
    { id: 311, codigo: 'A15.6', descripcion: 'Pleuresía tuberculosa, confirmada bacteriológica e histológicamente' },
    { id: 312, codigo: 'A15.9', descripcion: 'Tuberculosis respiratoria no especificada, confirmada bacteriológica e histológicamente' },
    { id: 313, codigo: 'A17.0', descripcion: 'Meningitis tuberculosa (G01*) (+)' },
    { id: 314, codigo: 'A18.8', descripcion: 'Tuberculosis de otros órganos especificados' },
    { id: 315, codigo: 'A19.9', descripcion: 'Tuberculosis miliar, sin otra especificación' },
    { id: 316, codigo: 'A20.7', descripcion: 'Peste septicémica' },
    { id: 317, codigo: 'A30.1', descripcion: 'Lepra tuberculoide' },
    { id: 318, codigo: 'A36.0', descripcion: 'Difteria faríngea' },
    { id: 319, codigo: 'A39.5', descripcion: 'Enfermedad cardíaca debida a meningococo (+)' },
    { id: 320, codigo: 'A40.8', descripcion: 'Otras septicemias estreptocócicas' },
    { id: 321, codigo: 'A41.1', descripcion: 'Septicemia debida a otro estafilococo especificado' },
    { id: 322, codigo: 'A41.5', descripcion: 'Septicemia debida a otros organismos gramnegativos' },
    { id: 323, codigo: 'A48.8', descripcion: 'Otras enfermedades bacterianas especificadas' },
    { id: 324, codigo: 'A52.0', descripcion: 'Sífilis cardiovascular (+)' },
    { id: 325, codigo: 'A54.1', descripcion: 'Infección gonocócica del tracto genitourinario inferior con absceso periuretral y de glándulas accesorias' },
    { id: 326, codigo: 'A56.0', descripcion: 'Infección del tracto genitourinario inferior debida a clamidias' },
    { id: 327, codigo: 'A60.9', descripcion: 'Infección anogenital por virus del herpes simple, sin otra especificación' },
    { id: 328, codigo: 'A86.X', descripcion: 'Encefalitis viral, no especificada' },
    { id: 329, codigo: 'A88.1', descripcion: 'Vértigo epidémico' },
    { id: 330, codigo: 'A97.0', descripcion: 'DENGUE SIN SEÑALES DE ALARMA' },
    { id: 331, codigo: 'A97.9', descripcion: 'Dengue, no especificado' },
    { id: 332, codigo: 'A98.8', descripcion: 'Otras fiebres hemorrágicas virales especificadas' },
    { id: 333, codigo: 'B02.2', descripcion: 'Herpes zoster con otros compromisos del sistema nervioso (+)' },
    { id: 334, codigo: 'B02.3', descripcion: 'Herpes zoster ocular' },
    { id: 335, codigo: 'B34.9', descripcion: 'Infección viral, no especificada' },
    { id: 336, codigo: 'B37.7', descripcion: 'Septicemia debida a candida' },
    { id: 337, codigo: 'B47.9', descripcion: 'Micetoma, no especificado' },
    { id: 338, codigo: 'B59.X', descripcion: 'Neumocistosis (J17.3*) (+)' },
    { id: 339, codigo: 'B96.1', descripcion: 'Klebsiella pneumoniae [K. pneumoniae] como causa de enfermedades clasificadas en otros capítulos' },
    { id: 340, codigo: 'B96.5', descripcion: 'Pseudomonas (aeruginosa) (mallei) (pseudomallei) como causa de enfermedades clasificadas en otros capítulos' },
    { id: 341, codigo: 'C16.9', descripcion: 'Tumor maligno del estómago, parte no especificada' },
    { id: 342, codigo: 'C18.2', descripcion: 'Tumor maligno del colon ascendente' },
    { id: 343, codigo: 'C18.4', descripcion: 'Tumor maligno del colon transverso' },
    { id: 344, codigo: 'C18.8', descripcion: 'Lesión de sitios contiguos del colon' },
    { id: 345, codigo: 'C20.X', descripcion: 'Tumor maligno del recto' },
    { id: 346, codigo: 'C24.8', descripcion: 'Lesión de sitios contiguos de las vías biliares' },
    { id: 347, codigo: 'C24.9', descripcion: 'Tumor maligno de las vías biliares, parte no especificada' },
    { id: 348, codigo: 'C25.9', descripcion: 'Tumor maligno del páncreas, parte no especificada' },
    { id: 349, codigo: 'C44.9', descripcion: 'Tumor maligno de la piel, sitio no especificado' },
    { id: 350, codigo: 'C48.1', descripcion: 'Tumor maligno de parte especificada del peritoneo' },
    { id: 351, codigo: 'C48.8', descripcion: 'Lesión de sitios contiguos del peritoneo y del retroperitoneo' },
    { id: 352, codigo: 'C49.9', descripcion: 'Tumor maligno del tejido conjuntivo y tejido blando, de sitio no especificado' },
    { id: 353, codigo: 'C53.9', descripcion: 'Tumor maligno del cuello del útero, sin otra especificación' },
    { id: 354, codigo: 'C54.1', descripcion: 'Tumor maligno del endometrio' },
    { id: 355, codigo: 'C54.9', descripcion: 'Tumor maligno del cuerpo del útero, parte no especificada' },
    { id: 356, codigo: 'C56.X', descripcion: 'Tumor maligno del ovario' },
    { id: 357, codigo: 'C60.9', descripcion: 'Tumor maligno del pene, parte no especificada' },
    { id: 358, codigo: 'C73.X', descripcion: 'Tumor maligno de la glándula tiroides' },
    { id: 359, codigo: 'C78.0', descripcion: 'Tumor maligno secundario del pulmón' },
    { id: 360, codigo: 'C80.0', descripcion: 'TUMOR MALIGNO DE SITIO PRIMARIO DESCONOCIDO, ASI DESCRITO' },
    { id: 361, codigo: 'C80.9', descripcion: 'Tumor maligno, sitio primario no especificado' },
    { id: 362, codigo: 'C82.9', descripcion: 'Linfoma no Hodgkin folicular, sin otra especificación' },
    { id: 363, codigo: 'C92.0', descripcion: 'Leucemia mieloide aguda' },
    { id: 364, codigo: 'C92.1', descripcion: 'Leucemia mieloide crónica' },
    { id: 365, codigo: 'C97.X', descripcion: 'Tumores malignos (primarios) de sitios múltiples independientes' },
    { id: 366, codigo: 'D01.0', descripcion: 'Carcinoma in situ del colon' },
    { id: 367, codigo: 'D10.6', descripcion: 'Tumor benigno de la nasofaringe' },
    { id: 368, codigo: 'D12.9', descripcion: 'Tumor benigno del conducto anal y del ano' },
    { id: 369, codigo: 'D17.0', descripcion: 'Tumor benigno lipomatoso de piel y de tejido subcutáneo de cabeza, cara y cuello' },
    { id: 370, codigo: 'D27.X', descripcion: 'Tumor benigno del ovario' },
    { id: 371, codigo: 'd29.2', descripcion: 'Tumor benigno de los testículos' },
    { id: 372, codigo: 'D33.2', descripcion: 'Tumor benigno del encéfalo, parte no especificada' },
    { id: 373, codigo: 'D34.X', descripcion: 'Tumor benigno de la glándula tiroides' },
    { id: 374, codigo: 'D35.1', descripcion: 'Tumor benigno de la glándula paratiroides' },
    { id: 375, codigo: 'D35.2', descripcion: 'Tumor benigno de la hipófisis' },
    { id: 376, codigo: 'D39.1', descripcion: 'Tumor de comportamiento incierto o desconocido del ovario' },
    { id: 377, codigo: 'D41.0', descripcion: 'Tumor de comportamiento incierto o desconocido del riñón' },
    { id: 378, codigo: 'D46.0', descripcion: 'Anemia refractaria sin sideroblastos, así descrita' },
    { id: 379, codigo: 'D47.2', descripcion: 'Gammopatía monoclonal' },
    { id: 380, codigo: 'D48.3', descripcion: 'Tumor de comportamiento incierto o desconocido del retroperitoneo' },
    { id: 381, codigo: 'D48.9', descripcion: 'Tumor de comportamiento incierto o desconocido, de sitio no especificado' },
    { id: 382, codigo: 'D58.9', descripcion: 'Anemia hemolítica hereditaria, sin otra especificación' },
    { id: 383, codigo: 'D61.8', descripcion: 'Otras anemias aplásticas especificadas' },
    { id: 384, codigo: 'D64.8', descripcion: 'Otras anemias especificadas' },
    { id: 385, codigo: 'D68.4', descripcion: 'Deficiencia adquirida de factores de la coagulación' },
    { id: 386, codigo: 'D68.8', descripcion: 'Otros defectos especificados de la coagulación' },
    { id: 387, codigo: 'D69.0', descripcion: 'Púrpura alérgica' },
    { id: 388, codigo: 'D69.5', descripcion: 'Tombocitopenia secundaria' },
    { id: 389, codigo: 'D69.6', descripcion: 'Trombocitopenia no especificada' },
    { id: 390, codigo: 'D69.8', descripcion: 'Otras afecciones hemorrágicas especificadas' },
    { id: 391, codigo: 'E03.9', descripcion: 'Hipotiroidismo, no especificado' },
    { id: 392, codigo: 'E05.9', descripcion: 'Tirotoxicosis, no especificada' },
    { id: 393, codigo: 'E10.8', descripcion: 'Diabetes mellitus insulinodependiente, con complicaciones no especificadas' },
    { id: 394, codigo: 'E11.1', descripcion: 'Diabetes mellitus no insulinodependiente, con cetoacidosis' },
    { id: 395, codigo: 'E11.6', descripcion: 'Diabetes mellitus no insulinodependiente, con otras complicaciones especificadas' },
    { id: 396, codigo: 'E12.5', descripcion: 'Diabetes mellitus asociada con desnutrición, con complicaciones circulatorias periféricas' },
    { id: 397, codigo: 'E13.6', descripcion: 'Diabetes mellitus especificada, con otras complicaciones especificadas' },
    { id: 398, codigo: 'E13.8', descripcion: 'Diabetes mellitus especificada, con complicaciones no especificadas' },
    { id: 399, codigo: 'E14.2', descripcion: 'Diabetes mellitus, no especificada, con complicaciones renales' },
    { id: 400, codigo: 'E16.1', descripcion: 'Otras hipoglicemias' },
    { id: 401, codigo: 'E21.5', descripcion: 'Trastorno de la glándula paratiroides, no especificado' },
    { id: 402, codigo: 'E22.1', descripcion: 'Hiperprolactinemia' },
    { id: 403, codigo: 'E26.1', descripcion: 'Hiperaldosteronismo secundario' },
    { id: 404, codigo: 'E27.8', descripcion: 'Otros trastornos especificados de la glándula suprarrenal' },
    { id: 405, codigo: 'E51.2', descripcion: 'Encefalopatía de Wernicke' },
    { id: 406, codigo: 'E65.X', descripcion: 'Adiposidad localizada' },
    { id: 407, codigo: 'E80.1', descripcion: 'Porfiria cutánea tardía' },
    { id: 408, codigo: 'E83.5', descripcion: 'Trastornos del metabolismo del calcio' },
    { id: 409, codigo: 'E86.X', descripcion: 'Depleción del volumen' },
    { id: 410, codigo: 'E87.2', descripcion: 'Acidosis' },
    { id: 411, codigo: 'E87.4', descripcion: 'Trastornos mixtos del balance ácido-básico' },
    { id: 412, codigo: 'F03.X', descripcion: 'Demencia, no especificada' },
    { id: 413, codigo: 'F09.X', descripcion: 'Trastorno mental orgánico o sintomático, no especificado' },
    { id: 414, codigo: 'f20.0', descripcion: 'Esquizofrenia paranoide' },
    { id: 415, codigo: 'F29.X', descripcion: 'Psicosis de origen no orgánico, no especificada' },
    { id: 416, codigo: 'F32.0', descripcion: 'Episodio depresivo leve' },
    { id: 417, codigo: 'F40.8', descripcion: 'Otros trastornos fóbicos de ansiedad' },
    { id: 418, codigo: 'F44.5', descripcion: 'Convulsiones disociativas' },
    { id: 419, codigo: 'F71.9', descripcion: 'Retraso mental moderado, deterioro del comportamiento de grado no especificado' },
    { id: 420, codigo: 'G00.9', descripcion: 'Meningitis bacteriana, no especificada' },
    { id: 421, codigo: 'G04.9', descripcion: 'Encefalitis, mielitis y encefalomielitis, no especificadas' },
    { id: 422, codigo: 'G44.1', descripcion: 'Cefalea vascular, NCOP' },
    { id: 423, codigo: 'G44.2', descripcion: 'Cefalea debida a tensión' },
    { id: 424, codigo: 'G45.8', descripcion: 'Otras isquemias cerebrales transitorias y síndromes afines' },
    { id: 425, codigo: 'G46.8', descripcion: 'Otros síndromes vasculares encefálicos en enfermedades cerebrovasculares (I60-I67+) (*)' },
    { id: 426, codigo: 'G47.0', descripcion: 'Trastornos del inicio y del mantenimiento del sueño [insomnios]' },
    { id: 427, codigo: 'G56.0', descripcion: 'Síndrome del túnel carpiano' },
    { id: 428, codigo: 'G58.9', descripcion: 'Mononeuropatía, no especificada' },
    { id: 429, codigo: 'G61.8', descripcion: 'Otras polineuropatías inflamatorias' },
    { id: 430, codigo: 'G63.8', descripcion: 'Polineuropatía en otras enfermedades clasificadas en otra parte (*)' },
    { id: 431, codigo: 'G80.2', descripcion: 'Hemiplejía infantil' },
    { id: 432, codigo: 'G93.4', descripcion: 'Encefalopatía no especificada' },
    { id: 433, codigo: 'G93.6', descripcion: 'Edema cerebral' },
    { id: 434, codigo: 'G93.9', descripcion: 'Trastorno del encéfalo, no especificado' },
    { id: 435, codigo: 'G99.2', descripcion: 'Mielopatía en enfermedades clasificadas en otra parte (*)' },
    { id: 436, codigo: 'H16.1', descripcion: 'Otras queratitis superficiales sin conjuntivitis' },
    { id: 437, codigo: 'H25.2', descripcion: 'Catarata senil, tipo morgagnian' },
    { id: 438, codigo: 'H25.9', descripcion: 'Catarata senil, no especificada' },
    { id: 439, codigo: 'H26.2', descripcion: 'Catarata complicada' },
    { id: 440, codigo: 'H26.9', descripcion: 'Catarata, no especificada' },
    { id: 441, codigo: 'H27.0', descripcion: 'Afaquia' },
    { id: 442, codigo: 'H33.5', descripcion: 'Otros desprendimientos de la retina' },
    { id: 443, codigo: 'h35.8', descripcion: 'Otros trastornos especificados de la retina' },
    { id: 444, codigo: 'H40.2', descripcion: 'Glaucoma primario de ángulo cerrado' },
    { id: 445, codigo: 'H40.9', descripcion: 'Glaucoma, no especificado' },
    { id: 446, codigo: 'H45.8', descripcion: 'Otros trastornos del cuerpo vítreo y del globo ocular en enfermedades clasificadas en otra parte (*)' },
    { id: 447, codigo: 'H52.7', descripcion: 'Trastorno de la refracción, no especificado' },
    { id: 448, codigo: 'H73.9', descripcion: 'Trastorno de la membrana timpánica, no especificado' },
    { id: 449, codigo: 'H81.1', descripcion: 'Vértigo paroxístico benigno' },
    { id: 450, codigo: 'H82.X', descripcion: 'Síndromes vertiginosos en enfermedades clasificadas en otra parte (*)' },
    { id: 451, codigo: 'H90.3', descripcion: 'Hipoacusia neurosensorial, bilateral' },
    { id: 452, codigo: 'I02.0', descripcion: 'Corea reumática con complicación cardíaca' },
    { id: 453, codigo: 'I05.9', descripcion: 'Enfermedad valvular mitral, no especificada' },
    { id: 454, codigo: 'I13.0', descripcion: 'Enfermedad cardiorrenal hipertensiva con insuficiencia cardíaca (congestiva)' },
    { id: 455, codigo: 'I13.2', descripcion: 'Enfermedad cardiorrenal hipertensiva con insuficiencia cardíaca (congestiva) e insuficiencia renal' },
    { id: 456, codigo: 'I13.9', descripcion: 'Enfermedad cardiorrenal hipertensiva, no especificada' },
    { id: 457, codigo: 'I15.0', descripcion: 'Hipertensión renovascular' },
    { id: 458, codigo: 'I15.9', descripcion: 'Hipertensión secundaria, no especificada' },
    { id: 459, codigo: 'I21.0', descripcion: 'Infarto transmural agudo del miocardio de la pared anterior' },
    { id: 460, codigo: 'I21.4', descripcion: 'Infarto subendocárdico agudo del miocardio' },
    { id: 461, codigo: 'I23.8', descripcion: 'Otras complicaciones presentes posteriores al infarto agudo del miocardio' },
    { id: 462, codigo: 'I24.9', descripcion: 'Enfermedad isquémica aguda del corazón, no especificada' },
    { id: 463, codigo: 'I25.2', descripcion: 'Infarto antiguo del miocardio' },
    { id: 464, codigo: 'I25.9', descripcion: 'Enfermedad isquémica crónica del corazón, no especificada' },
    { id: 465, codigo: 'I26.0', descripcion: 'Embolia pulmonar con mención de corazón pulmonar agudo' },
    { id: 466, codigo: 'i26.9', descripcion: 'Embolia pulmonar sin mención de corazón pulmonar agudo' },
    { id: 467, codigo: 'I27.2', descripcion: 'Otras hipertensiones pulmonares secundarias' },
    { id: 468, codigo: 'I30.1', descripcion: 'Pericarditis infecciosa' },
    { id: 469, codigo: 'I30.9', descripcion: 'Pericarditis aguda, no especificada' },
    { id: 470, codigo: 'I40.9', descripcion: 'Miocarditis aguda, no especificada' },
    { id: 471, codigo: 'I42.8', descripcion: 'Otras cardiomiopatías' },
    { id: 472, codigo: 'I42.9', descripcion: 'Cardiomiopatía, no especificada' },
    { id: 473, codigo: 'I44.1', descripcion: 'Bloqueo auriculoventricular de segundo grado' },
    { id: 474, codigo: 'I44.2', descripcion: 'Bloqueo auriculoventricular completo' },
    { id: 475, codigo: 'I46.0', descripcion: 'Paro cardíaco con resucitación exitosa' },
    { id: 476, codigo: 'I48.0', descripcion: 'Fibrilación auricular paroxística' },
    { id: 477, codigo: 'I48.9', descripcion: 'Fibrilación auricular y el aleteo auricular, sin otra especificación' },
    { id: 478, codigo: 'I49.0', descripcion: 'Fibrilación y aleteo ventricular' },
    { id: 479, codigo: 'I49.8', descripcion: 'Otras arritmias cardíacas especificadas' },
    { id: 480, codigo: 'I50.1', descripcion: 'Insuficiencia ventricular izquierda' },
    { id: 481, codigo: 'I51.6', descripcion: 'Enfermedad cardiovascular, no especificada' },
    { id: 482, codigo: 'I60.0', descripcion: 'Hemorragia subaracnoidea de sifón y bifurcación carotídea' },
    { id: 483, codigo: 'I60.1', descripcion: 'Hemorragia subaracnoidea de arteria cerebral media' },
    { id: 484, codigo: 'I60.3', descripcion: 'Hemorragia subaracnoidea de arteria comunicante posterior' },
    { id: 485, codigo: 'I61.0', descripcion: 'Hemorragia intracerebral en hemisferio, subcortical' },
    { id: 486, codigo: 'I61.1', descripcion: 'Hemorragia intracerebral en hemisferio, cortical' },
    { id: 487, codigo: 'I61.4', descripcion: 'Hemorragia intraencefálica en cerebelo' },
    { id: 488, codigo: 'I61.8', descripcion: 'Otras hemorragias intraencefálicas' },
    { id: 489, codigo: 'I62.0', descripcion: 'Hemorragia subdural (aguda) (no traumática)' },
    { id: 490, codigo: 'I62.9', descripcion: 'Hemorragia intracraneal (no traumática), no especificada' },
    { id: 491, codigo: 'I63.0', descripcion: 'Infarto cerebral debido a trombosis de arterias precerebrales' },
    { id: 492, codigo: 'I63.1', descripcion: 'Infarto cerebral debido a embolia de arterias precerebrales' },
    { id: 493, codigo: 'I63.3', descripcion: 'Infarto cerebral debido a trombosis de arterias cerebrales' },
    { id: 494, codigo: 'I63.8', descripcion: 'Otros infartos cerebrales' },
    { id: 495, codigo: 'I65.2', descripcion: 'Oclusión y estenosis de arteria carótida' },
    { id: 496, codigo: 'I67.7', descripcion: 'Arteritis cerebral, no clasificada en otra parte' },
    { id: 497, codigo: 'I67.8', descripcion: 'Otras enfermedades cerebrovasculares especificadas' },
    { id: 498, codigo: 'I69.1', descripcion: 'Secuelas de hemorragia intraencefálica' },
    { id: 499, codigo: 'I69.3', descripcion: 'Secuelas de infarto cerebral' },
    { id: 500, codigo: 'I69.4', descripcion: 'Secuelas de accidente vascular encefálico, no especificado como hemorrágico o isquémico' },
    { id: 501, codigo: 'I69.8', descripcion: 'Secuelas de otras enfermedades cerebrovasculares y de las no especificadas' },
    { id: 502, codigo: 'I70.1', descripcion: 'Aterosclerosis de la arteria renal' },
    { id: 503, codigo: 'I70.2', descripcion: 'Aterosclerosis de las arterias de los miembros' },
    { id: 504, codigo: 'I70.9', descripcion: 'Aterosclerosis generalizada y la no especificada' },
    { id: 505, codigo: 'I72.1', descripcion: 'Aneurisma de arteria del miembro superior' },
    { id: 506, codigo: 'I73.8', descripcion: 'Otras enfermedades vasculares periféricas especificadas' },
    { id: 507, codigo: 'I74.3', descripcion: 'Embolia y trombosis de arterias de los miembros inferiores' },
    { id: 508, codigo: 'I74.4', descripcion: 'Embolia y trombosis de arterias de los miembros, no especificadas' },
    { id: 509, codigo: 'I77.2', descripcion: 'Ruptura arterial' },
    { id: 510, codigo: 'I77.9', descripcion: 'Trastorno de arterias y arteriolas, no especificado' },
    { id: 511, codigo: 'I80.8', descripcion: 'Flebitis y tromboflebitis de otros sitios' },
    { id: 512, codigo: 'i82.1', descripcion: 'Tromboflebitis migratoria' },
    { id: 513, codigo: 'I82.3', descripcion: 'Embolia y trombosis de vena renal' },
    { id: 514, codigo: 'I82.9', descripcion: 'Embolia y trombosis de vena no especificada' },
    { id: 515, codigo: 'I83.2', descripcion: 'Venas varicosas de los miembros inferiores con úlcera e inflamación' },
    { id: 516, codigo: 'I84.5', descripcion: 'Hemorroides externas sin complicación' },
    { id: 517, codigo: 'I84.8', descripcion: 'Hemorroides no especificadas, con otras complicaciones' },
    { id: 518, codigo: 'I84.9', descripcion: 'Hemorroides no especificadas, sin complicación' },
    { id: 519, codigo: 'I87.2', descripcion: 'Insuficiencia venosa (crónica) (periférica)' },
    { id: 520, codigo: 'I95.1', descripcion: 'Hipotensión ortostática' },
    { id: 521, codigo: 'I97.9', descripcion: 'Trastorno no especificado del sistema circulatorio consecutivo a procedimientos' },
    { id: 522, codigo: 'I99.X', descripcion: 'Otros trastornos y los no especificados del sistema circulatorio' },
    { id: 523, codigo: 'J02.9', descripcion: 'Faringitis aguda, no especificada' },
    { id: 524, codigo: 'J04.1', descripcion: 'Traqueítis aguda' },
    { id: 525, codigo: 'J04.2', descripcion: 'Laringotraqueítis aguda' },
    { id: 526, codigo: 'J06.9', descripcion: 'Infección aguda de las vías respiratorias superiores, no especificada' },
    { id: 527, codigo: 'J12.8', descripcion: 'Neumonía debida a otros virus' },
    { id: 528, codigo: 'J15.2', descripcion: 'Neumonía debida a estafilococos' },
    { id: 529, codigo: 'J16.0', descripcion: 'Neumonía debida a clamidias' },
    { id: 530, codigo: 'J18.9', descripcion: 'Neumonía, no especificada' },
    { id: 531, codigo: 'J20.2', descripcion: 'Bronquitis aguda debida a estreptococos' },
    { id: 532, codigo: 'J20.7', descripcion: 'Bronquitis aguda debida a virus Echo' },
    { id: 533, codigo: 'J22.X', descripcion: 'Infección aguda no especificada de las vías respiratorias inferiores' },
    { id: 534, codigo: 'J32.3', descripcion: 'Sinusitis esfenoidal crónica' },
    { id: 535, codigo: 'J32.9', descripcion: 'Sinusitis crónica, no especificada' },
    { id: 536, codigo: 'J38.6', descripcion: 'Estenosis laríngea' },
    { id: 537, codigo: 'J41.0', descripcion: 'Bronquitis crónica simple' },
    { id: 538, codigo: 'J44.0', descripcion: 'Enfermedad pulmonar obstructiva crónica con infección aguda de las vías respiratorias inferiores' },
    { id: 539, codigo: 'J44.1', descripcion: 'Enfermedad pulmonar obstructiva crónica con exacerbación aguda, no especificada' },
    { id: 540, codigo: 'J44.9', descripcion: 'Enfermedad pulmonar obstructiva crónica, no especificada' },
    { id: 541, codigo: 'J45.0', descripcion: 'Asma predominantemente alérgica' },
    { id: 542, codigo: 'J45.9', descripcion: 'Asma, no especificada' },
    { id: 543, codigo: 'J61.X', descripcion: 'Neumoconiosis debida al asbesto y a otras fibras minerales' },
    { id: 544, codigo: 'J69.8', descripcion: 'Neumonitis debida a aspiración de otros sólidos y líquidos' },
    { id: 545, codigo: 'J70.4', descripcion: 'Trastornos pulmonares intersticiales no especificados inducidos por drogas' },
    { id: 546, codigo: 'J82.X', descripcion: 'Eosinofilia pulmonar, no clasificada en otra parte' },
    { id: 547, codigo: 'J84.0', descripcion: 'Afecciones alveolares y alveoloparietales' },
    { id: 548, codigo: 'J85.2', descripcion: 'Absceso del pulmón sin neumonía' },
    { id: 549, codigo: 'J86.9', descripcion: 'Piotórax sin fístula' },
    { id: 550, codigo: 'J91.X', descripcion: 'Derrame pleural en afecciones clasificadas en otra parte (*)' },
    { id: 551, codigo: 'J93.9', descripcion: 'Neumotórax, no especificado' },
    { id: 552, codigo: 'J94.2', descripcion: 'Hemotórax' },
    { id: 553, codigo: 'J94.8', descripcion: 'Otras afecciones especificadas de la pleura' },
    { id: 554, codigo: 'J94.9', descripcion: 'Afección pleural, no especificada' },
    { id: 555, codigo: 'J95.0', descripcion: 'Funcionamiento defectuoso de la traqueostomía' },
    { id: 556, codigo: 'J95.5', descripcion: 'Estenosis subglótica consecutiva a procedimientos' },
    { id: 557, codigo: 'J95.8', descripcion: 'Otros trastornos respiratorios consecutivos a procedimientos' },
    { id: 558, codigo: 'J98.0', descripcion: 'Enfermedades de la tráquea y de los bronquios, no clasificadas en otra parte' },
    { id: 559, codigo: 'J98.8', descripcion: 'Otros trastornos respiratorios especificados' },
    { id: 560, codigo: 'K04.7', descripcion: 'Absceso periapical sin fístula' },
    { id: 561, codigo: 'K13.7', descripcion: 'Otras lesiones y las no especificadas de la mucosa bucal' },
    { id: 562, codigo: 'K22.5', descripcion: 'Divertículo del esófago, adquirido' },
    { id: 563, codigo: 'K25.2', descripcion: 'Ulcera gástrica, aguda con hemorragia y perforación' },
    { id: 564, codigo: 'K25.9', descripcion: 'Ulcera gástrica, no especificada como aguda ni crónica, sin hemorragia ni perforación' },
    { id: 565, codigo: 'K26.4', descripcion: 'Ulcera duodenal, crónica o no especificada, con hemorragia' },
    { id: 566, codigo: 'K26.9', descripcion: 'Ulcera duodenal, no especificada como aguda ni crónica, sin hemorragia ni perforación' },
    { id: 567, codigo: 'K27.3', descripcion: 'Ulcera péptica, de sitio no especificado, aguda sin hemorragia ni perforación' },
    { id: 568, codigo: 'K29.0', descripcion: 'Gastritis aguda hemorrágica' },
    { id: 569, codigo: 'K29.1', descripcion: 'Otras gastritis agudas' },
    { id: 570, codigo: 'K29.5', descripcion: 'Gastritis crónica, no especificada' },
    { id: 571, codigo: 'K29.6', descripcion: 'Otras gastritis' },
    { id: 572, codigo: 'K29.9', descripcion: 'Gastroduodenitis, no especificada' },
    { id: 573, codigo: 'K30.X', descripcion: 'Dispepsia' },
    { id: 574, codigo: 'K37.X', descripcion: 'Apendicitis, no especificada' },
    { id: 575, codigo: 'K38.9', descripcion: 'Enfermedad del apéndice, no especificada' },
    { id: 576, codigo: 'K40.3', descripcion: 'Hernia inguinal unilateral o no especificada, con obstrucción, sin gangrena' },
    { id: 577, codigo: 'K43.1', descripcion: 'Hernia ventral con gangrena' },
    { id: 578, codigo: 'K46.0', descripcion: 'Hernia abdominal no especificada, con obstrucción, sin gangrena' },
    { id: 579, codigo: 'K46.9', descripcion: 'Hernia abdominal no especificada, sin obstrucción ni gangrena' },
    { id: 580, codigo: 'K50.9', descripcion: 'Enfermedad de Crohn, no especificada' },
    { id: 581, codigo: 'K55.9', descripcion: 'Trastorno vascular del intestino, no especificado' },
    { id: 582, codigo: 'k56.0', descripcion: 'Ileo paralítico' },
    { id: 583, codigo: 'K56.6', descripcion: 'Otras obstrucciones intestinales y las no especificadas' },
    { id: 584, codigo: 'k57.9', descripcion: 'Enfermedad diverticular del intestino, parte no especificada, sin perforación ni absceso' },
    { id: 585, codigo: 'K58.0', descripcion: 'Síndrome del colon irritable con diarrea' },
    { id: 586, codigo: 'K59.0', descripcion: 'ConTIPación' },
    { id: 587, codigo: 'K60.3', descripcion: 'Fístula anal' },
    { id: 588, codigo: 'K61.1', descripcion: 'Absceso rectal' },
    { id: 589, codigo: 'K62.3', descripcion: 'Prolapso rectal' },
    { id: 590, codigo: 'K63.0', descripcion: 'Absceso del intestino' },
    { id: 591, codigo: 'K63.5', descripcion: 'Pólipo del colon' },
    { id: 592, codigo: 'K66.9', descripcion: 'Trastorno del peritoneo, no especificado' },
    { id: 593, codigo: 'K70.9', descripcion: 'Enfermedad hepática alcohólica, no especificada' },
    { id: 594, codigo: 'K71.8', descripcion: 'Enfermedad tóxica del hígado con otros trastornos hepáticos' },
    { id: 595, codigo: 'K72.9', descripcion: 'Insuficiencia hepática, no especificada' },
    { id: 596, codigo: 'K74.6', descripcion: 'Otras cirrosis del hígado y las no especificadas' },
    { id: 597, codigo: 'K76.8', descripcion: 'Otras enfermedades especificadas del hígado' },
    { id: 598, codigo: 'K80.0', descripcion: 'Cálculo de la vesícula biliar con colecistitis aguda' },
    { id: 599, codigo: 'K80.1', descripcion: 'Cálculo de la vesícula biliar con otra colecistitis' },
    { id: 600, codigo: 'K80.3', descripcion: 'Cálculo de conducto biliar con colangitis' },
    { id: 601, codigo: 'K80.8', descripcion: 'Otras colelitiasis' },
    { id: 602, codigo: 'K82.9', descripcion: 'Enfermedad de la vesícula biliar, no especificada' },
    { id: 603, codigo: 'K85.0', descripcion: 'Pancreatitis aguda idiopatica' },
    { id: 604, codigo: 'K85.X', descripcion: 'Pancreatitis aguda' },
    { id: 605, codigo: 'K86.2', descripcion: 'Quiste del páncreas' },
    { id: 606, codigo: 'K87.0', descripcion: 'Trastornos de la vesícula biliar y de las vías biliares en enfermedades clasificadas en otra parte (*)' },
    { id: 607, codigo: 'K91.5', descripcion: 'Síndrome postcolecistectomía' },
    { id: 608, codigo: 'K92.9', descripcion: 'Enfermedad del sistema digestivo, no especificada' },
    { id: 609, codigo: 'L02.1', descripcion: 'Absceso cutáneo, furúnculo y ántrax del cuello' },
    { id: 610, codigo: 'L02.2', descripcion: 'Absceso cutáneo, furúnculo y ántrax del tronco' },
    { id: 611, codigo: 'L02.3', descripcion: 'Absceso cutáneo, furúnculo y ántrax de glúteos' },
    { id: 612, codigo: 'L02.8', descripcion: 'Absceso cutáneo, furúnculo y ántrax de otros sitios' },
    { id: 613, codigo: 'L03.0', descripcion: 'Celulitis de los dedos de la mano y del pie' },
    { id: 614, codigo: 'L03.1', descripcion: 'Celulitis de otras partes de los miembros' },
    { id: 615, codigo: 'L03.8', descripcion: 'Celulitis de otros sitios' },
    { id: 616, codigo: 'L04.1', descripcion: 'Linfadenitis aguda del tronco' },
    { id: 617, codigo: 'L04.3', descripcion: 'Linfadenitis aguda del miembro inferior' },
    { id: 618, codigo: 'L08.9', descripcion: 'Infección local de la piel y del tejido subcutáneo, no especificada' },
    { id: 619, codigo: 'L10.9', descripcion: 'Pénfigo, no especificado' },
    { id: 620, codigo: 'L57.0', descripcion: 'Queratosis actínica' },
    { id: 621, codigo: 'L62.8', descripcion: 'Trastornos de las uñas en otras enfermedades clasificadas en otra parte (*)' },
    { id: 622, codigo: 'L63.9', descripcion: 'Alopecia areata, no especificada' },
    { id: 623, codigo: 'L74.9', descripcion: 'Trastorno sudoríparo ecrino, no especificado' },
    { id: 624, codigo: 'L89.X', descripcion: 'Ulcera de cúbito' },
    { id: 625, codigo: 'L93.1', descripcion: 'Lupus eritematoso cutáneo subagudo' },
    { id: 626, codigo: 'M00.8', descripcion: 'Artritis y poliartritis debidas a otros agentes bacterianos especificados' },
    { id: 627, codigo: 'M01.3', descripcion: 'Artritis en otras enfermedades bacterianas clasificadas en otra parte (*)' },
    { id: 628, codigo: 'M07.2', descripcion: 'Espondilitis psoriásica (L40.5+) (*)' },
    { id: 629, codigo: 'M16.0', descripcion: 'Coxartrosis primaria, bilateral' },
    { id: 630, codigo: 'M16.9', descripcion: 'Coxartrosis, no especificada' },
    { id: 631, codigo: 'M17.9', descripcion: 'Gonartrosis, no especificada' },
    { id: 632, codigo: 'M23.6', descripcion: 'Otra ruptura espontánea del (de los) ligamento(s) de la rodilla' },
    { id: 633, codigo: 'M25.0', descripcion: 'Hemartrosis' },
    { id: 634, codigo: 'M25.5', descripcion: 'Dolor en articulación' },
    { id: 635, codigo: 'M31.0', descripcion: 'Angiítis debida a hipersensibilidad' },
    { id: 636, codigo: 'M31.1', descripcion: 'Microangiopatía trombótica' },
    { id: 637, codigo: 'M31.7', descripcion: 'poliangeítis microscópica' },
    { id: 638, codigo: 'M31.9', descripcion: 'Vasculopatía necrotizante, no especificada' },
    { id: 639, codigo: 'M46.5', descripcion: 'Otras espondilopatías infecciosas' },
    { id: 640, codigo: 'M48.4', descripcion: 'Fractura de vértebra por fatiga' },
    { id: 641, codigo: 'M49.3', descripcion: 'Espondilopatía en otras enfermedades infecciosas y parasitarias clasificadas en otra parte (*)' },
    { id: 642, codigo: 'M51.1', descripcion: 'Trastornos de disco lumbar y otros, con radiculopatía (G55.1*) (+)' },
    { id: 643, codigo: 'M54.6', descripcion: 'Dolor en la columna dorsal' },
    { id: 644, codigo: 'M54.9', descripcion: 'Dorsalgia, no especificada' },
    { id: 645, codigo: 'M62.4', descripcion: 'Contractura muscular' },
    { id: 646, codigo: 'M66.4', descripcion: 'Ruptura espontánea de otros tendones' },
    { id: 647, codigo: 'M70.2', descripcion: 'Bursitis del olécranon' },
    { id: 648, codigo: 'm79.9', descripcion: 'Trastorno de los tejidos blandos, no especificado' },
    { id: 649, codigo: 'M80.5', descripcion: 'Osteoporosis idiopática, con fractura patológica' },
    { id: 650, codigo: 'M80.8', descripcion: 'Otras osteoporosis, con fractura patológica' },
    { id: 651, codigo: 'M86.6', descripcion: 'Otras osteomielitis crónicas' },
    { id: 652, codigo: 'M86.9', descripcion: 'Osteomielitis, no especificada' },
    { id: 653, codigo: 'M87.9', descripcion: 'Osteonecrosis, no especificada' },
    { id: 654, codigo: 'M99.5', descripcion: 'Estenosis del canal neural por disco intervertebral' },
    { id: 655, codigo: 'N01.2', descripcion: 'Síndrome nefrítico rápidamente progresivo, glomerulonefritis membranosa difusa' },
    { id: 656, codigo: 'N02.8', descripcion: 'Hematuria recurrente y persistente, otras' },
    { id: 657, codigo: 'N04.8', descripcion: 'Síndrome nefrótico, otras' },
    { id: 658, codigo: 'N04.9', descripcion: 'Síndrome nefrótico, no especificada' },
    { id: 659, codigo: 'N08.3', descripcion: 'Trastornos glomerulares en diabetes mellitus (E10-E14+ con cuarto carácter común .2) (*)' },
    { id: 660, codigo: 'N13.3', descripcion: 'Otras hidronefrosis y las no especificadas' },
    { id: 661, codigo: 'N13.9', descripcion: 'Uropatía obstructiva y por reflujo, sin otra especificación' },
    /*{ id: 662, codigo: 'N18.8', descripcion: 'Otras insuficiencias renales crónicas' },*/
    /*{ id: 663, codigo: 'N18.9', descripcion: 'Insuficiencia renal crónica, no especificada' },*/
    { id: 664, codigo: 'N19.X', descripcion: 'Insuficiencia renal no especificada' },
    { id: 665, codigo: 'N20.0', descripcion: 'Cálculo del riñón' },
    { id: 666, codigo: 'N20.1', descripcion: 'Cálculo del uréter' },
    { id: 667, codigo: 'N20.9', descripcion: 'Cálculo urinario, no especificado' },
    { id: 668, codigo: 'N22.0', descripcion: 'Litiasis urinaria en esquistosomiasis [bilharziasis] (B65.-+) (*)' },
    { id: 669, codigo: 'N25.0', descripcion: 'Osteodistrofia renal' },
    { id: 670, codigo: 'N25.8', descripcion: 'Otros trastornos resultantes de la función tubular renal alterada' },
    { id: 671, codigo: 'N28.9', descripcion: 'Trastorno del riñón y del uréter, no especificado' },
    { id: 672, codigo: 'N31.9', descripcion: 'Disfunción neuromuscular de la vejiga, no especificada' },
    { id: 673, codigo: 'N39.0', descripcion: 'Infección de vías urinarias, sitio no especificado' },
    { id: 674, codigo: 'N41.0', descripcion: 'Prostatitis aguda' },
    { id: 675, codigo: 'N41.1', descripcion: 'Prostatitis crónica' },
    { id: 676, codigo: 'n43.2', descripcion: 'Otros hidroceles' },
    { id: 677, codigo: 'N45.0', descripcion: 'Orquitis, epididimitis y orquiepididimitis con absceso' },
    { id: 678, codigo: 'N45.9', descripcion: 'Orquitis, epididimitis y orquiepididimitis sin absceso' },
    { id: 679, codigo: 'N48.9', descripcion: 'Trastorno del pene, no especificado' },
    { id: 680, codigo: 'N76.8', descripcion: 'Otras inflamaciones especificadas de la vagina y de la vulva' },
    { id: 681, codigo: 'N81.9', descripcion: 'Prolapso genital femenino, no especificado' },
    { id: 682, codigo: 'N83.2', descripcion: 'Otros quistes ováricos y los no especificados' },
    { id: 683, codigo: 'N85.0', descripcion: 'Hiperplasia de glándula del endometrio:' },
    { id: 684, codigo: 'N85.1', descripcion: 'Hiperplasia adenomatosa del endometrio' },
    { id: 685, codigo: 'N93.8', descripcion: 'Otras hemorragias uterinas o vaginales anormales especificadas' },
    { id: 686, codigo: 'O06.9', descripcion: 'Aborto no especificado, completo o no especificado, sin complicación' },
    { id: 687, codigo: 'O85.X', descripcion: 'Sepsis puerperal' },
    { id: 688, codigo: 'P10.9', descripcion: 'Hemorragia y laceración intracraneales no especificadas, debidas a traumatismo del nacimiento' },
    { id: 689, codigo: 'P36.0', descripcion: 'Sepsis del recién nacido debida a estreptococo del grupo B' },
    { id: 690, codigo: 'P54.4', descripcion: 'Hemorragia suprarrenal neonatal' },
    { id: 691, codigo: 'P74.9', descripcion: 'Trastorno metabólico transitorio del recién nacido, no especificado' },
    { id: 692, codigo: 'P92.3', descripcion: 'Hipoalimentación del recién nacido' },
    { id: 693, codigo: 'Q21.1', descripcion: 'Defecto del tabique auricular' },
    { id: 694, codigo: 'Q21.2', descripcion: 'Defecto del tabique auriculoventricular' },
    { id: 695, codigo: 'Q24.5', descripcion: 'Malformación de los vasos coronarios' },
    { id: 696, codigo: 'Q44.6', descripcion: 'Enfermedad quística del hígado' },
    { id: 697, codigo: 'Q61.0', descripcion: 'Quiste renal solitario congénito' },
    { id: 698, codigo: 'Q61.9', descripcion: 'Enfermedad quística del riñón, no especificada' },
    { id: 699, codigo: 'Q65.3', descripcion: 'Subluxación congénita de la cadera, unilateral' },
    { id: 700, codigo: 'R00.0', descripcion: 'Taquicardia, no especificada' },
    { id: 701, codigo: 'R02.X', descripcion: 'Gangrena, no clasificada en otra parte' },
    { id: 702, codigo: 'R06.0', descripcion: 'Disnea' },
    { id: 703, codigo: 'R06.6', descripcion: 'Hipo' },
    { id: 704, codigo: 'R07.3', descripcion: 'Otros dolores en el pecho' },
    { id: 705, codigo: 'R09.8', descripcion: 'Otros síntomas y signos especificados que involucran los sistemas circulatorio y respiratorio' },
    { id: 706, codigo: 'R10.1', descripcion: 'Dolor abdominal localizado en parte superior' },
    { id: 707, codigo: 'R11.X', descripcion: 'Náusea y vómito' },
    { id: 708, codigo: 'R19.0', descripcion: 'Tumefacción, masa o prominencia intraabdominal y pélvica' },
    { id: 709, codigo: 'R25.0', descripcion: 'Movimientos anormales de la cabeza' },
    { id: 710, codigo: 'R40.0', descripcion: 'Somnolencia' },
    { id: 711, codigo: 'R41.0', descripcion: 'Desorientación no especificada' },
    { id: 712, codigo: 'R41.8', descripcion: 'Otros síntomas y signos que involucran la función cognoscitiva y la conciencia y los no especificados' },
    { id: 713, codigo: 'R50.0', descripcion: 'Fiebre con escalofrío' },
    { id: 714, codigo: 'R51.X', descripcion: 'Cefalea' },
    { id: 715, codigo: 'R52.1', descripcion: 'Dolor crónico intratable' },
    { id: 716, codigo: 'R52.9', descripcion: 'Dolor, no especificado' },
    { id: 717, codigo: 'R55.X', descripcion: 'Síncope y colapso' },
    { id: 718, codigo: 'R57.8', descripcion: 'Otras formas de choque' },
    { id: 719, codigo: 'R58.X', descripcion: 'Hemorragia, no clasificada en otra parte' },
    { id: 720, codigo: 'R60.0', descripcion: 'Edema localizado' },
    { id: 721, codigo: 'R65.2', descripcion: 'SÍNDROME DE RESPUESTA INFLAMATORIA SISTÉMICA DE ORIGEN NO INFECCIOSO SIN FALLA ORGÁNICA' },
    { id: 722, codigo: 'R78.1', descripcion: 'Hallazgo de drogas opiáceas en la sangre' },
    { id: 723, codigo: 'R78.8', descripcion: 'Hallazgo de otras sustancias especificadas que normalmente no se encuentran en la sangre' },
    { id: 724, codigo: 'R81.X', descripcion: 'Glucosuria' },
    { id: 725, codigo: 'R90.8', descripcion: 'Otros hallazgos anormales en diagnóstico por imagen del sistema nervioso central' },
    { id: 726, codigo: 'R91.X', descripcion: 'Hallazgos anormales en diagnóstico por imagen del pulmón' },
    { id: 727, codigo: 'S00.9', descripcion: 'Traumatismo superficial de la cabeza, parte no especificada' },
    { id: 728, codigo: 'S01.0', descripcion: 'Herida del cuero cabelludo' },
    { id: 729, codigo: 'S03.5', descripcion: 'Esguinces y torceduras de articulaciones y ligamentos de otras partes y las no especificadas de la cabeza' },
    { id: 730, codigo: 'S12.2', descripcion: 'Fractura de otras vértebras cervicales especificadas' },
    { id: 731, codigo: 'S22.0', descripcion: 'Fractura de vértebra torácica' },
    { id: 732, codigo: 'S22.8', descripcion: 'Fractura de otras partes del tórax óseo' },
    { id: 733, codigo: 'S30.9', descripcion: 'Traumatismo superficial del abdomen, de la región lumbosacra y de la pelvis, parte no especificada' },
    { id: 734, codigo: 'S32.4', descripcion: 'Fractura del acetábulo' },
    { id: 735, codigo: 'S40.0', descripcion: 'Contusión del hombro y del brazo' },
    { id: 736, codigo: 'S42.0', descripcion: 'Fractura de la clavícula' },
    { id: 737, codigo: 'S42.4', descripcion: 'Fractura de la epífisis inferior del húmero' },
    { id: 738, codigo: 'S43.1', descripcion: 'Luxación de la articulación acromioclavicular' },
    { id: 739, codigo: 'S52.5', descripcion: 'Fractura de la epífisis inferior del radio' },
    { id: 740, codigo: 'S52.7', descripcion: 'Fracturas múltiples del antebrazo' },
    { id: 741, codigo: 'S60.2', descripcion: 'Contusión de otras partes de la muñeca y de la mano' },
    { id: 742, codigo: 'S62.8', descripcion: 'Fractura de otras partes y de las no especificadas de la muñeca y de la mano' },
    { id: 743, codigo: 's70.0', descripcion: 'Contusión de la cadera' },
    { id: 744, codigo: 'S70.9', descripcion: 'Traumatismo superficial de la cadera y del muslo, no especificado' },
    { id: 745, codigo: 'S72.2', descripcion: 'Fractura subtrocanteriana' },
    { id: 746, codigo: 'S72.3', descripcion: 'Fractura de la diáfisis del fémur' },
    { id: 747, codigo: 'S73.0', descripcion: 'Luxación de la cadera' },
    { id: 748, codigo: 'S75.0', descripcion: 'Traumatismo de la arteria femoral' },
    { id: 749, codigo: 'S76.1', descripcion: 'Traumatismo del tendón y músculo cuádriceps' },
    { id: 750, codigo: 'S79.9', descripcion: 'Traumatismo no especificado de la cadera y del muslo' },
    { id: 751, codigo: 'S80.0', descripcion: 'Contusión de la rodilla' },
    { id: 752, codigo: 'S80.1', descripcion: 'Contusión de otras partes y las no especificadas de la pierna' },
    { id: 753, codigo: 'S81.9', descripcion: 'Herida de la pierna, parte no especificada' },
    { id: 754, codigo: 'S82.1', descripcion: 'Fractura de la epífisis superior de la tibia' },
    { id: 755, codigo: 'S82.2', descripcion: 'Fractura de la diáfisis de la tibia' },
    { id: 756, codigo: 'S82.4', descripcion: 'Fractura del peroné solamente' },
    { id: 757, codigo: 'S82.6', descripcion: 'Fractura del maléolo externo' },
    { id: 758, codigo: 'S88.9', descripcion: 'Amputación traumática de la pierna, nivel no especificado' },
    { id: 759, codigo: 'S90.1', descripcion: 'Contusión de dedo(s) del pie sin daño de la(s) uña(s)' },
    { id: 760, codigo: 'S90.9', descripcion: 'Traumatismo superficial del pie y del tobillo, no especificado' },
    { id: 761, codigo: 'S91.3', descripcion: 'Herida de otras partes del pie' },
    { id: 762, codigo: 'S92.9', descripcion: 'Fractura del pie, no especificada' },
    { id: 763, codigo: 'S98.0', descripcion: 'Amputación traumática del pie a nivel del tobillo' },
    { id: 764, codigo: 'S98.2', descripcion: 'Amputación traumática de dos o más dedos del pie' },
    { id: 765, codigo: 'T08.X', descripcion: 'Fractura de la columna vertebral, nivel no especificado' },
    { id: 766, codigo: 'T13.1', descripcion: 'Herida de miembro inferior, nivel no especificado' },
    { id: 767, codigo: 'T14.0', descripcion: 'Traumatismo superficial de región no especificada del cuerpo' },
    { id: 768, codigo: 'T14.8', descripcion: 'Otros traumatismos de región no especificada del cuerpo' },
    { id: 769, codigo: 'T25.7', descripcion: 'Corrosión del tobillo y del pie, de tercer grado' },
    { id: 770, codigo: 'T30.2', descripcion: 'Quemadura de segundo grado, región del cuerpo no especificada' },
    { id: 771, codigo: 'T79.9', descripcion: 'Complicaciones precoces no especificadas de los traumatismos' },
    { id: 772, codigo: 'T80.1', descripcion: 'Complicaciones vasculares consecutivas a infusión, transfusión e inyección terapéutica' },
    { id: 773, codigo: 'T81.8', descripcion: 'Otras complicaciones de procedimientos, no clasificadas en otra parte' },
    { id: 774, codigo: 'T81.9', descripcion: 'Complicación de procedimientos, no especificada' },
    { id: 775, codigo: 'T82.4', descripcion: 'Complicación mecánica de catéter para diálisis vascular' },
    { id: 776, codigo: 'T82.8', descripcion: 'Otras complicaciones de dispositivos protésicos, implantes e injertos cardiovasculares' },
    { id: 777, codigo: 'T84.1', descripcion: 'Complicación mecánica de dispositivo de fijación interna de huesos de un miembro' },
    { id: 778, codigo: 'T84.6', descripcion: 'Infección y reacción inflamatoria debidas a dispositivo de fijación interna [cualquier sitio]' },
    { id: 779, codigo: 'T84.7', descripcion: 'Infección y reacción inflamatoria debidas a otros dispositivos protésicos, implantes e injertos ortopédicos internos' },
    { id: 780, codigo: 'T84.9', descripcion: 'Complicaciones no especificadas de dispositivos protésicos, implantes e injertos ortopédicos internos' },
    { id: 781, codigo: 'T85.4', descripcion: 'Complicación mecánica de prótesis e implante de mama' },
    { id: 782, codigo: 'T85.7', descripcion: 'Infección y reacción inflamatoria debidas a otros dispositivos protésicos, implantes e injertos internos' },
    { id: 783, codigo: 'T85.8', descripcion: 'Otras complicaciones de dispositivos protésicos, implantes e injertos internos, no clasificadas en otra parte' },
    { id: 784, codigo: 'T86.1', descripcion: 'Falla y rechazo de trasplante de riñón' },
    { id: 785, codigo: 'T88.8', descripcion: 'Otras complicaciones especificadas de la atención médica y quirúrgica, no clasificadas en otra parte' },
    { id: 786, codigo: 'T93.2', descripcion: 'Secuelas de otras fracturas de miembro inferior' },
    { id: 787, codigo: 'U04.9', descripcion: 'Sindrome Respiratorio Agudo Sever' },
    { id: 788, codigo: 'U07.2', descripcion: 'COVID-19, virus no identificado' },
    { id: 789, codigo: 'U20.3', descripcion: 'Tuberculosis dosis monoresistente' },
    { id: 790, codigo: 'W01.0', descripcion: 'Caída en el mismo nivel por deslizamiento, tropezón y traspié, en vivienda' },
    { id: 791, codigo: 'Y60.1', descripcion: 'Incidente durante infusión o transfusión' },
    { id: 792, codigo: 'Y71.8', descripcion: 'Dispositivos cardiovasculares asociados con incidentes adversos, dispositivos diversos, no clasificados en otra parte' },
    { id: 793, codigo: 'Y83.0', descripcion: 'Operación quirúrgica con trasplante de un órgano completo' },
    { id: 794, codigo: 'Y83.8', descripcion: 'Otros procedimientos quirúrgicos' },
    { id: 795, codigo: 'Y84.8', descripcion: 'Otros procedimientos médicos' },
    { id: 796, codigo: 'Z00.0', descripcion: 'Examen médico general' },
    { id: 797, codigo: 'Z00.5', descripcion: 'Examen de donante potencial de órgano o tejido' },
    { id: 798, codigo: 'Z08.9', descripcion: 'Examen de seguimiento consecutivo a tratamiento no especificado por tumor maligno' },
    { id: 799, codigo: 'Z11.1', descripcion: 'Examen de pesquisa especial para tuberculosis respiratoria' },
    { id: 800, codigo: 'Z12.3', descripcion: 'Examen de pesquisa especial para tumor de la mama' },
    { id: 801, codigo: 'Z12.4', descripcion: 'Examen de pesquisa especial para tumor del cuello uterino' },
    { id: 802, codigo: 'Z13.6', descripcion: 'Examen de pesquisa especial para trastornos cardiovasculares' },
    { id: 803, codigo: 'Z13.9', descripcion: 'Examen de pesquisa especial, no especificado' },
    { id: 804, codigo: 'Z25.1', descripcion: 'Necesidad de inmunización contra la influenza [gripe]' },
    { id: 805, codigo: 'Z40.9', descripcion: 'Cirugía profiláctica no especificada' },
    { id: 806, codigo: 'Z51.3', descripcion: 'Transfusión de sangre, sin diagnóstico informado' },
    { id: 807, codigo: 'Z51.9', descripcion: 'Atención médica, no especificada' },
    { id: 808, codigo: 'Z52.0', descripcion: 'Donante de sangre' },
    { id: 809, codigo: 'Z54.4', descripcion: 'Convalecencia consecutiva a tratamiento de fractura' },
    { id: 810, codigo: 'Z56.7', descripcion: 'Otros problemas y los no especificados relacionados con el empleo' },
    { id: 811, codigo: 'Z63.0', descripcion: 'Problemas en la relación entre esposos o pareja' },
    { id: 812, codigo: 'Z71.3', descripcion: 'Consulta para instrucción y vigilancia de la dieta' },
    { id: 813, codigo: 'Z73.6', descripcion: 'Problemas relacionados con la limitación de las actividades debido a discapacidad' },
    { id: 814, codigo: 'Z88.8', descripcion: 'Historia personal de alergia a otras drogas, medicamentos y sustancias biológicas' },
    { id: 815, codigo: 'Z90.4', descripcion: 'Ausencia adquirida de otras partes del tubo digestivo' },
    { id: 816, codigo: 'Z90.7', descripcion: 'Ausencia adquirida de órgano(s) genital(es)' },
    { id: 817, codigo: 'Z90.8', descripcion: 'Ausencia adquirida de otros órganos' },
    { id: 818, codigo: 'Z92.9', descripcion: 'Historia personal de tratamiento médico no especificado' },
    { id: 819, codigo: 'Z93.2', descripcion: 'Ileostomía' },
    { id: 820, codigo: 'Z93.6', descripcion: 'Otros orificios artificiales de las vías urinarias' },
    { id: 821, codigo: 'Z94.9', descripcion: 'Organo o tejido trasplantado no especificado' },
    { id: 822, codigo: 'Z95.0', descripcion: 'Presencia de marcapaso cardíaco' },
    { id: 823, codigo: 'Z95.2', descripcion: 'Presencia de válvula cardíaca protésica' },
    { id: 824, codigo: 'Z95.9', descripcion: 'Presencia de injertos e implantes cardiovasculares no especificados' },
    { id: 825, codigo: 'Z96.6', descripcion: 'Presencia de implante ortopédico articular' }

]);

const form = ref({
    filtroCodigo: '',
    filtroDescripcion: '',
    filtroCodigoCausa: '',
    filtroDescripcionCausa: '',
    seleccionados: [],
    fIniHos: '',
    fAltHos: '',
    desenlace: '',
    fechaFallecimiento: '',
    causaMuerte: '',
    fuente: '',
    id_periodo_ipress: 17,
    id_red: 1,
    id_paciente: null
});

// Variables para validación de fechas
const errorFechaAlta = ref('');
const fechaAltaAnterior = ref(''); // Esta se obtendría del historial del paciente

const fetchPaciente = async (url = null) => {
    try {
        const respuesta = await getAllIpress("/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;
        console.log("paientes seleccionado", pacienteSeleccionado)

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchUltimoRegistroHospitalizacion = async () => {
    if (idPacienteAtencion == null || idPacienteAtencion === '') return;
    if (props.registroEdicion) return;
    try {
        const res = await getAllIpress(`/morbilidadesHospitalarias/?id_paciente_atencion=${idPacienteAtencion}`);
        const lista = Array.isArray(res) ? res : (res?.results || []);
        lista.sort((a, b) => (Number(b.id_morbilidad_hospitalaria) || 0) - (Number(a.id_morbilidad_hospitalaria) || 0));
        const ultimo = lista[0] || null;
        ultimoRegistroHospitalizacion.value = ultimo;

        const ultimoConAlta = lista.find((r) => registroTieneAlta(r)) || null;
        fechaAltaAnterior.value = ultimoConAlta ? toInputDate(ultimoConAlta.fecha_alta_hospitalizacion) : '';

        if (ultimo && !registroTieneAlta(ultimo)) {
            modoCompletarAlta.value = true;
            idMorbilidadCompletar.value = ultimo.id_morbilidad_hospitalaria;
            form.value.fIniHos = toInputDate(ultimo.fecha_hospitalizacion);
            form.value.fAltHos = '';
            form.value.desenlace = ultimo.desenlace || '';
            form.value.fechaFallecimiento = toInputDate(ultimo.fecha_fallecimiento);
            form.value.causaMuerte = ultimo.causa_muerte || '';
            form.value.fuente = ultimo.fuente || '';
            form.value.seleccionados = diagnosticosDesdeRegistro(ultimo);
            form.value.filtroCodigo = '';
            form.value.filtroDescripcion = '';
            form.value.filtroCodigoCausa = '';
            form.value.filtroDescripcionCausa = '';
        } else {
            limpiarFormularioNuevo();
        }
    } catch (e) {
        console.error('Error al cargar último registro de hospitalización:', e);
        ultimoRegistroHospitalizacion.value = null;
        limpiarFormularioNuevo();
    }
};

form.value.id_paciente = paciente.id_paciente

// Computed property para validar fecha mínima de alta
const minFechaAlta = computed(() => {
    if (form.value.fIniHos) return form.value.fIniHos;
    return null;
});
// Fecha de alta no debe salir del periodo seleccionado
const maxFechaAlta = computed(() => rangoFechasPeriodo.value?.max ?? null);

// Watcher para validar fecha de alta
watch(() => form.value.fAltHos, (nuevaFechaAlta) => {
    errorFechaAlta.value = '';
    if (!nuevaFechaAlta) return;
    if (form.value.fIniHos && nuevaFechaAlta < form.value.fIniHos) {
        errorFechaAlta.value = 'La fecha de alta debe ser mayor o igual a la fecha de inicio de hospitalización';
        return;
    }
    if (fechaAltaAnterior.value && nuevaFechaAlta <= fechaAltaAnterior.value) {
        errorFechaAlta.value = 'La fecha de alta debe ser mayor a la fecha de alta anterior';
        return;
    }
    const rango = rangoFechasPeriodo.value;
    if (rango.min && rango.max && (nuevaFechaAlta < rango.min || nuevaFechaAlta > rango.max)) {
        errorFechaAlta.value = `La fecha de alta debe estar dentro del periodo (${rango.min} a ${rango.max})`;
    }
});

watch(() => form.value.desenlace, (valor) => {
    if (valor === 'Fallecimiento') {
        form.value.fAltHos = '';
        errorFechaAlta.value = '';
    } else {
        form.value.fechaFallecimiento = '';
        form.value.causaMuerte = '';
        form.value.filtroCodigoCausa = '';
        form.value.filtroDescripcionCausa = '';
    }
});

function datosFallecimientoPayload() {
    if (form.value.desenlace === 'Fallecimiento') {
        return {
            fecha_fallecimiento: form.value.fechaFallecimiento || null,
            causa_muerte: form.value.causaMuerte?.trim() || null,
        };
    }
    return {
        fecha_fallecimiento: null,
        causa_muerte: null,
    };
}

async function validarDatosFallecimiento() {
    if (form.value.desenlace !== 'Fallecimiento') return true;
    if (!form.value.fechaFallecimiento) {
        await alertaSwal('Indique la fecha de fallecimiento.');
        return false;
    }
    if (!form.value.causaMuerte?.trim()) {
        await alertaSwal('Seleccione la causa de muerte desde el catálogo CIE-10.');
        return false;
    }
    const rango = rangoFechasPeriodo.value;
    if (rango.min && rango.max && (form.value.fechaFallecimiento < rango.min || form.value.fechaFallecimiento > rango.max)) {
        await alertaSwal(`La fecha de fallecimiento debe estar dentro del periodo (${rango.min} a ${rango.max}).`);
        return false;
    }
    if (form.value.fIniHos && form.value.fechaFallecimiento < form.value.fIniHos) {
        await alertaSwal('La fecha de fallecimiento no puede ser anterior a la fecha de inicio de hospitalización.');
        return false;
    }
    return true;
}

// Watcher para limpiar error cuando cambia la fecha de inicio
watch(() => form.value.fIniHos, () => {
    if (errorFechaAlta.value && form.value.fAltHos) {
        // Re-validar cuando cambia la fecha de inicio
        const tempFechaAlta = form.value.fAltHos;
        form.value.fAltHos = '';
        nextTick(() => {
            form.value.fAltHos = tempFechaAlta;
        });
    }
});

const resultadosFiltrados = computed(() => {
    return items.value.filter((item) => {
        const matchCod = form.value.filtroCodigo
            ? item.codigo.toLowerCase().includes(form.value.filtroCodigo.toLowerCase())
            : true;
        const matchDesc = form.value.filtroDescripcion.length >= 3
            ? item.descripcion.toLowerCase().includes(form.value.filtroDescripcion.toLowerCase())
            : true;
        return matchCod && matchDesc;
    });
});

const hayBusqueda = computed(() =>
    form.value.filtroCodigo.length > 0 || form.value.filtroDescripcion.length >= 3
);

const mostrarLista = computed(() =>
    hayBusqueda.value && resultadosFiltrados.value.length > 0
);

const resultadosCausaMuerte = computed(() => {
    const cod = String(form.value.filtroCodigoCausa || '').trim().toLowerCase();
    const desc = String(form.value.filtroDescripcionCausa || '').trim().toLowerCase();
    return items.value.filter((item) => {
        const matchCod = cod ? String(item.codigo).toLowerCase().includes(cod) : true;
        const matchDesc = desc.length >= 3
            ? String(item.descripcion).toLowerCase().includes(desc)
            : (desc.length === 0 ? true : false);
        // Si solo hay código, filtrar por código; si hay descripción corta (<3) sin código, no listar
        if (!cod && desc.length > 0 && desc.length < 3) return false;
        if (!cod && !desc) return false;
        return matchCod && (desc.length >= 3 ? matchDesc : true);
    }).slice(0, 80);
});

const hayBusquedaCausaMuerte = computed(() => {
    const cod = String(form.value.filtroCodigoCausa || '').trim();
    const desc = String(form.value.filtroDescripcionCausa || '').trim();
    return cod.length > 0 || desc.length >= 3;
});

const mostrarListaCausaMuerte = computed(() =>
    hayBusquedaCausaMuerte.value && resultadosCausaMuerte.value.length > 0
);

const causaMuerteCodigoMostrar = computed(() => {
    const t = String(form.value.causaMuerte || '').trim();
    if (!t) return '';
    const sep = t.indexOf(' - ');
    if (sep > 0) return t.slice(0, sep);
    return t;
});

const causaMuerteDescripcionMostrar = computed(() => {
    const t = String(form.value.causaMuerte || '').trim();
    if (!t) return '';
    const sep = t.indexOf(' - ');
    if (sep > 0) return t.slice(sep + 3);
    return '';
});

function seleccionarCausaMuerte(item) {
    if (!item) return;
    form.value.causaMuerte = `${item.codigo} - ${item.descripcion}`.slice(0, 500);
    form.value.filtroCodigoCausa = '';
    form.value.filtroDescripcionCausa = '';
}

function quitarCausaMuerte() {
    form.value.causaMuerte = '';
    form.value.filtroCodigoCausa = '';
    form.value.filtroDescripcionCausa = '';
}

const limpiarFiltrosBusqueda = () => {
    form.value.filtroCodigo = '';
    form.value.filtroDescripcion = '';
};

const onDiagnosticoSeleccionado = (event) => {
    if (event?.target?.checked) {
        limpiarFiltrosBusqueda();
    }
};

const quitarSeleccion = (item) => {
    form.value.seleccionados = form.value.seleccionados.filter(i => i.id !== item.id);
};

const validarAntesDeGuardar = async () => {
    const esFallecimiento = form.value.desenlace === 'Fallecimiento';
    if (!modoCompletarAlta.value && (!form.value.seleccionados || form.value.seleccionados.length === 0)) {
        await alertaSwal('Debe completar el diagnostico, incluso presuntivo');
        return false;
    }
    if (!esFallecimiento && errorFechaAlta.value) {
        await alertaSwal('Por favor corrija los errores en las fechas antes de continuar.');
        return false;
    }
    if (!(await validarDatosFallecimiento())) return false;
    if (!esFallecimiento && form.value.fIniHos && form.value.fAltHos && form.value.fAltHos < form.value.fIniHos) {
        await alertaSwal('La fecha de alta debe ser mayor o igual a la fecha de inicio de hospitalización.');
        return false;
    }
    if (!esFallecimiento && fechaAltaAnterior.value && form.value.fAltHos && form.value.fAltHos <= fechaAltaAnterior.value) {
        await alertaSwal('La fecha de alta debe ser mayor a la fecha de alta anterior.');
        return false;
    }
    const rango = rangoFechasPeriodo.value;
    if (rango.min && rango.max) {
        if (form.value.fIniHos && (form.value.fIniHos < rango.min || form.value.fIniHos > rango.max)) {
            await alertaSwal(`La fecha de hospitalización debe estar dentro del periodo seleccionado (${rango.min} a ${rango.max}).`);
            return false;
        }
        if (!esFallecimiento && form.value.fAltHos && (form.value.fAltHos < rango.min || form.value.fAltHos > rango.max)) {
            await alertaSwal(`La fecha de alta debe estar dentro del periodo seleccionado (${rango.min} a ${rango.max}).`);
            return false;
        }
    }
    return true;
};

const solicitarRegistro = async () => {
    if (!(await validarAntesDeGuardar())) return;
    if (debeConfirmarEfectoMovimiento.value) {
        efectoMovimientoSeleccionado.value = '';
        errorEfectoMovimiento.value = '';
        mostrarModalEfectoMovimiento.value = true;
        return;
    }
    await postForm();
};

const cancelarModalEfecto = () => {
    if (guardandoFormulario.value) return;
    mostrarModalEfectoMovimiento.value = false;
    errorEfectoMovimiento.value = '';
};

const confirmarYRegistrar = async () => {
    if (!efectoMovimientoSeleccionado.value) {
        errorEfectoMovimiento.value = 'Debe marcar una de las opciones para continuar.';
        return;
    }
    const disponible = opcionesEfectoDisponibles.value.some(
        (o) => o.value === efectoMovimientoSeleccionado.value,
    );
    if (!disponible) {
        errorEfectoMovimiento.value = 'La opción seleccionada no aplica con los datos actuales (revise fecha de alta / desenlace).';
        return;
    }
    if (
        (efectoMovimientoSeleccionado.value === EFECTO_HOSP.EGRESO
            || efectoMovimientoSeleccionado.value === EFECTO_HOSP.EGRESO_Y_REINGRESO)
        && !form.value.fIniHos
        && form.value.desenlace !== 'Fallecimiento'
    ) {
        errorEfectoMovimiento.value = 'Indique la fecha de inicio de hospitalización para generar el egreso.';
        return;
    }
    if (
        efectoMovimientoSeleccionado.value === EFECTO_HOSP.EGRESO
        && form.value.desenlace === 'Fallecimiento'
        && !form.value.fechaFallecimiento
    ) {
        errorEfectoMovimiento.value = 'Indique la fecha de fallecimiento para generar el egreso.';
        return;
    }
    errorEfectoMovimiento.value = '';
    await postForm({ efectoMovimiento: efectoMovimientoSeleccionado.value });
};

const postForm = async (opts = {}) => {
    const efectoMovimiento = opts.efectoMovimiento || null;
    const esFallecimiento = form.value.desenlace === 'Fallecimiento';
    if (!(await validarAntesDeGuardar())) return;

    guardandoFormulario.value = true;
    try {
        if (modoCompletarAlta.value && idMorbilidadCompletar.value != null) {
            const patchPayload = {
                fecha_alta_hospitalizacion: esFallecimiento ? null : (form.value.fAltHos || null),
                desenlace: form.value.desenlace || '',
                ...datosFallecimientoPayload(),
            };
            if (efectoMovimiento) {
                patchPayload.efecto_movimiento_hospitalizacion = efectoMovimiento;
            }
            await patchAllIpress(`/morbilidadesHospitalarias/${idMorbilidadCompletar.value}/`, patchPayload);
            let errorMovimientos = null;
            if (efectoMovimiento && idPacienteAtencion != null && idPacienteAtencion !== '') {
                try {
                    await ejecutarMovimientosSiCorresponde(efectoMovimiento, esFallecimiento);
                } catch (e) {
                    errorMovimientos = e;
                    console.error(e);
                }
            }
            mostrarModalEfectoMovimiento.value = false;
            if (idPacienteAtencion != null && idPacienteAtencion !== '') {
                if (errorMovimientos) {
                    await alertaSwal(
                        'La hospitalización se guardó, pero no se pudieron generar los movimientos automáticamente. Revise en Movimientos.',
                        { title: 'Atención', icon: 'warning' },
                    );
                }
                emit('guardado', { efectoMovimiento: efectoMovimiento || EFECTO_HOSP.SIN_EGRESO });
            } else {
                await alertaSwal('Se registró la fecha de alta con éxito.', { title: 'Registro guardado', icon: 'success' });
                window.location.reload();
            }
            return;
        }
        let payload;
        if (idPacienteAtencion != null && idPacienteAtencion !== '') {
            payload = {
                id_paciente_atencion: Number(idPacienteAtencion),
                diagnostico: form.value.seleccionados.map(item => item.descripcion || '').join(', '),
                codigo_diagnostico: form.value.seleccionados.map(item => item.codigo).join(','),
                fecha_hospitalizacion: form.value.fIniHos || null,
                fecha_alta_hospitalizacion: esFallecimiento ? null : (form.value.fAltHos || null),
                desenlace: form.value.desenlace || '',
                fuente: form.value.fuente || '',
                ...datosFallecimientoPayload(),
            };
            if (efectoMovimiento) {
                payload.efecto_movimiento_hospitalizacion = efectoMovimiento;
            }
            if (idMorbilidadEdicion.value != null) {
                if (props.modoSupervisor) {
                    await guardarComoSupervisor('morbilidadesHospitalarias', idMorbilidadEdicion.value, payload);
                } else {
                    await patchAllIpress(`/morbilidadesHospitalarias/${idMorbilidadEdicion.value}/`, payload);
                }
                emit('guardado', { efectoMovimiento: null });
                return;
            }
        } else {
            payload = {
                ...form.value,
                seleccionados: form.value.seleccionados.map(item => item.codigo).join(',')
            };
        }
        await postAllIpress(opts.url ?? "/morbilidadesHospitalarias/", payload);
        let errorMovimientos = null;
        if (efectoMovimiento && idPacienteAtencion != null && idPacienteAtencion !== '') {
            try {
                await ejecutarMovimientosSiCorresponde(efectoMovimiento, esFallecimiento);
            } catch (e) {
                errorMovimientos = e;
                console.error(e);
            }
        }
        mostrarModalEfectoMovimiento.value = false;
        if (idPacienteAtencion != null && idPacienteAtencion !== '') {
            if (errorMovimientos) {
                await alertaSwal(
                    'La hospitalización se guardó, pero no se pudieron generar los movimientos automáticamente. Revise en Movimientos.',
                    { title: 'Atención', icon: 'warning' },
                );
            }
            emit('guardado', { efectoMovimiento: efectoMovimiento || EFECTO_HOSP.SIN_EGRESO });
            return;
        }
        await alertaSwal('Se registró con éxito.', { title: 'Registro guardado', icon: 'success' });
        window.location.reload();
    } catch (error) {
        console.error('Error al guardar:', error);
        const detalle = error?.response?.data
            || error?.data
            || error?.message
            || (error instanceof Error ? error.message : null);
        const texto = typeof detalle === 'string'
            ? detalle
            : (detalle?.detail || detalle?.error || 'No se pudo guardar el registro. Intente nuevamente.');
        await alertaSwal(String(texto), { title: 'Error', icon: 'error' });
    } finally {
        guardandoFormulario.value = false;
    }
};

async function ejecutarMovimientosSiCorresponde(efectoMovimiento, esFallecimiento) {
    if (!efectoMovimiento || efectoMovimiento === EFECTO_HOSP.SIN_EGRESO) return;
    try {
        const atencion = await getAllIpress(`/pacienteAtencion/${Number(idPacienteAtencion)}/`);
        await aplicarEfectoMovimientoHospitalizacion({
            efecto: efectoMovimiento,
            atencion,
            fechaHospitalizacion: form.value.fIniHos || null,
            fechaAlta: esFallecimiento ? null : (form.value.fAltHos || null),
            fechaFallecimiento: esFallecimiento ? (form.value.fechaFallecimiento || null) : null,
        });
    } catch (e) {
        console.error('Error al generar movimientos por hospitalización:', e);
        throw new Error(
            e?.message
            || 'La hospitalización se guardó, pero no se pudieron generar los movimientos automáticamente.',
        );
    }
}

const fetchPeriodo = async () => {
    try {
        const respuesta = await getAllIpress("/periodos/");
        periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    } catch (e) {
        console.error("Error obteniendo periodos:", e);
        periodos.value = [];
    }
};

const edadPaciente = computed(() => {
    if (!pacienteSeleccionado.value?.fecha_nacimiento) return ''

    const hoy = new Date()
    const nacimiento = new Date(pacienteSeleccionado.value.fecha_nacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
    }

    return `${edad} años`
})

onMounted(async () => {
    await fetchPeriodo();
    fetchPaciente();
    if (props.registroEdicion) {
        cargarRegistroEdicion(props.registroEdicion);
        return;
    }
    if (idPacienteAtencion != null && idPacienteAtencion !== '') {
        fetchUltimoRegistroHospitalizacion();
    }
});
</script>