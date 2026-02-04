<template>
  <div class="space-y-5 mx-12">
    <h2 class="text-xl font-bold">Registro de Nuevo Paciente en Diálisis:</h2>
    <p class="text-sm text-gray-600">Complete los respectivos datos del paciente para la creación del expediente médico.
    </p>

    <!-- Selección de Periodo y Clínica -->
    <div class="flex items-center gap-4 mb-4 flex-wrap bg-gray-50 p-4 rounded-lg border">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-semibold">Periodo de Reporte:</h2>
        <select v-model="periodoSeleccionado" class="border p-2 rounded" @change="searchPeriodoIpress">
          <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">{{ periodo.periodo }}
          </option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-semibold">Clínica:</label>
        <el-autocomplete v-model="clinicaSeleccionada" :fetch-suggestions="querySearchClinica" clearable
          placeholder="Ingrese nombre de clínica" @select="handleSelectClinica" :value-key="'ipress'" style="width: 400px;"/>
      </div>
    </div>

    <!-- Datos personales -->
    <div class="grid grid-cols-4 gap-5">
      <div>
        <label class="text-sm font-medium">Tipo de Documento*</label>
        <select v-model="form.tipoDocumento" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="PASAPORTE">PASAPORTE</option>
        </select>
      </div>

      <div>
        <label class="text-sm font-medium">Número de Documento*</label>
        <div class="flex gap-2">
          <input v-model="form.numeroDocumento" class="flex-1 border px-2 py-1 rounded" :maxlength="maxLengthDocumento"
            :pattern="soloNumeros ? '\\d*' : null" @input="onDocumentoInput" 
            :disabled="consultandoDNI" placeholder="Ingrese DNI" />
          <button v-if="form.tipoDocumento === 'DNI' && form.numeroDocumento.length === 8 && !consultandoDNI" 
            @click="consultarDNI" 
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
            🔍 Consultar
          </button>
          <button v-if="consultandoDNI" disabled 
            class="bg-gray-400 text-white px-3 py-1 rounded text-sm">
            ⏳ Consultando...
          </button>
        </div>
        <div v-if="errorDNI" class="text-red-500 text-xs mt-1">{{ errorDNI }}</div>
      </div>
      <div>
        <label class="text-sm font-medium">Apellidos y Nombres*</label>
        <input v-model="form.nombreCompleto" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Nacimiento*</label>
        <input type="date" v-model="form.fechaNacimiento" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Edad actual</label>
        <input v-model="form.edad" class="w-full border px-2 py-1 rounded bg-gray-100" readonly />
      </div>
      <div>
        <label class="text-sm font-medium">Sexo*</label>
        <select v-model="form.sexo" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Grado de Instrucción*</label>
        <select v-model="form.gradoInstruccion" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Primaria</option>
          <option>Secundaria</option>
          <option>Técnico</option>
          <option>Superior</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mt-6">
      <div class="space-y-2">
        <span class="block font-semibold text-sm text-gray-700">Etiología general</span>
        <select v-model="form.etiologiaGeneral" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
          <option v-for="(item, key) in etologiasGenerales" :key="key" :value="key">
            {{ item }}
          </option>
        </select>
      </div>

      <div class="space-y-2 relative">
        <span class="block font-semibold text-sm text-gray-700">Etiología específica</span>
        <div class="w-full">
          <select v-model="form.etiologiaEspecifica" class="w-full border rounded p-2 text-sm">
            <option value="">Seleccione una opción</option>
            <option v-for="(item, key) in localizacionesFiltradas" :key="key" :value="item.value">
              {{ item.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-6" :key="form.etiologiaGeneral">
      <label class="text-xl font-medium block mb-2">Comorbilidad</label>
      <div class="grid grid-cols-3 gap-4">
        <label><input type="checkbox" v-model="form.comorbilidades" value="Insuficiencia cardiaca" /> Insuficiencia
          cardiaca congestiva</label>
        
        <label v-if="form.etiologiaGeneral != '1'">
            <input type="checkbox" v-model="form.comorbilidades" value="Diabetes" /> 
            Diabetes
        </label>

        <label><input type="checkbox" v-model="form.comorbilidades" value="Aterosclerosis" /> Aterosclerosis
          cardíaca</label>

        <label v-if="form.etiologiaGeneral != '5'">
            <input type="checkbox" v-model="form.comorbilidades" value="Hipertensión" /> 
            Hipertensión
        </label>

        <label><input type="checkbox" v-model="form.comorbilidades" value="Vascular periférica" /> Enfermedad vascular
          periférica</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Tuberculosis" /> Tuberculosis</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="ACV" /> Accidente cerebrovascular</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Cáncer" /> Cáncer</label>
        <label><input type="checkbox" v-model="form.comorbilidades" value="Otra" /> Otra</label>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-4 mt-6">
      <div>
        <label class="text-sm font-medium">Modalidad de Inicio de TRR</label>
        <select v-model="form.modalidadTRR" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>Hemodiálisis</option>
          <option>Diálisis Peritoneal</option>
          <option>Trasplante</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Creación del Acceso de Inicio</label>
        <input type="date" v-model="form.fechaCreacionAcceso" 
           class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Inicio de TRR</label>
        <input 
             type="date" 
             v-model="form.fechaInicioTRR" 
             :min="form.fechaCreacionAcceso || undefined"
             :max="fechaMaximaPermitida"
             class="w-full border px-2 py-1 rounded" 
        />
        <p class="text-xs text-gray-400 mt-1">
             *Máximo hasta fin del periodo seleccionado.
        </p>
      </div>
      <div>
        <label class="text-sm font-medium">Subsistema de Salud</label>
        <select v-model="form.subsistemaSalud" class="w-full border px-2 py-1 rounded">
          <option disabled value="">Seleccione</option>
          <option>EsSalud</option>
          <option>Minsa</option>
          <option>Privados / EPS</option>
          <option>FFAA / FFPP</option>
          <option>Otro país</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Edad de Inicio de TRR</label>
        <input v-model="form.edadInicioTRR" disabled class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Tipo de Acceso de Inicio</label>
        <select 
          v-model="form.tipoAccesoInicio" 
          class="w-full border px-2 py-1 rounded"
          :disabled="form.modalidadTRR === 'Trasplante'"
          :class="{
            'bg-gray-200 text-gray-500 cursor-not-allowed': form.modalidadTRR === 'Trasplante',
            'bg-gray-50 pointer-events-none text-gray-700': form.modalidadTRR === 'Diálisis Peritoneal'
          }"
        >
          <option disabled value="">Seleccione</option>
          <option value="1">Catéter Venoso Central Temporal</option>
          <option value="2">Catéter Venoso Central de Larga Permanencia</option>
          <option value="3">Fístula Arteriovenosa</option>
          <option value="4">Injerto Autólogo</option>
          <option value="5">Injerto Protésico</option>
          <option value="6">Catéter peritoneal</option> 
        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Ingreso a Hospital EsSalud</label>
        <input type="date" v-model="form.fechaIngresoEsSalud" class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Fecha de Primer Ingreso a Unidad</label>
        <input type="date" v-model="form.fechaPrimerIngreso" 
          class="w-full border px-2 py-1 rounded" />
      </div>
      <div>
        <label class="text-sm font-medium">Localización Acceso de Inicio</label>
        <select 
            v-model="form.localizacionAcceso" 
            class="w-full border px-2 py-1 rounded"
            :disabled="form.modalidadTRR === 'Trasplante' || !form.modalidadTRR"
            :class="{
                'bg-gray-100 cursor-not-allowed': form.modalidadTRR === 'Trasplante'
            }"
        >
          <option disabled value="">Seleccione</option>
          
          <option 
            v-for="opcion in opcionesAccesoFiltradas" 
            :key="opcion.id" 
            :value="opcion.id"
          >
            {{ opcion.label }}
          </option>

        </select>
      </div>
      <div>
        <label class="text-sm font-medium">Hospital Procedencia TRR en EsSalud</label>
        <div class="d-flex align-items-center">
          <el-autocomplete v-model="form.hospitalProcedencia" :fetch-suggestions="querySearch" clearable
            placeholder="Ingrese algo" @select="handleSelect" style="width: 400px;" />
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-4 mt-6">
      <button class="bg-gray-400 text-white px-4 py-2 rounded" @click="$emit('cancelar')">Cancelar</button>
      <button class="bg-sky-600 text-white px-6 py-2 rounded font-semibold" @click="registrarPaciente">
        Registrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, ref ,onMounted } from 'vue'
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { apiClient } from "@/services/api/ApiClient";
import { ElMessage } from 'element-plus';

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
  estado: 'REGISTRADO'
})
const validarFormulario = () => {
  const camposObligatorios = [
    'tipoDocumento',
    'numeroDocumento',
    'nombreCompleto',
    'fechaNacimiento',
    'sexo',
    'gradoInstruccion',
    'etiologiaGeneral',
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
  console.log("etiiiii", form.etiologiaGeneral)
  const tipo = form.etiologiaGeneral;
  const base = etiologiasEspecificas[tipo] || [];
  return [...base];
});

