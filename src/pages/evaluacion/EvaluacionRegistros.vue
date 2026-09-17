<template>
  <div class="min-h-screen bg-gray-50/50 p-4">
    <div class="w-full max-w-full mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-violet-500 rounded-full"></span>
          Evaluación de registros
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Revise los registros cargados por las clínicas: puede <strong>editar</strong> datos y dejar un comentario visible para la clínica; luego <strong>aprobar</strong>. Use el mismo periodo, IPRESS y modalidad de la barra superior.
        </p>
        <p class="text-xs text-slate-500 mt-2">
          <strong>Editar</strong> guarda correcciones y comentario del supervisor; <strong>Aprobar</strong> marca el registro como revisado favorablemente. Si aprueba todos los registros del módulo, el formulario se cierra solo. <strong>Observar</strong> deja un comentario y habilita únicamente ese registro para que la clínica lo corrija (también puede usarse tras una aprobación si hubo confusión).
        </p>
        <p class="text-xs text-slate-500 mt-1">
          En los formularios se listan <strong>todos los pacientes en atención</strong> del periodo, clínica y modalidad; si no hay registro en ese módulo, la fila aparece como <strong>SIN REGISTRO</strong> y puede <strong>Registrar</strong> los datos desde aquí.
        </p>
      </div>

      <div
        v-if="filtroListo && notificacionClinica.notificado"
        class="mb-4 rounded-xl border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-950 shadow-sm"
      >
        <p class="font-bold text-sky-900 flex items-center gap-2">
          <span class="inline-block h-2 w-2 rounded-full bg-sky-500 animate-pulse shrink-0" aria-hidden="true"></span>
          La clínica notificó que envía los registros a revisión
        </p>
        <p class="text-sky-900/90 mt-1.5">
          <template v-if="textoFechaNotificacion">Fecha: {{ textoFechaNotificacion }}</template>
          <template v-if="notificacionClinica.usuario_nombre">
            <span v-if="textoFechaNotificacion"> · </span>Notificado por: {{ notificacionClinica.usuario_nombre }}
          </template>
        </p>
      </div>

      <div class="flex flex-wrap gap-1 mb-4 border-b border-slate-200">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="modulo === tab.key ? 'bg-white text-violet-700 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="modulo = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="!filtroContenidoListo" class="p-12 text-center text-slate-500">
          Seleccione periodo, clínica y modalidad en la barra superior.
        </div>
        <div v-else-if="cargandoVistaActual" class="p-12 text-center text-slate-500">Cargando...</div>

        <template v-else>
        <div v-if="modulo === 'pacientes'" class="p-4">
          <TablaPacientesAtencion mostrar-aprobacion />
        </div>

        <div v-else-if="modulo === 'movimientos'" class="p-0">
          <MovimientosPage modo-evaluacion />
        </div>

        <template v-else-if="esModuloRegistros">
        <div
          v-if="mostrarBannerAbrir"
          class="px-4 py-3 border-b border-amber-100 bg-amber-50/90 flex flex-wrap items-center justify-between gap-3"
        >
          <p class="text-sm text-amber-950">
            El formulario de <strong>{{ etiquetaModuloActual }}</strong> está <strong>cerrado</strong> para este periodo, clínica y modalidad. Las clínicas no pueden registrar hasta que lo abra.
          </p>
          <button
            type="button"
            class="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            :disabled="abriendoFormulario"
            @click="confirmarAbrirFormulario"
          >
            {{ abriendoFormulario ? 'Abriendo…' : 'Abrir formulario' }}
          </button>
        </div>

        <div
          v-else-if="puedeCerrarFormulario"
          class="px-4 py-3 border-b border-emerald-100 bg-emerald-50/80 flex flex-wrap items-center justify-between gap-3"
        >
          <p class="text-sm text-emerald-900">
            <template v-if="sinRegistrosEnModulo">
              No hay registros ingresados en <strong>{{ etiquetaModuloActual }}</strong> para este periodo, clínica y modalidad. Puede cerrar el formulario igualmente.
            </template>
            <template v-else>
              Todos los registros visibles están <strong>aprobados</strong>. Puede cerrar el formulario para este periodo, clínica y modalidad.
            </template>
          </p>
          <button
            type="button"
            class="shrink-0 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
            :disabled="cerrandoFormulario"
            @click="confirmarCerrarFormulario"
          >
            {{ cerrandoFormulario ? 'Cerrando…' : 'Cerrar formulario' }}
          </button>
        </div>

        <div class="px-4 pt-4 pb-3 border-b border-slate-100">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h3 class="text-sm font-semibold text-slate-800">Registros de pacientes — {{ etiquetaModuloActual }}</h3>
              <p class="text-xs text-slate-500 mt-0.5">Todos los pacientes en atención; último registro por paciente cuando existe. Editar y Aprobar solo aplican si hay registro.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-if="pendientesAprobacion.length"
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold disabled:opacity-50"
                :disabled="aprobandoTodos"
                @click="aprobarTodosPendientes"
              >
                {{ aprobandoTodos ? 'Aprobando…' : `Aprobar todos (${pendientesAprobacion.length})` }}
              </button>
              <button
                type="button"
                class="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                :disabled="cargando"
                @click="cargarModuloActual"
              >
                {{ cargando ? 'Actualizando…' : 'Actualizar lista' }}
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <input
              v-model="filtroListadoNombre"
              type="text"
              placeholder="Filtrar por nombre…"
              class="flex-1 min-w-[160px] border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              v-model="filtroListadoDocumento"
              type="text"
              placeholder="Filtrar por documento…"
              class="flex-1 min-w-[140px] border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <p v-if="modulo === 'acceso'" class="text-[10px] text-amber-800 mt-2">
            Filas resaltadas en ámbar: acceso temporal (CVCT) o con más de 90 días desde su creación.
          </p>
        </div>

        <!-- Tabla unificada formularios 1–5 -->
        <div class="p-3">
          <div v-if="listaMostradaFiltrada.length === 0" class="py-10 text-center text-slate-500 text-[11px]">
            <template v-if="!listaPacientesAtencion.length">No hay pacientes en atención para este periodo, clínica y modalidad.</template>
            <template v-else>No hay resultados con el filtro actual.</template>
          </div>
          <template v-else>
            <div class="overflow-x-auto border border-slate-200 rounded-lg max-h-[min(32rem,70vh)] overflow-y-auto w-full">
              <table class="min-w-full text-[11px] leading-tight">
                <thead class="bg-slate-100 text-slate-700 sticky top-0 z-10">
                  <tr>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap">Documento</th>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap">Paciente</th>
                    <th
                      v-for="col in columnasDatosActuales"
                      :key="col.key"
                      class="text-left px-2 py-1.5 font-semibold whitespace-nowrap"
                    >{{ col.label }}</th>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap">Estado</th>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap">Evaluado por</th>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap">Edit. sup.</th>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap min-w-[100px]">Comentario</th>
                    <th class="text-left px-2 py-1.5 font-semibold whitespace-nowrap">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="r in listaMostradaPaginada"
                    :key="idFilaRegistro(r)"
                    class="border-t border-slate-100 hover:bg-slate-50"
                    :class="claseFilaEvaluacion(r)"
                    :title="modulo === 'acceso' ? motivoAccesoAntiguo(r) : ''"
                  >
                    <td class="px-2 py-1.5 font-mono text-[10px] whitespace-nowrap">{{ documentoPaciente(r) }}</td>
                    <td class="px-2 py-1.5 font-medium text-slate-800 whitespace-nowrap">{{ nombrePaciente(r) }}</td>
                    <td
                      v-for="col in columnasDatosActuales"
                      :key="`${idFilaRegistro(r)}-${col.key}`"
                      class="px-2 py-1.5 text-slate-600 whitespace-nowrap max-w-[140px] truncate"
                      :title="String(valorCeldaTabla(r, col) || '')"
                    >{{ valorCeldaTabla(r, col) }}</td>
                    <td class="px-2 py-1.5">
                      <span class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" :class="claseEstado(r.estado_aprobacion, r)">{{ textoEstadoAprobacion(r) }}</span>
                    </td>
                    <td class="px-2 py-1.5 text-slate-600 whitespace-nowrap">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                    <td class="px-2 py-1.5">
                      <span v-if="r.supervisor_edito_registro" class="rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-800">Sí</span>
                      <span v-else class="text-slate-400">—</span>
                    </td>
                    <td class="px-2 py-1.5 text-slate-600 max-w-[120px] truncate" :title="r.comentario_evaluacion || ''">{{ comentarioCorto(r.comentario_evaluacion, 40) }}</td>
                    <td class="px-2 py-1.5 whitespace-nowrap">
                      <div class="flex flex-wrap gap-1">
                        <button
                          type="button"
                          class="text-[10px] px-2 py-0.5 rounded bg-violet-100 text-violet-900 hover:bg-violet-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                          :title="r.sin_registro_modulo ? 'Registrar datos del paciente en este formulario' : 'Editar registro'"
                          @click="abrirModalEditar(modulo, r)"
                        >{{ r.sin_registro_modulo ? 'Registrar' : 'Editar' }}</button>
                        <button
                          v-if="mostrarBotonAprobar(r.estado_aprobacion, r)"
                          type="button"
                          class="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-semibold disabled:opacity-40"
                          :disabled="evaluando === claveFila(modulo, idFilaRegistro(r))"
                          :title="r.sin_registro_modulo ? 'Primero debe existir un registro en el módulo' : ''"
                          @click="evaluar(modulo, r, 'APROBADO')"
                        >Aprobar</button>
                        <button
                          v-if="mostrarBotonObservar(r)"
                          type="button"
                          class="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 font-semibold disabled:opacity-40"
                          :disabled="evaluando === claveFila(modulo, idFilaRegistro(r))"
                          :title="tituloBotonObservar(r)"
                          @click="observarRegistro(modulo, r)"
                        >Observar</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <TablaPaginacion v-model:page="paginaRegistros" v-model:page-size="pageSizeTablas" :total="listaMostradaFiltrada.length" />
          </template>
        </div>
        </template>
        </template>
      </div>

      <div
        v-if="mostrarModalFormulario"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="cerrarModalFormulario"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
          <div class="bg-violet-600 px-6 py-4 flex justify-between items-center shrink-0">
            <h3 class="font-bold text-white">{{ tituloModalFormulario }}</h3>
            <button type="button" class="text-white/80 hover:text-white text-lg leading-none" aria-label="Cerrar" @click="cerrarModalFormulario">✕</button>
          </div>
          <div class="p-4 overflow-y-auto flex-1">
            <Form2Hemodialisis
              v-if="moduloFormulario === 'acceso'"
              :key="`acceso-${formModalKey}`"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumeroForm"
              :periodo-ipress="idPeriodoIpressForm || 0"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              modo-supervisor
              @cancelar="cerrarModalFormulario"
              @guardado="onGuardadoFormulario"
            />
            <Form3Hemodialisis
              v-else-if="moduloFormulario === 'eventos'"
              :key="`eventos-${formModalKey}`"
              :paciente="pacienteParaFormulario"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              modo-supervisor
              @cancelar="cerrarModalFormulario"
              @guardado="onGuardadoFormulario"
            />
            <Form4
              v-else-if="moduloFormulario === 'morbilidad'"
              :key="`morbilidad-${formModalKey}`"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumeroForm"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              modo-supervisor
              @cancelar="cerrarModalFormulario"
              @guardado="onGuardadoFormulario"
            />
            <Form5
              v-else-if="moduloFormulario === 'resultados'"
              :key="`resultados-${formModalKey}`"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumeroForm"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              :clinica-nombre="clinicaActualTexto"
              :periodo-label="periodoActualTexto"
              modo-supervisor
              @cancelar="cerrarModalFormulario"
              @guardado="onGuardadoFormulario"
            />
            <Form7
              v-else-if="moduloFormulario === 'vacunacion'"
              :key="`vacunacion-${formModalKey}`"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumeroForm"
              :id-periodo-ipress="idPeriodoIpressForm"
              :id-red="1"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              :clinica-nombre="clinicaActualTexto"
              :periodo-label="periodoActualTexto"
              modo-supervisor
              @cancelar="cerrarModalFormulario"
              @guardado="onGuardadoFormulario"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllIpress, postAllIpress, patchAllIpress } from '@/services/ipress/Ipress.service';
