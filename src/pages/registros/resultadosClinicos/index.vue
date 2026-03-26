<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
            Resultados Clínicos
          </h1>
          <p class="text-slate-500 mt-1 text-sm">Registros de resultados clínicos por periodo, IPRESS y modalidad.</p>
          <div class="mt-3 flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado del formulario</span>
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
              :class="formularioAbierto ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
            >
              {{ cargandoEstadoFormulario ? 'Consultando...' : estadoFormularioTexto }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 border border-cyan-300 text-cyan-700 font-semibold rounded-lg shadow-sm hover:bg-cyan-50 transition-colors"
            @click="descargarFormatoExcel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar formato
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-45 disabled:pointer-events-none"
            :disabled="!puedeExportarResultadosClinicosExcel || exportandoExcel"
            :title="puedeExportarResultadosClinicosExcel ? 'Exporta la vista actual (Solo con registros o Todos los pacientes)' : (vistaActiva === 'cargas' ? 'Cambie a la pestaña de registros o pacientes para exportar' : 'No hay datos para exportar con los filtros actuales')"
            @click="exportarDatosResultadosClinicosExcel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ exportandoExcel ? 'Exportando…' : 'Exportar Excel' }}
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            @click="abrirModalImportar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar
          </button>
          <button
            v-if="mostrarBotonNuevo"
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg shadow-sm hover:bg-cyan-700 transition-colors"
            @click="abrirModalNuevo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'cargas' ? 'bg-white text-cyan-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'cargas'"
        >
          Cargas
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <template v-else-if="vistaActiva === 'registros'">
          <div v-if="registros.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay registros de resultados clínicos para el periodo, IPRESS y modalidad seleccionados.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hb</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Calcio</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fósforo</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">PTHi</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Alb</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Kt/V</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">T. diálisis (h)</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Eritropoyetina</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hierro</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Calcitriol</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Editado sup.</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Comentario sup.</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in registrosPaginados" :key="r.id_resultado_clinico" class="hover:bg-slate-50 transition-colors">
                  <td class="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.Hb ?? r.hb ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.calcio ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.fosforo ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.PTHi ?? r.pthi ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.Alb ?? r.alb ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ r.ktv ?? r.kt ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600 tabular-nums">{{ formatearTiempoDialisisTabla(r.tiempo_dialisis) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ siNo(r.eritoproyetina) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ siNo(r.hierro) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ siNo(r.calcitriol) }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="estadoAprobacionClase(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span v-if="r.supervisor_edito_registro" class="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-600 max-w-[180px] truncate" :title="r.comentario_evaluacion || ''">{{ textoComentarioSupervisor(r.comentario_evaluacion) }}</td>
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
        <template v-else-if="vistaActiva === 'todos'">
          <div v-if="todosPacientesLista.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay pacientes en el periodo, IPRESS y modalidad seleccionados.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hb</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Calcio</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fósforo</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">PTHi</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Alb</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Kt/V</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">T. diálisis (h)</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Eritropoyetina</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hierro</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Calcitriol</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Editado sup.</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Comentario sup.</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="fila in todosPacientesPaginados" :key="fila.id_paciente_atencion" class="hover:bg-slate-50 transition-colors" :class="{ 'bg-amber-50/50': !fila.tieneRegistro }">
                  <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ fila.paciente || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.documento || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.Hb ?? fila.hb ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.calcio ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.fosforo ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.PTHi ?? fila.pthi ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.Alb ?? fila.alb ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ fila.ktv ?? '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600 tabular-nums">{{ formatearTiempoDialisisTabla(fila.tiempo_dialisis) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ siNo(fila.eritoproyetina) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ siNo(fila.hierro) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ siNo(fila.calcitriol) }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" :class="estadoAprobacionClase(fila.estado_aprobacion)">{{ fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO') }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm">
                    <span v-if="fila.supervisor_edito_registro" class="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-600 max-w-[180px] truncate" :title="fila.comentario_evaluacion || ''">{{ textoComentarioSupervisor(fila.comentario_evaluacion) }}</td>
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
        <template v-else>
          <div v-if="historialCargas.length === 0" class="p-12 text-center text-slate-500 italic">
            Aun no hay cargas de Excel registradas.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Archivo</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Periodo</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Clinica</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Modalidad</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Filas</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Guardadas</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Errores</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="carga in historialCargasPaginados"
                  :key="carga.id"
                  class="hover:bg-slate-50 transition-colors cursor-pointer"
                  @click="abrirDetalleCarga(carga)"
                >
                  <td class="px-4 py-3 text-sm text-slate-700">{{ carga.fecha }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ carga.archivo }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ carga.periodo || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ carga.clinica || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ carga.modalidad || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ carga.totalFilas }}</td>
                  <td class="px-4 py-3 text-sm text-green-700 font-semibold">{{ carga.guardadas }}</td>
                  <td class="px-4 py-3 text-sm text-red-700 font-semibold">{{ carga.errores }}</td>
                </tr>
              </tbody>
            </table>
            </div>
            <TablaPaginacion
              v-model:page="paginaHistorialCargas"
              v-model:page-size="pageSizeTablas"
              :page-size-options="[PAGE_SIZE_TABLAS]"
              hide-page-size-selector
              :total="historialCargas.length"
            />
          </template>
        </template>
      </div>
    </div>

    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white flex items-center gap-2">Nuevo registro de Resultados Clínicos</h3>
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
                class="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50"
                :disabled="!idPacienteSeleccionado"
                @click="confirmarPacienteYMostrarFormulario"
              >
                Continuar al formulario
              </button>
            </div>
          </div>
          <div v-else>
            <Form5
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumero"
              :id-paciente-atencion="idPacienteAtencionParaForm"
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
          <h3 class="font-bold text-white">Importar Resultados Clínicos</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalImportar">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <p class="text-sm text-slate-600">Cargue el Excel completado. La importación valida rangos clínicos, el DNI del paciente según el filtro actual y el tiempo de diálisis en <strong>horas</strong> (número entero o decimal, p. ej. 2, 2.5, 3.25) entre 0,25 y 8.</p>
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

    <div v-if="mostrarDetalleCarga && cargaSeleccionada" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-white">Detalle de carga</h3>
            <p class="text-cyan-100 text-sm">{{ cargaSeleccionada.archivo }} | {{ cargaSeleccionada.fecha }}</p>
          </div>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarDetalleCarga">✕</button>
        </div>
        <div class="p-6 overflow-auto">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div class="text-xs uppercase font-bold text-slate-500">Periodo</div>
              <div class="text-sm font-semibold text-slate-800 mt-1">{{ cargaSeleccionada.periodo || '—' }}</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div class="text-xs uppercase font-bold text-slate-500">Clinica</div>
              <div class="text-sm font-semibold text-slate-800 mt-1">{{ cargaSeleccionada.clinica || '—' }}</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div class="text-xs uppercase font-bold text-slate-500">Modalidad</div>
              <div class="text-sm font-semibold text-slate-800 mt-1">{{ cargaSeleccionada.modalidad || '—' }}</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div class="text-xs uppercase font-bold text-slate-500">Resultado</div>
              <div class="text-sm font-semibold text-slate-800 mt-1">{{ cargaSeleccionada.guardadas }} guardadas / {{ cargaSeleccionada.errores }} errores</div>
            </div>
          </div>
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Hb</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Calcio</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fosforo</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">PTHi</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Alb</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Kt/V</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="(detalle, index) in detallesCargaPaginados"
                  :key="`${cargaSeleccionada.id}-${(paginaDetalleCarga - 1) * PAGE_SIZE_TABLAS + index}`"
                >
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.dni || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.paciente || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.Hb || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.calcio || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.fosforo || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.PTHi || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.Alb || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.ktv || '—' }}</td>
                  <td class="px-4 py-3 text-sm font-semibold" :class="detalle.guardado ? 'text-green-700' : 'text-red-700'">
                    {{ detalle.guardado ? 'Guardado' : 'Error' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.mensaje }}</td>
                </tr>
              </tbody>
            </table>
            <TablaPaginacion
              v-model:page="paginaDetalleCarga"
              v-model:page-size="pageSizeTablas"
              :page-size-options="[PAGE_SIZE_TABLAS]"
              hide-page-size-selector
              :total="totalDetallesCargaSeleccionada"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { getAllIpress, postAllIpress } from '@/services/ipress/Ipress.service';
