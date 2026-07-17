<template>
  <div class="bg-white border rounded-xl shadow-sm p-4">
    <h3 class="text-sm font-semibold text-slate-700 mb-3">
      Registro de Inicio de Terapia de Reemplazo Renal (clínica y periodo) — incluye sin ficha de diálisis aún
    </h3>
    <div class="flex flex-wrap gap-3 mb-4">
      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por nombre</label>
        <input
          v-model="filtroNombre"
          type="text"
          placeholder="Apellidos y nombres..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          @input="aplicarFiltrosBusqueda"
        />
      </div>
      <div class="flex-1 min-w-[160px]">
        <label class="block text-xs font-medium text-gray-600 mb-1">Filtrar por documento</label>
        <input
          v-model="filtroDni"
          type="text"
          placeholder="DNI / CE / pasaporte..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          @input="aplicarFiltrosBusqueda"
        />
      </div>
    </div>
    <div
      v-if="mostrarAprobacion && idIpress != null && idPeriodo != null"
      class="flex flex-wrap items-center justify-between gap-2 mb-3"
    >
      <p class="text-xs text-slate-500">Editar y Aprobar solo aplican si el paciente tiene ficha de diálisis.</p>
      <button
        v-if="pendientesAprobacion.length"
        type="button"
        class="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold disabled:opacity-50"
        :disabled="aprobandoTodos || cargandoPacientes"
        @click="aprobarTodosPendientes"
      >
        {{ aprobandoTodos ? 'Aprobando…' : `Aprobar todos (${pendientesAprobacion.length})` }}
      </button>
    </div>
    <p v-if="idIpress == null || idPeriodo == null" class="text-sm text-amber-600">
      Seleccione clínica (IPRESS) y periodo en el encabezado para cargar la lista.
    </p>
    <div v-else class="overflow-x-auto border rounded-lg relative">
      <p v-if="cargandoPacientes" class="text-xs text-slate-500 px-3 py-2 bg-slate-50 border-b border-slate-100">
        Buscando en el servidor…
      </p>
      <table class="min-w-full text-xs tabla-pacientes">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">T. doc.</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Documento</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. nac.</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap min-w-[140px]">Paciente</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Sexo</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Grado</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Etiol. general</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Etiol. específica</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap min-w-[180px]">Comorbilidades</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Mod. TRR</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. creac. acceso</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Tipo acceso</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Localización</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. inicio TRR</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Subsistema</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. 1er ingreso</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Hosp. proced.</th>
            <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Condición</th>
            <th v-if="mostrarAprobacion" class="text-left px-2 py-2 font-semibold whitespace-nowrap">Estado</th>
            <th v-if="mostrarAcciones" class="text-left px-2 py-2 font-semibold whitespace-nowrap sticky right-0 bg-slate-100">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in pacientesPaginados"
            :key="row.id_paciente_dialisis ?? `at-${row.id_paciente_atencion}`"
            class="border-t border-slate-100 hover:bg-slate-50 group"
          >
            <td class="px-2 py-2">{{ celda(row.datosPaciente?.tipo_documento) }}</td>
            <td class="px-2 py-2 font-mono">{{ celda(row.datosPaciente?.documento) }}</td>
            <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.datosPaciente?.fecha_nacimiento) }}</td>
            <td class="px-2 py-2 whitespace-nowrap">
              <span :title="celda(row.datosPaciente?.paciente)">{{ celda(row.datosPaciente?.paciente) }}</span>
              <span
                v-if="row.sin_registro_dialisis"
                class="ml-1 inline text-[10px] font-semibold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded align-middle"
                title="Tiene atención en el periodo pero aún no tiene ficha en diálisis"
              >Sin ficha diálisis</span>
            </td>
            <td class="px-2 py-2 whitespace-nowrap">{{ generoTexto(row.datosPaciente?.genero) }}</td>
            <td class="px-2 py-2 max-w-[90px] truncate" :title="row.datosPaciente?.grado_instruccion">{{ celda(row.datosPaciente?.grado_instruccion) }}</td>
            <td class="px-2 py-2 max-w-[120px] truncate" :title="etiologiaGeneralTexto(row)">{{ etiologiaGeneralTexto(row) }}</td>
            <td class="px-2 py-2 max-w-[140px] truncate" :title="etiologiaEspecificaTexto(row)">{{ etiologiaEspecificaTexto(row) }}</td>
            <td class="px-2 py-2 min-w-[180px] max-w-[320px] whitespace-normal align-top" :title="comorbilidadesTexto(row)">{{ comorbilidadesTexto(row) }}</td>
            <td class="px-2 py-2 max-w-[110px] truncate" :title="row.modalidad_inicio_trr">{{ celda(row.modalidad_inicio_trr) }}</td>
            <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_creacion_acceso) }}</td>
            <td class="px-2 py-2 max-w-[130px] truncate" :title="tipoAccesoTexto(row.tipo_acceso)">{{ tipoAccesoTexto(row.tipo_acceso) }}</td>
            <td class="px-2 py-2 max-w-[130px] truncate" :title="row.localizacion_acceso_inicio">{{ celda(row.localizacion_acceso_inicio) }}</td>
            <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_inicio_trr) }}</td>
            <td class="px-2 py-2 max-w-[100px] truncate" :title="row.subsistema_salud">{{ celda(row.subsistema_salud) }}</td>
            <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_primer_ingreso) }}</td>
            <td class="px-2 py-2 max-w-[120px] truncate" :title="row.hospital_procedencia_trr">{{ celda(row.hospital_procedencia_trr) }}</td>
            <td class="px-2 py-2 whitespace-nowrap">
              <span
                class="inline-flex text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded"
                :class="claseCondicionPaciente(row)"
              >{{ condicionPacienteTexto(row) }}</span>
            </td>
            <td v-if="mostrarAprobacion" class="px-2 py-2 whitespace-nowrap">
              <span
                class="inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                :class="claseEstadoAprobacion(row)"
              >{{ textoEstadoAprobacion(row) }}</span>
            </td>
            <td v-if="mostrarAcciones" class="px-2 py-2 sticky right-0 bg-white group-hover:bg-slate-50">
              <div class="flex flex-wrap gap-1 items-center">
                <button
                  type="button"
                  class="text-xs px-2 py-0.5 rounded bg-violet-100 text-violet-900 hover:bg-violet-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="row.sin_registro_dialisis || !row.id_paciente_dialisis"
                  :title="row.sin_registro_dialisis ? 'Sin ficha de diálisis: complete el registro antes de editar' : 'Editar datos del paciente y ficha de diálisis'"
                  @click="abrirEdicionSupervisor(row)"
                >
                  Editar
                </button>
                <button
                  v-if="mostrarAprobacion && mostrarBotonAprobar(row)"
                  type="button"
                  class="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-semibold disabled:opacity-40"
                  :disabled="aprobandoId === row.id_paciente_atencion"
                  @click="aprobarPaciente(row)"
                >
                  {{ aprobandoId === row.id_paciente_atencion ? '…' : 'Aprobar' }}
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!pacientes.length">
            <td :colspan="columnasTabla" class="px-3 py-8 text-center text-gray-500">
              No hay pacientes con atención en esta clínica y periodo
              <span v-if="filtroNombre.trim() || filtroDni.trim()"> (pruebe otro filtro)</span>.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pacientes.length" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 text-sm border-t border-slate-100 pt-3">
      <div class="flex flex-wrap items-center gap-3 text-slate-600">
        <span>{{ rangoPacientesLabel }}</span>
        <label class="inline-flex items-center gap-2 text-xs text-slate-600">
          <span>Por página</span>
          <select
            v-model.number="pacientesPorPagina"
            class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </label>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium"
          :disabled="paginaActual <= 1"
          @click="paginaActual = 1"
        >
          Primera
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium"
          :disabled="paginaActual <= 1"
          @click="paginaActual--"
        >
          Anterior
        </button>
        <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaActual }} / {{ totalPaginas }}</span>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium"
          :disabled="paginaActual >= totalPaginas"
          @click="paginaActual++"
        >
          Siguiente
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium"
          :disabled="paginaActual >= totalPaginas"
          @click="paginaActual = totalPaginas"
        >
          Última
        </button>
      </div>
    </div>

    <div v-if="mostrarModalEdicionSupervisor" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <FormularioPaciente
          :key="claveModalFormularioPaciente"
          :periodo-inicial="periodoSeleccionado"
          :id-periodo-ipress-inicial="idPeriodoIpress"
          :id-clinica-inicial="idClinicaSeleccionada"
          :nombre-clinica-inicial="clinicaSeleccionada"
          :mostrar-tabla-edicion="false"
          numero-documento-inicial=""
          :id-paciente-edicion-supervisor="filaEdicionSupervisor?.datosPaciente?.id_paciente ?? null"
          :id-paciente-dialisis-edicion-supervisor="filaEdicionSupervisor?.id_paciente_dialisis ?? null"
          @cancelar="cerrarModalFormularioPaciente"
          @guardado="onGuardadoFormularioPaciente"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted } from 'vue';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import { ElMessage, ElMessageBox } from 'element-plus';