import { ElMessage, ElMessageBox } from 'element-plus';
import TablaPaginacion from '@/components/TablaPaginacion.vue';
import TablaPacientesAtencion from '@/components/pacientes/TablaPacientesAtencion.vue';
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue';
import Form3Hemodialisis from '@/components/forms/typesForm3/Form3Hemodialisis.vue';
import Form4 from '@/components/forms/Form4.vue';
import Form5 from '@/components/forms/Form5.vue';
import Form7 from '@/components/forms/Form7.vue';
import MovimientosPage from '@/pages/movimientos/movimientos.vue';
import {
  claseFilaAccesoAntiguo,
  esAccesoVascularAntiguo,
  motivoAccesoAntiguo,
  idsAccesosMasAntiguosPorPaciente,
} from '@/utils/accesoVascularValidacion';
import { atencionesParaListadoRegistros } from '@/composables/useAtencionesRegistro';
import { formatFechaHoraDDMMAAAA, fechaCelda } from '@/utils/fechaFormat';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const router = useRouter();

const tabs = [
  { key: 'pacientes', label: 'Pacientes' },
  { key: 'acceso', label: 'Acceso Vascular' },
  { key: 'eventos', label: 'Eventos Infecciosos' },
  { key: 'morbilidad', label: 'Morbilidad Hospitalaria' },
  { key: 'resultados', label: 'Resultados Clínicos' },
  { key: 'vacunacion', label: 'Vacunación' },
  { key: 'movimientos', label: 'Movimientos' },
];

