<template>
    <div class="p-6 space-y-6">
        <!-- Encabezado -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Gestión de Movimientos de Pacientes</h1>
                <p class="text-sm text-gray-600 mt-1">Registre ingresos, reingresos y egresos de pacientes</p>
            </div>
            <div class="flex gap-2">
                <button
                    type="button"
                    class="bg-sky-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-600 transition flex items-center gap-2"
                    @click="abrirModalConsultaDocumento"
                >
                    <span>➕</span>
                    <span>Consultar Paciente</span>
                </button>
                <button @click="abrirModalEgresar" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2">
                    <span>➖</span>
                    <span>Egresar Paciente</span>
                </button>
            </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white p-4 rounded-lg shadow border">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Paciente (DNI o Nombre)</label>
                    <input 
                        v-model="filtros.busqueda" 
                        type="text" 
                        placeholder="DNI o nombre..." 
                        class="w-full border rounded p-2 text-sm"
                        @input="filtrarMovimientos"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimiento</label>
                    <select v-model="filtros.tipo" class="w-full border rounded p-2 text-sm" @change="filtrarMovimientos">
                        <option value="">Todos</option>
                        <option value="INGRESO">Ingresos</option>
                        <option value="EGRESO">Egresos</option>
                        <option value="CAMBIO_MODALIDAD">Cambio de modalidad</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Tabla de Movimientos -->
        <div class="bg-white rounded-lg shadow border overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Paciente
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                DNI
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo Movimiento
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Condición
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo Egreso
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Periodo
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Clínica
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Modalidad / detalle
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="movimientosFiltrados.length === 0">
                            <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                                No hay movimientos registrados
                            </td>
                        </tr>
                        <tr v-for="(movimiento, index) in movimientosPaginados" :key="index" class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm text-gray-900">
                                {{ movimiento.fecha }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-900 font-medium">
                                {{ movimiento.paciente_nombre }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600">
                                {{ movimiento.paciente_dni }}
                            </td>
                            <td class="px-4 py-3 text-sm">
                                <span :class="[
                                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                    movimiento.tipo === 'INGRESO' ? 'bg-green-100 text-green-800' :
                                    movimiento.tipo === 'EGRESO' ? 'bg-red-100 text-red-800' :
                                    movimiento.tipo === 'CAMBIO_MODALIDAD' ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-blue-100 text-blue-800'
                                ]">
                                    {{ movimiento.tipo === 'CAMBIO_MODALIDAD' ? 'CAMBIO MOD.' : movimiento.tipo }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-900">
                                <span :class="[
                                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                    movimiento.condicion === 'NUEVO' ? 'bg-purple-100 text-purple-800' : 
                                    movimiento.condicion === 'REINGRESO' ? 'bg-yellow-100 text-yellow-800' : 
                                    movimiento.condicion === 'CONTINUADOR' ? 'bg-blue-100 text-blue-800' :
                                    movimiento.condicion === 'EGRESADO' ? 'bg-gray-100 text-gray-800' :
                                    movimiento.condicion === 'CAMBIO_MODALIDAD' ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-gray-100 text-gray-600'
                                ]">
                                    {{ movimiento.condicion }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600">
                                {{ movimiento.tipo_egreso || '-' }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600">
                                {{ movimiento.periodo }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600">
                                {{ movimiento.clinica || '-' }}
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600 max-w-[220px] truncate" :title="movimiento.detalle_modalidad || ''">
                                {{ movimiento.detalle_modalidad || movimiento.modalidad || '-' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Paginación -->
            <div class="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    Mostrando {{ ((paginaActual - 1) * itemsPorPagina) + 1 }} a 
                    {{ Math.min(paginaActual * itemsPorPagina, movimientosFiltrados.length) }} de 
                    {{ movimientosFiltrados.length }} movimientos
                </div>
                <div class="flex gap-2">
                    <button 
                        @click="paginaActual--" 
                        :disabled="paginaActual === 1"
                        class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Anterior
                    </button>
                    <span class="px-3 py-1 text-sm">
                        Página {{ paginaActual }} de {{ totalPaginas }}
                    </span>
                    <button 
                        @click="paginaActual++" 
                        :disabled="paginaActual >= totalPaginas"
                        class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: consultar documento (mismo flujo que Lista de pacientes) -->
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

                    <div v-else-if="pacienteConsultaResultado" class="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-sm">
                        <p class="text-xs font-bold uppercase text-emerald-800 mb-2">Paciente encontrado</p>
                        <p class="text-xs text-emerald-900/90 mb-3">
                            Tiene una atención activa con clínica (IPRESS) asignada. Si debe ingresar en otra unidad, use el flujo habitual desde su equipo.
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

                    <div
                        v-else-if="busquedaDocumentoEjecutada && !consultandoPaciente && !errorConsultaDoc"
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

        <!-- Modal: formulario completo de registro (tras no encontrado) -->
        <div v-if="mostrarModalNuevo" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto p-4">
                <FormularioPaciente
                    :periodo-inicial="periodoSeleccionado"
                    :id-periodo-ipress-inicial="idPeriodoIpress"
                    :id-clinica-inicial="idClinicaSeleccionada"
                    :nombre-clinica-inicial="clinicaSeleccionada"
                    :mostrar-tabla-edicion="false"
                    :numero-documento-inicial="documentoPrefillRegistro"
                    @cancelar="onCerrarFormularioPacienteMovimientos"
                />
            </div>
        </div>

        <!-- Modal para Captar Paciente (ingreso / reingreso en periodo) -->
        <div v-if="mostrarModalCaptar" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-[700px] max-h-[90vh] overflow-y-auto relative">
                <button class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl" @click="cerrarModalCaptar">&times;</button>
                <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <span class="text-2xl">➕</span>
                    <span>Captar Paciente</span>
                </h3>
                
                <div class="space-y-4">
                    <!-- Selección de Paciente -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Paciente*</label>
                        <el-autocomplete 
                            v-model="formCaptar.pacienteBusqueda" 
                            :fetch-suggestions="querySearchPacientes" 
                            clearable
                            placeholder="Buscar por DNI o nombre..." 
                            @select="handleSelectPaciente" 
                            :value-key="'paciente'" 
                            class="w-full"
                        >
                            <template #default="{ item }">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="font-medium">{{ item.paciente }}</div>
                                        <div class="text-xs text-gray-500">DNI: {{ item.documento }}</div>
                                    </div>
                                    <div class="text-xs text-gray-400">{{ item.estado }}</div>
                                </div>
                            </template>
                        </el-autocomplete>
                    </div>

                    <!-- Información del Paciente Seleccionado -->
                    <div v-if="pacienteSeleccionado" class="bg-blue-50 p-4 rounded border border-blue-200">
                        <h4 class="font-semibold text-sm text-blue-900 mb-2">Paciente Seleccionado</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Nombre:</strong> {{ pacienteSeleccionado.paciente }}</div>
                            <div><strong>DNI:</strong> {{ pacienteSeleccionado.documento }}</div>
                            <div><strong>Modalidad:</strong> {{ etiquetaModalidad(pacienteSeleccionado.id_modalidad) }}</div>
                        </div>
                    </div>

                    <!-- Condición del Paciente -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Condición del Paciente en la Unidad</label>
                        <div class="w-full border rounded p-3 bg-gray-50">
                            <div class="font-semibold text-gray-800">{{ condicionAutomatica }}</div>
                            <p class="text-xs text-gray-600 mt-1">{{ mensajeCondicion }}</p>
                        </div>
                    </div>

                    <!-- Egreso Previo (si es REINGRESO) -->
                    <div v-if="condicionAutomatica === 'REINGRESO'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Registro de Egreso Previo</label>
                        <div class="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <div v-if="ultimoEgreso" class="text-sm">
                                <p><strong>Tipo de Egreso:</strong> {{ ultimoEgreso.tipo_egreso }}</p>
                                <p><strong>Fecha:</strong> {{ ultimoEgreso.fecha }}</p>
                            </div>
                            <div v-else class="text-red-500 text-sm">
                                ⚠️ No se encontró un egreso previo
                            </div>
                        </div>
                    </div>

                    <!-- Clínica y Periodo (desde el selector global del NavBar) -->
                    <div class="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-600">
                        <strong>Clínica y periodo</strong> se toman del selector superior (estado global del sistema).
                        <template v-if="nombreClinicaGlobal || nombrePeriodoGlobal">
                            <span v-if="nombreClinicaGlobal" class="block mt-1">Clínica: {{ nombreClinicaGlobal }}</span>
                            <span v-if="nombrePeriodoGlobal" class="block">Periodo: {{ nombrePeriodoGlobal }}</span>
                        </template>
                    </div>

                    <!-- Fecha de Ingreso/Reingreso -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso/Reingreso*</label>
                        <input
                            v-model="formCaptar.fecha"
                            type="date"
                            class="w-full border rounded p-2 text-sm"
                            :min="rangoFechaCaptura.min"
                            :max="rangoFechaCaptura.max"
                        />
                        <p class="text-xs text-gray-500 mt-1">
                            Debe estar en el mes del periodo seleccionado en la barra superior (incluido el día 1).
                            <span v-if="rangoFechaCaptura.placeholder" class="block text-amber-700 mt-0.5">{{ rangoFechaCaptura.placeholder }}</span>
                        </p>
                    </div>

                    <!-- Observaciones -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                        <textarea v-model="formCaptar.observaciones" class="w-full border rounded p-2 text-sm" rows="3" 
                            placeholder="Observaciones adicionales..."></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button @click="cerrarModalCaptar" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                        Cancelar
                    </button>
                    <button @click="captarPaciente" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Captar Paciente
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal para Egresar Paciente -->
        <div v-if="mostrarModalEgresar" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-6 w-[700px] max-h-[90vh] overflow-y-auto relative">
                <button class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl" @click="cerrarModalEgresar">&times;</button>
                <h3 class="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <span class="text-2xl">➖</span>
                    <span>Egresar Paciente</span>
                </h3>
                
                <div class="space-y-4">
                    <!-- Selección de Paciente -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Paciente*</label>
                        <el-autocomplete 
                            v-model="formEgresar.pacienteBusqueda" 
                            :fetch-suggestions="querySearchPacientesEgresar" 
                            clearable
                            placeholder="Buscar por DNI o nombre..." 
                            @select="handleSelectPacienteEgresar" 
                            :value-key="'paciente'" 
                            class="w-full"
                        >
                            <template #default="{ item }">
                                <div class="flex justify-between items-center gap-2">
                                    <div class="min-w-0">
                                        <div class="font-medium truncate">{{ item.paciente }}</div>
                                        <div class="text-xs text-gray-500">DNI: {{ item.documento }}</div>
                                        <div v-if="item.nombre_clinica" class="text-xs text-gray-400 truncate">{{ item.nombre_clinica }}</div>
                                    </div>
                                    <div class="text-xs text-gray-400 shrink-0">{{ item.estado }}</div>
                                </div>
                            </template>
                        </el-autocomplete>
                        <p v-if="debeLimitarClinicasAlUsuario() && !pacientesEgresar.length" class="text-xs text-amber-600 mt-1">
                            No hay pacientes activos en sus clínicas asignadas para el periodo seleccionado.
                        </p>
                    </div>

                    <!-- Información del Paciente Seleccionado -->
                    <div v-if="pacienteSeleccionadoEgresar" class="bg-red-50 p-4 rounded border border-red-200">
                        <h4 class="font-semibold text-sm text-red-900 mb-2">Paciente Seleccionado</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Nombre:</strong> {{ pacienteSeleccionadoEgresar.paciente }}</div>
                            <div><strong>DNI:</strong> {{ pacienteSeleccionadoEgresar.documento }}</div>
                            <div><strong>Estado:</strong> {{ pacienteSeleccionadoEgresar.estado }}</div>
                            <div><strong>Modalidad:</strong> {{ etiquetaModalidad(pacienteSeleccionadoEgresar.id_modalidad) }}</div>
                            <div v-if="pacienteSeleccionadoEgresar.nombre_clinica" class="col-span-2">
                                <strong>Clínica:</strong> {{ pacienteSeleccionadoEgresar.nombre_clinica }}
                            </div>
                        </div>
                    </div>

                    <!-- Clínica -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Clínica</label>
                        <div class="w-full border border-gray-200 rounded p-2.5 text-sm bg-gray-50 text-gray-700">
                            {{ nombreClinicaEgresar || (debeLimitarClinicasAlUsuario() ? '— Se definirá al seleccionar el paciente —' : '— Seleccione clínica en la barra superior —') }}
                        </div>
                    </div>

                    <!-- Periodo (solo lectura desde estado global) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
                        <div class="w-full border border-gray-200 rounded p-2.5 text-sm bg-gray-50 text-gray-700">
                            {{ nombrePeriodoGlobal || '— Seleccione periodo en la barra superior —' }}
                        </div>
                    </div>

                    <!-- Fecha de Egreso (solo fechas dentro del periodo seleccionado) -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Egreso*</label>
                        <input
                            v-model="formEgresar.fecha"
                            type="date"
                            class="w-full border rounded p-2 text-sm"
                            :min="rangoFechaEgreso.min"
                            :max="rangoFechaEgreso.max"
                            :placeholder="rangoFechaEgreso.placeholder"
                        />
                        <p v-if="rangoFechaEgreso.placeholder" class="text-xs text-amber-600 mt-1">{{ rangoFechaEgreso.placeholder }}</p>
                    </div>

                    <!-- Tipo de Egreso -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Egreso*</label>
                        <select v-model="formEgresar.tipo_egreso" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione una opción</option>
                            <option value="Hospitalización">Hospitalización</option>
                            <option value="Fallecimiento">Fallecimiento</option>
                            <option value="Trasplante">Trasplante</option>
                            <option value="Cambio de Unidad">Cambio de Unidad</option>
                            <option value="Cambio de Modalidad">Cambio de Modalidad</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>

                    <!-- Motivo Específico (si es "Otros") -->
                    <div v-if="formEgresar.tipo_egreso === 'Otros'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Especificar Motivo*</label>
                        <input v-model="formEgresar.motivo_especifico" type="text" class="w-full border rounded p-2 text-sm" 
                            placeholder="Especifique el motivo del egreso" />
                    </div>

                    <!-- Observaciones -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                        <textarea v-model="formEgresar.observaciones" class="w-full border rounded p-2 text-sm" rows="3" 
                            placeholder="Observaciones adicionales..."></textarea>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button @click="cerrarModalEgresar" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                        Cancelar
                    </button>
                    <button @click="egresarPaciente" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Egresar Paciente
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal: Hospitalización → Morbilidad hospitalaria -->
        <div
            v-if="mostrarModalMorbilidadHospitalaria"
            class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg shadow-xl p-6 w-[520px] max-h-[90vh] overflow-y-auto relative">
                <button class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl" @click="cerrarModalMorbilidadHospitalaria">&times;</button>
                <h3 class="text-xl font-bold mb-3 text-gray-800 flex items-center gap-2">
                    <span class="text-2xl">🏥</span>
                    <span>Egreso por hospitalización</span>
                </h3>
                <p class="text-sm text-gray-700">
                    ¿Ya registró la <strong>Morbilidad Hospitalaria</strong> del paciente para el periodo actual?
                </p>

                <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button
                        type="button"
                        class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        @click="cerrarModalMorbilidadHospitalaria"
                    >
                        Sí
                    </button>
                    <button
                        type="button"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        @click="irAMorbilidadHospitalaria"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, inject, watch } from 'vue';
import { getAllIpress, postAllIpress, patchAllIpress } from "@/services/ipress/Ipress.service";
import { resolverIdPeriodoIpress } from '@/utils/estadisticasRegistrosFormularios';
import { debeLimitarClinicasAlUsuario } from '@/utils/perfil';
import { useAuthStore } from '@/store/auth';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import FormularioPaciente from '../inicio/FormularioPaciente.vue';

// Estados globales del sistema (NavBar: periodo, clínica, modalidad)
const periodoGlobal = inject('periodoGlobal', ref(null));
const clinicaGlobal = inject('clinicaGlobal', ref(null));
const modalidadGlobal = inject('modalidadGlobal', ref(null));
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const nombrePeriodoGlobal = computed(() => {
  const id = periodoGlobal.value;
  if (id == null) return '';
  const p = (Array.isArray(periodos.value) ? periodos.value : []).find(per => per.id_periodo === id);
  return p ? p.periodo : '';
});
const nombreClinicaGlobal = computed(() => {
  const id = clinicaGlobal.value;
  if (id == null) return '';
  const list = Array.isArray(ipress.value) ? ipress.value : [];
  const c = list.find(i => i.id_ipress === id);
  return c ? (c.nombre_corto || c.ipress || '') : '';
});

const nombreClinicaEgresar = computed(() => {
  if (pacienteSeleccionadoEgresar.value?.nombre_clinica) {
    return pacienteSeleccionadoEgresar.value.nombre_clinica;
  }
  if (formEgresar.clinicaNombre) return formEgresar.clinicaNombre;
  return nombreClinicaGlobal.value;
});

// Rango de fechas del periodo global (día 1 … último día del mes; mismo criterio para egreso y captación)
const rangoFechaEgreso = computed(() => {
  const periodoId = periodoGlobal.value;
  if (periodoId == null || periodoId === '') {
    return { min: undefined, max: undefined, placeholder: 'Seleccione periodo en la barra superior para habilitar fechas.' };
  }
  const periodo = (Array.isArray(periodos.value) ? periodos.value : []).find(
    (p) => String(p.id_periodo) === String(periodoId)
  );
  if (!periodo || !periodo.periodo) {
    return { min: undefined, max: undefined, placeholder: '' };
  }
  const parts = periodo.periodo.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month)) return { min: undefined, max: undefined, placeholder: '' };
  const min = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const max = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return { min, max, placeholder: '' };
});

const rangoFechaCaptura = computed(() => rangoFechaEgreso.value);

// Estados
const movimientos = ref([]);
const periodos = ref([]);
const ipress = ref([]);
const pacientes = ref([]);
const pacientesEgresar = ref([]);
const mostrarModalCaptar = ref(false);
const mostrarModalEgresar = ref(false);

/** Misma consulta por documento + formulario que Lista de pacientes */
const mostrarModalConsultaDocumento = ref(false);
const mostrarModalNuevo = ref(false);
const documentoPrefillRegistro = ref('');
const docConsulta = ref('');
const consultandoPaciente = ref(false);
const errorConsultaDoc = ref('');
const pacienteConsultaResultado = ref(null);
const busquedaDocumentoEjecutada = ref(false);
const verificandoClinicaPaciente = ref(false);
const idPeriodoIpress = ref(null);
const idClinicaSeleccionada = ref(null);
const clinicaSeleccionada = ref('');
const periodoSeleccionado = ref(null);
const pacienteSeleccionado = ref(null);
const pacienteSeleccionadoEgresar = ref(null);
const condicionAutomatica = ref('');
const mensajeCondicion = ref('');
const ultimoEgreso = ref(null);
const paginaActual = ref(1);
const itemsPorPagina = 10;
const mostrarModalMorbilidadHospitalaria = ref(false);

// Filtros
const filtros = reactive({
    periodo: '',
    clinica: null,
    clinicaNombre: '',
    busqueda: '',
    tipo: ''
});

// Formularios
const formCaptar = reactive({
    paciente: null,
    pacienteBusqueda: '',
    clinica: null,
    clinicaNombre: '',
    periodo: '',
    fecha: '',
    condicion: '',
    observaciones: ''
});

const formEgresar = reactive({
    paciente: null,
    pacienteBusqueda: '',
    clinica: null,
    clinicaNombre: '',
    periodo: '',
    fecha: '',
    tipo_egreso: '',
    motivo_especifico: '',
    observaciones: ''
});

// Computed
const movimientosFiltrados = computed(() => {
    let resultado = [...movimientos.value];

    if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        resultado = resultado.filter(m => 
            m.paciente_nombre?.toLowerCase().includes(busqueda) ||
            m.paciente_dni?.includes(busqueda)
        );
    }

    if (filtros.tipo) {
        resultado = resultado.filter(m => m.tipo === filtros.tipo);
    }

    return resultado;
});

const totalPaginas = computed(() => Math.ceil(movimientosFiltrados.value.length / itemsPorPagina));

const movimientosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * itemsPorPagina;
    return movimientosFiltrados.value.slice(inicio, inicio + itemsPorPagina);
});