import { tipoAccesoDesdeDb } from '@/utils/unidadesActualesPayload';
import { fechaCelda } from '@/utils/fechaFormat';
import FormularioPaciente from '@/pages/inicio/FormularioPaciente.vue';

const props = defineProps({
  mostrarAcciones: { type: Boolean, default: true },
  mostrarAprobacion: { type: Boolean, default: false },
});

const LISTA_TIPOS_ACCESO = [
  { id: '1', label: 'Catéter Venoso Central Temporal' },
  { id: '2', label: 'Catéter Venoso Central de Larga Permanencia' },
  { id: '3', label: 'Fístula Arteriovenosa' },
  { id: '4', label: 'Injerto Autólogo' },
  { id: '5', label: 'Injerto Protésico' },
  { id: '6', label: 'Catéter peritoneal' },
];

const COMORBILIDADES_CAMPOS = [
  ['enf_insuficiencia_cardiaca_congestiva', 'Insuficiencia cardiaca congestiva'],
  ['enf_diabetes', 'Diabetes'],
  ['enf_ateroesclerotica_cardiaca', 'Aterosclerosis cardíaca'],
  ['enf_hipertension', 'Hipertensión'],
  ['enf_vascular_periferica', 'Enfermedad vascular periférica'],
  ['enf_tuberculosis', 'Tuberculosis'],
  ['enf_cerebro_vascular', 'Accidente cerebrovascular'],
  ['enf_cancer', 'Cáncer'],
  ['enf_otra', 'Otra'],
];

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const filtroNombre = ref('');
const filtroDni = ref('');
const cargandoPacientes = ref(false);
let debounceFiltrosTimer = null;

