<template>
  <el-config-provider :locale="es">
    <div class="mx-6 max-w-6xl pb-6">
      <header
        class="sticky top-0 z-30 -mx-6 px-6 py-4 mb-6 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm flex items-start justify-between gap-4"
      >
        <div class="min-w-0 flex-1 pr-2">
          <h2 class="text-2xl font-bold text-slate-800">
            {{ modoEdicionSupervisor ? 'Edición de paciente (supervisor)' : 'Registro de Nuevo Paciente en Diálisis' }}
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            {{
              modoEdicionSupervisor
                ? 'Modifique los datos y guarde los cambios. El documento no debe duplicarse en el sistema.'
                : 'Complete los datos del paciente para la creación del expediente médico.'
            }}
          </p>
        </div>
        <button
          type="button"
          class="shrink-0 relative z-40 mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          aria-label="Cerrar"
          @click="$emit('cancelar')"
        >
          ✕
        </button>
      </header>

      <el-form label-position="top" class="formulario-paciente space-y-8">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-200">Identificación y Ubicación</h3>

          <div class="form-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5">
            <el-form-item label="Tipo de Documento" required>
              <el-select v-model="form.tipoDocumento" placeholder="Seleccione" class="w-full" clearable :disabled="modoEdicionSupervisor">
                <el-option label="DNI" value="DNI" />
                <el-option label="CE" value="CE" />
                <el-option label="PASAPORTE" value="PASAPORTE" />
              </el-select>
            </el-form-item>
            <el-form-item label="Número de Documento" required>
              <el-input
                v-model="form.numeroDocumento"
                :maxlength="maxLengthDocumento"
                placeholder="Ingrese número"
                :disabled="consultandoDNI || modoEdicionSupervisor"
                @input="onDocumentoInput"
              />
              <div v-if="errorDNI" class="text-red-500 text-xs mt-1">{{ errorDNI }}</div>
            </el-form-item>
            <el-form-item label="Fecha de Nacimiento" required :error="erroresFecha.fechaNacimiento">
              <el-date-picker
                v-model="form.fechaNacimiento"
                v-bind="attrsFechaDDMMAAAA"
                :clearable="false"
                @change="onCambioFechasTRR"
              />
            </el-form-item>
            <el-form-item label=" " class="flex items-end">
              <el-button v-if="form.tipoDocumento && !modoEdicionSupervisor" type="primary" :loading="consultandoDNI" :disabled="!puedeConsultar" @click="consultarDNI" class="w-full">
                Consultar documento
              </el-button>
              <span v-else-if="modoEdicionSupervisor" class="text-xs text-slate-500">Edición supervisor: la consulta por documento está desactivada.</span>
              <span v-else class="text-xs text-slate-400">Seleccione tipo, número de documento y fecha de nacimiento para consultar</span>
            </el-form-item>
          </div>

          <div class="form-grid mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 rounded-lg bg-slate-50 p-5 border border-slate-100">
            <div class="col-span-full flex flex-col gap-1.5 mb-1">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Domicilio / Procedencia (Según Reniec/Asegurado)</span>
              <span class="text-[11px] text-slate-400">Solo lectura: se completa con la consulta de documento; no es editable manualmente.</span>
            </div>
            <el-form-item label="Departamento">
              <el-select v-model="form.departamento" placeholder="—" class="w-full" disabled>
                <el-option v-for="dep in listaDepartamentos" :key="dep" :label="dep" :value="dep" />
              </el-select>
            </el-form-item>
            <el-form-item label="Provincia">
              <el-select v-model="form.provincia" placeholder="—" class="w-full" disabled>
                <el-option v-for="prov in listaProvincias" :key="prov" :label="prov" :value="prov" />
              </el-select>
            </el-form-item>
            <el-form-item label="Distrito">
              <el-select v-model="form.distrito" placeholder="—" class="w-full" disabled>
                <el-option v-for="dist in listaDistritos" :key="dist" :label="dist" :value="dist" />
              </el-select>
            </el-form-item>
            <el-form-item label="Ubigeo (Auto)">
              <el-input v-model="form.ubigeo" readonly disabled class="font-mono text-center" />
            </el-form-item>
          </div>

          <div class="form-grid mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5">
            <el-form-item label="Apellidos y Nombres" required class="sm:col-span-2">
              <el-input
                v-model="form.nombreCompleto"
                :readonly="!modoEdicionSupervisor"
                :placeholder="modoEdicionSupervisor ? 'Nombre del paciente' : 'Se completará al consultar'"
              />
            </el-form-item>
            <el-form-item label="Edad actual">
              <el-input v-model="form.edad" readonly />
            </el-form-item>
            <el-form-item label="Sexo" required>
              <el-select v-model="form.sexo" placeholder="—" class="w-full" disabled>
                <el-option label="Masculino" value="M" />
                <el-option label="Femenino" value="F" />
              </el-select>
            </el-form-item>
            <el-form-item label="Grado de Instrucción" required>
              <el-select v-model="form.gradoInstruccion" placeholder="Seleccione" class="w-full" clearable>
                <el-option label="Primaria" value="Primaria" />
                <el-option label="Secundaria" value="Secundaria" />
                <el-option label="Técnico" value="Técnico" />
                <el-option label="Superior" value="Superior" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-200">Etiología</h3>
          <div class="form-grid grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
            <el-form-item label="Etiología general">
              <el-select v-model="form.etiologiaGeneral" placeholder="Seleccione una opción" class="w-full" clearable>
                <el-option v-for="g in opcionesEtiologiaGeneralFromApi" :key="g" :label="g" :value="g" />
              </el-select>
            </el-form-item>
            <el-form-item label="Etiología específica">
              <el-select v-model="form.etiologiaEspecifica" placeholder="Seleccione una opción" class="w-full" clearable filterable>
                <el-option v-for="e in opcionesEtiologiaEspecificaFromApi" :key="e.id_etiologia" :label="e.especifica || e.codigo || e.id_etiologia" :value="e.id_etiologia" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" :key="form.etiologiaGeneral">
          <h3 class="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-200">Comorbilidad</h3>
          <el-checkbox-group v-model="form.comorbilidades">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              <el-checkbox value="Insuficiencia cardiaca">Insuficiencia cardiaca congestiva</el-checkbox>
              <el-checkbox v-if="!etiologiaGeneralEsDiabetes" value="Diabetes">Diabetes</el-checkbox>
              <el-checkbox value="Aterosclerosis">Aterosclerosis cardíaca</el-checkbox>
              <el-checkbox v-if="!etiologiaGeneralEsHipertension" value="Hipertensión">Hipertensión</el-checkbox>
              <el-checkbox value="Vascular periférica">Enfermedad vascular periférica</el-checkbox>
              <el-checkbox value="Tuberculosis">Tuberculosis</el-checkbox>
              <el-checkbox value="ACV">Accidente cerebrovascular</el-checkbox>
              <el-checkbox value="Cáncer">Cáncer</el-checkbox>
              <el-checkbox value="Otra">Otra</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-slate-700 mb-5 pb-3 border-b border-slate-200">Datos de TRR y Acceso</h3>

          <div class="form-grid trr-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-6">
            <el-form-item label="Modalidad de Inicio de TRR">
              <el-select v-model="form.modalidadTRR" placeholder="Seleccione" class="w-full" clearable>
                <el-option label="Hemodiálisis" value="Hemodiálisis" />
                <el-option label="Diálisis Peritoneal" value="Diálisis Peritoneal" />
                <el-option label="Trasplante" value="Trasplante" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fecha de Creación del Acceso de Inicio" :error="erroresFecha.fechaCreacionAcceso">
              <el-date-picker v-model="form.fechaCreacionAcceso" v-bind="attrsFechaDDMMAAAA" @change="actualizarErroresFechas" />
            </el-form-item>
            <el-form-item label="Fecha de Inicio de TRR" :error="erroresFecha.fechaInicioTRR">
              <el-date-picker v-model="form.fechaInicioTRR" v-bind="attrsFechaDDMMAAAA" @change="onCambioFechasTRR" />
            </el-form-item>
            <el-form-item label="Subsistema de Salud">
              <el-select v-model="form.subsistemaSalud" placeholder="Seleccione" class="w-full" clearable>
                <el-option label="EsSalud" value="EsSalud" />
                <el-option label="Minsa" value="Minsa" />
                <el-option label="Privados / EPS" value="Privados / EPS" />
                <el-option label="FFAA / FFPP" value="FFAA / FFPP" />
                <el-option label="Otro país" value="Otro país" />
              </el-select>
            </el-form-item>

            <el-form-item label="Edad de Inicio de TRR">
              <el-input v-model="form.edadInicioTRR" readonly placeholder="—" />
            </el-form-item>
            <el-form-item label="Tipo de Acceso de Inicio" @mousedown.capture="validarOrden">
              <el-select v-model="form.tipoAccesoInicio" placeholder="Seleccione" class="w-full" clearable :disabled="form.modalidadTRR === 'Trasplante'">
                <el-option v-for="tipo in tiposAccesoFiltrados" :key="tipo.id" :label="tipo.label" :value="tipo.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fecha de Ingreso a Hospital EsSalud" :error="erroresFecha.fechaIngresoEsSalud">
              <el-date-picker v-model="form.fechaIngresoEsSalud" v-bind="attrsFechaDDMMAAAA" clearable @change="actualizarErroresFechas" />
            </el-form-item>
            <el-form-item label="Fecha de Primer Ingreso a Unidad" :error="erroresFecha.fechaPrimerIngreso">
              <el-date-picker v-model="form.fechaPrimerIngreso" v-bind="attrsFechaDDMMAAAA" clearable @change="actualizarErroresFechas" />
            </el-form-item>

            <el-form-item label="Localización Acceso de Inicio">
              <el-select v-model="form.localizacionAcceso" placeholder="Seleccione" class="w-full" clearable :disabled="form.modalidadTRR === 'Trasplante'">
                <el-option v-for="opcion in opcionesAccesoFiltradas" :key="opcion.id" :label="opcion.label" :value="opcion.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Hospital Procedencia TRR en EsSalud" class="sm:col-span-2 xl:col-span-3">
              <el-autocomplete
                v-model="form.hospitalProcedencia"
                :fetch-suggestions="querySearch"
                clearable
                placeholder="Buscar hospital..."
                @select="handleSelect"
                class="w-full"
              />
            </el-form-item>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <el-button @click="$emit('cancelar')">Cancelar</el-button>
          <el-button type="primary" :loading="cargandoEdicionSupervisor" @click="registrarPaciente">
            {{ modoEdicionSupervisor ? 'Guardar cambios' : 'Registrar paciente' }}
          </el-button>
        </div>
      </el-form>
    </div>
  </el-config-provider>