const modulo = ref('pacientes');
const cargando = ref(false);
const evaluando = ref(null);
const aprobandoTodos = ref(false);
const cerrandoFormulario = ref(false);
const abriendoFormulario = ref(false);
/** null = aún no consultado; true/false según rf_estado_formulario_periodo */
const formularioEstaAbierto = ref(null);
const cargandoEstadoFormulario = ref(false);

const listaAcceso = ref([]);
const listaEventos = ref([]);
const listaMorbilidad = ref([]);
const listaResultados = ref([]);
const listaVacunacion = ref([]);
const listaPacientesAtencion = ref([]);

const paginaRegistros = ref(1);
const pageSizeTablas = ref(15);
const filtroListadoNombre = ref('');
const filtroListadoDocumento = ref('');

/** Aviso cuando la clínica usó «Notificar» en los módulos de registros. */
const notificacionClinica = ref({
  notificado: false,
  notificado_en: null,
  usuario_nombre: null,
});

const textoFechaNotificacion = computed(() => {
  const iso = notificacionClinica.value?.notificado_en;
  if (!iso) return '';
  const f = formatFechaHoraDDMMAAAA(iso);
  return f === '—' ? String(iso) : f;
});

async function fetchNotificacionEnvioRevision() {
  if (!filtroListo.value) {
    notificacionClinica.value = { notificado: false, notificado_en: null, usuario_nombre: null };
    return;
  }
  try {
    const qs = buildQs();
    const r = await getAllIpress(`/consulta_notificacion_envio_revision/?${qs}`);
    notificacionClinica.value = {
      notificado: !!r?.notificado,
      notificado_en: r?.notificado_en ?? null,
      usuario_nombre: r?.usuario_nombre ?? null,
    };
  } catch (e) {
    console.error(e);
    notificacionClinica.value = { notificado: false, notificado_en: null, usuario_nombre: null };
  }
}

function onNotificacionRevisionEvent() {
  fetchNotificacionEnvioRevision();
}

const mostrarModalFormulario = ref(false);
const moduloFormulario = ref('acceso');
const registroEdicion = ref(null);
const pacienteParaFormulario = ref(null);
const idPacienteAtencionParaForm = ref(null);
const idPeriodoIpressForm = ref(null);
const formModalKey = ref(0);
const periodosLista = ref([]);
const ipressLista = ref([]);

const periodoNumeroForm = computed(() => {
  const v = periodoGlobal.value;
  if (v == null || v === '') return 0;
  return Number(v);
});

const periodoActualTexto = computed(() => {
  const id = periodoGlobal.value;
  if (id == null) return '';
  const item = periodosLista.value.find((p) => String(p.id_periodo) === String(id));
  return item?.periodo || '';
});

const clinicaActualTexto = computed(() => {
  const id = clinicaGlobal.value;
  if (id == null) return '';
  const item = ipressLista.value.find((i) => String(i.id_ipress) === String(id));
  return item?.nombre_corto || item?.ipress || '';
});

const tituloModalFormulario = computed(() => {
  const labels = {
    acceso: 'Editar acceso vascular',
    eventos: 'Editar evento infeccioso',
    morbilidad: 'Editar morbilidad hospitalaria',
    resultados: 'Editar resultados clínicos',
    vacunacion: 'Editar vacunación',
  };
  return labels[moduloFormulario.value] || 'Editar registro';
});

function pacienteDesdeRegistro(registro) {
  return registro?.datosPacienteAtencion?.datosPaciente
    || registro?.datosPaciente
    || null;
}

