<template>
  <div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-violet-500 rounded-full"></span>
          Evaluación de registros
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Revise los registros cargados por las clínicas: puede <strong>editar</strong> datos y dejar un comentario visible para la clínica; luego <strong>aprobar</strong>. Use el mismo periodo, IPRESS y modalidad de la barra superior.
        </p>
        <p class="text-xs text-slate-500 mt-2">
          <strong>Editar</strong> guarda correcciones y comentario del supervisor; <strong>Aprobar</strong> marca el registro como revisado favorablemente.
        </p>
        <p class="text-xs text-slate-500 mt-1">
          Solo se muestra el <strong>último registro</strong> de cada paciente (mayor ID del formulario = fila más reciente en base de datos).
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
          <template v-if="modulo === 'resumen_notif'">Seleccione <strong>periodo</strong> y <strong>modalidad</strong> en la barra superior (la clínica del selector no filtra esta lista).</template>
          <template v-else>Seleccione periodo, clínica y modalidad en la barra superior.</template>
        </div>
        <div v-else-if="cargandoVistaActual" class="p-12 text-center text-slate-500">Cargando...</div>

        <template v-else>
        <template v-if="modulo !== 'resumen_notif'">
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
            Todos los registros visibles están <strong>aprobados</strong>. Puede cerrar el formulario para este periodo, clínica y modalidad.
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
        </template>

        <!-- Acceso vascular -->
        <div v-if="modulo === 'acceso'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay registros de acceso vascular.</div>
          <template v-else>
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipo acceso</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Localización</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Editado sup.</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Comentario</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostradaPaginada" :key="r.id_unidad_actual" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.tipo_acceso || '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.localizacion_acceso || '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="r.supervisor_edito_registro" class="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">Sí</span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" :title="r.comentario_evaluacion || ''">{{ comentarioCorto(r.comentario_evaluacion) }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                      :disabled="guardandoEdicion === claveFila('acceso', r.id_unidad_actual)"
                      @click="abrirModalEditar('acceso', r)"
                    >Editar</button>
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('acceso', r.id_unidad_actual)"
                      @click="evaluar('acceso', r, 'APROBADO')"
                    >Aprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <TablaPaginacion v-model:page="paginaRegistros" v-model:page-size="pageSizeTablas" :total="listaMostrada.length" />
          </template>
        </div>

        <!-- Eventos infecciosos -->
        <div v-else-if="modulo === 'eventos'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay eventos infecciosos.</div>
          <template v-else>
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Tipo infección</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Fecha evento</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Editado sup.</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Comentario</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostradaPaginada" :key="r.id_evento_acceso_vascular" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.tipo_infeccion || '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.fecha_evento || '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="r.supervisor_edito_registro" class="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">Sí</span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" :title="r.comentario_evaluacion || ''">{{ comentarioCorto(r.comentario_evaluacion) }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                      :disabled="guardandoEdicion === claveFila('eventos', r.id_evento_acceso_vascular)"
                      @click="abrirModalEditar('eventos', r)"
                    >Editar</button>
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('eventos', r.id_evento_acceso_vascular)"
                      @click="evaluar('eventos', r, 'APROBADO')"
                    >Aprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <TablaPaginacion v-model:page="paginaRegistros" v-model:page-size="pageSizeTablas" :total="listaMostrada.length" />
          </template>
        </div>

        <!-- Morbilidad -->
        <div v-else-if="modulo === 'morbilidad'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay registros de morbilidad hospitalaria.</div>
          <template v-else>
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Diagnóstico</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">F. hospitalización</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Editado sup.</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Comentario</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostradaPaginada" :key="r.id_morbilidad_hospitalaria" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.diagnostico || '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.fecha_hospitalizacion || '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="r.supervisor_edito_registro" class="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">Sí</span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" :title="r.comentario_evaluacion || ''">{{ comentarioCorto(r.comentario_evaluacion) }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                      :disabled="guardandoEdicion === claveFila('morbilidad', r.id_morbilidad_hospitalaria)"
                      @click="abrirModalEditar('morbilidad', r)"
                    >Editar</button>
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('morbilidad', r.id_morbilidad_hospitalaria)"
                      @click="evaluar('morbilidad', r, 'APROBADO')"
                    >Aprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <TablaPaginacion v-model:page="paginaRegistros" v-model:page-size="pageSizeTablas" :total="listaMostrada.length" />
          </template>
        </div>

        <!-- Resultados clínicos -->
        <div v-else-if="modulo === 'resultados'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay resultados clínicos.</div>
          <template v-else>
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Hb</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Kt/V</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Editado sup.</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Comentario</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostradaPaginada" :key="r.id_resultado_clinico" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.Hb ?? r.hb ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.ktv ?? '—' }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="r.supervisor_edito_registro" class="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">Sí</span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" :title="r.comentario_evaluacion || ''">{{ comentarioCorto(r.comentario_evaluacion) }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                      :disabled="guardandoEdicion === claveFila('resultados', r.id_resultado_clinico)"
                      @click="abrirModalEditar('resultados', r)"
                    >Editar</button>
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('resultados', r.id_resultado_clinico)"
                      @click="evaluar('resultados', r, 'APROBADO')"
                    >Aprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <TablaPaginacion v-model:page="paginaRegistros" v-model:page-size="pageSizeTablas" :total="listaMostrada.length" />
          </template>
        </div>

        <!-- Vacunación -->
        <div v-else-if="modulo === 'vacunacion'" class="overflow-x-auto">
          <div v-if="listaMostrada.length === 0" class="p-12 text-center text-slate-500 italic">No hay registros de vacunación.</div>
          <template v-else>
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Paciente</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">DNI</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Resumen</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Evaluado por</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Editado sup.</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Comentario</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in listaMostradaPaginada" :key="r.id_vacunacion" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ nombrePaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ documentoPaciente(r) }}</td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ resumenVacuna(r) }}</td>
                <td class="px-4 py-3 text-sm"><span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="claseEstado(r.estado_aprobacion)">{{ r.estado_aprobacion || 'PENDIENTE' }}</span></td>
                <td class="px-4 py-3 text-sm text-slate-600">{{ r.datosEvaluadoPor?.nombre || '—' }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="r.supervisor_edito_registro" class="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800">Sí</span>
                  <span v-else class="text-slate-400">—</span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" :title="r.comentario_evaluacion || ''">{{ comentarioCorto(r.comentario_evaluacion) }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                      :disabled="guardandoEdicion === claveFila('vacunacion', r.id_vacunacion)"
                      @click="abrirModalEditar('vacunacion', r)"
                    >Editar</button>
                    <button
                      v-if="mostrarBotonAprobar(r.estado_aprobacion)"
                      type="button"
                      class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      :disabled="evaluando === claveFila('vacunacion', r.id_vacunacion)"
                      @click="evaluar('vacunacion', r, 'APROBADO')"
                    >Aprobar</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <TablaPaginacion v-model:page="paginaRegistros" v-model:page-size="pageSizeTablas" :total="listaMostrada.length" />
          </template>
        </div>

        <!-- Resumen: notificación envío a revisión por IPRESS (periodo + modalidad del selector) -->
        <div v-else-if="modulo === 'resumen_notif'" class="overflow-x-auto">
          <p v-if="errorResumenNotif" class="m-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{{ errorResumenNotif }}</p>
          <template v-else>
            <div class="px-4 py-3 text-sm text-slate-600 border-b border-slate-100 bg-slate-50/80">
              Listado de todas las IPRESS para el <strong>periodo</strong> y la <strong>modalidad</strong> elegidos arriba. Indica si la clínica usó «Notificar» en los módulos de registros.
              <span v-if="resumenTotales.total_ipress > 0" class="block mt-2 font-semibold text-slate-800">
                Notificaron {{ resumenTotales.total_notificados }} de {{ resumenTotales.total_ipress }} establecimientos.
              </span>
              <p class="mt-2 text-xs text-slate-500 max-w-4xl">
                La acción <strong>Pasar pacientes al periodo siguiente</strong> solo se habilita cuando la clínica ha usado <strong>Notificar</strong>, todos los formularios con datos están <strong>cerrados</strong> y no se está consultando el estado ni ejecutando el traslado.
              </p>
            </div>
            <div v-if="listaIpressNotificaciones.length === 0" class="p-12 text-center text-slate-500 italic">No hay IPRESS registradas.</div>
            <template v-else>
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">IPRESS</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Nombre corto</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Notificado</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Fecha / hora</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Usuario</th>
                  <th class="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">Siguiente periodo</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="row in listaIpressPaginada"
                  :key="row.id_ipress"
                  class="hover:bg-slate-50"
                  :class="Number(clinicaGlobal) === Number(row.id_ipress) ? 'bg-sky-50/60' : ''"
                >
                  <td class="px-4 py-3 text-sm font-medium text-slate-800">{{ row.ipress || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ row.nombre_corto || '—' }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      v-if="row.notificado"
                      class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800"
                    >Sí</span>
                    <span
                      v-else
                      class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >No</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ formatoFechaNotifRow(row.notificado_en) }}</td>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ row.usuario_nombre || '—' }}</td>
                  <td class="px-4 py-3 text-sm">
                    <button
                      type="button"
                      class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                      :class="puedeActivarBotonPasarPacientes(row)
                        ? 'border-violet-300 bg-violet-50 text-violet-800 hover:bg-violet-100'
                        : 'border-slate-200 bg-slate-50 text-slate-500'"
                      :disabled="pasandoPacientesIpress === Number(row.id_ipress) || !puedeActivarBotonPasarPacientes(row)"
                      :title="tituloBotonPasarPacientes(row)"
                      @click="confirmarPasarPacientesSiguientePeriodo(row)"
                    >
                      {{ pasandoPacientesIpress === Number(row.id_ipress) ? 'Procesando…' : 'Pasar pacientes' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <TablaPaginacion v-model:page="paginaResumen" v-model:page-size="pageSizeResumen" :total="listaIpressNotificaciones.length" />
            </template>
          </template>
        </div>
        </template>
      </div>

      <div
        v-if="modalEditarAbierto"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4"
        @click.self="cerrarModalEditar"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
          <div class="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-violet-50">
            <h3 class="font-bold text-slate-800">Editar registro (supervisor)</h3>
            <button type="button" class="text-slate-500 hover:text-slate-800 text-lg leading-none" aria-label="Cerrar" @click="cerrarModalEditar">✕</button>
          </div>
          <div class="p-5 overflow-y-auto flex-1 space-y-3">
            <div v-for="campo in camposEdicionActuales" :key="campo.key" class="space-y-1">
              <label class="text-xs font-semibold text-slate-600">{{ campo.label }}</label>
              <input
                v-if="campo.type !== 'bool'"
                v-model="formEdicion[campo.key]"
                type="text"
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <label v-else class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input v-model="formEdicion[campo.key]" type="checkbox" class="rounded border-slate-300 text-violet-600" />
                Activo / Sí
              </label>
            </div>
            <div class="space-y-1 pt-2 border-t border-slate-100">
              <label class="text-xs font-semibold text-slate-600">Comentario para la clínica</label>
              <textarea
                v-model="formEdicion.comentario_evaluacion"
                rows="3"
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                placeholder="Observaciones visibles en la vista de registros de la clínica…"
              />
            </div>
          </div>
          <div class="px-5 py-3 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
            <button type="button" class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg" @click="cerrarModalEditar">Cancelar</button>
            <button
              type="button"
              class="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50"
              :disabled="!!guardandoEdicion"
              @click="guardarEdicion"
            >{{ guardandoEdicion ? 'Guardando…' : 'Guardar cambios' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject, onMounted, onUnmounted } from 'vue';
import { getAllIpress, postAllIpress, patchAllIpress } from '@/services/ipress/Ipress.service';
import { ElMessage, ElMessageBox } from 'element-plus';
import TablaPaginacion from '@/components/TablaPaginacion.vue';

const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));

const tabs = [
  { key: 'acceso', label: 'Acceso Vascular' },
  { key: 'eventos', label: 'Eventos Infecciosos' },
  { key: 'morbilidad', label: 'Morbilidad Hospitalaria' },
  { key: 'resultados', label: 'Resultados Clínicos' },
  { key: 'vacunacion', label: 'Vacunación' },
  { key: 'resumen_notif', label: 'Notificación clínicas' },
];

const modulo = ref('acceso');
const cargando = ref(false);
const cargandoResumenNotif = ref(false);
const listaIpressNotificaciones = ref([]);
const errorResumenNotif = ref('');
const resumenTotales = ref({ total_ipress: 0, total_notificados: 0 });
/** id_ipress (string) -> { puede_pasar, motivo, id_periodo_destino, periodo_destino_label, formularios_con_datos_abiertos } */
const estadoPasarPorIpress = ref({});
const cargandoEstadoPasar = ref(false);
const pasandoPacientesIpress = ref(null);
const evaluando = ref(null);
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

const paginaRegistros = ref(1);
const pageSizeTablas = ref(15);
const paginaResumen = ref(1);
const pageSizeResumen = ref(15);

/** Aviso cuando la clínica usó «Notificar» en los módulos de registros. */
const notificacionClinica = ref({
  notificado: false,
  notificado_en: null,
  usuario_nombre: null,
});

const textoFechaNotificacion = computed(() => {
  const iso = notificacionClinica.value?.notificado_en;
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return String(iso);
  }
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
  if (modulo.value === 'resumen_notif') fetchListaNotificacionesClinicas();
}

function formatoFechaNotifRow(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return String(iso);
  }
}