</template>

<script setup>
import { reactive, computed, watch, ref, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import { getAllIpress, postAllIpress, patchAllIpress } from "@/services/ipress/Ipress.service";
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';
import { ElMessage, ElConfigProvider, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElAutocomplete } from 'element-plus';
import es from 'element-plus/dist/locale/es.mjs';
import Swal from 'sweetalert2';
import router from '@/router/index';

const periodoSeleccionado = ref(null);
const clinicaSeleccionada = ref('');
const idClinicaSeleccionada = ref(null);
const idPeriodoIpress = ref(null);
const ipress = ref([]);
const periodoIpress = ref([]);
// Props recibidos desde el componente padre
const props = defineProps({
  periodoInicial: {
    type: Number,
    default: null
  },
  idPeriodoIpressInicial: {
    type: Number,
    default: null
  },
  idClinicaInicial: {
    type: Number,
    default: null
  },
  nombreClinicaInicial: {
    type: String,
    default: ''
  },
  /** Precarga número de documento (p. ej. tras “no encontrado” en lista de pacientes). */
  numeroDocumentoInicial: {
    type: String,
    default: ''
  },
  /** Edición por supervisor desde lista de pacientes (requiere ficha diálisis). */
  idPacienteEdicionSupervisor: {
    type: [Number, String],
    default: null
  },
  idPacienteDialisisEdicionSupervisor: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['cancelar', 'guardado'])

const modoEdicionSupervisor = ref(false)
const cargandoEdicionSupervisor = ref(false)
const idPacienteEdicionInterno = ref(null)
const idPacienteDialisisEdicionInterno = ref(null)
/** Evita que los watchers de modalidad/tipo borren datos al hidratar edición supervisor */
const silenciarWatchsAccesoModalidad = ref(false)

const periodos = ref([])
const listaEtiologias = ref([])
const consultandoDNI = ref(false)
const errorDNI = ref('')
const form = reactive({
  tipoDocumento: '',
  numeroDocumento: '',
  nombreCompleto: '',
  fechaNacimiento: '',
  edad: '',
  sexo: '',
  gradoInstruccion: '',
  etiologiaGeneral: '',
  etiologiaEspecifica: '',
  comorbilidades: [],
  modalidadTRR: '',
  fechaInicioTRR: '',
  subsistemaSalud: '',
  edadInicioTRR: '',
  tipoAccesoInicio: '',
  fechaCreacionAcceso: '',
  fechaIngresoEsSalud: '',
  fechaPrimerIngreso: '',
  localizacionAcceso: '',
  hospitalProcedencia: '',
  departamento: '', // <-- AGREGADO
  provincia: '',    // <-- AGREGADO
  distrito: '',     // <-- AGREGADO
  ubigeo: '',       // <-- AGREGADO
  estado: 'REGISTRADO',
  idPeriodo: null,
})

// ==========================================
// LÓGICA DE DIRECCIÓN EN CASCADA
// ==========================================
const catalogoUbigeo = ref([
  { departamento: 'LIMA', provincia: 'LIMA', distrito: 'LIMA', ubigeo: '150101' },
  { departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN BORJA', ubigeo: '150130' },
  { departamento: 'LIMA', provincia: 'LIMA', distrito: 'SAN ISIDRO', ubigeo: '150131' },
  { departamento: 'LIMA', provincia: 'LIMA', distrito: 'MIRAFLORES', ubigeo: '150122' },
  { departamento: 'AREQUIPA', provincia: 'AREQUIPA', distrito: 'AREQUIPA', ubigeo: '040101' },
  { departamento: 'CALLAO', provincia: 'CALLAO', distrito: 'CALLAO', ubigeo: '070101' }
]);

const listaDepartamentos = computed(() => {
  const deps = catalogoUbigeo.value.map(u => u.departamento);
  return [...new Set(deps)].sort(); 
});

const listaProvincias = computed(() => {
  if (!form.departamento) return [];
  const provs = catalogoUbigeo.value
    .filter(u => u.departamento === form.departamento)
    .map(u => u.provincia);
  return [...new Set(provs)].sort();
});

const listaDistritos = computed(() => {
  if (!form.provincia) return [];
  const dists = catalogoUbigeo.value
    .filter(u => u.departamento === form.departamento && u.provincia === form.provincia)
    .map(u => u.distrito);
  return [...new Set(dists)].sort();
});

// Limpiadores si el usuario cambia los datos a mano
watch(() => form.departamento, (newVal, oldVal) => {
  if (oldVal && newVal !== oldVal) {
    form.provincia = ''; form.distrito = ''; form.ubigeo = '';
  }
});
watch(() => form.provincia, (newVal, oldVal) => {
  if (oldVal && newVal !== oldVal) {
    form.distrito = ''; form.ubigeo = '';
  }
});
watch(() => form.distrito, (newVal) => {
  if (newVal && form.departamento && form.provincia) {
    const ubi = catalogoUbigeo.value.find(
      u => u.departamento === form.departamento && u.provincia === form.provincia && u.distrito === newVal
    );
    if (ubi) form.ubigeo = ubi.ubigeo;
  }
});
// ==========================================
const validarFormulario = () => {
  const camposObligatorios = [
    'tipoDocumento',
    'numeroDocumento',
    'nombreCompleto',
    'fechaNacimiento',
    'sexo',
    'gradoInstruccion',
    'etiologiaGeneral',
    'etiologiaEspecifica',
    'modalidadTRR',
    'fechaInicioTRR',
    'subsistemaSalud',
    'fechaCreacionAcceso',
    'fechaIngresoEsSalud',
    'fechaPrimerIngreso',
    'localizacionAcceso',
    'hospitalProcedencia'
  ];

  // Si la modalidad no es Trasplante, el tipo de acceso es obligatorio
  if (form.modalidadTRR !== 'Trasplante') {
    camposObligatorios.push('tipoAccesoInicio');
  }

  for (const campo of camposObligatorios) {
    if (!form[campo]) {
      ElMessage({
        message: `Por favor complete el campo: ${campo}`,
        type: 'warning',
        plain: true,
      })
      return false;
    }
  }

  if (!validarFechasFormulario()) {
    ElMessage({
      message: 'Revise las fechas marcadas en rojo antes de continuar.',
      type: 'warning',
      plain: true,
    });
    return false;
  }

  return true;
};

/** Mismo formato en pantalla y en v-model para que el texto escrito no se borre al salir del campo. */
const attrsFechaDDMMAAAA = {
  type: 'date',
  placeholder: 'DD/MM/AAAA',
  format: 'DD/MM/YYYY',
  valueFormat: 'DD/MM/YYYY',
  editable: true,
  class: 'w-full',
};

const FORMATOS_FECHA_ENTRADA = ['DD/MM/YYYY', 'D/M/YYYY', 'DD-MM-YYYY', 'D-M-YYYY', 'YYYY-MM-DD'];

const fechaDisplayAISO = (valor) => {
  if (valor == null || valor === '') return '';
  const s = String(valor).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  for (const fmt of FORMATOS_FECHA_ENTRADA) {
    const d = dayjs(s, fmt, true);
    if (d.isValid()) return d.format('YYYY-MM-DD');
  }
  return '';
};

const fechaIsoADDisplay = (valor) => {
  if (valor == null || valor === '') return '';
  const iso = fechaDisplayAISO(valor) || String(valor).slice(0, 10);
  const d = dayjs(iso, 'YYYY-MM-DD', true);
  return d.isValid() ? d.format('DD/MM/YYYY') : '';
};

const fechaFormularioParaApi = (valor) => fechaDisplayAISO(valor);

const normalizarFecha = (valor) => {
  if (valor == null || valor === '') return null;

  if (valor instanceof Date) {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return null;
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  }

  const iso = fechaDisplayAISO(valor);
  if (!iso) return null;

  const fecha = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(fecha.getTime())) return null;

  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

/** Rango del periodo elegido en pantalla (mes completo). */
const rangoPeriodoSeleccionado = computed(() => {
  const v = periodoSeleccionado.value;
  const listaPeriodos = Array.isArray(periodos.value) ? periodos.value : [];
  if (v == null || v === '') return null;

  const encontrado = listaPeriodos.find(
    (periodo) =>
      periodo.id_periodo === v ||
      String(periodo.id_periodo) === String(v) ||
      periodo.periodo === v
  );
  const periodoTexto =
    encontrado?.periodo ?? (typeof v === 'string' && /^\d{4}-\d{2}$/.test(v) ? v : null);
  if (!periodoTexto) return null;

  const inicio = normalizarFecha(`${periodoTexto}-01`);
  if (!inicio) return null;

  const fin = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 0);
  fin.setHours(0, 0, 0, 0);
  return { inicio, fin, etiqueta: periodoTexto };
});

/** Fechas TRR: pueden ser anteriores al periodo, pero no después del último día del periodo seleccionado. */
const CAMPOS_FECHA_TOPE_PERIODO = [
  'fechaCreacionAcceso',
  'fechaInicioTRR',
  'fechaIngresoEsSalud',
  'fechaPrimerIngreso',
];

const esDespuesDelPeriodoSeleccionado = (valor) => {
  const rango = rangoPeriodoSeleccionado.value;
  const fecha = normalizarFecha(valor);
  if (!rango || !fecha) return false;
  return fecha > rango.fin;
};

/** Mensajes en rojo bajo cada fecha; no usa disabled-date para no borrar lo escrito al salir del campo. */
const erroresFecha = reactive({
  fechaNacimiento: '',
  fechaCreacionAcceso: '',
  fechaInicioTRR: '',
  fechaIngresoEsSalud: '',
  fechaPrimerIngreso: '',
});

const CAMPOS_FECHA_VALIDACION = [
  { key: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
  { key: 'fechaCreacionAcceso', label: 'Fecha de Creación del Acceso de Inicio' },
  { key: 'fechaInicioTRR', label: 'Fecha de Inicio de TRR' },
  { key: 'fechaIngresoEsSalud', label: 'Fecha de Ingreso a Hospital EsSalud' },
  { key: 'fechaPrimerIngreso', label: 'Fecha de Primer Ingreso a Unidad' },
];

const validarCampoFecha = (key, label) => {
  const valor = form[key];
  if (!valor) {
    erroresFecha[key] = '';
    return;
  }

  const fecha = normalizarFecha(valor);
  if (!fecha) {
    erroresFecha[key] = 'Fecha inválida. Use el formato DD/MM/AAAA.';
    return;
  }

  if (key === 'fechaNacimiento') {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha > hoy) {
      erroresFecha[key] = 'La fecha de nacimiento no puede ser futura.';
      return;
    }
    erroresFecha[key] = '';
    return;
  }

  if (CAMPOS_FECHA_TOPE_PERIODO.includes(key) && esDespuesDelPeriodoSeleccionado(valor)) {
    const rango = rangoPeriodoSeleccionado.value;
    erroresFecha[key] = rango
      ? `${label} no puede ser posterior al periodo ${rango.etiqueta}.`
      : `${label} no puede ser posterior al periodo seleccionado.`;
    return;
  }

  if (key === 'fechaInicioTRR') {
    const creacion = normalizarFecha(form.fechaCreacionAcceso);
    if (creacion && fecha < creacion) {
      erroresFecha[key] = 'No puede ser anterior a la Fecha de Creación del Acceso de Inicio.';
      return;
    }
  }

  erroresFecha[key] = '';
};

const actualizarErroresFechas = () => {
  for (const campo of CAMPOS_FECHA_VALIDACION) {
    validarCampoFecha(campo.key, campo.label);
  }
};

const validarFechasFormulario = () => {
  actualizarErroresFechas();
  return !Object.values(erroresFecha).some((msg) => msg && String(msg).trim());
};

watch(
  () => [
    form.fechaNacimiento,
    form.fechaCreacionAcceso,
    form.fechaInicioTRR,
    form.fechaIngresoEsSalud,
    form.fechaPrimerIngreso,
    periodoSeleccionado.value,
  ],
  () => actualizarErroresFechas()
);

/** Edad al inicio de TRR = fecha inicio TRR − fecha de nacimiento; también resuelve idPeriodo. */
const calcularEdadInicioTRR = () => {
  if (!form.fechaInicioTRR) {
    form.edadInicioTRR = '';
    form.idPeriodo = null;
    return;
  }

  const fechaInicioTRR = normalizarFecha(form.fechaInicioTRR);
  if (!fechaInicioTRR) {
    form.edadInicioTRR = '';
    form.idPeriodo = null;
    return;
  }

  const periodoStr = `${fechaInicioTRR.getFullYear()}-${String(fechaInicioTRR.getMonth() + 1).padStart(2, '0')}`;
  const periodoEncontrado = periodos.value.find((p) => p.periodo === periodoStr);
  form.idPeriodo = periodoEncontrado ? periodoEncontrado.id_periodo : null;

  if (!form.fechaNacimiento) {
    form.edadInicioTRR = '';
    return;
  }

  const nacimiento = normalizarFecha(form.fechaNacimiento);
  if (!nacimiento) {
    form.edadInicioTRR = '';
    return;
  }

  let edad = fechaInicioTRR.getFullYear() - nacimiento.getFullYear();
  const m = fechaInicioTRR.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && fechaInicioTRR.getDate() < nacimiento.getDate())) {
    edad--;
  }
  form.edadInicioTRR = edad;
};

