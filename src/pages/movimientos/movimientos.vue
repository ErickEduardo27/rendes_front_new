<template>
    <div class="p-6 space-y-6">
        <!-- Encabezado -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Gestión de Movimientos de Pacientes</h1>
                <p class="text-sm text-gray-600 mt-1">Registre ingresos, reingresos y egresos de pacientes</p>
            </div>
            <div class="flex gap-2">
                <button @click="abrirModalCaptar" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
                    <span>➕</span>
                    <span>Captar Paciente</span>
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">Periodo de Reporte</label>
                    <select v-model="filtros.periodo" class="w-full border rounded p-2 text-sm" @change="fetchMovimientos">
                        <option value="">Todos los periodos</option>
                        <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">
                            {{ periodo.periodo }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Clínica</label>
                    <el-autocomplete 
                        v-model="filtros.clinicaNombre" 
                        :fetch-suggestions="querySearchClinica" 
                        clearable
                        placeholder="Buscar clínica..." 
                        @select="handleSelectClinica" 
                        :value-key="'ipress'" 
                        class="w-full"
                    />
                </div>
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
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="movimientosFiltrados.length === 0">
                            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
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
                                    'bg-blue-100 text-blue-800'
                                ]">
                                    {{ movimiento.tipo }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-900">
                                <span :class="[
                                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                    movimiento.condicion === 'NUEVO' ? 'bg-purple-100 text-purple-800' : 
                                    movimiento.condicion === 'REINGRESO' ? 'bg-yellow-100 text-yellow-800' : 
                                    movimiento.condicion === 'CONTINUADOR' ? 'bg-blue-100 text-blue-800' :
                                    movimiento.condicion === 'EGRESADO' ? 'bg-gray-100 text-gray-800' :
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

        <!-- Modal para Captar Paciente -->
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
                            <div><strong>Estado:</strong> {{ pacienteSeleccionado.estado }}</div>
                            <div><strong>Modalidad:</strong> {{ pacienteSeleccionado.id_modalidad == 1 ? 'Hemodiálisis' : 'Peritoneal' }}</div>
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

                    <!-- Clínica -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Clínica*</label>
                        <el-autocomplete 
                            v-model="formCaptar.clinicaNombre" 
                            :fetch-suggestions="querySearchClinica" 
                            clearable
                            placeholder="Seleccione clínica..." 
                            @select="handleSelectClinicaCaptar" 
                            :value-key="'ipress'" 
                            class="w-full"
                        />
                    </div>

                    <!-- Periodo -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Periodo*</label>
                        <select v-model="formCaptar.periodo" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione un periodo</option>
                            <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">
                                {{ periodo.periodo }}
                            </option>
                        </select>
                    </div>

                    <!-- Fecha de Ingreso/Reingreso -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso/Reingreso*</label>
                        <input v-model="formCaptar.fecha" type="date" class="w-full border rounded p-2 text-sm" />
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
                            :fetch-suggestions="querySearchPacientes" 
                            clearable
                            placeholder="Buscar por DNI o nombre..." 
                            @select="handleSelectPacienteEgresar" 
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
                    <div v-if="pacienteSeleccionadoEgresar" class="bg-red-50 p-4 rounded border border-red-200">
                        <h4 class="font-semibold text-sm text-red-900 mb-2">Paciente Seleccionado</h4>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div><strong>Nombre:</strong> {{ pacienteSeleccionadoEgresar.paciente }}</div>
                            <div><strong>DNI:</strong> {{ pacienteSeleccionadoEgresar.documento }}</div>
                            <div><strong>Estado:</strong> {{ pacienteSeleccionadoEgresar.estado }}</div>
                            <div><strong>Modalidad:</strong> {{ pacienteSeleccionadoEgresar.id_modalidad == 1 ? 'Hemodiálisis' : 'Peritoneal' }}</div>
                        </div>
                    </div>

                    <!-- Clínica -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Clínica*</label>
                        <el-autocomplete 
                            v-model="formEgresar.clinicaNombre" 
                            :fetch-suggestions="querySearchClinica" 
                            clearable
                            placeholder="Seleccione clínica..." 
                            @select="handleSelectClinicaEgresar" 
                            :value-key="'ipress'" 
                            class="w-full"
                        />
                    </div>

                    <!-- Periodo -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Periodo*</label>
                        <select v-model="formEgresar.periodo" class="w-full border rounded p-2 text-sm">
                            <option value="">Seleccione un periodo</option>
                            <option v-for="periodo in periodos" :key="periodo.id_periodo" :value="periodo.id_periodo">
                                {{ periodo.periodo }}
                            </option>
                        </select>
                    </div>

                    <!-- Fecha de Egreso -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Egreso*</label>
                        <input v-model="formEgresar.fecha" type="date" class="w-full border rounded p-2 text-sm" />
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { getAllIpress, postAllIpress, patchAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';

// Estados
const movimientos = ref([]);
const periodos = ref([]);
const ipress = ref([]);
const pacientes = ref([]);
const mostrarModalCaptar = ref(false);
const mostrarModalEgresar = ref(false);
const pacienteSeleccionado = ref(null);
const pacienteSeleccionadoEgresar = ref(null);
const condicionAutomatica = ref('');
const mensajeCondicion = ref('');
const ultimoEgreso = ref(null);
const paginaActual = ref(1);
const itemsPorPagina = 10;

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

const handleSelectClinica = (item) => {
    filtros.clinica = item.id_ipress;
    fetchMovimientos();
};

const handleSelectClinicaCaptar = (item) => {
    formCaptar.clinica = item.id_ipress;
};

const handleSelectClinicaEgresar = (item) => {
    formEgresar.clinica = item.id_ipress;
};

const handleSelectPaciente = async (item) => {
    pacienteSeleccionado.value = item;
    formCaptar.paciente = item.id_paciente;
    await determinarCondicionPaciente(item.id_paciente);
};

const handleSelectPacienteEgresar = (item) => {
    pacienteSeleccionadoEgresar.value = item;
    formEgresar.paciente = item.id_paciente;
};

const filtrarMovimientos = () => {
    paginaActual.value = 1;
};

// Funciones de Modal Captar
const abrirModalCaptar = async () => {
    await fetchPacientes();
    formCaptar.paciente = null;
    formCaptar.pacienteBusqueda = '';
    formCaptar.clinica = null;
    formCaptar.clinicaNombre = '';
    formCaptar.periodo = '';
    formCaptar.fecha = '';
    formCaptar.observaciones = '';
    pacienteSeleccionado.value = null;
    condicionAutomatica.value = '';
    mensajeCondicion.value = '';
    mostrarModalCaptar.value = true;
};

const cerrarModalCaptar = () => {
    mostrarModalCaptar.value = false;
};

const determinarCondicionPaciente = async (pacienteId) => {
    try {
        const respuesta = await getAllIpress(`/PacienteRegistro/?paciente=${pacienteId}`);
        
        if (!respuesta || respuesta.length === 0) {
            condicionAutomatica.value = 'NUEVO';
            mensajeCondicion.value = 'Este es el primer registro del paciente en el sistema.';
            formCaptar.condicion = 'NUEVO';
        } else {
            const egresos = respuesta.filter(r => r.condicion === 'EGRESADO').sort((a, b) => 
                new Date(b.fecha_created) - new Date(a.fecha_created)
            );
            
            if (egresos.length > 0) {
                condicionAutomatica.value = 'REINGRESO';
                mensajeCondicion.value = 'El paciente tiene un egreso previo registrado.';
                formCaptar.condicion = 'REINGRESO';
                ultimoEgreso.value = {
                    tipo_egreso: egresos[0].tipo_egreso || 'No especificado',
                    fecha: new Date(egresos[0].fecha_created).toLocaleDateString()
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
    if (!formCaptar.paciente || !formCaptar.periodo || !formCaptar.fecha || !formCaptar.clinica) {
        ElMessage({
            message: 'Por favor complete todos los campos obligatorios',
            type: 'warning',
            plain: true,
        });
        return;
    }

    // Validar que la fecha esté dentro del periodo seleccionado
    const validacionPeriodo = validarFechaPeriodo(formCaptar.fecha, formCaptar.periodo);
    if (!validacionPeriodo.valido) {
        ElMessage({
            message: validacionPeriodo.mensaje,
            type: 'error',
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

    // Validar consistencia con cierre del mes anterior
    const validacionCierre = await validarCierreMesAnterior(formCaptar.paciente, formCaptar.periodo);
    if (validacionCierre.mensaje) {
        ElMessage({
            message: validacionCierre.mensaje,
            type: validacionCierre.valido ? 'info' : 'warning',
            plain: true,
            duration: 5000
        });
    }

    try {
        // Registrar en historial de movimientos
        const payload = {
            paciente: formCaptar.paciente,
            periodo: formCaptar.periodo,
            ipress: formCaptar.clinica,
            condicion: condicionAutomatica.value,
            fecha_ingreso: formCaptar.fecha,
            observaciones: formCaptar.observaciones
        };

        await postAllIpress("/PacienteRegistro/", payload);

        // Actualizar estado del paciente
        const estadoPaciente = pacienteSeleccionado.value.estado === 'REGISTRADO' ? 'NUEVO' : 'REINGRESO';
        await patchPacienteEstado(formCaptar.paciente, estadoPaciente);

        // Actualizar periodo_ipress en pacientesDialisis
        await actualizarPeriodoIpressPaciente(formCaptar.paciente, formCaptar.periodo, formCaptar.clinica);
        
        ElMessage({
            message: 'Paciente captado exitosamente',
            type: 'success',
            plain: true,
        });
        
        cerrarModalCaptar();
        await fetchMovimientos();
    } catch (error) {
        console.error('Error al captar paciente:', error);
        ElMessage({
            message: 'Error al captar paciente. Intente nuevamente.',
            type: 'error',
            plain: true,
        });
    }
};

// Funciones de Modal Egresar
const abrirModalEgresar = async () => {
    await fetchPacientes();
    formEgresar.paciente = null;
    formEgresar.pacienteBusqueda = '';
    formEgresar.clinica = null;
    formEgresar.clinicaNombre = '';
    formEgresar.periodo = '';
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
        // Registrar en historial de movimientos
        const payload = {
            paciente: formEgresar.paciente,
            periodo: formEgresar.periodo,
            ipress: formEgresar.clinica,
            condicion: 'EGRESADO',
            tipo_egreso: formEgresar.tipo_egreso === 'Otros' ? formEgresar.motivo_especifico : formEgresar.tipo_egreso,
            fecha_egreso: formEgresar.fecha,
            observaciones: formEgresar.observaciones
        };

        await postAllIpress("/PacienteRegistro/", payload);

        // Actualizar estado del paciente a EGRESADO
        await patchPacienteEstado(formEgresar.paciente, 'EGRESADO');
        
        ElMessage({
            message: 'Paciente egresado exitosamente',
            type: 'success',
            plain: true,
        });
        
        cerrarModalEgresar();
        await fetchMovimientos();
    } catch (error) {
        console.error('Error al egresar paciente:', error);
        ElMessage({
            message: 'Error al egresar paciente. Intente nuevamente.',
            type: 'error',
            plain: true,
        });
    }
};

// Funciones de carga de datos
const fetchMovimientos = async () => {
    try {
        const respuesta = await getAllIpress('/PacienteRegistro/');
        movimientos.value = respuesta.map(mov => ({
            id: mov.id_registro_paciente,
            tipo: mov.condicion === 'EGRESADO' ? 'EGRESO' : 'INGRESO',
            condicion: mov.condicion,
            fecha: mov.fecha_created ? new Date(mov.fecha_created).toLocaleDateString() : 'N/A',
            paciente_nombre: mov.paciente_nombre || 'N/A',
            paciente_dni: mov.paciente_dni || 'N/A',
            tipo_egreso: mov.tipo_egreso,
            observaciones: mov.observaciones,
            periodo: mov.periodo_nombre || 'N/A',
            clinica: mov.ipress_nombre || 'N/A'
        }));
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        movimientos.value = [];
    }
};

const fetchPeriodos = async () => {
    try {
        const respuesta = await getAllIpress("/periodos/");
        periodos.value = respuesta;
    } catch (error) {
        console.error('Error al obtener periodos:', error);
    }
};

const fetchIpress = async (url = null) => {
    try {
        const respuesta = await getAllIpress(url ?? "/ipress/");
        ipress.value = respuesta;
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchPacientes = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/");
        pacientes.value = respuesta;
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        pacientes.value = [];
    }
};

// Funciones de Validación
const validarFechaPeriodo = (fecha, periodoId) => {
    try {
        const periodo = periodos.value.find(p => p.id_periodo === periodoId);
        if (!periodo) {
            return {
                valido: false,
                mensaje: 'No se pudo obtener información del periodo seleccionado'
            };
        }

        const [year, month] = periodo.periodo.split('-');
        const fechaIngresada = new Date(fecha);
        const yearFecha = fechaIngresada.getFullYear();
        const monthFecha = fechaIngresada.getMonth() + 1;

        if (yearFecha.toString() !== year || monthFecha.toString().padStart(2, '0') !== month) {
            return {
                valido: false,
                mensaje: `La fecha debe estar dentro del periodo ${periodo.periodo}`
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
            
            // Buscar el id_periodo_ipress correspondiente
            const periodoIpress = await getAllIpress(`/periodoIpress/?periodo=${periodoId}&ipress=${ipressId}`);
            if (periodoIpress && periodoIpress.length > 0) {
                const idPeriodoIpress = periodoIpress[0].id_periodo_ipress;
                
                // Actualizar el paciente con el periodo_ipress correcto
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

// Inicialización
onMounted(() => {
    fetchMovimientos();
    fetchPeriodos();
    fetchIpress();
});
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>

