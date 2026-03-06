<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-4 flex-wrap bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="flex items-center gap-2">
        <label class="text-xs font-semibold text-gray-500 uppercase">Periodo de Reporte:</label>
        <select v-model="periodoSeleccionado" class="border border-gray-300 px-2 py-1 rounded text-sm bg-gray-50 text-gray-700" :disabled="true">
          <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
        </select>
      </div>

      <div class="flex items-center gap-2 border-l pl-4 border-gray-200">
        <label class="text-xs font-semibold text-gray-500 uppercase">Clínica:</label>
        <span class="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded">{{ paciente.ipress }}</span>
      </div>

      <div class="flex items-center gap-2 border-l pl-4 border-gray-200">
        <label class="text-xs font-semibold text-gray-500 uppercase">Modalidad de Diálisis:</label>
        <span class="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded">
          {{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" : "Peritoneal" }}
        </span>
      </div>
    </div>

    <div class="flex gap-6 mt-6">
      <div class="flex-1 space-y-6">
        <div>
          <h2 class="text-xl font-bold text-[#008f9c] mb-1">SEROLOGÍA Y VACUNACIÓN</h2>
          <p class="text-sm text-gray-500">Complete la información médica del paciente en las diferentes secciones</p>
        </div>

        <div>
          <h3 class="font-medium mb-3 text-gray-700">Condición Serológica Actual</h3>
          <div class="space-y-4">
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600 font-medium">VHB</label>
                <select class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.vhbEstado">
                  <option :value="null">Seleccione una opción</option>
                  <option>Positivo</option>
                  <option>Negativo</option>
                  <option>Desconocido</option>
                </select>
                <label class="text-sm mt-2 block text-gray-600">Fecha de Examen</label>
                <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.vhbFecha" />
              </div>
              
              <div>
                <label class="text-sm text-gray-600 font-medium">Anti-HBc Total</label>
                <select class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.antiHbcEstado">
                  <option :value="null">Seleccione una opción</option>
                  <option>Positivo</option>
                  <option>Negativo</option>
                  <option>Desconocido</option>
                </select>
                <label class="text-sm mt-2 block text-gray-600">Fecha de Examen</label>
                <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.antiHbcFecha" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600 font-medium">VHC</label>
                <select class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.vhcEstado">
                  <option :value="null">Seleccione una opción</option>
                  <option>Positivo</option>
                  <option>Negativo</option>
                  <option>Desconocido</option>
                </select>
                <label class="text-sm mt-2 block text-gray-600">Fecha de Examen</label>
                <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.vhcFecha" />
              </div>
              <div>
                <label class="text-sm text-gray-600 font-medium">VIH</label>
                <select class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.vihEstado">
                  <option :value="null">Seleccione una opción</option>
                  <option>Positivo</option>
                  <option>Negativo</option>
                  <option>Desconocido</option>
                </select>
                <label class="text-sm mt-2 block text-gray-600">Fecha de Examen</label>
                <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.vihFecha" />
              </div>
            </div>

          </div>
        </div>

        <div>
          <h3 class="font-medium text-gray-700 mb-3">Vacunación Contra Hepatitis B</h3>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="text-sm text-gray-600 font-medium">Título de AcHBs (mUI/mL)</label>
              <input 
                  type="number" 
                  class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-sky-500" 
                  v-model.number="form.vacunaHepatitis"
                  placeholder="Ingrese el valor numérico"
                  :min="0"
                  :max="2000"
                  :step="0.01"
                />
            </div>
            <div>
              <label class="text-sm text-gray-600 font-medium">Estado según AcHbs</label>
              <input type="text" class="w-full border rounded px-3 py-2 mt-1 bg-gray-50 text-gray-500" placeholder="Estado según AcHBs"
                v-model="form.estadoAcHBs" disabled />
            </div>
            <div>
              <label class="text-sm text-gray-600 font-medium">Fecha de Prueba</label>
              <input type="date" class=" w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.fechaVacHepatitis" />
            </div>
          </div>
        </div>

        <div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600 font-medium">Última Dosis Administrada</label>
              <select class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.dosisHepatitisB">
                <option :value="null">Seleccione una opción</option>
                <option>1er dosis</option>
                <option>2da dosis</option>
                <option>3ra dosis</option>
                <option>Refuerzo</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-gray-600 font-medium">Fecha de Vacunación</label>
              <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="Fecha de Vacunación"
                v-model="form.fechaHepatitisB" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-medium text-gray-700 mb-3">Vacunación Contra Covid-19</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-600 font-medium">Última Dosis Administrada</label>
              <select class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" v-model="form.dosisCovid">
                <option :value="null">Seleccione una opción</option>
                <option>1er dosis</option>
                <option>2da dosis</option>
                <option>3ra dosis</option>
                <option>Refuerzo</option>
              </select>
            </div>
            <div>
              <label class="text-sm text-gray-600 font-medium">Fecha de Vacunación</label>
              <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="Fecha de Vacunación"
                v-model="form.fechaCovid" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-medium text-gray-700 mb-3">Vacunación Contra Influenza</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="text-sm text-gray-600 font-medium">Fecha de Vacunación</label>
              <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 md:w-1/2 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="Fecha de Vacunación"
                v-model="form.fechaInfluenza" />
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-medium text-gray-700 mb-3">Vacunación Contra Neumococo</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="text-sm text-gray-600 font-medium">Fecha de Vacunación</label>
              <input type="date" class="w-full border rounded px-3 py-2 mt-1 text-gray-700 md:w-1/2 focus:outline-none focus:ring-1 focus:ring-sky-500" placeholder="Fecha de Vacunación"
                v-model="form.fechaNeumococo" />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8 pt-4 border-t">
          <button class="bg-gray-200 text-gray-700 px-6 py-2 rounded font-medium hover:bg-gray-300 transition-colors" @click="$emit('cancelar')">Cancelar</button>
          <button class="bg-[#008f9c] text-white px-6 py-2 rounded font-medium hover:bg-[#007a85] transition-colors" @click="postForm()">Registrar</button>
        </div>
      </div>

      <div class="w-80" v-if="pacienteSeleccionado.value">
        <div class="bg-white border rounded-xl shadow-sm overflow-hidden sticky top-6">
          <div class="h-2 bg-[#008f9c]"></div>
          
          <div class="p-6">
            <div class="flex justify-center mb-4">
              <div class="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center border border-gray-200">
                <svg class="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            
            <p class="text-center font-bold text-gray-800 uppercase tracking-wide mb-1">{{ pacienteSeleccionado.value.paciente }}</p>
            <p class="text-center text-xs text-gray-500 mb-6">DNI: {{ pacienteSeleccionado.value.documento }}</p>
            
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span class="text-gray-500">Edad:</span>
                <span class="font-medium text-gray-800">{{ edadPaciente }}</span>
              </div>
              <div class="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span class="text-gray-500">Sexo:</span>
                <span class="font-medium text-gray-800">{{ pacienteSeleccionado.value.genero == "M" ? "Masculino" : "Femenino" }}</span>
              </div>
              <div class="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span class="text-gray-500">Tipo de Registro:</span>
                <span class="font-medium text-gray-800">{{ pacienteSeleccionado.value.id_modalidad == 1 ? "Hemodialisis" : "Peritoneal" }}</span>
              </div>
              <div class="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                <span class="text-gray-500">Estado:</span>
                <span class="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-bold border border-green-200">{{ pacienteSeleccionado.value.estado }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Fecha de Ingreso:</span>
                <span class="font-medium text-gray-800">15/06/2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
// Importamos la librería de confeti
import confetti from 'canvas-confetti';

// 👇 defineProps debe estar fuera de cualquier función
const props = defineProps({
  paciente: {
    type: Object,
    required: true
  },
  periodo: {
    type: Number,
    required: true
  },
  idPeriodoIpress: {
    type: Number,
    default: null
  },
  idRed: {
    type: Number,
    default: 1
  }
})
const { paciente, periodo } = props
const emit = defineEmits(['cancelar', 'guardado'])

const clinicaSeleccionada = ref('');
const clinicas = ref(['DA VIDA SAC.']);
const modalidad = ref('');

const form = reactive({
  turno: 1,
  frecuencia: 1,
  // Condición Serológica
  vhbEstado: null,
  vhbFecha: null,
  vhcEstado: null,
  vhcFecha: null,
  vihEstado: null,
  vihFecha: null,
  antiHbcEstado: null, // NUEVO CAMPO
  antiHbcFecha: null,  // NUEVO CAMPO
  // Vacunación Hepatitis
  vacunaHepatitis: null,
  estadoAcHBs: null,
  fechaVacHepatitis: null,
  // Vacunación Hepatitis B
  dosisHepatitisB: null,
  fechaHepatitisB: null,
  // Vacunación Covid-19
  dosisCovid: null,
  fechaCovid: null,
  // Vacunación Influenza
  fechaInfluenza: null,
  // Vacunación Neumococo
  fechaNeumococo: null,
  id_periodo_ipress: props.idPeriodoIpress ?? 17,
  id_red: props.idRed ?? 1,
  id_paciente: paciente.id_paciente
})

watch(() => form.vacunaHepatitis, (nuevoValor) => {
  // 1. RESTRICCIÓN DE RANGO SUPERIOR: Topamos el valor máximo a 2000
  if (nuevoValor > 2000) {
    form.vacunaHepatitis = 2000;
    return; // Se detiene aquí. Vue volverá a ejecutar el watch automáticamente con el valor 2000.
  }

  // 2. Si el valor es null, undefined, vacío o no es un número válido
  if (nuevoValor === null || nuevoValor === undefined || nuevoValor === '' || isNaN(nuevoValor)) {
    form.estadoAcHBs = '';
    return;
  }

  const valor = Number(nuevoValor);

  // 3. Calcular el estado según los rangos numéricos
  if (valor < 10) {
    form.estadoAcHBs = 'No Responde';
  } else if (valor >= 10 && valor < 100) {
    form.estadoAcHBs = 'Respuesta pobre';
  } else if (valor >= 100 && valor < 1000) {
    form.estadoAcHBs = 'Óptimo';
  } else if (valor >= 1000 && valor <= 2000) {
    form.estadoAcHBs = 'Excelente';
  } else {
    form.estadoAcHBs = '';
  }
});


const router = useRouter()
const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo

console.log("Paciente recibido:", periodo)  // ✅ No lanzará error

const validarCampos = () => {
  // Lista de campos requeridos (ajusta según tus necesidades)
  const camposRequeridos = [
    
    'vhbEstado', 'vhbFecha',
    'vhcEstado', 'vhcFecha',
    'vihEstado', 'vihFecha',
    'antiHbcEstado', 'antiHbcFecha', // NUEVO CAMPO AÑADIDO A VALIDACIÓN
    'vacunaHepatitis', 'estadoAcHBs', 'fechaVacHepatitis',
    'dosisHepatitisB', 'fechaHepatitisB',
    'dosisCovid', 'fechaCovid',
    'fechaInfluenza',
    'fechaNeumococo'
  ];
  for (const campo of camposRequeridos) {
    if (!form[campo] || form[campo] === '' || form[campo] === null) {
      return campo;
    }
  }
  return null;
};

// Función para lanzar los fuegos artificiales
const lanzarFuegosArtificiales = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // Añadido zIndex alto para que pase por encima de todo

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Confeti desde la izquierda
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: Math.random() - 0.2, y: Math.random() - 0.2 } 
    }));
    // Confeti desde la derecha
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: Math.random() + 1.2, y: Math.random() - 0.2 } 
    }));
  }, 250);
};