const onCambioFechasTRR = () => {
  actualizarErroresFechas();
  calcularEdadInicioTRR();
};

watch(() => [form.fechaInicioTRR, form.fechaNacimiento], calcularEdadInicioTRR);

/** Normaliza texto de etiología para comparaciones (sin tildes, mayúsculas). */
const normalizarGeneralEtiologia = (texto) =>
  String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();

/** Categorías generales únicas desde GET /etiologia/ (orden del servicio). */
const opcionesEtiologiaGeneralFromApi = computed(() => {
  const lista = listaEtiologias.value || [];
  const seen = new Set();
  const out = [];
  for (const e of lista) {
    const g = (e.general && String(e.general).trim()) || '';
    if (g && !seen.has(g)) {
      seen.add(g);
      out.push(g);
    }
  }
  return out;
});

/** Etiologías específicas filtradas por la categoría general seleccionada (campo `general` del API). */
const opcionesEtiologiaEspecificaFromApi = computed(() => {
  const general = (form.etiologiaGeneral && String(form.etiologiaGeneral).trim()) || '';
  if (!general) return [];
  return (listaEtiologias.value || []).filter(
    (e) => String(e.general || '').trim() === general
  );
});

const etiologiaGeneralEsDiabetes = computed(
  () => normalizarGeneralEtiologia(form.etiologiaGeneral) === 'DIABETES'
);

