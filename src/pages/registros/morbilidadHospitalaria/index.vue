<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-[100rem] mx-auto w-full">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
            Morbimorbilidad
          </h1>
          <p class="text-slate-500 mt-1 text-sm">Registros de morbilidad hospitalaria por periodo, IPRESS y modalidad.</p>
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
            :disabled="!puedeExportarMorbilidadExcel || exportandoExcel"
            :title="puedeExportarMorbilidadExcel ? 'Exporta la vista actual (todos los registros del filtro)' : 'No hay datos para exportar con los filtros actuales'"
            @click="exportarDatosMorbilidadExcel"
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
          :class="vistaActiva === 'registros' ? 'bg-white text-cyan-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'registros'"
        >
          Solo con registros
        </button>
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'todos' ? 'bg-white text-cyan-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'todos'"
        >
          Todos los pacientes
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <template v-else-if="vistaActiva === 'registros'">
          <div v-if="registros.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay registros de morbilidad hospitalaria para el periodo, IPRESS y modalidad seleccionados.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="tabla-morbilidad divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="tabla-morbilidad-th">Paciente</th>
                  <th class="tabla-morbilidad-th">DNI</th>
                  <th class="tabla-morbilidad-th tabla-morbilidad-col-diagnostico">Diagnóstico</th>
                  <th class="tabla-morbilidad-th">Código</th>
                  <th class="tabla-morbilidad-th">F. hospitalización</th>
                  <th class="tabla-morbilidad-th">F. alta</th>
                  <th class="tabla-morbilidad-th">Desenlace</th>
                  <th class="tabla-morbilidad-th">Fuente</th>
                  <th class="tabla-morbilidad-th">Estado</th>
                  <th class="tabla-morbilidad-th">Editado sup.</th>
                  <th class="tabla-morbilidad-th tabla-morbilidad-col-comentario">Comentario sup.</th>
                  <th class="tabla-morbilidad-th tabla-morbilidad-th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in registrosPaginados" :key="r.id_morbilidad_hospitalaria" class="hover:bg-slate-50 transition-colors">
                  <td class="tabla-morbilidad-td font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ documentoPaciente(r) }}</td>
                  <td class="tabla-morbilidad-td tabla-morbilidad-col-diagnostico text-slate-600" :title="r.diagnostico || ''">{{ r.diagnostico || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ r.codigo_diagnostico || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fechaCelda(r.fecha_hospitalizacion) }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ r.fecha_alta_hospitalizacion || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ r.desenlace || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ r.fuente || '—' }}</td>
                  <td class="tabla-morbilidad-td">
                    <span class="tabla-morbilidad-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span>
                  </td>
                  <td class="tabla-morbilidad-td">
                    <span v-if="r.supervisor_edito_registro" class="tabla-morbilidad-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="tabla-morbilidad-td tabla-morbilidad-col-comentario text-slate-600" :title="r.comentario_evaluacion || ''">{{ r.comentario_evaluacion?.trim() || '—' }}</td>
                  <td class="tabla-morbilidad-td tabla-morbilidad-td-acciones">
                    <div class="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        class="tabla-morbilidad-btn tabla-morbilidad-btn-editar"
                        :disabled="!formularioAbierto"
                        :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                        @click="abrirModalEditar(r)"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        class="tabla-morbilidad-btn tabla-morbilidad-btn-eliminar"
                        :disabled="!formularioAbierto || eliminandoId === r.id_morbilidad_hospitalaria"
                        :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                        @click="eliminarRegistro(r)"
                      >
                        {{ eliminandoId === r.id_morbilidad_hospitalaria ? '…' : 'Eliminar' }}
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
            <table class="tabla-morbilidad divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="tabla-morbilidad-th">Paciente</th>
                  <th class="tabla-morbilidad-th">DNI</th>
                  <th class="tabla-morbilidad-th tabla-morbilidad-col-diagnostico">Diagnóstico</th>
                  <th class="tabla-morbilidad-th">Código</th>
                  <th class="tabla-morbilidad-th">F. hospitalización</th>
                  <th class="tabla-morbilidad-th">F. alta</th>
                  <th class="tabla-morbilidad-th">Desenlace</th>
                  <th class="tabla-morbilidad-th">Fuente</th>
                  <th class="tabla-morbilidad-th">Estado</th>
                  <th class="tabla-morbilidad-th">Editado sup.</th>
                  <th class="tabla-morbilidad-th tabla-morbilidad-col-comentario">Comentario sup.</th>
                  <th class="tabla-morbilidad-th tabla-morbilidad-th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="fila in todosPacientesPaginados" :key="fila.id_paciente_atencion" class="hover:bg-slate-50 transition-colors" :class="{ 'bg-amber-50/50': !fila.tieneRegistro }">
                  <td class="tabla-morbilidad-td font-medium text-slate-800">{{ fila.paciente || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fila.documento || '—' }}</td>
                  <td class="tabla-morbilidad-td tabla-morbilidad-col-diagnostico text-slate-600" :title="fila.diagnostico || ''">{{ fila.diagnostico || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fila.codigo_diagnostico || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fechaCelda(fila.fecha_hospitalizacion) }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fechaCelda(fila.fecha_alta_hospitalizacion) }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fila.desenlace || '—' }}</td>
                  <td class="tabla-morbilidad-td text-slate-600">{{ fila.fuente || '—' }}</td>
                  <td class="tabla-morbilidad-td">
                    <span class="tabla-morbilidad-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(fila.estado_aprobacion)">{{ fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO') }}</span>
                  </td>
                  <td class="tabla-morbilidad-td">
                    <span v-if="fila.supervisor_edito_registro" class="tabla-morbilidad-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="tabla-morbilidad-td tabla-morbilidad-col-comentario text-slate-600" :title="fila.comentario_evaluacion || ''">{{ fila.comentario_evaluacion?.trim() || '—' }}</td>
                  <td class="tabla-morbilidad-td tabla-morbilidad-td-acciones">
                    <div v-if="fila.tieneRegistro" class="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        class="tabla-morbilidad-btn tabla-morbilidad-btn-editar"
                        :disabled="!formularioAbierto"
                        :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                        @click="abrirModalEditar(fila.registro)"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        class="tabla-morbilidad-btn tabla-morbilidad-btn-eliminar"
                        :disabled="!formularioAbierto || eliminandoId === fila.id_morbilidad_hospitalaria"
                        :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                        @click="eliminarRegistro(fila.registro)"
                      >
                        {{ eliminandoId === fila.id_morbilidad_hospitalaria ? '…' : 'Eliminar' }}
                      </button>
                    </div>
                    <span v-else class="text-slate-400">—</span>
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
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white flex items-center gap-2">
            {{ tituloModalFormulario }}
          </h3>
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
                  <div class="flex items-center justify-between gap-2">
                    <div class="text-sm font-medium text-slate-800">{{ p.datosPaciente?.paciente || 'Sin nombre' }}</div>
                    <span
                      v-if="registroPendienteAltaPorAtencion(p.id_paciente_atencion)"
                      class="shrink-0 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase"
                    >
                      Sin alta
                    </span>
                  </div>
                  <div class="text-xs text-slate-500">DNI: {{ p.datosPaciente?.documento || '—' }}</div>
                </button>
              </div>
            </div>
            <p class="text-xs text-slate-500">Pacientes con atención en el periodo, IPRESS y modalidad actuales.</p>
            <p
              v-if="idPacienteSeleccionado && registroPendienteAltaPorAtencion(idPacienteSeleccionado)"
              class="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
            >
              Este paciente tiene una hospitalización sin fecha de alta. Se abrirá ese registro para completarla.
            </p>
            <p
              v-else-if="idPacienteSeleccionado && ultimoRegistroPaciente(idPacienteSeleccionado)"
              class="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
            >
              La última hospitalización ya tiene fecha de alta. Se abrirá un registro nuevo vacío.
            </p>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalNuevo">Cancelar</button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50"
                :disabled="!idPacienteSeleccionado"
                @click="confirmarPacienteYMostrarFormulario"
              >
                Continuar al formulario
              </button>
            </div>
          </div>
          <div v-else>
            <Form4
              :key="form4ModalKey"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumero"
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
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white">Importar Morbilidad Hospitalaria</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalImportar">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <p class="text-sm text-slate-600">Descargue el formato en Excel, complételo y cárguelo aquí.</p>
          <button type="button" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-cyan-200 text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50" @click="descargarFormatoExcel">Descargar formato Excel</button>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Cargar archivo Excel</label>
            <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="onDropArchivo" :class="arrastrando ? 'border-cyan-400 bg-cyan-50/50' : ''">
              <input ref="inputArchivoImportar" type="file" accept=".xlsx,.xls" class="hidden" @change="onSeleccionarArchivo" />
              <p class="text-slate-500 text-sm mb-2">Arrastre el archivo o</p>
              <button type="button" class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300" @click="inputArchivoImportar?.click()">Seleccionar archivo</button>
              <p v-if="archivoSeleccionado" class="mt-3 text-sm font-medium text-cyan-600">{{ archivoSeleccionado.name }}</p>
            </div>
          </div>
          <div v-if="importando" class="text-center text-slate-500 text-sm">Importando...</div>
          <div v-if="resultadoImportacion" class="rounded-lg p-3 text-sm" :class="resultadoImportacion.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">{{ resultadoImportacion.mensaje }}</div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalImportar">Cerrar</button>
            <button type="button" class="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50" :disabled="!archivoSeleccionado || importando" @click="ejecutarImportacion">Importar datos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import { getAllIpress, postAllIpress, deleteAllIpress } from '@/services/ipress/Ipress.service';
import { atencionesParaListadoRegistros, indexarRegistrosPorAtencionYPaciente, registroParaAtencionActiva } from '@/composables/useAtencionesRegistro';
import { useBloqueoNotificacionRevision } from '@/composables/useBloqueoNotificacionRevision';
import { fechaCelda } from '@/utils/fechaFormat';
import Form4 from '@/components/forms/Form4.vue';
import TablaPaginacion from '@/components/TablaPaginacion.vue';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const { bloqueadoPorNotificacion, mensajeBloqueoNotificacion } = useBloqueoNotificacionRevision();
const route = useRoute();
const router = useRouter();

const NUMERO_FORMULARIO_MORBILIDAD = 3;

const registros = ref([]);
const cargando = ref(false);
const mostrarModalNuevo = ref(false);
const vistaActiva = ref('registros');
const listadoAtenciones = ref([]);
const idPacienteSeleccionado = ref('');
const busquedaPaciente = ref('');
const pacienteParaFormulario = ref(null);
const idPacienteAtencionParaForm = ref(null);
const registroEdicion = ref(null);
const form4ModalKey = ref(0);
const eliminandoId = ref(null);
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

const exportandoExcel = ref(false);

const puedeExportarMorbilidadExcel = computed(() => {
  if (cargando.value) return false;
  if (vistaActiva.value === 'registros') return registros.value.length > 0;
  return todosPacientesLista.value.length > 0;
});

function filasExcelMorbilidadVistaRegistros() {
  return registros.value.map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    Diagnóstico: r.diagnostico || '',
    Código: r.codigo_diagnostico || '',
    'F. hospitalización': r.fecha_hospitalizacion || '',
    'F. alta': r.fecha_alta_hospitalizacion || '',
    Desenlace: r.desenlace || '',
    Fuente: r.fuente || '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
    'Editado supervisor': r.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': r.comentario_evaluacion || '',
  }));
}

