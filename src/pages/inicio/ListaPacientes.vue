<template>
  <div>
    <div class="flex items-center gap-4 mb-4 flex-wrap">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" @change="searchPeriodoIpress">
        <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">{{ periodo.periodo }}
        </option>
      </select>
      <div class="d-flex align-items-center">
        <label>Clínica</label>
        <el-autocomplete v-model="clinicaSeleccionada" :fetch-suggestions="querySearch" clearable
          placeholder="Ingrese algo" @select="handleSelect" :value-key="'ipress'" style="margin: 0 1rem;width: 400px;"/>
      </div>
    </div>

    <div class="flex items-center gap-4 my-4">
      <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="$emit('nuevo-registro')">
        Nuevo Registro
      </button>
      <button v-if="perfil!=='Clinicas'" class="bg-sky-500 text-white px-4 py-1 rounded" @click="$emit('captar-paciente')">
        Captar Paciente
      </button>
      <button v-if="perfil!=='Clinicas'" class="bg-sky-500 text-white px-4 py-1 rounded" @click="$emit('egresar-paciente')">
        Egresar Paciente
      </button>
    </div>

    <h3 class="text-md font-bold my-2">Pacientes Ingresados:</h3>
    <div class="grid grid-cols-9 font-semibold border-b pb-1 mb-1">
      <span class="col-span-2" style="display:flex ;text-align: left;align-items: center;">Nombre</span>
      <span  style="display:flex;justify-content: center;align-items: center;">UNIDAD</span>
      <span  style="display:flex;justify-content: center;align-items: center;">INFECCION</span>
      <span  style="display:flex;justify-content: center;align-items: center;">MORBILIDAD HOSPITALARIA</span>
      <span  style="display:flex;justify-content: center;align-items: center;">RESULTADOS CLINICOS</span>
      <span  style="display:flex;justify-content: center;align-items: center;">VACUNACION</span>
    </div>

  <div v-for="paciente in pacientesPaginados" :key="paciente.nombre" class="border rounded mb-3 p-3">
      <div class="grid grid-cols-9 items-center">
        <div class="col-span-2 font-medium">
          {{ paciente.paciente }}
          <div class="text-sm text-gray-500 uppercase">
            ESTADO: NUEVO<br />
            Modalidad: {{ paciente.modalidad == 1 ? "Hemodialisis" : "Peritoneal" }}<br />
            Clínica: {{ paciente.ipress }}
          </div>
        </div>
        <div v-for="n in 5" :key="n" class="text-center relative inline-block">
          <button @click="abrirFormulario(paciente, n)" class="text-lg hover:scale-110 relative"
            title="Abrir Formulario">
            <span :class="colorClase(n)">📝</span>
            <!-- Badge -->
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {{ numeroBadge(paciente, n) }}
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center my-4">
      <button class="px-3 py-1 rounded bg-gray-200" :disabled="paginaActual === 1" @click="paginaActual--">Anterior</button>
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button class="px-3 py-1 rounded bg-gray-200" :disabled="paginaActual === totalPaginas" @click="paginaActual++">Siguiente</button>
    </div>

    <div class="text-right mt-6">
      <button class="bg-sky-600 text-white px-6 py-2 rounded">
        Terminar Registro General
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue';
import { getAllIpress } from "@/services/ipress/Ipress.service";
const perfil = localStorage.getItem('perfil')
const pacientes = ref([])
// --- Paginación ---
const paginaActual = ref(1)
const pacientesPorPagina = 5
const totalPaginas = computed(() => Math.ceil(pacientes.value.length / pacientesPorPagina))
const pacientesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * pacientesPorPagina
  return pacientes.value.slice(inicio, inicio + pacientesPorPagina)
})

watch(pacientes, () => {
  paginaActual.value = 1
})

const state1 = ref('')
const aplicaTodos = ref(true)
const modalidadSeleccionada = ref('todos')
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL')
const idClinicaSeleccionada = ref(62877)
const idPeriodoIpress = ref(17)
const periodoSeleccionado = ref(55)
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)
const emit = defineEmits([
  'form2',
  'form3',
  'form4',
  'form5',
  'form7',
  'captar-paciente',
  'nuevo-registro',
  'egresar-paciente'
])

const abrirFormulario = (paciente, numeroFormulario) => {
  console.log("paientessss",idPeriodoIpress.value)
  switch (numeroFormulario) {
    case 1: emit('form2', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value}); break
    case 2: emit('form3', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 3: emit('form4', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 4: emit('form5', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 5: emit('form7', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
  }
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
}

const colorClase = (n) => {
  if (n === 1) return 'text-red-600'
  if (n === 2) return 'text-orange-500'
  if (n === 3) return 'text-yellow-500'
  if (n >= 4) return 'text-green-600'
  return 'text-gray-500'
}

const numeroBadge = (paciente, n) => {
  if (n === 1) return paciente.cantidad_de_registros_unidades_actuales
  if (n === 2) return paciente.cantidad_de_eventos_accesos_vasculares
  if (n === 3) return paciente.cantidad_de_morbilidades
  if (n === 4) return paciente.cantidad_de_resultados_clinicos
  if (n === 5) return paciente.cantidad_de_vacunaciones
};


const ipress = ref([])
const periodoIpress = ref([])
const periodos = ref([])
const idPerido = ref(55)
const idIpress = ref(62877)

const fechaActual = new Date()
const meses = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SETIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
]
const anios = Array.from({ length: 10 }, (_, i) => fechaActual.getFullYear() - i)
const mes = ref(meses[fechaActual.getMonth()])
const ano = ref(fechaActual.getFullYear())


function searchPeriodoIpress() {
  const resultado = periodoIpress.value.find(
    item => item.id_ipress === idClinicaSeleccionada.value && item.periodo ===  periodoSeleccionado.value
  );
  if (resultado) {
    idPeriodoIpress.value = resultado.id_periodo_ipress;

  }
  console.log("imprimiendo valor de id periodo ipress",idPeriodoIpress.value)
  idIpress.value = idClinicaSeleccionada.value
  idPerido.value = periodoSeleccionado.value
  fetchPacientes()
}

const fetchPacientes = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/resumen_registros/" + idIpress.value + "/" + idPerido.value+"/");
    pacientes.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const fetchPeriodoIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodoIpress/");
    periodoIpress.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

const handleSelect = (item) => {
  idClinicaSeleccionada.value = item.id_ipress; // ID u otros datos
  searchPeriodoIpress();
};
const querySearch = (queryString, cb) => {
  const results = queryString
    ? ipress.value.filter(r =>
      r.ipress?.toLowerCase().includes(queryString.toLowerCase())
    )
    : ipress.value;
  cb(results);
};
const fetchIpress = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/ipress/");
    ipress.value = respuesta

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};
const fetchPeriodo = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/periodos/");
    periodos.value = respuesta;

  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
  }
};

onMounted(() => {
  localStorage.getItem('perfil')
  console.log("perfil",localStorage.getItem('perfil'))
  fetchPeriodoIpress();
  fetchPacientes();
  fetchIpress();
  fetchPeriodo();
});

</script>

<style scoped>
.text-red-600 {
  color: #dc2626;
}

.text-orange-500 {
  color: #f97316;
}

.text-yellow-500 {
  color: #eab308;
}

.text-green-600 {
  color: #16a34a;
}
</style>