async function fetchListaNotificacionesClinicas() {
  errorResumenNotif.value = '';
  if (modulo.value !== 'resumen_notif') return;
  const pOk = periodoGlobal.value != null && periodoGlobal.value !== '';
  const mOk = modalidadGlobal.value != null && modalidadGlobal.value !== '';
  if (!pOk || !mOk) {
    listaIpressNotificaciones.value = [];
    resumenTotales.value = { total_ipress: 0, total_notificados: 0 };
    estadoPasarPorIpress.value = {};
    return;
  }
  cargandoResumenNotif.value = true;
  try {
    const params = new URLSearchParams();
    params.set('id_periodo', String(periodoGlobal.value));
    params.set('id_modalidad', String(modalidadGlobal.value));
    const r = await getAllIpress(`/lista_notificacion_envio_revision_por_periodo/?${params.toString()}`);
    listaIpressNotificaciones.value = Array.isArray(r?.results) ? r.results : [];
    resumenTotales.value = {
      total_ipress: Number(r?.total_ipress) || listaIpressNotificaciones.value.length,
      total_notificados: Number(r?.total_notificados) || 0,
    };
    await fetchEstadoPasarPacientesPeriodo();
  } catch (e) {
    console.error(e);
    listaIpressNotificaciones.value = [];
    resumenTotales.value = { total_ipress: 0, total_notificados: 0 };
    estadoPasarPorIpress.value = {};
    const msg = e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo cargar el resumen.';
    errorResumenNotif.value = typeof msg === 'string' ? msg : 'No se pudo cargar el resumen.';
  } finally {
    cargandoResumenNotif.value = false;
  }
}

