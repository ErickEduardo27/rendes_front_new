<template>
  <div class="min-h-screen bg-gray-50/50 p-4 sm:p-6">
    <div class="max-w-[100rem] mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
            Acceso Vascular
          </h1>
          <p class="text-slate-500 mt-1 text-sm">Registros de acceso vascular por periodo, IPRESS y modalidad.</p>
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
          <button
            type="button"
            class="header-accion-btn header-accion-btn-secundario"
            :disabled="!puedeExportarAccesoVascularExcel || exportandoExcel"
            :title="puedeExportarAccesoVascularExcel ? 'Exporta la vista actual (todos los registros del filtro, no solo la página)' : 'No hay datos para exportar con los filtros actuales'"
            @click="exportarDatosAccesoVascularExcel"
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

      <!-- Tabs: Solo registros | Todos los pacientes -->
      <div class="flex gap-1 mb-4 border-b border-slate-200">
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
          :class="vistaActiva === 'registros' ? 'bg-white text-cyan-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'registros'"
        >
          Cambios del periodo
        </button>
        <!-- <button
          type="button"
          class="px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors"
          :class="vistaActiva === 'todos' ? 'bg-white text-cyan-600 border border-b-0 border-slate-200 -mb-px' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'"
          @click="vistaActiva = 'todos'"
        >
          Todos los pacientes
        </button> -->
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div v-if="cargando" class="p-12 text-center text-slate-500">Cargando...</div>
        <template v-else-if="vistaActiva === 'registros'">
          <div v-if="registros.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay cambios de acceso vascular (con motivo de cambio) en el periodo, IPRESS y modalidad seleccionados.
          </div>
          <div v-else class="p-4 space-y-4">
            <div class="flex flex-wrap gap-3">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-xs font-medium text-slate-600 mb-1">Filtrar por nombre</label>
                <input
                  v-model="filtroRegistrosNombre"
                  type="text"
                  placeholder="Apellidos y nombres..."
                  class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div class="flex-1 min-w-[160px]">
                <label class="block text-xs font-medium text-slate-600 mb-1">Filtrar por documento</label>
                <input
                  v-model="filtroRegistrosDni"
                  type="text"
                  placeholder="DNI / CE..."
                  class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div v-if="registrosFiltrados.length === 0" class="py-8 text-center text-slate-500 text-sm">
              No hay resultados con el filtro actual<span v-if="filtroRegistrosNombre.trim() || filtroRegistrosDni.trim()">; pruebe otro nombre o documento</span>.
            </div>
            <template v-else>
              <p class="text-[10px] text-slate-600 mb-2">
                Solo cambios de acceso vascular con <strong>motivo de cambio</strong> cuya <strong>F. creación</strong> está dentro del periodo (IPRESS y modalidad del selector superior). No incluye el acceso inicial del registro del paciente.
              </p>
              <p class="text-[10px] text-amber-800 mb-2">
                Filas en ámbar: acceso temporal (CVCT) o con más de 90 días desde su creación.
              </p>
              <div class="overflow-x-auto border border-slate-200 rounded-lg">
                <table class="tabla-av divide-y divide-slate-200">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="tabla-av-th">Paciente</th>
                      <th class="tabla-av-th">DNI</th>
                      <th class="tabla-av-th">Tipo acceso</th>
                      <th class="tabla-av-th">Localización</th>
                      <th class="tabla-av-th">F. creación</th>
                      <th class="tabla-av-th">F. inicio canulación</th>
                      <th class="tabla-av-th">Motivo cambio</th>
                      <th class="tabla-av-th">Estado</th>
                      <th class="tabla-av-th">Editado sup.</th>
                      <th class="tabla-av-th tabla-av-col-comentario">Comentario sup.</th>
                      <th class="tabla-av-th tabla-av-th-acciones">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr
                      v-for="r in registrosPaginados"
                      :key="r.id_unidad_actual"
                      class="hover:bg-slate-50 transition-colors"
                      :class="claseFilaAccesoRegistro(r)"
                      :title="motivoAccesoAntiguo(r)"
                    >
                      <td class="tabla-av-td font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                      <td class="tabla-av-td text-slate-600">{{ documentoPaciente(r) }}</td>
                      <td class="tabla-av-td text-slate-600">{{ r.tipo_acceso || r.tipo_acceso_actual || '—' }}</td>
                      <td class="tabla-av-td text-slate-600">{{ r.localizacion_acceso || r.localizacion_acceso_actual || '—' }}</td>
                      <td class="tabla-av-td text-slate-600">{{ fechaCreacionAccesoColumna(r) || '—' }}</td>
                      <td class="tabla-av-td text-slate-600">{{ textoCanulacionRegistro(r) }}</td>
                      <td class="tabla-av-td text-slate-600">{{ r.motivo_cambio || '—' }}</td>
                      <td class="tabla-av-td">
                        <span class="tabla-av-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(r.estado_aprobacion)">
                          {{ r.estado_aprobacion || 'PENDIENTE' }}
                        </span>
                      </td>
                      <td class="tabla-av-td">
                        <span v-if="r.supervisor_edito_registro" class="tabla-av-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                        <span v-else class="text-slate-400">—</span>
                      </td>
                      <td class="tabla-av-td tabla-av-col-comentario text-slate-600" :title="r.comentario_evaluacion || ''">{{ r.comentario_evaluacion?.trim() || '—' }}</td>
                      <td class="tabla-av-td tabla-av-td-acciones">
                        <div v-if="!registroDePacienteEgresado(r, listadoAtenciones)" class="inline-flex items-center gap-1">
                          <button
                            type="button"
                            class="tabla-av-btn tabla-av-btn-editar"
                            :disabled="!formularioAbierto"
                            :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                            @click="abrirModalEditar(r)"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            class="tabla-av-btn tabla-av-btn-eliminar"
                            :disabled="!formularioAbierto || eliminandoId === r.id_unidad_actual"
                            :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                            @click="eliminarRegistro(r)"
                          >
                            {{ eliminandoId === r.id_unidad_actual ? '…' : 'Eliminar' }}
                          </button>
                        </div>
                        <span v-else class="text-[10px] text-slate-500 font-medium">EGRESADO</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm border-t border-slate-100 pt-3">
                <div class="flex flex-wrap items-center gap-3 text-slate-600">
                  <span>{{ rangoRegistrosLabel }}</span>
                  <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                    <span>Por página</span>
                    <select v-model.number="tamPagina" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                      <option :value="10">10</option>
                      <option :value="25">25</option>
                      <option :value="50">50</option>
                    </select>
                  </label>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaRegistros <= 1" @click="paginaRegistros = 1">Primera</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaRegistros <= 1" @click="paginaRegistros--">Anterior</button>
                  <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaRegistros }} / {{ totalPaginasRegistros }}</span>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaRegistros >= totalPaginasRegistros" @click="paginaRegistros++">Siguiente</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaRegistros >= totalPaginasRegistros" @click="paginaRegistros = totalPaginasRegistros">Última</button>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else-if="vistaActiva === 'todos'">
          <div v-if="todosPacientesLista.length === 0" class="p-12 text-center text-slate-500 italic">
            No hay pacientes en el periodo, IPRESS y modalidad seleccionados.
          </div>
          <div v-else class="p-4 space-y-4">
            <p class="text-[10px] text-slate-600 mb-2">
              Sin historial de acceso vascular: se muestra la ficha de diálisis. Con historial: el último registro (cualquier periodo).
            </p>
            <div class="overflow-x-auto border border-slate-200 rounded-lg">
              <table class="tabla-av divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="tabla-av-th">Paciente</th>
                    <th class="tabla-av-th">DNI</th>
                    <th class="tabla-av-th">Tipo acceso</th>
                    <th class="tabla-av-th">Localización</th>
                    <th class="tabla-av-th">F. creación</th>
                    <th class="tabla-av-th">F. inicio canulación</th>
                    <th class="tabla-av-th">Motivo cambio</th>
                    <th class="tabla-av-th">Estado</th>
                    <th class="tabla-av-th">Editado sup.</th>
                    <th class="tabla-av-th tabla-av-col-comentario">Comentario sup.</th>
                    <th class="tabla-av-th tabla-av-th-acciones">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="fila in todosPacientesPaginados"
                    :key="fila.id_paciente_atencion"
                    class="hover:bg-slate-50 transition-colors"
                    :class="[
                      { 'bg-amber-50/50': !fila.tieneRegistro && !fila.desdeFichaDialisis },
                      { 'bg-sky-50/40': fila.desdeFichaDialisis },
                      fila.tieneRegistro ? claseFilaAccesoRegistro(fila.registro || fila) : '',
                    ]"
                    :title="fila.tieneRegistro ? motivoAccesoAntiguo(fila.registro || fila) : (fila.desdeFichaDialisis ? 'Datos tomados de la ficha de diálisis del paciente' : '')"
                  >
                    <td class="tabla-av-td font-medium text-slate-800">
                      {{ fila.paciente || '—' }}
                      <span v-if="fila.es_egresado" class="ml-1 inline text-[10px] font-semibold uppercase text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">EGRESADO</span>
                    </td>
                    <td class="tabla-av-td text-slate-600">{{ fila.documento || '—' }}</td>
                    <td class="tabla-av-td text-slate-600">{{ fila.tipo_acceso || '—' }}</td>
                    <td class="tabla-av-td text-slate-600">{{ fila.localizacion_acceso || '—' }}</td>
                    <td class="tabla-av-td text-slate-600">{{ fechaCelda(fila.fecha_creacion_acceso) }}</td>
                    <td class="tabla-av-td text-slate-600">{{ textoCanulacionRegistro(fila) }}</td>
                    <td class="tabla-av-td text-slate-600">{{ fila.motivo_cambio || '—' }}</td>
                    <td class="tabla-av-td">
                      <span class="tabla-av-badge inline-flex rounded-full px-2 py-0.5 font-semibold whitespace-nowrap" :class="estadoAprobacionClase(fila.estado_aprobacion)">
                        {{ fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO') }}
                      </span>
                    </td>
                    <td class="tabla-av-td">
                      <span v-if="fila.supervisor_edito_registro" class="tabla-av-badge inline-flex rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-800 whitespace-nowrap">Sí</span>
                      <span v-else class="text-slate-400">—</span>
                    </td>
                    <td class="tabla-av-td tabla-av-col-comentario text-slate-600" :title="fila.comentario_evaluacion || ''">{{ fila.comentario_evaluacion?.trim() || '—' }}</td>
                    <td class="tabla-av-td tabla-av-td-acciones">
                      <div v-if="!fila.es_egresado" class="inline-flex items-center gap-1">
                        <button
                          type="button"
                          class="tabla-av-btn tabla-av-btn-historial"
                          title="Ver historial de cambios de acceso"
                          @click="abrirModalHistorialPaciente(fila)"
                        >
                          Historial
                        </button>
                        <template v-if="fila.tieneRegistro">
                          <button
                            type="button"
                            class="tabla-av-btn tabla-av-btn-editar"
                            :disabled="!formularioAbierto"
                            :title="formularioAbierto ? 'Editar registro' : motivoFormularioNoEditable"
                            @click="abrirModalEditar(fila.registro)"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            class="tabla-av-btn tabla-av-btn-eliminar"
                            :disabled="!formularioAbierto || eliminandoId === fila.id_unidad_actual"
                            :title="formularioAbierto ? 'Eliminar registro' : motivoFormularioNoEditable"
                            @click="eliminarRegistro(fila.registro)"
                          >
                            {{ eliminandoId === fila.id_unidad_actual ? '…' : 'Eliminar' }}
                          </button>
                        </template>
                      </div>
                      <span v-else class="text-[10px] text-slate-500 font-medium">Sin acciones</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm border-t border-slate-100 pt-3">
              <div class="flex flex-wrap items-center gap-3 text-slate-600">
                <span>{{ rangoTodosLabel }}</span>
                <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                  <span>Por página</span>
                  <select v-model.number="tamPaginaTodos" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaTodos <= 1" @click="paginaTodos = 1">Primera</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaTodos <= 1" @click="paginaTodos--">Anterior</button>
                <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaTodos }} / {{ totalPaginasTodos }}</span>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaTodos >= totalPaginasTodos" @click="paginaTodos++">Siguiente</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaTodos >= totalPaginasTodos" @click="paginaTodos = totalPaginasTodos">Última</button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="historialCargas.length === 0" class="p-12 text-center text-slate-500 italic">
            Aun no hay cargas de Excel registradas.
          </div>
          <div v-else class="p-4 space-y-4">
            <div class="max-w-md">
              <label class="block text-xs font-medium text-slate-600 mb-1">Filtrar cargas</label>
              <input
                v-model="filtroHistorialTexto"
                type="text"
                placeholder="Archivo, fecha, periodo, clínica o modalidad..."
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div v-if="historialCargasFiltrado.length === 0" class="py-8 text-center text-slate-500 text-sm">
              No hay cargas que coincidan con el filtro.
            </div>
            <template v-else>
              <div class="overflow-x-auto border border-slate-200 rounded-lg">
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
                      v-for="carga in historialPaginado"
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
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm border-t border-slate-100 pt-3">
                <div class="flex flex-wrap items-center gap-3 text-slate-600">
                  <span>{{ rangoHistorialLabel }}</span>
                  <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                    <span>Por página</span>
                    <select v-model.number="tamPaginaHistorial" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                      <option :value="10">10</option>
                      <option :value="25">25</option>
                      <option :value="50">50</option>
                    </select>
                  </label>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorial <= 1" @click="paginaHistorial = 1">Primera</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorial <= 1" @click="paginaHistorial--">Anterior</button>
                  <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaHistorial }} / {{ totalPaginasHistorial }}</span>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorial >= totalPaginasHistorial" @click="paginaHistorial++">Siguiente</button>
                  <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorial >= totalPaginasHistorial" @click="paginaHistorial = totalPaginasHistorial">Última</button>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Nuevo: selector de paciente + Form2Hemodialisis -->
    <div v-if="mostrarModalNuevo" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" :class="registroEdicion ? 'max-w-3xl' : 'max-w-6xl'">
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
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
                class="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50"
                :disabled="!idPacienteSeleccionado"
                @click="confirmarPacienteYMostrarFormulario"
              >
                Continuar al formulario
              </button>
            </div>
          </div>
          <div v-else>
            <!-- <div v-if="idPeriodoIpress == null" class="py-4 text-amber-700 text-sm bg-amber-50 rounded-lg px-4">
              No se encontró periodo-IPRESS para el periodo y clínica actuales. Configure el selector en la barra superior.
            </div> -->
            <Form2Hemodialisis
              :key="form2ModalKey"
              :paciente="pacienteParaFormulario"
              :periodo="periodoNumero"
              :periodo-ipress="idPeriodoIpress"
              :id-paciente-atencion="idPacienteAtencionParaForm"
              :registro-edicion="registroEdicion"
              @cancelar="cerrarModalNuevo"
              @guardado="onGuardado"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Importar: descargar formato Excel + cargar archivo -->
    <div v-if="mostrarModalImportar" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        class="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        :class="resultadoImportacion?.detalles?.length ? 'max-w-6xl max-h-[90vh]' : 'max-w-md'"
      >
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center shrink-0">
          <h3 class="font-bold text-white flex items-center gap-2">Importar Acceso Vascular</h3>
          <button type="button" class="text-white/80 hover:text-white" @click="cerrarModalImportar">✕</button>
        </div>
        <div class="p-6 space-y-6 overflow-auto">
          <p v-if="!resultadoImportacion?.detalles?.length" class="text-sm text-slate-600">
            Cargue el Excel completado. La importacion valida el tipo de acceso, la localizacion, las fechas dentro del periodo (para fístula, también la fecha de inicio de canulación) y el DNI contra los pacientes visibles.
          </p>
          <div v-if="!resultadoImportacion?.detalles?.length">
            <label class="block text-sm font-bold text-slate-700 mb-2">Cargar archivo Excel</label>
            <div
              class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center transition-colors"
              :class="arrastrando ? 'border-cyan-400 bg-cyan-50/50' : 'hover:border-slate-300 hover:bg-slate-50/50'"
              @dragover.prevent="arrastrando = true"
              @dragleave.prevent="arrastrando = false"
              @drop.prevent="onDropArchivo"
            >
              <input
                ref="inputArchivoImportar"
                type="file"
                accept=".xlsx,.xls"
                class="hidden"
                @change="onSeleccionarArchivo"
              />
              <p class="text-slate-500 text-sm mb-2">Arrastre aquí el archivo o</p>
              <button
                type="button"
                class="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300"
                @click="inputArchivoImportar?.click()"
              >
                Seleccionar archivo
              </button>
              <p v-if="archivoSeleccionado" class="mt-3 text-sm font-medium text-cyan-600">
                {{ archivoSeleccionado.name }}
              </p>
            </div>
          </div>
          <div v-if="importando" class="text-center text-slate-500 text-sm">Importando...</div>
          <div v-if="resultadoImportacion" class="rounded-lg p-3 text-sm" :class="resultadoImportacion.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
            {{ resultadoImportacion.mensaje }}
          </div>
          <div v-if="resultadoImportacion?.detalles?.length" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm">
                <div class="text-xs uppercase font-bold text-slate-500">Total filas</div>
                <div class="font-semibold text-slate-800 mt-1">{{ resultadoImportacion.totalFilas }}</div>
              </div>
              <div class="bg-green-50 rounded-lg p-3 border border-green-200 text-sm">
                <div class="text-xs uppercase font-bold text-green-700">Guardadas</div>
                <div class="font-semibold text-green-800 mt-1">{{ resultadoImportacion.guardadas }}</div>
              </div>
              <div class="bg-red-50 rounded-lg p-3 border border-red-200 text-sm">
                <div class="text-xs uppercase font-bold text-red-700">Errores</div>
                <div class="font-semibold text-red-800 mt-1">{{ resultadoImportacion.errores }}</div>
              </div>
            </div>
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                    <th class="whitespace-nowrap px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tipo</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Localización</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">F. creación</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Canulación</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Motivo cambio</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
                    <th class="px-3 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Detalle</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="(detalle, index) in detallesImportacionPaginados"
                    :key="`import-${(paginaResultadoImportacion - 1) * tamPaginaResultadoImportacion + index}`"
                    :class="detalle.guardado ? 'bg-white' : 'bg-red-50/40'"
                  >
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.dni || '—' }}</td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.paciente || '—' }}</td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.tipo_acceso || '—' }}</td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.localizacion_acceso || '—' }}</td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ fechaCelda(detalle.fecha_creacion_acceso) }}</td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.fecha_inicio_canulacion || '—' }}</td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.motivo_cambio || '—' }}</td>
                    <td class="px-3 py-2 text-sm font-semibold whitespace-nowrap" :class="detalle.guardado ? 'text-green-700' : 'text-red-700'">
                      {{ detalle.guardado ? 'Guardado' : 'Error' }}
                    </td>
                    <td class="px-3 py-2 text-sm text-slate-700">{{ detalle.mensaje || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="detallesImportacionLista.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
              <div class="flex flex-wrap items-center gap-3 text-slate-600">
                <span>{{ rangoResultadoImportacionLabel }}</span>
                <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                  <span>Por página</span>
                  <select v-model.number="tamPaginaResultadoImportacion" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaResultadoImportacion <= 1" @click="paginaResultadoImportacion = 1">Primera</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaResultadoImportacion <= 1" @click="paginaResultadoImportacion--">Anterior</button>
                <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaResultadoImportacion }} / {{ totalPaginasResultadoImportacion }}</span>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaResultadoImportacion >= totalPaginasResultadoImportacion" @click="paginaResultadoImportacion++">Siguiente</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaResultadoImportacion >= totalPaginasResultadoImportacion" @click="paginaResultadoImportacion = totalPaginasResultadoImportacion">Última</button>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2 shrink-0">
            <button type="button" class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalImportar">Cerrar</button>
            <button
              v-if="!resultadoImportacion?.detalles?.length"
              type="button"
              class="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg disabled:opacity-50"
              :disabled="!archivoSeleccionado || importando"
              @click="ejecutarImportacion"
            >
              Importar datos
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal historial de accesos del paciente -->
    <div
      v-if="mostrarModalHistorialPaciente"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="cerrarModalHistorialPaciente"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center gap-3">
          <div class="min-w-0">
            <h3 class="font-bold text-white">Historial de acceso vascular</h3>
            <p class="text-cyan-100 text-sm truncate">
              {{ pacienteHistorial?.paciente || '—' }}
              <span v-if="pacienteHistorial?.documento"> · DNI {{ pacienteHistorial.documento }}</span>
            </p>
          </div>
          <button type="button" class="text-white/80 hover:text-white shrink-0 text-lg leading-none" aria-label="Cerrar" @click="cerrarModalHistorialPaciente">✕</button>
        </div>
        <div class="p-6 overflow-auto">
          <p class="text-xs text-slate-500 mb-3">
            Todos los cambios de acceso registrados para este paciente (cualquier periodo).
          </p>
          <div v-if="historialPacienteLista.length === 0" class="py-10 text-center text-slate-500 italic border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No hay cambios de acceso vascular registrados para este paciente.
          </div>
          <template v-else>
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="min-w-full divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">#</th>
                    <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tipo acceso</th>
                    <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Localización</th>
                    <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">F. creación</th>
                    <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">F. inicio canulación</th>
                    <th class="px-3 py-2.5 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">Motivo cambio</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="(r, idx) in historialPacientePaginado"
                    :key="r.id_unidad_actual || idx"
                    class="hover:bg-slate-50"
                    :class="claseFilaAccesoRegistro(r)"
                  >
                    <td class="px-3 py-2.5 text-slate-500 tabular-nums">{{ indiceHistorialPaciente(idx) }}</td>
                    <td class="px-3 py-2.5 text-slate-700">{{ r.tipo_acceso || r.tipo_acceso_actual || '—' }}</td>
                    <td class="px-3 py-2.5 text-slate-700">{{ r.localizacion_acceso || r.localizacion_acceso_actual || '—' }}</td>
                    <td class="px-3 py-2.5 text-slate-700 whitespace-nowrap">{{ fechaCreacionAccesoColumna(r) || '—' }}</td>
                    <td class="px-3 py-2.5 text-slate-700 whitespace-nowrap">{{ textoCanulacionRegistro(r) }}</td>
                    <td class="px-3 py-2.5 text-slate-700">{{ r.motivo_cambio || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm border-t border-slate-100 pt-3 mt-3">
              <div class="flex flex-wrap items-center gap-3 text-slate-600">
                <span>{{ rangoHistorialPacienteLabel }}</span>
                <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                  <span>Por página</span>
                  <select v-model.number="tamPaginaHistorialPaciente" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                  </select>
                </label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialPaciente <= 1" @click="paginaHistorialPaciente = 1">Primera</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialPaciente <= 1" @click="paginaHistorialPaciente--">Anterior</button>
                <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaHistorialPaciente }} / {{ totalPaginasHistorialPaciente }}</span>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialPaciente >= totalPaginasHistorialPaciente" @click="paginaHistorialPaciente++">Siguiente</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaHistorialPaciente >= totalPaginasHistorialPaciente" @click="paginaHistorialPaciente = totalPaginasHistorialPaciente">Última</button>
              </div>
            </div>
          </template>
        </div>
        <div class="px-6 py-3 border-t border-slate-100 flex justify-end bg-slate-50/80">
          <button
            type="button"
            class="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
            @click="cerrarModalHistorialPaciente"
          >
            Cerrar
          </button>
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
          <div class="space-y-3">
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">DNI</th>
                    <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Paciente</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Tipo</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Localizacion</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Fecha</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Canulación</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Motivo cambio</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Estado</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Detalle</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="(detalle, index) in detallesCargaPaginados" :key="`${cargaSeleccionada.id}-${(paginaDetalleCarga - 1) * tamPaginaDetalle + index}`">
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.dni || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.paciente || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.tipo_acceso || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.localizacion_acceso || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ fechaCelda(detalle.fecha_creacion_acceso) }}</td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.fecha_inicio_canulacion || '—' }}</td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.motivo_cambio || '—' }}</td>
                    <td class="px-4 py-3 text-sm font-semibold" :class="detalle.guardado ? 'text-green-700' : 'text-red-700'">
                      {{ detalle.guardado ? 'Guardado' : 'Error' }}
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-700">{{ detalle.mensaje }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="detallesCargaLista.length > 0" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
              <div class="flex flex-wrap items-center gap-3 text-slate-600">
                <span>{{ rangoDetalleCargaLabel }}</span>
                <label class="inline-flex items-center gap-2 text-xs text-slate-600">
                  <span>Por página</span>
                  <select v-model.number="tamPaginaDetalle" class="border border-slate-300 rounded-lg px-2 py-1 text-sm bg-white">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                  </select>
                </label>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaDetalleCarga <= 1" @click="paginaDetalleCarga = 1">Primera</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaDetalleCarga <= 1" @click="paginaDetalleCarga--">Anterior</button>
                <span class="px-2 text-slate-700 font-medium tabular-nums">Pág. {{ paginaDetalleCarga }} / {{ totalPaginasDetalleCarga }}</span>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaDetalleCarga >= totalPaginasDetalleCarga" @click="paginaDetalleCarga++">Siguiente</button>
                <button type="button" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium" :disabled="paginaDetalleCarga >= totalPaginasDetalleCarga" @click="paginaDetalleCarga = totalPaginasDetalleCarga">Última</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as XLSX from 'xlsx';
