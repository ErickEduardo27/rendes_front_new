<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
      <select v-model="periodoSeleccionado" class="border p-1 rounded" @change="searchPeriodoIpress">
        <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">{{ periodo.periodo }}
        </option>
      </select>
      <div class="d-flex align-items-center">
        <label>Clínica</label>
        <el-autocomplete v-model="clinicaSeleccionada" :fetch-suggestions="querySearch" clearable
          placeholder="Ingrese algo" @select="handleSelect" :value-key="'ipress'" style="margin: 0 1rem;width: 400px;" @change="searchPeriodoIpress"/>
      </div>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel"
          class="border border-[#007BFF] text-[#007BFF] px-4 py-2 rounded hover:bg-blue-50">
          Exportar
        </button>
      </div>
    </div>

    <div class="flex items-center gap-4 my-4">
      <label>Registros de </label>
        <select v-model="formularioSeleccionado" class="border p-1 rounded" @change="updateTabla">
        <option value="2">Unidad Actual </option>
        <option value="3">Infeccion </option>
        <option value="4">Morbilidad Hospitalaria </option>
        <option value="5">Resultados Clinicos</option>
        <option value="6">Vacunacion </option>
      </select>
      
    </div>

    <!-- <h3 class="text-md font-bold my-2">Registros Ingresados:</h3> -->
    <div class="flex gap-4 mb-4">
      <input v-model="filtroNombre" placeholder="Filtrar por nombre" class="border px-2 py-1 rounded" />
      <input v-model="filtroDocumento" placeholder="Filtrar por documento" class="border px-2 py-1 rounded" />
      <button @click="updateTabla" class="bg-blue-500 text-white px-3 py-1 rounded">Buscar</button>
    </div>
    <!-- <table class="table-auto w-full border mt-4">
  <thead>
    <tr>
      <th v-for="col in columnasTabla" :key="col" class="px-2 py-1 border bg-gray-100">
        {{ col }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(fila, i) in datosTabla" :key="i">
      <td v-for="col in columnasTabla" :key="col" class="px-2 py-1 border">
        {{ fila[col] }}
      </td>
    </tr>
  </tbody>
</table> -->

<table class="table-auto w-full border mt-4">
  <thead>
    <tr>
      <th v-for="col in columnasTabla" :key="col" class="border px-2 py-1 bg-gray-100 capitalize">
        {{ col.replaceAll("_", " ") }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(fila, i) in datosTabla" :key="i">
      <td v-for="col in columnasTabla" :key="col" class="border px-2 py-1">
        {{ fila[col] }}
      </td>
    </tr>
  </tbody>
</table>
<div class="my-4 flex gap-2">
<div class="flex justify-between items-center mt-4 text-sm text-[#6C7A91]">
  <div>
    Mostrando {{ datosTabla.length }} de {{ totalRegistros }} registros
  </div>
  <div class="flex items-center gap-2">
    <button @click="goToPreviousPage" :disabled="!anteriorPagina" class="px-3 py-1 border rounded"
      :class="anteriorPagina ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
      Anterior
    </button>
    <span class="px-3 py-1 border rounded bg-[#007BFF] text-white">
      {{ paginaActual }}
    </span>
    <button @click="goToNextPage" :disabled="!siguientePagina" class="px-3 py-1 border rounded"
      :class="siguientePagina ? 'text-[#007BFF]' : 'text-gray-400 cursor-not-allowed'">
      Siguiente
    </button>
  </div>
</div>
    <!-- <div class="grid grid-cols-9 font-semibold border-b pb-1 mb-1">
      <span class="col-span-2" style="display:flex ;text-align: left;align-items: center;">Nombre</span>
      <span  style="display:flex;justify-content: center;align-items: center;">UNIDAD</span>
      <span  style="display:flex;justify-content: center;align-items: center;">INFECCION</span>
      <span  style="display:flex;justify-content: center;align-items: center;">MORBILIDAD HOSPITALARIA</span>
      <span  style="display:flex;justify-content: center;align-items: center;">RESULTADOS CLINICOS</span>
      <span  style="display:flex;justify-content: center;align-items: center;">VACUNACION</span>
    </div>

    <div v-for="paciente in pacientes" :key="paciente.nombre" class="border rounded mb-3 p-3">
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

            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {{ numeroBadge(paciente, n) }}
            </span>
          </button>
        </div>
      </div>
    </div>
 -->
    <!-- <div class="text-right mt-6">
      <button class="bg-sky-600 text-white px-6 py-2 rounded">
        Terminar Registro General
      </button>
    </div> -->
  </div>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx';
const totalRegistros = ref(0);
const paginaActual = ref(1);
import { ref, computed, onMounted, watch } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
const state1 = ref('')

const aplicaTodos = ref(true)
const modalidadSeleccionada = ref('todos')
const clinicaSeleccionada = ref('CENTRO NACIONAL DE SALUD RENAL')
const idClinicaSeleccionada = ref(62877)
const idPeriodoIpress = ref(17)
const periodoSeleccionado = ref(55)
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)
const emit = defineEmits(['form2'])

const siguientePagina = ref(null);
const anteriorPagina = ref(null);
const formularioSeleccionado=ref(2)
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
const formulariosConfig = {
  2: {
    endpoint: "unidadesActualesPaginacion",
    columnas: [
      "paciente", "documento", "fecha_creacion_acceso_actual", "tipo_acceso_actual", "localizacion_acceso_actual", "cambio_acceso", "fecha_creacion_acceso_nuevo", "tipo_acceso_nuevo", "localizacion_acceso_nuevo"
    ],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      fecha_creacion_acceso_actual: item.fecha_creacion_acceso_actual ?? '-',
      tipo_acceso_actual:item.tipo_acceso_nuevo,
        localizacion_acceso_actual:item.localizacion_acceso_nuevo,
        cambio_acceso: item.cambio_acceso=='true'?'Si':'No',
        motivo_cambio: item.motivo_cambio,
        fecha_creacion_acceso_nuevo:item.fecha_creacion_acceso_nuevo,
        tipo_acceso_nuevo:item.tipo_acceso_nuevo,
        localizacion_acceso_nuevo:item.localizacion_acceso_nuevo
    })
  },
  3: {
    endpoint: "eventosAccesosVasculares",
    columnas: [
      "paciente", "documento", "fe_evento", "tpInfeccion", "tratamientoIV", "vancomicinaIV", "hemocultivoPositivo", "tipoGram", "tipoInfeccionLocal", "tpGermen", "bacteria", "tipoBacteria", "observaciones"
    ],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      fe_evento: item.fecha_evento ?? '-',
      tpInfeccion: item.tipo_evento ?? '-',
      tratamientoIV: item.descripcion ?? '-',
      vancomicinaIV: item.vancomicinaIV ?? '-',
      hemocultivoPositivo: item.hemocultivoPositivo ?? '-',
      tipoGram: item.tipoGram ?? '-',
      tipoInfeccionLocal: item.tipoInfeccionLocal ?? '-',
      tpGermen: item.tpGermen ?? '-',
      bacteria: item.bacteria ?? '-',
      tipoBacteria: item.tipoBacteria ?? '-',
      observaciones: item.observaciones ?? '-'
    })
  },
  4: {
    endpoint: "morbilidadesHospitalarias",
    columnas: ["paciente", "documento", "diagnostico", "codigo_diagnostico", "fIniHos", "fAltHos", "fuente"],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      diagnostico: item.diagnostico ?? '-',
      codigo_diagnostico: item.codigo_diagnostico ?? '-',
      fIniHos: item.fIniHos ?? '-',
      fAltHos: item.fAltHos ?? '-',
      fuente: item.fuente ?? '-',
    })
  },
  5: {
    endpoint: "resultadosClinicos",
    columnas: ["paciente", "documento", "tmpDialisis", "eritropoyetina", "hierro", "hiperparatiroidismo", "hb", "calcio", "fosforo", "pthi", "alb", "calcioCorregido", "kt"],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      tmpDialisis: item.tmpDialisis ?? '-',
      eritropoyetina: item.eritropoyetina ?? '-',
      hierro: item.hierro ?? '-',
      hiperparatiroidismo: item.hiperparatiroidismo ?? '-',
      hb: item.hb ?? '-',
      calcio: item.calcio ?? '-',
      fosforo: item.fosforo ?? '-',
      pthi: item.pthi ?? '-',
      alb: item.alb ?? '-',
      calcioCorregido: item.calcioCorregido ?? '-',
      kt: item.kt ?? '-'
    })
  },
  6: {
    endpoint: "vacunaciones",
    columnas: [
      "paciente", "documento",
      "turno", "frecuencia",
      "vhbEstado", "vhbFecha", "vhcEstado", "vhcFecha", "vihEstado", "vihFecha",
      "vacunaHepatitis", "estadoAcHBs", "fechaVacHepatitis",
      "dosisHepatitisB", "fechaHepatitisB", "motivoNoHepatitisB",
      "dosisCovid", "fechaCovid", "motivoNoCovid",
      "fechaInfluenza", "motivoNoInfluenza",
      "fechaNeumococo", "motivoNoNeumococo"
    ],
    parse: (item) => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      turno: item.turno ?? '-',
      frecuencia: item.frecuencia ?? '-',
      vhbEstado: item.vhbEstado ?? '-',
      vhbFecha: item.vhbFecha ?? '-',
      vhcEstado: item.vhcEstado ?? '-',
      vhcFecha: item.vhcFecha ?? '-',
      vihEstado: item.vihEstado ?? '-',
      vihFecha: item.vihFecha ?? '-',
      vacunaHepatitis: item.vacunaHepatitis ?? '-',
      estadoAcHBs: item.estadoAcHBs ?? '-',
      fechaVacHepatitis: item.fechaVacHepatitis ?? '-',
      dosisHepatitisB: item.dosisHepatitisB ?? '-',
      fechaHepatitisB: item.fechaHepatitisB ?? '-',
      motivoNoHepatitisB: item.motivoNoHepatitisB ?? '-',
      dosisCovid: item.dosisCovid ?? '-',
      fechaCovid: item.fechaCovid ?? '-',
      motivoNoCovid: item.motivoNoCovid ?? '-',
      fechaInfluenza: item.fechaInfluenza ?? '-',
      motivoNoInfluenza: item.motivoNoInfluenza ?? '-',
      fechaNeumococo: item.fechaNeumococo ?? '-',
      motivoNoNeumococo: item.motivoNoNeumococo ?? '-'
    })
  },
  // Agrega aquí otros formularios
};