const pacientes = ref([]);
const paginaActual = ref(1);
const pacientesPorPagina = ref(10);

const idPeriodo = ref(null);
const idIpress = ref(null);
const idPeriodoIpress = ref(null);
const idClinicaSeleccionada = ref(null);
const periodoSeleccionado = ref(null);
const clinicaSeleccionada = ref('');

const mostrarModalEdicionSupervisor = ref(false);
const filaEdicionSupervisor = ref(null);
const aprobandoId = ref(null);
const aprobandoTodos = ref(false);

const columnasTabla = computed(() => {
  let n = 18;
  if (props.mostrarAprobacion) n += 1;
  if (props.mostrarAcciones) n += 1;
  return n;
});

const pacientesFiltrados = computed(() => pacientes.value);

const pendientesAprobacion = computed(() =>
  pacientesFiltrados.value.filter((row) => mostrarBotonAprobar(row)),
);

const totalPaginas = computed(() => {
  const n = pacientesFiltrados.value.length;
  const pp = Number(pacientesPorPagina.value) || 10;
  return Math.max(1, Math.ceil(n / pp));
});

const pacientesPaginados = computed(() => {
  const pp = Number(pacientesPorPagina.value) || 10;
  const inicio = (paginaActual.value - 1) * pp;
  return pacientesFiltrados.value.slice(inicio, inicio + pp);
});