import { getAllIpress, postAllIpress, deleteAllIpress } from '@/services/ipress/Ipress.service';
import { atencionesParaListadoRegistros, esPacienteEgresadoEnListado, registroDePacienteEgresado } from '@/composables/useAtencionesRegistro';
import { fechaCelda } from '@/utils/fechaFormat';
import { prepararPayloadUnidadesActuales, tipoAccesoDesdeDb } from '@/utils/unidadesActualesPayload';
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue';
import { ElMessage } from 'element-plus';
import {
  claseFilaAccesoAntiguo,
  esAccesoVascularAntiguo,
  esTipoAccesoFistula,
  existeCambioAccesoMismoDia,
  claveCambioAccesoMismoDia,
  MENSAJE_CAMBIO_ACCESO_MISMO_DIA,
  motivoAccesoAntiguo,
  idsAccesosMasAntiguosPorPaciente,
  fechaCreacionAccesoEnPeriodo,
  esCambioAccesoVascular,
  fechaCreacionAccesoColumna,
} from '@/utils/accesoVascularValidacion';
import { useBloqueoNotificacionRevision } from '@/composables/useBloqueoNotificacionRevision';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const { bloqueadoPorNotificacion, mensajeBloqueoNotificacion } = useBloqueoNotificacionRevision();
const route = useRoute();
const router = useRouter();
const HISTORIAL_CARGAS_KEY = 'acceso_vascular_historial_cargas';
const NUMERO_FORMULARIO_ACCESO_VASCULAR = 1;