const etiologiaGeneralEsHipertension = computed(() => {
  const g = normalizarGeneralEtiologia(form.etiologiaGeneral);
  return g.includes('HIPERTENSION') && g.includes('VASOS GRANDES');
});

// --- LÓGICA DEL SELECTOR DE PERIODO (NUEVO) ---

const fechaVisual = ref(''); // Variable para el input visual del date-picker

// 1. Validar fechas en el calendario (Bloquear las que no están en la lista)
const esFechaDeshabilitada = (time) => {
  if (periodos.value.length === 0) return true;

  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, '0');
  const fechaCalendario = `${year}-${month}`;

  // Si la fecha existe en tus periodos cargados, devuelve false (habilitado)
  const existe = periodos.value.some(p => p.periodo === fechaCalendario);
  return !existe;
};

// --- 1. Definir la lista maestra de TIPOS de acceso ---
const listaTiposAcceso = [
  { id: '1', label: 'Catéter Venoso Central Temporal' },
  { id: '2', label: 'Catéter Venoso Central de Larga Permanencia' },
  { id: '3', label: 'Fístula Arteriovenosa' },
  { id: '4', label: 'Injerto Autólogo' },
  { id: '5', label: 'Injerto Protésico' },
  { id: '6', label: 'Catéter peritoneal' }
];

const resolverTipoAccesoTexto = (valor) => {
  if (!valor) return '';
  const encontrado = listaTiposAcceso.find(
    (tipo) => String(tipo.id) === String(valor) || tipo.label === valor
  );
  return encontrado?.label ?? valor;
};

const tipoAccesoLabelAId = (tipoAccesoApi) => {
  const t = String(tipoAccesoApi || '').trim();
  if (!t) return '';
  const found = listaTiposAcceso.find((x) => {
    if (String(x.id) === t || x.label === t) return true;
    try {
      return String(x.label).localeCompare(t, undefined, { sensitivity: 'accent' }) === 0;
    } catch {
      return false;
    }
  });
  if (found) return found.id;
  const tl = t.toLowerCase();
  if (tl.includes('no habido') || tl === '—' || tl === '-') return '';
  if (tl.includes('peritoneal')) return '6';
  if (tl.includes('fístula') || tl.includes('fistula') || tl.includes('fav')) return '3';
  if (tl.includes('injerto') && tl.includes('autólogo')) return '4';
  if (tl.includes('injerto') && tl.includes('prot')) return '5';
  if (tl.includes('cvct') || tl.includes('temporal')) return '1';
  if (tl.includes('cvclp') || tl.includes('larga permanencia')) return '2';
  return '';
};

const valorPkOAnidado = (val) => {
  if (val == null || val === '') return null;
  if (typeof val === 'object') {
    if (val.id_etiologia != null) return val.id_etiologia;
    if (val.id != null) return val.id;
  }
  return val;
};

const apiGeneroAForm = (s) => {
  const u = String(s || '').trim().toUpperCase();
  if (u === 'M' || u.startsWith('MASC')) return 'M';
  if (u === 'F' || u.startsWith('FEM')) return 'F';
  return String(s || '').trim();
};

