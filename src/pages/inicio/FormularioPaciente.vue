<template>
  <el-config-provider :locale="es">
    <div class="space-y-6 mx-6 max-w-6xl">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Registro de Nuevo Paciente en Diálisis</h2>
        <p class="text-sm text-slate-500 mt-1">Complete los datos del paciente para la creación del expediente médico.</p>
      </div>

      <el-form label-position="top" class="space-y-6">
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200">Identificación y Ubicación</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <el-form-item label="Tipo de Documento" required>
              <el-select v-model="form.tipoDocumento" placeholder="Seleccione" class="w-full" clearable>
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
                :disabled="consultandoDNI"
                @input="onDocumentoInput"
              />
              <div v-if="errorDNI" class="text-red-500 text-xs mt-1">{{ errorDNI }}</div>
            </el-form-item>
            <el-form-item label="Fecha de Nacimiento" required>
              <el-date-picker
                v-model="form.fechaNacimiento"
                type="date"
                placeholder="Seleccione fecha"
                value-format="YYYY-MM-DD"
                format="DD/MM/YYYY"
                :editable="false"
                :clearable="false"
                class="w-full"
                :disabled-date="(d) => d > new Date()"
              />
            </el-form-item>
            <el-form-item label=" " class="flex items-end">
              <el-button v-if="puedeConsultar" type="primary" :loading="consultandoDNI" @click="consultarDNI" class="w-full">
                Consultar DNI
              </el-button>
              <span v-else-if="form.tipoDocumento === 'DNI'" class="text-xs text-slate-400">Ingrese DNI y F. Nac. para consultar</span>
            </el-form-item>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
            <div class="col-span-full text-xs font-semibold text-slate-500 uppercase tracking-wide">Domicilio / Procedencia (Según Reniec/Asegurado)</div>
            <el-form-item label="Departamento">
              <el-select v-model="form.departamento" placeholder="Seleccione" class="w-full" clearable>
                <el-option v-for="dep in listaDepartamentos" :key="dep" :label="dep" :value="dep" />
              </el-select>
            </el-form-item>
            <el-form-item label="Provincia">
              <el-select v-model="form.provincia" placeholder="Seleccione" class="w-full" clearable :disabled="!form.departamento">
                <el-option v-for="prov in listaProvincias" :key="prov" :label="prov" :value="prov" />
              </el-select>
            </el-form-item>
            <el-form-item label="Distrito">
              <el-select v-model="form.distrito" placeholder="Seleccione" class="w-full" clearable :disabled="!form.provincia">
                <el-option v-for="dist in listaDistritos" :key="dist" :label="dist" :value="dist" />
              </el-select>
            </el-form-item>
            <el-form-item label="Ubigeo (Auto)">
              <el-input v-model="form.ubigeo" readonly class="font-mono text-center" />
            </el-form-item>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <el-form-item label="Apellidos y Nombres" required class="sm:col-span-2">
              <el-input v-model="form.nombreCompleto" readonly placeholder="Se completará al consultar" />
            </el-form-item>
            <el-form-item label="Edad actual">
              <el-input v-model="form.edad" readonly />
            </el-form-item>
            <el-form-item label="Sexo" required>
              <el-select v-model="form.sexo" placeholder="Seleccione" class="w-full" clearable>
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <el-form-item label="Etiología general">
            <el-select v-model="form.etiologiaGeneral" placeholder="Seleccione una opción" class="w-full" clearable>
              <el-option v-for="(item, key) in etologiasGenerales" :key="key" :label="item" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="Etiología específica">
            <el-select v-model="form.etiologiaEspecifica" placeholder="Seleccione una opción" class="w-full" clearable filterable>
              <el-option v-for="e in opcionesEtiologiaEspecificaFromApi" :key="e.id_etiologia" :label="e.especifica || e.codigo || e.id_etiologia" :value="e.id_etiologia" />
            </el-select>
          </el-form-item>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm" :key="form.etiologiaGeneral">
          <h3 class="text-base font-semibold text-slate-700 mb-4">Comorbilidad</h3>
          <el-checkbox-group v-model="form.comorbilidades">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <el-checkbox value="Insuficiencia cardiaca">Insuficiencia cardiaca congestiva</el-checkbox>
              <el-checkbox v-if="form.etiologiaGeneral != '1'" value="Diabetes">Diabetes</el-checkbox>
              <el-checkbox value="Aterosclerosis">Aterosclerosis cardíaca</el-checkbox>
              <el-checkbox v-if="form.etiologiaGeneral != '5'" value="Hipertensión">Hipertensión</el-checkbox>
              <el-checkbox value="Vascular periférica">Enfermedad vascular periférica</el-checkbox>
              <el-checkbox value="Tuberculosis">Tuberculosis</el-checkbox>
              <el-checkbox value="ACV">Accidente cerebrovascular</el-checkbox>
              <el-checkbox value="Cáncer">Cáncer</el-checkbox>
              <el-checkbox value="Otra">Otra</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-200">Datos de TRR y Acceso</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <el-form-item label="Modalidad de Inicio de TRR">
              <el-select v-model="form.modalidadTRR" placeholder="Seleccione" class="w-full" clearable>
                <el-option label="Hemodiálisis" value="Hemodiálisis" />
                <el-option label="Diálisis Peritoneal" value="Diálisis Peritoneal" />
                <el-option label="Trasplante" value="Trasplante" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fecha de Creación del Acceso de Inicio">
              <el-date-picker v-model="form.fechaCreacionAcceso" type="date" placeholder="Seleccione" value-format="YYYY-MM-DD" format="DD/MM/YYYY" :editable="false" class="w-full" />
            </el-form-item>
            <el-form-item label="Fecha de Inicio de TRR">
              <el-date-picker v-model="form.fechaInicioTRR" type="date" placeholder="Seleccione" value-format="YYYY-MM-DD" format="DD/MM/YYYY" :editable="false" class="w-full" :disabled-date="minDateFechaInicioTRR" />
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
              <el-input v-model="form.edadInicioTRR" readonly />
            </el-form-item>
            <el-form-item label="Tipo de Acceso de Inicio" @mousedown.capture="validarOrden">
              <el-select v-model="form.tipoAccesoInicio" placeholder="Seleccione" class="w-full" clearable :disabled="form.modalidadTRR === 'Trasplante'">
                <el-option v-for="tipo in tiposAccesoFiltrados" :key="tipo.id" :label="tipo.label" :value="tipo.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Fecha de Ingreso a Hospital EsSalud">
              <el-date-picker v-model="form.fechaIngresoEsSalud" type="date" placeholder="Seleccione" value-format="YYYY-MM-DD" format="DD/MM/YYYY" :editable="false" class="w-full" clearable />
            </el-form-item>
            <el-form-item label="Fecha de Primer Ingreso a Unidad">
              <el-date-picker v-model="form.fechaPrimerIngreso" type="date" placeholder="Seleccione" value-format="YYYY-MM-DD" format="DD/MM/YYYY" :editable="false" class="w-full" clearable />
            </el-form-item>
            <el-form-item label="Localización Acceso de Inicio">
              <el-select v-model="form.localizacionAcceso" placeholder="Seleccione" class="w-full" clearable :disabled="form.modalidadTRR === 'Trasplante'">
                <el-option v-for="opcion in opcionesAccesoFiltradas" :key="opcion.id" :label="opcion.label" :value="opcion.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="Hospital Procedencia TRR en EsSalud">
              <el-autocomplete v-model="form.hospitalProcedencia" :fetch-suggestions="querySearch" clearable placeholder="Buscar hospital..." @select="handleSelect" class="w-full" />
            </el-form-item>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <el-button @click="$emit('cancelar')">Cancelar</el-button>
          <el-button type="primary" @click="registrarPaciente">Registrar paciente</el-button>
        </div>
      </el-form>
    </div>
  </el-config-provider>
