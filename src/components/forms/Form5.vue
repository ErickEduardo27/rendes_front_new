<!-- <template>
    <div class="p-6 space-y-6">

    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
      ← Volver al inicio
    </div>


    <div class="flex items-center gap-2 flex-wrap">
      <label>Mes de Reporte:</label>
      <select v-model="mes" class="border px-2 py-1 rounded">
        <option value="JULIO">JULIO</option>
        <option value="AGOSTO">AGOSTO</option>
      </select>

      <select v-model="anio" class="border px-2 py-1 rounded">
        <option value="2025">2025</option>
      </select>

      <label>Clínica:</label>
      <select v-model="clinicaSeleccionada" class="border px-2 py-1 rounded">
        <option v-for="c in clinicas" :key="c">{{ c }}</option>
      </select>

      <label>Modalidad de Diálisis:</label>
      <select v-model="modalidad" class="border px-2 py-1 rounded">
        <option disabled value="">Seleccione</option>
        <option>Hemodiálisis</option>
        <option>Peritoneal</option>
      </select>
    </div>


    <div class="flex gap-6 mt-6">
      <div class="flex-1 space-y-6">
        <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
        <h2 class="text-xl font-semibold mb-1">Datos Iniciales </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hb (gr/ld) *</label>
                <input v-model="hb" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Calcio (mg/dl) *</label>
                <input v-model="calcio" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fosforo (mg/dl) *</label>
                <input v-model="fosforo" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">PTHi (pg/ml) *</label>
                <input v-model="pthi" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Alb (gr/dl) *</label>
                <input v-model="alb" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Calcio corregido (mg/dl)</label>
                <input v-model="calcioCorregido" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Kt/v *</label>
                <input v-model="kt" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
        </div>

        <hr />
        <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Tiempo de Dialisis (horas) *</label>
                <select v-model="tmpDialisis" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">2.00</option>
                    <option value="2">2.25</option>
                    <option value="3">2.5</option>
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
        <hr />

        <h2 class="text-xl font-semibold mb-1">Tratamientos </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Eritropoyetina *</label>
                <select v-model="eritropoyetina" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hierro *</label>
                <select v-model="hierro" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hiper paratiroidismo *</label>
                <select v-model="hiperparatiroidismo" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
        </div>

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
      </div>

      <div class="w-80 p-4 border rounded shadow">
        <div class="flex items-center justify-center mb-2">
          <div class="bg-gray-300 rounded-full h-16 w-16"></div>
        </div>
        <p class="text-center font-bold">Alejandro Antony Cerpa de la Cruz</p>
        <p class="text-center text-sm text-gray-600">DNI: 74456747</p>
        <ul class="text-sm text-gray-700 mt-4 space-y-1">
          <li><strong>Edad:</strong> 38</li>
          <li><strong>Sexo:</strong> Masculino</li>
          <li><strong>Tipo de Registro:</strong> Hemodiálisis</li>
          <li><strong>Estado:</strong> Nuevo</li>
          <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
        </ul>
        <div class="mt-4">
          <label class="text-sm font-medium">Historial de Registros</label>
          <select class="w-full border px-2 py-1 rounded">
            <option>Registro 1</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

const hb = ref('');
const calcio = ref('');
const fosforo = ref('');
const pthi = ref('');
const alb = ref('');
const calcioCorregido = ref('');
const kt = ref('');
const tmpDialisis = ref('');
const eritropoyetina = ref('');
const hierro = ref('');
const hiperparatiroidismo = ref('');

export default {
  setup() {
    return {
      hb,
      calcio,
      fosforo,
      pthi,
      alb,
      calcioCorregido,
      kt,
      tmpDialisis,
      eritropoyetina,
      hierro,
      hiperparatiroidismo,
    };
  },
};
</script> -->