async function fetchEstadoPasarPacientesPeriodo() {
  const pOk = periodoGlobal.value != null && periodoGlobal.value !== '';
  const mOk = modalidadGlobal.value != null && modalidadGlobal.value !== '';
  if (!pOk || !mOk) {
    estadoPasarPorIpress.value = {};
    return;
  }
  cargandoEstadoPasar.value = true;
  try {
    const params = new URLSearchParams();
    params.set('id_periodo', String(periodoGlobal.value));
    params.set('id_modalidad', String(modalidadGlobal.value));
    const r = await getAllIpress(`/consulta_estado_pasar_pacientes_periodo/?${params.toString()}`);
    estadoPasarPorIpress.value = r?.por_ipress && typeof r.por_ipress === 'object' ? { ...r.por_ipress } : {};
  } catch (e) {
    console.error(e);
    estadoPasarPorIpress.value = {};
    ElMessage.warning('No se pudo consultar si se pueden pasar pacientes al periodo siguiente.');
  } finally {
    cargandoEstadoPasar.value = false;
  }
}

function infoPasarPacientes(idIpress) {
  const key = String(idIpress);
  const raw = estadoPasarPorIpress.value[key];
  if (raw && typeof raw === 'object') {
    return {
      puede_pasar: !!raw.puede_pasar,
      motivo: raw.motivo || '',
      periodo_destino_label: raw.periodo_destino_label || '',
      formularios_con_datos_abiertos: Array.isArray(raw.formularios_con_datos_abiertos) ? raw.formularios_con_datos_abiertos : [],
    };
  }
  return {
    puede_pasar: false,
    motivo: cargandoEstadoPasar.value ? 'Consultando permisos…' : 'Sin información de estado.',
    periodo_destino_label: '',
    formularios_con_datos_abiertos: [],
  };
}