function idAtencionDesdeRegistro(registro) {
  return registro?.id_paciente_atencion
    ?? registro?.datosPacienteAtencion?.id_paciente_atencion
    ?? null;
}

async function resolverIdPeriodoIpressForm() {
  if (!periodoGlobal.value || !clinicaGlobal.value) {
    idPeriodoIpressForm.value = null;
    return;
  }
  try {
    const resp = await postAllIpress('/consulta_periodo_ipress/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_estado: 1,
    });
    const lista = Array.isArray(resp) ? resp : [];
    idPeriodoIpressForm.value = lista.length ? lista[0].id_periodo_ipress : null;
  } catch {
    idPeriodoIpressForm.value = null;
  }
}

async function abrirModalEditar(mod, row) {
  const paciente = pacienteDesdeRegistro(row);
  const idAtencion = idAtencionDesdeRegistro(row);
  if (!paciente || idAtencion == null) {
    ElMessage.error('No se pudo cargar el paciente del registro.');
    return;
  }

  // Sin registro en el módulo: abrir formulario vacío para que el supervisor lo cree.
  if (row?.sin_registro_modulo) {
    moduloFormulario.value = mod;
    registroEdicion.value = null;
    pacienteParaFormulario.value = paciente;
    idPacienteAtencionParaForm.value = idAtencion;
    formModalKey.value += 1;
    await resolverIdPeriodoIpressForm();
    mostrarModalFormulario.value = true;
    return;
  }

  const cfg = ENDPOINTS[mod];
  let registro = row;
  if (cfg?.path && row?.[cfg.idKey] != null) {
    try {
      const full = await getAllIpress(`/${cfg.path}/${row[cfg.idKey]}/`);
      registro = full && typeof full === 'object' ? full : row;
    } catch (e) {
      console.warn('No se pudo recargar el registro completo; se usa la fila de la tabla.', e);
    }
  }

  moduloFormulario.value = mod;
  registroEdicion.value = registro;
  pacienteParaFormulario.value = pacienteDesdeRegistro(registro) || paciente;
  idPacienteAtencionParaForm.value = idAtencionDesdeRegistro(registro) ?? idAtencion;
  formModalKey.value += 1;
  await resolverIdPeriodoIpressForm();
  mostrarModalFormulario.value = true;
}

function cerrarModalFormulario() {
  mostrarModalFormulario.value = false;
  registroEdicion.value = null;
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
}

async function onGuardadoFormulario() {
  cerrarModalFormulario();
  await cargarModuloActual();
}

const CAMPOS_EDICION = {
  acceso: [
    { key: 'tipo_acceso', label: 'Tipo acceso' },
    { key: 'localizacion_acceso', label: 'Localización' },
    { key: 'fecha_creacion_acceso', label: 'Fecha creación acceso' },
    { key: 'motivo_cambio', label: 'Motivo cambio' },
  ],
  eventos: [
    { key: 'tipo_infeccion', label: 'Tipo infección' },
    { key: 'fecha_evento', label: 'Fecha evento' },
    { key: 'antmicrobial', label: 'Antimicrobial' },
    { key: 'vancomicina', label: 'Vancomicina' },
    { key: 'hemocultivo_positivo', label: 'Hemocultivo positivo' },
    { key: 'germen', label: 'Germen' },
  ],
  morbilidad: [
    { key: 'diagnostico', label: 'Diagnóstico' },
    { key: 'codigo_diagnostico', label: 'Código diagnóstico' },
    { key: 'fecha_hospitalizacion', label: 'Fecha hospitalización' },
    { key: 'fecha_alta_hospitalizacion', label: 'Fecha alta' },
    { key: 'desenlace', label: 'Desenlace' },
    { key: 'fecha_fallecimiento', label: 'Fecha fallecimiento' },
    { key: 'causa_muerte', label: 'Causa de muerte' },
    { key: 'fuente', label: 'Fuente' },
  ],
  resultados: [
    { key: 'Hb', label: 'Hb' },
    { key: 'calcio', label: 'Calcio' },
    { key: 'fosforo', label: 'Fósforo' },
    { key: 'PTHi', label: 'PTHi' },
    { key: 'Alb', label: 'Albúmina' },
    { key: 'calcio_corregido', label: 'Calcio corregido' },
    { key: 'ktv', label: 'Kt/V' },
    { key: 'tiempo_dialisis', label: 'Tiempo diálisis' },
    { key: 'eritoproyetina', label: 'Eritropoyetina', type: 'bool' },
    { key: 'hierro', label: 'Hierro', type: 'bool' },
    { key: 'calcitriol', label: 'Calcitriol', type: 'bool' },
  ],
  vacunacion: [
    { key: 'vhb', label: 'VHB' },
    { key: 'fecha_vhb', label: 'Fecha VHB' },
    { key: 'antiHbc', label: 'Anti-HBc' },
    { key: 'fecha_antiHbc', label: 'Fecha anti-HBc' },
    { key: 'vhc', label: 'VHC' },
    { key: 'fecha_vhc', label: 'Fecha VHC' },
    { key: 'vih', label: 'VIH' },
    { key: 'fecha_vih', label: 'Fecha VIH' },
    { key: 'titulo_acHbs', label: 'Título AcHBs' },
    { key: 'estado_acHbs', label: 'Estado AcHBs' },
    { key: 'fecha_titulo_acHbs', label: 'Fecha título AcHBs' },
    { key: 'dosis_hepatitis_b', label: 'Dosis hepatitis B' },
    { key: 'fecha_hepatitis_b', label: 'Fecha hepatitis B' },
    { key: 'dosis_covid', label: 'Dosis Covid' },
    { key: 'fecha_covid', label: 'Fecha Covid' },
    { key: 'fecha_influenza', label: 'Fecha influenza' },
    { key: 'fecha_neumococo', label: 'Fecha neumococo' },
  ],
};

