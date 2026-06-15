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

    <!-- Lista: rf_pacientes_dialisis filtrada por IPRESS + periodo (+ modalidad global), con búsqueda por nombre y documento -->
    <div class="bg-white border rounded-xl shadow-sm p-4 mb-4">
      <h3 class="text-sm font-semibold text-slate-700 mb-3">Pacientes en atención (clínica y periodo) — incluye sin ficha de diálisis aún</h3>
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
      <p v-if="idIpress == null || idPerido == null" class="text-sm text-amber-600">
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
              <th class="text-left px-2 py-2 font-semibold min-w-[140px]">Paciente</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. nac.</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Sexo</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Grado</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Mod. TRR</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. inicio TRR</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Subsistema</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Tipo acceso</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Localización</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. creac. acceso</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. 1er ingreso</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">F. ingreso hosp.</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Hosp. proced.</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Etiología</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap">Comorb.</th>
              <th class="text-left px-2 py-2 font-semibold whitespace-nowrap sticky right-0 bg-slate-100">Acciones</th>
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
              <td class="px-2 py-2">
                {{ celda(row.datosPaciente?.paciente) }}
                <span
                  v-if="row.sin_registro_dialisis"
                  class="ml-1 block mt-0.5 text-[10px] font-semibold uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded w-fit"
                  title="Tiene atención en el periodo pero aún no tiene ficha en diálisis"
                >Sin ficha diálisis</span>
              </td>
              <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.datosPaciente?.fecha_nacimiento) }}</td>
              <td class="px-2 py-2 whitespace-nowrap">{{ generoTexto(row.datosPaciente?.genero) }}</td>
              <td class="px-2 py-2 max-w-[90px] truncate" :title="row.datosPaciente?.grado_instruccion">{{ celda(row.datosPaciente?.grado_instruccion) }}</td>
              <td class="px-2 py-2 max-w-[110px] truncate" :title="row.modalidad_inicio_trr">{{ celda(row.modalidad_inicio_trr) }}</td>
              <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_inicio_trr) }}</td>
              <td class="px-2 py-2 max-w-[100px] truncate" :title="row.subsistema_salud">{{ celda(row.subsistema_salud) }}</td>
              <td class="px-2 py-2 max-w-[130px] truncate" :title="tipoAccesoTexto(row.tipo_acceso)">{{ tipoAccesoTexto(row.tipo_acceso) }}</td>
              <td class="px-2 py-2 max-w-[130px] truncate" :title="row.localizacion_acceso_inicio">{{ celda(row.localizacion_acceso_inicio) }}</td>
              <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_creacion_acceso) }}</td>
              <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_primer_ingreso) }}</td>
              <td class="px-2 py-2 whitespace-nowrap">{{ fechaCelda(row.fecha_ingreso_hospital) }}</td>
              <td class="px-2 py-2 max-w-[120px] truncate" :title="row.hospital_procedencia_trr">{{ celda(row.hospital_procedencia_trr) }}</td>
              <td class="px-2 py-2 max-w-[140px] truncate" :title="etiologiaTexto(row)">{{ etiologiaTexto(row) }}</td>
              <td class="px-2 py-2 max-w-[120px] truncate" :title="comorbilidadesTexto(row)">{{ comorbilidadesTexto(row) }}</td>
              <td class="px-2 py-2 sticky right-0 bg-white group-hover:bg-slate-50">
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
                 <!--  <button type="button" class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 inline-flex items-center gap-1" :title="tooltipFormulario(row, 1)" @click="abrirFormulario(row, 1)">
                    Acceso
                    <span v-if="metaFormulario(row, 1)?.supervisor_edito_registro" class="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0" title="Registro corregido por supervisor" />
                  </button>
                  <button type="button" class="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 inline-flex items-center gap-1" :title="tooltipFormulario(row, 2)" @click="abrirFormulario(row, 2)">
                    Infecc.
                    <span v-if="metaFormulario(row, 2)?.supervisor_edito_registro" class="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0" title="Registro corregido por supervisor" />
                  </button>
                  <button type="button" class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 inline-flex items-center gap-1" :title="tooltipFormulario(row, 3)" @click="abrirFormulario(row, 3)">
                    Morb.
                    <span v-if="metaFormulario(row, 3)?.supervisor_edito_registro" class="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0" title="Registro corregido por supervisor" />
                  </button>
                  <button type="button" class="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 hover:bg-indigo-200 inline-flex items-center gap-1" :title="tooltipFormulario(row, 4)" @click="abrirFormulario(row, 4)">
                    Result.
                    <span v-if="metaFormulario(row, 4)?.supervisor_edito_registro" class="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0" title="Registro corregido por supervisor" />
                  </button>
                  <button type="button" class="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 inline-flex items-center gap-1" :title="tooltipFormulario(row, 5)" @click="abrirFormulario(row, 5)">
                    Vacun.
                    <span v-if="metaFormulario(row, 5)?.supervisor_edito_registro" class="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0" title="Registro corregido por supervisor" />
                  </button> -->
                </div>
              </td>
            </tr>
            <tr v-if="!pacientes.length">
              <td colspan="18" class="px-3 py-8 text-center text-gray-500">
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
    </div>

    <div class="flex items-center gap-4 my-4 border-t pt-4">
      <button
        type="button"
        class="bg-sky-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-600 transition"
        @click="abrirModalConsultaDocumento"
      >
        Consultar Paciente
      </button>
    </div>

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

    <!-- Modal: registro nuevo o edición supervisor (ficha diálisis) -->
    <div v-if="mostrarModalNuevo || mostrarModalEdicionSupervisor" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <FormularioPaciente
          :key="claveModalFormularioPaciente"
          :periodo-inicial="periodoSeleccionado"
          :id-periodo-ipress-inicial="idPeriodoIpress"
          :id-clinica-inicial="idClinicaSeleccionada"
          :nombre-clinica-inicial="clinicaSeleccionada"
          :mostrar-tabla-edicion="false"
          :numero-documento-inicial="mostrarModalEdicionSupervisor ? '' : documentoPrefillRegistro"
          :id-paciente-edicion-supervisor="mostrarModalEdicionSupervisor ? (filaEdicionSupervisor?.datosPaciente?.id_paciente ?? null) : null"
          :id-paciente-dialisis-edicion-supervisor="mostrarModalEdicionSupervisor ? (filaEdicionSupervisor?.id_paciente_dialisis ?? null) : null"
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
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';
import { tipoAccesoDesdeDb } from '@/utils/unidadesActualesPayload';
import FormularioPaciente from './FormularioPaciente.vue';