/** Habilitar botón: notificación enviada + puede_pasar + no cargando estado (el POST se refleja en disabled aparte). */
function puedeActivarBotonPasarPacientes(row) {
  if (!row?.notificado) return false;
  if (cargandoEstadoPasar.value) return false;
  return !!infoPasarPacientes(row.id_ipress).puede_pasar;
}

function tituloBotonPasarPacientes(row) {
  if (!row?.notificado) {
    return 'La clínica debe usar «Notificar» en registros antes de poder pasar pacientes al periodo siguiente.';
  }
  if (cargandoEstadoPasar.value) return 'Consultando permisos y periodo destino…';
  const info = infoPasarPacientes(row.id_ipress);
  if (!info.puede_pasar) return info.motivo || 'No se puede pasar de periodo en este momento.';
  if (info.periodo_destino_label) return `Trasladar al periodo ${info.periodo_destino_label} (confirmar en el diálogo).`;
  return 'Pasar pacientes al periodo siguiente';
}

async function confirmarPasarPacientesSiguientePeriodo(row) {
  const idIpress = row?.id_ipress;
  if (idIpress == null) return;
  if (!row?.notificado) return;
  const info = infoPasarPacientes(idIpress);
  if (!info.puede_pasar || cargandoEstadoPasar.value) return;
  const nombre = row.nombre_corto || row.ipress || 'esta clínica';
  const destino = info.periodo_destino_label || 'el periodo siguiente';
  try {
    await ElMessageBox.confirm(
      `¿Está seguro de cargar los pacientes del periodo actual al periodo posterior (${destino}) para «${nombre}»? ` +
        'Se crearán registros de atención en el nuevo periodo solo para pacientes que aún no existan allí.',
      'Confirmar paso de pacientes',
      {
        type: 'warning',
        confirmButtonText: 'Sí, pasar pacientes',
        cancelButtonText: 'Cancelar',
      },
    );
  } catch {
    return;
  }
  pasandoPacientesIpress.value = Number(idIpress);
  try {
    await postAllIpress('/pasar_pacientes_siguiente_periodo/', {
      id_periodo: Number(periodoGlobal.value),
      id_ipress: Number(idIpress),
      id_modalidad: Number(modalidadGlobal.value),
    });
    ElMessage.success('Pacientes actualizados en el periodo siguiente.');
    await fetchEstadoPasarPacientesPeriodo();
  } catch (e) {
    console.error(e);
    const msg =
      e?.response?.data?.detail ||
      e?.detail ||
      e?.error ||
      e?.message ||
      'No se pudo completar el traslado de pacientes.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo completar el traslado de pacientes.');
  } finally {
    pasandoPacientesIpress.value = null;
  }
}