function filasExcelMorbilidadVistaTodos() {
  return todosPacientesLista.value.map((fila) => ({
    Paciente: fila.paciente || '',
    DNI: fila.documento || '',
    'Tiene registro': fila.tieneRegistro ? 'Sí' : 'No',
    Diagnóstico: fila.diagnostico || '',
    Código: fila.codigo_diagnostico || '',
    'F. hospitalización': fila.fecha_hospitalizacion || '',
    'F. alta': fila.fecha_alta_hospitalizacion || '',
    Desenlace: fila.desenlace || '',
    Fuente: fila.fuente || '',
    Estado: fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO'),
    'Editado supervisor': fila.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': fila.comentario_evaluacion || '',
  }));
}

async function exportarDatosMorbilidadExcel() {
  if (!puedeExportarMorbilidadExcel.value) {
    ElMessage.warning('No hay datos para exportar con los filtros actuales.');
    return;
  }
  exportandoExcel.value = true;
  try {
    const esRegistros = vistaActiva.value === 'registros';
    const rows = esRegistros ? filasExcelMorbilidadVistaRegistros() : filasExcelMorbilidadVistaTodos();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Morbilidad hospitalaria');
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const sufijo = esRegistros ? 'solo_registros' : 'todos_pacientes';
    XLSX.writeFile(wb, `morbilidad_hospitalaria_${sufijo}_${stamp}.xlsx`);
    ElMessage.success(`Se exportaron ${rows.length} fila(s).`);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo generar el archivo Excel.');
  } finally {
    exportandoExcel.value = false;
  }
}

