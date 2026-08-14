<template>
  <div>

    <div class="bg-white border rounded-lg p-5 shadow-sm my-6">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Resumen del periodo</p>
          <p class="text-xs text-gray-400">Último estado de cada paciente · periodo, IPRESS y modalidad</p>
          <p
            v-if="bloqueadoPorNotificacion"
            class="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-xl"
          >
            {{ mensajeBloqueoNotificacion }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            class="bg-violet-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-violet-700 transition"
            title="Ver historial de notificaciones, observaciones y conformidades"
            @click="abrirModalHistorialNotificacion"
          >
            Historial de notificación
          </button>
          <button
            type="button"
            class="bg-sky-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="bloqueadoPorNotificacion"
            :title="bloqueadoPorNotificacion ? mensajeBloqueoNotificacion : 'Consultar paciente'"
            @click="abrirModalConsultaDocumento"
          >
            Consultar Paciente
          </button>
        </div>
      </div>

      <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Pacientes en atención</p>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <div class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
          <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-tight">Total</p>
          <p class="text-2xl font-bold text-gray-800 mt-1 tabular-nums">{{ estadisticas.total }}</p>
        </div>
        <div class="rounded-lg border border-violet-100 bg-violet-50/60 px-3 py-2.5">
          <p class="text-[10px] font-bold uppercase tracking-wide text-violet-600 leading-tight">Nuevos</p>
          <p class="text-2xl font-bold text-violet-700 mt-1 tabular-nums">{{ estadisticas.nuevos }}</p>
        </div>
        <div class="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2.5">
          <p class="text-[10px] font-bold uppercase tracking-wide text-amber-600 leading-tight">Reingresos</p>
          <p class="text-2xl font-bold text-amber-700 mt-1 tabular-nums">{{ estadisticas.reingresos }}</p>
        </div>
        <div class="rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2.5">
          <p class="text-[10px] font-bold uppercase tracking-wide text-sky-600 leading-tight">Continuadores</p>
          <p class="text-2xl font-bold text-sky-700 mt-1 tabular-nums">{{ estadisticas.continuadores }}</p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-slate-100/80 px-3 py-2.5">
          <p class="text-[10px] font-bold uppercase tracking-wide text-slate-600 leading-tight">Egresos</p>
          <p class="text-2xl font-bold text-slate-700 mt-1 tabular-nums">{{ estadisticas.egresados }}</p>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Registros del periodo por módulo</p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-tight">Cambio de acceso vascular</p>
            <p class="text-2xl font-bold text-sky-700 mt-1 tabular-nums">{{ estadisticasRegistros.cambioAccesoVascular }}</p>
          </div>
          <div class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-tight">Eventos infecciosos</p>
            <p class="text-2xl font-bold text-rose-700 mt-1 tabular-nums">{{ estadisticasRegistros.eventosInfecciosos }}</p>
          </div>
          <div class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-tight">Morbilidad hospitalaria</p>
            <p class="text-2xl font-bold text-amber-700 mt-1 tabular-nums">{{ estadisticasRegistros.morbilidadHospitalaria }}</p>
          </div>
          <div class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-tight">Resultados clínicos</p>
            <p class="text-2xl font-bold text-indigo-700 mt-1 tabular-nums">{{ estadisticasRegistros.resultadosClinicos }}</p>
          </div>
          <div class="rounded-lg border border-teal-100 bg-teal-50/60 px-3 py-2.5">
            <p class="text-[10px] font-bold uppercase tracking-wide text-teal-600 leading-tight">Calidad de agua</p>
            <p class="text-2xl font-bold text-teal-700 mt-1 tabular-nums">{{ estadisticasRegistros.calidadAgua }}</p>
          </div>
        </div>
      </div>
    </div>

    <BandejaNotificaciones />

    <!-- Modal: Historial de notificación -->
    <div
      v-if="mostrarModalHistorialNotificacion"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      @click.self="cerrarModalHistorialNotificacion"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200">
        <div class="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-violet-50/80">
          <div>
            <h2 class="text-base font-bold text-slate-800">Historial de notificación</h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Envíos a revisión, observaciones y conformidades del periodo / IPRESS / modalidad actuales.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
              :disabled="cargandoHistorialNotificacion || !historialNotificacion.length || exportandoHistorialNotificacion"
              @click="exportarHistorialNotificacionExcel"
            >
              {{ exportandoHistorialNotificacion ? 'Exportando…' : 'Exportar Excel' }}
            </button>
            <button
              type="button"
              class="text-slate-500 hover:text-slate-800 text-lg leading-none px-2"
              aria-label="Cerrar"
              @click="cerrarModalHistorialNotificacion"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="p-5 overflow-auto flex-1">
          <div v-if="cargandoHistorialNotificacion" class="py-10 text-center text-sm text-slate-500">
            Cargando historial…
          </div>
          <div v-else-if="!filtroSelectorHistorialListo" class="py-10 text-center text-sm text-amber-700">
            Seleccione periodo, clínica y modalidad en la barra superior.
          </div>
          <div v-else-if="!historialNotificacion.length" class="py-10 text-center text-sm text-slate-500">
            No hay eventos de notificación para este filtro.
          </div>
          <div v-else class="overflow-x-auto border border-slate-100 rounded-lg">
            <table class="w-full text-xs">
              <thead class="bg-slate-50 border-b">
                <tr>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Fecha</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Evento</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Usuario / Supervisor</th>
                  <th class="px-3 py-2 text-left font-semibold text-slate-600 uppercase tracking-wide">Detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(item, idx) in historialNotificacion"
                  :key="item.id_historial ?? `${item.tipo}-${item.creado_en}-${idx}`"
                  class="hover:bg-slate-50/80"
                >
                  <td class="px-3 py-2 whitespace-nowrap text-slate-800 tabular-nums">
                    {{ formatFechaHoraDDMMAAAA(item.creado_en) }}
                  </td>
                  <td class="px-3 py-2">
                    <span
                      class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold"
                      :class="claseTipoHistorial(item.tipo)"
                    >
                      {{ item.tipo_label || item.tipo }}
                    </span>
                  </td>
                  <td class="px-3 py-2 text-slate-800">
                    <span class="font-medium">{{ item.usuario_nombre || '—' }}</span>
                    <span
                      v-if="item.es_supervisor"
                      class="ml-1 text-[10px] font-semibold uppercase text-violet-700"
                    >Supervisor</span>
                  </td>
                  <td class="px-3 py-2 text-slate-600 max-w-md whitespace-pre-wrap break-words">
                    {{ item.mensaje || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

   <!--  <div class="flex items-center gap-4 my-4 border-t pt-4">
      <button
        type="button"
        class="bg-sky-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="bloqueadoPorNotificacion"
        :title="bloqueadoPorNotificacion ? mensajeBloqueoNotificacion : 'Consultar paciente'"
        @click="abrirModalConsultaDocumento"
      >
        Consultar Paciente
      </button>
    </div> -->

    <!-- Modal 1: consultar por documento en el sistema -->
    <div
      v-if="mostrarModalConsultaDocumento"
      class="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4"
      @click.self="cerrarModalConsultaDocumento"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg relative border border-slate-200">
        <button
          type="button"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full w-8 h-8 shadow text-sm"
          aria-label="Cerrar"
          @click="cerrarModalConsultaDocumento"
        >
          ✕
        </button>
        <div class="p-6 pt-10">
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Buscar paciente</h3>
          <p class="text-sm text-slate-500 mb-4">Ingrese el documento para ver si ya está registrado en el sistema.</p>

          <label class="block text-xs font-semibold text-slate-600 mb-1">Número de documento</label>
          <div class="flex gap-2">
            <input
              v-model="docConsulta"
              type="text"
              class="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Ej. DNI"
              maxlength="20"
              @keyup.enter="consultarPacientePorDocumento"
            />
            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-50"
              :disabled="consultandoPaciente"
              @click="consultarPacientePorDocumento"
            >
              {{ consultandoPaciente ? 'Buscando…' : 'Buscar' }}
            </button>
          </div>
          <p v-if="errorConsultaDoc" class="text-sm text-red-600 mt-2">{{ errorConsultaDoc }}</p>

          <div
            v-if="verificandoClinicaPaciente"
            class="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
          >
            Verificando asignación de clínica…
          </div>

          <!-- Encontrado sin clínica activa: confirmar antes de ir a Captar paciente -->
          <div
            v-else-if="pacienteSinClinicaCaptar"
            class="mt-5 rounded-lg border border-sky-200 bg-sky-50/90 p-4 text-sm"
          >
            <p class="text-xs font-bold uppercase text-sky-900 mb-2">Paciente encontrado</p>
            <p class="text-slate-700 mb-2">
              No tiene una atención <strong>activa</strong> con clínica (IPRESS) asignada en el sistema.
            </p>
            <dl class="grid grid-cols-1 gap-1 text-slate-700 mb-4 text-sm">
              <div><span class="font-medium text-slate-500">Nombre:</span> {{ pacienteSinClinicaCaptar.paciente || '—' }}</div>
              <div><span class="font-medium text-slate-500">Documento:</span> {{ pacienteSinClinicaCaptar.documento || '—' }}</div>
            </dl>
            <p class="text-slate-800 font-medium mb-3">
              ¿Desea abrir <strong>Captar paciente</strong> en Movimientos? Se usará la misma clínica y periodo del selector superior.
            </p>
            <div class="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                class="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white"
                @click="cancelarIrACaptar"
              >
                No, cerrar
              </button>
              <button
                type="button"
                class="flex-1 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
                @click="confirmarIrACaptar"
              >
                Sí, captar paciente
              </button>
            </div>
          </div>

          <!-- Encontrado con clínica activa -->
          <div v-else-if="pacienteConsultaResultado" class="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-sm">
            <p class="text-xs font-bold uppercase text-emerald-800 mb-2">Paciente encontrado</p>
            <p class="text-xs text-emerald-900/90 mb-3">
              Tiene una atención activa con clínica (IPRESS) asignada.
            </p>
            <dl class="grid grid-cols-1 gap-1 text-slate-700">
              <div><span class="font-medium text-slate-500">Nombre:</span> {{ pacienteConsultaResultado.paciente || '—' }}</div>
              <div><span class="font-medium text-slate-500">Documento:</span> {{ pacienteConsultaResultado.documento || '—' }}</div>
              <div><span class="font-medium text-slate-500">Tipo doc.:</span> {{ pacienteConsultaResultado.tipo_documento || '—' }}</div>
              <div><span class="font-medium text-slate-500">F. nacimiento:</span> {{ pacienteConsultaResultado.fecha_nacimiento || '—' }}</div>
              <div><span class="font-medium text-slate-500">Género:</span> {{ pacienteConsultaResultado.genero || '—' }}</div>
            </dl>
            <button
              type="button"
              class="mt-4 w-full py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white"
              @click="cerrarModalConsultaDocumento"
            >
              Cerrar
            </button>
          </div>

          <!-- No encontrado: solo entonces se ofrece ir al formulario completo -->
          <div
            v-else-if="busquedaDocumentoEjecutada && !consultandoPaciente && !errorConsultaDoc && !verificandoClinicaPaciente && !pacienteSinClinicaCaptar"
            class="mt-5 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm"
          >
            <p class="text-amber-900 font-medium">No hay ningún paciente registrado con ese documento.</p>
            <p class="text-amber-800/90 text-xs mt-1">Puede cerrar o registrar un paciente nuevo con el formulario completo.</p>
            <div class="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="button"
                class="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white"
                @click="cerrarModalConsultaDocumento"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="flex-1 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
                @click="abrirFormularioRegistroNuevo"
              >
                Registrar nuevo paciente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: registro nuevo paciente -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <FormularioPaciente
          :key="`nuevo-${documentoPrefillRegistro || 'vacío'}`"
          :periodo-inicial="periodoSeleccionado"
          :id-periodo-ipress-inicial="idPeriodoIpress"
          :id-clinica-inicial="idClinicaSeleccionada"
          :nombre-clinica-inicial="clinicaSeleccionada"
          :mostrar-tabla-edicion="false"
          :numero-documento-inicial="documentoPrefillRegistro"
          @cancelar="cerrarModalFormularioPaciente"
          @guardado="onGuardadoFormularioPaciente"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/auth';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import FormularioPaciente from './FormularioPaciente.vue';
import BandejaNotificaciones from '@/components/notificaciones/BandejaNotificaciones.vue';
import {
  contarUnidadesAccesoEnPeriodo,
  rangoFechasDesdePeriodoTexto,
} from '@/utils/accesoVascularValidacion';
import { useBloqueoNotificacionRevision } from '@/composables/useBloqueoNotificacionRevision';
import { formatFechaHoraDDMMAAAA } from '@/utils/fechaFormat';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';

// Estado global: periodo, clínica (ipress) y modalidad (si el layout los provee)
const router = useRouter();
const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const { bloqueadoPorNotificacion, mensajeBloqueoNotificacion } = useBloqueoNotificacionRevision();

const mostrarModalHistorialNotificacion = ref(false);
const historialNotificacion = ref([]);
const cargandoHistorialNotificacion = ref(false);
const exportandoHistorialNotificacion = ref(false);

const filtroSelectorHistorialListo = computed(() => (
  periodoGlobal.value != null && periodoGlobal.value !== ''
  && clinicaGlobal.value != null && clinicaGlobal.value !== ''
  && modalidadGlobal.value != null && modalidadGlobal.value !== ''
));

function claseTipoHistorial(tipo) {
  if (tipo === 'CONFORMIDAD') return 'bg-emerald-100 text-emerald-800';
  if (tipo === 'OBSERVACION') return 'bg-amber-100 text-amber-800';
  if (tipo === 'ENVIO_REVISION') return 'bg-sky-100 text-sky-800';
  return 'bg-slate-100 text-slate-700';
}

async function cargarHistorialNotificacion() {
  if (!filtroSelectorHistorialListo.value) {
    historialNotificacion.value = [];
    return;
  }
  cargandoHistorialNotificacion.value = true;
  try {
    const params = new URLSearchParams({
      id_periodo: String(periodoGlobal.value),
      id_ipress: String(clinicaGlobal.value),
      id_modalidad: String(modalidadGlobal.value),
    });
    const res = await getAllIpress(`/historial_notificacion_revision/?${params.toString()}`);
    historialNotificacion.value = Array.isArray(res?.results) ? res.results : [];
  } catch (e) {
    console.error(e);
    historialNotificacion.value = [];
    ElMessage.error('No se pudo cargar el historial de notificación.');
  } finally {
    cargandoHistorialNotificacion.value = false;
  }
}

function abrirModalHistorialNotificacion() {
  mostrarModalHistorialNotificacion.value = true;
  cargarHistorialNotificacion();
}

function cerrarModalHistorialNotificacion() {
  mostrarModalHistorialNotificacion.value = false;
}

function exportarHistorialNotificacionExcel() {
  if (!historialNotificacion.value.length) {
    ElMessage.warning('No hay datos para exportar.');
    return;
  }
  exportandoHistorialNotificacion.value = true;
  try {
    const rows = historialNotificacion.value.map((item) => ({
      Fecha: formatFechaHoraDDMMAAAA(item.creado_en),
      Evento: item.tipo_label || item.tipo || '',
      'Usuario / Supervisor': item.usuario_nombre || '',
      'Es supervisor': item.es_supervisor ? 'Sí' : 'No',
      Detalle: item.mensaje || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial notificación');
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(
      wb,
      `historial_notificacion_p${periodoGlobal.value}_i${clinicaGlobal.value}_m${modalidadGlobal.value}_${stamp}.xlsx`,
    );
    ElMessage.success('Historial exportado a Excel.');
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo exportar el historial.');
  } finally {
    exportandoHistorialNotificacion.value = false;
  }
}

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/** Solo perfil Supervisor (mismo criterio que menú lateral). */
const esSupervisor = computed(() => {
  const p = String(user.value?.datosPerfil?.perfil ?? localStorage.getItem('perfil') ?? '').trim();
  return p === 'Supervisor';
});

// Estadísticas de pacientes desde tabla paciente_atencion (por periodo, ipress, modalidad)
const estadisticasAtencion = ref({ total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 });

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
    estadisticasAtencion.value = { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 };
    return;
  }
  try {
    const res = await getAllIpress(`/pacienteAtencion/estadisticas/?${qs}`);
    estadisticasAtencion.value = {
      total: res?.total ?? 0,
      nuevos: res?.nuevos ?? 0,
      reingresos: res?.reingresos ?? 0,
      continuadores: res?.continuadores ?? 0,
      egresados: res?.egresados ?? 0,
    };
  } catch (e) {
    console.error('Error al obtener estadísticas de atención:', e);
    estadisticasAtencion.value = { total: 0, nuevos: 0, reingresos: 0, continuadores: 0, egresados: 0 };
  }
};

const estadisticasRegistros = ref({
  cambioAccesoVascular: 0,
  eventosInfecciosos: 0,
  morbilidadHospitalaria: 0,
  resultadosClinicos: 0,
  calidadAgua: 0,
});

const rangoFechasPeriodo = computed(() => {
  const id = periodoGlobal.value;
  const item = periodos.value.find((p) => String(p.id_periodo) === String(id));
  return rangoFechasDesdePeriodoTexto(item?.periodo);
});

const countFromResponse = (res) => {
  if (Array.isArray(res)) return res.length;
  if (res?.results && Array.isArray(res.results)) return res.results.length;
  return 0;
};

const resolverIdUsuarioIpress = async (idIpress) => {
  if (idIpress == null || idIpress === '') return null;
  const idUsuario = user.value?.id_usuario ?? JSON.parse(localStorage.getItem('user') || 'null')?.id_usuario;
  if (idUsuario) {
    try {
      const asig = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${idUsuario}`);
      const lista = Array.isArray(asig) ? asig : (asig?.results || []);
      const match = lista.find((a) => String(a.id_ipress) === String(idIpress));
      if (match?.id_usuario_ipress != null) return match.id_usuario_ipress;
    } catch (e) {
      console.error('Error al resolver usuario IPRESS:', e);
    }
  }
  try {
    const uiList = await getAllIpress(`/usuarioIpress/?id_ipress=${idIpress}`);
    const lista = Array.isArray(uiList) ? uiList : (uiList?.results || []);
    return lista[0]?.id_usuario_ipress ?? null;
  } catch (e) {
    console.error('Error al obtener vínculo usuario–IPRESS:', e);
    return null;
  }
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
  const vacio = {
    cambioAccesoVascular: 0,
    eventosInfecciosos: 0,
    morbilidadHospitalaria: 0,
    resultadosClinicos: 0,
    calidadAgua: 0,
  };
  if (!qs) {
    estadisticasRegistros.value = { ...vacio };
    return;
  }
  try {
    const [resUnidades, resEventos, resMorb, resResultados, idUsuarioIpress] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${new URLSearchParams({
        ...(idIpress != null && idIpress !== '' ? { id_ipress: idIpress } : {}),
        ...(idModalidad != null && idModalidad !== '' ? { id_modalidad: idModalidad } : {}),
      }).toString()}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      resolverIdUsuarioIpress(idIpress),
    ]);

    let calidadAgua = 0;
    const idPi = idPeriodoIpress.value;
    if (idPi != null && idUsuarioIpress != null) {
      try {
        const resCal = await postAllIpress('/reporte_calidad_microbiologicas/', {
          id_usuario_ipress: Number(idUsuarioIpress),
          id_periodo_ipress: Number(idPi),
        });
        calidadAgua = countFromResponse(resCal);
      } catch (e) {
        console.error('Error al contar calidad de agua:', e);
      }
    }

    estadisticasRegistros.value = {
      cambioAccesoVascular: contarUnidadesAccesoEnPeriodo(
        Array.isArray(resUnidades) ? resUnidades : (resUnidades?.results || []),
        rangoFechasPeriodo.value,
      ),
      eventosInfecciosos: countFromResponse(resEventos),
      morbilidadHospitalaria: countFromResponse(resMorb),
      resultadosClinicos: countFromResponse(resResultados),
      calidadAgua,
    };
  } catch (e) {
    console.error('Error al obtener estadísticas de registros:', e);
    estadisticasRegistros.value = { ...vacio };
  }
};

const totalRegistrosPeriodo = computed(() => {
  const r = estadisticasRegistros.value;
  return (
    Number(r.cambioAccesoVascular || 0)
    + Number(r.eventosInfecciosos || 0)
    + Number(r.morbilidadHospitalaria || 0)
    + Number(r.resultadosClinicos || 0)
    + Number(r.calidadAgua || 0)
  );
});

// --- ESTADÍSTICAS DEL DASHBOARD ---
const estadisticas = computed(() => {
  const e = estadisticasAtencion.value;
  const nuevos = Number(e.nuevos || 0);
  const reingresos = Number(e.reingresos || 0);
  const continuadores = Number(e.continuadores || 0);
  const egresados = Number(e.egresados || 0);
  return {
    nuevos,
    reingresos,
    continuadores,
    egresados,
    total: nuevos + reingresos + continuadores + egresados,
  };
});
// -----------------------------------

/** Último registro por id_paciente_atencion: indicador de edición del supervisor y comentario (vista por formulario). */
const metaFormularioPorAtencion = ref({});

function ultimoMetaPorAtencion(rows, idKey) {
  const out = {};
  const list = Array.isArray(rows) ? rows : [];
  const sorted = [...list].sort((a, b) => (Number(b[idKey]) || 0) - (Number(a[idKey]) || 0));
  for (const r of sorted) {
    const aid = r.id_paciente_atencion ?? r.datosPacienteAtencion?.id_paciente_atencion;
    if (aid == null) continue;
    const k = String(aid);
    if (out[k] != null) continue;
    out[k] = {
      supervisor_edito_registro: !!r.supervisor_edito_registro,
      comentario_evaluacion: r.comentario_evaluacion || '',
    };
  }
  return out;
}

async function fetchMetaFormulariosPorAtencion() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  if (
    idPeriodo == null || idPeriodo === '' ||
    idIpress == null || idIpress === '' ||
    idModalidad == null || idModalidad === ''
  ) {
    metaFormularioPorAtencion.value = {};
    return;
  }
  const qs = new URLSearchParams({
    id_periodo: String(idPeriodo),
    id_ipress: String(idIpress),
    id_modalidad: String(idModalidad),
  }).toString();
  try {
    const [resU, resE, resM, resR, resV] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${qs}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      getAllIpress(`/vacunaciones/?${qs}`),
    ]);
    const arr = (x) => (Array.isArray(x) ? x : (x?.results || []));
    const merged = {};
    const mergeNum = (num, mapObj) => {
      Object.keys(mapObj).forEach((aid) => {
        if (!merged[aid]) merged[aid] = {};
        merged[aid][num] = mapObj[aid];
      });
    };
    mergeNum(1, ultimoMetaPorAtencion(arr(resU), 'id_unidad_actual'));
    mergeNum(2, ultimoMetaPorAtencion(arr(resE), 'id_evento_acceso_vascular'));
    mergeNum(3, ultimoMetaPorAtencion(arr(resM), 'id_morbilidad_hospitalaria'));
    mergeNum(4, ultimoMetaPorAtencion(arr(resR), 'id_resultado_clinico'));
    mergeNum(5, ultimoMetaPorAtencion(arr(resV), 'id_vacunacion'));
    metaFormularioPorAtencion.value = merged;
  } catch (e) {
    console.error('Error al cargar metadatos de formularios:', e);
    metaFormularioPorAtencion.value = {};
  }
}

function metaFormulario(row, numForm) {
  const id = row?.id_paciente_atencion;
  if (id == null) return null;
  return metaFormularioPorAtencion.value[String(id)]?.[numForm] ?? null;
}

function tooltipFormulario(row, numForm) {
  const m = metaFormulario(row, numForm);
  const c = String(m?.comentario_evaluacion || '').trim();
  if (c) return `Supervisor: ${c}`;
  if (m?.supervisor_edito_registro) return 'Registro editado por supervisor';
  return '';
}

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

// Variables conectadas al FiltroSuperior
const modalidadSeleccionada = ref(null) 
const clinicaSeleccionada = ref('') 
const idClinicaSeleccionada = ref(null) 
const periodoSeleccionado = ref(null) 

const idPeriodoIpress = ref(null)
const mostrarFormulario = ref(false)
const componenteFormulario = ref(null)
const emit = defineEmits(['form2', 'form3', 'form4', 'form5', 'form7', 'nuevo-registro', 'egresar-paciente'])

/** Convierte fila del listado (listado_pacientes_dialisis_por_ipress_periodo) al objeto paciente que esperan los formularios. */
const filaDialisisAPaciente = (row) => {
  const p = row?.datosPaciente || {};
  return {
    ...p,
    id_paciente: p.id_paciente,
    paciente: p.paciente,
    documento: p.documento,
    fecha_nacimiento: p.fecha_nacimiento,
    tipo_documento: p.tipo_documento,
    genero: p.genero,
    grado_instruccion: p.grado_instruccion,
    modalidad: row.modalidad,
    id_paciente_atencion: row.id_paciente_atencion,
    ipress: clinicaSeleccionada.value,
    cantidad_de_registros_unidades_actuales: 0,
    cantidad_de_eventos_accesos_vasculares: 0,
    cantidad_de_morbilidades: 0,
    cantidad_de_resultados_clinicos: 0,
    cantidad_de_vacunaciones: 0,
  };
};

const abrirFormulario = (filaDialisis, numeroFormulario) => {
  const paciente = filaDialisisAPaciente(filaDialisis);
  switch (numeroFormulario) {
    case 1: emit('form2', { paciente, numeroFormulario, periodo: periodoSeleccionado.value, periodoIpress: idPeriodoIpress.value }); break;
    case 2: emit('form3', { paciente, numeroFormulario, periodo: periodoSeleccionado.value, periodoIpress: idPeriodoIpress.value }); break;
    case 3: emit('form4', { paciente, numeroFormulario, periodo: periodoSeleccionado.value, periodoIpress: idPeriodoIpress.value }); break;
    case 4: emit('form5', { paciente, numeroFormulario, periodo: periodoSeleccionado.value, periodoIpress: idPeriodoIpress.value }); break;
    case 5: emit('form7', { paciente, numeroFormulario, periodo: periodoSeleccionado.value, periodoIpress: idPeriodoIpress.value }); break;
  }
};

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
const idPerido = ref(null)
const idIpress = ref(null)

async function searchPeriodoIpress() {
  idIpress.value = clinicaGlobal.value ?? null
  idPerido.value = periodoGlobal.value ?? null
  idClinicaSeleccionada.value = idIpress.value
  periodoSeleccionado.value = idPerido.value
  modalidadSeleccionada.value = modalidadGlobal.value ?? null

  const clinicaActual = ipress.value.find((item) => String(item.id_ipress) === String(idClinicaSeleccionada.value))
  clinicaSeleccionada.value = clinicaActual?.nombre_corto || clinicaActual?.ipress || ''

  if (idPerido.value != null && idIpress.value != null) {
    try {
      const respuesta = await postAllIpress('/consulta_periodo_ipress/', {
        id_periodo: Number(idPerido.value),
        id_ipress: Number(idIpress.value),
        id_estado: 1,
      });
      const lista = Array.isArray(respuesta) ? respuesta : [];
      idPeriodoIpress.value = lista.length ? lista[0].id_periodo_ipress : null;
    } catch (error) {
      idPeriodoIpress.value = null;
    }
  } else {
    idPeriodoIpress.value = null;
  }

}

const fetchPeriodoIpress = async (url = null) => {
  try {
    /* const respuesta = await getAllIpress(url ?? "/periodoIpress/");
    periodoIpress.value = respuesta; */
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

const mostrarModalNuevo = ref(false);

/** Precarga documento en FormularioPaciente al abrir tras “no encontrado”. */
const documentoPrefillRegistro = ref('');

const mostrarModalConsultaDocumento = ref(false);
const docConsulta = ref('');
const consultandoPaciente = ref(false);
const errorConsultaDoc = ref('');
const pacienteConsultaResultado = ref(null);
const busquedaDocumentoEjecutada = ref(false);
const verificandoClinicaPaciente = ref(false);
/** Paciente encontrado sin IPRESS en atención ACTIVA: se muestra la pregunta antes de ir a Captar. */
const pacienteSinClinicaCaptar = ref(null);

const pacienteTieneAtencionActivaConIpress = async (idPaciente) => {
  if (idPaciente == null || idPaciente === '') return false;
  try {
    const res = await getAllIpress(`/pacienteAtencion/?id_paciente=${encodeURIComponent(idPaciente)}`);
    const list = Array.isArray(res) ? res : (res?.results || []);
    return list.some((a) => {
      const activo = String(a.estado || '').toUpperCase() === 'ACTIVO';
      const ip = a.id_ipress;
      const tieneIpress = ip != null && ip !== '';
      return activo && tieneIpress;
    });
  } catch (e) {
    console.error(e);
    return false;
  }
};

const cerrarModalFormularioPaciente = () => {
  mostrarModalNuevo.value = false;
  documentoPrefillRegistro.value = '';
};

const cerrarModalNuevo = () => {
  cerrarModalFormularioPaciente();
};

const onGuardadoFormularioPaciente = async () => {
  cerrarModalFormularioPaciente();
  await fetchEstadisticasAtencion();
  await fetchEstadisticasRegistros();
};

const cerrarModalConsultaDocumento = () => {
  mostrarModalConsultaDocumento.value = false;
  docConsulta.value = '';
  errorConsultaDoc.value = '';
  pacienteConsultaResultado.value = null;
  busquedaDocumentoEjecutada.value = false;
  verificandoClinicaPaciente.value = false;
  pacienteSinClinicaCaptar.value = null;
};

const abrirModalConsultaDocumento = () => {
  if (bloqueadoPorNotificacion.value) {
    ElMessage.warning(mensajeBloqueoNotificacion);
    return;
  }
  docConsulta.value = '';
  errorConsultaDoc.value = '';
  pacienteConsultaResultado.value = null;
  busquedaDocumentoEjecutada.value = false;
  verificandoClinicaPaciente.value = false;
  pacienteSinClinicaCaptar.value = null;
  mostrarModalConsultaDocumento.value = true;
};

const confirmarIrACaptar = () => {
  const p = pacienteSinClinicaCaptar.value;
  if (!p) return;
  const documento = String(p.documento || docConsulta.value || '').trim();
  if (!documento) return;
  cerrarModalConsultaDocumento();
  router.push({ name: 'Movimientos', query: { captarDni: documento } });
};

const cancelarIrACaptar = () => {
  cerrarModalConsultaDocumento();
};

const consultarPacientePorDocumento = async () => {
  errorConsultaDoc.value = '';
  pacienteConsultaResultado.value = null;
  pacienteSinClinicaCaptar.value = null;
  busquedaDocumentoEjecutada.value = false;
  verificandoClinicaPaciente.value = false;
  const doc = docConsulta.value.trim();
  if (!doc) {
    errorConsultaDoc.value = 'Ingrese el número de documento.';
    return;
  }
  consultandoPaciente.value = true;
  try {
    const res = await getAllIpress(`/pacientes/?documento=${encodeURIComponent(doc)}`);
    const list = Array.isArray(res) ? res : (res?.results || []);
    busquedaDocumentoEjecutada.value = true;
    if (list.length === 0) {
      pacienteConsultaResultado.value = null;
      return;
    }
    const encontrado = list[0];
    verificandoClinicaPaciente.value = true;
    const tieneClinica = await pacienteTieneAtencionActivaConIpress(encontrado.id_paciente);
    verificandoClinicaPaciente.value = false;
    if (!tieneClinica) {
      pacienteSinClinicaCaptar.value = encontrado;
      return;
    }
    pacienteConsultaResultado.value = encontrado;
  } catch (e) {
    errorConsultaDoc.value = e?.error || e?.message || 'Error al buscar en el sistema.';
    busquedaDocumentoEjecutada.value = false;
  } finally {
    consultandoPaciente.value = false;
    verificandoClinicaPaciente.value = false;
  }
};

/** Cierra consulta y abre el formulario completo con documento precargado. */
const abrirFormularioRegistroNuevo = () => {
  documentoPrefillRegistro.value = docConsulta.value.trim();
  mostrarModalConsultaDocumento.value = false;
  docConsulta.value = '';
  errorConsultaDoc.value = '';
  pacienteConsultaResultado.value = null;
  busquedaDocumentoEjecutada.value = false;
  mostrarModalNuevo.value = true;
};

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], async () => {
  await searchPeriodoIpress();
  await fetchEstadisticasAtencion();
  await fetchEstadisticasRegistros();
}, { deep: true });

onMounted(async () => {
  await fetchPeriodoIpress();
  await fetchIpress();
  fetchPeriodo();
  await searchPeriodoIpress();
  await fetchEstadisticasAtencion();
  await fetchEstadisticasRegistros();
});
</script>

<style scoped>
/* Estilos sin cambios */
</style>