const postForm = async (url = null) => {
  const campoFaltante = validarCampos();
  if (campoFaltante) {
    alert(`Por favor complete el campo obligatorio: ${campoFaltante}`);
    return;
  }
  if (props.idPeriodoIpress != null) form.id_periodo_ipress = props.idPeriodoIpress;
  if (props.idRed != null) form.id_red = props.idRed;
  form.id_paciente = paciente.id_paciente;
  try {
    const respuesta = await postAllIpress(url ?? "/vacunaciones/", form);
    
    // 1. Lanzar los fuegos artificiales
    lanzarFuegosArtificiales();
    
    // 2. Esperar 1 segundo antes de mostrar la alerta para que se vea la animación
    setTimeout(() => {
      alert("Se registró con éxito");
      emit('guardado');
    }, 1000);

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const fetchPaciente = async (url = null) => {
  try {
    const respuesta = await getAllIpress( "/pacientes/" + paciente.id_paciente);
    pacienteSeleccionado.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const periodos = ref([])
// Otros datos
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

onMounted(() => {
  fetchPaciente();
  fetchPeriodo();
});


const mes = ref('JULIO')
const anio = ref('2025')
const clinica = ref('DA VIDA S.A.C.')
const turno = ref('')
const frecuencia = ref('')

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
</script>

<!-- <script setup>
import { ref } from 'vue'

// Datos de Turno
const turno = ref('')
const frecuencia = ref('')

// Condición Serológica
const vhb = ref('')
const vhbFechaVacunacion = ref('')
const vhc = ref('')
const vhcFechaVacunacion = ref('')
const vhi = ref('')
const vhiFechaVacunacion = ref('')

// AcHBs
const tipoAcHBs = ref('')
const estadoAcHBs = ref('')
const fechaVacAcHBs = ref('')

// Vacunación Hepatitis B
const ultimaDosisHepB = ref('')
const fechaUltimaDosisHepB = ref('')
const motivoNoVacHepB = ref('')

// Vacunación COVID-19
const ultimaDosisCovid = ref('')
const fechaUltimaDosisCovid = ref('')
const motivoNoVacCovid = ref('')

// Vacunación Influenza
const fechaVacInfluenza = ref('')
const motivoNoVacInfluenza = ref('')

// Vacunación Neumococo
const fechaVacNeumococo = ref('')
const motivoNoVacNeumococo = ref('')

// Opciones sugeridas
const opcionesTurno = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: 'No corresponde' }
]

const opcionesFrecuencia = [
  { value: 'LMV', label: 'Lunes-Miércoles-Viernes' },
  { value: 'MJS', label: 'Martes-Jueves-Sábado' },
  { value: '2x', label: '2 veces por semana' },
  { value: 'otros', label: 'Otros' },
  { value: 'nc', label: 'No corresponde' }
]

const opcionesCondicion = [
  { value: 'negativo', label: 'Negativo' },
  { value: 'positivo', label: 'Positivo' },
  { value: 'no se realizó', label: 'No se realizó' }
]

const opcionesTipoAcHBs = [
  { value: 'positivo', label: 'Positivo (>10 mUI/mL)' },
  { value: 'negativo', label: 'Negativo (<10 mUI/mL)' },
  { value: 'no evaluado', label: 'No evaluado' }
]

const opcionesDosis = [
  { value: '1ra', label: '1ra. Dosis' },
  { value: '2da', label: '2da. Dosis' },
  { value: '3ra', label: '3ra. Dosis' },
  { value: 'refuerzo', label: 'Refuerzo' }
]

const motivosNoVacunacion = [
  { value: 'rechazo', label: 'No aceptó la vacunación' },
  { value: 'fallecido', label: 'Falleció' },
  { value: 'hospitalizado', label: 'Está hospitalizado' },
  { value: 'proceso infeccioso', label: 'Cursa con proceso infeccioso' },
  { value: 'diagnóstico covid', label: 'Tiene diagnóstico COVID-19' },
  { value: 'vacuna reciente', label: 'Tiene antecedente de vacunación reciente' },
  { value: 'cambio unidad', label: 'Cambio de unidad' },
  { value: 'no corresponde', label: 'No corresponde' }
]
</script> -->