<template>
  <div>
    <div class="mb-6">
      <FiltroSuperior
        v-model:periodo="periodoSeleccionado"
        v-model:clinica="idClinicaSeleccionada"
        v-model:modalidad="modalidadSeleccionada"
        @change="handleFiltroChange"
      />
    </div>

    <div class="flex items-center gap-4 my-4">
      <button class="bg-sky-500 text-white px-4 py-1 rounded" @click="emitNuevoRegistro">
        Nuevo Registro
      </button>
      </div>

    <h3 class="text-md font-bold my-2">Pacientes Ingresados:</h3>
    
    <div class="flex gap-4 mb-4">
      <input v-model="filtroNombre" placeholder="Buscar por nombre" class="border px-2 py-1 rounded w-48" />
      <input v-model="filtroDni" placeholder="Buscar por DNI" class="border px-2 py-1 rounded w-48" />
    </div>

    <div class="grid grid-cols-9 font-semibold border-b pb-1 mb-1">
      <span class="col-span-2" style="display:flex ;text-align: left;align-items: center;">Nombre</span>
      <span style="display:flex;justify-content: center;align-items: center;">ACCESO DE DIÁLISIS</span>
      <span style="display:flex;justify-content: center;align-items: center;">INFECCION</span>
      <span style="display:flex;justify-content: center;align-items: center;">MORBILIDAD HOSPITALARIA</span>
      <span style="display:flex;justify-content: center;align-items: center;">RESULTADOS CLINICOS</span>
      <span style="display:flex;justify-content: center;align-items: center;">VACUNACION</span>
    </div>

    <div v-for="paciente in pacientesPaginados" :key="paciente.nombre" class="border rounded mb-3 p-3">
      <div class="grid grid-cols-9 items-center">
        <div class="col-span-2 font-medium">
          {{ paciente.paciente }}
          <div class="text-sm text-gray-500 uppercase">
            ESTADO: {{ paciente.estado }}<br />
            Modalidad: {{ paciente.modalidad == 1 ? "Hemodialisis" : "Peritoneal" }}<br />
          </div>
        </div>
        <div v-for="n in 5" :key="n" class="text-center relative inline-block">
          <button @click="abrirFormulario(paciente, n)" class="text-lg hover:scale-110 relative" title="Abrir Formulario">
            <span :class="colorClase(n)">📝</span>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getAllIpress } from "@/services/ipress/Ipress.service";
// IMPORTANTE: Importar el componente nuevo
import FiltroSuperior from '@/components/FiltroSuperior.vue'; 

const filtroNombre = ref("");
const filtroDni = ref("");
const perfil = localStorage.getItem('perfil')
const pacientes = ref([])

// --- Paginación ---
const paginaActual = ref(1)
const pacientesPorPagina = 5

const pacientesFiltrados = computed(() => {
  const nombre = filtroNombre.value.trim().toLowerCase();
  const dni = filtroDni.value.trim().toLowerCase();
  return pacientes.value.filter(p => {
    // Agregamos lógica para filtrar también por modalidad si se selecciona en el filtro superior
    const coincideNombre = !nombre || (p.paciente && p.paciente.toLowerCase().includes(nombre));
    const coincideDni = !dni || (p.documento && p.documento.toLowerCase().includes(dni));
    
    // Lógica opcional: Filtrar la lista localmente por modalidad si la API trae todo
    let coincideModalidad = true;
    if (modalidadSeleccionada.value && modalidadSeleccionada.value !== 'todos') {
        const modNum = modalidadSeleccionada.value === 'HEMO' ? 1 : 2; 
        // Asumiendo 1=HEMO, 2=DP en tu base de datos
        if (p.modalidad != modNum) coincideModalidad = false;
    }

    return coincideNombre && coincideDni && coincideModalidad;
  });
});

