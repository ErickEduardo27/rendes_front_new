<template>
  <div class="min-h-screen bg-gray-50/50 p-4 sm:p-6">
    <div class="max-w-[100rem] mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-slate-600 rounded-full"></span>
            Eventos Infecciosos
          </h1>
          <p class="text-slate-500 mt-1 text-sm">Registros de eventos infecciosos asociados al acceso por periodo, IPRESS y modalidad.</p>
          <div class="mt-3 flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado del formulario</span>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
              :class="bloqueadoPorNotificacion
                ? 'bg-amber-100 text-amber-800'
                : (formularioAbierto ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')"
            >
              {{ cargandoEstadoFormulario ? 'Consultando...' : estadoFormularioTexto }}
            </span>
          </div>
          <p
            v-if="bloqueadoPorNotificacion"
            class="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-xl"
          >
            {{ mensajeBloqueoNotificacion }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <!-- <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            @click="abrirModalImportar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar
          </button> -->
          <button
            type="button"
            class="header-accion-btn header-accion-btn-secundario"
            :disabled="!puedeExportarEventosInfecciososExcel || exportandoExcel"
            :title="puedeExportarEventosInfecciososExcel ? 'Exporta la vista actual (todos los registros del filtro)' : 'No hay datos para exportar con los filtros actuales'"
            @click="exportarDatosEventosInfecciososExcel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="header-accion-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ exportandoExcel ? 'Exportando…' : 'Exportar Excel' }}
          </button>
          <button
            v-if="mostrarBotonNuevo"
            type="button"
            class="header-accion-btn header-accion-btn-primario"
            @click="abrirModalNuevo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="header-accion-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo
          </button>
        </div>
      </div>

      <div class="flex gap-1 mb-4 border-b border-slate-200">
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'registros' ? 'bg-white text-slate-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'registros'"
        >
          Solo con registros
        </button>
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'todos' ? 'bg-white text-slate-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'todos'"
        >
          Todos los pacientes
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <template v-else-if="vistaActiva === 'registros'">
          <div v-if="registros.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay registros de eventos infecciosos para el periodo, IPRESS y modalidad seleccionados.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="tabla-ei divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="tabla-ei-th">Paciente</th>
                  <th class="tabla-ei-th">DNI</th>
                  <th class="tabla-ei-th">F. evento</th>
                  <th class="tabla-ei-th">Tipo infección</th>
                  <th class="tabla-ei-th">Antimicrobial IV</th>
                  <th class="tabla-ei-th">Vancomicina IV</th>
                  <th class="tabla-ei-th">Hemocultivo (+)</th>
                  <th class="tabla-ei-th">Germen</th>
                  <th class="tabla-ei-th">Estado</th>
                  <th class="tabla-ei-th">Editado sup.</th>
                  <th class="tabla-ei-th tabla-ei-col-comentario">Comentario sup.</th>
                  <th class="tabla-ei-th tabla-ei-th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in registrosPaginados" :key="r.id_evento_acceso_vascular" class="hover:bg-slate-50 transition-colors">
                  <td class="tabla-ei-td font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ documentoPaciente(r) }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fechaCelda(r.fecha_evento) }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ r.tipo_infeccion || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ r.antmicrobial || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ r.vancomicina || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ r.hemocultivo_positivo || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ r.germen || '—' }}</td>
                  <td class="tabla-ei-td">
                    <span class="tabla-ei-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span>
                  </td>
                  <td class="tabla-ei-td">
                    <span v-if="r.supervisor_edito_registro" class="tabla-ei-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="tabla-ei-td tabla-ei-col-comentario text-slate-600" :title="r.comentario_evaluacion || ''">{{ r.comentario_evaluacion?.trim() || '—' }}</td>
                  <td class="tabla-ei-td tabla-ei-td-acciones">
                    <div class="inline-flex items-center gap-1">
                      <button
                        type="button"
                        class="tabla-ei-btn tabla-ei-btn-editar"
                        :disabled="!formularioAbierto"
                        :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                        @click="abrirModalEditar(r)"
                      >
                        Editar
                      </button>
                      <button
                        v-if="!registroDePacienteEgresado(r, listadoAtenciones)"
                        type="button"
                        class="tabla-ei-btn tabla-ei-btn-eliminar"
                        :disabled="!formularioAbierto || eliminandoId === r.id_evento_acceso_vascular"
                        :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                        @click="eliminarRegistro(r)"
                      >
                        {{ eliminandoId === r.id_evento_acceso_vascular ? '…' : 'Eliminar' }}
                      </button>
                      <button
                        type="button"
                        class="tabla-ei-btn-icon"
                        title="Ver tendencia y recurrencias"
                        @click="abrirDashboardPaciente(r)"
                      >
                        <ChartBarIcon class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            <TablaPaginacion
              v-model:page="paginaRegistros"
              v-model:page-size="pageSizeTablas"
              :page-size-options="[PAGE_SIZE_TABLAS]"
              hide-page-size-selector
              :total="registros.length"
            />
          </template>
        </template>
        <template v-else>
          <div v-if="todosPacientesLista.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay pacientes en el periodo, IPRESS y modalidad seleccionados.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="tabla-ei divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="tabla-ei-th">Paciente</th>
                  <th class="tabla-ei-th">DNI</th>
                  <th class="tabla-ei-th">F. evento</th>
                  <th class="tabla-ei-th">Tipo infección</th>
                  <th class="tabla-ei-th">Antimicrobial  IV</th>
                  <th class="tabla-ei-th">Vancomicina IV</th>
                  <th class="tabla-ei-th">Hemocultivo (+)</th>
                  <th class="tabla-ei-th">Germen</th>
                  <th class="tabla-ei-th">Estado</th>
                  <th class="tabla-ei-th">Editado sup.</th>
                  <th class="tabla-ei-th tabla-ei-col-comentario">Comentario sup.</th>
                  <th class="tabla-ei-th tabla-ei-th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="fila in todosPacientesPaginados" :key="fila.id_paciente_atencion" class="hover:bg-slate-50 transition-colors" :class="{ 'bg-amber-50/50': !fila.tieneRegistro }">
                  <td class="tabla-ei-td font-medium text-slate-800">
                    {{ fila.paciente || '—' }}
                    <span v-if="fila.es_egresado" class="ml-1 inline text-[10px] font-semibold uppercase text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">EGRESADO</span>
                  </td>
                  <td class="tabla-ei-td text-slate-600">{{ fila.documento || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fechaCelda(fila.fecha_evento) }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fila.tipo_infeccion || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fila.antmicrobial || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fila.vancomicina || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fila.hemocultivo_positivo || '—' }}</td>
                  <td class="tabla-ei-td text-slate-600">{{ fila.germen || '—' }}</td>
                  <td class="tabla-ei-td">
                    <span class="tabla-ei-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(fila.estado_aprobacion)">{{ fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO') }}</span>
                  </td>
                  <td class="tabla-ei-td">
                    <span v-if="fila.supervisor_edito_registro" class="tabla-ei-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="tabla-ei-td tabla-ei-col-comentario text-slate-600" :title="fila.comentario_evaluacion || ''">{{ fila.comentario_evaluacion?.trim() || '—' }}</td>
                  <td class="tabla-ei-td tabla-ei-td-acciones">
                    <div v-if="fila.tieneRegistro" class="inline-flex items-center gap-1">
                      <button
                        type="button"
                        class="tabla-ei-btn tabla-ei-btn-editar"
                        :disabled="!formularioAbierto"
                        :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                        @click="abrirModalEditar(fila.registro)"
                      >
                        Editar
                      </button>
                      <button
                        v-if="!fila.es_egresado"
                        type="button"
                        class="tabla-ei-btn tabla-ei-btn-eliminar"
                        :disabled="!formularioAbierto || eliminandoId === fila.id_evento_acceso_vascular"
                        :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                        @click="eliminarRegistro(fila.registro)"
                      >
                        {{ eliminandoId === fila.id_evento_acceso_vascular ? '…' : 'Eliminar' }}
                      </button>
                      <button
                        type="button"
                        class="tabla-ei-btn-icon"
                        title="Ver tendencia y recurrencias"
                        :disabled="!fila.id_paciente"
                        @click="abrirDashboardPaciente(fila)"
                      >
                        <ChartBarIcon class="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div v-else class="inline-flex items-center gap-1">
                      <span class="text-slate-400">—</span>
                      <button
                        type="button"
                        class="tabla-ei-btn-icon"
                        title="Ver tendencia y recurrencias"
                        :disabled="!fila.id_paciente"
                        @click="abrirDashboardPaciente(fila)"
                      >
                        <ChartBarIcon class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
            <TablaPaginacion
              v-model:page="paginaTodos"
              v-model:page-size="pageSizeTablas"
              :page-size-options="[PAGE_SIZE_TABLAS]"
              hide-page-size-selector
              :total="todosPacientesLista.length"
            />
          </template>
        </template>
      </div>
    </div>

    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-slate-700 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white flex items-center gap-2">{{ tituloModalFormulario }}</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalNuevo">✕</button>
        </div>
        <div class="p-6 overflow-y-auto flex-1">
          <div v-if="!pacienteParaFormulario" class="space-y-4">
            <label class="block text-sm font-bold text-slate-700">Busque el paciente</label>
            <input
              v-model="busquedaPaciente"
              type="text"
              placeholder="Escriba nombre o DNI"
              class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-cyan-500 focus:border-cyan-500"
            />
            <div class="border border-slate-200 rounded-xl overflow-hidden">
              <div v-if="pacientesFiltrados.length === 0" class="px-4 py-3 text-sm text-slate-500 italic">
                No se encontraron pacientes con ese criterio.
              </div>
              <div v-else class="max-h-72 overflow-y-auto divide-y divide-slate-100">
                <button
                  v-for="p in pacientesFiltrados"
                  :key="p.id_paciente_atencion"
                  type="button"
                  class="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                  :class="String(idPacienteSeleccionado) === String(p.id_paciente_atencion) ? 'bg-cyan-50 border-l-4 border-cyan-500' : ''"
                  @click="idPacienteSeleccionado = p.id_paciente_atencion"
                >
                  <div class="text-sm font-medium text-slate-800">{{ p.datosPaciente?.paciente || 'Sin nombre' }}</div>
                  <div class="text-xs text-slate-500">DNI: {{ p.datosPaciente?.documento || '—' }}</div>
                </button>
              </div>
            </div>
            <p class="text-xs text-slate-500">Pacientes con atención en el periodo, IPRESS y modalidad actuales.</p>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalNuevo">Cancelar</button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-bold text-white bg-slate-600 hover:bg-slate-700 rounded-lg disabled:opacity-50"
                :disabled="!idPacienteSeleccionado"
                @click="confirmarPacienteYMostrarFormulario"
              >
                Continuar al formulario
              </button>
            </div>
          </div>
          <div v-else>
            <Form3Hemodialisis
              :key="form3ModalKey"
              :paciente="pacienteParaFormulario"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              @cancelar="cerrarModalNuevo"
              @guardado="onGuardado"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalImportar" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-slate-600 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white">Importar Eventos Infecciosos</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalImportar">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <p class="text-sm text-slate-600">Descargue el formato en Excel, complételo y cárguelo aquí.</p>
          <button type="button" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50" @click="descargarFormatoExcel">
            Descargar formato Excel
          </button>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Cargar archivo Excel</label>
            <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="onDropArchivo" :class="arrastrando ? 'border-slate-400 bg-slate-50' : ''">
              <input ref="inputArchivoImportar" type="file" accept=".xlsx,.xls" class="hidden" @change="onSeleccionarArchivo" />
              <p class="text-slate-500 text-sm mb-2">Arrastre el archivo o</p>
              <button type="button" class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300" @click="inputArchivoImportar?.click()">Seleccionar archivo</button>
              <p v-if="archivoSeleccionado" class="mt-3 text-sm font-medium text-slate-600">{{ archivoSeleccionado.name }}</p>
            </div>
          </div>
          <div v-if="importando" class="text-center text-slate-500 text-sm">Importando...</div>
          <div v-if="resultadoImportacion" class="rounded-lg p-3 text-sm" :class="resultadoImportacion.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">{{ resultadoImportacion.mensaje }}</div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalImportar">Cerrar</button>
            <button type="button" class="px-4 py-2 text-sm font-bold text-white bg-slate-600 hover:bg-slate-700 rounded-lg disabled:opacity-50" :disabled="!archivoSeleccionado || importando" @click="ejecutarImportacion">Importar datos</button>
          </div>
        </div>
      </div>
    </div>

    <DashboardInfeccionesPaciente
      v-model:visible="dashboardVisible"
      :id-paciente="dashboardPaciente.id"
      :nombre="dashboardPaciente.nombre"
      :documento="dashboardPaciente.documento"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { ChartBarIcon } from '@heroicons/vue/24/outline';
import * as XLSX from 'xlsx';
import { getAllIpress, postAllIpress, deleteAllIpress } from '@/services/ipress/Ipress.service';
import { atencionesParaListadoRegistros, indexarRegistrosPorAtencionYPaciente, registroParaAtencionActiva, esPacienteEgresadoEnListado, registroDePacienteEgresado } from '@/composables/useAtencionesRegistro';
import { useBloqueoNotificacionRevision } from '@/composables/useBloqueoNotificacionRevision';
import { fechaCelda } from '@/utils/fechaFormat';
import Form3Hemodialisis from '@/components/forms/typesForm3/Form3Hemodialisis.vue';
import TablaPaginacion from '@/components/TablaPaginacion.vue';
import DashboardInfeccionesPaciente from '@/components/registros/DashboardInfeccionesPaciente.vue';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const { bloqueadoPorNotificacion, mensajeBloqueoNotificacion } = useBloqueoNotificacionRevision();

/** Mismo número que EvaluacionRegistros (eventos infecciosos). */
const NUMERO_FORMULARIO_EVENTOS = 2;

const registros = ref([]);
const cargando = ref(false);
const mostrarModalNuevo = ref(false);
const registroEdicion = ref(null);
const form3ModalKey = ref(0);
const eliminandoId = ref(null);
const vistaActiva = ref('registros');
const listadoAtenciones = ref([]);
const idPacienteSeleccionado = ref('');
const busquedaPaciente = ref('');
const pacienteParaFormulario = ref(null);
const idPacienteAtencionParaForm = ref(null);
const mostrarModalImportar = ref(false);
const arrastrando = ref(false);
const archivoSeleccionado = ref(null);
const inputArchivoImportar = ref(null);
const importando = ref(false);
const resultadoImportacion = ref(null);
const estadoFormulario = ref('CERRADO');
const cargandoEstadoFormulario = ref(false);

const PAGE_SIZE_TABLAS = 10;
const pageSizeTablas = ref(PAGE_SIZE_TABLAS);
const paginaRegistros = ref(1);
const paginaTodos = ref(1);

const formularioAbierto = computed(() => estadoFormulario.value === 'ABIERTO' && !bloqueadoPorNotificacion.value);
const estadoFormularioTexto = computed(() => {
  if (bloqueadoPorNotificacion.value) return 'Bloqueado (Notificado)';
  return estadoFormulario.value === 'ABIERTO' ? 'Abierto' : 'Cerrado';
});
const motivoFormularioNoEditable = computed(() => (
  bloqueadoPorNotificacion.value ? mensajeBloqueoNotificacion : 'El formulario está cerrado'
));
const mostrarBotonNuevo = computed(() => formularioAbierto.value);
const tituloModalFormulario = computed(() => (
  registroEdicion.value ? 'Editar evento infeccioso' : 'Nuevo evento infeccioso'
));

const exportandoExcel = ref(false);

const dashboardVisible = ref(false);
const dashboardPaciente = ref({ id: null, nombre: '', documento: '' });

const puedeExportarEventosInfecciososExcel = computed(() => {
  if (cargando.value) return false;
  if (vistaActiva.value === 'registros') return registros.value.length > 0;
  return todosPacientesLista.value.length > 0;
});

function filasExcelEventosVistaRegistros() {
  return registros.value.map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    'Fecha evento': r.fecha_evento || '',
    'Tipo infección': r.tipo_infeccion || '',
    Antimicrobial: r.antmicrobial || '',
    Vancomicina: r.vancomicina || '',
    'Hemocultivo (+)': r.hemocultivo_positivo || '',
    Germen: r.germen || '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
    'Editado supervisor': r.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': r.comentario_evaluacion || '',
  }));
}