import Form5 from '@/components/forms/Form5.vue';
import TablaPaginacion from '@/components/TablaPaginacion.vue';

const HISTORIAL_CARGAS_KEY = 'resultados_clinicos_historial_cargas';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const NUMERO_FORMULARIO_RESULTADOS = 4;

const registros = ref([]);
const cargando = ref(false);
const mostrarModalNuevo = ref(false);
const vistaActiva = ref('todos');
const listadoAtenciones = ref([]);
const periodos = ref([]);
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
const historialCargas = ref([]);
const mostrarDetalleCarga = ref(false);
const cargaSeleccionada = ref(null);
const estadoFormulario = ref('CERRADO');
const cargandoEstadoFormulario = ref(false);

const PAGE_SIZE_TABLAS = 10;
const pageSizeTablas = ref(PAGE_SIZE_TABLAS);
const paginaRegistros = ref(1);
const paginaTodos = ref(1);
const paginaHistorialCargas = ref(1);
const paginaDetalleCarga = ref(1);

const formularioAbierto = computed(() => estadoFormulario.value === 'ABIERTO');
const estadoFormularioTexto = computed(() => (formularioAbierto.value ? 'Abierto' : 'Cerrado'));
const mostrarBotonNuevo = computed(() => formularioAbierto.value);