const datosTabla = ref([]);
const columnasTabla = ref([]);
const filtroNombre = ref("");
const filtroDocumento = ref("");

const colorClase = (n) => {
  if (n === 1) return 'text-red-600'
  if (n === 2) return 'text-orange-500'
  if (n === 3) return 'text-yellow-500'
  if (n >= 4) return 'text-green-600'
  return 'text-gray-500'
}
const exportToExcel = async () => {
  try {
    const config = formulariosConfig[formularioSeleccionado.value];
    if (!config) {
      alert('No hay configuración de formulario');
      return;
    }
    // Construir endpoint base con filtros
    let endpoint = `/${config.endpoint}/?id_periodo_ipress=${idPeriodoIpress.value}`;
    const params = [];
    if (filtroNombre.value) params.push(`search=${encodeURIComponent(filtroNombre.value)}`);
    if (filtroDocumento.value) params.push(`search=${encodeURIComponent(filtroDocumento.value)}`);
    if (params.length > 0) {
      endpoint += '&' + params.join('&');
    }
    // Función para obtener todos los registros paginando
    let nextUrl = endpoint;
    let allResults = [];
    while (nextUrl) {
      const data = await getAllIpress(nextUrl);
      if (data && data.results) {
        allResults = allResults.concat(data.results);
        nextUrl = data.next;
      } else {
        break;
      }
    }
    if (!allResults.length) {
      alert('No hay datos para exportar');
      return;
    }
    // Usar las columnas actuales para exportar
    const exportData = allResults.map(config.parse).map(row => {
      const obj = {};
      columnasTabla.value.forEach(col => {
        obj[col] = row[col];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');
    XLSX.writeFile(wb, 'registros_tabla.xlsx');
  } catch (error) {
    alert('Error al exportar a Excel');
    console.error(error);
  }
};
const numeroBadge = (paciente, n) => {
  if (n === 1) return paciente.cantidad_de_registros_unidades_actuales
  if (n === 2) return paciente.cantidad_de_eventos_accesos_vasculares
  if (n === 3) return paciente.cantidad_de_morbilidades
  if (n === 4) return paciente.cantidad_de_resultados_clinicos
  if (n === 5) return paciente.cantidad_de_vacunaciones
};
const cargarPagina = async (url) => {
  if (!url) return;
  const config = formulariosConfig[formularioSeleccionado.value];
  try {
    let finalUrl = url;
    const params = [];
    if (filtroNombre.value) params.push(`paciente=${encodeURIComponent(filtroNombre.value)}`);
    if (filtroDocumento.value) params.push(`documento=${encodeURIComponent(filtroDocumento.value)}`);
    if (params.length > 0) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.join('&');
    }
    const data = await getAllIpress(finalUrl);
    datosTabla.value = data.results.map(config.parse);
    siguientePagina.value = data.next;
    anteriorPagina.value = data.previous;
    totalRegistros.value = data.count ?? datosTabla.value.length;
    // Calcular página actual
    if (data.next || data.previous) {
      const nextUrl = new URL(data.next ?? data.previous);
      const pageParam = nextUrl.searchParams.get('page');
      paginaActual.value = pageParam ? parseInt(pageParam) - (data.next ? 1 : -1) : 1;
    } else {
      paginaActual.value = 1;
    }
  } catch (error) {
    console.error("Error en paginación:", error);
  }
};
const pacientes = ref([])
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


const updateTabla = async () => {
  const config = formulariosConfig[formularioSeleccionado.value];
  if (!config) return;

  try {
    let endpoint = `/${config.endpoint}/?id_periodo_ipress=${idPeriodoIpress.value}`;
    const params = [];
    if (filtroNombre.value) params.push(`search=${encodeURIComponent(filtroNombre.value)}`);
    if (filtroDocumento.value) params.push(`search=${encodeURIComponent(filtroDocumento.value)}`);
    if (params.length > 0) {
      endpoint += '&' + params.join('&');
    }
    const data = await getAllIpress(`${endpoint}`);
    const registros = data.results || [];

    datosTabla.value = registros.map(config.parse);
    columnasTabla.value = config.columnas;

    siguientePagina.value = data.next;
    anteriorPagina.value = data.previous;
    totalRegistros.value = data.count ?? datosTabla.value.length;
    // Calcular página actual
    if (data.next || data.previous) {
      const nextUrl = new URL(data.next ?? data.previous);
      const pageParam = nextUrl.searchParams.get('page');
      paginaActual.value = pageParam ? parseInt(pageParam) - (data.next ? 1 : -1) : 1;
    } else {
      paginaActual.value = 1;
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
    datosTabla.value = [];
    columnasTabla.value = [];
    totalRegistros.value = 0;
    paginaActual.value = 1;
  }
};
const goToNextPage = () => {
  if (siguientePagina.value) {
    cargarPagina(siguientePagina.value);
  }
};

const goToPreviousPage = () => {
  if (anteriorPagina.value) {
    cargarPagina(anteriorPagina.value);
  }
};
/* const updateTabla = async () => {
  const endpoint = endpoints[formularioSeleccionado.value];
  if (!endpoint) return;

  try {
    const data = await getAllIpress(`/${endpoint}/`);
    datosTabla.value = data;
    const registros = data.results || []; // extracción segura de la página
    console.log("Registros recibidos:", registros);

    // Aplanar cada registro
    datosTabla.value = registros.map(item => ({
      paciente: item.datosPaciente?.paciente ?? '-',
      documento: item.datosPaciente?.documento ?? '-',
      tipo_documento: item.datosPaciente?.tipo_documento ?? '-',
      genero: item.datosPaciente?.genero ?? '-',
      fecha_nacimiento: item.datosPaciente?.fecha_nacimiento ?? '-',
      red: item.datosRed?.red ?? '-',
      fecha_ingreso: item.fecha_ingreso ?? '-',
      VHB: item.VHB ?? '-',
      VHC: item.VHC ?? '-',
      VHI: item.VHI ?? '-',
      tipo_acceso: item.tipo_acceso_actual ?? '-',
      localizacion_acceso: item.localizacion_acceso_actual ?? '-',
      estado: item.datosPaciente?.estado ?? '-'
    }));

    columnasTabla.value = [
      "paciente",
      "documento",
      "tipo_documento",
      "genero",
      "fecha_nacimiento",
      "red",
      "fecha_ingreso",
      "VHB",
      "VHC",
      "VHI",
      "tipo_acceso",
      "localizacion_acceso",
      "estado"
    ];

    // Opcional: guarda info de paginación si quieres botones
    siguientePagina.value = data.next;
    anteriorPagina.value = data.previous;

    // Establece columnas dinámicas (puedes ajustar con base en tus modelos reales)
    columnasTabla.value = Object.keys(datosTabla.value[0] || {});
  } catch (error) {
    console.error("Error al cargar datos:", error);
    datosTabla.value = [];
    columnasTabla.value = [];
  }
}; */

onMounted(updateTabla);
watch(formularioSeleccionado, updateTabla);
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
  updateTabla()
}

const fetchPacientes = async (url = null) => {
  try {
    const respuesta = await getAllIpress(url ?? "/resumen_registros/" + idIpress.value + "/" + idPerido.value);
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