function filasExcelEventosVistaTodos() {
  return todosPacientesLista.value.map((fila) => ({
    Paciente: fila.paciente || '',
    DNI: fila.documento || '',
    'Tiene registro': fila.tieneRegistro ? 'Sí' : 'No',
    'Fecha evento': fila.fecha_evento || '',
    'Tipo infección': fila.tipo_infeccion || '',
    Antimicrobial: fila.antmicrobial || '',
    Vancomicina: fila.vancomicina || '',
    'Hemocultivo (+)': fila.hemocultivo_positivo || '',
    Germen: fila.germen || '',
    Estado: fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO'),
    'Editado supervisor': fila.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': fila.comentario_evaluacion || '',
  }));
}

async function exportarDatosEventosInfecciososExcel() {
  if (!puedeExportarEventosInfecciososExcel.value) {
    ElMessage.warning('No hay datos para exportar con los filtros actuales.');
    return;
  }
  exportandoExcel.value = true;
  try {
    const esRegistros = vistaActiva.value === 'registros';
    const rows = esRegistros ? filasExcelEventosVistaRegistros() : filasExcelEventosVistaTodos();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Eventos infecciosos');
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const sufijo = esRegistros ? 'solo_registros' : 'todos_pacientes';
    XLSX.writeFile(wb, `eventos_infecciosos_${sufijo}_${stamp}.xlsx`);
    ElMessage.success(`Se exportaron ${rows.length} fila(s).`);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo generar el archivo Excel.');
  } finally {
    exportandoExcel.value = false;
  }
}