const COLUMNAS_FORMATO = [
  'dni',
  'paciente',
  'Hb',
  'calcio',
  'fosforo',
  'PTHi',
  'Alb',
  'calcio_corregido',
  'ktv',
  'tiempo_dialisis',
  'eritropoyetina',
  'hierro',
  'calcitriol',
];
/** Horas de sesión (entero o decimal); mismo criterio que Form5. */
const TIEMPO_DIALISIS_MIN = 0.25;
const TIEMPO_DIALISIS_MAX = 8;

function esTiempoDialisisValorValido(raw) {
  if (raw === null || raw === '') return false;
  const texto = String(raw).trim().replace(',', '.');
  if (!texto) return false;
  const n = Number(texto);
  if (Number.isNaN(n)) return false;
  return n >= TIEMPO_DIALISIS_MIN && n <= TIEMPO_DIALISIS_MAX;
}
const camposResultados = [
  { key: 'Hb', min: 1, max: 18 },
  { key: 'calcio', min: 1, max: 15 },
  { key: 'fosforo', min: 1, max: 12 },
  { key: 'PTHi', min: 1, max: 5000 },
  { key: 'Alb', min: 1, max: 6 },
  { key: 'calcio_corregido', min: 1, max: 15 },
  { key: 'ktv', min: 0.1, max: 3.0 },
];

const periodoNumero = computed(() => {
  const v = periodoGlobal.value;
  if (v == null || v === '') return null;
  return Number(v);
});

const periodoActualTexto = computed(() => {
  const item = periodos.value.find((periodo) => String(periodo.id_periodo) === String(periodoNumero.value));
  return item?.periodo || '—';
});

const clinicaActualTexto = computed(() => {
  const atencion = listadoAtenciones.value[0];
  return atencion?.datosIpress?.nombre_corto || atencion?.datosIpress?.ipress || '—';
});