</template>

<script setup>
import { reactive, computed, watch, ref, onMounted, nextTick } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage, ElConfigProvider, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElAutocomplete } from 'element-plus';
import es from 'element-plus/dist/locale/es.mjs';

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
  }
})

const seleccionadas = ref([])
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
  estado: 'REGISTRADO'
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

  return true;
};


const minDateFechaInicioTRR = (date) => {
  if (!form.fechaCreacionAcceso) return false;
  const d = new Date(date);
  const min = new Date(form.fechaCreacionAcceso + 'T00:00:00');
  return d < min;
};

watch(() => form.fechaInicioTRR, (nuevaFecha) => {
  if (!nuevaFecha) {
    form.edadInicioTRR = '';
    form.idPeriodo = null;
    return;
  }

  // Calcular edad de inicio TRR usando fecha de inicio TRR - fecha de nacimiento
  if (form.fechaNacimiento) {
    const fechaInicioTRR = new Date(nuevaFecha);
    const nacimiento = new Date(form.fechaNacimiento);
    let edad = fechaInicioTRR.getFullYear() - nacimiento.getFullYear();
    const m = fechaInicioTRR.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && fechaInicioTRR.getDate() < nacimiento.getDate())) {
      edad--;
    }
    form.edadInicioTRR = edad;
  }

  // Buscar el periodo por año y mes (ej: "2025-09")
  const fecha = new Date(nuevaFecha);
  const periodoStr = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
  const periodoEncontrado = periodos.value.find(p => p.periodo === periodoStr);
  form.idPeriodo = periodoEncontrado ? periodoEncontrado.id_periodo : null;
});