const COLUMNAS_FORMATO = ['id_paciente_atencion', 'tipo_infeccion', 'fecha_evento', 'antmicrobial', 'vancomicina', 'hemocultivo_positivo', 'germen'];

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}
function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}

function idPacienteDesdeFila(fila) {
  if (fila?.id_paciente != null) return fila.id_paciente;
  return (
    fila?.datosPacienteAtencion?.datosPaciente?.id_paciente
    ?? fila?.datosPaciente?.id_paciente
    ?? fila?.datosPacienteAtencion?.id_paciente
    ?? null
  );
}

function abrirDashboardPaciente(fila) {
  const id = idPacienteDesdeFila(fila);
  if (id == null) {
    ElMessage.warning('No se pudo identificar al paciente para el gráfico.');
    return;
  }
  dashboardPaciente.value = {
    id,
    nombre: fila.paciente || nombrePaciente(fila) || 'Paciente',
    documento: fila.documento || documentoPaciente(fila) || '',
  };
  dashboardVisible.value = true;
}

function estadoAprobacionClase(estado) {
  const valor = String(estado || '').toUpperCase();
  if (valor === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (valor === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  if (valor === 'SIN REGISTRO') return 'bg-slate-100 text-slate-500';
  return 'bg-amber-100 text-amber-700';
}

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

const pacientesDisponibles = computed(() =>
  (Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : [])
    .filter((a) => !esPacienteEgresadoEnListado(a))
);
const pacientesFiltrados = computed(() => {
  const texto = busquedaPaciente.value.trim().toLowerCase();
  if (!texto) return pacientesDisponibles.value;
  return pacientesDisponibles.value.filter((paciente) => {
    const nombre = String(paciente.datosPaciente?.paciente || '').toLowerCase();
    const documento = String(paciente.datosPaciente?.documento || '').toLowerCase();
    return nombre.includes(texto) || documento.includes(texto);
  });
});

const todosPacientesLista = computed(() => {
  const atenciones = Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : [];
  const regs = Array.isArray(registros.value) ? registros.value : [];
  const { porAtencion, porPaciente } = indexarRegistrosPorAtencionYPaciente(regs, 'id_evento_acceso_vascular');
  return atenciones.map((a) => {
    const id = a.id_paciente_atencion;
    const r = registroParaAtencionActiva(a, porAtencion, porPaciente);
    const paciente = a.datosPaciente?.paciente ?? '—';
    const documento = a.datosPaciente?.documento ?? '—';
    const idPaciente = a.datosPaciente?.id_paciente ?? a.id_paciente ?? null;
    const esEgresado = esPacienteEgresadoEnListado(a);
    if (r) {
      return {
        id_paciente_atencion: id,
        id_paciente: idPacienteDesdeFila(r) ?? idPaciente,
        id_evento_acceso_vascular: r.id_evento_acceso_vascular,
        tieneRegistro: true,
        registro: r,
        paciente: nombrePaciente(r),
        documento: documentoPaciente(r),
        datosPacienteAtencion: r.datosPacienteAtencion,
        fecha_evento: r.fecha_evento || '',
        tipo_infeccion: r.tipo_infeccion || '',
        antmicrobial: r.antmicrobial || '',
        vancomicina: r.vancomicina || '',
        hemocultivo_positivo: r.hemocultivo_positivo || '',
        germen: r.germen || '',
        estado_aprobacion: r.estado_aprobacion || 'PENDIENTE',
        supervisor_edito_registro: !!r.supervisor_edito_registro,
        comentario_evaluacion: r.comentario_evaluacion || '',
        es_egresado: esEgresado,
      };
    }
    return {
      id_paciente_atencion: id,
      id_paciente: idPaciente,
      tieneRegistro: false,
      paciente,
      documento,
      fecha_evento: '',
      tipo_infeccion: '',
      antmicrobial: '',
      vancomicina: '',
      hemocultivo_positivo: '',
      germen: '',
      estado_aprobacion: esEgresado ? 'EGRESADO' : 'SIN REGISTRO',
      supervisor_edito_registro: false,
      comentario_evaluacion: '',
      es_egresado: esEgresado,
    };
  });
});

const registrosPaginados = computed(() => {
  const all = registros.value;
  const start = (paginaRegistros.value - 1) * PAGE_SIZE_TABLAS;
  return all.slice(start, start + PAGE_SIZE_TABLAS);
});
const todosPacientesPaginados = computed(() => {
  const all = todosPacientesLista.value;
  const start = (paginaTodos.value - 1) * PAGE_SIZE_TABLAS;
  return all.slice(start, start + PAGE_SIZE_TABLAS);
});

function clampPaginaRegistros() {
  const total = registros.value.length;
  const maxP = Math.max(1, Math.ceil(total / PAGE_SIZE_TABLAS) || 1);
  if (paginaRegistros.value > maxP) paginaRegistros.value = maxP;
}
function clampPaginaTodos() {
  const total = todosPacientesLista.value.length;
  const maxP = Math.max(1, Math.ceil(total / PAGE_SIZE_TABLAS) || 1);
  if (paginaTodos.value > maxP) paginaTodos.value = maxP;
}

watch(registros, () => clampPaginaRegistros(), { deep: true });
watch(todosPacientesLista, () => clampPaginaTodos());
watch(() => vistaActiva.value, () => {
  paginaRegistros.value = 1;
  paginaTodos.value = 1;
});

async function fetchEstadoFormulario() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  if (idPeriodo == null || idIpress == null || idModalidad == null || idModalidad === '') {
    estadoFormulario.value = 'CERRADO';
    return;
  }
  cargandoEstadoFormulario.value = true;
  try {
    const res = await postAllIpress('/consulta_estado_formulario_moderno/', {
      id_periodo: idPeriodo,
      id_ipress: idIpress,
      id_modalidad: idModalidad,
      numero_formulario: NUMERO_FORMULARIO_EVENTOS,
    });
    estadoFormulario.value = res?.abierto !== false ? 'ABIERTO' : 'CERRADO';
  } catch (e) {
    console.error('Error al consultar estado del formulario:', e);
    estadoFormulario.value = 'CERRADO';
  } finally {
    cargandoEstadoFormulario.value = false;
  }
}

async function fetchRegistros() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
  if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);
  const qs = params.toString();
  if (!qs) {
    registros.value = [];
    return;
  }
  cargando.value = true;
  try {
    const [resReg, resAten] = await Promise.all([
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/pacienteAtencion/?${qs}`),
    ]);
    registros.value = Array.isArray(resReg) ? resReg : resReg?.results || [];
    listadoAtenciones.value = atencionesParaListadoRegistros(
      Array.isArray(resAten) ? resAten : resAten?.results || []
    );
  } catch (e) {
    console.error('Error al cargar eventos infecciosos:', e);
    registros.value = [];
    listadoAtenciones.value = [];
  } finally {
    cargando.value = false;
  }
}

async function fetchPacientesAtencion() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  const params = new URLSearchParams();
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
  if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);
  const qs = params.toString();
  if (!qs) {
    listadoAtenciones.value = [];
    return;
  }
  try {
    const res = await getAllIpress(`/pacienteAtencion/?${qs}`);
    listadoAtenciones.value = atencionesParaListadoRegistros(
      Array.isArray(res) ? res : res?.results || []
    );
  } catch (e) {
    console.error('Error al cargar atenciones:', e);
    listadoAtenciones.value = [];
  }
}

function abrirModalNuevo() {
  if (!formularioAbierto.value) return;
  registroEdicion.value = null;
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  form3ModalKey.value += 1;
  fetchPacientesAtencion();
  mostrarModalNuevo.value = true;
}

function abrirModalEditar(registro) {
  if (!formularioAbierto.value || !registro) return;
  const paciente = pacienteDesdeRegistro(registro);
  const idAtencion = idAtencionDesdeRegistro(registro);
  if (!paciente || idAtencion == null) {
    ElMessage.error('No se pudo cargar el paciente del registro.');
    return;
  }
  registroEdicion.value = registro;
  pacienteParaFormulario.value = paciente;
  idPacienteAtencionParaForm.value = idAtencion;
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  form3ModalKey.value += 1;
  mostrarModalNuevo.value = true;
}

async function eliminarRegistro(registro) {
  if (!formularioAbierto.value || !registro?.id_evento_acceso_vascular) return;
  if (registroDePacienteEgresado(registro, listadoAtenciones.value)) {
    ElMessage.warning('Paciente egresado: solo se puede editar el registro.');
    return;
  }
  const nombre = nombrePaciente(registro);
  const confirmar = window.confirm(`¿Eliminar el evento infeccioso de ${nombre}?`);
  if (!confirmar) return;
  eliminandoId.value = registro.id_evento_acceso_vascular;
  try {
    await deleteAllIpress(`/eventosAccesosVasculares/${registro.id_evento_acceso_vascular}/`);
    ElMessage.success('Registro eliminado correctamente.');
    await fetchRegistros();
  } catch (e) {
    console.error('Error al eliminar evento infeccioso:', e);
    ElMessage.error('No se pudo eliminar el registro.');
  } finally {
    eliminandoId.value = null;
  }
}

function confirmarPacienteYMostrarFormulario() {
  const id = idPacienteSeleccionado.value;
  const atencion = listadoAtenciones.value.find((a) => a.id_paciente_atencion === id || String(a.id_paciente_atencion) === String(id));
  if (atencion?.datosPaciente) {
    pacienteParaFormulario.value = atencion.datosPaciente;
    idPacienteAtencionParaForm.value = atencion.id_paciente_atencion ?? id;
    form3ModalKey.value += 1;
  }
}

function cerrarModalNuevo() {
  mostrarModalNuevo.value = false;
  registroEdicion.value = null;
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  fetchRegistros();
}

function onGuardado() {
  cerrarModalNuevo();
}

function abrirModalImportar() {
  archivoSeleccionado.value = null;
  resultadoImportacion.value = null;
  mostrarModalImportar.value = true;
}
function cerrarModalImportar() {
  mostrarModalImportar.value = false;
  archivoSeleccionado.value = null;
  resultadoImportacion.value = null;
  arrastrando.value = false;
  fetchRegistros();
}
function descargarFormatoExcel() {
  const ws = XLSX.utils.aoa_to_sheet([COLUMNAS_FORMATO, ['', '', '', '', '', '', '']]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Eventos infecciosos');
  XLSX.writeFile(wb, 'formato_eventos_infecciosos.xlsx');
}
function onSeleccionarArchivo(ev) {
  const file = ev.target.files?.[0];
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    archivoSeleccionado.value = file;
    resultadoImportacion.value = null;
  }
  ev.target.value = '';
}
function onDropArchivo(ev) {
  arrastrando.value = false;
  const file = ev.dataTransfer?.files?.[0];
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    archivoSeleccionado.value = file;
    resultadoImportacion.value = null;
  }
}
function leerFilasExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}
async function ejecutarImportacion() {
  const file = archivoSeleccionado.value;
  if (!file) return;
  importando.value = true;
  resultadoImportacion.value = null;
  try {
    const rows = await leerFilasExcel(file);
    if (rows.length < 2) {
      resultadoImportacion.value = { ok: false, mensaje: 'El archivo no tiene filas de datos.' };
      importando.value = false;
      return;
    }
    const headers = rows[0].map((h) => String(h ?? '').trim().toLowerCase().replace(/\s+/g, '_'));
    const dataRows = rows.slice(1).filter((r) => r.some((c) => c != null && String(c).trim() !== ''));
    let creados = 0,
      errores = 0;
    for (const row of dataRows) {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] != null ? String(row[i]).trim() : ''));
      const idAtencion = obj.id_paciente_atencion ? Number(obj.id_paciente_atencion) : null;
      if (!idAtencion) {
        errores++;
        continue;
      }
      try {
        await postAllIpress('/eventosAccesosVasculares/', {
          id_paciente_atencion: idAtencion,
          tipo_infeccion: obj.tipo_infeccion || '',
          fecha_evento: obj.fecha_evento || '',
          antmicrobial: obj.antmicrobial || '',
          vancomicina: obj.vancomicina || '',
          hemocultivo_positivo: obj.hemocultivo_positivo || '',
          germen: obj.germen || '',
        });
        creados++;
      } catch (e) {
        errores++;
      }
    }
    resultadoImportacion.value = { ok: true, mensaje: `Importación completada: ${creados} registro(s) creado(s).` + (errores ? ` ${errores} fila(s) con error.` : '') };
    fetchRegistros();
  } catch (e) {
    console.error(e);
    resultadoImportacion.value = { ok: false, mensaje: 'Error al procesar el archivo.' };
  } finally {
    importando.value = false;
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  fetchRegistros();
  fetchEstadoFormulario();
}, { deep: true });
onMounted(() => {
  fetchRegistros();
  fetchEstadoFormulario();
});
</script>

<style scoped>
.tabla-ei {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

.tabla-ei-th,
.tabla-ei-td {
  white-space: nowrap;
  padding: 0.375rem 0.75rem;
  font-size: 0.6875rem;
  line-height: 1.25;
}

.tabla-ei-th {
  text-align: left;
  font-size: 0.625rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tabla-ei-badge {
  font-size: 0.625rem;
}

.tabla-ei-col-comentario {
  min-width: 10rem;
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tabla-ei-th-acciones,
.tabla-ei-td-acciones {
  text-align: right;
}

.tabla-ei-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tabla-ei-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.tabla-ei-btn-editar {
  border: 1px solid #a5f3fc;
  color: #0e7490;
  background: transparent;
}

.tabla-ei-btn-editar:hover:not(:disabled) {
  background: #ecfeff;
}

.tabla-ei-btn-eliminar {
  border: 1px solid #fecdd3;
  color: #be123c;
  background: transparent;
}

.tabla-ei-btn-eliminar:hover:not(:disabled) {
  background: #fff1f2;
}

.tabla-ei-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 0.375rem;
  border: 1px solid #fecdd3;
  color: #be123c;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tabla-ei-btn-icon:hover:not(:disabled) {
  background: #fff1f2;
}

.tabla-ei-btn-icon:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.header-accion-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
}

.header-accion-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.header-accion-btn-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.header-accion-btn-secundario {
  border: 1px solid #cbd5e1;
  color: #334155;
  background: #fff;
}

.header-accion-btn-secundario:hover:not(:disabled) {
  background: #f8fafc;
}

.header-accion-btn-primario {
  border: 1px solid #475569;
  color: #fff;
  background: #475569;
}

.header-accion-btn-primario:hover:not(:disabled) {
  background: #334155;
}
</style>