const modalidadActualTexto = computed(() => {
  const equivalencias = {
    1: 'Hemodialisis',
    2: 'Dialisis Peritoneal',
    3: 'Trasplante',
  };
  return equivalencias[Number(modalidadGlobal.value)] || '—';
});

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}
function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}
function siNo(val) {
  if (val === true || val === 'true' || val === 'Sí' || val === 1) return 'Sí';
  if (val === false || val === 'false' || val === 'No' || val === 0) return 'No';
  return '—';
}
function toBool(val) {
  if (val === true || val === 'true' || val === 'Sí' || val === '1' || val === 1) return true;
  if (val === false || val === 'false' || val === 'No' || val === '0' || val === 0) return false;
  return false;
}

function estadoAprobacionClase(estado) {
  const valor = String(estado || '').toUpperCase();
  if (valor === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (valor === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  if (valor === 'SIN REGISTRO') return 'bg-slate-100 text-slate-500';
  return 'bg-amber-100 text-amber-700';
}

function textoComentarioSupervisor(text) {
  const s = String(text || '').trim();
  if (!s) return '—';
  return s.length > 64 ? `${s.slice(0, 64)}…` : s;
}

/** Muestra tiempo de diálisis como horas numéricas (2, 2.5), no como HH:MM:SS de la BD. */
function formatearHorasDecimal(num) {
  if (num == null || Number.isNaN(num)) return '—';
  const x = Number(num);
  if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x));
  const r = Math.round(x * 100) / 100;
  return String(r);
}