const rangoPacientesLabel = computed(() => {
  const total = pacientesFiltrados.value.length;
  if (total === 0) return 'Sin registros';
  const pp = Number(pacientesPorPagina.value) || 10;
  const ini = (paginaActual.value - 1) * pp + 1;
  const fin = Math.min(paginaActual.value * pp, total);
  return `Mostrando ${ini}–${fin} de ${total}`;
});

const claveModalFormularioPaciente = computed(() => {
  if (filaEdicionSupervisor.value) {
    const idp = filaEdicionSupervisor.value?.datosPaciente?.id_paciente ?? 'x';
    const idd = filaEdicionSupervisor.value?.id_paciente_dialisis ?? 'x';
    return `ed-sup-${idp}-${idd}`;
  }
  return 'vacío';
});

function celda(val) {
  const s = val != null && String(val).trim() !== '' ? String(val).trim() : '';
  return s || '—';
}

function esSiComorb(v) {
  const s = String(v || '').trim().toLowerCase();
  return s === 'sí' || s === 'si' || s === 's';
}

function tipoAccesoTexto(valor) {
  if (valor == null || String(valor).trim() === '') return '—';
  const texto = String(valor).trim();
  const desdeDb = tipoAccesoDesdeDb(texto);
  const found = LISTA_TIPOS_ACCESO.find(
    (t) => String(t.id) === texto || t.label === texto || t.label === desdeDb,
  );
  return found?.label || desdeDb || texto;
}

function generoTexto(g) {
  const u = String(g || '').trim().toUpperCase();
  if (u === 'M' || u.startsWith('MASC')) return 'M';
  if (u === 'F' || u.startsWith('FEM')) return 'F';
  return celda(g);
}

function comorbilidadesTexto(row) {
  const items = COMORBILIDADES_CAMPOS.filter(([campo]) => esSiComorb(row?.[campo])).map(([, label]) => label);
  return items.length ? items.join(', ') : '—';
}

function etiologiaGeneralTexto(row) {
  return celda(row?.datosEti?.general);
}

function etiologiaEspecificaTexto(row) {
  const e = row?.datosEti;
  if (!e) return '—';
  return celda(e.especifica || e.codigo);
}

function condicionPacienteTexto(row) {
  const at = row?.datosPacienteAtencion;
  const estado = String(
    row?.estado_atencion ?? at?.estado ?? row?.estado ?? row?.datosPaciente?.estado ?? '',
  ).trim().toUpperCase();
  const tipo = String(row?.tipo_atencion ?? at?.tipo_atencion ?? '').trim().toUpperCase();
  if (estado === 'EGRESADO' || tipo === 'EGRESO') return 'Egresado';
  if (tipo.includes('REINGRESO')) return 'Reingresado';
  if (tipo === 'NUEVO' || estado === 'NUEVO') return 'Nuevo';
  if (tipo === 'CONTINUADOR') return 'Continuador';
  if (estado === 'ACTIVO' && !tipo) return 'En atención';
  if (tipo) return tipo.charAt(0) + tipo.slice(1).toLowerCase();
  return '—';
}

function enriquecerFilasConAtencion(filas, atenciones) {
  const porPaciente = new Map();
  const porAtencion = new Map();
  (Array.isArray(atenciones) ? atenciones : []).forEach((a) => {
    const pid = a.id_paciente ?? a.datosPaciente?.id_paciente;
    if (pid != null) porPaciente.set(String(pid), a);
    if (a.id_paciente_atencion != null) {
      porAtencion.set(String(a.id_paciente_atencion), a);
    }
  });
  return (Array.isArray(filas) ? filas : []).map((row) => {
    let at = row.id_paciente_atencion != null
      ? porAtencion.get(String(row.id_paciente_atencion))
      : null;
    if (!at) {
      const pid = row.id_paciente ?? row.datosPaciente?.id_paciente;
      if (pid != null) at = porPaciente.get(String(pid));
    }
    if (!at) return row;
    return {
      ...row,
      id_paciente_atencion: row.id_paciente_atencion ?? at.id_paciente_atencion,
      tipo_atencion: row.tipo_atencion ?? at.tipo_atencion,
      estado_atencion: row.estado_atencion ?? at.estado,
      estado_aprobacion: row.estado_aprobacion ?? at.estado_aprobacion ?? 'PENDIENTE',
      datosPacienteAtencion: row.datosPacienteAtencion ?? at,
    };
  });
}