const registros = ref([]);
const registrosHistorialCompleto = ref([]);
const dialisisPorPaciente = ref({});
const cargando = ref(false);
const mostrarModalNuevo = ref(false);
const registroEdicion = ref(null);
const form2ModalKey = ref(0);
const eliminandoId = ref(null);
const vistaActiva = ref('todos');
const listadoAtenciones = ref([]);
const idPacienteSeleccionado = ref('');
const busquedaPaciente = ref('');
const pacienteParaFormulario = ref(null);
const idPacienteAtencionParaForm = ref(null);
const periodoIpressLista = ref([]);
const idPeriodoIpress = ref(null);
const mostrarModalImportar = ref(false);
const arrastrando = ref(false);
const archivoSeleccionado = ref(null);
const inputArchivoImportar = ref(null);
const importando = ref(false);
const resultadoImportacion = ref(null);
const periodos = ref([]);
const historialCargas = ref([]);
const mostrarDetalleCarga = ref(false);
const cargaSeleccionada = ref(null);
const estadoFormulario = ref('CERRADO');
const cargandoEstadoFormulario = ref(false);

const filtroRegistrosNombre = ref('');
const filtroRegistrosDni = ref('');
const paginaRegistros = ref(1);
const tamPagina = ref(10);
const filtroHistorialTexto = ref('');
const paginaHistorial = ref(1);
const tamPaginaHistorial = ref(10);
const paginaTodos = ref(1);
const tamPaginaTodos = ref(10);
const paginaDetalleCarga = ref(1);
const tamPaginaDetalle = ref(10);
const paginaResultadoImportacion = ref(1);
const tamPaginaResultadoImportacion = ref(10);

