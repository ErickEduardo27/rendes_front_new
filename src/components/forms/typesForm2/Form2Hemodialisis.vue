<template>
    <div :class="esEdicionDirecta ? 'p-1' : 'min-h-screen bg-gray-50/50 p-3'">

        <div :class="esEdicionDirecta ? 'mx-auto mb-4' : 'max-w-7xl mx-auto mb-6'">

            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Periodo</label>
                        <div
                            class="w-full bg-slate-100 border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 font-medium">
                            {{ periodoTexto || '—' }}
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Clinica</label>
                        <div
                            class="w-full bg-slate-100 border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 font-medium">
                            {{ clinicaTexto || '—' }}
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Modalidad</label>
                        <div
                            class="w-full bg-slate-100 border border-slate-300 text-slate-700 text-sm rounded-lg p-2.5 font-medium">
                            {{ modalidadTexto || '—' }}
                        </div>
                    </div>
                </div>
                <div v-if="paciente" class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <span class="text-sm font-bold text-slate-700">Paciente:</span>
                    <span class="text-slate-800 font-medium">{{ paciente.paciente || '—' }}</span>
                    <span class="text-slate-400">|</span>
                    <span class="text-sm font-bold text-slate-700">DNI:</span>
                    <span class="text-slate-800 font-medium">{{ paciente.documento || '—' }}</span>
                </div>
            </div>
        </div>

        <div v-if="esEdicionDirecta" class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">Datos del acceso vascular</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de creación *</label>
                    <input v-model="form.fecha_creacion_acceso_nuevo" type="date"
                        class="w-full border text-slate-800 text-sm rounded-lg p-2.5"
                        :class="erroresNuevoAcceso.fecha_creacion_acceso_nuevo ? 'border-red-500' : 'border-slate-300'"
                        :min="minFechaNuevoAccesoVascular || undefined"
                        :max="rangoFechasPeriodo.max || undefined"
                        @input="erroresNuevoAcceso.fecha_creacion_acceso_nuevo = ''" />
                    <p v-if="erroresNuevoAcceso.fecha_creacion_acceso_nuevo"
                        class="text-[11px] text-red-500 mt-1 font-medium">
                        {{ erroresNuevoAcceso.fecha_creacion_acceso_nuevo }}
                    </p>
                    <p v-else-if="esFechaCambioAccesoVascular && fechaCreacionAccesoActualISO"
                        class="text-[11px] text-slate-500 mt-1">
                        Puede ser anterior al periodo, pero no anterior al acceso vigente ({{ fechaCreacionAccesoActualISO }}).
                    </p>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de acceso *</label>
                    <select v-model="form.tipo_acceso_nuevo"
                        class="w-full border text-slate-800 text-sm rounded-lg p-2.5 bg-white"
                        :class="erroresNuevoAcceso.tipo_acceso_nuevo ? 'border-red-500' : 'border-slate-300'"
                        @change="erroresNuevoAcceso.tipo_acceso_nuevo = ''">
                        <option value="">Seleccione…</option>
                        <option v-for="t in tiposAccesoNuevoFiltrados" :key="t.value" :value="t.value">{{ t.label }}</option>
                    </select>
                    <p v-if="erroresNuevoAcceso.tipo_acceso_nuevo"
                        class="text-[11px] text-red-500 mt-1 font-medium">
                        {{ erroresNuevoAcceso.tipo_acceso_nuevo }}
                    </p>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Localización *</label>
                    <select v-model="form.localizacion_acceso_nuevo"
                        class="w-full border text-slate-800 text-sm rounded-lg p-2.5 bg-white"
                        :class="erroresNuevoAcceso.localizacion_acceso_nuevo ? 'border-red-500' : 'border-slate-300'"
                        :disabled="!form.tipo_acceso_nuevo"
                        @change="erroresNuevoAcceso.localizacion_acceso_nuevo = ''">
                        <option value="">Seleccione…</option>
                        <option v-for="op in opcionesLocalizacionNuevoFiltradas" :key="op.value" :value="op.value">{{ op.label }}</option>
                    </select>
                    <p v-if="erroresNuevoAcceso.localizacion_acceso_nuevo"
                        class="text-[11px] text-red-500 mt-1 font-medium">
                        {{ erroresNuevoAcceso.localizacion_acceso_nuevo }}
                    </p>
                </div>
                <div v-if="form.motivo_cambio || desdeFormularioInfeccion">
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo del cambio</label>
                    <select v-model="form.motivo_cambio"
                        class="w-full border text-slate-800 text-sm rounded-lg p-2.5 bg-white border-slate-300 disabled:bg-slate-100 disabled:text-slate-700 disabled:cursor-not-allowed"
                        :disabled="desdeFormularioInfeccion">
                        <option :value="null">Seleccione…</option>
                        <option value="Complicación mecánica">Complicación mecánica</option>
                        <option value="Complicación infecciosa">Complicación infecciosa</option>
                        <option value="Prescripción médica">Prescripción médica</option>
                    </select>
                </div>
            </div>
            <ComentarioSupervisorEvaluacion v-if="modoSupervisor" v-model="comentarioSupervisor" />
            <div class="flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-4 mt-4">
                <button type="button"
                    class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                    @click="emit('cancelar')">
                    Cancelar
                </button>
                <button type="button"
                    class="px-4 py-2 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                    :disabled="guardando"
                    @click="guardarRegistro">
                    {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
                </button>
            </div>
        </div>

        <div v-else class="bg-white p-4 rounded-xl shadow-sm border border-slate-200">

            <div class="flex-1 space-y-8">

                <div>
                    <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <span class="w-1.5 h-8 bg-cyan-500 rounded-full"></span>
                        Acceso de Diálisis
                    </h2>
                    <p class="text-slate-500 mt-1 ml-4 text-sm">A continuación se presenta el Acceso Vascular Actual del
                        paciente.</p>
                </div>

                <div v-if="tieneHistorialAcceso"
                    class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="font-bold text-slate-700 text-sm uppercase tracking-wide">Acceso Vascular Vigente
                        </h3>
                        <span class="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-600 rounded">Solo
                            Lectura</span>
                    </div>

                    <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Acceso</label>
                            <div class="relative">
                                <select disabled v-model="form.tipo_acceso_actual"
                                    class="w-full bg-slate-100 border border-slate-300 text-slate-600 text-sm rounded-lg p-2.5 appearance-none cursor-not-allowed font-medium">
                                    <option disabled value="">Sin registro</option>
                                    <option value="Catéter Venoso Central Temporal">Catéter Venoso Central Temporal
                                    </option>
                                    <option value="Catéter Venoso Central de Larga Permanencia">Catéter Venoso Central
                                        de Larga Permanencia</option>
                                    <option value="Fístula Arteriovenosa">Fístula Arteriovenosa</option>
                                    <option value="Injerto Autólogo">Injerto Autólogo</option>
                                    <option value="Injerto Protésico">Injerto Protésico</option>
                                    <option value="Catéter peritoneal">Catéter peritoneal</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Localización</label>
                            <div class="relative">
                                <select disabled v-model="form.localizacion_acceso_actual"
                                    class="w-full bg-slate-100 border border-slate-300 text-slate-600 text-sm rounded-lg p-2.5 appearance-none cursor-not-allowed font-medium">
                                    <option disabled value="">Sin registro</option>
                                    <option v-for="op in opcionesLocalizacion" :key="op.value" :value="op.value">{{
                                        op.label }}</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Creación</label>
                            <input disabled v-model="form.fecha_creacion_acceso_actual" type="date"
                                class="w-full bg-slate-100 border border-slate-300 text-slate-600 text-sm rounded-lg p-2.5 cursor-not-allowed font-medium" />
                        </div>
                    </div>
                </div>

                <!--   <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                    El acceso vigente e historial son solo lectura. Use la sección siguiente para <strong>registrar un acceso vascular</strong> en el periodo actual (misma clínica y modalidad del selector superior).
                </div> -->

                <!-- Registro de nuevo acceso (POST /unidadesActuales/) -->
                <div v-if="puedeRegistrarAcceso"
                    class="bg-white rounded-xl shadow-sm border border-cyan-200 overflow-hidden ring-1 ring-cyan-100/80">
                    <div class="bg-cyan-50 px-6 py-4 border-b border-cyan-100">
                        <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wide">Registrar acceso vascular
                        </h3>
                        <p class="text-xs text-slate-600 mt-1">Indique si desea registrar un <strong>cambio de
                                acceso</strong> en este periodo. Solo si responde afirmativo se mostrarán los campos.
                        </p>
                    </div>
                    <div class="px-6 pt-5 pb-2" v-if="!desdeFormularioInfeccion">
                        <p class="text-sm font-semibold text-slate-800 mb-3">¿Desea registrar un cambio de acceso
                            vascular?</p>
                        <div class="flex flex-wrap gap-6">
                            <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                                <input v-model="deseaRegistrarCambioAcceso" type="radio" value="no"
                                    class="h-4 w-4 border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                                <span>No</span>
                            </label>
                            <label class="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                                <input v-model="deseaRegistrarCambioAcceso" type="radio" value="si"
                                    class="h-4 w-4 border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                                <span>Sí</span>
                            </label>
                        </div>
                    </div>
                    <p v-else class="px-6 pt-4 pb-2 text-xs text-cyan-800 bg-cyan-50/80 border-b border-cyan-100">
                        Complete el nuevo acceso vascular. El motivo del cambio queda registrado como <strong>complicación infecciosa</strong>.
                    </p>
                    <template v-if="deseaRegistrarCambioAcceso === 'si' || desdeFormularioInfeccion">
                        <div class="p-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de creación
                                    *</label>
                                <input v-model="form.fecha_creacion_acceso_nuevo" type="date"
                                    class="w-full border text-slate-800 text-sm rounded-lg p-2.5"
                                    :class="erroresNuevoAcceso.fecha_creacion_acceso_nuevo ? 'border-red-500' : 'border-slate-300'"
                                    :min="minFechaNuevoAccesoVascular || undefined"
                                    :max="rangoFechasPeriodo.max || undefined"
                                    @input="erroresNuevoAcceso.fecha_creacion_acceso_nuevo = ''" />
                                <p v-if="erroresNuevoAcceso.fecha_creacion_acceso_nuevo"
                                    class="text-[11px] text-red-500 mt-1 font-medium">
                                    {{ erroresNuevoAcceso.fecha_creacion_acceso_nuevo }}
                                </p>
                                <p v-else-if="fechaCreacionAccesoActualISO && esFechaCambioAccesoVascular" class="text-[11px] text-slate-500 mt-1">
                                    Puede ser anterior al periodo, pero no anterior al acceso vigente ({{ fechaCreacionAccesoActualISO }}).
                                </p>
                                <p v-else-if="fechaCreacionAccesoActualISO" class="text-[11px] text-slate-500 mt-1">
                                    No puede ser anterior al acceso vigente ({{ fechaCreacionAccesoActualISO }}).
                                </p>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de acceso
                                    *</label>
                                <select v-model="form.tipo_acceso_nuevo"
                                    class="w-full border text-slate-800 text-sm rounded-lg p-2.5 bg-white"
                                    :class="erroresNuevoAcceso.tipo_acceso_nuevo ? 'border-red-500' : 'border-slate-300'"
                                    @change="erroresNuevoAcceso.tipo_acceso_nuevo = ''">
                                    <option value="">Seleccione…</option>
                                    <option v-for="t in tiposAccesoNuevoFiltrados" :key="t.value" :value="t.value">{{
                                        t.label }}</option>
                                </select>
                                <p v-if="erroresNuevoAcceso.tipo_acceso_nuevo"
                                    class="text-[11px] text-red-500 mt-1 font-medium">
                                    {{ erroresNuevoAcceso.tipo_acceso_nuevo }}
                                </p>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Localización
                                    *</label>
                                <select v-model="form.localizacion_acceso_nuevo"
                                    class="w-full border text-slate-800 text-sm rounded-lg p-2.5 bg-white"
                                    :class="erroresNuevoAcceso.localizacion_acceso_nuevo ? 'border-red-500' : 'border-slate-300'"
                                    :disabled="!form.tipo_acceso_nuevo"
                                    @change="erroresNuevoAcceso.localizacion_acceso_nuevo = ''">
                                    <option value="">Seleccione…</option>
                                    <option v-for="op in opcionesLocalizacionNuevoFiltradas" :key="op.value"
                                        :value="op.value">{{ op.label }}</option>
                                </select>
                                <p v-if="erroresNuevoAcceso.localizacion_acceso_nuevo"
                                    class="text-[11px] text-red-500 mt-1 font-medium">
                                    {{ erroresNuevoAcceso.localizacion_acceso_nuevo }}
                                </p>
                            </div>
                        </div>
                        <div v-if="tieneHistorialAcceso || desdeFormularioInfeccion" class="px-6 pb-4">
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo del
                                cambio *</label>
                            <select v-model="form.motivo_cambio"
                                class="w-full max-w-md border text-slate-800 text-sm rounded-lg p-2.5 bg-white disabled:bg-slate-100 disabled:text-slate-700 disabled:cursor-not-allowed"
                                :class="erroresNuevoAcceso.motivo_cambio ? 'border-red-500' : 'border-slate-300'"
                                :disabled="desdeFormularioInfeccion"
                                @change="erroresNuevoAcceso.motivo_cambio = ''">
                                <option :value="null">Seleccione…</option>
                                <option value="Complicación mecánica">Complicación mecánica</option>
                                <option value="Complicación infecciosa">Complicación infecciosa</option>
                                <option value="Prescripción médica">Prescripción médica</option>
                            </select>
                            <p v-if="desdeFormularioInfeccion" class="text-[11px] text-slate-500 mt-1">
                                Motivo fijado automáticamente por el evento infeccioso.
                            </p>
                            <p v-if="erroresNuevoAcceso.motivo_cambio"
                                class="text-[11px] text-red-500 mt-1 font-medium">
                                {{ erroresNuevoAcceso.motivo_cambio }}
                            </p>
                        </div>
                        <div class="px-6 pb-6 flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-4">
                            <button type="button"
                                class="px-4 py-2.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                                :disabled="guardando" @click="guardarRegistro">
                                {{ guardando ? 'Guardando…' : 'Guardar registro' }}
                            </button>
                        </div>
                    </template>
                </div>
                <div v-else class="rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900">
                    Para registrar un acceso vascular se requiere la atención del paciente (<code
                        class="text-xs bg-amber-100 px-1 rounded">id_paciente_atencion</code>). Abra este formulario
                    desde
                    <strong>Acceso Vascular</strong> o desde la lista de pacientes con un paciente que tenga atención en
                    el periodo.
                </div>

                <div class="pt-4">
                    <h3 class="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Historial de Cambios
                    </h3>
                    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div v-if="historialAcceso.length === 0"
                            class="text-slate-400 text-center py-8 italic bg-slate-50">
                            No se encontraron registros previos de cambios.
                        </div>
                        <div v-else class="divide-y divide-slate-100">
                            <div v-for="(cambio, index) in historialAcceso" :key="index"
                                class="p-4 hover:bg-slate-50 transition-colors">
                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div class="flex items-start gap-3">
                                        <div class="bg-blue-100 text-blue-600 p-2 rounded-lg mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold text-slate-800">{{ cambio.tipo_acceso }}</p>
                                            <p class="text-xs text-slate-500">{{ cambio.localizacion }}</p>
                                            <p v-if="cambio.motivo"
                                                class="text-xs text-slate-600 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">
                                                Motivo: {{ cambio.motivo }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm font-semibold text-slate-700">{{ cambio.fecha }}</p>
                                        <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                                            :class="cambio.estado === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                                            {{ cambio.estado }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-full lg:w-80 space-y-6">

            </div>
        </div>

        <div v-if="mostrarHistorico"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
            <div
                class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-scaleIn">
                <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="font-bold text-slate-800">Historial del Paciente</h3>
                    <button class="text-slate-400 hover:text-red-500 transition-colors" @click="cerrarHistorico">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto custom-scrollbar">
                    <div v-if="historico.length === 0" class="text-slate-400 text-center py-8">No hay registros.</div>
                    <ul v-else class="space-y-3">
                        <li v-for="item in historicoOrdenado" :key="item.id_registro"
                            class="border border-slate-100 rounded-lg p-3 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                            <div class="text-xs text-slate-400 font-bold uppercase mb-1">{{ item.fecha }}</div>
                            <div class="text-sm text-slate-700">{{ item.detalle }}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-if="mostrarModalCaptar"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                <div class="bg-green-600 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Captar Paciente
                    </h3>
                    <button class="text-white/70 hover:text-white" @click="cerrarModalCaptar">&times;</button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Condición</label>
                        <select v-model="formCaptar.condicion"
                            class="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-700"
                            disabled>
                            <option value="">{{ condicionAutomatica }}</option>
                        </select>
                        <p class="text-xs text-green-600 mt-1 font-medium">{{ mensajeCondicion }}</p>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                        <input v-model="formCaptar.fecha" type="date"
                            class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-green-500 focus:border-green-500" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                        <textarea v-model="formCaptar.observaciones"
                            class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-green-500 focus:border-green-500"
                            rows="3"></textarea>
                    </div>
                </div>
                <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                    <button @click="cerrarModalCaptar"
                        class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                    <button @click="captarPaciente"
                        class="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors">Confirmar
                        Captación</button>
                </div>
            </div>
        </div>

        <div v-if="mostrarModalEgresar"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                <div class="bg-red-600 px-6 py-4 flex justify-between items-center">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                        </svg>
                        Egresar Paciente
                    </h3>
                    <button class="text-white/70 hover:text-white" @click="cerrarModalEgresar">&times;</button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                        <input v-model="formEgresar.fecha" type="date"
                            class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Egreso</label>
                        <select v-model="formEgresar.tipo_egreso"
                            class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-red-500 focus:border-red-500">
                            <option value="Hospitalización">Hospitalización</option>
                            <option value="Fallecimiento">Fallecimiento</option>
                            <option value="Trasplante">Trasplante</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div v-if="formEgresar.tipo_egreso === 'Otros'">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Especificar</label>
                        <input v-model="formEgresar.motivo_especifico" type="text"
                            class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-red-500 focus:border-red-500" />
                    </div>
                </div>
                <div class="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                    <button @click="cerrarModalEgresar"
                        class="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                    <button @click="egresarPaciente"
                        class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors">Confirmar
                        Egreso</button>
                </div>
            </div>
        </div>

        <div v-if="mostrarForm3Infeccion"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden animate-scaleIn flex flex-col">
                <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center shrink-0">
                    <h3 class="font-bold text-white text-sm uppercase tracking-wide">Registrar evento infeccioso</h3>
                    <button type="button" class="text-white/80 hover:text-white text-xl leading-none"
                        @click="cerrarForm3Infeccion">&times;</button>
                </div>
                <div class="overflow-y-auto flex-1 custom-scrollbar">
                    <Form3Hemodialisis
                        :key="form3InfeccionKey"
                        :paciente="paciente"
                        :id-paciente-atencion="idPacienteAtencion"
                        :iniciar-con-infeccion="true"
                        :fecha-evento-inicial="fechaAccesoParaInfeccion"
                        @guardado="onGuardadoForm3Infeccion"
                        @cancelar="cerrarForm3Infeccion"
                    />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed, watch, inject, defineAsyncComponent } from 'vue';
import { getAllIpress, patchAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { prepararPayloadUnidadesActuales, tipoAccesoDesdeDb } from '@/utils/unidadesActualesPayload';
import { ElMessage } from 'element-plus';
import ComentarioSupervisorEvaluacion from '@/components/evaluacion/ComentarioSupervisorEvaluacion.vue';
import { useEdicionSupervisor } from '@/composables/useEdicionSupervisor';

const Form3Hemodialisis = defineAsyncComponent(() => import('@/components/forms/typesForm3/Form3Hemodialisis.vue'));

const props = defineProps({
    paciente: { type: Object, required: true },
    periodo: { type: Number, required: true },
    periodoIpress: { type: Number, required: true },
    idPacienteAtencion: { type: [Number, String], default: null },
    registroEdicion: { type: Object, default: null },
    /** Abierto desde eventos infecciosos: no volver a abrir Form3 tras guardar (evita bucle). */
    desdeFormularioInfeccion: { type: Boolean, default: false },
    /** Preselección de motivo al abrir desde infección (p. ej. Complicación infecciosa). */
    motivoCambioInicial: { type: String, default: '' },
    modoSupervisor: { type: Boolean, default: false },
})
const { paciente, periodo, periodoIpress, idPacienteAtencion } = props
const emit = defineEmits(['cancelar', 'guardado'])

const { comentarioSupervisor, guardarComoSupervisor } = useEdicionSupervisor(props);

const esEdicionDirecta = computed(() => !!props.registroEdicion)

const router = useRouter()
const periodoGlobal = inject('periodoGlobal', ref(null))
const clinicaGlobal = inject('clinicaGlobal', ref(null))
const modalidadGlobal = inject('modalidadGlobal', ref(null))

const form = reactive({
    fecha_creacion_acceso_actual: null,
    tipo_acceso_actual: null,
    localizacion_acceso_actual: null,
    cambio_acceso: 'false',
    motivo_cambio: null,
    fecha_creacion_acceso_nuevo: null,
    tipo_acceso_nuevo: null,
    localizacion_acceso_nuevo: null,
    id_periodo_ipress: periodoIpress,
    id_red: 1,
    id_paciente: paciente.id_paciente
});


const formCaptar = reactive({ condicion: '', fecha: '', observaciones: '' });
const formEgresar = reactive({ fecha: '', tipo_egreso: '', motivo_especifico: '', observaciones: '' });

const pacienteSeleccionado = ref(null);
const idPeriodoIpress = periodoIpress;
const periodoActual = ref([]);
const historialAcceso = ref([]);
const tieneHistorialAcceso = computed(() => (historialAcceso.value && historialAcceso.value.length > 0));
const guardando = ref(false);
/** 'no' por defecto: los campos de nuevo acceso solo si el usuario elige Sí */
const deseaRegistrarCambioAcceso = ref('no');
const periodos = ref([]);
const clinicas = ref([]);
const mostrarHistorico = ref(false);
const historico = ref([]);
const mostrarForm3Infeccion = ref(false);
const form3InfeccionKey = ref(0);
const pendienteEmitirGuardado = ref(false);
const fechaAccesoParaInfeccion = ref('');
const mostrarModalCaptar = ref(false);
const mostrarModalEgresar = ref(false);
const historialMovimientos = ref([]);
const condicionAutomatica = ref('');
const mensajeCondicion = ref('');
const ultimoEgreso = ref(null);

const opcionesLocalizacion = [
    { value: '1', label: '1. FAV radial derecha' }, 
    { value: '2', label: '2. FAV radial izquierda' },
    { value: '3', label: '3. FAV braquial o cubital derecha' }, 
    { value: '4', label: '4. FAV braquial o cubital izquierda' },
    { value: '5', label: '5. CVCT yugular derecha' }, 
    { value: '6', label: '6. CVCT yugular izquierdo' },
    { value: '7', label: '7. CVCT subclavio derecho' }, 
    { value: '8', label: '8. CVCT subclavio izquierdo' },
    { value: '9', label: '9. CVCT femoral derecho' }, 
    { value: '10', label: '10. CVCT femoral izquierdo' },
    { value: '11', label: '11. CVCLP yugular derecha' }, 
    { value: '12', label: '12. CVCLP yugular izquierdo' },
    { value: '13', label: '13. CVCLP femoral derecho' }, 
    { value: '14', label: '14. CVCLP femoral izquierdo' },
    { value: '15', label: '15. CVCLP translumbar' }, 
    { value: '16', label: '16. CVCLP transhepático' },
    { value: '17', label: '17. Injerto autólogo' }, 
    { value: '18', label: '18. Injerto protésico' },
    { value: '19', label: '19. Catéter peritoneal' }
];

const listaTiposNuevo = [
    { value: 'Catéter Venoso Central Temporal', label: 'Catéter Venoso Central Temporal' },
    { value: 'Catéter Venoso Central de Larga Permanencia', label: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'Fístula Arteriovenosa', label: 'Fístula Arteriovenosa' },
    { value: 'Injerto Autólogo', label: 'Injerto Autólogo' },
    { value: 'Injerto Protésico', label: 'Injerto Protésico' },
    { value: 'Catéter peritoneal', label: 'Catéter peritoneal' }
];

const listaLocalizacionesNuevo = [
    { value: 'FAV radial derecha', label: 'FAV radial derecha', tipo: 'Fístula Arteriovenosa' },
    { value: 'FAV radial izquierda', label: 'FAV radial izquierda', tipo: 'Fístula Arteriovenosa' },
    { value: 'FAV braquial o cubital derecha', label: 'FAV braquial o cubital derecha', tipo: 'Fístula Arteriovenosa' },
    { value: 'FAV braquial o cubital izquierda', label: 'FAV braquial o cubital izquierda', tipo: 'Fístula Arteriovenosa' },
    { value: 'CVCT yugular derecha', label: 'CVCT yugular derecha', tipo: 'Catéter Venoso Central Temporal' },
    { value: 'CVCT yugular izquierdo', label: 'CVCT yugular izquierdo', tipo: 'Catéter Venoso Central Temporal' },
    { value: 'CVCT subclavio derecho', label: 'CVCT subclavio derecho', tipo: 'Catéter Venoso Central Temporal' },
    { value: 'CVCT subclavio izquierdo', label: 'CVCT subclavio izquierdo', tipo: 'Catéter Venoso Central Temporal' },
    { value: 'CVCT femoral derecho', label: 'CVCT femoral derecho', tipo: 'Catéter Venoso Central Temporal' },
    { value: 'CVCT femoral izquierdo', label: 'CVCT femoral izquierdo', tipo: 'Catéter Venoso Central Temporal' },
    { value: 'CVCLP yugular derecha', label: 'CVCLP yugular derecha', tipo: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'CVCLP yugular izquierdo', label: 'CVCLP yugular izquierdo', tipo: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'CVCLP femoral derecho', label: 'CVCLP femoral derecho', tipo: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'CVCLP femoral izquierdo', label: 'CVCLP femoral izquierdo', tipo: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'CVCLP translumbar', label: 'CVCLP translumbar', tipo: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'CVCLP transhepático', label: 'CVCLP transhepático', tipo: 'Catéter Venoso Central de Larga Permanencia' },
    { value: 'Injerto autólogo', label: 'Injerto autólogo', tipo: 'Injerto Autólogo' },
    { value: 'Injerto protésico', label: 'Injerto protésico', tipo: 'Injerto Protésico' },
    { value: 'Catéter peritoneal', label: 'Catéter peritoneal', tipo: 'Catéter peritoneal' }
];

const tiposAccesoNuevoFiltrados = computed(() => {
    const idModalidad = Number(pacienteSeleccionado.value?.id_modalidad ?? paciente?.id_modalidad ?? 1);
    if (idModalidad === 1) {
        return listaTiposNuevo.filter(t => t.value !== 'Catéter peritoneal');
    }
    return listaTiposNuevo.filter(t => t.value === 'Catéter peritoneal');
});

/** Requiere id de atención para el POST a /unidadesActuales/ */
const puedeRegistrarAcceso = computed(() => {
    const id = idPacienteAtencion;
    return id != null && id !== '' && String(id).trim() !== '';
});

const opcionesLocalizacionNuevoFiltradas = computed(() => {
    const tipoElegido = form.tipo_acceso_nuevo;
    if (!tipoElegido) return [];
    return listaLocalizacionesNuevo.filter(op => op.tipo === tipoElegido);
});

const silenciandoWatchTipoAcceso = ref(false);

watch(() => form.tipo_acceso_nuevo, (val) => {
    if (silenciandoWatchTipoAcceso.value) return;
    form.localizacion_acceso_nuevo = '';
    if (val === 'Catéter peritoneal') form.localizacion_acceso_nuevo = 'Catéter peritoneal';
});

const limpiarCamposNuevoAcceso = () => {
    form.fecha_creacion_acceso_nuevo = null;
    form.tipo_acceso_nuevo = null;
    form.localizacion_acceso_nuevo = null;
    if (!props.desdeFormularioInfeccion) {
        form.motivo_cambio = null;
    }
    limpiarErroresNuevoAcceso();
};

const erroresNuevoAcceso = reactive({
    fecha_creacion_acceso_nuevo: '',
    tipo_acceso_nuevo: '',
    localizacion_acceso_nuevo: '',
    motivo_cambio: '',
});

const LABELS_CAMPOS_NUEVO_ACCESO = {
    fecha_creacion_acceso_nuevo: 'Fecha de creación',
    tipo_acceso_nuevo: 'Tipo de acceso',
    localizacion_acceso_nuevo: 'Localización',
    motivo_cambio: 'Motivo del cambio',
};

const limpiarErroresNuevoAcceso = () => {
    for (const key of Object.keys(erroresNuevoAcceso)) {
        erroresNuevoAcceso[key] = '';
    }
};

const historicoOrdenado = computed(() => {
    return [...(historico.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const periodoVisibleId = computed(() => periodoGlobal.value ?? periodo ?? null)
const clinicaVisibleId = computed(() => clinicaGlobal.value ?? null)
const modalidadVisibleId = computed(() => modalidadGlobal.value ?? null)

const periodoTexto = computed(() => {
    const idPeriodo = periodoVisibleId.value
    if (idPeriodo == null) return ''
    const item = periodos.value.find((per) => String(per.id_periodo) === String(idPeriodo))
    return item?.periodo || ''
})

const clinicaTexto = computed(() => {
    const idClinica = clinicaVisibleId.value
    if (idClinica == null) return ''
    const item = clinicas.value.find((ip) => String(ip.id_ipress) === String(idClinica))
    return item?.nombre_corto || item?.ipress || ''
})

const modalidadTexto = computed(() => {
    const equivalencias = {
        1: 'Hemodialisis',
        2: 'Dialisis Peritoneal',
        3: 'Trasplante',
    }
    return equivalencias[Number(modalidadVisibleId.value)] || ''
})

const rangoFechasPeriodo = computed(() => {
    const lista = Array.isArray(periodos.value) ? periodos.value : [];
    const idPeriodo = periodoVisibleId.value ?? periodo;
    if (idPeriodo == null || idPeriodo === '') return { min: null, max: null };
    const p = lista.find(per => String(per.id_periodo) === String(idPeriodo));
    if (!p || !p.periodo) return { min: null, max: null };
    const parts = String(p.periodo).trim().split('-');
    if (parts.length < 2) return { min: null, max: null };
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (isNaN(year) || isNaN(month)) return { min: null, max: null };
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return {
        min: firstDay.toISOString().split('T')[0],
        max: lastDay.toISOString().split('T')[0]
    };
});

/** YYYY-MM-DD del acceso vigente (para min del nuevo y validación) */
const fechaCreacionAccesoActualISO = computed(() => {
    const v = form.fecha_creacion_acceso_actual;
    if (!v) return null;
    const s = String(v).trim().slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
});

const esMotivoCambioAcceso = (motivo) => motivo != null && String(motivo).trim() !== '';

/** Cambio de acceso (con motivo o nuevo registro con acceso vigente previo) */
const esFechaCambioAccesoVascular = computed(() => {
    if (esMotivoCambioAcceso(form.motivo_cambio)) return true;
    if (esMotivoCambioAcceso(props.registroEdicion?.motivo_cambio)) return true;
    if (tieneHistorialAcceso.value && deseaRegistrarCambioAcceso.value === 'si') return true;
    return false;
});

/** Mínimo: en cambio solo acceso vigente; en acceso inicial, periodo y/o vigente */
const minFechaNuevoAccesoVascular = computed(() => {
    if (esFechaCambioAccesoVascular.value) {
        return fechaCreacionAccesoActualISO.value || null;
    }
    const rMin = rangoFechasPeriodo.value.min;
    const vig = fechaCreacionAccesoActualISO.value;
    if (rMin && vig) return rMin > vig ? rMin : vig;
    return rMin || vig || null;
});

const validarFormulario = () => {
    limpiarErroresNuevoAcceso();

    const camposObligatorios = [
        'fecha_creacion_acceso_nuevo',
        'tipo_acceso_nuevo',
        'localizacion_acceso_nuevo',
    ];
    if ((!esEdicionDirecta.value && tieneHistorialAcceso.value) || props.desdeFormularioInfeccion) {
        camposObligatorios.push('motivo_cambio');
    }

    let primerError = '';
    for (const campo of camposObligatorios) {
        const valor = form[campo];
        if (valor == null || valor === '') {
            const msg = `Complete el campo "${LABELS_CAMPOS_NUEVO_ACCESO[campo]}".`;
            erroresNuevoAcceso[campo] = msg;
            if (!primerError) primerError = msg;
        }
    }
    if (primerError) {
        ElMessage({ message: primerError, type: 'warning', plain: true });
        return false;
    }

    const rango = rangoFechasPeriodo.value;
    const f = form.fecha_creacion_acceso_nuevo;

    if (esFechaCambioAccesoVascular.value) {
        const vig = fechaCreacionAccesoActualISO.value;
        if (vig && f && f < vig) {
            const msg = 'La fecha del cambio no puede ser anterior a la fecha del acceso vigente.';
            erroresNuevoAcceso.fecha_creacion_acceso_nuevo = msg;
            ElMessage({ message: msg, type: 'warning', plain: true });
            return false;
        }
        if (rango.max && f && f > rango.max) {
            const msg = `La fecha no puede ser posterior al periodo seleccionado (${rango.max}).`;
            erroresNuevoAcceso.fecha_creacion_acceso_nuevo = msg;
            ElMessage({ message: msg, type: 'warning', plain: true });
            return false;
        }
    } else if (rango.min && rango.max && f) {
        if (f < rango.min || f > rango.max) {
            const msg = `La fecha debe estar dentro del periodo seleccionado (${rango.min} a ${rango.max}).`;
            erroresNuevoAcceso.fecha_creacion_acceso_nuevo = msg;
            ElMessage({ message: msg, type: 'warning', plain: true });
            return false;
        }
        if (!esEdicionDirecta.value) {
            const vig = fechaCreacionAccesoActualISO.value;
            if (vig && f < vig) {
                const msg = 'La fecha del nuevo acceso no puede ser anterior a la fecha del acceso vigente.';
                erroresNuevoAcceso.fecha_creacion_acceso_nuevo = msg;
                ElMessage({ message: msg, type: 'warning', plain: true });
                return false;
            }
        }
    }
    return true;
};

function motivoDesdeRegistro(valor) {
    if (!valor) return null;
    const mapa = { '1': 'Complicación mecánica', '2': 'Complicación infecciosa', '3': 'Prescripción médica' };
    return mapa[String(valor)] || valor;
}

const esComplicacionInfecciosa = (motivo) => {
    const normalizado = motivoDesdeRegistro(motivo);
    return normalizado === 'Complicación infecciosa';
};

function aplicarMotivoDesdeInfeccion() {
    if (!props.desdeFormularioInfeccion || props.registroEdicion) return;
    deseaRegistrarCambioAcceso.value = 'si';
    const motivoIni = props.motivoCambioInicial || 'Complicación infecciosa';
    form.motivo_cambio = motivoDesdeRegistro(motivoIni) || motivoIni;
}

const finalizarFlujoGuardado = () => {
    emit('guardado');
};

const abrirForm3InfeccionTrasGuardado = (fechaAcceso) => {
    fechaAccesoParaInfeccion.value = fechaAcceso || '';
    pendienteEmitirGuardado.value = true;
    form3InfeccionKey.value += 1;
    mostrarForm3Infeccion.value = true;
};

const cerrarForm3Infeccion = () => {
    mostrarForm3Infeccion.value = false;
    if (pendienteEmitirGuardado.value) {
        pendienteEmitirGuardado.value = false;
        finalizarFlujoGuardado();
    }
};

const onGuardadoForm3Infeccion = () => {
    mostrarForm3Infeccion.value = false;
    if (pendienteEmitirGuardado.value) {
        pendienteEmitirGuardado.value = false;
        finalizarFlujoGuardado();
    }
};

function cargarRegistroEdicion(registro) {
    if (!registro) return;
    deseaRegistrarCambioAcceso.value = 'si';
    form.fecha_creacion_acceso_nuevo = registro.fecha_creacion_acceso || registro.fecha_creacion_acceso_actual || null;
    const loc = registro.localizacion_acceso || registro.localizacion_acceso_actual;
    silenciandoWatchTipoAcceso.value = true;
    form.tipo_acceso_nuevo = normalizarTipoAcceso(registro.tipo_acceso || registro.tipo_acceso_actual) || null;
    form.localizacion_acceso_nuevo = normalizarLocalizacionNuevo(loc);
    silenciandoWatchTipoAcceso.value = false;
    form.motivo_cambio = motivoDesdeRegistro(registro.motivo_cambio);
}

const esAccesoInicioRegistro = (motivo) => motivo == null || String(motivo).trim() === '';

async function sincronizarPacienteDialisisAccesoInicio() {
    const idPaciente = paciente?.id_paciente;
    if (!idPaciente) return;
    try {
        const res = await getAllIpress(`/pacientesDialisis/?id_paciente=${idPaciente}`);
        const lista = Array.isArray(res) ? res : (res?.results || []);
        const dial = [...lista].sort(
            (a, b) => (Number(b.id_paciente_dialisis) || 0) - (Number(a.id_paciente_dialisis) || 0),
        )[0];
        if (!dial?.id_paciente_dialisis) return;
        await patchAllIpress(`/pacientesDialisis/${dial.id_paciente_dialisis}/`, {
            tipo_acceso: normalizarTipoAcceso(form.tipo_acceso_nuevo) || dial.tipo_acceso,
            fecha_creacion_acceso: form.fecha_creacion_acceso_nuevo || dial.fecha_creacion_acceso,
            localizacion_acceso_inicio: describirLocalizacion(form.localizacion_acceso_nuevo) || dial.localizacion_acceso_inicio,
        });
    } catch (e) {
        console.warn('No se pudo sincronizar la ficha de diálisis con el acceso vascular:', e);
    }
}

const guardarRegistro = async () => {
    if (!validarFormulario()) return;
    const idAtencion = idPacienteAtencion != null && idPacienteAtencion !== '' ? idPacienteAtencion : null;
    if (!idAtencion) {
        ElMessage({ message: 'Falta identificar la atención del paciente. Vuelva a abrir el formulario desde Acceso Vascular.', type: 'warning', plain: true });
        return;
    }
    guardando.value = true;
    const motivoGuardado = form.motivo_cambio;
    const fechaAccesoGuardada = form.fecha_creacion_acceso_nuevo;
    try {
        const payload = prepararPayloadUnidadesActuales({
            id_paciente_atencion: Number(idAtencion),
            tipo_acceso: normalizarTipoAcceso(form.tipo_acceso_nuevo),
            localizacion_acceso: describirLocalizacion(form.localizacion_acceso_nuevo),
            fecha_creacion_acceso: form.fecha_creacion_acceso_nuevo,
            motivo_cambio: motivoGuardado || null
        });
        const idEdicion = props.registroEdicion?.id_unidad_actual;
        if (idEdicion) {
            if (props.modoSupervisor) {
                await guardarComoSupervisor('unidadesActuales', idEdicion, {
                    tipo_acceso: payload.tipo_acceso,
                    localizacion_acceso: payload.localizacion_acceso,
                    fecha_creacion_acceso: payload.fecha_creacion_acceso,
                    motivo_cambio: payload.motivo_cambio,
                });
            } else {
                await patchAllIpress(`/unidadesActuales/${idEdicion}/`, payload);
            }
            ElMessage({ message: 'Registro actualizado correctamente.', type: 'success', plain: true });
            finalizarFlujoGuardado();
            return;
        } else {
            await postAllIpress('/unidadesActuales/', payload);
            ElMessage({ message: 'Registro guardado correctamente.', type: 'success', plain: true });
        }
        const esAccesoInicio = esAccesoInicioRegistro(motivoGuardado)
            && esAccesoInicioRegistro(props.registroEdicion?.motivo_cambio);
        if (esAccesoInicio) {
            await sincronizarPacienteDialisisAccesoInicio();
        }
        await fetchUnidadesActualesPaciente();
        if (!props.registroEdicion?.id_unidad_actual) {
            limpiarCamposNuevoAcceso();
            deseaRegistrarCambioAcceso.value = 'no';
            if (!tieneHistorialAcceso.value) form.cambio_acceso = 'false';
        }
        if (esComplicacionInfecciosa(motivoGuardado) && !props.desdeFormularioInfeccion) {
            abrirForm3InfeccionTrasGuardado(fechaAccesoGuardada);
        } else {
            finalizarFlujoGuardado();
        }
    } catch (error) {
        console.error(error);
        ElMessage({ message: 'Error al guardar el registro.', type: 'error', plain: true });
    } finally {
        guardando.value = false;
    }
};

const postForm = async (url = null) => {
    if (!validarFormulario()) return;
    const formEnvio = {
        fecha_creacion_acceso_actual: form.fecha_creacion_acceso_nuevo,
        tipo_acceso_actual: normalizarTipoAcceso(form.tipo_acceso_nuevo),
        localizacion_acceso_actual: describirLocalizacion(form.localizacion_acceso_nuevo),
        cambio_acceso: null, motivo_cambio: null,
        fecha_creacion_acceso_nuevo: null, tipo_acceso_nuevo: null, localizacion_acceso_nuevo: null,
        id_periodo_ipress: periodoIpress, id_red: 1, id_paciente: paciente.id_paciente
    }
    try {
        await postAllIpress(url ?? "/unidadesActuales/", formEnvio);
        if (periodoActual.value[0]) await editForm();
        else { alert("Se registro con exito"); window.location.reload(); }
    } catch (error) { console.error(error); }
};

const editForm = async (url = null) => {
    try {
        await patchAllIpress(url ?? "/unidadesActuales/" + periodoActual.value[0].id_unidad_actual + "/", form);
        alert("Se registro con exito"); window.location.reload();
    } catch (error) { console.error(error); }
};

const normalizarTipoAcceso = (valor) => tipoAccesoDesdeDb(valor);

const normalizarLocalizacion = (valor) => {
    if (!valor) return null;
    const str = String(valor).trim();
    const op = opcionesLocalizacion.find(
        (o) => o.value === str || o.label === str || o.label.replace(/^\d+\.\s*/, '') === str
    );
    if (op) return op.value;
    const numero = str.match(/^(\d+)/)?.[1];
    if (numero) {
        const porNumero = opcionesLocalizacion.find((o) => o.value === numero);
        if (porNumero) return porNumero.value;
    }
    return null;
};

/** Valor del select de localización nuevo (texto sin prefijo numérico). */
const normalizarLocalizacionNuevo = (valor) => {
    if (!valor) return null;
    const str = String(valor).trim();
    const directa = listaLocalizacionesNuevo.find(
        (o) => o.value === str || o.label === str
    );
    if (directa) return directa.value;

    const idNormalizado = normalizarLocalizacion(valor);
    if (idNormalizado) {
        const op = opcionesLocalizacion.find((o) => o.value === idNormalizado);
        const sinPrefijo = op?.label.replace(/^\d+\.\s*/, '');
        const enLista = listaLocalizacionesNuevo.find((o) => o.value === sinPrefijo);
        if (enLista) return enLista.value;
    }

    const sinPrefijo = str.replace(/^\d+\.\s*/, '');
    const porTexto = listaLocalizacionesNuevo.find(
        (o) => o.value.localeCompare(sinPrefijo, undefined, { sensitivity: 'accent' }) === 0
    );
    return porTexto?.value ?? null;
};

const describirLocalizacion = (valor) => {
    if (!valor) return null;
    const idNormalizado = normalizarLocalizacion(valor);
    const opcion = opcionesLocalizacion.find((o) => o.value === idNormalizado);
    return opcion?.label ?? String(valor).trim();
};

const fetchUnidadesActualesPaciente = async () => {
    const idPaciente = paciente?.id_paciente;
    if (!idPaciente) {
        historialAcceso.value = [];
        periodoActual.value = [];
        return;
    }
    try {
        const respuesta = await getAllIpress("/unidadesActuales/?id_paciente=" + idPaciente);
        const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
        periodoActual.value = lista;
        if (lista.length === 0) {
            historialAcceso.value = [];
            form.fecha_creacion_acceso_actual = null;
            form.tipo_acceso_actual = null;
            form.localizacion_acceso_actual = null;
            return;
        }
        const ordenados = [...lista].sort((a, b) => (b.id_unidad_actual || 0) - (a.id_unidad_actual || 0));
        const actual = ordenados[0];
        form.fecha_creacion_acceso_actual = actual.fecha_creacion_acceso || actual.fecha_creacion_acceso_actual || null;
        form.tipo_acceso_actual = normalizarTipoAcceso(actual.tipo_acceso || actual.tipo_acceso_actual) || null;
        const locApi = actual.localizacion_acceso || actual.localizacion_acceso_actual;
        form.localizacion_acceso_actual = normalizarLocalizacion(locApi) ?? null;
        const motivoLabels = { '1': 'Complicación mecánica', '2': 'Complicación infecciosa', '3': 'Prescripción Médica' };
        historialAcceso.value = ordenados.map((r, i) => ({
            fecha: r.fecha_creacion_acceso || r.fecha_creacion_acceso_actual || '',
            tipo_acceso: normalizarTipoAcceso(r.tipo_acceso || r.tipo_acceso_actual) || '—',
            localizacion: describirLocalizacion(r.localizacion_acceso || r.localizacion_acceso_actual) || '—',
            motivo: motivoLabels[r.motivo_cambio] || r.motivo_cambio || '',
            estado: i === 0 ? 'Activo' : 'Anterior'
        }));
    } catch (error) {
        console.error('Error al obtener unidades actuales del paciente:', error);
        historialAcceso.value = [];
        periodoActual.value = [];
    }
};

const fetchPaciente = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;
    } catch (error) { console.error(error); }
};

const fetchPeriodo = async (url = null) => {
    try {
        const respuesta = await getAllIpress("/periodos/");
        periodos.value = respuesta;
    } catch (error) { console.error(error); }
};

const fetchClinicas = async () => {
    try {
        const respuesta = await getAllIpress("/ipress/");
        clinicas.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    } catch (error) {
        console.error(error);
        clinicas.value = [];
    }
};

const abrirHistorico = async () => { mostrarHistorico.value = true; };
const cerrarHistorico = () => { mostrarHistorico.value = false; };
const abrirModalCaptar = async () => { await determinarCondicionPaciente(); mostrarModalCaptar.value = true; };
const cerrarModalCaptar = () => { mostrarModalCaptar.value = false; };
const captarPaciente = async () => { cerrarModalCaptar(); };
const determinarCondicionPaciente = async () => { condicionAutomatica.value = 'NUEVO'; };
const abrirModalEgresar = () => { mostrarModalEgresar.value = true; };
const cerrarModalEgresar = () => { mostrarModalEgresar.value = false; };
const egresarPaciente = async () => { cerrarModalEgresar(); };
const fetchHistorialMovimientos = async () => { };
const validarFechaPeriodo = async () => ({ valido: true });
const validarCierreMesAnterior = async () => ({ valido: true });

watch(() => props.registroEdicion, (registro) => {
    if (registro) cargarRegistroEdicion(registro);
}, { immediate: true });

watch(deseaRegistrarCambioAcceso, (v) => {
    if (v !== 'si') limpiarCamposNuevoAcceso();
    else if (props.desdeFormularioInfeccion) aplicarMotivoDesdeInfeccion();
});

onMounted(() => {
    fetchPaciente();
    fetchPeriodo();
    fetchClinicas();
    aplicarMotivoDesdeInfeccion();
    if (esEdicionDirecta.value) {
        if (props.registroEdicion) cargarRegistroEdicion(props.registroEdicion);
    } else {
        fetchUnidadesActualesPaciente().then(() => {
            aplicarMotivoDesdeInfeccion();
            if (props.registroEdicion) cargarRegistroEdicion(props.registroEdicion);
        });
        fetchHistorialMovimientos();
    }
});
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
}

.animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f8fafc;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}
</style>