const LISTA_TIPOS_ACCESO = [
  { id: '1', label: 'Catéter Venoso Central Temporal' },
  { id: '2', label: 'Catéter Venoso Central de Larga Permanencia' },
  { id: '3', label: 'Fístula Arteriovenosa' },
  { id: '4', label: 'Injerto Autólogo' },
  { id: '5', label: 'Injerto Protésico' },
  { id: '6', label: 'Catéter peritoneal' },
];

const COMORBILIDADES_CAMPOS = [
  ['enf_insuficiencia_cardiaca_congestiva', 'ICC'],
  ['enf_diabetes', 'Diabetes'],
  ['enf_ateroesclerotica_cardiaca', 'Aterosclerosis'],
  ['enf_hipertension', 'HTA'],
  ['enf_vascular_periferica', 'Vasc. perif.'],
  ['enf_tuberculosis', 'TBC'],
  ['enf_cerebro_vascular', 'ACV'],
  ['enf_cancer', 'Cáncer'],
  ['enf_otra', 'Otra'],
];

function celda(val) {
  const s = val != null && String(val).trim() !== '' ? String(val).trim() : '';
  return s || '—';
}

function parseFechaAISO(value) {
  const s = String(value ?? '').trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const dmY = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmY) {
    const d = dmY[1].padStart(2, '0');
    const m = dmY[2].padStart(2, '0');
    const y = dmY[3];
    return `${y}-${m}-${d}`;
  }
  return null;
}

