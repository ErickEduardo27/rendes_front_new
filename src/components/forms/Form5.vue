<template>
  <div class="p-6 space-y-6 bg-gray-50 min-h-screen">
    
    <button class="flex items-center text-sm cursor-pointer text-gray-500 hover:text-gray-800 transition-colors font-medium" @click="$emit('cancelar')">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Volver al inicio
    </button>

    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-x-8 gap-y-4">
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Periodo de Reporte:</span>
        <select v-model="periodoSeleccionado" class="border border-gray-200 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-gray-600 font-medium outline-none" disabled>
          <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Clínica:</span>
        <span class="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 text-gray-600 font-medium">{{ paciente.ipress }}</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Modalidad de Diálisis:</span>
        <span class="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-gray-50 text-gray-600 font-medium">{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodiálisis" : "Peritoneal" }}</span>
      </div>
    </div>

    <div class="border-l-4 border-cyan-600 pl-3 my-6">
      <h2 class="text-xl font-bold text-gray-800">Resultados Clínicos</h2>
      <p class="text-sm text-gray-500">Complete la información médica del paciente</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6 items-start">
      
      <div class="flex-1 w-full space-y-6">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="campo in camposResultados" :key="campo.key">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {{ campo.label }}
              </label>

              <div class="flex items-center gap-3">
                <input
                  v-model.number="form[campo.key]"
                  type="number"
                  :min="campo.min"
                  :max="campo.max"
                  :step="campo.allowDecimals ? '0.01' : '1'"
                  class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  :readonly="campo.readonly"
                  :class="{ 
                    'bg-gray-100 text-gray-600 cursor-not-allowed': campo.readonly, 
                    'border-red-500 bg-red-50': validarCampo(campo),
                    'bg-white': !campo.readonly && !validarCampo(campo)
                  }"
                  @keydown="campo.allowDecimals ? permitirDecimal($event) : bloquearDecimal($event)"
                  @blur="validarRango(campo)"
                  :title="campo.min !== undefined && campo.max !== undefined ? `Rango válido: ${campo.min} - ${campo.max}` : ''"
                />
                
                <div 
                  class="w-5 h-5 rounded-full border border-gray-200 shadow-inner flex-shrink-0 transition-colors duration-300"
                  :class="obtenerColorSemaforo(campo)"
                ></div>
              </div>

              <p v-if="validarCampo(campo)" class="text-xs text-red-500 mt-1.5 font-medium">
                El valor debe estar entre {{ campo.min }} y {{ campo.max }}
              </p>
            </div>
          </div>

          <hr class="border-gray-100 my-4" />

          <div class="space-y-1 w-full md:w-1/2 pr-3">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tiempo de Diálisis</label>
            <select v-model="form.tmpDialisis" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
              <option value="">Seleccione una opción</option>
              <option value="1">2.00</option>
              <option value="2">2.25</option>
              <option value="3">2.50</option>
              <option value="4">2.75</option>
              <option value="5">3.00</option>
              <option value="6">3.25</option>
              <option value="7">3.50</option>
              <option value="8">3.75</option>
              <option value="9">4.00</option>
              <option value="10">4.25</option>
              <option value="11">4.50</option>
            </select>
          </div>

          <h3 class="text-lg font-bold text-gray-800 mt-8 mb-4">Tratamiento Administrado</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Eritropoyetina</label>
              <select v-model="form.eritropoyetina" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Hierro</label>
              <select v-model="form.hierro" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Calcitriol</label>
              <select v-model="form.hiperparatiroidismo" class="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                <option value="">Seleccione una opción</option>
                <option value="1">Sí</option>
                <option value="2">No</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
            <button @click="$emit('cancelar')" class="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Cancelar
            </button>
            <button @click="postForm" class="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Registrar
            </button>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-80 shrink-0" v-if="paciente">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
          <div class="h-2 bg-cyan-500 w-full"></div>
          <div class="p-6 flex flex-col items-center">
            <div class="bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mb-4 border border-gray-200">
              <svg class="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
            <h3 class="text-center font-bold text-gray-900 text-[15px] uppercase leading-tight mb-1">{{ paciente.paciente || 'ERICK TRUJILLO SANTE' }}</h3>
            <p class="text-center text-xs font-medium text-gray-500 mb-6">DNI: {{ paciente.documento || '73131653' }}</p>
            
            <div class="w-full space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Edad:</span>
                <span class="font-medium text-gray-800">{{ edadPaciente }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Sexo:</span>
                <span class="font-medium text-gray-800">{{ paciente.genero === 'M' ? 'Masculino' : 'Femenino' }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Tipo de Registro:</span>
                <span class="font-medium text-gray-800">{{ paciente.id_modalidad === 1 ? 'Hemodiálisis' : 'Peritoneal' }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Estado:</span>
                <span class="text-[11px] font-bold px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded uppercase tracking-wider">{{ paciente.estado || 'NUEVO' }}</span>
              </div>
              <div class="flex justify-between items-center text-sm mt-4 pt-3 border-t border-gray-100">
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
import { ref, computed, watch, onMounted } from 'vue'
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";

const { paciente, periodo } = defineProps({
  paciente: Object,
  periodo: Number
})

const pacienteSeleccionado = ref(paciente)
const periodoSeleccionado = ref(periodo)
const periodos = ref([])

const form = ref({
  tmpDialisis: null,
  eritropoyetina: null,
  hierro: null,
  hiperparatiroidismo: null, // Mantenemos el v-model intacto aunque el label diga Calcitriol
  hb: null,
  calcio: null,
  fosforo: null,
  pthi: null,
  alb: null,
  calcioCorregido: null,
  kt: null,
  id_periodo_ipress: 17,
  id_red: 1,
  id_paciente: paciente.id_paciente
})

/* CAMPOS: RANGOS ACTUALIZADOS Y RANGOS NORMALES PARA SEMÁFORO */
// NOTA: Los rangos "normales" (verde) y "precaución" (amarillo) son configurables en las propiedades 'rangoVerde' y 'rangoAmarillo'. 
// Si está fuera de amarillo pero dentro del min/max global, será Rojo.
const camposResultados = [
  { label: 'Hb (gr/dl)', key: 'hb', allowDecimals: true, min: 1, max: 18, rangoVerde: [10, 12], rangoAmarillo: [9, 13] },
  { label: 'Calcio (mg/dl)', key: 'calcio', allowDecimals: true, min: 1, max: 15, rangoVerde: [8.4, 9.5], rangoAmarillo: [8.0, 10.0] },
  { label: 'Fosforo (mg/dl)', key: 'fosforo', allowDecimals: true, min: 1, max: 12, rangoVerde: [3.5, 5.5], rangoAmarillo: [3.0, 6.0] },
  { label: 'PTHi (pg/ml)', key: 'pthi', allowDecimals: false, min: 1, max: 5000, rangoVerde: [150, 300], rangoAmarillo: [100, 500] },
  { label: 'Alb (gr/dl)', key: 'alb', allowDecimals: true, min: 1, max: 6, rangoVerde: [4.0, 6.0], rangoAmarillo: [3.5, 6.0] },
  { label: 'Calcio corregido (mg/dl)', key: 'calcioCorregido', allowDecimals: true, readonly: true, min: 1, max: 15, rangoVerde: [8.4, 9.5], rangoAmarillo: [8.0, 10.0] },
  { label: 'Kt/v', key: 'kt', allowDecimals: true, min: 0.1, max: 3.0, rangoVerde: [1.2, 3.0], rangoAmarillo: [1.0, 3.0] }
]

/* CÁLCULO EDAD PACIENTE PARA EL PERFIL */
const edadPaciente = computed(() => {
    if (!paciente?.fecha_nacimiento) return '44 años' // Fallback visual
    const hoy = new Date()
    const nacimiento = new Date(paciente.fecha_nacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
    }
    return `${edad} años`
})

/* ✅ CALCIO CORREGIDO SOLO SI Ca > 0 y Alb > 0 */
const calcioCorregidoCalculado = computed(() => {
  const calcio = Number(form.value.calcio)
  const alb = Number(form.value.alb)

  if (calcio > 0 && alb > 0) {
    return Math.round((calcio + 0.8 * (4 - alb)) * 100) / 100
  }

  return null
})

watch(calcioCorregidoCalculado, (nuevoValor) => {
  form.value.calcioCorregido = nuevoValor
})

/* VALIDACIONES NUMÉRICAS */
function bloquearDecimal(e) {
  if (['.', ',', 'e', '-'].includes(e.key)) e.preventDefault()
}
function permitirDecimal(e) {
  if ([',', 'e', '-'].includes(e.key)) e.preventDefault()
}

// Validar si un campo está fuera del rango maestro (errores de digitación)
const validarCampo = (campo) => {
  const valor = form.value[campo.key]
  if (valor === null || valor === undefined || valor === '') return false
  
  const numValor = Number(valor)
  if (isNaN(numValor)) return false
  
  if (campo.min !== undefined && numValor < campo.min) return true
  if (campo.max !== undefined && numValor > campo.max) return true
  
  return false
}

// Validar y ajustar el rango cuando el usuario sale del campo (blur)
const validarRango = (campo) => {
  const valor = form.value[campo.key]
  if (valor === null || valor === undefined || valor === '') return
  
  const numValor = Number(valor)
  if (isNaN(numValor)) {
    form.value[campo.key] = null
    return
  }
  
  // Ajustar al mínimo si es menor
  if (campo.min !== undefined && numValor < campo.min) {
    form.value[campo.key] = campo.min
    return
  }
  
  // Ajustar al máximo si es mayor
  if (campo.max !== undefined && numValor > campo.max) {
    form.value[campo.key] = campo.max
    return
  }
}

/* SISTEMA SEMAFÓRICO */
const obtenerColorSemaforo = (campo) => {
  const valor = form.value[campo.key];
  
  // Si está vacío, semáforo apagado (gris)
  if (valor === null || valor === undefined || valor === '') {
    return 'bg-gray-200';
  }

  const num = Number(valor);

  // Si rompe las reglas maestras (digitación errónea), se pone ROJO directo
  if (num < campo.min || num > campo.max) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';

  // Validar Verde (Rango ideal)
  if (campo.rangoVerde && num >= campo.rangoVerde[0] && num <= campo.rangoVerde[1]) {
    return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
  }

  // Validar Amarillo (Rango de precaución)
  if (campo.rangoAmarillo && num >= campo.rangoAmarillo[0] && num <= campo.rangoAmarillo[1]) {
    return 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]';
  }

  // Si no está ni en verde ni en amarillo, pero es válido, es Rojo clínico
  return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
};

/* DATA */
const fetchPeriodo = async () => {
  periodos.value = await getAllIpress("/periodos/")
}

const postForm = async () => {
  const camposInvalidos = camposResultados.filter(campo => {
    if (campo.readonly) return false
    return validarCampo(campo)
  })
  
  if (camposInvalidos.length > 0) {
    const nombresInvalidos = camposInvalidos.map(c => c.label).join(', ')
    alert(`Por favor corrija los siguientes campos que están fuera del rango válido:\n${nombresInvalidos}`)
    return
  }
  
  try {
    await postAllIpress("/resultadosClinicos/", form.value)
    alert("Se registró con éxito")
    window.location.reload()
  } catch (error) {
    console.error('Error al registrar:', error)
    alert("Error al registrar los resultados clínicos")
  }
}

onMounted(fetchPeriodo)
</script>