const MODULOS_REGISTROS = ['acceso', 'eventos', 'morbilidad', 'resultados', 'vacunacion'];

const esModuloRegistros = computed(() => MODULOS_REGISTROS.includes(modulo.value));

const columnasDatosActuales = computed(() => CAMPOS_EDICION[modulo.value] || []);

const accesosMasAntiguosIds = computed(() => {
  if (modulo.value !== 'acceso') return new Set();
  return idsAccesosMasAntiguosPorPaciente(rawListaPorModulo('acceso'), ENDPOINTS.acceso.idKey);
});

function idFilaRegistro(r) {
  const cfg = ENDPOINTS[modulo.value];
  const id = cfg ? r?.[cfg.idKey] : null;
  if (id != null) return id;
  const aid = idAtencionDesdeRegistro(r);
  if (aid != null) return `at-${aid}`;
  return `doc-${documentoPaciente(r)}`;
}

function valorCeldaTabla(r, col) {
  const raw = r[col.key];
  if (col.type === 'bool') {
    if (raw === true || raw === 1 || raw === '1' || String(raw).toLowerCase() === 'true') return 'Sí';
    if (raw === false || raw === 0 || raw === '0' || String(raw).toLowerCase() === 'false') return 'No';
    return raw != null && raw !== '' ? String(raw) : '—';
  }
  if (String(col.key || '').startsWith('fecha_') || col.type === 'date') {
    return fechaCelda(raw);
  }
  if (raw === 0 || raw === '0') return raw;
  return raw != null && raw !== '' ? raw : '—';
}

function claseFilaEvaluacion(r) {
  if (modulo.value !== 'acceso') return '';
  const cfg = ENDPOINTS.acceso;
  const id = r?.[cfg.idKey];
  if (id != null && accesosMasAntiguosIds.value.has(id)) {
    return claseFilaAccesoAntiguo(r);
  }
  if (esAccesoVascularAntiguo(r)) return claseFilaAccesoAntiguo(r);
  return '';
}

const pendientesAprobacion = computed(() =>
  listaMostradaFiltrada.value.filter((r) => mostrarBotonAprobar(r.estado_aprobacion, r)),
);

async function aprobarTodosPendientes() {
  const pendientes = pendientesAprobacion.value;
  if (!pendientes.length) return;
  try {
    await ElMessageBox.confirm(
      `¿Aprobar ${pendientes.length} registro(s) pendientes de «${etiquetaModuloActual.value}»?`,
      'Aprobar todos',
      { type: 'info', confirmButtonText: 'Aprobar todos', cancelButtonText: 'Cancelar' },
    );
  } catch {
    return;
  }
  aprobandoTodos.value = true;
  const mod = modulo.value;
  let ok = 0;
  let fail = 0;
  for (const r of pendientes) {
    try {
      const cfg = ENDPOINTS[mod];
      const id = r[cfg.idKey];
      if (id == null) continue;
      await postAllIpress(`/${cfg.path}/${id}/evaluar/`, { estado_aprobacion: 'APROBADO' });
      ok += 1;
    } catch {
      fail += 1;
    }
  }
  aprobandoTodos.value = false;
  if (ok) ElMessage.success(`Se aprobaron ${ok} registro(s).`);
  if (fail) ElMessage.warning(`No se pudieron aprobar ${fail} registro(s).`);
  await cargarModuloActual();
  await cerrarFormularioAutomaticoSiTodoAprobado();
}

const filtroListo = computed(() => {
  return (
    periodoGlobal.value != null &&
    periodoGlobal.value !== '' &&
    clinicaGlobal.value != null &&
    clinicaGlobal.value !== '' &&
    modalidadGlobal.value != null &&
    modalidadGlobal.value !== ''
  );
});

/** Todas las pestañas de evaluación requieren periodo + clínica + modalidad. */
const filtroContenidoListo = computed(() => filtroListo.value);

const cargandoVistaActual = computed(() => {
  if (modulo.value === 'pacientes' || modulo.value === 'movimientos') return false;
  return cargando.value;
});

function buildQs() {
  const params = new URLSearchParams();
  if (periodoGlobal.value != null && periodoGlobal.value !== '') params.set('id_periodo', periodoGlobal.value);
  if (clinicaGlobal.value != null && clinicaGlobal.value !== '') params.set('id_ipress', clinicaGlobal.value);
  if (modalidadGlobal.value != null && modalidadGlobal.value !== '') params.set('id_modalidad', modalidadGlobal.value);
  return params.toString();
}

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}

function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}

function registroConDatos(r) {
  return !r?.sin_registro_modulo;
}

function textoEstadoAprobacion(r) {
  if (r?.sin_registro_modulo) return 'SIN REGISTRO';
  return r?.estado_aprobacion || 'PENDIENTE';
}

