<template>
  <div>

    <div class="grid grid-cols-4 gap-4 my-6">
      
      <div class="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Pacientes</p>
          <p class="text-3xl font-bold text-gray-800">{{ estadisticas.total }}</p>
        </div>
        <div class="p-3 bg-blue-50 rounded-full text-blue-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pacientes Egresados</p>
          <p class="text-3xl font-bold text-emerald-600">{{ estadisticas.egresados }}</p>
        </div>
        <div class="p-3 bg-emerald-50 rounded-full text-emerald-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pacientes Reingresados</p>
          <p class="text-3xl font-bold text-amber-600">{{ estadisticas.reingresos }}</p>
        </div>
        <div class="p-3 bg-amber-50 rounded-full text-amber-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h4l3-7 4 14 3-7h4"></path>
          </svg>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div class="w-full">
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Registros por Formulario</p>
          <p class="text-xs text-gray-400 mb-2">Según periodo, IPRESS y modalidad</p>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
            <div class="flex justify-between">
              <span>Acceso Vascular</span>
              <span class="font-semibold text-sky-700">{{ estadisticas.totalUnidades }}</span>
            </div>
            <div class="flex justify-between">
              <span>Infecciones</span>
              <span class="font-semibold text-rose-700">{{ estadisticas.totalEventos }}</span>
            </div>
            <div class="flex justify-between">
              <span>Morbilidad Hosp.</span>
              <span class="font-semibold text-amber-700">{{ estadisticas.totalMorbilidades }}</span>
            </div>
            <div class="flex justify-between">
              <span>Resultados Clínicos</span>
              <span class="font-semibold text-indigo-700">{{ estadisticas.totalResultados }}</span>
            </div>
            <div class="flex justify-between col-span-2">
              <span>Vacunación</span>
              <span class="font-semibold text-emerald-700">{{ estadisticas.totalVacunaciones }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="flex items-center gap-4 my-4 border-t pt-4">
      <button class="bg-sky-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-600 transition" @click="emitNuevoRegistro">
        + Nuevo Registro
      </button>
    </div>

    <!-- Modal flotante: Nuevo registro de paciente -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-4 relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-1 shadow"
          @click="cerrarModalNuevo"
        >
          ✕
        </button>
        <FormularioPaciente
          :periodo-inicial="periodoSeleccionado"
          :id-periodo-ipress-inicial="idPeriodoIpress"
          :id-clinica-inicial="idClinicaSeleccionada"
          :nombre-clinica-inicial="clinicaSeleccionada"
          @cancelar="cerrarModalNuevo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import FiltroSuperior from '@/components/FiltroSuperior.vue';
import FormularioPaciente from './FormularioPaciente.vue';

// Estado global: periodo, clínica (ipress) y modalidad (si el layout los provee)
const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const filtroNombre = ref("");
const filtroDni = ref("");
const perfil = localStorage.getItem('perfil')
const pacientes = ref([])

// --- Paginación ---
const paginaActual = ref(1)
const pacientesPorPagina = 5

// --- LÓGICA DE BÚSQUEDA ---
const pacientesFiltrados = computed(() => {
  const nombre = filtroNombre.value.trim().toLowerCase();
  const dni = filtroDni.value.trim().toLowerCase();
  return pacientes.value.filter(p => {
    const coincideNombre = !nombre || (p.paciente && p.paciente.toLowerCase().includes(nombre));
    const coincideDni = !dni || (p.documento && p.documento.toLowerCase().includes(dni));
    
    let coincideModalidad = true;
    if (modalidadSeleccionada.value && modalidadSeleccionada.value !== 'todos') {
        const modNum = modalidadSeleccionada.value === 'HEMO' ? 1 : 2; 
        if (p.modalidad != modNum) coincideModalidad = false;
    }

    return coincideNombre && coincideDni && coincideModalidad;
  });
});

// Estadísticas de pacientes desde tabla paciente_atencion (por periodo, ipress, modalidad)
const estadisticasAtencion = ref({ total: 0, egresados: 0, reingresos: 0 });

const fetchEstadisticasAtencion = async () => {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
  if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);
  const qs = params.toString();
  if (!qs) {
    estadisticasAtencion.value = { total: 0, egresados: 0, reingresos: 0 };
    return;
  }
  try {
    const res = await getAllIpress(`/pacienteAtencion/estadisticas/?${qs}`);
    estadisticasAtencion.value = {
      total: res?.total ?? 0,
      egresados: res?.egresados ?? 0,
      reingresos: res?.reingresos ?? 0,
    };
  } catch (e) {
    console.error('Error al obtener estadísticas de atención:', e);
    estadisticasAtencion.value = { total: 0, egresados: 0, reingresos: 0 };
  }
};

// Cantidad de registros por tipo de formulario según periodo, IPRESS y modalidad
const estadisticasRegistros = ref({
  totalUnidades: 0,
  totalEventos: 0,
  totalMorbilidades: 0,
  totalResultados: 0,
  totalVacunaciones: 0,
});

const countFromResponse = (res) => {
  if (Array.isArray(res)) return res.length;
  if (res?.results && Array.isArray(res.results)) return res.results.length;
  return 0;
};