const mostrarModalHistorialPaciente = ref(false);
const pacienteHistorial = ref(null);
const paginaHistorialPaciente = ref(1);
const tamPaginaHistorialPaciente = ref(10);

const TIPOS_ACCESO = [
  'Catéter Venoso Central Temporal',
  'Catéter Venoso Central de Larga Permanencia',
  'Fístula Arteriovenosa',
  'Injerto Autólogo',
  'Injerto Protésico',
  'Catéter peritoneal',
];

const LOCALIZACIONES_POR_TIPO = {
  'Fístula Arteriovenosa': ['1. FAV radial derecha', '2. FAV radial izquierda', '3. FAV braquial o cubital derecha', '4. FAV braquial o cubital izquierda'],
  'Catéter Venoso Central Temporal': ['5. CVCT yugular derecha', '6. CVCT yugular izquierdo', '7. CVCT subclavio derecho', '8. CVCT subclavio izquierdo', '9. CVCT femoral derecho', '10. CVCT femoral izquierdo'],
  'Catéter Venoso Central de Larga Permanencia': ['11. CVCLP yugular derecha', '12. CVCLP yugular izquierdo', '13. CVCLP femoral derecho', '14. CVCLP femoral izquierdo', '15. CVCLP translumbar', '16. CVCLP transhepático'],
  'Injerto Autólogo': ['17. Injerto autólogo'],
  'Injerto Protésico': ['18. Injerto protésico'],
  'Catéter peritoneal': ['19. Catéter peritoneal'],
};