function claseEstado(estado, row) {
  if (row?.sin_registro_modulo) return 'bg-slate-100 text-slate-600';
  const v = String(estado || '').toUpperCase();
  if (v === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (v === 'OBSERVADO') return 'bg-amber-100 text-amber-800';
  if (v === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
}

function comentarioCorto(text, max = 56) {
  const s = String(text || '').trim();
  if (!s) return '—';
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

function claveFila(mod, id) {
  return `${mod}-${id}`;
}

function resumenVacuna(r) {
  const parts = [r.vhb, r.dosis_covid, r.fecha_influenza].filter(Boolean);
  return parts.length ? parts.join(' · ') : '—';
}

/** Número de formulario (1–5) — alineado con ListaPacientes / rf_estado_formulario_periodo */
const ENDPOINTS = {
  acceso: { path: 'unidadesActuales', idKey: 'id_unidad_actual', idFormulario: 1 },
  eventos: { path: 'eventosAccesosVasculares', idKey: 'id_evento_acceso_vascular', idFormulario: 2 },
  morbilidad: { path: 'morbilidadesHospitalarias', idKey: 'id_morbilidad_hospitalaria', idFormulario: 3 },
  resultados: { path: 'resultadosClinicos', idKey: 'id_resultado_clinico', idFormulario: 4 },
  vacunacion: { path: 'vacunaciones', idKey: 'id_vacunacion', idFormulario: 5 },
};

function idPacienteAtencionDe(r) {
  const v = r?.id_paciente_atencion ?? r?.datosPacienteAtencion?.id_paciente_atencion;
  return v != null && v !== '' ? String(v) : null;
}

/**
 * Un registro por paciente: el de mayor PK (idKey).
 * No usamos fecha_evaluacion ni fechas de negocio para ordenar: un registro ya evaluado
 * tenía fecha_evaluacion y ganaba frente a uno nuevo sin evaluar (mostraba el primero/antiguo).
 */
function ultimosRegistrosPorPaciente(rows, idField) {
  const grupos = new Map();
  for (const r of rows) {
    const pid = idPacienteAtencionDe(r);
    const clave = pid ?? `doc:${documentoPaciente(r)}`;
    const rid = Number(r[idField]) || 0;
    if (!grupos.has(clave)) grupos.set(clave, r);
    else {
      const prev = grupos.get(clave);
      const prevId = Number(prev[idField]) || 0;
      if (rid > prevId) grupos.set(clave, r);
    }
  }
  return Array.from(grupos.values());
}

function filaSinRegistroDesdeAtencion(atencion) {
  return {
    id_paciente_atencion: atencion.id_paciente_atencion,
    datosPacienteAtencion: atencion,
    datosPaciente: atencion.datosPaciente ?? atencion.datosPacienteAtencion?.datosPaciente,
    estado_aprobacion: 'SIN REGISTRO',
    sin_registro_modulo: true,
  };
}

function combinarAtencionesConUltimosRegistros(atenciones, registros, idField) {
  const ultimos = ultimosRegistrosPorPaciente(registros, idField);
  const porAtencion = new Map();
  for (const r of ultimos) {
    const aid = idPacienteAtencionDe(r);
    if (aid) porAtencion.set(aid, r);
  }
  const filas = atenciones.map((a) => {
    const aid = String(a.id_paciente_atencion);
    return porAtencion.get(aid) ?? filaSinRegistroDesdeAtencion(a);
  });
  filas.sort((a, b) => nombrePaciente(a).localeCompare(nombrePaciente(b), 'es'));
  return filas;
}

function rawListaPorModulo(m) {
  switch (m) {
    case 'acceso':
      return listaAcceso.value;
    case 'eventos':
      return listaEventos.value;
    case 'morbilidad':
      return listaMorbilidad.value;
    case 'resultados':
      return listaResultados.value;
    case 'vacunacion':
      return listaVacunacion.value;
    default:
      return [];
  }
}

const listaMostrada = computed(() => {
  const cfg = ENDPOINTS[modulo.value];
  if (!cfg) return [];
  return combinarAtencionesConUltimosRegistros(
    listaPacientesAtencion.value,
    rawListaPorModulo(modulo.value),
    cfg.idKey,
  );
});

const listaMostradaFiltrada = computed(() => {
  const nombre = filtroListadoNombre.value.trim().toLowerCase();
  const doc = filtroListadoDocumento.value.trim().toLowerCase();
  let lista = listaMostrada.value;
  if (nombre) {
    lista = lista.filter((r) => nombrePaciente(r).toLowerCase().includes(nombre));
  }
  if (doc) {
    lista = lista.filter((r) => String(documentoPaciente(r)).toLowerCase().includes(doc));
  }
  return lista;
});

/** Paginación en cliente sobre filas ya deduplicadas (último registro por paciente). */
const listaMostradaPaginada = computed(() => {
  const all = listaMostradaFiltrada.value;
  const size = pageSizeTablas.value;
  const start = (paginaRegistros.value - 1) * size;
  return all.slice(start, start + size);
});

function clampPaginaRegistros() {
  const total = listaMostradaFiltrada.value.length;
  const size = pageSizeTablas.value;
  const maxP = Math.max(1, Math.ceil(total / size) || 1);
  if (paginaRegistros.value > maxP) paginaRegistros.value = maxP;
}

watch(listaMostradaFiltrada, clampPaginaRegistros, { deep: true });
watch(pageSizeTablas, clampPaginaRegistros);
watch([filtroListadoNombre, filtroListadoDocumento], () => {
  paginaRegistros.value = 1;
});

const etiquetaModuloActual = computed(() => {
  const t = tabs.find((x) => x.key === modulo.value);
  return t?.label || 'este formulario';
});

const registrosConDatosEnModulo = computed(() => listaMostrada.value.filter(registroConDatos));

const sinRegistrosEnModulo = computed(() => registrosConDatosEnModulo.value.length === 0);

const todosRegistrosVisiblesAprobados = computed(() => {
  const rows = registrosConDatosEnModulo.value;
  if (!rows.length) return false;
  return rows.every((r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO');
});

/** Formulario abierto y (sin registros en el módulo o todos los existentes aprobados) */
const puedeCerrarFormulario = computed(() => {
  if (!filtroListo.value || formularioEstaAbierto.value !== true) return false;
  if (sinRegistrosEnModulo.value) return true;
  return registrosConDatosEnModulo.value.every(
    (r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO',
  );
});

const mostrarBannerAbrir = computed(() => {
  return filtroListo.value && formularioEstaAbierto.value === false;
});

function mostrarBotonAprobar(estado, row) {
  // Vacío: se muestra (al clic se indica que debe registrar primero).
  if (row?.sin_registro_modulo) return true;
  return String(estado || '').toUpperCase() !== 'APROBADO';
}

function mostrarBotonObservar(row) {
  // Siempre disponible, incluso si ya está APROBADO (por si hubo confusión).
  return true;
}

function tituloBotonObservar(row) {
  if (row?.sin_registro_modulo) {
    return 'Primero debe existir un registro en el módulo';
  }
  if (String(row?.estado_aprobacion || '').toUpperCase() === 'APROBADO') {
    return 'Volver a observar (reabre el registro para la clínica)';
  }
  return 'Observar registro';
}

async function fetchEstadoFormularioActual() {
  if (!filtroListo.value || !esModuloRegistros.value) {
    formularioEstaAbierto.value = null;
    return;
  }
  cargandoEstadoFormulario.value = true;
  try {
    const cfg = ENDPOINTS[modulo.value];
    const res = await postAllIpress('/consulta_estado_formulario_moderno/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      numero_formulario: cfg.idFormulario,
    });
    formularioEstaAbierto.value = res?.abierto !== false;
  } catch (e) {
    console.error(e);
    formularioEstaAbierto.value = true;
  } finally {
    cargandoEstadoFormulario.value = false;
  }
}

async function confirmarAbrirFormulario() {
  try {
    await ElMessageBox.confirm(
      `Se abrirá el formulario «${etiquetaModuloActual.value}» para el periodo, clínica y modalidad seleccionados. Las clínicas podrán volver a registrar.`,
      '¿Abrir formulario?',
      { type: 'info', confirmButtonText: 'Sí, abrir', cancelButtonText: 'Cancelar' },
    );
  } catch {
    return;
  }
  abriendoFormulario.value = true;
  try {
    const cfg = ENDPOINTS[modulo.value];
    await postAllIpress('/cerrar_mes/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      id_formulario: cfg.idFormulario,
      estado: 1,
    });
    ElMessage.success('Formulario abierto correctamente.');
    await fetchEstadoFormularioActual();
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    const msg = e?.error || e?.response?.data?.error || e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo abrir el formulario.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo abrir el formulario.');
  } finally {
    abriendoFormulario.value = false;
  }
}

async function confirmarCerrarFormulario() {
  try {
    await ElMessageBox.confirm(
      'Se cerrará el formulario para el periodo, clínica y modalidad seleccionados. La clínica no podrá registrar hasta que se vuelva a abrir (estado 1 en gestión o vía API).',
      '¿Cerrar formulario?',
      { type: 'warning', confirmButtonText: 'Sí, cerrar', cancelButtonText: 'Cancelar' },
    );
  } catch {
    return;
  }
  cerrandoFormulario.value = true;
  try {
    const cfg = ENDPOINTS[modulo.value];
    await postAllIpress('/cerrar_mes/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      id_formulario: cfg.idFormulario,
      estado: 2,
    });
    ElMessage.success('Formulario cerrado correctamente.');
    await fetchEstadoFormularioActual();
    await cargarModuloActual();
    await redirigirANotificacionSiListoParaConformidad();
  } catch (e) {
    console.error(e);
    const msg = e?.error || e?.response?.data?.error || e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo cerrar el formulario.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo cerrar el formulario.');
  } finally {
    cerrandoFormulario.value = false;
  }
}

async function cargarModuloActual() {
  if (!filtroListo.value || !esModuloRegistros.value) {
    listaAcceso.value = [];
    listaEventos.value = [];
    listaMorbilidad.value = [];
    listaResultados.value = [];
    listaVacunacion.value = [];
    listaPacientesAtencion.value = [];
    return;
  }
  const qs = buildQs();
  const cfg = ENDPOINTS[modulo.value];
  cargando.value = true;
  try {
    const [resAtenciones, resModulo] = await Promise.all([
      getAllIpress(`/pacienteAtencion/?${qs}`),
      getAllIpress(`/${cfg.path}/?${qs}`),
    ]);
    listaPacientesAtencion.value = atencionesParaListadoRegistros(
      Array.isArray(resAtenciones) ? resAtenciones : resAtenciones?.results || [],
    );
    const data = Array.isArray(resModulo) ? resModulo : resModulo?.results || [];
    if (modulo.value === 'acceso') listaAcceso.value = data;
    else if (modulo.value === 'eventos') listaEventos.value = data;
    else if (modulo.value === 'morbilidad') listaMorbilidad.value = data;
    else if (modulo.value === 'resultados') listaResultados.value = data;
    else if (modulo.value === 'vacunacion') listaVacunacion.value = data;
  } catch (e) {
    console.error(e);
    ElMessage.error('Error al cargar los registros.');
  } finally {
    cargando.value = false;
  }
}

async function evaluar(mod, row, estadoAprobacion) {
  if (row?.sin_registro_modulo) {
    ElMessage.warning('Este paciente aún no tiene registro en el módulo. Use «Registrar» para crearlo y luego apruebe.');
    return;
  }
  const cfg = ENDPOINTS[mod];
  const id = row?.[cfg.idKey];
  if (id == null) {
    ElMessage.warning('No se encontró el identificador del registro.');
    return;
  }
  const key = claveFila(mod, id);
  evaluando.value = key;
  try {
    await postAllIpress(`/${cfg.path}/${id}/evaluar/`, { estado_aprobacion: estadoAprobacion });
    ElMessage.success('Registro aprobado.');
    await cargarModuloActual();
    await cerrarFormularioAutomaticoSiTodoAprobado();
  } catch (e) {
    console.error(e);
    ElMessage.error(e?.detail || e?.error || 'No se pudo actualizar el registro.');
  } finally {
    evaluando.value = null;
  }
}

async function observarRegistro(mod, row) {
  if (row?.sin_registro_modulo) {
    ElMessage.warning('Este paciente aún no tiene registro en el módulo. Use «Registrar» para crearlo y luego observe.');
    return;
  }
  const cfg = ENDPOINTS[mod];
  const id = row?.[cfg.idKey];
  if (id == null) {
    ElMessage.warning('No se encontró el identificador del registro.');
    return;
  }
  const yaAprobado = String(row?.estado_aprobacion || '').toUpperCase() === 'APROBADO';
  let comentario = '';
  try {
    const { value } = await ElMessageBox.prompt(
      yaAprobado
        ? `El registro de «${nombrePaciente(row)}» ya estaba aprobado. Indique la observación; quedará habilitado nuevamente para que la clínica lo corrija.`
        : `Indique la observación para «${nombrePaciente(row)}». Solo este registro quedará habilitado para que la clínica lo corrija.`,
      yaAprobado ? 'Volver a observar registro' : 'Observar registro',
      {
        type: 'warning',
        confirmButtonText: 'Enviar observación',
        cancelButtonText: 'Cancelar',
        inputType: 'textarea',
        inputPlaceholder: 'Describa qué debe corregir la clínica…',
        inputValidator: (v) => {
          if (!String(v || '').trim() || String(v).trim().length < 5) {
            return 'Ingrese al menos 5 caracteres.';
          }
          return true;
        },
      },
    );
    comentario = String(value || '').trim();
  } catch {
    return;
  }
  const key = claveFila(mod, id);
  evaluando.value = key;
  try {
    await postAllIpress(`/${cfg.path}/${id}/evaluar/`, {
      estado_aprobacion: 'OBSERVADO',
      comentario_evaluacion: comentario,
    }).catch(async (err) => {
      const msg = String(err?.detail || err?.error || err?.message || '').toLowerCase();
      const status = Number(err?.status || 0);
      const evaluarNoAceptaObservado =
        status === 400 || status === 404 || msg.includes('aprobado') || msg.includes('not found');
      if (!evaluarNoAceptaObservado) throw err;
      // QA u otros backends que aún no aceptan OBSERVADO en /evaluar/
      await patchAllIpress(`/${cfg.path}/${id}/`, {
        estado_aprobacion: 'OBSERVADO',
        comentario_evaluacion: comentario,
      });
    });
    ElMessage.success(
      yaAprobado
        ? 'Observación enviada. El registro vuelve a quedar habilitado para la clínica.'
        : 'Observación enviada. La clínica solo podrá editar este registro.',
    );
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    ElMessage.error(e?.detail || e?.error || 'No se pudo registrar la observación.');
  } finally {
    evaluando.value = null;
  }
}

/**
 * Si ya no quedan formularios con datos abiertos para la clínica/periodo/modalidad,
 * redirige a Notificación clínicas para dar la conformidad.
 */
async function redirigirANotificacionSiListoParaConformidad() {
  if (
    periodoGlobal.value == null || periodoGlobal.value === ''
    || clinicaGlobal.value == null || clinicaGlobal.value === ''
    || modalidadGlobal.value == null || modalidadGlobal.value === ''
  ) {
    return;
  }
  try {
    const params = new URLSearchParams({
      id_periodo: String(periodoGlobal.value),
      id_modalidad: String(modalidadGlobal.value),
    });
    const res = await getAllIpress(`/consulta_estado_pasar_pacientes_periodo/?${params.toString()}`);
    const info = res?.por_ipress?.[String(clinicaGlobal.value)];
    if (!info || typeof info !== 'object') return;
    if (info.ya_dio_conformidad) return;
    const abiertos = Array.isArray(info.formularios_con_datos_abiertos)
      ? info.formularios_con_datos_abiertos
      : [];
    if (abiertos.length > 0) return;

    ElMessage.success('Todos los formularios con datos están cerrados. Continúe con la conformidad.');
    await router.push({ name: 'NotificacionClinicas' });
  } catch (e) {
    console.warn('No se pudo verificar el estado para conformidad:', e);
  }
}

async function cerrarFormularioAutomaticoSiTodoAprobado() {
  if (!filtroListo.value || !esModuloRegistros.value) return;
  await fetchEstadoFormularioActual();
  if (formularioEstaAbierto.value !== true) return;
  const rows = listaMostrada.value.filter(registroConDatos);
  if (!rows.length) return;
  const todosAprobados = rows.every((r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO');
  if (!todosAprobados) return;
  try {
    const cfg = ENDPOINTS[modulo.value];
    await postAllIpress('/cerrar_mes/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(clinicaGlobal.value),
      id_modalidad: Number(modalidadGlobal.value),
      id_formulario: cfg.idFormulario,
      estado: 2,
    });
    ElMessage.success('Todos los registros están aprobados. El formulario se cerró automáticamente.');
    await fetchEstadoFormularioActual();
    await redirigirANotificacionSiListoParaConformidad();
  } catch (e) {
    console.error(e);
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  paginaRegistros.value = 1;
  if (modulo.value !== 'pacientes' && modulo.value !== 'movimientos') {
    cargarModuloActual();
    fetchEstadoFormularioActual();
  }
  fetchNotificacionEnvioRevision();
}, { deep: true });
watch(modulo, () => {
  filtroListadoNombre.value = '';
  filtroListadoDocumento.value = '';
  paginaRegistros.value = 1;
  if (modulo.value !== 'pacientes' && modulo.value !== 'movimientos') {
    cargarModuloActual();
    fetchEstadoFormularioActual();
  }
});

onMounted(() => {
  if (esModuloRegistros.value) {
    cargarModuloActual();
    fetchEstadoFormularioActual();
  }
  fetchNotificacionEnvioRevision();
  getAllIpress('/periodos/').then((res) => {
    periodosLista.value = Array.isArray(res) ? res : (res?.results || []);
  }).catch(() => { periodosLista.value = []; });
  getAllIpress('/ipress/').then((res) => {
    ipressLista.value = Array.isArray(res) ? res : (res?.results || []);
  }).catch(() => { ipressLista.value = []; });
  window.addEventListener('notificacion-revision:actualizar', onNotificacionRevisionEvent);
});

onUnmounted(() => {
  window.removeEventListener('notificacion-revision:actualizar', onNotificacionRevisionEvent);
});
</script>