const normalizarFechaApi = (f) => {
  if (f == null || f === '') return '';
  const s = String(f).trim();
  if (s.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return s;
};

const esSiComorb = (v) => {
  const s = String(v || '').trim().toLowerCase();
  return s === 'sí' || s === 'si' || s === 's';
};

const mapComorbilidadesDesdeDialisis = (dia) => {
  const cm = [];
  if (esSiComorb(dia.enf_insuficiencia_cardiaca_congestiva)) cm.push('Insuficiencia cardiaca');
  if (esSiComorb(dia.enf_diabetes)) cm.push('Diabetes');
  if (esSiComorb(dia.enf_ateroesclerotica_cardiaca)) cm.push('Aterosclerosis');
  if (esSiComorb(dia.enf_hipertension)) cm.push('Hipertensión');
  if (esSiComorb(dia.enf_vascular_periferica)) cm.push('Vascular periférica');
  if (esSiComorb(dia.enf_tuberculosis)) cm.push('Tuberculosis');
  if (esSiComorb(dia.enf_cerebro_vascular)) cm.push('ACV');
  if (esSiComorb(dia.enf_cancer)) cm.push('Cáncer');
  if (esSiComorb(dia.enf_otra)) cm.push('Otra');
  return cm;
};

const inferirCategoriaEtiologiaFromEt = (et) => {
  if (!et || !et.general) return '';
  return String(et.general).trim();
};

// Filtro A: Modalidad -> Tipos disponibles
const tiposAccesoFiltrados = computed(() => {
  const modalidad = form.modalidadTRR;

  if (modalidad === 'Hemodiálisis') {
    // Mostramos todo MENOS Peritoneal (ID 6)
    return listaTiposAcceso.filter(t => t.id !== '6');
  }
  else if (modalidad === 'Diálisis Peritoneal') {
    // Solo mostramos Peritoneal (ID 6)
    return listaTiposAcceso.filter(t => t.id === '6');
  }
  return [];
});

// 2. Procesar el cambio cuando el usuario elige una fecha
const procesarCambioPeriodo = (fecha) => {
  if (!fecha) return;

  // Buscamos el objeto periodo completo usando el string "YYYY-MM"
  const encontrado = periodos.value.find(p => p.periodo === fecha);

  if (encontrado) {
    // Actualizamos la variable principal del formulario
    periodoSeleccionado.value = encontrado.id_periodo;

    // Ejecutamos la búsqueda de IPRESS (lo que hacía tu @change antes)
    searchPeriodoIpress();
  } else {
    ElMessage.warning('El periodo seleccionado no está disponible');
    fechaVisual.value = '';
  }
};

// 3. Sincronizar visualmente (ID -> Texto)
const sincronizarVisual = (id) => {
  if (id && periodos.value.length > 0) {
    const p = periodos.value.find(item => item.id_periodo === id);
    if (p) fechaVisual.value = p.periodo;
  }
};

// --- FIN LÓGICA SELECTOR ---

// ✅ PEGA ESTO (El bloque completo y sano)

// 1. Lista maestra de opciones
const listaOpcionesAcceso = [
  // Fístula (Corresponde al id '3')
  { id: '1', label: 'FAV radial derecha', idPadre: '3' },
  { id: '2', label: 'FAV radial izquierda', idPadre: '3' },
  { id: '3', label: 'FAV braquial o cubital derecha', idPadre: '3' },
  { id: '4', label: 'FAV braquial o cubital izquierda', idPadre: '3' },

  // Temporal (Corresponde al id '1')
  { id: '5', label: 'CVCT yugular derecha', idPadre: '1' },
  { id: '6', label: 'CVCT yugular izquierdo', idPadre: '1' },
  { id: '7', label: 'CVCT subclavio derecho', idPadre: '1' },
  { id: '8', label: 'CVCT subclavio izquierdo', idPadre: '1' },
  { id: '9', label: 'CVCT femoral derecho', idPadre: '1' },
  { id: '10', label: 'CVCT femoral izquierdo', idPadre: '1' },

  // Larga Permanencia (Corresponde al id '2')
  { id: '11', label: 'CVCLP yugular derecha', idPadre: '2' },
  { id: '12', label: 'CVCLP yugular izquierdo', idPadre: '2' },
  { id: '13', label: 'CVCLP femoral derecho', idPadre: '2' },
  { id: '14', label: 'CVCLP femoral izquierdo', idPadre: '2' },
  { id: '15', label: 'CVCLP translumbar', idPadre: '2' },
  { id: '16', label: 'CVCLP transhepático', idPadre: '2' },

  // Injerto Autólogo (Corresponde al id '4')
  { id: '17', label: 'Injerto autólogo', idPadre: '4' },

  // Injerto Protésico (Corresponde al id '5')
  { id: '18', label: 'Injerto protésico', idPadre: '5' },

  // Catéter Peritoneal (Corresponde al id '6')
  { id: '19', label: 'Catéter peritoneal', idPadre: '6' }
];

const resolverLocalizacionAccesoTexto = (valor) => {
  if (!valor) return '';
  const texto = String(valor).trim();
  const encontrado = listaOpcionesAcceso.find(
    (opcion) =>
      String(opcion.id) === texto ||
      opcion.label === texto ||
      opcion.label.replace(/^\d+\.\s*/, '') === texto
  );
  return encontrado?.label ?? texto;
};
// Filtro B: Tipo de Acceso -> Localizaciones específicas (Validación Cruzada)
const opcionesAccesoFiltradas = computed(() => {
  // CORRECCIÓN: Filtramos por el TIPO DE ACCESO, no solo la modalidad
  const tipoSeleccionado = form.tipoAccesoInicio;

  if (!tipoSeleccionado) return [];

  // Solo mostramos las localizaciones que son "hijas" del tipo seleccionado
  return listaOpcionesAcceso.filter(op => op.idPadre === tipoSeleccionado);
});
const hospitalesProcedencia = [
  { value: 'Hospital Base II Moquegua' },
  { value: 'Hospital Base III Chimbote' },
  { value: 'Hospital Base III Juliaca' },
  { value: 'Hospital Base III Puno' },
  { value: 'Hospital de Alta Complejidad de La Libertad Virgen de la Puerta' },
  { value: 'Hospital I El Buen Samaritano' },
  { value: 'Hospital I Higos Urco Chachapoyas' },
  { value: 'Hospital I Víctor Alfredo Lazo Peralta' },
  { value: 'Hospital I Alto Mayo' },
  { value: 'Hospital I Tumbes Carlos Alberto Cortez Jimenez' },
  { value: 'Hospital II Jorge Reátegui delgado' },
  { value: 'Hospital II Abancay' },
  { value: 'Hospital II Cajamarca' },
  { value: 'Hospital II Gustavo Lanatta Luján - Huacho' },
  { value: 'Hospital II Huamanga Carlos Tuppia García Godos' },
  { value: 'Hospital II Huancavelica' },
  { value: 'Hospital II Huánuco' },
  { value: 'Hospital II Huaraz' },
  { value: 'Hospital II Integrado Ilo' },
  { value: 'Hospital II Pucallpa' },
  { value: 'Hospital II Tarapoto' },
  { value: 'Hospital III Daniel Alcides Carrión' },
  { value: 'Hospital III Alberto L. Barton Thompson' },
  { value: 'Hospital III Guillermo Kaelin de la Fuente' },
  { value: 'Hospital III Iquitos' },
  { value: 'Hospital IV Augusto Hernández Mendoza' },
  { value: 'Hospital IV Víctor Lazarte Echegaray' },
  { value: 'Hospital Nacional Adolfo Guevara Velasco' },
  { value: 'Hospital Nacional Almanzor Aguinaga Asenjo' },
  { value: 'Hospital Nacional Carlos Alberto Seguin Escobedo' },
  { value: 'Hospital Nacional Ramiro Prialé Prialé' },
  { value: 'Hospital Nacional Alberto Sabogal Sologuren' },
  { value: 'Hospital Nacional Edgardo Rebagliati Martins' },
  { value: 'Hospital Nacional Guillermo Almenara Irigoyen' }
];


const filteredEtologiasGenerales = [
  { label: 'DIABETES' },
  { label: 'GLOMERULONEFRITIS' },
  { label: 'GLOMERULONEFRITIS SECUNDARIA/VASCULITIS' },
  { label: 'NEFRITIS INTERSTICIAL/PIELONEFRITIS' },
  { label: 'HIPERTENSION/ENFERMEDAD DE VASOS GRANDES' },
  { label: 'ENFERMEDAD QUISTICA/HEREDITARIA CONGÉNITA' },
  { label: 'NEOPLASIAS/TUMORES' },
  { label: 'COMPLICACIONES DE ÓRGANO TRASPLANTADO' },
  { label: 'OTRAS CONDICIONES' }
]
const querySearch = (queryString, cb) => {
  const results = queryString
    ? hospitalesProcedencia.filter(r =>
      r.value.toLowerCase().includes(queryString.toLowerCase())
    )
    : hospitalesProcedencia;
  cb(results);
};
const handleSelect = (val) => {
  console.log('Hospital seleccionado:', val);
};

const etiquetaTipoDocumento = computed(() => {
  if (form.tipoDocumento === 'DNI') return 'DNI';
  if (form.tipoDocumento === 'CE') return 'CE';
  if (form.tipoDocumento === 'PASAPORTE') return 'pasaporte';
  return 'documento';
});

/**
 * Asegurado vigente: flagIndicadorActivo "1", desEstadoConsulta vacío (codEstadoConsulta suele ser "0").
 * No asegurado: desEstadoConsulta con mensaje (ej. afiliado a EPS) o flagIndicadorActivo distinto de "1".
 */
const evaluarEstadoSeguroPaciente = (persona) => {
  const mensajeEstado = String(persona?.desEstadoConsulta ?? '').trim();
  const flagActivo = String(persona?.flagIndicadorActivo ?? '').trim();

  if (mensajeEstado) {
    return { asegurado: false, mensaje: mensajeEstado };
  }

  if (flagActivo !== '1') {
    return {
      asegurado: false,
      mensaje: 'El paciente no se encuentra asegurado activo en EsSalud.',
    };
  }

  return { asegurado: true, mensaje: '' };
};

const documentoValidoParaConsulta = computed(() => {
  const numero = String(form.numeroDocumento || '').trim();

  if (!form.tipoDocumento || !numero) {
    return false;
  }

  if (form.tipoDocumento === 'DNI') {
    return /^\d{8}$/.test(numero);
  }

  if (form.tipoDocumento === 'CE') {
    return /^\d{1,10}$/.test(numero);
  }

  if (form.tipoDocumento === 'PASAPORTE') {
    return numero.length >= 1 && numero.length <= 15;
  }

  return false;
});

const consultarDNI = async () => {
  // 1. Validaciones (Sin .value en form)
  if (!documentoValidoParaConsulta.value) {
    errorDNI.value =
      form.tipoDocumento === 'DNI'
        ? 'El DNI debe tener 8 dígitos'
        : form.tipoDocumento === 'CE'
          ? 'El CE debe tener entre 1 y 10 dígitos'
          : 'El pasaporte debe tener entre 1 y 15 caracteres';
    return;
  }
  if (!form.fechaNacimiento) {
    errorDNI.value = `Debe seleccionar una fecha de nacimiento para consultar ${etiquetaTipoDocumento.value}`;
    return;
  }

  consultandoDNI.value = true;
  errorDNI.value = '';

  try {
    // 2. Formatear fecha (Sin .value en form)
    const isoNac = fechaFormularioParaApi(form.fechaNacimiento);
    if (!isoNac) {
      errorDNI.value = 'Fecha de nacimiento inválida. Use el formato DD/MM/AAAA.';
      consultandoDNI.value = false;
      return;
    }
    const [anio, mes, dia] = isoNac.split('-');
    const fechaParaApi = `${dia}/${mes}/${anio}`;

    // Payload esperado por consulta_seguro en el backend
    const payload = {
      codOpcion: '1',
      codTipDoc: form.tipoDocumento === 'DNI' ? '1' : form.tipoDocumento === 'CE' ? '2' : '3',
      numDoc: form.numeroDocumento,
      fecNacimiento: fechaParaApi
    };

    // 3. Petición al backend con la misma base URL que el resto del formulario (evita ERR_CONNECTION)
    const response = await postAllIpress('/consulta-seguro/', payload);
    const data = response?.data ?? response;

    // 4. Validar respuesta y extraer datos
    if (data.codError !== "0") {
      errorDNI.value = data.desError || 'Error en la consulta del servicio.';
      return;
    }

    if (!data.vDataItem || !Array.isArray(data.vDataItem) || data.vDataItem.length === 0) {
      errorDNI.value = 'No se encontraron datos coincidentes.';
      return;
    }

    const persona = data.vDataItem[0];
    const estadoSeguro = evaluarEstadoSeguroPaciente(persona);

    // 5. Mapear nombre completo
    const apellidos = `${persona.apePaterno || ''} ${persona.apeMaterno || ''}`.trim();
    const nombres = `${persona.priNombre || ''} ${persona.segNombre || ''}`.trim();
    if (apellidos && nombres) {
      form.nombreCompleto = `${apellidos}, ${nombres}`.toUpperCase();
    }

    // 6. Mapear sexo (codGenero: "1" = Masculino, "2" = Femenino)
    if (persona.codGenero) {
      form.sexo = persona.codGenero === "1" ? 'M' : 'F';
    }

    // 7. Mapear fecha de nacimiento (convertir de DD/MM/YYYY a YYYY-MM-DD)
    if (persona.fecNac) {
      const [diaNac, mesNac, anioNac] = persona.fecNac.split('/');
      if (diaNac && mesNac && anioNac) {
        form.fechaNacimiento = fechaIsoADDisplay(
          `${anioNac}-${mesNac.padStart(2, '0')}-${diaNac.padStart(2, '0')}`
        );
      }
    }

    // 8. Mapear ubigeo y ubicación
    if (persona.codUbigeoDomicilio) {
      form.ubigeo = persona.codUbigeoDomicilio;
    }
    
    // 9. Extraer y mapear departamento, provincia y distrito desde desUbiDom
    // Formato: "LIMA LIMA SAN JUAN DE LURIGANCHO 1"
    // Orden: [DEPARTAMENTO] [PROVINCIA] [DISTRITO...] [NÚMERO]
    // Reemplaza desde if (persona.desUbiDom) hasta antes de ElMessage(...)
    if (persona.desUbiDom) {
      const partes = persona.desUbiDom.trim().split(/\s+/);
      
      if (partes.length >= 2) {
        const nombreDepartamento = partes[0] || '';
        const nombreProvincia = partes[1] || '';
        let nombreDistrito = '';
        
        if (partes.length >= 3) {
          const distritoPartes = partes.slice(2);
          const ultimoElemento = distritoPartes[distritoPartes.length - 1];
          if (/^\d+$/.test(ultimoElemento)) {
            nombreDistrito = distritoPartes.slice(0, -1).join(' ').trim();
          } else {
            nombreDistrito = distritoPartes.join(' ').trim();
          }
        }
        
        const ubigeoObtenido = persona.codUbigeoDomicilio || '';

        // Si EsSalud trae una zona nueva que no tienes, la guarda temporalmente
        if (nombreDepartamento && nombreProvincia && nombreDistrito) {
          const existe = catalogoUbigeo.value.find(u => u.departamento === nombreDepartamento && u.provincia === nombreProvincia && u.distrito === nombreDistrito);
          if (!existe) {
            catalogoUbigeo.value.push({
              departamento: nombreDepartamento,
              provincia: nombreProvincia,
              distrito: nombreDistrito,
              ubigeo: ubigeoObtenido
            });
          }
        }

        // ¡AQUÍ ESTÁ LA MAGIA DEL NEXTTICK!
        form.departamento = nombreDepartamento;
        await nextTick(); // Espera 1 milisegundo a que se armen las provincias
        form.provincia = nombreProvincia;
        await nextTick(); // Espera 1 milisegundo a que se armen los distritos
        form.distrito = nombreDistrito;
        form.ubigeo = ubigeoObtenido;
      }
    }

    calcularEdadInicioTRR();

    if (!estadoSeguro.asegurado) {
      await Swal.fire({
        title: 'Paciente no asegurado',
        text: estadoSeguro.mensaje,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d97706',
      });
      return;
    }

    ElMessage({ message: 'Datos encontrados y completados', type: 'success', plain: true });

  } catch (error) {
    console.error('Error consulta seguro:', error);
    const msg = error?.message || error?.error || '';
    if (msg.includes('Network') || msg.includes('ERR_')) {
      errorDNI.value = 'No se pudo conectar al servidor. Compruebe que el backend esté en ejecución y que VITE_API en .env apunte a la URL correcta (ej. http://localhost:8000).';
    } else {
      errorDNI.value = error?.error || 'Error al consultar el servicio.';
    }
  } finally {
    consultandoDNI.value = false;
  }
};

const puedeConsultar = computed(() => {
  return documentoValidoParaConsulta.value && 
         form.fechaNacimiento && 
         !consultandoDNI.value;
});

const validarOrden = (e) => {
  // 1. Si es Trasplante, no hacemos nada (el input ya está disabled por HTML y eso está bien)
  if (form.modalidadTRR === 'Trasplante') {
    return;
  }

  // 2. Si NO ha seleccionado el Tipo de Acceso todavía
  if (!form.tipoAccesoInicio) {
    // DETENEMOS TODO:
    e.preventDefault();  // Evita que el select se despliegue
    e.stopPropagation(); // Evita que el evento siga propagándose

    // 3. Mostramos la alerta
    ElMessage({
      message: '⚠️ Primero debe seleccionar el "Tipo de Acceso de Inicio".',
      type: 'warning',
      duration: 3000,
      plain: true,
    });
  }
};

const maxLengthDocumento = computed(() => {
  if (form.tipoDocumento === 'DNI') return 8;
  if (form.tipoDocumento === 'CE') return 10;
  if (form.tipoDocumento === 'PASAPORTE') return 15;
  return 15; // valor general para PASAPORTE u otros
});

watch(() => form.fechaNacimiento, (nuevaFecha) => {
  if (!nuevaFecha) {
    form.edad = '';
    return;
  }

  const nacimiento = normalizarFecha(nuevaFecha);
  if (!nacimiento) {
    form.edad = '';
    return;
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  form.edad = edad;
});

// Watcher para validación cruzada entre modalidad TRR y tipo de acceso
watch(() => form.modalidadTRR, (nuevaModalidad) => {
  if (silenciarWatchsAccesoModalidad.value) return;

  form.tipoAccesoInicio = '';
  form.localizacionAcceso = '';

  if (nuevaModalidad === 'Diálisis Peritoneal') {
    form.tipoAccesoInicio = '6';
  } else if (nuevaModalidad === 'Trasplante') {
    // sin acceso vascular
  }
});

// Watcher: tipo de acceso → localización sugerida (ids '1'…'6')
watch(() => form.tipoAccesoInicio, (nuevoTipoAcceso) => {
  if (silenciarWatchsAccesoModalidad.value) return;
  form.localizacionAcceso = '';
  if (nuevoTipoAcceso === '6') {
    form.localizacionAcceso = '19';
  } else if (nuevoTipoAcceso === '4') {
    form.localizacionAcceso = '17';
  } else if (nuevoTipoAcceso === '5') {
    form.localizacionAcceso = '18';
  }
});


// Watcher: Limpia las comorbilidades si coinciden con la etiología y resetea etiología específica
watch(() => form.etiologiaGeneral, (nuevoValor) => {
  form.etiologiaEspecifica = '';

  const g = normalizarGeneralEtiologia(nuevoValor);
  if (g === 'DIABETES') {
    form.comorbilidades = form.comorbilidades.filter((c) => c !== 'Diabetes');
  } else if (g.includes('HIPERTENSION') && g.includes('VASOS GRANDES')) {
    form.comorbilidades = form.comorbilidades.filter((c) => c !== 'Hipertensión');
  }
});

// Watcher para limpiar errores cuando se cambia el DNI
watch(() => form.numeroDocumento, () => {
  errorDNI.value = '';
});
const soloNumeros = computed(() => {
  return form.tipoDocumento === 'DNI' || form.tipoDocumento === 'CE';
});

const onDocumentoInput = (event) => {
  if (soloNumeros.value) {
    // Eliminar todo lo que no sea número
    form.numeroDocumento = event.target.value.replace(/\D/g, '');
  }
};
const registrarPaciente = async (url = null) => {
  if (modoEdicionSupervisor.value) {
    await guardarEdicionSupervisor();
    return;
  }
  if (!validarFormulario()) return;
  calcularEdadInicioTRR();
  const idPeriodo = getIdPeriodoParaPayload();
  if (idPeriodo == null) {
    ElMessage({
      message: 'Indique la Fecha de Inicio de TRR (periodo válido) o seleccione un periodo registrado en el sistema.',
      type: 'warning',
      plain: true,
    });
    return;
  }
  const payload = {
    documento: form.numeroDocumento,
    tipo_documento: form.tipoDocumento,
    autogenerado: "ASD",
    paciente: form.nombreCompleto,
    fecha_nacimiento: fechaFormularioParaApi(form.fechaNacimiento),
    genero: form.sexo,
    grado_instruccion: form.gradoInstruccion,
    id_modalidad: form.modalidadTRR == 'Hemodiálisis' ? 1 : form.modalidadTRR == 'Diálisis Peritoneal' ? 2 : 3,
  };

  try {
    const respuesta = await postAllIpress("/pacientes/", payload);
    const registrado = await registrarPacienteDialisis(respuesta);
    if (registrado) {
      await preguntarCaptacion(respuesta);
    }
  } catch (error) {
    console.log('¿Error tiene response?', error);
    /* alert(error.error); */
    ElMessage({
      message: error.error,
      type: 'error',
      plain: true,
    })
  }
}

/** Crea pacienteAtencion y luego unidadesActuales (Fecha creación acceso, Tipo acceso, Localización acceso). */
const crearPacienteAtencionYUnidadesActuales = async (idPaciente) => {
  const idPeriodo = getIdPeriodoParaPayload();
  if (idPeriodo == null) return null;

  const idModalidad = form.modalidadTRR === 'Hemodiálisis' ? 1 : form.modalidadTRR === 'Diálisis Peritoneal' ? 2 : 3;
  const fechaAtencion = fechaFormularioParaApi(form.fechaInicioTRR) || new Date().toISOString().slice(0, 10);

  const payloadAtencion = {
    id_paciente: idPaciente,
    id_ipress: null,
    id_periodo: idPeriodo,
    id_modalidad: idModalidad,
    fecha_atencion: fechaAtencion,
    tipo_atencion: 'NUEVO',
    estado: 'ACTIVO',
    fecha_inicio: new Date().toISOString().slice(0, 10),
  };

  const resAtencion = await postAllIpress('/pacienteAtencion/', payloadAtencion);
  const idPacienteAtencion = resAtencion?.id_paciente_atencion ?? resAtencion?.id;
  if (!idPacienteAtencion) return null;

  const tipoAcceso = form.modalidadTRR === 'Trasplante'
    ? 'NO HABIDO'
    : resolverTipoAccesoTexto(form.tipoAccesoInicio);
  const payloadUnidades = {
    id_paciente_atencion: idPacienteAtencion,
    fecha_creacion_acceso: fechaFormularioParaApi(form.fechaCreacionAcceso) || '',
    tipo_acceso: tipoAcceso,
    localizacion_acceso: resolverLocalizacionAccesoTexto(form.localizacionAcceso) || '',
  };

  await postAllIpress('/unidadesActuales/', payloadUnidades);
  return idPacienteAtencion;
}

const preguntarCaptacion = async (respuesta) => {
  const documentoPaciente = respuesta?.documento || form.numeroDocumento || '';
  const result = await Swal.fire({
    title: 'Paciente registrado',
    text: 'Desea captar al paciente ahora?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Si, captar',
    cancelButtonText: 'No',
    confirmButtonColor: '#16a34a',
  });

  if (result.isConfirmed) {
    const destino = {
      name: 'Movimientos',
      query: { captarDni: documentoPaciente },
    };
    const href = router.resolve(destino).href;
    window.location.assign(href);
    return;
  }

  ElMessage({ message: 'Paciente registrado exitosamente', type: 'success', plain: true });
  setTimeout(() => window.location.reload(), 1200);
};

const registrarPacienteDialisis = async (respuesta) => {
  const idEtiologia = form.etiologiaEspecifica != null && form.etiologiaEspecifica !== '' ? (Number(form.etiologiaEspecifica) || parseInt(form.etiologiaEspecifica, 10)) : null;
  if (idEtiologia == null || isNaN(idEtiologia)) {
    ElMessage({ message: 'Seleccione una etiología específica de la lista.', type: 'warning', plain: true });
    return false;
  }

  try {
    await crearPacienteAtencionYUnidadesActuales(respuesta.id_paciente);
  } catch (err) {
    console.error('Error al crear atención/unidades actuales:', err);
    ElMessage({ message: err?.error || 'Error al guardar datos de acceso a unidad.', type: 'warning', plain: true });
    return false;
  }

  const payload = {
    id_paciente: respuesta.id_paciente,
    id_etiologia: idEtiologia,
    modalidad_inicio_trr: form.modalidadTRR,
    fecha_inicio_trr: fechaFormularioParaApi(form.fechaInicioTRR),
    subsistema_salud: form.subsistemaSalud,
    tipo_acceso: form.modalidadTRR === 'Trasplante' ? 'NO HABIDO' : resolverTipoAccesoTexto(form.tipoAccesoInicio),
    fecha_creacion_acceso: fechaFormularioParaApi(form.fechaCreacionAcceso),
    fecha_primer_ingreso: fechaFormularioParaApi(form.fechaPrimerIngreso),
    enf_ateroesclerotica_cardiaca: form.comorbilidades.includes("Aterosclerosis") ? 'Sí' : 'NO',
    enf_insuficiencia_cardiaca_congestiva: form.comorbilidades.includes("Insuficiencia cardiaca") ? 'Sí' : 'NO',
    enf_vascular_periferica: form.comorbilidades.includes("Vascular periférica") ? 'Sí' : 'NO',
    enf_cerebro_vascular: form.comorbilidades.includes("ACV") ? 'Sí' : 'NO',
    enf_cancer: form.comorbilidades.includes("Cáncer") ? 'Sí' : 'NO',
    enf_diabetes: form.comorbilidades.includes("Diabetes") ? 'Sí' : 'NO',
    enf_hipertension: form.comorbilidades.includes("Hipertensión") ? 'Sí' : 'NO',
    enf_tuberculosis: form.comorbilidades.includes("Tuberculosis") ? 'Sí' : 'NO',
    enf_otra: form.comorbilidades.includes("Otra") ? 'Sí' : 'NO',
  };

  try {
    await postAllIpress("/pacientesDialisis/", payload);
    await registroPacienteHistorial(respuesta);
    return true;
  } catch (error) {
    console.error('Error al registrar diálisis:', error);
    ElMessage({ message: error?.error || 'Error al registrar datos de diálisis', type: 'error', plain: true });
    return false;
  }
}
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
  } catch (error) {
    console.error('Error al obtener periodos:', error);
  }
};