const COLUMNAS_FORMATO = ['id_paciente_atencion', 'diagnostico', 'codigo_diagnostico', 'fecha_hospitalizacion', 'fecha_alta_hospitalizacion', 'desenlace', 'fuente'];

function normalizarDesenlace(valor) {
  const texto = String(valor ?? '').trim();
  if (!texto) return '';
  const mapa = { alta: 'Alta', fallecimiento: 'Fallecimiento' };
  return mapa[texto.toLowerCase()] || texto;
}

const periodoNumero = computed(() => {
  const v = periodoGlobal.value;
  if (v == null || v === '') return null;
  return Number(v);
});

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}
function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}

function registroTieneAlta(registro) {
  const fecha = String(registro?.fecha_alta_hospitalizacion ?? '').trim();
  if (!fecha) return false;
  return /^\d{4}-\d{2}-\d{2}/.test(fecha);
}

function registrosPorAtencion(idAtencion) {
  const id = String(idAtencion);
  return (Array.isArray(registros.value) ? registros.value : [])
    .filter((r) => String(r.id_paciente_atencion ?? r.datosPacienteAtencion?.id_paciente_atencion) === id)
    .sort((a, b) => (Number(b.id_morbilidad_hospitalaria) || 0) - (Number(a.id_morbilidad_hospitalaria) || 0));
}

