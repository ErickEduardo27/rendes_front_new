<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-[100rem] mx-auto w-full">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-[#008f9c] rounded-full"></span>
            Serología y Vacunación
          </h1>
          <p class="text-slate-500 mt-1 text-sm">
            Registros de serología y vacunación por periodo, IPRESS y modalidad.
          </p>
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
            :disabled="!puedeExportarVacunacionExcel || exportandoExcel"
            :title="puedeExportarVacunacionExcel ? 'Exporta la vista actual (todos los registros del filtro)' : 'No hay datos para exportar con los filtros actuales'"
            @click="exportarDatosVacunacionExcel"
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
          :class="vistaActiva === 'registros' ? 'bg-white text-[#008f9c] border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'registros'"
        >
          Solo con registros
        </button>
        <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'todos' ? 'bg-white text-[#008f9c] border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'todos'"
        >
          Todos los pacientes
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <template v-else-if="vistaActiva === 'registros'">
          <div v-if="registros.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay registros de vacunación para el periodo, IPRESS y modalidad seleccionados.
          </div>
          <template v-else>
            <div class="overflow-x-auto">
            <table class="tabla-vac divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="tabla-vac-th">Paciente</th>
                  <th class="tabla-vac-th">DNI</th>
                  <th class="tabla-vac-th">VHB</th>
                  <th class="tabla-vac-th">VHC</th>
                  <th class="tabla-vac-th">VIH</th>
                  <th class="tabla-vac-th">Título AcHBs</th>
                  <th class="tabla-vac-th">Dosis Hep. B</th>
                  <th class="tabla-vac-th">Dosis Covid</th>
                  <th class="tabla-vac-th">F. Influenza</th>
                  <th class="tabla-vac-th">F. Neumococo</th>
                  <th class="tabla-vac-th">Estado</th>
                  <th class="tabla-vac-th">Editado sup.</th>
                  <th class="tabla-vac-th">Comentario sup.</th>
                  <th class="tabla-vac-th tabla-vac-th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in registrosPaginados" :key="r.id_vacunacion" class="hover:bg-slate-50 transition-colors">
                  <td class="tabla-vac-td font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ documentoPaciente(r) }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.vhb ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.vhc ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.vih ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.titulo_acHbs ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.dosis_hepatitis_b ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.dosis_covid ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.fecha_influenza ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ r.fecha_neumococo ?? '—' }}</td>
                  <td class="tabla-vac-td">
                    <span class="tabla-vac-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span>
                  </td>
                  <td class="tabla-vac-td">
                    <span v-if="r.supervisor_edito_registro" class="tabla-vac-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="tabla-vac-td tabla-vac-col-comentario text-slate-600" :title="r.comentario_evaluacion || ''">{{ r.comentario_evaluacion?.trim() || '—' }}</td>
                  <td class="tabla-vac-td tabla-vac-td-acciones">
                    <div class="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        class="tabla-vac-btn tabla-vac-btn-editar"
                        :disabled="!formularioAbierto"
                        :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                        @click="abrirModalEditar(r)"
                      >
                        Editar
                      </button>
                      <button
                        v-if="!registroDePacienteEgresado(r, listadoAtenciones)"
                        type="button"
                        class="tabla-vac-btn tabla-vac-btn-eliminar"
                        :disabled="!formularioAbierto || eliminandoId === r.id_vacunacion"
                        :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                        @click="eliminarRegistro(r)"
                      >
                        {{ eliminandoId === r.id_vacunacion ? '…' : 'Eliminar' }}
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
            <table class="tabla-vac divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="tabla-vac-th">Paciente</th>
                  <th class="tabla-vac-th">DNI</th>
                  <th class="tabla-vac-th">VHB</th>
                  <th class="tabla-vac-th">VHC</th>
                  <th class="tabla-vac-th">VIH</th>
                  <th class="tabla-vac-th">Título AcHBs</th>
                  <th class="tabla-vac-th">Dosis Hep. B</th>
                  <th class="tabla-vac-th">Dosis Covid</th>
                  <th class="tabla-vac-th">F. Influenza</th>
                  <th class="tabla-vac-th">F. Neumococo</th>
                  <th class="tabla-vac-th">Estado</th>
                  <th class="tabla-vac-th">Editado sup.</th>
                  <th class="tabla-vac-th">Comentario sup.</th>
                  <th class="tabla-vac-th tabla-vac-th-acciones">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="fila in todosPacientesPaginados" :key="fila.id_paciente_atencion" class="hover:bg-slate-50 transition-colors" :class="{ 'bg-amber-50/50': !fila.tieneRegistro }">
                  <td class="tabla-vac-td font-medium text-slate-800">
                    {{ fila.paciente || '—' }}
                    <span v-if="fila.es_egresado" class="ml-1 inline text-[10px] font-semibold uppercase text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">EGRESADO</span>
                  </td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.documento || '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.vhb ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.vhc ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.vih ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.titulo_acHbs ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.dosis_hepatitis_b ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fila.dosis_covid ?? '—' }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fechaCelda(fila.fecha_influenza) }}</td>
                  <td class="tabla-vac-td text-slate-600">{{ fechaCelda(fila.fecha_neumococo) }}</td>
                  <td class="tabla-vac-td">
                    <span class="tabla-vac-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(fila.estado_aprobacion)">{{ fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO') }}</span>
                  </td>
                  <td class="tabla-vac-td">
                    <span v-if="fila.supervisor_edito_registro" class="tabla-vac-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                    <span v-else class="text-slate-400">—</span>
                  </td>
                  <td class="tabla-vac-td tabla-vac-col-comentario text-slate-600" :title="fila.comentario_evaluacion || ''">{{ fila.comentario_evaluacion?.trim() || '—' }}</td>
                  <td class="tabla-vac-td tabla-vac-td-acciones">
                    <div class="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        class="tabla-vac-btn tabla-vac-btn-historial"
                        title="Ver historial de vacunas y serología"
                        @click="abrirModalHistorialVacunas(fila)"
                      >
                        Historial
                      </button>
                      <template v-if="fila.tieneRegistro">
                        <button
                          type="button"
                          class="tabla-vac-btn tabla-vac-btn-editar"
                          :disabled="!formularioAbierto"
                          :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                          @click="abrirModalEditar(fila.registro)"
                        >
                          Editar
                        </button>
                        <button
                          v-if="!fila.es_egresado"
                          type="button"
                          class="tabla-vac-btn tabla-vac-btn-eliminar"
                          :disabled="!formularioAbierto || eliminandoId === fila.id_vacunacion"
                          :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                          @click="eliminarRegistro(fila.registro)"
                        >
                          {{ eliminandoId === fila.id_vacunacion ? '…' : 'Eliminar' }}
                        </button>
                      </template>
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

    <!-- Modal historial de vacunas del paciente -->
    <div
      v-if="mostrarModalHistorialVacunas"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="cerrarModalHistorialVacunas"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-[#008f9c] px-6 py-4 flex justify-between items-center gap-3">
          <div class="min-w-0">
            <h3 class="font-bold text-white">Historial de serología y vacunación</h3>
            <p class="text-cyan-100 text-sm truncate">
              {{ pacienteHistorialVacunas?.paciente || '—' }}
              <span v-if="pacienteHistorialVacunas?.documento"> · DNI {{ pacienteHistorialVacunas.documento }}</span>
            </p>
          </div>
          <button type="button" class="text-white/80 hover:text-white shrink-0 text-lg leading-none" aria-label="Cerrar" @click="cerrarModalHistorialVacunas">✕</button>
        </div>
        <div class="px-6 pt-4 border-b border-slate-200 bg-white">
          <div class="flex gap-1">
            <button
              type="button"
              class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
              :class="pestañaHistorial === 'vacunas' ? 'bg-white text-[#008f9c] border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
              @click="pestañaHistorial = 'vacunas'"
            >
              Historial de vacunas
            </button>
            <button
              type="button"
              class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
              :class="pestañaHistorial === 'serologia' ? 'bg-white text-[#008f9c] border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
              @click="pestañaHistorial = 'serologia'"
            >
              Historial de serología
            </button>
          </div>
        </div>
        <div class="p-6 overflow-auto">
          <div v-if="cargandoHistorialVacunas" class="py-10 text-center text-slate-500">
            Cargando historial…
          </div>
          <template v-else-if="pestañaHistorial === 'vacunas'">
            <p class="text-xs text-slate-500 mb-3">
              Vacunas registradas para este paciente (cualquier periodo), con su fecha de aplicación.
            </p>
            <div
              v-if="historialVacunasLista.length === 0"
              class="py-10 text-center text-slate-500 italic border border-dashed border-slate-200 rounded-xl bg-slate-50/50"
            >
              No hay vacunas registradas para este paciente.
            </div>
            <template v-else>
              <div class="overflow-x-auto border border-slate-200 rounded-xl">
                <table class="min-w-full divide-y divide-slate-200 text-sm">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">#</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Vacuna</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Dosis / detalle</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Fecha</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Periodo</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr
                      v-for="(item, idx) in historialVacunasPaginado"
                      :key="`${item.id_vacunacion}-${item.vacuna}-${idx}`"
                      class="hover:bg-slate-50"
                    >
                      <td class="px-3 py-2.5 text-slate-500 tabular-nums">{{ indiceHistorialVacunas(idx) }}</td>
                      <td class="px-3 py-2.5 text-slate-800 font-medium">{{ item.vacuna }}</td>
                      <td class="px-3 py-2.5 text-slate-700">{{ item.detalle || '—' }}</td>
                      <td class="px-3 py-2.5 text-slate-700 whitespace-nowrap">{{ item.fecha || '—' }}</td>
                      <td class="px-3 py-2.5 text-slate-600 whitespace-nowrap">{{ item.periodo || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm border-t border-slate-100 pt-3 mt-3">
                <div class="flex flex-wrap items-center gap-3 text-slate-600">
                  <span>{{ rangoHistorialVacunasLabel }}</span>
                  <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                    <span>Por página</span>
                    <select v-model.number="tamPaginaHistorialVacunas" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                      <option :value="5">5</option>
                      <option :value="10">10</option>
                      <option :value="25">25</option>
                    </select>
                  </label>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialVacunas <= 1" @click="paginaHistorialVacunas = 1">Primera</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialVacunas <= 1" @click="paginaHistorialVacunas--">Anterior</button>
                  <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaHistorialVacunas }} / {{ totalPaginasHistorialVacunas }}</span>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialVacunas >= totalPaginasHistorialVacunas" @click="paginaHistorialVacunas++">Siguiente</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialVacunas >= totalPaginasHistorialVacunas" @click="paginaHistorialVacunas = totalPaginasHistorialVacunas">Última</button>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <p class="text-xs text-slate-500 mb-3">
              Resultados de serología del paciente (cualquier periodo), incluyendo Título AcHBs.
            </p>
            <div
              v-if="historialSerologiaLista.length === 0"
              class="py-10 text-center text-slate-500 italic border border-dashed border-slate-200 rounded-xl bg-slate-50/50"
            >
              No hay resultados de serología registrados para este paciente.
            </div>
            <template v-else>
              <div class="overflow-x-auto border border-slate-200 rounded-xl">
                <table class="min-w-full divide-y divide-slate-200 text-sm">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">#</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Prueba</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Resultado</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Fecha</th>
                      <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Periodo</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr
                      v-for="(item, idx) in historialSerologiaPaginado"
                      :key="`${item.id_vacunacion}-${item.prueba}-${idx}`"
                      class="hover:bg-slate-50"
                    >
                      <td class="px-3 py-2.5 text-slate-500 tabular-nums">{{ indiceHistorialSerologia(idx) }}</td>
                      <td class="px-3 py-2.5 text-slate-800 font-medium">{{ item.prueba }}</td>
                      <td class="px-3 py-2.5 text-slate-700">{{ item.resultado || '—' }}</td>
                      <td class="px-3 py-2.5 text-slate-700 whitespace-nowrap">{{ item.fecha || '—' }}</td>
                      <td class="px-3 py-2.5 text-slate-600 whitespace-nowrap">{{ item.periodo || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm border-t border-slate-100 pt-3 mt-3">
                <div class="flex flex-wrap items-center gap-3 text-slate-600">
                  <span>{{ rangoHistorialSerologiaLabel }}</span>
                  <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                    <span>Por página</span>
                    <select v-model.number="tamPaginaHistorialSerologia" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                      <option :value="5">5</option>
                      <option :value="10">10</option>
                      <option :value="25">25</option>
                    </select>
                  </label>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialSerologia <= 1" @click="paginaHistorialSerologia = 1">Primera</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialSerologia <= 1" @click="paginaHistorialSerologia--">Anterior</button>
                  <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaHistorialSerologia }} / {{ totalPaginasHistorialSerologia }}</span>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialSerologia >= totalPaginasHistorialSerologia" @click="paginaHistorialSerologia++">Siguiente</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialSerologia >= totalPaginasHistorialSerologia" @click="paginaHistorialSerologia = totalPaginasHistorialSerologia">Última</button>
                </div>
              </div>
            </template>
          </template>
        </div>
        <div class="px-6 py-3 border-t border-slate-100 flex justify-end bg-slate-50/80">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
            @click="cerrarModalHistorialVacunas"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-[#008f9c] px-6 py-4 flex justify-between items-center">
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
              class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-[#008f9c] focus:border-[#008f9c]"
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
                class="px-4 py-2 text-sm font-bold text-white bg-[#008f9c] hover:bg-[#007a85] rounded-lg disabled:opacity-50"
                :disabled="!idPacienteSeleccionado"
                @click="confirmarPacienteYMostrarFormulario"
              >
                Continuar al formulario
              </button>
            </div>
          </div>
          <div v-else>
            <Form7
              :key="form7ModalKey"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumero"
              :id-periodo-ipress="idPeriodoIpress"
              :id-red="idRed"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              :clinica-nombre="clinicaActualTexto"
              :periodo-label="periodoActualTexto"
              :modalidad-nombre="modalidadActualTexto"
              @cancelar="cerrarModalNuevo"
              @guardado="onGuardado"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalImportar" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-[#008f9c] px-6 py-4 flex justify-between items-center">
          <h3 class="font-bold text-white">Importar Vacunación</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalImportar">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <p class="text-sm text-slate-600">Descargue el formato en Excel, complételo y cárguelo aquí.</p>
          <button type="button" class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#008f9c]/30 text-[#008f9c] font-semibold rounded-xl hover:bg-[#008f9c]/5" @click="descargarFormatoExcel">Descargar formato Excel</button>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2">Cargar archivo Excel</label>
            <div class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center" @dragover.prevent="arrastrando = true" @dragleave.prevent="arrastrando = false" @drop.prevent="onDropArchivo" :class="arrastrando ? 'border-[#008f9c]/50 bg-[#008f9c]/5' : ''">
              <input ref="inputArchivoImportar" type="file" accept=".xlsx,.xls" class="hidden" @change="onSeleccionarArchivo" />
              <p class="text-slate-500 text-sm mb-2">Arrastre el archivo o</p>
              <button type="button" class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300" @click="inputArchivoImportar?.click()">Seleccionar archivo</button>
              <p v-if="archivoSeleccionado" class="mt-3 text-sm font-medium text-[#008f9c]">{{ archivoSeleccionado.name }}</p>
            </div>
          </div>
          <div v-if="importando" class="text-center text-slate-500 text-sm">Importando...</div>
          <div v-if="resultadoImportacion" class="rounded-lg p-3 text-sm" :class="resultadoImportacion.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">{{ resultadoImportacion.mensaje }}</div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalImportar">Cerrar</button>
            <button type="button" class="px-4 py-2 text-sm font-bold text-white bg-[#008f9c] hover:bg-[#007a85] rounded-lg disabled:opacity-50" :disabled="!archivoSeleccionado || importando" @click="ejecutarImportacion">Importar datos</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import * as XLSX from 'xlsx';
import { getAllIpress, postAllIpress, deleteAllIpress } from '@/services/ipress/Ipress.service';
import { atencionesParaListadoRegistros, indexarRegistrosPorAtencionYPaciente, registroParaAtencionActiva, esPacienteEgresadoEnListado, registroDePacienteEgresado } from '@/composables/useAtencionesRegistro';
import { useBloqueoNotificacionRevision } from '@/composables/useBloqueoNotificacionRevision';
import { fechaCelda } from '@/utils/fechaFormat';
import Form7 from '@/components/forms/Form7.vue';
import TablaPaginacion from '@/components/TablaPaginacion.vue';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const { bloqueadoPorNotificacion, mensajeBloqueoNotificacion } = useBloqueoNotificacionRevision();

const NUMERO_FORMULARIO_VACUNACION = 5;

const registros = ref([]);
const periodos = ref([]);
const cargando = ref(false);
const mostrarModalNuevo = ref(false);
const vistaActiva = ref('registros');
const listadoAtenciones = ref([]);
const idPacienteSeleccionado = ref('');
const busquedaPaciente = ref('');
const pacienteParaFormulario = ref(null);
const idPacienteAtencionParaForm = ref(null);
const idPeriodoIpress = ref(null);
const idRed = ref(1);
const mostrarModalImportar = ref(false);
const arrastrando = ref(false);
const archivoSeleccionado = ref(null);
const inputArchivoImportar = ref(null);
const importando = ref(false);
const resultadoImportacion = ref(null);
const estadoFormulario = ref('CERRADO');
const cargandoEstadoFormulario = ref(false);
const registroEdicion = ref(null);
const eliminandoId = ref(null);
const form7ModalKey = ref(0);

const mostrarModalHistorialVacunas = ref(false);
const pacienteHistorialVacunas = ref(null);
const pestañaHistorial = ref('vacunas');
const historialVacunasLista = ref([]);
const historialSerologiaLista = ref([]);
const cargandoHistorialVacunas = ref(false);
const paginaHistorialVacunas = ref(1);
const tamPaginaHistorialVacunas = ref(10);
const paginaHistorialSerologia = ref(1);
const tamPaginaHistorialSerologia = ref(10);

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

const puedeExportarVacunacionExcel = computed(() => {
  if (cargando.value) return false;
  if (vistaActiva.value === 'registros') return registros.value.length > 0;
  return todosPacientesLista.value.length > 0;
});

function valorVacExport(v) {
  if (v === null || v === undefined || v === '') return '';
  return v;
}

function filasExcelVacunacionVistaRegistros() {
  return registros.value.map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    VHB: valorVacExport(r.vhb),
    VHC: valorVacExport(r.vhc),
    VIH: valorVacExport(r.vih),
    'Título AcHBs': valorVacExport(r.titulo_acHbs),
    'Dosis Hepatitis B': valorVacExport(r.dosis_hepatitis_b),
    'Dosis Covid': valorVacExport(r.dosis_covid),
    'Fecha Influenza': valorVacExport(r.fecha_influenza),
    'Fecha Neumococo': valorVacExport(r.fecha_neumococo),
    Estado: r.estado_aprobacion || 'PENDIENTE',
    'Editado supervisor': r.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': r.comentario_evaluacion || '',
  }));
}

function filasExcelVacunacionVistaTodos() {
  return todosPacientesLista.value.map((fila) => ({
    Paciente: fila.paciente || '',
    DNI: fila.documento || '',
    'Tiene registro': fila.tieneRegistro ? 'Sí' : 'No',
    VHB: valorVacExport(fila.vhb),
    VHC: valorVacExport(fila.vhc),
    VIH: valorVacExport(fila.vih),
    'Título AcHBs': valorVacExport(fila.titulo_acHbs),
    'Dosis Hepatitis B': valorVacExport(fila.dosis_hepatitis_b),
    'Dosis Covid': valorVacExport(fila.dosis_covid),
    'Fecha Influenza': valorVacExport(fila.fecha_influenza),
    'Fecha Neumococo': valorVacExport(fila.fecha_neumococo),
    Estado: fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO'),
    'Editado supervisor': fila.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': fila.comentario_evaluacion || '',
  }));
}

async function exportarDatosVacunacionExcel() {
  if (!puedeExportarVacunacionExcel.value) {
    ElMessage.warning('No hay datos para exportar con los filtros actuales.');
    return;
  }
  exportandoExcel.value = true;
  try {
    const esRegistros = vistaActiva.value === 'registros';
    const rows = esRegistros ? filasExcelVacunacionVistaRegistros() : filasExcelVacunacionVistaTodos();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vacunación');
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const sufijo = esRegistros ? 'solo_registros' : 'todos_pacientes';
    XLSX.writeFile(wb, `vacunacion_${sufijo}_${stamp}.xlsx`);
    ElMessage.success(`Se exportaron ${rows.length} fila(s).`);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo generar el archivo Excel.');
  } finally {
    exportandoExcel.value = false;
  }
}

const COLUMNAS_FORMATO = ['id_paciente_atencion', 'vhb', 'vhc', 'vih', 'titulo_acHbs', 'dosis_hepatitis_b', 'dosis_covid', 'fecha_influenza', 'fecha_neumococo'];

const periodoNumero = computed(() => {
  const v = periodoGlobal.value;
  if (v == null || v === '') return null;
  return Number(v);
});

const periodoActualTexto = computed(() => {
  const item = periodos.value.find((p) => String(p.id_periodo) === String(periodoNumero.value));
  return item?.periodo || '—';
});

const clinicaActualTexto = computed(() => {
  const atencion = listadoAtenciones.value[0];
  return atencion?.datosIpress?.nombre_corto || atencion?.datosIpress?.ipress || '—';
});

const modalidadActualTexto = computed(() => {
  const equivalencias = {
    1: 'Hemodiálisis',
    2: 'Diálisis Peritoneal',
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

const tituloModalFormulario = computed(() => (
  registroEdicion.value ? 'Editar registro de Vacunación' : 'Nuevo registro de Vacunación'
));

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

const pacientesDisponibles = computed(() =>
  Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : [],
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
  const { porAtencion, porPaciente } = indexarRegistrosPorAtencionYPaciente(regs, 'id_vacunacion');
  return atenciones.map((a) => {
    const id = a.id_paciente_atencion;
    const idPaciente = a.id_paciente ?? a.datosPaciente?.id_paciente ?? null;
    const r = registroParaAtencionActiva(a, porAtencion, porPaciente);
    const paciente = a.datosPaciente?.paciente ?? '—';
    const documento = a.datosPaciente?.documento ?? '—';
    const esEgresado = esPacienteEgresadoEnListado(a);
    if (r) {
      return {
        id_paciente: idPaciente ?? r.datosPacienteAtencion?.id_paciente ?? r.datosPaciente?.id_paciente ?? null,
        id_paciente_atencion: id,
        id_vacunacion: r.id_vacunacion,
        tieneRegistro: true,
        registro: r,
        paciente: nombrePaciente(r),
        documento: documentoPaciente(r),
        vhb: r.vhb || '',
        vhc: r.vhc || '',
        vih: r.vih || '',
        titulo_acHbs: r.titulo_acHbs || '',
        dosis_hepatitis_b: r.dosis_hepatitis_b || '',
        dosis_covid: r.dosis_covid || '',
        fecha_influenza: r.fecha_influenza || '',
        fecha_neumococo: r.fecha_neumococo || '',
        estado_aprobacion: r.estado_aprobacion || 'PENDIENTE',
        supervisor_edito_registro: !!r.supervisor_edito_registro,
        comentario_evaluacion: r.comentario_evaluacion || '',
        es_egresado: esEgresado,
      };
    }
    return {
      id_paciente: idPaciente,
      id_paciente_atencion: id,
      tieneRegistro: false,
      paciente,
      documento,
      vhb: '',
      vhc: '',
      vih: '',
      titulo_acHbs: '',
      dosis_hepatitis_b: '',
      dosis_covid: '',
      fecha_influenza: '',
      fecha_neumococo: '',
      estado_aprobacion: esEgresado ? 'EGRESADO' : 'SIN REGISTRO',
      supervisor_edito_registro: false,
      comentario_evaluacion: '',
      es_egresado: esEgresado,
    };
  });
});

const totalPaginasHistorialVacunas = computed(() => {
  const n = historialVacunasLista.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaHistorialVacunas.value);
});

const historialVacunasPaginado = computed(() => {
  const list = historialVacunasLista.value;
  const tam = tamPaginaHistorialVacunas.value;
  const p = Math.min(Math.max(1, paginaHistorialVacunas.value), totalPaginasHistorialVacunas.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoHistorialVacunasLabel = computed(() => {
  const total = historialVacunasLista.value.length;
  if (total === 0) return '0 vacunas';
  const tam = tamPaginaHistorialVacunas.value;
  const p = Math.min(Math.max(1, paginaHistorialVacunas.value), totalPaginasHistorialVacunas.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

function indiceHistorialVacunas(idx) {
  return (paginaHistorialVacunas.value - 1) * tamPaginaHistorialVacunas.value + idx + 1;
}

const totalPaginasHistorialSerologia = computed(() => {
  const n = historialSerologiaLista.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaHistorialSerologia.value);
});

const historialSerologiaPaginado = computed(() => {
  const list = historialSerologiaLista.value;
  const tam = tamPaginaHistorialSerologia.value;
  const p = Math.min(Math.max(1, paginaHistorialSerologia.value), totalPaginasHistorialSerologia.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoHistorialSerologiaLabel = computed(() => {
  const total = historialSerologiaLista.value.length;
  if (total === 0) return '0 resultados';
  const tam = tamPaginaHistorialSerologia.value;
  const p = Math.min(Math.max(1, paginaHistorialSerologia.value), totalPaginasHistorialSerologia.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

function indiceHistorialSerologia(idx) {
  return (paginaHistorialSerologia.value - 1) * tamPaginaHistorialSerologia.value + idx + 1;
}

function periodoDesdeRegistroVac(reg) {
  const at = reg?.datosPacienteAtencion;
  const periodoObj = at?.datosPeriodo || at?.id_periodo;
  if (periodoObj && typeof periodoObj === 'object') {
    return periodoObj.periodo || String(periodoObj.id_periodo || '') || '';
  }
  return at?.periodo || '';
}

function expandirVacunasDeRegistro(reg) {
  const base = {
    id_vacunacion: reg.id_vacunacion,
    periodo: periodoDesdeRegistroVac(reg),
    estado_aprobacion: reg.estado_aprobacion || 'PENDIENTE',
  };
  const filas = [];
  const dosisHb = String(reg.dosis_hepatitis_b || '').trim();
  const fechaHb = String(reg.fecha_hepatitis_b || '').trim();
  if (dosisHb || fechaHb) {
    filas.push({
      ...base,
      vacuna: 'Hepatitis B',
      detalle: dosisHb || '—',
      fecha: fechaHb || '—',
    });
  }
  const dosisCv = String(reg.dosis_covid || '').trim();
  const fechaCv = String(reg.fecha_covid || '').trim();
  if (dosisCv || fechaCv) {
    filas.push({
      ...base,
      vacuna: 'Covid-19',
      detalle: dosisCv || '—',
      fecha: fechaCv || '—',
    });
  }
  const fechaInf = String(reg.fecha_influenza || '').trim();
  if (fechaInf) {
    filas.push({
      ...base,
      vacuna: 'Influenza',
      detalle: 'Aplicada',
      fecha: fechaInf,
    });
  }
  const fechaNeu = String(reg.fecha_neumococo || '').trim();
  if (fechaNeu) {
    filas.push({
      ...base,
      vacuna: 'Neumococo',
      detalle: 'Aplicada',
      fecha: fechaNeu,
    });
  }
  return filas;
}

function agregarFilaSerologia(filas, base, prueba, resultado, fecha) {
  const res = String(resultado || '').trim();
  const f = String(fecha || '').trim();
  if (!res && !f) return;
  filas.push({
    ...base,
    prueba,
    resultado: res || '—',
    fecha: f || '—',
  });
}

function expandirSerologiaDeRegistro(reg) {
  const base = {
    id_vacunacion: reg.id_vacunacion,
    periodo: periodoDesdeRegistroVac(reg),
  };
  const filas = [];
  agregarFilaSerologia(filas, base, 'VHB', reg.vhb, reg.fecha_vhb);
  agregarFilaSerologia(filas, base, 'Anti-HBc total', reg.antiHbc, reg.fecha_antiHbc);
  agregarFilaSerologia(filas, base, 'VHC', reg.vhc, reg.fecha_vhc);
  agregarFilaSerologia(filas, base, 'VIH', reg.vih, reg.fecha_vih);
  const titulo = String(reg.titulo_acHbs || '').trim();
  const estadoTitulo = String(reg.estado_acHbs || '').trim();
  const fechaTitulo = String(reg.fecha_titulo_acHbs || '').trim();
  if (titulo || estadoTitulo || fechaTitulo) {
    filas.push({
      ...base,
      prueba: 'Título AcHBs',
      resultado: [titulo, estadoTitulo].filter(Boolean).join(' · ') || '—',
      fecha: fechaTitulo || '—',
    });
  }
  return filas;
}

function ordenarEventosHistorial(eventos) {
  return [...eventos].sort((a, b) => {
    const fa = ordenFechaHistorial(a.fecha);
    const fb = ordenFechaHistorial(b.fecha);
    if (fa && fb && fa !== fb) return fb.localeCompare(fa);
    return (Number(b.id_vacunacion) || 0) - (Number(a.id_vacunacion) || 0);
  });
}

function ordenFechaHistorial(fecha) {
  const s = String(fecha || '').trim();
  if (!s || s === '—') return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return s;
}

async function abrirModalHistorialVacunas(fila) {
  if (!fila) return;
  const idPaciente = fila.id_paciente
    ?? fila.registro?.datosPacienteAtencion?.id_paciente
    ?? fila.registro?.datosPaciente?.id_paciente
    ?? null;
  pacienteHistorialVacunas.value = {
    id_paciente: idPaciente,
    paciente: fila.paciente || '—',
    documento: fila.documento || '—',
  };
  pestañaHistorial.value = 'vacunas';
  paginaHistorialVacunas.value = 1;
  paginaHistorialSerologia.value = 1;
  historialVacunasLista.value = [];
  historialSerologiaLista.value = [];
  mostrarModalHistorialVacunas.value = true;
  if (idPaciente == null || idPaciente === '') return;

  cargandoHistorialVacunas.value = true;
  try {
    const resAt = await getAllIpress(`/pacienteAtencion/?id_paciente=${idPaciente}`);
    const atenciones = Array.isArray(resAt) ? resAt : (resAt?.results || []);
    const idsAtencion = [...new Set(
      atenciones.map((a) => a.id_paciente_atencion).filter((id) => id != null && id !== ''),
    )];
    if (idsAtencion.length === 0) {
      historialVacunasLista.value = [];
      historialSerologiaLista.value = [];
      return;
    }
    const respuestas = await Promise.all(
      idsAtencion.map((id) =>
        getAllIpress(`/vacunaciones/?id_paciente_atencion=${id}`).catch(() => []),
      ),
    );
    const registrosVac = respuestas.flatMap((r) => (Array.isArray(r) ? r : (r?.results || [])));
    historialVacunasLista.value = ordenarEventosHistorial(
      registrosVac.flatMap((reg) => expandirVacunasDeRegistro(reg)),
    );
    historialSerologiaLista.value = ordenarEventosHistorial(
      registrosVac.flatMap((reg) => expandirSerologiaDeRegistro(reg)),
    );
  } catch (e) {
    console.error('Error al cargar historial de vacunas:', e);
    historialVacunasLista.value = [];
    historialSerologiaLista.value = [];
    ElMessage.error('No se pudo cargar el historial.');
  } finally {
    cargandoHistorialVacunas.value = false;
  }
}

function cerrarModalHistorialVacunas() {
  mostrarModalHistorialVacunas.value = false;
  pacienteHistorialVacunas.value = null;
  pestañaHistorial.value = 'vacunas';
  historialVacunasLista.value = [];
  historialSerologiaLista.value = [];
  paginaHistorialVacunas.value = 1;
  paginaHistorialSerologia.value = 1;
}

watch([historialVacunasLista, tamPaginaHistorialVacunas], () => {
  const tp = Math.max(1, Math.ceil(historialVacunasLista.value.length / tamPaginaHistorialVacunas.value) || 1);
  if (paginaHistorialVacunas.value > tp) paginaHistorialVacunas.value = tp;
});

watch([historialSerologiaLista, tamPaginaHistorialSerologia], () => {
  const tp = Math.max(1, Math.ceil(historialSerologiaLista.value.length / tamPaginaHistorialSerologia.value) || 1);
  if (paginaHistorialSerologia.value > tp) paginaHistorialSerologia.value = tp;
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
      numero_formulario: NUMERO_FORMULARIO_VACUNACION,
    });
    estadoFormulario.value = res?.abierto !== false ? 'ABIERTO' : 'CERRADO';
  } catch (e) {
    console.error('Error al consultar estado del formulario:', e);
    estadoFormulario.value = 'CERRADO';
  } finally {
    cargandoEstadoFormulario.value = false;
  }
}

async function fetchIdPeriodoIpress() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  if (idPeriodo == null || idIpress == null) return null;
  try {
    const res = await postAllIpress('/consulta_periodo_ipress/', {
      id_periodo: Number(idPeriodo),
      id_ipress: Number(idIpress),
      id_estado: 1,
    });
    const arr = Array.isArray(res) ? res : (res && res.length ? res : []);
    return arr.length ? arr[0].id_periodo_ipress : null;
  } catch (e) {
    console.error('Error al obtener id_periodo_ipress:', e);
    return null;
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
    const idPerIpress = await fetchIdPeriodoIpress();
    idPeriodoIpress.value = idPerIpress;
    const [resVac, resAten] = await Promise.all([
      getAllIpress(`/vacunaciones/?${qs}`),
      getAllIpress(`/pacienteAtencion/?${qs}`),
    ]);
    registros.value = Array.isArray(resVac) ? resVac : resVac?.results || [];
    listadoAtenciones.value = atencionesParaListadoRegistros(
      Array.isArray(resAten) ? resAten : resAten?.results || []
    );
  } catch (e) {
    console.error('Error al cargar vacunaciones:', e);
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
  form7ModalKey.value += 1;
  fetchPacientesAtencion();
  mostrarModalNuevo.value = true;
  if (idPeriodoIpress.value == null) {
    fetchIdPeriodoIpress().then((v) => {
      idPeriodoIpress.value = v;
    });
  }
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
  form7ModalKey.value += 1;
  mostrarModalNuevo.value = true;
}

async function eliminarRegistro(registro) {
  if (!formularioAbierto.value || !registro?.id_vacunacion) return;
  if (registroDePacienteEgresado(registro, listadoAtenciones.value)) {
    ElMessage.warning('Paciente egresado: no se puede eliminar el registro.');
    return;
  }
  const nombre = nombrePaciente(registro);
  const confirmar = window.confirm(`¿Eliminar el registro de vacunación de ${nombre}?`);
  if (!confirmar) return;
  eliminandoId.value = registro.id_vacunacion;
  try {
    await deleteAllIpress(`/vacunaciones/${registro.id_vacunacion}/`);
    ElMessage.success('Registro eliminado correctamente.');
    await fetchRegistros();
  } catch (e) {
    console.error('Error al eliminar vacunación:', e);
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
    form7ModalKey.value += 1;
  }
  if (idPeriodoIpress.value == null) {
    fetchIdPeriodoIpress().then((v) => {
      idPeriodoIpress.value = v;
    });
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
  if (idPeriodoIpress.value == null) {
    fetchIdPeriodoIpress().then((v) => {
      idPeriodoIpress.value = v;
    });
  }
}
function cerrarModalImportar() {
  mostrarModalImportar.value = false;
  archivoSeleccionado.value = null;
  resultadoImportacion.value = null;
  arrastrando.value = false;
  fetchRegistros();
}
function descargarFormatoExcel() {
  const ws = XLSX.utils.aoa_to_sheet([COLUMNAS_FORMATO, ['', '', '', '', '', '', '', '', '']]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Vacunación');
  XLSX.writeFile(wb, 'formato_vacunacion.xlsx');
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
  const idPerIpress = idPeriodoIpress.value;
  if (idPerIpress == null) {
    resultadoImportacion.value = { ok: false, mensaje: 'Seleccione periodo e IPRESS antes de importar.' };
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
    for (const row of dataRows) {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = row[i] != null ? String(row[i]).trim() : ''));
      const idAtencion = obj.id_paciente_atencion ? Number(obj.id_paciente_atencion) : null;
      if (!idAtencion) {
        errores++;
        continue;
      }
      try {
        await postAllIpress('/vacunaciones/', {
          id_paciente_atencion: idAtencion,
          vhb: obj.vhb || null,
          vhc: obj.vhc || null,
          vih: obj.vih || null,
          titulo_acHbs: obj.titulo_achbs || obj.titulo_acHbs || null,
          dosis_hepatitis_b: obj.dosis_hepatitis_b || null,
          dosis_covid: obj.dosis_covid || null,
          fecha_influenza: obj.fecha_influenza || null,
          fecha_neumococo: obj.fecha_neumococo || null,
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

async function fetchPeriodos() {
  try {
    const res = await getAllIpress('/periodos/');
    periodos.value = Array.isArray(res) ? res : (res?.results || []);
  } catch (e) {
    console.error('Error al cargar periodos:', e);
    periodos.value = [];
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  fetchRegistros();
  fetchEstadoFormulario();
}, { deep: true });
onMounted(() => {
  fetchPeriodos();
  fetchRegistros();
  fetchEstadoFormulario();
});
</script>

<style scoped>
.tabla-vac {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

.tabla-vac-th,
.tabla-vac-td {
  white-space: nowrap;
  padding: 0.625rem 1.25rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  vertical-align: middle;
}

.tabla-vac-th {
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tabla-vac-badge {
  font-size: 0.6875rem;
}

.tabla-vac-col-comentario {
  min-width: 12rem;
}

.tabla-vac tbody td:first-child {
  min-width: 9rem;
}

.tabla-vac-th-acciones,
.tabla-vac-td-acciones {
  text-align: right;
}

.tabla-vac-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1rem;
  transition: background-color 0.15s, color 0.15s;
}

.tabla-vac-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.tabla-vac-btn-editar {
  border: 1px solid #a5f3fc;
  color: #0e7490;
  background: transparent;
}

.tabla-vac-btn-editar:hover:not(:disabled) {
  background: #ecfeff;
}

.tabla-vac-btn-historial {
  border: 1px solid #c7d2fe;
  color: #4338ca;
  background: transparent;
}

.tabla-vac-btn-historial:hover:not(:disabled) {
  background: #eef2ff;
}

.tabla-vac-btn-eliminar {
  border: 1px solid #fecdd3;
  color: #be123c;
  background: transparent;
}

.tabla-vac-btn-eliminar:hover:not(:disabled) {
  background: #fff1f2;
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
  border: 1px solid #008f9c;
  color: #fff;
  background: #008f9c;
}

.header-accion-btn-primario:hover:not(:disabled) {
  background: #007a85;
}
</style>