const fetchEtiologias = async () => {
  try {
    const respuesta = await getAllIpress("/etiologia/");
    listaEtiologias.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
  } catch (error) {
    console.error('Error al obtener etiologías:', error);
    listaEtiologias.value = [];
  }
};

/** Resuelve id_periodo: primero el mes de la fecha de inicio TRR, si no el periodo del selector. */
const getIdPeriodoParaPayload = () => {
  if (form.idPeriodo != null && form.idPeriodo !== '') {
    const desdeFecha = Number(form.idPeriodo);
    if (!Number.isNaN(desdeFecha)) return desdeFecha;
  }

  const v = periodoSeleccionado.value;
  if (v == null || v === '') return null;
  const listaPeriodos = Array.isArray(periodos.value) ? periodos.value : [];

  if (typeof v === 'number') {
    const periodoPorId = listaPeriodos.find((periodo) => periodo.id_periodo === v);
    return periodoPorId ? periodoPorId.id_periodo : null;
  }

  const numero = Number(v);
  if (!Number.isNaN(numero)) {
    const periodoPorNumero = listaPeriodos.find((periodo) => periodo.id_periodo === numero);
    if (periodoPorNumero) return periodoPorNumero.id_periodo;
  }

  const periodoPorTexto = listaPeriodos.find((periodo) => periodo.periodo === v);
  return periodoPorTexto ? periodoPorTexto.id_periodo : null;
};