const fetchEstadisticasRegistros = async () => {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;

  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
  if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);
  const qs = params.toString();

  if (!qs) {
    estadisticasRegistros.value = { totalUnidades: 0, totalEventos: 0, totalMorbilidades: 0, totalResultados: 0, totalVacunaciones: 0 };
    return;
  }

  try {
    const [resUnidades, resEventos, resMorb, resResultados, resPeriodoIpress] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${qs}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      (idPeriodo != null && idIpress != null) ? postAllIpress('/consulta_periodo_ipress/', { id_periodo: Number(idPeriodo), id_ipress: Number(idIpress), id_estado: 1 }) : Promise.resolve([]),
    ]);

    const arrPeriodoIpress = Array.isArray(resPeriodoIpress) ? resPeriodoIpress : (resPeriodoIpress?.length ? resPeriodoIpress : []);
    const idPeriodoIpress = arrPeriodoIpress.length ? arrPeriodoIpress[0].id_periodo_ipress : null;
    let totalVacunaciones = 0;
    if (idPeriodoIpress != null) {
      try {
        const resVac = await getAllIpress(`/vacunaciones/?id_periodo_ipress=${idPeriodoIpress}`);
        totalVacunaciones = countFromResponse(resVac);
      } catch (e) {
        totalVacunaciones = 0;
      }
    }

    estadisticasRegistros.value = {
      totalUnidades: countFromResponse(resUnidades),
      totalEventos: countFromResponse(resEventos),
      totalMorbilidades: countFromResponse(resMorb),
      totalResultados: countFromResponse(resResultados),
      totalVacunaciones,
    };
  } catch (e) {
    console.error('Error al obtener estadísticas de registros:', e);
    estadisticasRegistros.value = { totalUnidades: 0, totalEventos: 0, totalMorbilidades: 0, totalResultados: 0, totalVacunaciones: 0 };
  }
};

// --- ESTADÍSTICAS DEL DASHBOARD ---
// Total, egresados y reingresos: paciente_atencion (periodo/ipress/modalidad)
// Registros por formulario: cantidades por tipo según periodo, IPRESS y modalidad
const estadisticas = computed(() => {
  const atencion = estadisticasAtencion.value;
  const regs = estadisticasRegistros.value;
  return {
    total: atencion.total,
    egresados: atencion.egresados,
    reingresos: atencion.reingresos,
    totalUnidades: regs.totalUnidades,
    totalEventos: regs.totalEventos,
    totalMorbilidades: regs.totalMorbilidades,
    totalResultados: regs.totalResultados,
    totalVacunaciones: regs.totalVacunaciones,
  };
});
// -----------------------------------

// Paleta de colores para cada tipo de formulario
const obtenerColor = (n) => {
  const estilos = {
    1: { clases: 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400', icono: 'text-blue-600', punto: 'bg-blue-400' },
    2: { clases: 'border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-400', icono: 'text-rose-600', punto: 'bg-rose-400' },
    3: { clases: 'border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-400', icono: 'text-amber-600', punto: 'bg-amber-400' },
    4: { clases: 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400', icono: 'text-indigo-600', punto: 'bg-indigo-400' },
    5: { clases: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400', icono: 'text-emerald-600', punto: 'bg-emerald-400' }
  }
  return estilos[n] || { clases: 'border-gray-200 bg-white', icono: 'text-gray-500', punto: 'bg-gray-400' };
}

const obtenerTitulo = (n) => {
  const titulos = { 1: 'Acceso Vascular', 2: 'Registro de Infección', 3: 'Morbilidad Hospitalaria', 4: 'Resultados Clínicos', 5: 'Vacunación' }
  return titulos[n] || 'Formulario';
}

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
const modalidadSeleccionada = ref(null) 
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL') 
const idClinicaSeleccionada = ref('') 
const periodoSeleccionado = ref(94) 

const idPeriodoIpress = ref(17)
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)
const emit = defineEmits(['form2', 'form3', 'form4', 'form5', 'form7', 'captar-paciente', 'nuevo-registro', 'egresar-paciente'])

const handleFiltroChange = (evento) => {
    if (evento.tipo === 'clinica' || evento.tipo === 'periodo') {
        searchPeriodoIpress();
    }
};

const abrirFormulario = (paciente, numeroFormulario) => {
  switch (numeroFormulario) {
    case 1: emit('form2', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value}); break
    case 2: emit('form3', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 3: emit('form4', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 4: emit('form5', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
    case 5: emit('form7', { paciente, numeroFormulario, periodo: periodoSeleccionado.value,periodoIpress: idPeriodoIpress.value }); break
  }
}

const cerrarFormulario = () => { mostrarFormulario.value = false }

const numeroBadge = (paciente, n) => {
  if (n === 1) return paciente.cantidad_de_registros_unidades_actuales
  if (n === 2) return paciente.cantidad_de_eventos_accesos_vasculares
  if (n === 3) return paciente.cantidad_de_morbilidades
  if (n === 4) return paciente.cantidad_de_resultados_clinicos
  if (n === 5) return paciente.cantidad_de_vacunaciones
  return 0
};

const ipress = ref([])
const ipressAsignadas = ref([])
const periodoIpress = ref([])
const periodos = ref([])
const idPerido = ref(94)
const idIpress = ref('')

function searchPeriodoIpress() {
  const resultado = periodoIpress.value.find(
    item => item.id_ipress === idClinicaSeleccionada.value && item.periodo ===  periodoSeleccionado.value
  );
  if (resultado) {
    idPeriodoIpress.value = resultado.id_periodo_ipress;
  }
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

const fetchIpress = async (url = null) => {
  try {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario.id_usuario) {
      ipress.value = [];
      return;
    }
    const asignaciones = await getAllIpress(/asignaciones/);
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

const mostrarModalNuevo = ref(false);

const cerrarModalNuevo = () => {
  mostrarModalNuevo.value = false;
};

const emitNuevoRegistro = () => {
  mostrarModalNuevo.value = true;
};

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  fetchEstadisticasAtencion();
  fetchEstadisticasRegistros();
}, { deep: true });

onMounted(() => {
  fetchPeriodoIpress();
  fetchPacientes();
  fetchIpress();
  fetchPeriodo();
  fetchEstadisticasAtencion();
  fetchEstadisticasRegistros();
});
</script>

<style scoped>
/* Estilos sin cambios */
</style>