const periodoNumero = computed(() => {
  const v = periodoGlobal.value;
  if (v == null || v === '') return null;
  return Number(v);
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

const mostrarBotonNuevo = computed(() => {
  return formularioAbierto.value;
});

const tituloModalFormulario = computed(() => (
  registroEdicion.value ? 'Editar registro de Acceso Vascular' : 'Nuevo registro de Acceso Vascular'
));

const formularioAbierto = computed(() => estadoFormulario.value === 'ABIERTO' && !bloqueadoPorNotificacion.value);

const estadoFormularioTexto = computed(() => {
  if (bloqueadoPorNotificacion.value) return 'Bloqueado (Notificado)';
  return estadoFormulario.value === 'ABIERTO' ? 'Abierto' : 'Cerrado';
});

const motivoFormularioNoEditable = computed(() => (
  bloqueadoPorNotificacion.value ? mensajeBloqueoNotificacion : 'El formulario está cerrado'
));

const periodoActualTexto = computed(() => {
  const item = periodos.value.find((periodo) => String(periodo.id_periodo) === String(periodoNumero.value));
  return item?.periodo || '—';
});

const rangoFechasPeriodo = computed(() => {
  const periodo = periodos.value.find((item) => String(item.id_periodo) === String(periodoNumero.value));
  if (!periodo?.periodo) return { min: null, max: null };
  const [yearStr, monthStr] = String(periodo.periodo).split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return { min: null, max: null };
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return {
    min: firstDay.toISOString().split('T')[0],
    max: lastDay.toISOString().split('T')[0],
  };
});

function nombrePaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.paciente || r.datosPaciente?.paciente || '—';
}

function documentoPaciente(r) {
  return r.datosPacienteAtencion?.datosPaciente?.documento || r.datosPaciente?.documento || '—';
}

function estadoAprobacionClase(estado) {
  const valor = String(estado || '').toUpperCase();
  if (valor === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (valor === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  if (valor === 'SIN REGISTRO') return 'bg-slate-100 text-slate-500';
  if (valor === 'DESDE FICHA') return 'bg-sky-100 text-sky-800';
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

function idPacienteDesdeRegistro(registro) {
  return registro?.datosPacienteAtencion?.id_paciente
    ?? registro?.datosPaciente?.id_paciente
    ?? null;
}

function idIpressDesdeRegistro(registro) {
  const at = registro?.datosPacienteAtencion;
  return at?.id_ipress ?? at?.datosIpress?.id_ipress ?? null;
}

function textoTipoAcceso(valor) {
  if (valor == null || String(valor).trim() === '') return '';
  const texto = String(valor).trim();
  return tipoAccesoDesdeDb(texto) || texto;
}

function construirUltimoAccesoPorPaciente(regs) {
  const map = {};
  (Array.isArray(regs) ? regs : []).forEach((r) => {
    const pid = idPacienteDesdeRegistro(r);
    if (pid == null) return;
    const key = String(pid);
    const prev = map[key];
    if (prev == null || (Number(r.id_unidad_actual) || 0) > (Number(prev.id_unidad_actual) || 0)) {
      map[key] = r;
    }
  });
  return map;
}

function tieneDatosAccesoDialisis(dialisis) {
  if (!dialisis) return false;
  return !!(
    String(dialisis.tipo_acceso || '').trim()
    || String(dialisis.localizacion_acceso_inicio || '').trim()
    || String(dialisis.fecha_creacion_acceso || '').trim()
  );
}

function textoCanulacionRegistro(row) {
  const tipo = row?.tipo_acceso || row?.tipo_acceso_actual || '';
  if (!esTipoAccesoFistula(tipo)) return '—';
  return row?.fecha_inicio_canulacion || '—';
}

/** Fecha para ordenar historial: canulación si existe; si no, creación. */
function fechaOrdenHistorialAcceso(row) {
  const canul = String(row?.fecha_inicio_canulacion || '').trim().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(canul)) return canul;
  return String(fechaCreacionAccesoColumna(row) || '').trim().slice(0, 10);
}

function camposDesdeUnidad(r) {
  return {
    tipo_acceso: r.tipo_acceso || r.tipo_acceso_actual || '',
    localizacion_acceso: r.localizacion_acceso || r.localizacion_acceso_actual || '',
    fecha_creacion_acceso: r.fecha_creacion_acceso || r.fecha_creacion_acceso_actual || '',
    fecha_inicio_canulacion: r.fecha_inicio_canulacion || '',
    motivo_cambio: r.motivo_cambio || '',
  };
}

function camposDesdeDialisis(dialisis) {
  return {
    tipo_acceso: textoTipoAcceso(dialisis.tipo_acceso),
    localizacion_acceso: dialisis.localizacion_acceso_inicio || '',
    fecha_creacion_acceso: dialisis.fecha_creacion_acceso || '',
    fecha_inicio_canulacion: '',
    motivo_cambio: '',
  };
}

function filaDesdeUnidadHistorica(a, r) {
  const paciente = a.datosPaciente?.paciente ?? nombrePaciente(r);
  const documento = a.datosPaciente?.documento ?? documentoPaciente(r);
  const campos = camposDesdeUnidad(r);
  return {
    id_paciente: a.id_paciente ?? a.datosPaciente?.id_paciente ?? idPacienteDesdeRegistro(r),
    id_paciente_atencion: a.id_paciente_atencion,
    id_unidad_actual: r.id_unidad_actual,
    tieneRegistro: true,
    desdeFichaDialisis: false,
    registro: r,
    paciente,
    documento,
    ...campos,
    estado_aprobacion: r.estado_aprobacion || 'PENDIENTE',
    supervisor_edito_registro: !!r.supervisor_edito_registro,
    comentario_evaluacion: r.comentario_evaluacion || '',
  };
}

function filaDesdeFichaDialisis(a, dialisis) {
  const campos = camposDesdeDialisis(dialisis);
  return {
    id_paciente: a.id_paciente ?? a.datosPaciente?.id_paciente ?? null,
    id_paciente_atencion: a.id_paciente_atencion,
    tieneRegistro: false,
    desdeFichaDialisis: true,
    paciente: a.datosPaciente?.paciente ?? '—',
    documento: a.datosPaciente?.documento ?? '—',
    ...campos,
    estado_aprobacion: 'DESDE FICHA',
    supervisor_edito_registro: false,
    comentario_evaluacion: '',
  };
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

const cargarHistorialCargas = () => {
  try {
    const data = localStorage.getItem(HISTORIAL_CARGAS_KEY);
    historialCargas.value = data ? JSON.parse(data) : [];
  } catch (error) {
    historialCargas.value = [];
  }
};

const guardarHistorialCargas = () => {
  localStorage.setItem(HISTORIAL_CARGAS_KEY, JSON.stringify(historialCargas.value));
};

const abrirDetalleCarga = (carga) => {
  cargaSeleccionada.value = carga;
  mostrarDetalleCarga.value = true;
};

const cerrarDetalleCarga = () => {
  mostrarDetalleCarga.value = false;
  cargaSeleccionada.value = null;
};

const normalizarTexto = (valor) => String(valor || '').trim().toLowerCase();

const normalizarTipoAcceso = (valor) => {
  const texto = String(valor || '').trim();
  if (!texto) return '';
  const match = TIPOS_ACCESO.find((tipo) => normalizarTexto(tipo) === normalizarTexto(texto));
  return match || '';
};

const normalizarLocalizacion = (valor, tipoAcceso) => {
  const texto = String(valor || '').trim();
  if (!texto || !tipoAcceso) return '';
  const opciones = LOCALIZACIONES_POR_TIPO[tipoAcceso] || [];
  const match = opciones.find((opcion) => {
    const sinPrefijo = opcion.replace(/^\d+\.\s*/, '');
    return normalizarTexto(opcion) === normalizarTexto(texto) || normalizarTexto(sinPrefijo) === normalizarTexto(texto);
  });
  return match || '';
};

const detalleFilaImportacion = (obj, extra = {}) => ({
  dni: obj.dni || '',
  paciente: obj.paciente || '',
  tipo_acceso: obj.tipo_acceso || '',
  localizacion_acceso: obj.localizacion_acceso || '',
  fecha_creacion_acceso: obj.fecha_creacion_acceso || '',
  fecha_inicio_canulacion: obj.fecha_inicio_canulacion || '',
  motivo_cambio: obj.motivo_cambio || '',
  ...extra,
});

const validarFilaImportacion = (obj, cambiosEnLote = null) => {
  const dni = String(obj.dni || '').trim();
  const paciente = String(obj.paciente || '').trim();
  const tipoAcceso = normalizarTipoAcceso(obj.tipo_acceso);
  const localizacion = normalizarLocalizacion(obj.localizacion_acceso, tipoAcceso);
  const fechaCreacion = String(obj.fecha_creacion_acceso || '').trim();
  const fechaCanulacion = String(obj.fecha_inicio_canulacion || '').trim();
  const motivoCambio = String(obj.motivo_cambio || '').trim();

  if (!dni) return { ok: false, mensaje: 'Falta el DNI del paciente.' };
  const atencion = listadoAtenciones.value.find((item) => String(item.datosPaciente?.documento || '').trim() === dni);
  if (!atencion) return { ok: false, mensaje: 'El DNI no pertenece a un paciente visible en el filtro actual.' };

  if (paciente && normalizarTexto(atencion.datosPaciente?.paciente) !== normalizarTexto(paciente)) {
    return { ok: false, mensaje: 'El nombre no coincide con el DNI indicado.' };
  }
  if (!tipoAcceso) return { ok: false, mensaje: 'Tipo de acceso invalido.' };
  if (!localizacion) return { ok: false, mensaje: 'Localizacion invalida para el tipo de acceso.' };
  if (!fechaCreacion) return { ok: false, mensaje: 'Falta la fecha de creacion.' };
  if (rangoFechasPeriodo.value.min && (fechaCreacion < rangoFechasPeriodo.value.min || fechaCreacion > rangoFechasPeriodo.value.max)) {
    return { ok: false, mensaje: `La fecha debe estar entre ${rangoFechasPeriodo.value.min} y ${rangoFechasPeriodo.value.max}.` };
  }
  if (motivoCambio) {
    const idPac = atencion.id_paciente ?? atencion.datosPaciente?.id_paciente;
    if (existeCambioAccesoMismoDia(registrosHistorialCompleto.value, {
      idPaciente: idPac,
      fecha: fechaCreacion,
    })) {
      return { ok: false, mensaje: MENSAJE_CAMBIO_ACCESO_MISMO_DIA };
    }
    if (cambiosEnLote?.has(claveCambioAccesoMismoDia(idPac, fechaCreacion))) {
      return { ok: false, mensaje: MENSAJE_CAMBIO_ACCESO_MISMO_DIA };
    }
  }
  if (esTipoAccesoFistula(tipoAcceso)) {
    if (!fechaCanulacion) return { ok: false, mensaje: 'Para fístula, indique la fecha de inicio de canulación.' };
    if (fechaCanulacion < fechaCreacion) {
      return { ok: false, mensaje: 'La canulación no puede ser anterior a la fecha de creación del acceso.' };
    }
    if (rangoFechasPeriodo.value.max && fechaCanulacion > rangoFechasPeriodo.value.max) {
      return { ok: false, mensaje: `La canulación debe estar dentro del periodo (${rangoFechasPeriodo.value.max}).` };
    }
  }

  return {
    ok: true,
    payload: prepararPayloadUnidadesActuales({
      id_paciente_atencion: Number(atencion.id_paciente_atencion),
      tipo_acceso: tipoAcceso,
      localizacion_acceso: localizacion,
      fecha_creacion_acceso: fechaCreacion,
      fecha_inicio_canulacion: esTipoAccesoFistula(tipoAcceso) ? fechaCanulacion : null,
      motivo_cambio: motivoCambio || null,
    }),
    detalle: {
      dni,
      paciente: atencion.datosPaciente?.paciente || paciente || '—',
      tipo_acceso: tipoAcceso,
      localizacion_acceso: localizacion,
      fecha_creacion_acceso: fechaCreacion,
      fecha_inicio_canulacion: esTipoAccesoFistula(tipoAcceso) ? fechaCanulacion : '',
      motivo_cambio: motivoCambio,
    },
  };
};

const todosPacientesLista = computed(() => {
  const atenciones = Array.isArray(listadoAtenciones.value) ? listadoAtenciones.value : [];
  const ultimoPorPaciente = construirUltimoAccesoPorPaciente(registrosHistorialCompleto.value);
  const dialisisMap = dialisisPorPaciente.value || {};
  return atenciones.map((a) => {
    const esEgresado = esPacienteEgresadoEnListado(a);
    const pid = a.id_paciente ?? a.datosPaciente?.id_paciente;
    const historico = pid != null ? ultimoPorPaciente[String(pid)] : null;
    if (historico) return { ...filaDesdeUnidadHistorica(a, historico), es_egresado: esEgresado };
    const dialisis = pid != null ? dialisisMap[String(pid)] : null;
    if (tieneDatosAccesoDialisis(dialisis)) return { ...filaDesdeFichaDialisis(a, dialisis), es_egresado: esEgresado };
    return {
      id_paciente: pid ?? null,
      id_paciente_atencion: a.id_paciente_atencion,
      tieneRegistro: false,
      desdeFichaDialisis: false,
      paciente: a.datosPaciente?.paciente ?? '—',
      documento: a.datosPaciente?.documento ?? '—',
      tipo_acceso: '',
      localizacion_acceso: '',
      fecha_creacion_acceso: '',
      fecha_inicio_canulacion: '',
      motivo_cambio: '',
      estado_aprobacion: esEgresado ? 'EGRESADO' : 'SIN REGISTRO',
      supervisor_edito_registro: false,
      comentario_evaluacion: '',
      es_egresado: esEgresado,
    };
  });
});

const registrosFiltrados = computed(() => {
  let list = Array.isArray(registros.value) ? [...registros.value] : [];
  const n = filtroRegistrosNombre.value.trim().toLowerCase();
  const d = filtroRegistrosDni.value.trim().toLowerCase();
  if (n) list = list.filter((r) => nombrePaciente(r).toLowerCase().includes(n));
  if (d) list = list.filter((r) => String(documentoPaciente(r) || '').toLowerCase().includes(d));
  return list;
});

const idsAccesosAntiguos = computed(() =>
  idsAccesosMasAntiguosPorPaciente(registros.value, 'id_unidad_actual'),
);

function claseFilaAccesoRegistro(r) {
  if (!r) return '';
  const id = r.id_unidad_actual;
  if (id != null && idsAccesosAntiguos.value.has(id)) return claseFilaAccesoAntiguo(r);
  if (esAccesoVascularAntiguo(r)) return claseFilaAccesoAntiguo(r);
  return '';
}

const totalPaginasRegistros = computed(() => {
  const n = registrosFiltrados.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPagina.value);
});

const registrosPaginados = computed(() => {
  const list = registrosFiltrados.value;
  const tam = tamPagina.value;
  const p = Math.min(Math.max(1, paginaRegistros.value), totalPaginasRegistros.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoRegistrosLabel = computed(() => {
  const total = registrosFiltrados.value.length;
  if (total === 0) return '0 resultados';
  const tam = tamPagina.value;
  const p = Math.min(Math.max(1, paginaRegistros.value), totalPaginasRegistros.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

const historialCargasFiltrado = computed(() => {
  const texto = filtroHistorialTexto.value.trim().toLowerCase();
  const lista = Array.isArray(historialCargas.value) ? historialCargas.value : [];
  if (!texto) return lista;
  return lista.filter((c) => {
    const blob = [
      c.fecha,
      c.archivo,
      c.periodo,
      c.clinica,
      c.modalidad,
      String(c.totalFilas),
      String(c.guardadas),
      String(c.errores),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return blob.includes(texto);
  });
});

const totalPaginasHistorial = computed(() => {
  const n = historialCargasFiltrado.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaHistorial.value);
});

const historialPaginado = computed(() => {
  const list = historialCargasFiltrado.value;
  const tam = tamPaginaHistorial.value;
  const p = Math.min(Math.max(1, paginaHistorial.value), totalPaginasHistorial.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoHistorialLabel = computed(() => {
  const total = historialCargasFiltrado.value.length;
  if (total === 0) return '0 resultados';
  const tam = tamPaginaHistorial.value;
  const p = Math.min(Math.max(1, paginaHistorial.value), totalPaginasHistorial.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

const totalPaginasTodos = computed(() => {
  const n = todosPacientesLista.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaTodos.value);
});

const todosPacientesPaginados = computed(() => {
  const list = todosPacientesLista.value;
  const tam = tamPaginaTodos.value;
  const p = Math.min(Math.max(1, paginaTodos.value), totalPaginasTodos.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoTodosLabel = computed(() => {
  const total = todosPacientesLista.value.length;
  if (total === 0) return '0 resultados';
  const tam = tamPaginaTodos.value;
  const p = Math.min(Math.max(1, paginaTodos.value), totalPaginasTodos.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

const detallesCargaLista = computed(() => {
  const d = cargaSeleccionada.value?.detalles;
  return Array.isArray(d) ? d : [];
});

const detallesImportacionLista = computed(() => {
  const d = resultadoImportacion.value?.detalles;
  return Array.isArray(d) ? d : [];
});

const totalPaginasResultadoImportacion = computed(() => {
  const n = detallesImportacionLista.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaResultadoImportacion.value);
});

const detallesImportacionPaginados = computed(() => {
  const list = detallesImportacionLista.value;
  const tam = tamPaginaResultadoImportacion.value;
  const p = Math.min(Math.max(1, paginaResultadoImportacion.value), totalPaginasResultadoImportacion.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoResultadoImportacionLabel = computed(() => {
  const total = detallesImportacionLista.value.length;
  if (total === 0) return '0 resultados';
  const tam = tamPaginaResultadoImportacion.value;
  const p = Math.min(Math.max(1, paginaResultadoImportacion.value), totalPaginasResultadoImportacion.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

const totalPaginasDetalleCarga = computed(() => {
  const n = detallesCargaLista.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaDetalle.value);
});

const detallesCargaPaginados = computed(() => {
  const list = detallesCargaLista.value;
  const tam = tamPaginaDetalle.value;
  const p = Math.min(Math.max(1, paginaDetalleCarga.value), totalPaginasDetalleCarga.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoDetalleCargaLabel = computed(() => {
  const total = detallesCargaLista.value.length;
  if (total === 0) return '0 filas';
  const tam = tamPaginaDetalle.value;
  const p = Math.min(Math.max(1, paginaDetalleCarga.value), totalPaginasDetalleCarga.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

watch([filtroRegistrosNombre, filtroRegistrosDni], () => {
  paginaRegistros.value = 1;
});

watch(registrosFiltrados, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / tamPagina.value) || 1);
  if (paginaRegistros.value > tp) paginaRegistros.value = tp;
}, { deep: true });

watch(filtroHistorialTexto, () => {
  paginaHistorial.value = 1;
});

watch(historialCargasFiltrado, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / tamPaginaHistorial.value) || 1);
  if (paginaHistorial.value > tp) paginaHistorial.value = tp;
}, { deep: true });

watch(todosPacientesLista, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / tamPaginaTodos.value) || 1);
  if (paginaTodos.value > tp) paginaTodos.value = tp;
}, { deep: true });

watch(() => cargaSeleccionada.value?.id, () => {
  paginaDetalleCarga.value = 1;
});

watch(tamPaginaResultadoImportacion, () => {
  paginaResultadoImportacion.value = 1;
});

watch(detallesImportacionLista, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / tamPaginaResultadoImportacion.value) || 1);
  if (paginaResultadoImportacion.value > tp) paginaResultadoImportacion.value = tp;
}, { deep: true });

watch(detallesCargaLista, (list) => {
  const tp = Math.max(1, Math.ceil(list.length / tamPaginaDetalle.value) || 1);
  if (paginaDetalleCarga.value > tp) paginaDetalleCarga.value = tp;
}, { deep: true });

watch(tamPagina, () => {
  const tp = Math.max(1, Math.ceil(registrosFiltrados.value.length / tamPagina.value) || 1);
  if (paginaRegistros.value > tp) paginaRegistros.value = tp;
});

watch(tamPaginaHistorial, () => {
  const tp = Math.max(1, Math.ceil(historialCargasFiltrado.value.length / tamPaginaHistorial.value) || 1);
  if (paginaHistorial.value > tp) paginaHistorial.value = tp;
});

watch(tamPaginaTodos, () => {
  const tp = Math.max(1, Math.ceil(todosPacientesLista.value.length / tamPaginaTodos.value) || 1);
  if (paginaTodos.value > tp) paginaTodos.value = tp;
});

watch(tamPaginaDetalle, () => {
  const tp = Math.max(1, Math.ceil(detallesCargaLista.value.length / tamPaginaDetalle.value) || 1);
  if (paginaDetalleCarga.value > tp) paginaDetalleCarga.value = tp;
});

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
    registrosHistorialCompleto.value = [];
    return;
  }
  cargando.value = true;
  try {
    const paramsUnidades = new URLSearchParams();
    if (idIpress != null && idIpress !== '') paramsUnidades.set('id_ipress', idIpress);
    if (idModalidad != null && idModalidad !== '') paramsUnidades.set('id_modalidad', idModalidad);

    const paramsDialisis = new URLSearchParams(qs);

    const [resRegistrosPeriodo, resRegistrosHistorial, resAtenciones, resDialisis] = await Promise.all([
      getAllIpress(`/unidadesActuales/?${paramsUnidades}`),
      getAllIpress(`/unidadesActuales/?${paramsUnidades}`),
      getAllIpress(`/pacienteAtencion/?${qs}`),
      getAllIpress(`/listado_pacientes_dialisis_por_ipress_periodo/?${paramsDialisis}`),
    ]);
    const atenciones = atencionesParaListadoRegistros(
      Array.isArray(resAtenciones) ? resAtenciones : (resAtenciones?.results || []),
    );
    listadoAtenciones.value = atenciones;

    const rango = rangoFechasPeriodo.value;
    const registrosPeriodo = (Array.isArray(resRegistrosPeriodo) ? resRegistrosPeriodo : (resRegistrosPeriodo?.results || []))
      .filter((r) => fechaCreacionAccesoEnPeriodo(r, rango) && esCambioAccesoVascular(r))
      .sort((a, b) => (Number(b.id_unidad_actual) || 0) - (Number(a.id_unidad_actual) || 0));
    registros.value = registrosPeriodo;

    const idsPaciente = new Set(
      atenciones
        .map((a) => a.id_paciente ?? a.datosPaciente?.id_paciente)
        .filter((id) => id != null)
        .map(String),
    );
    const todosRegistros = Array.isArray(resRegistrosHistorial) ? resRegistrosHistorial : (resRegistrosHistorial?.results || []);
    const historialFiltrado = todosRegistros.filter((r) => {
      const idP = idPacienteDesdeRegistro(r);
      if (idP == null || !idsPaciente.has(String(idP))) return false;
      const idIpressReg = idIpressDesdeRegistro(r);
      if (idIpress != null && idIpressReg != null && String(idIpressReg) !== String(idIpress)) return false;
      return true;
    });
    registrosHistorialCompleto.value = historialFiltrado;

    const listaDialisis = Array.isArray(resDialisis) ? resDialisis : (resDialisis?.results || []);
    const mapDialisis = {};
    listaDialisis.forEach((d) => {
      const pid = d.id_paciente ?? d.datosPaciente?.id_paciente;
      if (pid != null) mapDialisis[String(pid)] = d;
    });
    dialisisPorPaciente.value = mapDialisis;
  } catch (e) {
    console.error('Error al cargar registros de acceso vascular:', e);
    registros.value = [];
    registrosHistorialCompleto.value = [];
    dialisisPorPaciente.value = {};
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
      Array.isArray(res) ? res : (res?.results || [])
    );
  } catch (e) {
    console.error('Error al cargar atenciones:', e);
    listadoAtenciones.value = [];
  }
}

async function fetchPeriodoIpress() {
  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  if (idPeriodo == null || idIpress == null) {
    idPeriodoIpress.value = null;
    return;
  }
  try {
    const res = await postAllIpress('/consulta_periodo_ipress/', {
      id_ipress: idIpress,
      id_periodo: idPeriodo,
      id_estado: null,
    });
    const lista = Array.isArray(res) ? res : (res?.results || []);
    idPeriodoIpress.value = lista.length ? lista[0].id_periodo_ipress : null;
  } catch (e) {
    idPeriodoIpress.value = null;
  }
}

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
      numero_formulario: NUMERO_FORMULARIO_ACCESO_VASCULAR,
    });
    const abierto = res?.abierto !== false;
    estadoFormulario.value = abierto ? 'ABIERTO' : 'CERRADO';
  } catch (e) {
    console.error('Error al consultar estado del formulario:', e);
    estadoFormulario.value = 'CERRADO';
  } finally {
    cargandoEstadoFormulario.value = false;
  }
}

function abrirModalHistorialPaciente(fila) {
  if (!fila) return;
  if (fila.es_egresado) {
    ElMessage.warning('Paciente egresado: no se puede consultar el historial.');
    return;
  }
  pacienteHistorial.value = {
    id_paciente: fila.id_paciente ?? fila.registro?.datosPacienteAtencion?.id_paciente ?? null,
    paciente: fila.paciente || '—',
    documento: fila.documento || '—',
  };
  paginaHistorialPaciente.value = 1;
  mostrarModalHistorialPaciente.value = true;
}

function cerrarModalHistorialPaciente() {
  mostrarModalHistorialPaciente.value = false;
  pacienteHistorial.value = null;
  paginaHistorialPaciente.value = 1;
}

const historialPacienteLista = computed(() => {
  const idPac = pacienteHistorial.value?.id_paciente;
  if (idPac == null || idPac === '') return [];
  const key = String(idPac);
  return (Array.isArray(registrosHistorialCompleto.value) ? [...registrosHistorialCompleto.value] : [])
    .filter((r) => {
      const pid = idPacienteDesdeRegistro(r);
      return pid != null && String(pid) === key;
    })
    .sort((a, b) => {
      const fa = fechaOrdenHistorialAcceso(a);
      const fb = fechaOrdenHistorialAcceso(b);
      if (fa && fb && fa !== fb) return fb.localeCompare(fa);
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      return (Number(b.id_unidad_actual) || 0) - (Number(a.id_unidad_actual) || 0);
    });
});

const totalPaginasHistorialPaciente = computed(() => {
  const n = historialPacienteLista.value.length;
  if (n === 0) return 1;
  return Math.ceil(n / tamPaginaHistorialPaciente.value);
});

const historialPacientePaginado = computed(() => {
  const list = historialPacienteLista.value;
  const tam = tamPaginaHistorialPaciente.value;
  const p = Math.min(Math.max(1, paginaHistorialPaciente.value), totalPaginasHistorialPaciente.value);
  const start = (p - 1) * tam;
  return list.slice(start, start + tam);
});

const rangoHistorialPacienteLabel = computed(() => {
  const total = historialPacienteLista.value.length;
  if (total === 0) return '0 cambios';
  const tam = tamPaginaHistorialPaciente.value;
  const p = Math.min(Math.max(1, paginaHistorialPaciente.value), totalPaginasHistorialPaciente.value);
  const start = (p - 1) * tam + 1;
  const end = Math.min(p * tam, total);
  return `Mostrando ${start}–${end} de ${total}`;
});

function indiceHistorialPaciente(idx) {
  return (paginaHistorialPaciente.value - 1) * tamPaginaHistorialPaciente.value + idx + 1;
}

watch([historialPacienteLista, tamPaginaHistorialPaciente], () => {
  const tp = Math.max(1, Math.ceil(historialPacienteLista.value.length / tamPaginaHistorialPaciente.value) || 1);
  if (paginaHistorialPaciente.value > tp) paginaHistorialPaciente.value = tp;
});

function abrirModalNuevo() {
  if (!formularioAbierto.value) return;
  registroEdicion.value = null;
  pacienteParaFormulario.value = null;
  idPacienteAtencionParaForm.value = null;
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  form2ModalKey.value += 1;
  fetchPacientesAtencion();
  fetchPeriodoIpress();
  mostrarModalNuevo.value = true;
}

function abrirModalEditar(registro) {
  if (!formularioAbierto.value || !registro) return;
  if (registroDePacienteEgresado(registro, listadoAtenciones.value)) {
    ElMessage.warning('Paciente egresado: no se puede editar el registro.');
    return;
  }
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
  form2ModalKey.value += 1;
  fetchPeriodoIpress();
  mostrarModalNuevo.value = true;
}

async function eliminarRegistro(registro) {
  if (!formularioAbierto.value || !registro?.id_unidad_actual) return;
  const nombre = nombrePaciente(registro);
  const confirmar = window.confirm(`¿Eliminar el registro de acceso vascular de ${nombre}?`);
  if (!confirmar) return;
  eliminandoId.value = registro.id_unidad_actual;
  try {
    await deleteAllIpress(`/unidadesActuales/${registro.id_unidad_actual}/`);
    ElMessage.success('Registro eliminado correctamente.');
    await fetchRegistros();
  } catch (e) {
    console.error('Error al eliminar acceso vascular:', e);
    ElMessage.error('No se pudo eliminar el registro.');
  } finally {
    eliminandoId.value = null;
  }
}

function confirmarPacienteYMostrarFormulario() {
  const id = idPacienteSeleccionado.value;
  const atencion = listadoAtenciones.value.find(
    a => a.id_paciente_atencion === id || String(a.id_paciente_atencion) === String(id)
  );
  if (atencion?.datosPaciente) {
    pacienteParaFormulario.value = atencion.datosPaciente;
    idPacienteAtencionParaForm.value = atencion.id_paciente_atencion ?? id;
    form2ModalKey.value += 1;
  }
}

function registroPorAtencion(idAtencion) {
  const id = String(idAtencion);
  const lista = (Array.isArray(registros.value) ? registros.value : [])
    .filter((r) => String(r.id_paciente_atencion ?? r.datosPacienteAtencion?.id_paciente_atencion) === id)
    .sort((a, b) => (Number(b.id_unidad_actual) || 0) - (Number(a.id_unidad_actual) || 0));
  return lista[0] || null;
}

async function resolverIdPacienteAtencionCaptacion(idPacienteAtencion, idPaciente) {
  if (idPacienteAtencion != null && idPacienteAtencion !== '') return Number(idPacienteAtencion);
  if (idPaciente == null || idPaciente === '') return null;

  const idPeriodo = periodoGlobal.value;
  const idIpress = clinicaGlobal.value;
  const idModalidad = modalidadGlobal.value;
  const params = new URLSearchParams({ id_paciente: String(idPaciente) });
  if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', String(idPeriodo));
  if (idIpress != null && idIpress !== '') params.set('id_ipress', String(idIpress));
  if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', String(idModalidad));

  const res = await getAllIpress(`/pacienteAtencion/?${params.toString()}`);
  const lista = Array.isArray(res) ? res : (res?.results || []);
  const activa = lista.find((a) => String(a.estado || '').toUpperCase() === 'ACTIVO');
  const candidata = activa || [...lista].sort(
    (a, b) => (Number(b.id_paciente_atencion) || 0) - (Number(a.id_paciente_atencion) || 0),
  )[0];
  return candidata?.id_paciente_atencion ?? null;
}

async function abrirFormularioDesdeCaptacion(idPacienteAtencion, idPaciente) {
  if (!formularioAbierto.value) {
    ElMessage.warning('El formulario de Acceso Vascular está cerrado para este periodo.');
    return;
  }

  const idAtencion = await resolverIdPacienteAtencionCaptacion(idPacienteAtencion, idPaciente);
  if (idAtencion == null) {
    ElMessage.error('No se encontró la atención activa del paciente capturado.');
    return;
  }

  await Promise.all([fetchRegistros(), fetchPacientesAtencion(), fetchPeriodoIpress()]);

  const registroExistente = registroPorAtencion(idAtencion);
  if (registroExistente) {
    abrirModalEditar(registroExistente);
    return;
  }

  let paciente = listadoAtenciones.value.find(
    (a) => String(a.id_paciente_atencion) === String(idAtencion),
  )?.datosPaciente;

  if (!paciente) {
    const atencion = await getAllIpress(`/pacienteAtencion/${idAtencion}/`);
    paciente = atencion?.datosPaciente ?? null;
  }

  if (!paciente) {
    ElMessage.error('No se pudo cargar el paciente para acceso vascular.');
    return;
  }

  registroEdicion.value = null;
  pacienteParaFormulario.value = paciente;
  idPacienteAtencionParaForm.value = Number(idAtencion);
  idPacienteSeleccionado.value = '';
  busquedaPaciente.value = '';
  form2ModalKey.value += 1;
  mostrarModalNuevo.value = true;
}

async function procesarQueryCaptacionAccesoVascular() {
  const abrir = route.query.abrirFormulario === '1';
  if (!abrir) return;

  await abrirFormularioDesdeCaptacion(route.query.idPacienteAtencion, route.query.idPaciente);

  const query = { ...route.query };
  delete query.abrirFormulario;
  delete query.idPacienteAtencion;
  delete query.idPaciente;
  router.replace({ query });
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
  paginaResultadoImportacion.value = 1;
  mostrarModalImportar.value = true;
}

function cerrarModalImportar() {
  mostrarModalImportar.value = false;
  archivoSeleccionado.value = null;
  resultadoImportacion.value = null;
  paginaResultadoImportacion.value = 1;
  arrastrando.value = false;
  fetchRegistros();
}

const COLUMNAS_FORMATO = [
  'dni',
  'paciente',
  'tipo_acceso',
  'localizacion_acceso',
  'fecha_creacion_acceso',
  'fecha_inicio_canulacion',
  'motivo_cambio',
];

const exportandoExcel = ref(false);

const puedeExportarAccesoVascularExcel = computed(() => {
  if (cargando.value) return false;
  if (vistaActiva.value === 'registros') {
    return registrosFiltrados.value.length > 0;
  }
  return todosPacientesLista.value.length > 0;
});

function filasExcelVistaRegistros() {
  return registrosFiltrados.value.map((r) => ({
    Paciente: nombrePaciente(r),
    DNI: documentoPaciente(r),
    'Tipo acceso': r.tipo_acceso || r.tipo_acceso_actual || '',
    Localización: r.localizacion_acceso || r.localizacion_acceso_actual || '',
    'Fecha creación': fechaCreacionAccesoColumna(r) || '',
    'F. inicio canulación': textoCanulacionRegistro(r),
    'Motivo cambio': r.motivo_cambio || '',
    Estado: r.estado_aprobacion || 'PENDIENTE',
    'Editado supervisor': r.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': r.comentario_evaluacion || '',
  }));
}

function filasExcelVistaTodos() {
  return todosPacientesLista.value.map((fila) => ({
    Paciente: fila.paciente || '',
    DNI: fila.documento || '',
    'Tiene registro': fila.tieneRegistro ? 'Sí' : (fila.desdeFichaDialisis ? 'Desde ficha diálisis' : 'No'),
    'Tipo acceso': fila.tipo_acceso || '',
    Localización: fila.localizacion_acceso || '',
    'Fecha creación': fila.fecha_creacion_acceso || '',
    'F. inicio canulación': textoCanulacionRegistro(fila),
    'Motivo cambio': fila.motivo_cambio || '',
    Estado: fila.estado_aprobacion || (fila.tieneRegistro ? 'PENDIENTE' : 'SIN REGISTRO'),
    'Editado supervisor': fila.supervisor_edito_registro ? 'Sí' : 'No',
    'Comentario supervisor': fila.comentario_evaluacion || '',
  }));
}

async function exportarDatosAccesoVascularExcel() {
  if (!puedeExportarAccesoVascularExcel.value) {
    ElMessage.warning('No hay datos para exportar con los filtros actuales.');
    return;
  }
  exportandoExcel.value = true;
  try {
    const esRegistros = vistaActiva.value === 'registros';
    const rows = esRegistros ? filasExcelVistaRegistros() : filasExcelVistaTodos();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Acceso vascular');
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
    const sufijo = esRegistros ? 'solo_registros' : 'todos_pacientes';
    XLSX.writeFile(wb, `acceso_vascular_${sufijo}_${stamp}.xlsx`);
    ElMessage.success(`Se exportaron ${rows.length} fila(s).`);
  } catch (e) {
    console.error(e);
    ElMessage.error('No se pudo generar el archivo Excel.');
  } finally {
    exportandoExcel.value = false;
  }
}

function descargarFormatoExcel() {
  const wsData = [
    COLUMNAS_FORMATO,
    ...todosPacientesLista.value.map((fila) => [
      fila.documento || '',
      fila.paciente || '',
      '',
      '',
      '',
      '',
      '',
    ]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Acceso vascular');
  XLSX.writeFile(wb, 'formato_acceso_vascular.xlsx');
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
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
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
  if (!rangoFechasPeriodo.value.min || !rangoFechasPeriodo.value.max) {
    resultadoImportacion.value = { ok: false, mensaje: 'No se pudo determinar el rango del periodo seleccionado.' };
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
    const headers = rows[0].map(h => String(h ?? '').trim().toLowerCase().replace(/\s+/g, '_'));
    const dataRows = rows.slice(1).filter(r => r.some(c => c != null && String(c).trim() !== ''));
    let creados = 0;
    let errores = 0;
    const detalles = [];
    const cambiosEnLote = new Set();
    for (const row of dataRows) {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] != null ? String(row[i]).trim() : ''; });
      const validacion = validarFilaImportacion(obj, cambiosEnLote);
      if (!validacion.ok) {
        detalles.push(detalleFilaImportacion(obj, {
          guardado: false,
          mensaje: validacion.mensaje,
        }));
        errores++;
        continue;
      }
      const motivoCambio = String(obj.motivo_cambio || '').trim();
      if (motivoCambio) {
        const atencion = listadoAtenciones.value.find((item) => String(item.datosPaciente?.documento || '').trim() === String(obj.dni || '').trim());
        const idPac = atencion?.id_paciente ?? atencion?.datosPaciente?.id_paciente;
        if (idPac != null) {
          cambiosEnLote.add(claveCambioAccesoMismoDia(idPac, obj.fecha_creacion_acceso));
        }
      }
      try {
        await postAllIpress('/unidadesActuales/', validacion.payload);
        detalles.push(detalleFilaImportacion(validacion.detalle, {
          guardado: true,
          mensaje: 'Registro guardado correctamente.',
        }));
        creados++;
      } catch (e) {
        detalles.push(detalleFilaImportacion(validacion.detalle, {
          guardado: false,
          mensaje: e?.error || 'Error al guardar el registro.',
        }));
        errores++;
      }
    }
    const nuevaCarga = {
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
    };
    historialCargas.value = [nuevaCarga, ...historialCargas.value];
    guardarHistorialCargas();
    paginaResultadoImportacion.value = 1;
    resultadoImportacion.value = {
      ok: errores === 0,
      mensaje: `Importación completada: ${creados} registro(s) guardado(s), ${errores} con error, de ${dataRows.length} fila(s).`,
      totalFilas: dataRows.length,
      guardadas: creados,
      errores,
      detalles,
    };
    fetchRegistros();
  } catch (e) {
    console.error(e);
    resultadoImportacion.value = { ok: false, mensaje: 'Error al procesar el archivo. Verifique que sea un Excel válido.' };
  } finally {
    importando.value = false;
  }
}

async function fetchPeriodos() {
  try {
    const respuesta = await getAllIpress('/periodos/');
    periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
  } catch (e) {
    periodos.value = [];
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  fetchRegistros();
  fetchEstadoFormulario();
}, { deep: true });

watch(
  () => [route.query.abrirFormulario, route.query.idPacienteAtencion, route.query.idPaciente],
  () => {
    procesarQueryCaptacionAccesoVascular();
  },
);

onMounted(async () => {
  cargarHistorialCargas();
  fetchPeriodos();
  await Promise.all([fetchRegistros(), fetchEstadoFormulario()]);
  await procesarQueryCaptacionAccesoVascular();
});
</script>

<style scoped>
.tabla-av {
  width: max-content;
  min-width: 100%;
  table-layout: auto;
}

.tabla-av-th,
.tabla-av-td {
  white-space: nowrap;
  padding: 0.375rem 0.75rem;
  font-size: 0.6875rem;
  line-height: 1.25;
}

.tabla-av-th {
  text-align: left;
  font-size: 0.625rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tabla-av-badge {
  font-size: 0.625rem;
}

.tabla-av-col-comentario {
  min-width: 10rem;
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tabla-av-th-acciones,
.tabla-av-td-acciones {
  text-align: right;
}

.tabla-av-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tabla-av-btn:disabled {
  opacity: 0.45;
  pointer-events: none;
}

.tabla-av-btn-editar {
  border: 1px solid #a5f3fc;
  color: #0e7490;
  background: transparent;
}

.tabla-av-btn-editar:hover:not(:disabled) {
  background: #ecfeff;
}

.tabla-av-btn-historial {
  border: 1px solid #c7d2fe;
  color: #4338ca;
  background: transparent;
}

.tabla-av-btn-historial:hover:not(:disabled) {
  background: #eef2ff;
}

.tabla-av-btn-eliminar {
  border: 1px solid #fecdd3;
  color: #be123c;
  background: transparent;
}

.tabla-av-btn-eliminar:hover:not(:disabled) {
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
  border: 1px solid #0891b2;
  color: #fff;
  background: #0891b2;
}

.header-accion-btn-primario:hover:not(:disabled) {
  background: #0e7490;
}
</style>