const registroPacienteHistorial = async (respuesta) => {
  const payload = {
    paciente: respuesta.id_paciente,
    periodo: periodoSeleccionado.value,

    condicion: 'REGISTRADO',
  };

  try {
    await postAllIpress("/PacienteRegistro/", payload);
    return true;
  } catch (error) {
    console.error('Error al registrar historial:', error);
    return false;
  }
}


async function searchPeriodoIpress() {
  if (idClinicaSeleccionada.value == null || periodoSeleccionado.value == null) {
    idPeriodoIpress.value = null;
    return;
  }
  idPeriodoIpress.value = await resolverIdPeriodoIpress(
    periodoSeleccionado.value,
    idClinicaSeleccionada.value,
  );
}

// Fetch IPRESS asignadas al usuario
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

// Watchers para actualizar cuando cambien los props
watch(() => props.periodoInicial, (newVal) => {
  if (newVal) periodoSeleccionado.value = newVal;
}, { immediate: true });

watch(() => props.idPeriodoIpressInicial, (newVal) => {
  if (newVal) idPeriodoIpress.value = newVal;
}, { immediate: true });

watch(() => props.idClinicaInicial, (newVal) => {
  if (newVal) idClinicaSeleccionada.value = newVal;
}, { immediate: true });

watch(() => props.nombreClinicaInicial, (newVal) => {
  if (newVal) clinicaSeleccionada.value = newVal;
}, { immediate: true });

watch(() => props.numeroDocumentoInicial, (v) => {
  if (modoEdicionSupervisor.value) return;
  const s = (v || '').trim();
  if (!s) return;
  form.numeroDocumento = s;
  if (/^\d{8}$/.test(s)) {
    form.tipoDocumento = 'DNI';
  }
}, { immediate: true });