const modalEditarAbierto = ref(false);
const moduloEdicion = ref('acceso');
const filaEdicion = ref(null);
const formEdicion = ref({});
const guardandoEdicion = ref(null);

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

const camposEdicionActuales = computed(() => CAMPOS_EDICION[moduloEdicion.value] || []);

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

/** Pestaña «Notificación clínicas» solo exige periodo + modalidad (lista todas las IPRESS). */
const filtroContenidoListo = computed(() => {
  if (modulo.value === 'resumen_notif') {
    return (
      periodoGlobal.value != null &&
      periodoGlobal.value !== '' &&
      modalidadGlobal.value != null &&
      modalidadGlobal.value !== ''
    );
  }
  return filtroListo.value;
});

const cargandoVistaActual = computed(() => {
  return modulo.value === 'resumen_notif' ? cargandoResumenNotif.value : cargando.value;
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

function claseEstado(estado) {
  const v = String(estado || '').toUpperCase();
  if (v === 'APROBADO') return 'bg-emerald-100 text-emerald-700';
  if (v === 'DESAPROBADO') return 'bg-rose-100 text-rose-700';
  return 'bg-amber-100 text-amber-700';
}

function comentarioCorto(text, max = 56) {
  const s = String(text || '').trim();
  if (!s) return '—';
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

function valorBoolModelo(v) {
  return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
}

function abrirModalEditar(mod, row) {
  moduloEdicion.value = mod;
  filaEdicion.value = row;
  const cfg = ENDPOINTS[mod];
  const fields = CAMPOS_EDICION[mod] || [];
  const o = { comentario_evaluacion: row.comentario_evaluacion || '' };
  for (const f of fields) {
    const raw = row[f.key];
    o[f.key] = f.type === 'bool' ? valorBoolModelo(raw) : (raw ?? '');
  }
  formEdicion.value = o;
  modalEditarAbierto.value = true;
}

function cerrarModalEditar() {
  modalEditarAbierto.value = false;
  filaEdicion.value = null;
  guardandoEdicion.value = null;
}

async function guardarEdicion() {
  const mod = moduloEdicion.value;
  const row = filaEdicion.value;
  const cfg = ENDPOINTS[mod];
  if (!row || !cfg) return;
  const id = row[cfg.idKey];
  if (id == null) return;
  const key = claveFila(mod, id);
  guardandoEdicion.value = key;
  const fields = CAMPOS_EDICION[mod] || [];
  const payload = { comentario_evaluacion: formEdicion.value.comentario_evaluacion ?? '' };
  for (const f of fields) {
    if (f.type === 'bool') {
      payload[f.key] = !!formEdicion.value[f.key];
    } else {
      payload[f.key] = formEdicion.value[f.key];
    }
  }
  try {
    await patchAllIpress(`/${cfg.path}/${id}/edicion-supervisor/`, payload);
    ElMessage.success('Cambios guardados.');
    cerrarModalEditar();
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    ElMessage.error(e?.detail || e?.error || 'No se pudo guardar la edición.');
  } finally {
    guardandoEdicion.value = null;
  }
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
  return ultimosRegistrosPorPaciente(rawListaPorModulo(modulo.value), cfg.idKey);
});

/** Paginación en cliente sobre filas ya deduplicadas (último registro por paciente). */
const listaMostradaPaginada = computed(() => {
  const all = listaMostrada.value;
  const size = pageSizeTablas.value;
  const start = (paginaRegistros.value - 1) * size;
  return all.slice(start, start + size);
});

const listaIpressPaginada = computed(() => {
  const all = listaIpressNotificaciones.value;
  const size = pageSizeResumen.value;
  const start = (paginaResumen.value - 1) * size;
  return all.slice(start, start + size);
});

function clampPaginaRegistros() {
  const total = listaMostrada.value.length;
  const size = pageSizeTablas.value;
  const maxP = Math.max(1, Math.ceil(total / size) || 1);
  if (paginaRegistros.value > maxP) paginaRegistros.value = maxP;
}

function clampPaginaResumen() {
  const total = listaIpressNotificaciones.value.length;
  const size = pageSizeResumen.value;
  const maxP = Math.max(1, Math.ceil(total / size) || 1);
  if (paginaResumen.value > maxP) paginaResumen.value = maxP;
}

watch(listaMostrada, clampPaginaRegistros, { deep: true });
watch(pageSizeTablas, clampPaginaRegistros);
watch(listaIpressNotificaciones, clampPaginaResumen, { deep: true });
watch(pageSizeResumen, clampPaginaResumen);

const etiquetaModuloActual = computed(() => {
  const t = tabs.find((x) => x.key === modulo.value);
  return t?.label || 'este formulario';
});

const todosRegistrosVisiblesAprobados = computed(() => {
  const rows = listaMostrada.value;
  if (!rows.length) return false;
  return rows.every((r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO');
});

/** Solo si el formulario está abierto a nivel periodo/IPRESS/modalidad y todos los visibles aprobados */
const puedeCerrarFormulario = computed(() => {
  if (!filtroListo.value || formularioEstaAbierto.value !== true) return false;
  const rows = listaMostrada.value;
  if (!rows.length) return false;
  return rows.every((r) => String(r.estado_aprobacion || '').toUpperCase() === 'APROBADO');
});

const mostrarBannerAbrir = computed(() => {
  return filtroListo.value && formularioEstaAbierto.value === false;
});

function mostrarBotonAprobar(estado) {
  return String(estado || '').toUpperCase() !== 'APROBADO';
}

async function fetchEstadoFormularioActual() {
  if (!filtroListo.value) {
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
  } catch (e) {
    console.error(e);
    const msg = e?.error || e?.response?.data?.error || e?.response?.data?.detail || e?.detail || e?.message || 'No se pudo cerrar el formulario.';
    ElMessage.error(typeof msg === 'string' ? msg : 'No se pudo cerrar el formulario.');
  } finally {
    cerrandoFormulario.value = false;
  }
}

async function cargarModuloActual() {
  if (!filtroListo.value) {
    listaAcceso.value = [];
    listaEventos.value = [];
    listaMorbilidad.value = [];
    listaResultados.value = [];
    listaVacunacion.value = [];
    return;
  }
  const qs = buildQs();
  cargando.value = true;
  try {
    if (modulo.value === 'acceso') {
      const res = await getAllIpress(`/unidadesActuales/?${qs}`);
      listaAcceso.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'eventos') {
      const res = await getAllIpress(`/eventosAccesosVasculares/?${qs}`);
      listaEventos.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'morbilidad') {
      const res = await getAllIpress(`/morbilidadesHospitalarias/?${qs}`);
      listaMorbilidad.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'resultados') {
      const res = await getAllIpress(`/resultadosClinicos/?${qs}`);
      listaResultados.value = Array.isArray(res) ? res : res?.results || [];
    } else if (modulo.value === 'vacunacion') {
      const res = await getAllIpress(`/vacunaciones/?${qs}`);
      listaVacunacion.value = Array.isArray(res) ? res : res?.results || [];
    }
  } catch (e) {
    console.error(e);
    ElMessage.error('Error al cargar los registros.');
  } finally {
    cargando.value = false;
  }
}

async function evaluar(mod, row, estadoAprobacion) {
  const cfg = ENDPOINTS[mod];
  const id = row?.[cfg.idKey];
  if (id == null) return;
  const key = claveFila(mod, id);
  evaluando.value = key;
  try {
    await postAllIpress(`/${cfg.path}/${id}/evaluar/`, { estado_aprobacion: estadoAprobacion });
    ElMessage.success('Registro aprobado.');
    await cargarModuloActual();
  } catch (e) {
    console.error(e);
    ElMessage.error(e?.detail || e?.error || 'No se pudo actualizar el registro.');
  } finally {
    evaluando.value = null;
  }
}

watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
  paginaRegistros.value = 1;
  paginaResumen.value = 1;
  if (modulo.value === 'resumen_notif') {
    fetchListaNotificacionesClinicas();
  } else {
    cargarModuloActual();
    fetchEstadoFormularioActual();
    fetchNotificacionEnvioRevision();
  }
}, { deep: true });
watch(modulo, () => {
  paginaRegistros.value = 1;
  paginaResumen.value = 1;
  if (modulo.value === 'resumen_notif') {
    fetchListaNotificacionesClinicas();
  } else {
    cargarModuloActual();
    fetchEstadoFormularioActual();
  }
});

onMounted(() => {
  cargarModuloActual();
  fetchEstadoFormularioActual();
  fetchNotificacionEnvioRevision();
  window.addEventListener('notificacion-revision:actualizar', onNotificacionRevisionEvent);
});

onUnmounted(() => {
  window.removeEventListener('notificacion-revision:actualizar', onNotificacionRevisionEvent);
});
</script>