const totalPaginas = computed(() => Math.ceil(pacientesFiltrados.value.length / pacientesPorPagina))
const pacientesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * pacientesPorPagina
  return pacientesFiltrados.value.slice(inicio, inicio + pacientesPorPagina)
})

watch(pacientes, () => {
  paginaActual.value = 1
})

const state1 = ref('')
const aplicaTodos = ref(true)

// Variables conectadas al FiltroSuperior
const modalidadSeleccionada = ref(null) // null o 'HEMO'/'DP'
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL') // Texto (se mantiene para display)
const idClinicaSeleccionada = ref(62877) // ID para lógica
const periodoSeleccionado = ref(94) // ID periodo

const idPeriodoIpress = ref(17)
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)
const emit = defineEmits([
  'form2', 'form3', 'form4', 'form5', 'form7',
  'captar-paciente', 'nuevo-registro', 'egresar-paciente'
])

// --- FUNCIÓN NUEVA: Maneja el cambio desde FiltroSuperior ---
const handleFiltroChange = (evento) => {
    console.log("Filtro Superior cambió:", evento);
    
    // Al usar v-model, las variables periodoSeleccionado e idClinicaSeleccionada 
    // ya se actualizaron automáticamente. Solo necesitamos disparar la búsqueda.
    if (evento.tipo === 'clinica' || evento.tipo === 'periodo') {
        searchPeriodoIpress();
    }
    // Si cambia la modalidad, el computed 'pacientesFiltrados' lo filtrará automáticamente
};

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
const ipressAsignadas = ref([])
const periodoIpress = ref([])
const periodos = ref([])
const idPerido = ref(94)
const idIpress = ref(62877)

const fechaActual = new Date()
// (Variables de fechas y meses se mantienen igual...)

function searchPeriodoIpress() {
  // Nota: idClinicaSeleccionada ahora viene directo del v-model del FiltroSuperior
  const resultado = periodoIpress.value.find(
    item => item.id_ipress === idClinicaSeleccionada.value && item.periodo ===  periodoSeleccionado.value
  );
  if (resultado) {
    idPeriodoIpress.value = resultado.id_periodo_ipress;
  }
  console.log("imprimiendo valor de id periodo ipress",idPeriodoIpress.value)
  idIpress.value = idClinicaSeleccionada.value
  idPerido.value = periodoSeleccionado.value
  
  // Recargamos pacientes con los nuevos filtros
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

// handleSelect y querySearch ya no son estrictamente necesarios para el FiltroSuperior
// pero los dejo por si los usas en otro lado o para no romper lógica.
const handleSelect = (item) => {
  idClinicaSeleccionada.value = item.id_ipress; 
  searchPeriodoIpress();
};

// ... (Resto de fetchIpress, fetchPeriodo, onMounted se mantienen igual) ...
const fetchIpress = async (url = null) => {
  try {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario.id_usuario) {
      ipress.value = [];
      return;
    }
    const asignaciones = await getAllIpress(`/asignaciones/?usuario=${usuario.id_usuario}`);
    const idsAsignados = asignaciones.map(a => a.ipress);
    ipressAsignadas.value = idsAsignados;
    const todasIpress = await getAllIpress(url ?? "/ipress/");
    ipress.value = todasIpress.filter(i => idsAsignados.includes(i.id_ipress));
  } catch (error) {
    console.error('Error al obtener IPRESS:', error);
    ipress.value = [];
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

const emitNuevoRegistro = () => {
  emit('nuevo-registro', {
    periodo: periodoSeleccionado.value,
    idPeriodoIpress: idPeriodoIpress.value,
    idClinica: idClinicaSeleccionada.value,
    nombreClinica: clinicaSeleccionada.value,
    modalidad: modalidadSeleccionada.value // Agregamos modalidad al emit
  });
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
/* Tus estilos existentes */
.text-red-600 { color: #dc2626; }
.text-orange-500 { color: #f97316; }
.text-yellow-500 { color: #eab308; }
.text-green-600 { color: #16a34a; }
</style>