async function guardarEdicionSupervisor() {
  if (
    !modoEdicionSupervisor.value ||
    idPacienteEdicionInterno.value == null ||
    idPacienteDialisisEdicionInterno.value == null
  ) {
    return;
  }
  if (!validarFormulario()) return;
  calcularEdadInicioTRR();
  const idPeriodo = getIdPeriodoParaPayload();
  if (idPeriodo == null) {
    ElMessage({
      message: 'Indique la Fecha de Inicio de TRR (periodo válido) o seleccione un periodo registrado en el sistema.',
      type: 'warning',
      plain: true,
    });
    return;
  }
  const idEtiologia =
    form.etiologiaEspecifica != null && form.etiologiaEspecifica !== ''
      ? Number(form.etiologiaEspecifica) || parseInt(form.etiologiaEspecifica, 10)
      : null;
  if (idEtiologia == null || Number.isNaN(idEtiologia)) {
    ElMessage({ message: 'Seleccione una etiología específica de la lista.', type: 'warning', plain: true });
    return;
  }

  cargandoEdicionSupervisor.value = true;
  try {
    const payloadPaciente = {
      documento: form.numeroDocumento,
      tipo_documento: form.tipoDocumento,
      autogenerado: 'ASD',
      paciente: form.nombreCompleto,
      fecha_nacimiento: fechaFormularioParaApi(form.fechaNacimiento),
      genero: form.sexo,
      grado_instruccion: form.gradoInstruccion,
      id_modalidad: form.modalidadTRR === 'Hemodiálisis' ? 1 : form.modalidadTRR === 'Diálisis Peritoneal' ? 2 : 3,
    };
    await patchAllIpress(`/pacientes/${idPacienteEdicionInterno.value}/`, payloadPaciente);

    const payloadDialisis = {
      id_paciente: idPacienteEdicionInterno.value,
      id_etiologia: idEtiologia,
      modalidad_inicio_trr: form.modalidadTRR,
      fecha_inicio_trr: fechaFormularioParaApi(form.fechaInicioTRR),
      subsistema_salud: form.subsistemaSalud,
      tipo_acceso: form.modalidadTRR === 'Trasplante' ? 'NO HABIDO' : resolverTipoAccesoTexto(form.tipoAccesoInicio),
      fecha_creacion_acceso: fechaFormularioParaApi(form.fechaCreacionAcceso),
      fecha_primer_ingreso: fechaFormularioParaApi(form.fechaPrimerIngreso),
      enf_ateroesclerotica_cardiaca: form.comorbilidades.includes('Aterosclerosis') ? 'Sí' : 'NO',
      enf_insuficiencia_cardiaca_congestiva: form.comorbilidades.includes('Insuficiencia cardiaca') ? 'Sí' : 'NO',
      enf_vascular_periferica: form.comorbilidades.includes('Vascular periférica') ? 'Sí' : 'NO',
      enf_cerebro_vascular: form.comorbilidades.includes('ACV') ? 'Sí' : 'NO',
      enf_cancer: form.comorbilidades.includes('Cáncer') ? 'Sí' : 'NO',
      enf_diabetes: form.comorbilidades.includes('Diabetes') ? 'Sí' : 'NO',
      enf_hipertension: form.comorbilidades.includes('Hipertensión') ? 'Sí' : 'NO',
      enf_tuberculosis: form.comorbilidades.includes('Tuberculosis') ? 'Sí' : 'NO',
      enf_otra: form.comorbilidades.includes('Otra') ? 'Sí' : 'NO',
    };
    await patchAllIpress(`/pacientesDialisis/${idPacienteDialisisEdicionInterno.value}/`, payloadDialisis);

    ElMessage({ message: 'Cambios guardados correctamente.', type: 'success', plain: true });
    emit('guardado');
  } catch (error) {
    console.error(error);
    ElMessage({
      message: error?.error || error?.message || 'No se pudieron guardar los cambios.',
      type: 'error',
      plain: true,
    });
  } finally {
    cargandoEdicionSupervisor.value = false;
  }
}

async function cargarEdicionSupervisor() {
  const idP = props.idPacienteEdicionSupervisor;
  const idDial = props.idPacienteDialisisEdicionSupervisor;
  if (idP == null || idP === '' || idDial == null || idDial === '') {
    modoEdicionSupervisor.value = false;
    idPacienteEdicionInterno.value = null;
    idPacienteDialisisEdicionInterno.value = null;
    return;
  }

  modoEdicionSupervisor.value = true;
  idPacienteEdicionInterno.value = Number(idP);
  idPacienteDialisisEdicionInterno.value = Number(idDial);
  cargandoEdicionSupervisor.value = true;
  silenciarWatchsAccesoModalidad.value = true;

  try {
    await fetchPeriodo();
    await fetchEtiologias();
    const pac = await getAllIpress(`/pacientes/${idP}/`);
    form.tipoDocumento = pac.tipo_documento || '';
    form.numeroDocumento = pac.documento || '';
    form.nombreCompleto = pac.paciente || '';
    form.fechaNacimiento = fechaIsoADDisplay(pac.fecha_nacimiento);
    form.sexo = apiGeneroAForm(pac.genero);
    form.gradoInstruccion = pac.grado_instruccion || '';

    const idModRaw = valorPkOAnidado(pac.id_modalidad);
    const idMod = Number(idModRaw);
    if (!Number.isNaN(idMod) && idModRaw != null) {
      form.modalidadTRR = idMod === 1 ? 'Hemodiálisis' : idMod === 2 ? 'Diálisis Peritoneal' : idMod === 3 ? 'Trasplante' : '';
    }

    const dia = await getAllIpress(`/pacientesDialisis/${idDial}/`);
    if (dia.modalidad_inicio_trr) {
      form.modalidadTRR = dia.modalidad_inicio_trr;
    }
    form.fechaInicioTRR = fechaIsoADDisplay(dia.fecha_inicio_trr);
    form.subsistemaSalud = dia.subsistema_salud || '';
    form.fechaCreacionAcceso = fechaIsoADDisplay(dia.fecha_creacion_acceso);
    form.fechaPrimerIngreso = fechaIsoADDisplay(dia.fecha_primer_ingreso);
    form.comorbilidades = mapComorbilidadesDesdeDialisis(dia);

    const tipoId = tipoAccesoLabelAId(dia.tipo_acceso);
    form.tipoAccesoInicio = tipoId || (form.modalidadTRR === 'Diálisis Peritoneal' ? '6' : '');

    let idEt = valorPkOAnidado(dia.id_etiologia);
    if (idEt == null) idEt = dia.id_etiologia_id;
    idEt = idEt != null ? Number(idEt) : null;
    if (idEt != null && !Number.isNaN(idEt)) {
      const lista = listaEtiologias.value || [];
      const et = lista.find((e) => Number(e.id_etiologia) === idEt);
      if (et) {
        const cat = inferirCategoriaEtiologiaFromEt(et);
        if (cat) form.etiologiaGeneral = cat;
      }
      await nextTick();
      form.etiologiaEspecifica = idEt;
    }

    await nextTick();
  } catch (e) {
    console.error(e);
    ElMessage({ message: e?.error || 'No se pudo cargar el paciente para edición.', type: 'error', plain: true });
    modoEdicionSupervisor.value = false;
    idPacienteEdicionInterno.value = null;
    idPacienteDialisisEdicionInterno.value = null;
  } finally {
    silenciarWatchsAccesoModalidad.value = false;
    cargandoEdicionSupervisor.value = false;
    actualizarErroresFechas();
    calcularEdadInicioTRR();
  }
}

watch(
  () => [props.idPacienteEdicionSupervisor, props.idPacienteDialisisEdicionSupervisor],
  () => {
    cargarEdicionSupervisor();
  },
  { immediate: true }
);

onMounted(() => {
  fetchPeriodo();
  fetchEtiologias();
});
</script>

<style scoped>
.formulario-paciente :deep(.form-grid .el-form-item) {
  margin-bottom: 0;
  align-items: stretch;
}

.formulario-paciente :deep(.form-grid .el-form-item__label) {
  display: flex;
  align-items: flex-end;
  min-height: 2.75rem;
  padding-bottom: 8px;
  line-height: 1.3;
  height: auto !important;
  white-space: normal;
}

.formulario-paciente :deep(.trr-grid .el-form-item__label) {
  min-height: 3rem;
}

.formulario-paciente :deep(.form-grid .el-form-item__content) {
  align-items: flex-start;
}

.formulario-paciente :deep(.el-date-editor),
.formulario-paciente :deep(.el-select),
.formulario-paciente :deep(.el-autocomplete) {
  width: 100%;
}
</style>