function formatearTiempoDialisisTabla(val) {
  if (val == null || val === '') return '—';
  if (typeof val === 'object' && val !== null && ('hour' in val || 'hours' in val)) {
    const h = val.hour ?? val.hours ?? 0;
    const m = val.minute ?? val.minutes ?? 0;
    const s = val.second ?? val.seconds ?? 0;
    return formatearHorasDecimal(h + m / 60 + s / 3600);
  }
  const str = String(val).trim();
  if (!str) return '—';
  if (/^\d{1,2}:\d{2}(:\d{2})?(\.\d+)?$/.test(str)) {
    const parts = str.split(':');
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const secPart = parts[2] != null ? String(parts[2]) : '0';
    const sec = parseFloat(secPart) || 0;
    return formatearHorasDecimal(h + m / 60 + sec / 3600);
  }
  const n = Number(str.replace(',', '.'));
  if (!Number.isNaN(n)) return formatearHorasDecimal(n);
  return str;
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

const cargarHistorialCargas = () => {
  try {
    const data = localStorage.getItem(HISTORIAL_CARGAS_KEY);
    historialCargas.value = data ? JSON.parse(data) : [];
  } catch {
    historialCargas.value = [];
  }
};

const guardarHistorialCargas = () => {
  localStorage.setItem(HISTORIAL_CARGAS_KEY, JSON.stringify(historialCargas.value));
};

const abrirDetalleCarga = (carga) => {
  cargaSeleccionada.value = carga;
  paginaDetalleCarga.value = 1;
  mostrarDetalleCarga.value = true;
};

const cerrarDetalleCarga = () => {
  mostrarDetalleCarga.value = false;
  cargaSeleccionada.value = null;
  paginaDetalleCarga.value = 1;
};

/** Alineado con backend: columna TIME en BD; Excel puede mandar número 2 o texto "2"/"2.5". */
function normalizarTiempoDialisisParaApi(raw) {
  if (raw == null || raw === '') return '';
  if (typeof raw === 'number' && !Number.isNaN(raw)) {
    return normalizarTiempoDialisisParaApi(String(raw));
  }
  let s = String(raw).trim().replace(',', '.');
  if (!s) return '';
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) {
    const parts = s.split(':');
    if (parts.length === 2) {
      return `${String(Number(parts[0])).padStart(2, '0')}:${String(Number(parts[1])).padStart(2, '0')}:00`;
    }
    return `${String(Number(parts[0])).padStart(2, '0')}:${String(Number(parts[1])).padStart(2, '0')}:${String(Number(parts[2] || 0)).padStart(2, '0')}`;
  }
  const horas = parseFloat(s);
  if (Number.isNaN(horas)) return s;
  const totalMin = Math.round(horas * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

const esBooleanoValido = (valor) => ['', '1', '0', 'si', 'sí', 'no', 'true', 'false'].includes(String(valor || '').trim().toLowerCase());

const normalizarNumero = (valor) => {
  const texto = String(valor ?? '').trim().replace(',', '.');
  if (!texto) return null;
  const numero = Number(texto);
  return Number.isNaN(numero) ? null : numero;
};

async function fetchPeriodos() {
  try {
    const respuesta = await getAllIpress('/periodos/');
    periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
  } catch {
    periodos.value = [];
  }
}

const todosPacientesLista = computed(() => {
  const atenciones = Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : [];
  const regs = Array.isArray(registros.value) ? registros.value : [];
  const porAtencion = {};
  regs.forEach((r) => {
    const id = r.id_paciente_atencion ?? r.datosPacienteAtencion?.id_paciente_atencion;
    if (id == null) return;
    const k = String(id);
    const prev = porAtencion[k];
    const rid = Number(r.id_resultado_clinico) || 0;
    if (!prev || rid > (Number(prev.id_resultado_clinico) || 0)) porAtencion[k] = r;
  });
  return atenciones.map((a) => {
    const id = a.id_paciente_atencion;
    const r = id != null ? porAtencion[String(id)] : null;
    const paciente = a.datosPaciente?.paciente ?? '—';
    const documento = a.datosPaciente?.documento ?? '—';
    if (r) {
      return {
        id_paciente_atencion: id,
        tieneRegistro: true,
        paciente: nombrePaciente(r),
        documento: documentoPaciente(r),
        Hb: r.Hb ?? r.hb,
        calcio: r.calcio,
        fosforo: r.fosforo,
        PTHi: r.PTHi ?? r.pthi,
        Alb: r.Alb ?? r.alb,
        ktv: r.ktv,
        tiempo_dialisis: r.tiempo_dialisis,
        eritoproyetina: r.eritoproyetina,
        hierro: r.hierro,
        calcitriol: r.calcitriol,
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
      Hb: '',
      calcio: '',
      fosforo: '',
      PTHi: '',
      Alb: '',
      ktv: '',
      tiempo_dialisis: '',
      eritoproyetina: null,
      hierro: null,
      calcitriol: null,
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
const historialCargasPaginados = computed(() => {
  const all = historialCargas.value;
  const start = (paginaHistorialCargas.value - 1) * PAGE_SIZE_TABLAS;
  return all.slice(start, start + PAGE_SIZE_TABLAS);
});
const detallesCargaPaginados = computed(() => {
  const all = cargaSeleccionada.value?.detalles;
  if (!Array.isArray(all)) return [];
  const start = (paginaDetalleCarga.value - 1) * PAGE_SIZE_TABLAS;
  return all.slice(start, start + PAGE_SIZE_TABLAS);
});
const totalDetallesCargaSeleccionada = computed(() => {
  const all = cargaSeleccionada.value?.detalles;
  return Array.isArray(all) ? all.length : 0;
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
function clampPaginaHistorialCargas() {
  const total = historialCargas.value.length;
  const maxP = Math.max(1, Math.ceil(total / PAGE_SIZE_TABLAS) || 1);
  if (paginaHistorialCargas.value > maxP) paginaHistorialCargas.value = maxP;
}
function clampPaginaDetalleCarga() {
  const total = totalDetallesCargaSeleccionada.value;
  const maxP = Math.max(1, Math.ceil(total / PAGE_SIZE_TABLAS) || 1);
  if (paginaDetalleCarga.value > maxP) paginaDetalleCarga.value = maxP;
}

watch(registros, () => clampPaginaRegistros(), { deep: true });
watch(todosPacientesLista, () => clampPaginaTodos());
watch(historialCargas, () => clampPaginaHistorialCargas(), { deep: true });
watch(totalDetallesCargaSeleccionada, () => clampPaginaDetalleCarga());
watch(() => vistaActiva.value, () => {
  paginaRegistros.value = 1;
  paginaTodos.value = 1;
  paginaHistorialCargas.value = 1;
});

const exportandoExcel = ref(false);

const puedeExportarResultadosClinicosExcel = computed(() => {
  if (cargando.value) return false;
  if (vistaActiva.value === 'cargas') return false;
  if (vistaActiva.value === 'registros') return registros.value.length > 0;
  return todosPacientesLista.value.length > 0;
});

function filasExcelResultadosVistaRegistros() {
  return registros.value.map((r) => {
    const tDial = formatearTiempoDialisisTabla(r.tiempo_dialisis);
    return {
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    Hb: r.Hb ?? r.hb ?? '',
    Calcio: r.calcio ?? '',
    Fósforo: r.fosforo ?? '',
    PTHi: r.PTHi ?? r.pthi ?? '',
    Alb: r.Alb ?? r.alb ?? '',
    'Kt/V': r.ktv ?? r.kt ?? '',
    'T. diálisis (h)': tDial === '—' ? '' : tDial,
    Eritropoyetina: siNo(r.eritoproyetina),
    Hierro: siNo(r.hierro),
    Calcitriol: siNo(r.calcitriol),
    Estado: r.estado_aprobacion || 'PENDIENTE',
    'Editado supervisor': r.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': r.comentario_evaluacion || '',
  };
  });
}

function filasExcelResultadosVistaTodos() {
  return todosPacientesLista.value.map((fila) => {
    const tDial = formatearTiempoDialisisTabla(fila.tiempo_dialisis);
    return {
    Paciente: fila.paciente || '',
    DNI: fila.documento || '',
    'Tiene registro': fila.tieneRegistro ? 'Sí' : 'No',
    Hb: fila.Hb ?? fila.hb ?? '',
    Calcio: fila.calcio ?? '',
    Fósforo: fila.fosforo ?? '',
    PTHi: fila.PTHi ?? fila.pthi ?? '',
    Alb: fila.Alb ?? fila.alb ?? '',
    'Kt/V': fila.ktv ?? '',
    'T. diálisis (h)': tDial === '—' ? '' : tDial,
    Eritropoyetina: siNo(fila.eritoproyetina),
    Hierro: siNo(fila.hierro),
    Calcitriol: siNo(fila.calcitriol),
    Estado: fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO'),
    'Editado supervisor': fila.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': fila.comentario_evaluacion || '',
  };
  });
}

async function exportarDatosResultadosClinicosExcel() {
  if (!puedeExportarResultadosClinicosExcel.value) {
    if (vistaActiva.value === 'cargas') {
      ElMessage.warning('Cambie a «Solo con registros» o «Todos los pacientes» para exportar.');
    } else {
      ElMessage.warning('No hay datos para exportar con los filtros actuales.');
    }
    return;
  }
  exportandoExcel.value = true;
  try {
    const esRegistros = vistaActiva.value === 'registros';
    const rows = esRegistros ? filasExcelResultadosVistaRegistros() : filasExcelResultadosVistaTodos();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados clínicos');
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const sufijo = esRegistros ? 'solo_registros' : 'todos_pacientes';
    XLSX.writeFile(wb, `resultados_clinicos_${sufijo}_${stamp}.xlsx`);
    ElMessage.success(`Se exportaron ${rows.length} fila(s).`);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo generar el archivo Excel.');
  } finally {
    exportandoExcel.value = false;
  }
}

const validarFilaImportacion = (obj) => {
  const dni = String(obj.dni || '').trim();
  const pacienteTexto = String(obj.paciente || '').trim();

  if (!dni) return { ok: false, mensaje: 'Falta el DNI del paciente.' };

  const atencion = listadoAtenciones.value.find((item) => String(item.datosPaciente?.documento || '').trim() === dni);
  if (!atencion) {
    return { ok: false, mensaje: 'El DNI no pertenece a un paciente visible en el filtro actual.' };
  }

  if (pacienteTexto && String(atencion.datosPaciente?.paciente || '').trim().toLowerCase() !== pacienteTexto.toLowerCase()) {
    return { ok: false, mensaje: 'El nombre no coincide con el DNI indicado.' };
  }

  const payload = {
    id_paciente_atencion: Number(atencion.id_paciente_atencion),
    Hb: '',
    calcio: '',
    fosforo: '',
    PTHi: '',
    Alb: '',
    calcio_corregido: '',
    ktv: '',
    tiempo_dialisis: '',
    /** Nombre del modelo Django / API (no «eritropoyetina»). */
    eritoproyetina: false,
    hierro: false,
    calcitriol: false,
  };

  for (const campo of camposResultados) {
    const valor = normalizarNumero(obj[campo.key.toLowerCase()] ?? obj[campo.key]);
    if (valor === null) continue;
    if (valor < campo.min || valor > campo.max) {
      return { ok: false, mensaje: `${campo.key} debe estar entre ${campo.min} y ${campo.max}.` };
    }
    payload[campo.key] = String(valor);
  }

  /** Si no vino calcio_corregido en Excel pero sí calcio y Alb, misma fórmula que Form5. */
  if (!String(payload.calcio_corregido || '').trim()) {
    const c = normalizarNumero(obj.calcio ?? obj.Calcio);
    const a = normalizarNumero(obj.alb ?? obj.Alb);
    if (c != null && a != null && c > 0 && a > 0) {
      payload.calcio_corregido = String(Math.round((c + 0.8 * (4 - a)) * 100) / 100);
    }
  }

  const rawTiempo = obj.tiempo_dialisis;
  const tiempoStrParaValidar =
    rawTiempo != null && rawTiempo !== '' ? String(rawTiempo).trim().replace(',', '.') : '';
  if (tiempoStrParaValidar && !esTiempoDialisisValorValido(rawTiempo)) {
    return {
      ok: false,
      mensaje: `Tiempo de diálisis inválido. Use un número entre ${TIEMPO_DIALISIS_MIN} y ${TIEMPO_DIALISIS_MAX} horas (ej. 2, 2.5, 3.25).`,
    };
  }
  payload.tiempo_dialisis = tiempoStrParaValidar
    ? normalizarTiempoDialisisParaApi(rawTiempo)
    : '';

  const valErit = obj.eritropoyetina ?? obj.eritoproyetina;
  if (!esBooleanoValido(valErit) || !esBooleanoValido(obj.hierro) || !esBooleanoValido(obj.calcitriol)) {
    return { ok: false, mensaje: 'Eritropoyetina, hierro y calcitriol deben ser Si/No o 1/0.' };
  }

  payload.eritoproyetina = toBool(valErit);
  payload.hierro = toBool(obj.hierro);
  payload.calcitriol = toBool(obj.calcitriol);

  return {
    ok: true,
    payload,
    detalle: {
      dni,
      paciente: atencion.datosPaciente?.paciente || pacienteTexto || '—',
      Hb: payload.Hb,
      calcio: payload.calcio,
      fosforo: payload.fosforo,
      PTHi: payload.PTHi,
      Alb: payload.Alb,
      ktv: payload.ktv,
    },
  };
};

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
      numero_formulario: NUMERO_FORMULARIO_RESULTADOS,
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
    listadoAtenciones.value = [];
    return;
  }
  cargando.value = true;
  try {
    const [resReg, resAten] = await Promise.all([
      getAllIpress(`/resultadosClinicos/?${qs}`),
      getAllIpress(`/pacienteAtencion/?${qs}`),
    ]);
    registros.value = Array.isArray(resReg) ? resReg : resReg?.results || [];
    listadoAtenciones.value = Array.isArray(resAten) ? resAten : resAten?.results || [];
  } catch (e) {
    console.error('Error al cargar resultados clínicos:', e);
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
    listadoAtenciones.value = Array.isArray(res) ? res : res?.results || [];
  } catch (e) {
    console.error('Error al cargar atenciones:', e);
    listadoAtenciones.value = [];
  }
}

function abrirModalNuevo() {
  if (!formularioAbierto.value) return;
  pacienteParaFormulario.value = null;
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  fetchPacientesAtencion();
  mostrarModalNuevo.value = true;
}

function confirmarPacienteYMostrarFormulario() {
  const id = idPacienteSeleccionado.value;
  const atencion = listadoAtenciones.value.find((a) => a.id_paciente_atencion === id || String(a.id_paciente_atencion) === String(id));
  if (atencion?.datosPaciente) {
    pacienteParaFormulario.value = atencion.datosPaciente;
    idPacienteAtencionParaForm.value = atencion.id_paciente_atencion ?? id;
  }
}

function cerrarModalNuevo() {
  mostrarModalNuevo.value = false;
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
  const filasBase = todosPacientesLista.value.map((fila) => [
    fila.documento || '',
    fila.paciente || '',
    '', // Hb
    '', // calcio
    '', // fosforo
    '', // PTHi
    '', // Alb
    '', // calcio_corregido (opcional; con calcio+Alb se calcula al importar)
    '', // ktv
    '', // tiempo_dialisis
    'Sí/No',
    'Sí/No',
    'Sí/No',
  ]);
  const ws = XLSX.utils.aoa_to_sheet([COLUMNAS_FORMATO, ...filasBase]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Resultados clínicos');
  XLSX.writeFile(wb, 'formato_resultados_clinicos.xlsx');
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
  if (!periodoNumero.value || !clinicaGlobal.value || !modalidadGlobal.value) {
    resultadoImportacion.value = { ok: false, mensaje: 'Seleccione periodo, clinica y modalidad antes de importar.' };
    return;
  }
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
    const detalles = [];
    for (const row of dataRows) {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] != null ? String(row[i]).trim() : ''));
      const validacion = validarFilaImportacion(obj);
      if (!validacion.ok) {
        detalles.push({
          dni: obj.dni || '',
          paciente: obj.paciente || '',
          Hb: obj.hb || obj.Hb || '',
          calcio: obj.calcio || '',
          fosforo: obj.fosforo || '',
          PTHi: obj.pthi || obj.PTHi || '',
          Alb: obj.alb || obj.Alb || '',
          ktv: obj.ktv || '',
          guardado: false,
          mensaje: validacion.mensaje,
        });
        errores++;
        continue;
      }
      try {
        await postAllIpress('/resultadosClinicos/', validacion.payload);
        detalles.push({
          ...validacion.detalle,
          guardado: true,
          mensaje: 'Registro guardado correctamente.',
        });
        creados++;
      } catch (e) {
        detalles.push({
          ...validacion.detalle,
          guardado: false,
          mensaje: e?.error || 'Error al guardar el registro.',
        });
        errores++;
      }
    }
    historialCargas.value = [
      {
        id: Date.now(),
        fecha: new Date().toLocaleString(),
        archivo: file.name,
        periodo: periodoActualTexto.value,
        clinica: clinicaActualTexto.value,
        modalidad: modalidadActualTexto.value,
        totalFilas: dataRows.length,
        guardadas: creados,
        errores,
        detalles,
      },
      ...historialCargas.value,
    ];
    guardarHistorialCargas();
    const msgExito = `Importación completada: ${creados} registro(s) creado(s).` + (errores ? ` ${errores} fila(s) con error.` : '');
    await fetchRegistros();
    if (creados > 0) {
      mostrarModalImportar.value = false;
      archivoSeleccionado.value = null;
      resultadoImportacion.value = null;
      arrastrando.value = false;
      await Swal.fire({
        icon: 'success',
        title: 'Importación exitosa',
        text: msgExito,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0891b2',
      });
    } else {
      resultadoImportacion.value = { ok: true, mensaje: msgExito };
    }
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
  cargarHistorialCargas();
  fetchPeriodos();
  fetchRegistros();
  fetchEstadoFormulario();
});
</script>

<style scoped>
</style>