// Funciones de búsqueda
const querySearchClinica = (queryString, cb) => {
    const results = queryString
        ? ipress.value.filter(r => r.ipress?.toLowerCase().includes(queryString.toLowerCase()))
        : ipress.value;
    cb(results);
};

const querySearchPacientes = (queryString, cb) => {
    const results = queryString
        ? pacientes.value.filter(p => 
            p.paciente?.toLowerCase().includes(queryString.toLowerCase()) ||
            p.documento?.includes(queryString)
          )
        : pacientes.value;
    cb(results);
};

const querySearchPacientesEgresar = (queryString, cb) => {
    const base = pacientesEgresar.value;
    const results = queryString
        ? base.filter((p) =>
            p.paciente?.toLowerCase().includes(queryString.toLowerCase()) ||
            p.documento?.includes(queryString)
          )
        : base;
    cb(results);
};

const filaListadoAPacienteEgresar = (row, idIpress) => {
    const p = row?.datosPaciente || {};
    const list = Array.isArray(ipress.value) ? ipress.value : [];
    const clinica = list.find((i) => String(i.id_ipress) === String(idIpress));
    return {
        id_paciente: p.id_paciente ?? row.id_paciente,
        paciente: p.paciente ?? '',
        documento: p.documento ?? '',
        estado: p.estado ?? '',
        id_modalidad: row.modalidad ?? p.id_modalidad,
        id_ipress: idIpress,
        nombre_clinica: clinica?.nombre_corto || clinica?.ipress || '',
        id_paciente_atencion: row.id_paciente_atencion,
    };
};