<template>
  <div class="p-6 space-y-6">
    <!-- Botón de regreso -->
    <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
      ← Volver al inicio
    </div>

    <!-- Filtros superiores -->
    <div class="flex items-center gap-2 flex-wrap">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
        <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
      </select>

      <label>Clínica:</label>
      <label>{{ paciente.ipress }}</label>

      <label>Modalidad de Diálisis:</label>
      <label>{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</label>
    </div>

    <!-- Contenedor principal -->
    <div class="flex flex-col lg:flex-row gap-6 mt-4">
      <!-- Formulario principal -->
      <div class="flex-1 bg-white border rounded shadow p-6">
        <h2 class="text-xl font-semibold mb-1">Resultados Clínicos</h2>
        <p class="text-sm text-gray-600 mb-4">Complete la información médica del paciente en las diferentes secciones
        </p>

        <!-- Resultados -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(campo, index) in camposResultados" :key="index" class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">{{ campo.label }}</label>
            <input v-model.number="campo.model" type="number" min="0" step="1" placeholder="Ingrese un número entero"
              class="w-full border rounded p-2 text-sm" @keydown="bloquearDecimal" @input="validarEntero(campo)" />
          </div>
        </div>

        <!-- Tiempo de diálisis -->
        <div class="mt-6 space-y-1">
          <label class="block font-semibold text-sm text-gray-700">Tiempo de Diálisis</label>
          <select v-model="form.tmpDialisis" class="w-full border rounded p-2 text-sm">
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

        <!-- Tratamientos -->
        <h2 class="text-xl font-semibold mt-6 mb-2">Tratamientos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">Eritropoyetina</label>
            <select v-model="form.eritropoyetina" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">Hierro</label>
            <select v-model="form.hierro" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block font-semibold text-sm text-gray-700">Hiper Paratiroidismo</label>
            <select v-model="form.hiperparatiroidismo" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Sí</option>
              <option value="2">No</option>
            </select>
          </div>
        </div>

        <!-- Botones -->
        <div class="mt-6 flex gap-4 justify-end">
          <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancelar</button>
          <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
            @click="postForm()">Registrar</button>
          <!-- <button class="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded">Registrar y Volver a Llenar</button> -->
        </div>
      </div>

      <!-- Perfil del paciente -->
      <div class="w-80 p-4 border rounded shadow" v-if="pacienteSeleccionado.value">
        <div class="flex items-center justify-center mb-2">
          <div class="bg-gray-300 rounded-full h-16 w-16"></div>
        </div>
        <p class="text-center font-bold">{{ pacienteSeleccionado.value.paciente }}</p>
        <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.value.documento }}</p>
        <ul class="text-sm text-gray-700 mt-4 space-y-1">
          <li><strong>Edad:</strong> {{ edadPaciente }}</li>
          <li><strong>Sexo:</strong> {{ pacienteSeleccionado.value.genero == "M" ? "Masculino" : "Femenino" }}</li>
          <li><strong>Tipo de Registro:</strong> {{ pacienteSeleccionado.value.id_modalidad
            == 1 ? "Hemodialisis" : "Peritonial" }}</li>
          <li><strong>Estado:</strong> {{ pacienteSeleccionado.value.estado }}</li>
          <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
        </ul>
        <!-- <div class="mt-4">
          <label class="text-sm font-medium">Historial de Registros</label>
          <select class="w-full border px-2 py-1 rounded">
            <option>Registro 1</option>
          </select>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";

// 👇 defineProps debe estar fuera de cualquier función
const { paciente, periodo } = defineProps({
  paciente: {
    type: Object,
    required: true
  },
  periodo: {
    type: Number,
    required: true
  }
})

const mes = ref('JULIO');
const anio = ref('2025');
const clinicaSeleccionada = ref('');
const clinicas = ref(['DA VIDA SAC.']);
const modalidad = ref('');

const form = {
  tmpDialisis: null,
  eritropoyetina: null,
  hierro: null,
  hiperparatiroidismo: null,
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

}
const router = useRouter()
const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo
// Puedes usar props.paciente o hacer destructuring:

console.log("Paciente recibido:", periodo)  // ✅ No lanzará error
const postForm = async (url = null) => {
  try {
    const respuesta = await postAllIpress(url ?? "/resultadosClinicos/", form);
    pacienteSeleccionado.value = respuesta;
    alert("Se registro con exito")
    window.location.reload()

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

function bloquearDecimal(event) {
  // Bloquea punto y coma decimal
  if (event.key === '.' || event.key === ',' || event.key === 'e' || event.key === '-') {
    event.preventDefault();
  }
}

function validarEntero(campo) {
  const valor = campo.model;
  if (!Number.isInteger(valor)) {
    campo.model = Math.floor(valor) || 0;
  } else if (valor < 0) {
    campo.model = 0;
  }
}

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
onMounted(() => {
  fetchPaciente();
  fetchPeriodo();
});




const camposResultados = [
  { label: 'Hb (gr/dl)', model: form.hb },
  { label: 'Calcio (mg/dl)', model: form.calcio },
  { label: 'Fosforo (mg/dl)', model: form.fosforo },
  { label: 'PTHi (pg/ml)', model: form.pthi },
  { label: 'Alb (gr/dl)', model: form.alb },
  { label: 'Calcio corregido (mg/dl)', model: form.calcioCorregido },
  { label: 'Kt/v', model: form.kt },
];
</script>