function formatFechaDDMMAAAA(value) {
  const iso = parseFechaAISO(value);
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

function fechaCelda(val) {
  if (val == null || String(val).trim() === '') return '—';
  return formatFechaDDMMAAAA(val) || String(val).trim();
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

// Estado global: periodo, clínica (ipress) y modalidad (si el layout los provee)
const router = useRouter();
const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const filtroNombre = ref("");
const filtroDni = ref("");
const cargandoPacientes = ref(false);
let debounceFiltrosTimer = null;
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/** Solo perfil Supervisor (mismo criterio que menú lateral). */
const esSupervisor = computed(() => {
  const p = String(user.value?.datosPerfil?.perfil ?? localStorage.getItem('perfil') ?? '').trim();
  return p === 'Supervisor';
});

const pacientes = ref([])

// --- Paginación ---
const paginaActual = ref(1)
const pacientesPorPagina = ref(10)

// Lista desde API (filtros nombre/documento en servidor con debounce)
const pacientesFiltrados = computed(() => pacientes.value);

const etiologiaTexto = (row) => {
  const e = row?.datosEti;
  if (!e) return '—';
  const partes = [e.general, e.especifica || e.codigo].filter((x) => x != null && String(x).trim() !== '');
  return partes.length ? partes.join(' — ') : '—';
};

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
    const [resUnidades, resEventos, resMorb, resResultados, idPeriodoIpress] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${qs}`),
      getAllIpress(`/eventosAccesosVasculares/?${qs}`),
      getAllIpress(`/morbilidadesHospitalarias/?${qs}`),
      getAllIpress(`/resultadosClinicos/?${qs}`),
      resolverIdPeriodoIpress(idPeriodo, idIpress),
    ]);
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

watch(pacientes, () => {
  paginaActual.value = 1;
});

watch(pacientesPorPagina, () => {
  paginaActual.value = 1;
});

watch(totalPaginas, (tp) => {
  if (paginaActual.value > tp) paginaActual.value = tp;
});

const state1 = ref('')
const aplicaTodos = ref(true)

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

  fetchPacientes();
  fetchMetaFormulariosPorAtencion();
}

const fetchPacientes = async () => {
  const ipressId = clinicaGlobal.value ?? idIpress.value;
  const periodoId = periodoGlobal.value ?? idPerido.value;
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
    const respuesta = await getAllIpress(`/listado_pacientes_dialisis_por_ipress_periodo/?${params.toString()}`);
    pacientes.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
  } catch (error) {
    console.error('Error al obtener lista de pacientes diálisis:', error);
    pacientes.value = [];
  } finally {
    cargandoPacientes.value = false;
  }
};

/** Consulta al backend con debounce al escribir en los filtros. */
const aplicarFiltrosBusqueda = () => {
  const ipressId = clinicaGlobal.value ?? idIpress.value;
  const periodoId = periodoGlobal.value ?? idPerido.value;
  if (ipressId == null || ipressId === '' || periodoId == null || periodoId === '') return;

  paginaActual.value = 1;
  clearTimeout(debounceFiltrosTimer);
  debounceFiltrosTimer = setTimeout(() => {
    fetchPacientes();
  }, 350);
};

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
const mostrarModalEdicionSupervisor = ref(false);
const filaEdicionSupervisor = ref(null);

/** Precarga documento en FormularioPaciente al abrir tras “no encontrado”. */
const documentoPrefillRegistro = ref('');

const claveModalFormularioPaciente = computed(() => {
  if (mostrarModalEdicionSupervisor.value && filaEdicionSupervisor.value) {
    const idp = filaEdicionSupervisor.value?.datosPaciente?.id_paciente ?? 'x';
    const idd = filaEdicionSupervisor.value?.id_paciente_dialisis ?? 'x';
    return `ed-sup-${idp}-${idd}`;
  }
  return `nuevo-${documentoPrefillRegistro.value || 'vacío'}`;
});

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
  mostrarModalEdicionSupervisor.value = false;
  filaEdicionSupervisor.value = null;
  documentoPrefillRegistro.value = '';
};

const cerrarModalNuevo = () => {
  cerrarModalFormularioPaciente();
};

const abrirEdicionSupervisor = (row) => {
  if (row?.sin_registro_dialisis || !row?.id_paciente_dialisis) return;
  documentoPrefillRegistro.value = '';
  mostrarModalNuevo.value = false;
  filaEdicionSupervisor.value = row;
  mostrarModalEdicionSupervisor.value = true;
};

const onGuardadoFormularioPaciente = async () => {
  cerrarModalFormularioPaciente();
  await fetchPacientes();
  await fetchMetaFormulariosPorAtencion();
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
  mostrarModalEdicionSupervisor.value = false;
  filaEdicionSupervisor.value = null;
  mostrarModalNuevo.value = true;
};

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], async () => {
  await searchPeriodoIpress();
  fetchEstadisticasAtencion();
  fetchEstadisticasRegistros();
}, { deep: true });

onMounted(async () => {
  await fetchPeriodoIpress();
  await fetchIpress();
  fetchPeriodo();
  await searchPeriodoIpress();
  fetchEstadisticasAtencion();
  fetchEstadisticasRegistros();
});
</script>

<style scoped>
/* Estilos sin cambios */
</style>