// ✅ PEGA ESTO (El bloque completo y sano)

// 1. Lista maestra de opciones
const listaOpcionesAcceso = [
  { id: '1', label: '1. FAV radial derecha' },
  { id: '2', label: '2. FAV radial izquierda' },
  { id: '3', label: '3. FAV braquial o cubital derecha' },
  { id: '4', label: '4. FAV braquial o cubital izquierda' },
  { id: '5', label: '5. CVCT yugular derecha' },
  { id: '6', label: '6. CVCT yugular izquierdo' },
  { id: '7', label: '7. CVCT subclavio derecho' },
  { id: '8', label: '8. CVCT subclavio izquierdo' },
  { id: '9', label: '9. CVCT femoral derecho' },
  { id: '10', label: '10. CVCT femoral izquierdo' },
  { id: '11', label: '11. CVCLP yugular derecha' },
  { id: '12', label: '12. CVCLP yugular izquierdo' },
  { id: '13', label: '13. CVCLP femoral derecho' },
  { id: '14', label: '14. CVCLP femoral izquierdo' },
  { id: '15', label: '15. CVCLP translumbar' },
  { id: '16', label: '16. CVCLP transhepático' },
  { id: '17', label: '17. Injerto autólogo' },
  { id: '18', label: '18. Injerto protésico' },
  { id: '19', label: '19. Catéter peritoneal' }
];