function textoEstadoAprobacion(row) {
  if (row?.sin_registro_dialisis || !row?.id_paciente_dialisis) return 'SIN REGISTRO';
  const estado = String(row?.estado_aprobacion ?? 'PENDIENTE').trim().toUpperCase();
  return estado || 'PENDIENTE';
}

function claseEstadoAprobacion(row) {
  const estado = textoEstadoAprobacion(row);
  if (estado === 'SIN REGISTRO') return 'bg-slate-100 text-slate-600';
  if (estado === 'APROBADO') return 'bg-emerald-100 text-emerald-800';
  return 'bg-amber-100 text-amber-800';
}

function mostrarBotonAprobar(row) {
  if (row?.sin_registro_dialisis || !row?.id_paciente_dialisis) return false;
  if (!row?.id_paciente_atencion) return false;
  return textoEstadoAprobacion(row) !== 'APROBADO';
}

async function aprobarPaciente(row) {
  const id = row?.id_paciente_atencion;
  if (!id || !mostrarBotonAprobar(row)) return;
  aprobandoId.value = id;
  try {
    await postAllIpress(`/pacienteAtencion/${id}/evaluar/`, { estado_aprobacion: 'APROBADO' });
    ElMessage.success('Paciente aprobado correctamente.');
    await fetchPacientes();
  } catch (e) {
    const msg = e?.detail || e?.error || e?.response?.data?.detail || e?.message || 'No se pudo aprobar el registro.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo aprobar el registro.');
  } finally {
    aprobandoId.value = null;
  }
}

async function aprobarTodosPendientes() {
  const pendientes = pendientesAprobacion.value;
  if (!pendientes.length) return;
  try {
    await ElMessageBox.confirm(
      `¿Aprobar ${pendientes.length} paciente(s) pendiente(s) de revisión?`,
      'Aprobar todos',
      { type: 'info', confirmButtonText: 'Aprobar todos', cancelButtonText: 'Cancelar' },
    );
  } catch {
    return;
  }
  aprobandoTodos.value = true;
  let ok = 0;
  let fail = 0;
  for (const row of pendientes) {
    const id = row?.id_paciente_atencion;
    if (!id) {
      fail += 1;
      continue;
    }
    try {
      await postAllIpress(`/pacienteAtencion/${id}/evaluar/`, { estado_aprobacion: 'APROBADO' });
      ok += 1;
    } catch {
      fail += 1;
    }
  }
  aprobandoTodos.value = false;
  if (ok) ElMessage.success(`Se aprobaron ${ok} paciente(s).`);
  if (fail) ElMessage.warning(`No se pudieron aprobar ${fail} paciente(s).`);
  await fetchPacientes();
}

function claseCondicionPaciente(row) {
  const texto = condicionPacienteTexto(row).toUpperCase();
  if (texto === 'EGRESADO') return 'bg-slate-200 text-slate-700';
  if (texto === 'REINGRESADO') return 'bg-amber-100 text-amber-800';
  if (texto === 'NUEVO') return 'bg-violet-100 text-violet-800';
  if (texto === 'CONTINUADOR' || texto === 'EN ATENCIÓN' || texto === 'EN ATENCION') {
    return 'bg-sky-100 text-sky-800';
  }
  return 'bg-slate-100 text-slate-600';
}