function ultimoRegistroPaciente(idAtencion) {
  const lista = registrosPorAtencion(idAtencion);
  return lista[0] || null;
}

function registroPendienteAltaPorAtencion(idAtencion) {
  const ultimo = ultimoRegistroPaciente(idAtencion);
  if (!ultimo || registroTieneAlta(ultimo)) return null;
  return ultimo;
}

const tituloModalFormulario = computed(() => {
  if (registroEdicion.value) return 'Editar registro de Morbilidad Hospitalaria';
  if (pacienteParaFormulario.value && idPacienteAtencionParaForm.value != null) {
    if (registroPendienteAltaPorAtencion(idPacienteAtencionParaForm.value)) {
      return 'Completar hospitalización sin fecha de alta';
    }
    return 'Nuevo registro de Morbilidad Hospitalaria';
  }
  return 'Nuevo registro de Morbilidad Hospitalaria';
});

function estadoAprobacionClase(estado) {
  const valor = String(estado || '').toUpperCase();
  if (valor === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (valor === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  if (valor === 'SIN REGISTRO') return 'bg-slate-100 text-slate-500';
  return 'bg-amber-100 text-amber-700';
}

const pacientesDisponibles = computed(() => Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : []);
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
  const { porAtencion, porPaciente } = indexarRegistrosPorAtencionYPaciente(regs, 'id_morbilidad_hospitalaria');
  return atenciones.map((a) => {
    const id = a.id_paciente_atencion;
    const r = registroParaAtencionActiva(a, porAtencion, porPaciente);
    const paciente = a.datosPaciente?.paciente ?? '—';
    const documento = a.datosPaciente?.documento ?? '—';
    if (r) {
      return {
        id_paciente_atencion: id,
        id_morbilidad_hospitalaria: r.id_morbilidad_hospitalaria,
        tieneRegistro: true,
        registro: r,
        paciente: nombrePaciente(r),
        documento: documentoPaciente(r),
        diagnostico: r.diagnostico || '',
        codigo_diagnostico: r.codigo_diagnostico || '',
        fecha_hospitalizacion: r.fecha_hospitalizacion || '',
        fecha_alta_hospitalizacion: r.fecha_alta_hospitalizacion || '',
        desenlace: r.desenlace || '',
        fuente: r.fuente || '',
        estado_aprobacion: r.estado_aprobacion || 'PENDIENTE',
        supervisor_edito_registro: !!r.supervisor_edito_registro,
        comentario_evaluacion: r.comentario_evaluacion || '',
      };
    }
    return {
      id_paciente_atencion: id,
      tieneRegistro: false,
      paciente,
      documento,
      diagnostico: '',
      codigo_diagnostico: '',
      fecha_hospitalizacion: '',
      fecha_alta_hospitalizacion: '',
      desenlace: '',
      fuente: '',
      estado_aprobacion: 'SIN REGISTRO',
      supervisor_edito_registro: false,
      comentario_evaluacion: '',
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
      numero_formulario: NUMERO_FORMULARIO_MORBILIDAD,
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
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/pacienteAtencion/?${qs}`),
    ]);
    registros.value = Array.isArray(resReg) ? resReg : resReg?.results || [];
    listadoAtenciones.value = atencionesParaListadoRegistros(
      Array.isArray(resAten) ? resAten : resAten?.results || []
    );
  } catch (e) {
    console.error('Error al cargar morbilidades hospitalarias:', e);
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

function abrirModalNuevo() {
  if (!formularioAbierto.value) return;
  registroEdicion.value = null;
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  form4ModalKey.value += 1;
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
  form4ModalKey.value += 1;
  mostrarModalNuevo.value = true;
}

async function eliminarRegistro(registro) {
  if (!formularioAbierto.value || !registro?.id_morbilidad_hospitalaria) return;
  const nombre = nombrePaciente(registro);
  const confirmar = window.confirm(`¿Eliminar el registro de morbilidad hospitalaria de ${nombre}?`);
  if (!confirmar) return;
  eliminandoId.value = registro.id_morbilidad_hospitalaria;
  try {
    await deleteAllIpress(`/morbilidadesHospitalarias/${registro.id_morbilidad_hospitalaria}/`);
    ElMessage.success('Registro eliminado correctamente.');
    await fetchRegistros();
  } catch (e) {
    console.error('Error al eliminar morbilidad hospitalaria:', e);
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
    form4ModalKey.value += 1;
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

function onGuardado(payload = {}) {
  cerrarModalNuevo();
  const efecto = String(payload?.efectoMovimiento || '').trim();
  if (efecto === '1') {
    ElMessage.success('Registro guardado. Se generaron egreso y reingreso automáticamente.');
  } else if (efecto === '2') {
    ElMessage.success('Registro guardado. Se generó el egreso automáticamente.');
  } else if (efecto === '3') {
    ElMessage.success('Registro guardado sin generar egreso.');
  }
}

async function abrirFormularioDesdeEgreso(idPacienteAtencion) {
  if (idPacienteAtencion == null || idPacienteAtencion === '') return;
  if (!formularioAbierto.value) {
    ElMessage.warning('El formulario de Morbilidad Hospitalaria está cerrado para este periodo.');
    return;
  }

  try {
    await fetchRegistros();

    const pendiente = registroPendienteAltaPorAtencion(idPacienteAtencion);
    if (pendiente) {
      abrirModalEditar(pendiente);
      return;
    }

    const atencion = await getAllIpress(`/pacienteAtencion/${idPacienteAtencion}/`);
    const paciente = atencion?.datosPaciente;
    if (!paciente) {
      ElMessage.error('No se encontró la atención del paciente.');
      return;
    }

    registroEdicion.value = null;
    pacienteParaFormulario.value = paciente;
    idPacienteAtencionParaForm.value = Number(idPacienteAtencion);
    idPacienteSeleccionado.value = '';
    busquedaPaciente.value = '';
    form4ModalKey.value += 1;
    mostrarModalNuevo.value = true;
  } catch (e) {
    console.error('Error al abrir formulario desde egreso:', e);
    ElMessage.error('No se pudo abrir el formulario de hospitalización.');
  }
}

async function procesarQueryEgresoHospitalizacion() {
  const abrir = route.query.abrirFormulario === '1';
  const idAtencion = route.query.idPacienteAtencion;
  if (!abrir || idAtencion == null || idAtencion === '') return;

  await abrirFormularioDesdeEgreso(idAtencion);

  const query = { ...route.query };
  delete query.abrirFormulario;
  delete query.idPacienteAtencion;
  delete query.idPaciente;
  router.replace({ query });
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
  XLSX.utils.book_append_sheet(wb, ws, 'Morbilidad hospitalaria');
  XLSX.writeFile(wb, 'formato_morbilidad_hospitalaria.xlsx');
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
        await postAllIpress('/morbilidadesHospitalarias/', {
          id_paciente_atencion: idAtencion,
          diagnostico: obj.diagnostico || '',
          codigo_diagnostico: obj.codigo_diagnostico || '',
          fecha_hospitalizacion: obj.fecha_hospitalizacion || '',
          fecha_alta_hospitalizacion: obj.fecha_alta_hospitalizacion || null,
          desenlace: normalizarDesenlace(obj.desenlace) || null,
          fuente: obj.fuente || '',
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

watch(
  () => [route.query.abrirFormulario, route.query.idPacienteAtencion],
  () => {
    procesarQueryEgresoHospitalizacion();
  },
);

onMounted(async () => {
  await Promise.all([fetchRegistros(), fetchEstadoFormulario()]);
  await procesarQueryEgresoHospitalizacion();
});
</script>

<style scoped>
.tabla-morbilidad {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

.tabla-morbilidad-th,
.tabla-morbilidad-td {
  white-space: nowrap;
  padding: 0.625rem 1.25rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  vertical-align: middle;
}

.tabla-morbilidad-th {
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tabla-morbilidad-badge {
  font-size: 0.6875rem;
}

.tabla-morbilidad-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1rem;
  transition: background-color 0.15s, color 0.15s;
}

.tabla-morbilidad-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.tabla-morbilidad-btn-editar {
  border: 1px solid #a5f3fc;
  color: #0e7490;
  background: transparent;
}

.tabla-morbilidad-btn-editar:hover:not(:disabled) {
  background: #ecfeff;
}

.tabla-morbilidad-btn-eliminar {
  border: 1px solid #fecdd3;
  color: #be123c;
  background: transparent;
}

.tabla-morbilidad-btn-eliminar:hover:not(:disabled) {
  background: #fff1f2;
}

.tabla-morbilidad-th-acciones,
.tabla-morbilidad-td-acciones {
  text-align: right;
}

.tabla-morbilidad-col-diagnostico {
  min-width: 14rem;
}

.tabla-morbilidad-col-comentario {
  min-width: 12rem;
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
  border: 1px solid #0891b2;
  color: #fff;
  background: #0891b2;
}

.header-accion-btn-primario:hover:not(:disabled) {
  background: #0e7490;
}
</style>