// 2. Filtro (Con su inicio y su fin correctos)
const opcionesAccesoFiltradas = computed(() => {
  const modalidad = form.modalidadTRR;

  if (modalidad === 'Hemodiálisis') {
    return listaOpcionesAcceso.filter(op => parseInt(op.id) <= 18);
  } else if (modalidad === 'Diálisis Peritoneal') {
    return listaOpcionesAcceso.filter(op => op.id === '19');
  }

  return [];
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

// Función para consultar DNI en RENIEC
const consultarDNI = async () => {
  if (!form.numeroDocumento || form.numeroDocumento.length !== 8) {
    errorDNI.value = 'El DNI debe tener 8 dígitos';
    return;
  }

  consultandoDNI.value = true;
  errorDNI.value = '';

  try {
    const response =  await getAllIpress(`/consultar-dni/?numero=${form.numeroDocumento}`);
    const data = response;
    if (data.nombres && data.apellidoPaterno && data.apellidoMaterno) {
      // Llenar automáticamente los campos con los datos de RENIEC
      form.nombreCompleto = `${data.apellidoPaterno} ${data.apellidoMaterno}, ${data.nombres}`.toUpperCase();
      
      ElMessage({
        message: 'Datos obtenidos correctamente de RENIEC',
        type: 'success',
        plain: true,
      });
    } else {
      errorDNI.value = data.error || 'No se encontraron datos para este DNI';
      ElMessage({
        message: 'No se encontraron datos para este DNI',
        type: 'warning',
        plain: true,
      });
    }
  } catch (error) {
    console.error('Error al consultar DNI:', error);
    errorDNI.value = 'Error al consultar el DNI. Intente nuevamente.';
    ElMessage({
      message: 'Error al consultar el DNI',
      type: 'error',
      plain: true,
    });
  } finally {
    consultandoDNI.value = false;
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
  if (nuevaModalidad === 'Diálisis Peritoneal') {
    // CAMBIO: Usamos el ID '6' en lugar del texto
    form.tipoAccesoInicio = '6'; 
    form.localizacionAcceso = '19'; 
  } else if (nuevaModalidad === 'Trasplante') {
    form.tipoAccesoInicio = '';
    form.localizacionAcceso = '';
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


// Watcher: Limpia las comorbilidades si coinciden con la etiología
watch(() => form.etiologiaGeneral, (nuevoValor) => {
  // Aseguramos comparar como string o número
  const valor = String(nuevoValor);

  if (valor === '1') {
    // Si la causa es Diabetes, quitamos 'Diabetes' de comorbilidades
    form.comorbilidades = form.comorbilidades.filter(c => c !== 'Diabetes');
  } 
  else if (valor === '5') {
    // Si la causa es Hipertensión, quitamos 'Hipertensión' de comorbilidades
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
  const payload = {
    documento: form.numeroDocumento,
    tipo_documento: form.tipoDocumento,
    autogenerado: "ASD",
    paciente: form.nombreCompleto,
    fecha_nacimiento: form.fechaNacimiento,
    genero: form.sexo,
    grado_instruccion: form.gradoInstruccion,
    id_modalidad: form.modalidadTRR == 'Hemodiálisis' ? 1 : form.modalidadTRR == 'Diálisis Peritoneal' ? 2 : 3,
    estado: 'REGISTRADO'
  };

  try {
    const respuesta = await postAllIpress("/pacientes/", payload);
    registrarPacienteDialisis(respuesta);
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
const registrarPacienteDialisis = async (respuesta) => {
  const payload = {
    etiologia: form.etiologiaEspecifica || form.etiologiaGeneral,
    modalidad_inicio_trr: form.modalidadTRR,
    fecha_inicio_trr: form.fechaInicioTRR,
    subsistema_salud: form.subsistemaSalud,

    // Lógica Trasplante (Tipo de Acceso):
    tipo_acceso: form.modalidadTRR === 'Trasplante' ? 'NO HABIDO' : form.tipoAccesoInicio,

    fecha_creacion_acceso: form.fechaCreacionAcceso,
    fecha_primer_ingreso: form.fechaPrimerIngreso,
    fecha_ingreso_hospital: form.fechaIngresoEsSalud,

    // Lógica Trasplante (Localización):
    localizacion_acceso_inicio: form.modalidadTRR === 'Trasplante' ? null : form.localizacionAcceso,

    hospital_procedencia_trr: form.hospitalProcedencia,

    enf_ateroesclerotica_cardiaca: form.comorbilidades.includes("Aterosclerosis") ? 'Sí' : 'NO',
    enf_insuficiencia_cardiaca_congestiva: form.comorbilidades.includes("Insuficiencia cardiaca") ? 'Sí' : 'NO',
    enf_vascular_periferica: form.comorbilidades.includes("Vascular periférica") ? 'Sí' : 'NO',
    enf_cerebro_vascular: form.comorbilidades.includes("ACV") ? 'Sí' : 'NO',
    enf_cancer: form.comorbilidades.includes("Cáncer") ? 'Sí' : 'NO',
    enf_diabetes: form.comorbilidades.includes("Diabetes") ? 'Sí' : 'NO',
    enf_hipertension: form.comorbilidades.includes("Hipertensión") ? 'Sí' : 'NO',
    enf_tuberculosis: form.comorbilidades.includes("Tuberculosis") ? 'Sí' : 'NO',
    enf_otra: form.comorbilidades.includes("Otra") ? 'Sí' : 'NO',
    id_paciente: respuesta.id_paciente,
    paciente: respuesta.id_paciente,
    id_periodo_ipress: null,
  };

  try {
    await postAllIpress("/pacientesDialisis/", payload);
    registroPacienteHistorial(respuesta);
  } catch (error) {
    console.error('Error al registrar diálisis:', error);
  }
}
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
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

// Funciones para Autocomplete de Clínica
const querySearchClinica = (queryString, cb) => {
  const results = queryString
    ? ipress.value.filter(r =>
      r.ipress?.toLowerCase().includes(queryString.toLowerCase())
    )
    : ipress.value;
  cb(results);
};

const handleSelectClinica = (item) => {
  idClinicaSeleccionada.value = item.id_ipress;
  searchPeriodoIpress();
};

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
});
</script>