const obtenerIdsIpressAsignados = async () => {
    const idUsuario = authStore.user?.id_usuario;
    if (!idUsuario) return [];
    try {
        const asignaciones = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${idUsuario}`);
        const listaAsig = Array.isArray(asignaciones) ? asignaciones : (asignaciones?.results || []);
        return [...new Set(listaAsig.map((a) => a.id_ipress).filter((id) => id != null && id !== ''))];
    } catch (e) {
        console.error('Error al obtener clínicas asignadas:', e);
        return [];
    }
};

/** Pacientes con atención ACTIVA en la IPRESS/periodo (aptos para egreso). */
const cargarPacientesActivosDeIpress = async (idIpress, periodoId, idModalidad = null) => {
    const paramsListado = new URLSearchParams({
        id_ipress: String(idIpress),
        id_periodo: String(periodoId),
    });
    if (idModalidad != null && idModalidad !== '') {
        paramsListado.set('id_modalidad', String(idModalidad));
    }

    const paramsAtencion = new URLSearchParams({
        id_ipress: String(idIpress),
        id_periodo: String(periodoId),
    });
    if (idModalidad != null && idModalidad !== '') {
        paramsAtencion.set('id_modalidad', String(idModalidad));
    }

    const [respuesta, atencionesRes] = await Promise.all([
        getAllIpress(`/listado_pacientes_dialisis_por_ipress_periodo/?${paramsListado.toString()}`),
        getAllIpress(`/pacienteAtencion/?${paramsAtencion.toString()}`),
    ]);

    const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    const atenciones = Array.isArray(atencionesRes) ? atencionesRes : (atencionesRes?.results || []);
    const activosPorPaciente = new Map();

    for (const a of atenciones) {
        if (String(a.estado || '').toUpperCase() !== 'ACTIVO') continue;
        const pid = a.id_paciente ?? a.datosPaciente?.id_paciente;
        if (pid != null) activosPorPaciente.set(String(pid), a);
    }

    return lista
        .filter((row) => {
            const pid = row?.datosPaciente?.id_paciente ?? row.id_paciente;
            return pid != null && activosPorPaciente.has(String(pid));
        })
        .map((row) => {
            const item = filaListadoAPacienteEgresar(row, idIpress);
            const at = activosPorPaciente.get(String(item.id_paciente));
            if (at) {
                item.estado_atencion = at.estado;
                item.id_paciente_atencion = at.id_paciente_atencion;
                item.id_modalidad = item.id_modalidad ?? at.id_modalidad ?? at.datosModalidad?.id_modalidad;
            }
            return item;
        });
};

const fetchPacientesParaEgresar = async () => {
    const periodoId = periodoGlobal.value ?? formEgresar.periodo;
    pacientesEgresar.value = [];

    if (periodoId == null || periodoId === '') {
        return;
    }

    if (debeLimitarClinicasAlUsuario()) {
        const idsIpress = await obtenerIdsIpressAsignados();
        if (!idsIpress.length) return;

        const acumulado = [];
        const vistos = new Set();

        await Promise.all(
            idsIpress.map(async (idIpress) => {
                try {
                    const items = await cargarPacientesActivosDeIpress(idIpress, periodoId);
                    for (const item of items) {
                        const clave = `${item.id_paciente}-${item.id_ipress}`;
                        if (item.id_paciente != null && !vistos.has(clave)) {
                            vistos.add(clave);
                            acumulado.push(item);
                        }
                    }
                } catch (e) {
                    console.error(`Error listando pacientes IPRESS ${idIpress}:`, e);
                }
            })
        );

        pacientesEgresar.value = acumulado.sort((a, b) =>
            (a.paciente || '').localeCompare(b.paciente || '', 'es')
        );
        return;
    }

    const idIpress = clinicaGlobal.value;
    if (idIpress != null && idIpress !== '') {
        try {
            pacientesEgresar.value = await cargarPacientesActivosDeIpress(
                idIpress,
                periodoId,
                modalidadGlobal.value
            );
        } catch (e) {
            console.error('Error al obtener pacientes para egreso:', e);
            pacientesEgresar.value = [];
        }
        return;
    }

    await fetchPacientes();
    pacientesEgresar.value = pacientes.value.filter(
        (p) => String(p.estado || '').toUpperCase() !== 'EGRESADO'
    );
};

const handleSelectClinica = (item) => {
    filtros.clinica = item.id_ipress;
    fetchMovimientos();
};

const handleSelectClinicaEgresar = (item) => {
    formEgresar.clinica = item.id_ipress;
};

const handleSelectPaciente = async (item) => {
    pacienteSeleccionado.value = item;
    formCaptar.paciente = item.id_paciente;
    formCaptar.pacienteBusqueda = `${item.paciente || ''}`.trim();
    await determinarCondicionPaciente(item.id_paciente);
};

const handleSelectPacienteEgresar = (item) => {
    pacienteSeleccionadoEgresar.value = item;
    formEgresar.paciente = item.id_paciente;
    if (item.id_ipress != null && item.id_ipress !== '') {
        formEgresar.clinica = item.id_ipress;
        formEgresar.clinicaNombre = item.nombre_clinica || '';
    }
};

const filtrarMovimientos = () => {
    paginaActual.value = 1;
};

const syncPeriodoIpressParaFormulario = async () => {
    idClinicaSeleccionada.value = clinicaGlobal.value ?? null;
    periodoSeleccionado.value = periodoGlobal.value ?? null;
    const clinicaActual = (Array.isArray(ipress.value) ? ipress.value : []).find(
        (item) => String(item.id_ipress) === String(idClinicaSeleccionada.value)
    );
    clinicaSeleccionada.value = clinicaActual?.nombre_corto || clinicaActual?.ipress || '';
    idPeriodoIpress.value = null;
    if (periodoSeleccionado.value != null && idClinicaSeleccionada.value != null) {
        try {
            const respuesta = await postAllIpress('/consulta_periodo_ipress/', {
                id_periodo: Number(periodoSeleccionado.value),
                id_ipress: Number(idClinicaSeleccionada.value),
                id_estado: 1,
            });
            const lista = Array.isArray(respuesta) ? respuesta : [];
            idPeriodoIpress.value = lista.length ? lista[0].id_periodo_ipress : null;
        } catch {
            idPeriodoIpress.value = null;
        }
    }
};

const cerrarModalNuevo = () => {
    mostrarModalNuevo.value = false;
    documentoPrefillRegistro.value = '';
};

const cerrarModalConsultaDocumento = () => {
    mostrarModalConsultaDocumento.value = false;
    docConsulta.value = '';
    errorConsultaDoc.value = '';
    pacienteConsultaResultado.value = null;
    busquedaDocumentoEjecutada.value = false;
    verificandoClinicaPaciente.value = false;
};

const abrirModalConsultaDocumento = () => {
    docConsulta.value = '';
    errorConsultaDoc.value = '';
    pacienteConsultaResultado.value = null;
    busquedaDocumentoEjecutada.value = false;
    verificandoClinicaPaciente.value = false;
    mostrarModalConsultaDocumento.value = true;
};

/** Atención ACTIVA con IPRESS asignada = “tiene clínica actualmente”. */
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

const consultarPacientePorDocumento = async () => {
    errorConsultaDoc.value = '';
    pacienteConsultaResultado.value = null;
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
            await abrirCaptarPacienteDesdeConsulta(encontrado);
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

const abrirFormularioRegistroNuevo = async () => {
    documentoPrefillRegistro.value = docConsulta.value.trim();
    mostrarModalConsultaDocumento.value = false;
    docConsulta.value = '';
    errorConsultaDoc.value = '';
    pacienteConsultaResultado.value = null;
    busquedaDocumentoEjecutada.value = false;
    await syncPeriodoIpressParaFormulario();
    mostrarModalNuevo.value = true;
};

const onCerrarFormularioPacienteMovimientos = () => {
    cerrarModalNuevo();
    fetchMovimientos();
    fetchPacientes();
};

// Funciones de Modal Captar (ingreso en periodo; también deep-link captarDni)
const abrirModalCaptarFormulario = async (precargaPaciente = null) => {
    await fetchPacientes();
    formCaptar.paciente = null;
    formCaptar.pacienteBusqueda = '';
    formCaptar.fecha = '';
    formCaptar.observaciones = '';
    pacienteSeleccionado.value = null;
    condicionAutomatica.value = '';
    mensajeCondicion.value = '';
    ultimoEgreso.value = null;
    mostrarModalCaptar.value = true;

    if (precargaPaciente && precargaPaciente.id_paciente != null) {
        const id = precargaPaciente.id_paciente;
        let item = pacientes.value.find(
            (x) => String(x.id_paciente) === String(id)
        );
        if (!item) {
            item = { ...precargaPaciente };
        }
        await handleSelectPaciente(item);
        const r = rangoFechaCaptura.value;
        if (r.min) {
            formCaptar.fecha = r.min;
        }
    }
};

/** Tras consulta por documento: sin clínica activa → abrir captación con paciente y fecha = día 1 del periodo. */
const abrirCaptarPacienteDesdeConsulta = async (pacienteRow) => {
    cerrarModalConsultaDocumento();
    await abrirModalCaptarFormulario(pacienteRow);
};

const abrirCaptacionConDni = async (dni) => {
    if (!dni) return;
    await abrirModalCaptarFormulario();
    formCaptar.pacienteBusqueda = String(dni);
    const paciente = pacientes.value.find((item) => String(item.documento || '') === String(dni));
    if (paciente) {
        await handleSelectPaciente(paciente);
        const r = rangoFechaCaptura.value;
        if (r.min) {
            formCaptar.fecha = r.min;
        }
    }
};

const procesarCaptacionDesdeRuta = async () => {
    const dni = route.query?.captarDni;
    if (!dni) return;
    await abrirCaptacionConDni(dni);
    const query = { ...route.query };
    delete query.captarDni;
    router.replace({ name: 'Movimientos', query });
};

const cerrarModalCaptar = () => {
    mostrarModalCaptar.value = false;
};

const resolverAtencionParaCaptacion = (listaAtenciones) => {
    const lista = Array.isArray(listaAtenciones) ? listaAtenciones : [];
    const activa = lista.find((a) => String(a.estado || '').toUpperCase() === 'ACTIVO');
    const egresadas = lista
        .filter((a) => String(a.estado || '').toUpperCase() === 'EGRESADO')
        .sort((a, b) => (Number(b.id_paciente_atencion) || 0) - (Number(a.id_paciente_atencion) || 0));
    const pendiente = lista.find((a) => a.id_ipress == null);
    return {
        activa: activa || null,
        atencionEgresada: egresadas[0] || null,
        atencionPendiente: pendiente || null,
    };
};

const determinarCondicionPaciente = async (pacienteId) => {
    ultimoEgreso.value = null;
    try {
        const idPeriodo = periodoGlobal.value;
        const idIpress = clinicaGlobal.value;
        const idModalidad = modalidadGlobal.value;

        if (idPeriodo != null && idModalidad != null) {
            const paramsAt = new URLSearchParams({
                id_paciente: String(pacienteId),
                id_periodo: String(idPeriodo),
                id_modalidad: String(idModalidad),
            });
            if (idIpress != null && idIpress !== '') {
                paramsAt.set('id_ipress', String(idIpress));
            }
            const atRes = await getAllIpress(`/pacienteAtencion/?${paramsAt}`);
            const atList = Array.isArray(atRes) ? atRes : (atRes?.results || []);
            const { activa, atencionEgresada } = resolverAtencionParaCaptacion(atList);

            if (activa) {
                condicionAutomatica.value = 'YA_ACTIVO';
                mensajeCondicion.value = 'El paciente ya tiene atención activa en este periodo, clínica y modalidad.';
                formCaptar.condicion = activa.tipo_atencion || 'CONTINUADOR';
                return;
            }

            if (atencionEgresada) {
                condicionAutomatica.value = 'REINGRESO';
                mensajeCondicion.value = 'El paciente fue egresado en este periodo. El ingreso se registrará como REINGRESO.';
                formCaptar.condicion = 'REINGRESO';
                ultimoEgreso.value = {
                    tipo_egreso: extraerTipoEgresoDesdeObs(atencionEgresada.observaciones) || 'No especificado',
                    fecha: atencionEgresada.fecha_fin
                        || atencionEgresada.fecha_atencion
                        || (atencionEgresada.created_at ? new Date(atencionEgresada.created_at).toLocaleDateString() : '—'),
                };
                return;
            }
        }

        const respuesta = await getAllIpress(`/PacienteRegistro/?paciente=${pacienteId}`);

        if (!respuesta || respuesta.length === 0) {
            condicionAutomatica.value = 'NUEVO';
            mensajeCondicion.value = 'Este es el primer registro del paciente en el sistema.';
            formCaptar.condicion = 'NUEVO';
        } else {
            const egresos = respuesta.filter((r) => r.condicion === 'EGRESADO').sort((a, b) =>
                new Date(b.fecha_created) - new Date(a.fecha_created)
            );

            if (egresos.length > 0) {
                condicionAutomatica.value = 'REINGRESO';
                mensajeCondicion.value = 'El paciente tiene un egreso previo registrado.';
                formCaptar.condicion = 'REINGRESO';
                ultimoEgreso.value = {
                    tipo_egreso: egresos[0].tipo_egreso || 'No especificado',
                    fecha: new Date(egresos[0].fecha_created).toLocaleDateString(),
                };
            } else {
                condicionAutomatica.value = 'CONTINUADOR';
                mensajeCondicion.value = 'El paciente no tiene egreso registrado en la unidad.';
                formCaptar.condicion = 'CONTINUADOR';
            }
        }
    } catch (error) {
        console.error('Error al determinar condición del paciente:', error);
        condicionAutomatica.value = 'NUEVO';
        mensajeCondicion.value = 'Error al verificar condición. Se asignará como NUEVO.';
        formCaptar.condicion = 'NUEVO';
    }
};

const captarPaciente = async () => {
    const idPeriodo = periodoGlobal.value;
    const idIpress = clinicaGlobal.value;
    const idModalidad = modalidadGlobal.value;

    if (!formCaptar.paciente || !formCaptar.fecha) {
        ElMessage({
            message: 'Seleccione paciente y fecha de ingreso/reingreso',
            type: 'warning',
            plain: true,
        });
        return;
    }
    if (idPeriodo == null || idPeriodo === '') {
        ElMessage({
            message: 'Seleccione un periodo en el selector superior (NavBar)',
            type: 'warning',
            plain: true,
        });
        return;
    }
    if (idIpress == null || idIpress === '') {
        ElMessage({
            message: 'Seleccione una clínica en el selector superior (NavBar)',
            type: 'warning',
            plain: true,
        });
        return;
    }
    if (idModalidad == null || idModalidad === '') {
        ElMessage({
            message: 'Seleccione una modalidad en el selector superior (NavBar)',
            type: 'warning',
            plain: true,
        });
        return;
    }

    const validacionPeriodo = validarFechaPeriodo(formCaptar.fecha, idPeriodo);
    if (!validacionPeriodo.valido) {
        ElMessage({
            message: validacionPeriodo.mensaje,
            type: 'error',
            plain: true,
        });
        return;
    }

    if (condicionAutomatica.value === 'YA_ACTIVO') {
        ElMessage({
            message: 'El paciente ya tiene atención activa en este periodo. Use egreso si corresponde.',
            type: 'warning',
            plain: true,
        });
        return;
    }

    if (condicionAutomatica.value === 'REINGRESO' && !ultimoEgreso.value) {
        ElMessage({
            message: 'No se puede registrar un reingreso sin un egreso previo',
            type: 'error',
            plain: true,
        });
        return;
    }

    const validacionCierre = await validarCierreMesAnterior(formCaptar.paciente, idPeriodo);
    if (validacionCierre.mensaje) {
        ElMessage({
            message: validacionCierre.mensaje,
            type: validacionCierre.valido ? 'info' : 'warning',
            plain: true,
            duration: 5000
        });
    }

    try {
        const modalidadAnterior = await obtenerModalidadActualPaciente(formCaptar.paciente);
        if (
            modalidadAnterior != null
            && idModalidad != null
            && String(modalidadAnterior) !== String(idModalidad)
        ) {
            await registrarCambioModalidadHistorial({
                pacienteId: formCaptar.paciente,
                modalidadAnteriorId: modalidadAnterior,
                modalidadNuevaId: idModalidad,
                fecha: formCaptar.fecha,
                periodoId: idPeriodo,
                ipressId: idIpress,
                observacionesExtra: formCaptar.observaciones,
                origen: 'CAPTACION',
            });
        }

        const tipoAtencion = condicionAutomatica.value === 'REINGRESO' ? 'REINGRESO' : (condicionAutomatica.value === 'NUEVO' ? 'NUEVO' : 'CONTINUADOR');
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const paramsAtencion = new URLSearchParams({
            id_paciente: String(formCaptar.paciente),
            id_periodo: String(idPeriodo),
            id_modalidad: String(idModalidad),
            id_ipress: String(idIpress),
        });
        const atencionesExistentes = await getAllIpress(`/pacienteAtencion/?${paramsAtencion}`);
        const listaAtenciones = Array.isArray(atencionesExistentes) ? atencionesExistentes : (atencionesExistentes?.results || []);
        const { activa, atencionEgresada, atencionPendiente } = resolverAtencionParaCaptacion(listaAtenciones);

        if (activa) {
            ElMessage({
                message: 'El paciente ya tiene atención activa en este periodo, clínica y modalidad.',
                type: 'warning',
                plain: true,
            });
            return;
        }

        const payload = {
            id_paciente: formCaptar.paciente,
            id_ipress: idIpress,
            id_periodo: idPeriodo,
            id_modalidad: idModalidad,
            fecha_atencion: formCaptar.fecha,
            tipo_atencion: tipoAtencion,
            fecha_inicio: formCaptar.fecha,
            fecha_fin: '',
            estado: 'ACTIVO',
            observaciones: formCaptar.observaciones || '',
            created_at: now,
        };

        const idReactivar = atencionEgresada?.id_paciente_atencion ?? atencionPendiente?.id_paciente_atencion;
        if (idReactivar) {
            await patchAllIpress(`/pacienteAtencion/${idReactivar}/`, payload);
        } else {
            await postAllIpress('/pacienteAtencion/', payload);
        }

        const estadoPaciente = condicionAutomatica.value === 'NUEVO' ? 'NUEVO' : 'REINGRESO';
        await patchPacienteEstado(formCaptar.paciente, estadoPaciente);
        await actualizarPeriodoIpressPaciente(formCaptar.paciente, idPeriodo, idIpress);

        ElMessage({
            message: tipoAtencion === 'REINGRESO' ? 'Reingreso registrado exitosamente' : 'Paciente captado exitosamente',
            type: 'success',
            plain: true,
        });

        cerrarModalCaptar();
        await fetchMovimientos();
    } catch (error) {
        console.error('Error al captar paciente:', error);
        ElMessage({
            message: error?.error || 'Error al captar paciente. Intente nuevamente.',
            type: 'error',
            plain: true,
        });
    }
};

// Funciones de Modal Egresar (clínica y periodo se toman del estado global)
const abrirModalEgresar = async () => {
    if (periodoGlobal.value == null || periodoGlobal.value === '') {
        ElMessage({
            message: 'Seleccione el periodo en la barra superior antes de egresar un paciente.',
            type: 'warning',
            plain: true,
        });
        return;
    }
    await fetchPacientesParaEgresar();
    formEgresar.paciente = null;
    formEgresar.pacienteBusqueda = '';
    formEgresar.clinica = clinicaGlobal.value ?? null;
    formEgresar.clinicaNombre = nombreClinicaGlobal.value;
    formEgresar.periodo = periodoGlobal.value ?? '';
    formEgresar.fecha = '';
    formEgresar.tipo_egreso = '';
    formEgresar.motivo_especifico = '';
    formEgresar.observaciones = '';
    pacienteSeleccionadoEgresar.value = null;
    mostrarModalEgresar.value = true;
};

const cerrarModalEgresar = () => {
    mostrarModalEgresar.value = false;
};

const cerrarModalMorbilidadHospitalaria = () => {
    mostrarModalMorbilidadHospitalaria.value = false;
};

const irAMorbilidadHospitalaria = () => {
    // Abrir en nueva pestaña para no perder la vista de movimientos
    const href = router.resolve({ name: 'MorbilidadHospitalaria' }).href;
    try {
        window.open(href, '_blank');
    } catch (e) {
        // fallback: navegación en la misma pestaña
        router.push({ name: 'MorbilidadHospitalaria' });
    } finally {
        cerrarModalMorbilidadHospitalaria();
    }
};

function isoDesdeValorApi(valor) {
    if (!valor) return null;
    const s = String(valor).trim();
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}\s/.test(s)) return s.slice(0, 10);
    return null;
}

function maxIso(a, b) {
    if (!a) return b || null;
    if (!b) return a || null;
    return a > b ? a : b;
}

async function obtenerUltimaFechaRegistrosPacientePeriodo({ idPaciente, idPacienteAtencion, rango }) {
    const min = rango?.min;
    const max = rango?.max;

    const within = (iso) => {
        if (!iso) return false;
        if (min && iso < min) return false;
        if (max && iso > max) return false;
        return true;
    };

    let ultima = null;

    // Acceso vascular (unidades actuales): usa id_paciente
    try {
        const res = await getAllIpress(`/unidadesActuales/?id_paciente=${idPaciente}`);
        const lista = Array.isArray(res) ? res : (res?.results || []);
        for (const r of lista) {
            const iso = isoDesdeValorApi(r.fecha_creacion_acceso || r.fecha_creacion_acceso_actual);
            if (within(iso)) ultima = maxIso(ultima, iso);
        }
    } catch (e) {
        console.warn('No se pudo obtener unidadesActuales:', e);
    }

    // Eventos infecciosos acceso vascular: usa id_paciente_atencion
    if (idPacienteAtencion) {
        try {
            const res = await getAllIpress(`/eventosAccesosVasculares/?id_paciente_atencion=${idPacienteAtencion}`);
            const lista = Array.isArray(res) ? res : (res?.results || []);
            for (const r of lista) {
                const iso = isoDesdeValorApi(r.fecha_evento);
                if (within(iso)) ultima = maxIso(ultima, iso);
            }
        } catch (e) {
            console.warn('No se pudo obtener eventosAccesosVasculares:', e);
        }

        // Vacunación: usa id_paciente_atencion
        try {
            const res = await getAllIpress(`/vacunaciones/?id_paciente_atencion=${idPacienteAtencion}`);
            const lista = Array.isArray(res) ? res : (res?.results || []);
            const campos = [
                'fecha_vhb',
                'fecha_antiHbc',
                'fecha_vhc',
                'fecha_vih',
                'fecha_titulo_acHbs',
                'fecha_hepatitis_b',
                'fecha_covid',
                'fecha_influenza',
                'fecha_neumococo',
            ];
            for (const r of lista) {
                for (const c of campos) {
                    const iso = isoDesdeValorApi(r[c]);
                    if (within(iso)) ultima = maxIso(ultima, iso);
                }
            }
        } catch (e) {
            console.warn('No se pudo obtener vacunaciones:', e);
        }
    }

    return ultima;
}

const egresarPaciente = async () => {
    if (!formEgresar.paciente || !formEgresar.periodo || !formEgresar.fecha || !formEgresar.tipo_egreso || !formEgresar.clinica) {
        ElMessage({
            message: 'Por favor complete todos los campos obligatorios',
            type: 'warning',
            plain: true,
        });
        return;
    }

    if (formEgresar.tipo_egreso === 'Otros' && !formEgresar.motivo_especifico) {
        ElMessage({
            message: 'Por favor especifique el motivo del egreso',
            type: 'warning',
            plain: true,
        });
        return;
    }

    // Validar que la fecha esté dentro del periodo seleccionado
    const validacionPeriodo = validarFechaPeriodo(formEgresar.fecha, formEgresar.periodo);
    if (!validacionPeriodo.valido) {
        ElMessage({
            message: validacionPeriodo.mensaje,
            type: 'error',
            plain: true,
        });
        return;
    }

    // Validar consistencia con cierre del mes anterior
    const validacionCierre = await validarCierreMesAnterior(formEgresar.paciente, formEgresar.periodo);
    if (validacionCierre.mensaje) {
        ElMessage({
            message: validacionCierre.mensaje,
            type: validacionCierre.valido ? 'info' : 'warning',
            plain: true,
            duration: 5000
        });
    }

    try {
        const tipoEgresoTexto = formEgresar.tipo_egreso === 'Otros' ? formEgresar.motivo_especifico : formEgresar.tipo_egreso;
        const modalidadActual = pacienteSeleccionadoEgresar.value?.id_modalidad
            ?? await obtenerModalidadActualPaciente(formEgresar.paciente);

        if (formEgresar.tipo_egreso === 'Cambio de Modalidad' && modalidadActual != null) {
            await registrarCambioModalidadHistorial({
                pacienteId: formEgresar.paciente,
                modalidadAnteriorId: modalidadActual,
                modalidadNuevaId: null,
                fecha: formEgresar.fecha,
                periodoId: formEgresar.periodo,
                ipressId: formEgresar.clinica,
                observacionesExtra: formEgresar.observaciones || `Egreso: ${tipoEgresoTexto}. Pendiente captación en nueva modalidad.`,
                origen: 'EGRESO_CAMBIO_MODALIDAD',
            });
        }

        const atencionActiva =
            pacienteSeleccionadoEgresar.value?.id_paciente_atencion
                ? { id_paciente_atencion: pacienteSeleccionadoEgresar.value.id_paciente_atencion }
                : await obtenerAtencionActivaParaEgreso({
                    pacienteId: formEgresar.paciente,
                    periodoId: formEgresar.periodo,
                    ipressId: formEgresar.clinica,
                    modalidadId: modalidadActual,
                });

        if (!atencionActiva?.id_paciente_atencion) {
            ElMessage({
                message: 'No se encontró una atención activa del paciente en la clínica y periodo indicados.',
                type: 'error',
                plain: true,
            });
            return;
        }

        // La fecha de egreso debe ser posterior al último registro clínico del periodo (excepto calidad de agua)
        const ultimaFecha = await obtenerUltimaFechaRegistrosPacientePeriodo({
            idPaciente: formEgresar.paciente,
            idPacienteAtencion: atencionActiva.id_paciente_atencion,
            rango: rangoFechaEgreso.value,
        });
        if (ultimaFecha && String(formEgresar.fecha) <= String(ultimaFecha)) {
            ElMessage({
                message: `La Fecha de Egreso debe ser posterior al último registro del paciente en el periodo (${ultimaFecha}).`,
                type: 'error',
                plain: true,
                duration: 6000,
            });
            return;
        }

        const obsEgreso = truncarObservaciones(
            formEgresar.observaciones
                ? `Egreso: ${tipoEgresoTexto}. ${formEgresar.observaciones}`
                : `Egreso: ${tipoEgresoTexto}`
        );

        await patchAllIpress(`/pacienteAtencion/${atencionActiva.id_paciente_atencion}/`, {
            estado: 'EGRESADO',
            tipo_atencion: 'EGRESO',
            fecha_fin: formEgresar.fecha,
            fecha_atencion: formEgresar.fecha,
            observaciones: obsEgreso,
        });

        try {
            await postAllIpress('/PacienteRegistro/', {
                paciente: formEgresar.paciente,
                periodo: formEgresar.periodo,
                ipress: formEgresar.clinica,
                condicion: 'EGRESADO',
                tipo_egreso: tipoEgresoTexto,
                fecha_egreso: formEgresar.fecha,
                observaciones: formEgresar.observaciones,
            });
        } catch (e) {
            console.warn('PacienteRegistro (auditoría):', e);
        }

        try {
            await patchPacienteEstado(formEgresar.paciente, 'EGRESADO');
        } catch (e) {
            console.warn('No se actualizó estado en rd_pacientes:', e);
        }

        ElMessage({
            message: 'Paciente egresado exitosamente',
            type: 'success',
            plain: true,
        });

        cerrarModalEgresar();
        await fetchMovimientos({
            idPeriodo: formEgresar.periodo,
            idIpress: formEgresar.clinica,
            idModalidad: modalidadActual,
        });

        if (formEgresar.tipo_egreso === 'Hospitalización') {
            mostrarModalMorbilidadHospitalaria.value = true;
        }
    } catch (error) {
        console.error('Error al egresar paciente:', error);
        ElMessage({
            message: 'Error al egresar paciente. Intente nuevamente.',
            type: 'error',
            plain: true,
        });
    }
};

// Funciones de carga de datos: listar atenciones según periodo, ipress y modalidad globales
const fetchMovimientos = async (filtrosOverride = null) => {
    try {
        const idPeriodo = filtrosOverride?.idPeriodo ?? periodoGlobal.value;
        const idIpress = filtrosOverride?.idIpress ?? clinicaGlobal.value;
        const idModalidad = filtrosOverride?.idModalidad ?? modalidadGlobal.value;

        const params = new URLSearchParams();
        if (idPeriodo != null && idPeriodo !== '') params.set('id_periodo', idPeriodo);
        if (idIpress != null && idIpress !== '') params.set('id_ipress', idIpress);
        if (idModalidad != null && idModalidad !== '') params.set('id_modalidad', idModalidad);

        const qs = params.toString();
        const url = qs ? `/pacienteAtencion/?${qs}` : '/pacienteAtencion/';
        const respuesta = await getAllIpress(url);
        const lista = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);

        movimientos.value = lista.map((mov) => {
            const fechaStr = mov.fecha_atencion || (mov.created_at ? new Date(mov.created_at).toLocaleDateString() : 'N/A');
            const tipoAtencion = String(mov.tipo_atencion || '').toUpperCase();
            const estadoAtencion = String(mov.estado || '').toUpperCase();
            let tipo = 'INGRESO';
            if (tipoAtencion === 'CAMBIO_MODALIDAD') tipo = 'CAMBIO_MODALIDAD';
            else if (tipoAtencion === 'EGRESO' || estadoAtencion === 'EGRESADO') tipo = 'EGRESO';

            const modalidadLabel = mov.datosModalidad?.modalidad
                || etiquetaModalidad(mov.id_modalidad ?? mov.datosModalidad?.id_modalidad);

            const fechaMov = tipo === 'EGRESO'
                ? (mov.fecha_fin || mov.fecha_atencion || (typeof mov.created_at === 'string' ? mov.created_at.slice(0, 10) : null) || fechaStr)
                : (typeof mov.created_at === 'string' ? (mov.created_at.slice(0, 10) || fechaStr) : (mov.fecha_atencion || 'N/A'));

            return {
                id: mov.id_paciente_atencion,
                tipo,
                condicion: tipo === 'EGRESO'
                    ? 'EGRESADO'
                    : (tipoAtencion === 'CAMBIO_MODALIDAD' ? 'CAMBIO_MODALIDAD' : (mov.tipo_atencion || 'N/A')),
                fecha: fechaMov,
                paciente_nombre: mov.datosPaciente?.paciente || 'N/A',
                paciente_dni: mov.datosPaciente?.documento || 'N/A',
                tipo_egreso: tipo === 'EGRESO' ? extraerTipoEgresoDesdeObs(mov.observaciones) : null,
                observaciones: mov.observaciones,
                periodo: mov.datosPeriodo?.periodo || 'N/A',
                clinica: mov.datosIpress?.nombre_corto || mov.datosIpress?.ipress || 'N/A',
                modalidad: modalidadLabel,
                detalle_modalidad: tipoAtencion === 'CAMBIO_MODALIDAD' ? (mov.observaciones || modalidadLabel) : modalidadLabel,
            };
        });
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        movimientos.value = [];
    }
};

const fetchPeriodos = async () => {
    try {
        const respuesta = await getAllIpress("/periodos/");
        periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    } catch (error) {
        console.error('Error al obtener periodos:', error);
    }
};

const fetchIpress = async (url = null) => {
    try {
        const respuesta = await getAllIpress(url ?? "/ipress/");
        ipress.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchPacientes = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/");
        pacientes.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        pacientes.value = [];
    }
};

// Funciones de Validación
const validarFechaPeriodo = (fecha, periodoId) => {
    try {
        const periodo = periodos.value.find((p) => String(p.id_periodo) === String(periodoId));
        if (!periodo) {
            return {
                valido: false,
                mensaje: 'No se pudo obtener información del periodo seleccionado'
            };
        }

        const partsP = String(periodo.periodo).split('-');
        const yearP = parseInt(partsP[0], 10);
        const monthP = parseInt(partsP[1], 10);
        const partsF = String(fecha).trim().split('-');
        if (partsF.length < 2) {
            return { valido: false, mensaje: 'Fecha no válida' };
        }
        const yearF = parseInt(partsF[0], 10);
        const monthF = parseInt(partsF[1], 10);
        if (Number.isNaN(yearP) || Number.isNaN(monthP) || Number.isNaN(yearF) || Number.isNaN(monthF)) {
            return { valido: false, mensaje: 'No se pudo validar la fecha respecto al periodo' };
        }
        if (yearF !== yearP || monthF !== monthP) {
            return {
                valido: false,
                mensaje: `La fecha debe estar dentro del periodo ${periodo.periodo} (incluido el día 1).`
            };
        }

        return { valido: true, mensaje: '' };
    } catch (error) {
        console.error('Error al validar periodo:', error);
        return { valido: true, mensaje: '' };
    }
};

const validarCierreMesAnterior = async (pacienteId, periodoActualId) => {
    try {
        const periodo = periodos.value.find(p => p.id_periodo === periodoActualId);
        if (!periodo) {
            return { valido: true, mensaje: '' };
        }

        // Calcular periodo anterior
        const [year, month] = periodo.periodo.split('-');
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        
        let mesAnterior, yearAnterior;
        if (monthNum === 1) {
            mesAnterior = 12;
            yearAnterior = yearNum - 1;
        } else {
            mesAnterior = monthNum - 1;
            yearAnterior = yearNum;
        }
        
        const periodoAnteriorStr = `${yearAnterior}-${String(mesAnterior).padStart(2, '0')}`;
        const periodoAnterior = periodos.value.find(p => p.periodo === periodoAnteriorStr);

        if (!periodoAnterior) {
            return {
                valido: true,
                mensaje: `Nota: No se encontró el cierre del periodo anterior (${periodoAnteriorStr}). Verifique la consistencia de los datos.`
            };
        }

        // Verificar registros en el periodo anterior
        const registroPeriodoAnterior = await getAllIpress(`/PacienteRegistro/?paciente=${pacienteId}&periodo=${periodoAnterior.id_periodo}`);
        
        if (!registroPeriodoAnterior || registroPeriodoAnterior.length === 0) {
            return {
                valido: true,
                mensaje: `Nota: El paciente no tiene registros en el periodo anterior (${periodoAnteriorStr}). Verifique si esto es correcto.`
            };
        }

        const ultimoRegistroAnterior = registroPeriodoAnterior.sort((a, b) => 
            new Date(b.fecha_created) - new Date(a.fecha_created)
        )[0];

        if (ultimoRegistroAnterior.condicion === 'EGRESADO' && condicionAutomatica.value !== 'REINGRESO') {
            return {
                valido: true,
                mensaje: `Advertencia: El último registro del periodo anterior es un egreso, la condición actual debería ser REINGRESO.`
            };
        }

        if (ultimoRegistroAnterior.condicion !== 'EGRESADO' && condicionAutomatica.value === 'NUEVO') {
            return {
                valido: true,
                mensaje: `Advertencia: El paciente tiene registros previos, la condición no debería ser NUEVO.`
            };
        }

        return {
            valido: true,
            mensaje: `✓ Consistente con el cierre del periodo anterior (${periodoAnteriorStr})`
        };

    } catch (error) {
        console.error('Error al validar cierre mes anterior:', error);
        return { valido: true, mensaje: '' };
    }
};

function etiquetaModalidad(idModalidad) {
    const id = Number(idModalidad);
    if (id === 1) return 'Hemodiálisis';
    if (id === 2) return 'Diálisis Peritoneal';
    if (id === 3) return 'Trasplante';
    return idModalidad != null && idModalidad !== '' ? `Modalidad ${idModalidad}` : '—';
}

function truncarObservaciones(texto, max = 100) {
    const s = String(texto || '');
    return s.length <= max ? s : `${s.slice(0, max - 3)}...`;
}

function extraerTipoEgresoDesdeObs(observaciones) {
    const obs = String(observaciones || '').trim();
    if (!obs) return null;
    const match = obs.match(/^Egreso:\s*([^.]+)/i);
    return match ? match[1].trim() : obs;
}

async function obtenerAtencionActivaParaEgreso({ pacienteId, periodoId, ipressId, modalidadId }) {
    const params = new URLSearchParams({
        id_paciente: String(pacienteId),
        id_periodo: String(periodoId),
    });
    if (ipressId != null && ipressId !== '') params.set('id_ipress', String(ipressId));
    if (modalidadId != null && modalidadId !== '') params.set('id_modalidad', String(modalidadId));

    const res = await getAllIpress(`/pacienteAtencion/?${params.toString()}`);
    const lista = Array.isArray(res) ? res : (res?.results || []);

    return (
        lista.find((a) => String(a.estado || '').toUpperCase() === 'ACTIVO')
        || lista.find((a) => String(a.tipo_atencion || '').toUpperCase() !== 'EGRESO' && String(a.estado || '').toUpperCase() !== 'EGRESADO')
        || null
    );
}

async function obtenerModalidadActualPaciente(pacienteId) {
    const enLista =
        pacientesEgresar.value.find((p) => String(p.id_paciente) === String(pacienteId)) ||
        pacientes.value.find((p) => String(p.id_paciente) === String(pacienteId));
    if (enLista?.id_modalidad != null && enLista.id_modalidad !== '') {
        return Number(enLista.id_modalidad);
    }
    try {
        const pac = await getAllIpress(`/pacientes/${pacienteId}/`);
        const idModPac = pac?.id_modalidad ?? pac?.datosModalidad?.id_modalidad;
        if (idModPac != null && idModPac !== '') {
            return Number(idModPac);
        }
    } catch (e) {
        console.warn('No se obtuvo modalidad desde pacientes:', e);
    }
    try {
        const res = await getAllIpress(`/pacienteAtencion/?id_paciente=${pacienteId}`);
        const lista = Array.isArray(res) ? res : (res?.results || []);
        const activa = lista.find((a) => String(a.estado || '').toUpperCase() === 'ACTIVO') || lista[0];
        const idMod = activa?.id_modalidad ?? activa?.datosModalidad?.id_modalidad;
        return idMod != null && idMod !== '' ? Number(idMod) : null;
    } catch (e) {
        console.error('Error al obtener modalidad actual del paciente:', e);
        return null;
    }
}

/**
 * Registra automáticamente un cambio de modalidad en el historial de movimientos
 * (pacienteAtencion tipo CAMBIO_MODALIDAD + PacienteRegistro) y actualiza rd_pacientes.
 */
async function registrarCambioModalidadHistorial({
    pacienteId,
    modalidadAnteriorId,
    modalidadNuevaId,
    fecha,
    periodoId,
    ipressId,
    observacionesExtra = '',
    origen = 'SISTEMA',
}) {
    const textoAnterior = etiquetaModalidad(modalidadAnteriorId);
    const textoNueva = etiquetaModalidad(modalidadNuevaId);
    const detalle = modalidadNuevaId != null && String(modalidadAnteriorId) !== String(modalidadNuevaId)
        ? `${textoAnterior} → ${textoNueva}`
        : `${textoAnterior} (egreso por cambio de modalidad)`;
    const obsCompleta = `Cambio de modalidad: ${detalle}${observacionesExtra ? `. ${observacionesExtra}` : ''} [${origen}]`;
    const obs = truncarObservaciones(obsCompleta);
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const fechaMov = fecha || now.slice(0, 10);
    const idModRegistro = modalidadNuevaId != null ? modalidadNuevaId : modalidadAnteriorId;

    await postAllIpress('/pacienteAtencion/', {
        id_paciente: pacienteId,
        id_ipress: ipressId,
        id_periodo: periodoId,
        id_modalidad: idModRegistro,
        fecha_atencion: fechaMov,
        tipo_atencion: 'CAMBIO_MODALIDAD',
        fecha_inicio: fechaMov,
        fecha_fin: '',
        estado: 'HISTORICO',
        observaciones: obs,
        created_at: now,
    });

    try {
        await postAllIpress('/PacienteRegistro/', {
            paciente: pacienteId,
            periodo: periodoId,
            ipress: ipressId,
            condicion: 'CAMBIO_MODALIDAD',
            modalidad_anterior: modalidadAnteriorId,
            modalidad_nueva: modalidadNuevaId,
            observaciones: obs,
        });
    } catch (e) {
        console.warn('PacienteRegistro (auditoría):', e);
    }

    if (modalidadNuevaId != null && String(modalidadAnteriorId) !== String(modalidadNuevaId)) {
        await patchAllIpress(`/pacientes/${pacienteId}/`, { id_modalidad: modalidadNuevaId });
        try {
            const dialisis = await getAllIpress(`/pacientesDialisis/?id_paciente=${pacienteId}`);
            const lista = Array.isArray(dialisis) ? dialisis : (dialisis?.results || []);
            if (lista[0]?.id_paciente_dialisis) {
                await patchAllIpress(`/pacientesDialisis/${lista[0].id_paciente_dialisis}/`, {
                    modalidad_inicio_trr: textoNueva,
                });
            }
        } catch (e) {
            console.warn('No se actualizó modalidad en pacientesDialisis:', e);
        }
        if (pacienteSeleccionado.value?.id_paciente === pacienteId) {
            pacienteSeleccionado.value = { ...pacienteSeleccionado.value, id_modalidad: modalidadNuevaId };
        }
        if (pacienteSeleccionadoEgresar.value?.id_paciente === pacienteId) {
            pacienteSeleccionadoEgresar.value = { ...pacienteSeleccionadoEgresar.value, id_modalidad: modalidadNuevaId };
        }
    }
}

// Funciones auxiliares para actualizar paciente
const patchPacienteEstado = async (pacienteId, nuevoEstado) => {
    try {
        await patchAllIpress(`/pacientes/${pacienteId}/`, { estado: nuevoEstado });
    } catch (error) {
        console.error('Error al actualizar estado del paciente:', error);
        throw error;
    }
};

const actualizarPeriodoIpressPaciente = async (pacienteId, periodoId, ipressId) => {
    try {
        // Obtener el id_paciente_dialisis
        const respuesta = await getAllIpress(`/pacientesDialisis/?id_paciente=${pacienteId}`);
        if (respuesta && respuesta.length > 0) {
            const idPacienteDialisis = respuesta[0].id_paciente_dialisis;
            
            const idPeriodoIpress = await resolverIdPeriodoIpress(periodoId, ipressId);
            if (idPeriodoIpress != null) {
                await patchAllIpress(`/pacientesDialisis/${idPacienteDialisis}/`, {
                    id_periodo_ipress: idPeriodoIpress
                });
            }
        }
    } catch (error) {
        console.error('Error al actualizar periodo_ipress del paciente:', error);
        // No lanzamos el error para no bloquear el proceso principal
    }
};

// Recargar movimientos al cambiar periodo, clínica o modalidad
watch([periodoGlobal, clinicaGlobal, modalidadGlobal], () => {
    fetchMovimientos();
}, { deep: true });

// Inicialización
onMounted(() => {
    fetchMovimientos();
    fetchPeriodos();
    fetchIpress();
    procesarCaptacionDesdeRuta();
});

watch(() => route.query?.captarDni, () => {
    procesarCaptacionDesdeRuta();
});
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>