const dropdownAbierto = ref(false)

const toggleDropdown = () => {
  dropdownAbierto.value = !dropdownAbierto.value
}

const etologiaGeneral = ref('')

const etologiasGenerales = {
  1: 'DIABETES',
  2: 'GLOMERULONEFRITIS',
  3: 'GLOMERULONEFRITIS SECUNDARIA/VASCULITIS',
  4: 'NEFRITIS INTERSTICIAL/PIELONEFRITIS',
  5: 'HIPERTENSION/ENFERMEDAD DE VASOS GRANDES',
  6: 'ENFERMEDAD QUISTICA/HEREDITARIA CONGÉNITA',
  7: 'NEOPLASIAS/TUMORES',
  8: 'COMPLICACIONES DE ÓRGANO TRASPLANTADO',
  9: 'OTRAS CONDICIONES'
}


const etiologiasEspecificas = {
  1: [
    { label: 'Diabetes con manifestaciones renales tipo II', value: 'A.1' },
    { label: 'Diabetes con manifestaciones renales tipo I', value: 'A.2' }
  ],
  2: [
    { label: 'Glomerulonefritis GN (Histológicamente no examinada)', value: 'B.1' },
    { label: 'Glomeruloesclerosis focal, Esclerosante focal', value: 'B.2' },
    { label: 'Nefropatía membranosa', value: 'B.3' },
    { label: 'GN Membranoproliferativa tipo I, GN Membranoproliferativa Difusa', value: 'B.4' },
    { label: 'Enfermedad por depósitos densos, GN membranoproliferativa tipo II', value: 'B.5' },
    { label: 'Nefropatía IgA, Enfermedad de Berger', value: 'B.6' },
    { label: 'Nefropatía IgM', value: 'B.7' },
    { label: 'GN rápidamente progresiva', value: 'B.8' },
    { label: 'Gn post infecciosa', value: 'B.9' },
    { label: 'Otras GN proliferativas', value: 'B.10' }
  ],
  3: [
    { label: 'Lupus eritematoso', value: 'C.1' },
    { label: 'Síndrome de Henoch-Schonlein', value: 'C.2' },
    { label: 'Esclerodermia', value: 'C.3' },
    { label: 'Síndrome urémico hemolítico', value: 'C.4' },
    { label: 'Poliarteritis', value: 'C.5' },
    { label: 'Granulomatosis de Wegener', value: 'C.6' },
    { label: 'Nefropatía por abuso de heroína', value: 'C.7' },
    { label: 'Otras vasculitis y sus derivadas', value: 'C.8' },
    { label: 'Síndrome de Goodpasture', value: 'C.9' },
    { label: 'Otras GN secundarias', value: 'C.10' }
  ],
  4: [
    { label: 'Abuso de analgésicos', value: 'D.1' },
    { label: 'Nefritis por radiación', value: 'D.2' },
    { label: 'Nefropatía por plomo', value: 'D.3' },
    { label: 'Nefropatía causada por otros agentes', value: 'D.4' },
    { label: 'Nefropatía por gota', value: 'D.5' },
    { label: 'Nefrolitiasis', value: 'D.6' },
    { label: 'Uropatía obstructiva adquirida', value: 'D.7' },
    { label: 'Pielonefritis crónica, nefropatía por reflujo', value: 'D.8' },
    { label: 'Nefritis intersticial crónica', value: 'D.9' },
    { label: 'Nefritis intersticial aguda', value: 'D.10' },
    { label: 'Urolitiasis', value: 'D.11' },
    { label: 'Otros desórdenes del metabolismo de calcio', value: 'D.12' }
  ],
  5: [
    { label: 'Hipertensión no especificada con falla renal', value: 'E.1' },
    { label: 'Estenosis de la arteria renal', value: 'E.2' },
    { label: 'Oclusión de la arteria renal', value: 'E.3' },
    { label: 'Embolia causada por colesterol, embolia renal', value: 'E.4' }
  ],
  6: [
    { label: 'Riñón poliquístico del adulto tipo dominante', value: 'F.1' },
    { label: 'Riñón poliquístico infantil recesivo', value: 'F.2' },
    { label: 'Enfermedad quística medular, incluye nefronoptisis', value: 'F.3' },
    { label: 'Esclerosis tubular', value: 'F.4' },
    { label: 'Nefritis hereditaria, síndrome de Alport', value: 'F.5' },
    { label: 'Cistinosis', value: 'F.6' },
    { label: 'Oxalosis primaria', value: 'F.7' },
    { label: 'Enfermedad de Fabry', value: 'F.8' },
    { label: 'Síndrome nefrótico congénito', value: 'F.9' },
    { label: 'Síndrome Drash, esclerosis mesangial', value: 'F.10' },
    { label: 'Obstrucción congénita de la unión ureteropélvica', value: 'F.11' },
    { label: 'Obstrucción congénita de la unión ureterovesical', value: 'F.12' },
    { label: 'Otras uropatías obstructivas congénitas', value: 'F.13' },
    { label: 'Hipoplasia renal, displasia, oligonefronía', value: 'F.14' },
    { label: 'Síndrome del abdomen en ciruela pasa', value: 'F.15' },
    { label: 'Otros (Síndromes de malformaciones congénitas)', value: 'F.16' }
  ],
  7: [
    { label: 'Tumor renal maligno', value: 'G.1' },
    { label: 'Tumor maligno del tracto urinario', value: 'G.2' },
    { label: 'Tumor renal benigno', value: 'G.3' },
    { label: 'Tumor benigno del tracto urinario', value: 'G.4' },
    { label: 'Tumor renal no especificado', value: 'G.5' },
    { label: 'Tumor de tracto urinario no especificado', value: 'G.6' },
    { label: 'Linfoma de riñón', value: 'G.7' },
    { label: 'Mieloma múltiple', value: 'G.8' },
    { label: 'Otras neoplasias inmunoproliferativas', value: 'G.9' },
    { label: 'Amiloidosis', value: 'G.10' }
  ],
  8: [
    { label: 'Complicaciones de órgano trasplantado no especificado', value: 'G.11' },
    { label: 'Complicaciones por trasplante de riñón', value: 'G.12' },
    { label: 'Complicaciones por trasplante de hígado', value: 'G.13' },
    { label: 'Complicaciones por trasplante de corazón', value: 'G.14' },
    { label: 'Complicaciones por trasplante de pulmón', value: 'G.15' },
    { label: 'Complicaciones por trasplante de médula ósea', value: 'G.16' },
    { label: 'Complicaciones por trasplante de páncreas', value: 'G.17' },
    { label: 'Complicaciones por trasplante de intestino', value: 'G.18' },
    { label: 'Complicaciones de otro órgano trasplantado especificado', value: 'G.19' }
  ],
  9: [
    { label: 'Enfermedad de células falciformes/anemia', value: 'H.1' },
    { label: 'Rasgo de células falciformes y otras células falciformes', value: 'H.2' },
    { label: 'Falla renal post parto', value: 'H.3' },
    { label: 'Nefropatía por SIDA', value: 'H.4' },
    { label: 'Pérdida traumática o quirúrgica de riñón', value: 'H.5' },
    { label: 'Síndrome hepatorenal', value: 'H.6' },
    { label: 'Necrosis tubular (sin recuperación)', value: 'H.7' },
    { label: 'Otros desórdenes renales', value: 'H.8' },
    { label: 'Etiología incierta', value: 'H.9' }
  ]
};
const localizacionesFiltradas = computed(() => {
  const tipo = form.etiologiaGeneral;
  const base = etiologiasEspecificas[tipo] || [];
  return [...base];
});