async function resolverContextoClinica() {
  idIpress.value = clinicaGlobal.value ?? null;
  idPeriodo.value = periodoGlobal.value ?? null;
  idClinicaSeleccionada.value = idIpress.value;
  periodoSeleccionado.value = idPeriodo.value;

  if (idPeriodo.value != null && idIpress.value != null) {
    try {
      const respuesta = await postAllIpress('/consulta_periodo_ipress/', {
        id_periodo: Number(idPeriodo.value),
        id_ipress: Number(idIpress.value),
        id_estado: 1,
      });
      const lista = Array.isArray(respuesta) ? respuesta : [];
      idPeriodoIpress.value = lista.length ? lista[0].id_periodo_ipress : null;
    } catch {
      idPeriodoIpress.value = null;
    }
    try {
      const todasIpress = await getAllIpress('/ipress/');
      const lista = Array.isArray(todasIpress) ? todasIpress : (todasIpress?.results || []);
      const clinicaActual = lista.find((item) => String(item.id_ipress) === String(idClinicaSeleccionada.value));
      clinicaSeleccionada.value = clinicaActual?.nombre_corto || clinicaActual?.ipress || '';
    } catch {
      clinicaSeleccionada.value = '';
    }
  } else {
    idPeriodoIpress.value = null;
    clinicaSeleccionada.value = '';
  }
}

async function fetchPacientes() {
  const ipressId = clinicaGlobal.value ?? idIpress.value;
  const periodoId = periodoGlobal.value ?? idPeriodo.value;
  if (ipressId == null || ipressId === '' || periodoId == null || periodoId === '') {
    pacientes.value = [];
    return;
  }
  cargandoPacientes.value = true;
  try {
    const params = new URLSearchParams({
      id_ipress: String(ipressId),
      id_periodo: String(periodoId),
    });
    const mod = modalidadGlobal.value;
    if (mod != null && mod !== '') {
      params.set('id_modalidad', String(mod));
    }
    const n = filtroNombre.value.trim();
    const d = filtroDni.value.trim();
    if (n) params.set('nombre', n);
    if (d) params.set('documento', d);
    const qs = params.toString();
    const paramsAtencion = new URLSearchParams({
      id_ipress: String(ipressId),
      id_periodo: String(periodoId),
    });
    if (mod != null && mod !== '') {
      paramsAtencion.set('id_modalidad', String(mod));
    }
    const [respuesta, resAtenciones] = await Promise.all([
      getAllIpress(`/listado_pacientes_dialisis_por_ipress_periodo/?${qs}`),
      getAllIpress(`/pacienteAtencion/?${paramsAtencion.toString()}`),
    ]);
    const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    const atenciones = Array.isArray(resAtenciones) ? resAtenciones : (resAtenciones?.results || []);
    pacientes.value = enriquecerFilasConAtencion(lista, atenciones);
  } catch (error) {
    console.error('Error al obtener lista de pacientes diálisis:', error);
    pacientes.value = [];
  } finally {
    cargandoPacientes.value = false;
  }
}

function aplicarFiltrosBusqueda() {
  const ipressId = clinicaGlobal.value ?? idIpress.value;
  const periodoId = periodoGlobal.value ?? idPeriodo.value;
  if (ipressId == null || ipressId === '' || periodoId == null || periodoId === '') return;

  paginaActual.value = 1;
  clearTimeout(debounceFiltrosTimer);
  debounceFiltrosTimer = setTimeout(() => {
    fetchPacientes();
  }, 350);
}

async function sincronizarDesdeFiltrosGlobales() {
  await resolverContextoClinica();
  await fetchPacientes();
}

function abrirEdicionSupervisor(row) {
  if (row?.sin_registro_dialisis || !row?.id_paciente_dialisis) return;
  filaEdicionSupervisor.value = row;
  mostrarModalEdicionSupervisor.value = true;
}

function cerrarModalFormularioPaciente() {
  mostrarModalEdicionSupervisor.value = false;
  filaEdicionSupervisor.value = null;
}

async function onGuardadoFormularioPaciente() {
  cerrarModalFormularioPaciente();
  await fetchPacientes();
}

watch(pacientes, () => {
  paginaActual.value = 1;
});

watch(pacientesPorPagina, () => {
  paginaActual.value = 1;
});

watch(totalPaginas, (tp) => {
  if (paginaActual.value > tp) paginaActual.value = tp;
});

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  sincronizarDesdeFiltrosGlobales();
}, { deep: true });

defineExpose({
  recargar: sincronizarDesdeFiltrosGlobales,
});

onMounted(() => {
  sincronizarDesdeFiltrosGlobales();
});
</script>