/** Etiologías específicas desde la tabla del backend, filtradas por la categoría general seleccionada (1-9). */
const opcionesEtiologiaEspecificaFromApi = computed(() => {
  const categoriaKey = form.etiologiaGeneral;
  if (!categoriaKey) return [];
  const labelCategoria = etologiasGenerales[categoriaKey];
  if (!labelCategoria) return [];
  const lista = listaEtiologias.value || [];
  const labelNorm = String(labelCategoria).toUpperCase().trim();
  return lista.filter((e) => {
    const g = (e.general && String(e.general).toUpperCase().trim()) || '';
    return g === labelNorm || g.includes(labelNorm) || labelNorm.includes(g);
  });
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
  { id: '1', label: '1. FAV radial derecha', idPadre: '3' },
  { id: '2', label: '2. FAV radial izquierda', idPadre: '3' },
  { id: '3', label: '3. FAV braquial o cubital derecha', idPadre: '3' },
  { id: '4', label: '4. FAV braquial o cubital izquierda', idPadre: '3' },

  // Temporal (Corresponde al id '1')
  { id: '5', label: '5. CVCT yugular derecha', idPadre: '1' },
  { id: '6', label: '6. CVCT yugular izquierdo', idPadre: '1' },
  { id: '7', label: '7. CVCT subclavio derecho', idPadre: '1' },
  { id: '8', label: '8. CVCT subclavio izquierdo', idPadre: '1' },
  { id: '9', label: '9. CVCT femoral derecho', idPadre: '1' },
  { id: '10', label: '10. CVCT femoral izquierdo', idPadre: '1' },

  // Larga Permanencia (Corresponde al id '2')
  { id: '11', label: '11. CVCLP yugular derecha', idPadre: '2' },
  { id: '12', label: '12. CVCLP yugular izquierdo', idPadre: '2' },
  { id: '13', label: '13. CVCLP femoral derecho', idPadre: '2' },
  { id: '14', label: '14. CVCLP femoral izquierdo', idPadre: '2' },
  { id: '15', label: '15. CVCLP translumbar', idPadre: '2' },
  { id: '16', label: '16. CVCLP transhepático', idPadre: '2' },

  // Injerto Autólogo (Corresponde al id '4')
  { id: '17', label: '17. Injerto autólogo', idPadre: '4' },

  // Injerto Protésico (Corresponde al id '5')
  { id: '18', label: '18. Injerto protésico', idPadre: '5' },

  // Catéter Peritoneal (Corresponde al id '6')
  { id: '19', label: '19. Catéter peritoneal', idPadre: '6' }
];
// Filtro B: Tipo de Acceso -> Localizaciones específicas (Validación Cruzada)
const opcionesAccesoFiltradas = computed(() => {
  // CORRECCIÓN: Filtramos por el TIPO DE ACCESO, no solo la modalidad
  const tipoSeleccionado = form.tipoAccesoInicio;

  if (!tipoSeleccionado) return [];

  // Solo mostramos las localizaciones que son "hijas" del tipo seleccionado
  return listaOpcionesAcceso.filter(op => op.idPadre === tipoSeleccionado);
});
const comorbilidadesLabels = [
  "Enfermedades Ateroescleróticas Cardiacas",
  "Insuficiencia Cardíaca Congestiva",
  "Enfermedad Vascular Periférica",
  "Accidente Cerebrovascular",
  "Cáncer",
  "Diabetes",
  "Hipertensión",
  "Tuberculosis",
  "Otra"
]
const estadoComorbilidades = ref(
  comorbilidadesLabels.map(() => false)
);

const diabetesComorbilidadIndex = comorbilidadesLabels.indexOf("Diabetes");
const hipertensionComorbilidadIndex = comorbilidadesLabels.indexOf("Hipertensión");
const otraComorbilidadIndex = comorbilidadesLabels.indexOf("Otra");

watch(etologiaGeneral, (newValue) => {
  seleccionadas.value = []
  dropdownAbierto.value = false

  if (newValue === '1') {
    if (estadoComorbilidades.value[diabetesComorbilidadIndex]) {
      estadoComorbilidades.value[diabetesComorbilidadIndex] = false;
    }
  } else if (newValue === '5') {
    if (estadoComorbilidades.value[hipertensionComorbilidadIndex]) {
      estadoComorbilidades.value[hipertensionComorbilidadIndex] = false;
    }
  }
});
const hospitalesProcedencia = [
  { value: 'Hospital Base II Moquegua' },
  { value: 'Hospital Base III Chimbote' },
  { value: 'Hospital Base III Juliaca' },
  { value: 'Hospital Base III Puno' },
  { value: 'Hospital de Alta Complejidad de La Libertad "Virgen de la Puerta"' },
  { value: 'Hospital I "El Buen Samaritano"' },
  { value: 'Hospital I "Higos Urco" Chachapoyas' },
  { value: 'Hospital I "Víctor Alfredo Lazo Peralta"' },
  { value: 'Hospital I Alto Mayo' },
  { value: 'Hospital I Tumbes "Carlos Alberto Cortez Jimenez"' },
  { value: 'Hospital II "Jorge Reátegui delgado"' },
  { value: 'Hospital II Abancay' },
  { value: 'Hospital II Cajamarca' },
  { value: 'Hospital II Gustavo Lanatta Luján - Huacho' },
  { value: 'Hospital II Huamanga "Carlos Tuppia García Godos"' },
  { value: 'Hospital II Huancavelica' },
  { value: 'Hospital II Huánuco' },
  { value: 'Hospital II Huaraz' },
  { value: 'Hospital II Integrado Ilo' },
  { value: 'Hospital II Pucallpa' },
  { value: 'Hospital II Tarapoto' },
  { value: 'Hospital III "Daniel Alcides Carrión"' },
  { value: 'Hospital III Alberto L. Barton Thompson' },
  { value: 'Hospital III Guillermo Kaelin de la Fuente' },
  { value: 'Hospital III Iquitos' },
  { value: 'Hospital IV "Augusto Hernández Mendoza"' },
  { value: 'Hospital IV "Víctor Lazarte Echegaray"' },
  { value: 'Hospital Nacional "Adolfo Guevara Velasco"' },
  { value: 'Hospital Nacional "Almanzor Aguinaga Asenjo"' },
  { value: 'Hospital Nacional "Carlos Alberto Seguin Escobedo"' },
  { value: 'Hospital Nacional "Ramiro Prialé Prialé"' },
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

const consultarDNI = async () => {
  // 1. Validaciones (Sin .value en form)
  if (!form.numeroDocumento || form.numeroDocumento.length !== 8) {
    errorDNI.value = 'El DNI debe tener 8 dígitos';
    return;
  }
  if (!form.fechaNacimiento) {
    errorDNI.value = 'Debe seleccionar una fecha de nacimiento';
    return;
  }

  consultandoDNI.value = true;
  errorDNI.value = '';

  try {
    // 2. Formatear fecha (Sin .value en form)
    const [anio, mes, dia] = form.fechaNacimiento.split('-');
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
        form.fechaNacimiento = `${anioNac}-${mesNac.padStart(2, '0')}-${diaNac.padStart(2, '0')}`;
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
  return form.tipoDocumento === 'DNI' && 
         /^\d{8}$/.test(form.numeroDocumento) && 
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

  const hoy = new Date();
  const nacimiento = new Date(nuevaFecha);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  form.edad = edad;
});

// Watcher para validación cruzada entre modalidad TRR y tipo de acceso
// Watcher para validación cruzada
watch(() => form.modalidadTRR, (nuevaModalidad) => {
  // Primero: Limpiamos siempre los hijos para evitar datos basura
  form.tipoAccesoInicio = '';
  form.localizacionAcceso = '';

  // Lógica inteligente según el Acta:
  if (nuevaModalidad === 'Diálisis Peritoneal') {
    // Si es Peritoneal, el único tipo posible es 'Catéter Peritoneal' (ID 6)
    // Lo seleccionamos automáticamente por comodidad del usuario
    form.tipoAccesoInicio = '6';
  }
  // Si es 'Hemodiálisis', dejamos vacío para que el usuario elija (Fístula, Catéter, etc.)
  else if (nuevaModalidad === 'Trasplante') {
    // Trasplante no lleva accesos vasculares, se queda todo limpio
  }
});

// Watcher para validación cruzada entre tipo de acceso y localización
watch(() => form.tipoAccesoInicio, (nuevoTipoAcceso) => {
  // Si se selecciona un tipo de acceso específico, sugerir localizaciones apropiadas
  if (nuevoTipoAcceso === 'Catéter peritoneal') {
    form.localizacionAcceso = '19';
  } else if (nuevoTipoAcceso === 'Injerto Autólogo') {
    form.localizacionAcceso = '17';
  } else if (nuevoTipoAcceso === 'Injerto Protésico') {
    form.localizacionAcceso = '18';
  }
  // Para otros tipos de acceso, no se fuerza una localización específica
});


// Watcher: Limpia las comorbilidades si coinciden con la etiología y resetea etiología específica
watch(() => form.etiologiaGeneral, (nuevoValor) => {
  const valor = String(nuevoValor);
  form.etiologiaEspecifica = ''; // al cambiar categoría, limpiar específica

  if (valor === '1') {
    // Si la causa es Diabetes, no debe estar Diabetes en comorbilidades
    form.comorbilidades = form.comorbilidades.filter(c => c !== 'Diabetes');
  }
  else if (valor === '5') {
    // Si la causa es Hipertensión, no debe estar Hipertensión en comorbilidades
    form.comorbilidades = form.comorbilidades.filter(c => c !== 'Hipertensión');
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
  if (soloNumeros) {
    // Eliminar todo lo que no sea número
    form.numeroDocumento = event.target.value.replace(/\D/g, '');
  }
};
const registrarPaciente = async (url = null) => {
  if (!validarFormulario()) return;
  const idPeriodo = getIdPeriodoParaPayload();
  if (idPeriodo == null) {
    ElMessage({ message: 'El periodo seleccionado no existe en el sistema. Elija un mes que ya esté registrado.', type: 'warning', plain: true });
    return;
  }
  const payload = {
    documento: form.numeroDocumento,
    tipo_documento: form.tipoDocumento,
    autogenerado: "ASD",
    paciente: form.nombreCompleto,
    fecha_nacimiento: form.fechaNacimiento,
    genero: form.sexo,
    grado_instruccion: form.gradoInstruccion,
    id_modalidad: form.modalidadTRR == 'Hemodiálisis' ? 1 : form.modalidadTRR == 'Diálisis Peritoneal' ? 2 : 3,
    // Nuevos campos para cumplir con el modelo de backend
    id_ipress: idClinicaSeleccionada.value,
    id_periodo: idPeriodo,
  };

  try {
    const respuesta = await postAllIpress("/pacientes/", payload);
    await registrarPacienteDialisis(respuesta);
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
  if (idPeriodo == null || !idClinicaSeleccionada.value) return null;

  const idModalidad = form.modalidadTRR === 'Hemodiálisis' ? 1 : form.modalidadTRR === 'Diálisis Peritoneal' ? 2 : 3;
  const fechaAtencion = form.fechaInicioTRR || new Date().toISOString().slice(0, 10);

  const payloadAtencion = {
    id_paciente: idPaciente,
    id_ipress: idClinicaSeleccionada.value,
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

  const tipoAcceso = form.modalidadTRR === 'Trasplante' ? 'NO HABIDO' : (form.tipoAccesoInicio || '');
  const payloadUnidades = {
    id_paciente_atencion: idPacienteAtencion,
    fecha_creacion_acceso: form.fechaCreacionAcceso || '',
    tipo_acceso: tipoAcceso,
    localizacion_acceso: form.localizacionAcceso || '',
  };

  await postAllIpress('/unidadesActuales/', payloadUnidades);
  return idPacienteAtencion;
}

const registrarPacienteDialisis = async (respuesta) => {
  const idEtiologia = form.etiologiaEspecifica != null && form.etiologiaEspecifica !== '' ? (Number(form.etiologiaEspecifica) || parseInt(form.etiologiaEspecifica, 10)) : null;
  if (idEtiologia == null || isNaN(idEtiologia)) {
    ElMessage({ message: 'Seleccione una etiología específica de la lista.', type: 'warning', plain: true });
    return;
  }

  try {
    await crearPacienteAtencionYUnidadesActuales(respuesta.id_paciente);
  } catch (err) {
    console.error('Error al crear atención/unidades actuales:', err);
    ElMessage({ message: err?.error || 'Error al guardar datos de acceso a unidad.', type: 'warning', plain: true });
  }

  const payload = {
    id_paciente: respuesta.id_paciente,
    id_etiologia: idEtiologia,
    modalidad_inicio_trr: form.modalidadTRR,
    fecha_inicio_trr: form.fechaInicioTRR,
    subsistema_salud: form.subsistemaSalud,
    tipo_acceso: form.modalidadTRR === 'Trasplante' ? 'NO HABIDO' : form.tipoAccesoInicio,
    fecha_creacion_acceso: form.fechaCreacionAcceso,
    fecha_primer_ingreso: form.fechaPrimerIngreso,
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
    registroPacienteHistorial(respuesta);
  } catch (error) {
    console.error('Error al registrar diálisis:', error);
    ElMessage({ message: error?.error || 'Error al registrar datos de diálisis', type: 'error', plain: true });
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

/** Resuelve periodo (id numérico o string "YYYY-MM") al id_periodo que espera el backend. */
const getIdPeriodoParaPayload = () => {
  const v = periodoSeleccionado.value;
  console.log("imprimiendo valor de periodo seleccionado", v)
  if (v == null || v === '') return null;
  if (typeof v === 'number') return v;
  const p = periodos.value.find(periodo => periodo.periodo === v);
  return p ? p.id_periodo : null;
};

const registroPacienteHistorial = async (respuesta) => {
  const payload = {
    paciente: respuesta.id_paciente,
    periodo: periodoSeleccionado.value,

    condicion: 'REGISTRADO',
  };

  try {
    await postAllIpress("/PacienteRegistro/", payload);
    ElMessage({ message: 'Paciente registrado exitosamente', type: 'success', plain: true });

    // Recargar la página después de un momento
    setTimeout(() => window.location.reload(), 1500);

  } catch (error) {
    console.error('Error al registrar historial:', error);
  }
}


// Función para buscar periodo IPRESS
function searchPeriodoIpress() {
  const resultado = periodoIpress.value.find(
    item => item.id_ipress === idClinicaSeleccionada.value && item.periodo === periodoSeleccionado.value
  );
  if (resultado) {
    idPeriodoIpress.value = resultado.id_periodo_ipress;
    console.log("ID Periodo IPRESS seleccionado:", idPeriodoIpress.value);
  } else {
    idPeriodoIpress.value = null;
    console.log("No se encontró periodo IPRESS para esta combinación");
  }
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

// Fetch Periodo IPRESS
const fetchPeriodoIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodoIpress/");
    periodoIpress.value = respuesta;
  } catch (error) {
    console.error('Error al obtener Periodo IPRESS:', error);
  }
};

// --- PASO 3: WATCHERS DE LIMPIEZA Y AUTOSELECCIÓN ---

// 1. Cuando cambia la MODALIDAD (Hemo vs Peritoneal)
watch(() => form.modalidadTRR, (nuevaModalidad) => {
  // Primero: Limpiamos siempre los hijos para evitar datos basura
  form.tipoAccesoInicio = '';
  form.localizacionAcceso = '';

  // Lógica inteligente según el Acta:
  if (nuevaModalidad === 'Diálisis Peritoneal') {
    // Si es Peritoneal, el único tipo posible es 'Catéter Peritoneal' (ID 6)
    // Lo seleccionamos automáticamente por comodidad del usuario
    form.tipoAccesoInicio = '6';
  }
  // Si es 'Hemodiálisis', dejamos vacío para que el usuario elija (Fístula, Catéter, etc.)
  else if (nuevaModalidad === 'Trasplante') {
    // Trasplante no lleva accesos vasculares, se queda todo limpio
  }
});

// 2. Cuando cambia el TIPO DE ACCESO
watch(() => form.tipoAccesoInicio, (nuevoTipoId) => {
  // Primero: Limpiamos la localización porque las opciones anteriores ya no son válidas
  // (Ej: Si tenías "Brazo derecho" y cambias a "Catéter", esa localización ya no sirve)
  form.localizacionAcceso = '';

  // Autoselección para los casos que tienen una ÚNICA localización
  if (nuevoTipoId === '6') {
    form.localizacionAcceso = '19'; // Catéter peritoneal -> Loc 19
  }
  else if (nuevoTipoId === '4') {
    form.localizacionAcceso = '17'; // Injerto Autólogo -> Loc 17
  }
  else if (nuevoTipoId === '5') {
    form.localizacionAcceso = '18'; // Injerto Protésico -> Loc 18
  }
  // Para Fístulas (3) y Catéteres (1 y 2) NO seleccionamos nada automático
  // porque el usuario debe elegir el lado (derecho/izquierdo, etc.)
});

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

onMounted(() => {
  fetchPeriodo();
  fetchEtiologias();
});
</script>