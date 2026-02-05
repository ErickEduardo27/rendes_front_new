<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>

        <div class="flex items-center gap-2 flex-wrap justify-between">
            <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
                <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
                    <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}
                    </option>
                </select>

                <label>Clínica:</label>
                <label>{{ paciente.ipress }}</label>

                <label>Modalidad de Diálisis:</label>
                <label v-if="pacienteSeleccionado.value">{{ pacienteSeleccionado.value.id_modalidad == 1 ?
                    "Hemodialisis" : "Peritonial" }}</label>
            </div>

            <div class="flex gap-2">
                <button @click="abrirModalCaptar"
                    class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm">
                    ➕ Captar Paciente
                </button>
                <button @click="abrirModalEgresar"
                    class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm">
                    ➖ Egresar Paciente
                </button>
            </div>
        </div>

        <div class="flex gap-6 mt-6">
            <div class="flex-1 space-y-6">
                <div>
                    <h2 class="text-xl font-semibold">ACCESO DE DIÁLISIS</h2>
                    <p class="text-sm text-gray-600">A continuación se presenta el Acceso Vascular Actual del paciente
                    </p>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    
                    <div>
                        <label class="text-sm">Tipo de Acceso Vascular</label>
                        <select disabled v-model="form.tipo_acceso_actual" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option value="Catéter Venoso Central Temporal">Catéter Venoso Central Temporal</option>
                            <option value="Catéter Venoso Central de Larga Permanencia">Catéter Venoso Central de Larga
                                Permanencia</option>
                            <option value="Fístula Arteriovenosa">Fístula Arteriovenosa</option>
                            <option value="Injerto Autólogo">Injerto Autólogo</option>
                            <option value="Injerto Protésico">Injerto Protésico</option>
                            <option value="Catéter peritoneal">Catéter peritoneal</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Localización de Acceso Vascular</label>
                        <select disabled v-model="form.localizacion_acceso_actual"
                            class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option v-for="op in opcionesLocalizacion" :key="op.value" :value="op.value">
                                {{ op.label }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Fecha de Creación de Acceso</label>
                        <input disabled v-model="form.fecha_creacion_acceso_actual" type="date"
                            class="w-full border px-2 py-1 rounded" />
                    </div>

                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="text-sm">¿Se va a cambiar el acceso del paciente?</label>
                        <select v-model="form.cambio_acceso" class="w-full border px-2 py-1 rounded">
                            <option value="true">SÍ</option>
                            <option value="false">NO</option>
                        </select>
                    </div>

                    <div v-if="form.cambio_acceso == 'true'">
                        <label class="text-sm">Especificar el Motivo de Cambio de Acceso</label>
                        <select v-model="form.motivo_cambio" class="w-full border px-2 py-1 rounded">
                            <option value="">Seleccione una opción</option>
                            <option value="1">Complicación mecánica</option>
                            <option value="2">Complicación infecciosa</option>
                            <option value="3">Prescripción Médica</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mt-4" v-if="form.cambio_acceso == 'true'">
                    <div>
                        <label class="text-sm">Tipo de Nuevo Acceso Vascular</label>
                        <select v-model="form.tipo_acceso_nuevo" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option value="Catéter Venoso Central Temporal">Catéter Venoso Central Temporal</option>
                            <option value="Catéter Venoso Central de Larga Permanencia">Catéter Venoso Central de Larga
                                Permanencia</option>
                            <option value="Fístula Arteriovenosa">Fístula Arteriovenosa</option>
                            <option value="Injerto Autólogo">Injerto Autólogo</option>
                            <option value="Injerto Protésico">Injerto Protésico</option>
                            <option value="Catéter peritoneal">Catéter peritoneal</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Localización de Nuevo Acceso Vascular</label>
                        <select v-model="form.localizacion_acceso_nuevo" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option v-for="op in opcionesLocalizacion" :key="op.value" :value="op.value">
                                {{ op.label }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Fecha de Creación de Nuevo Acceso</label>
                        <input v-model="form.fecha_creacion_acceso_nuevo" type="date"
                            class="w-full border px-2 py-1 rounded" />
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Historial de Cambios de Acceso Vascular</h3>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div v-if="historialAcceso.length === 0" class="text-gray-500 text-center py-4">
                            No hay registros de cambios de acceso.
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="(cambio, index) in historialAcceso" :key="index"
                                class="bg-white p-3 rounded border-l-4 border-blue-500">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-medium text-sm text-gray-700">
                                            <strong>Fecha:</strong> {{ cambio.fecha }}
                                        </div>
                                        <div class="text-sm text-gray-600 mt-1">
                                            <strong>Tipo de Acceso:</strong> {{ cambio.tipo_acceso }}
                                        </div>
                                        <div class="text-sm text-gray-600">
                                            <strong>Localización:</strong> {{ cambio.localizacion }}
                                        </div>
                                        <div v-if="cambio.motivo" class="text-sm text-gray-600">
                                            <strong>Motivo de Cambio:</strong> {{ cambio.motivo }}
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        {{ cambio.estado }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">Movimientos del Paciente (Ingresos/Egresos)</h3>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div v-if="historialMovimientos.length === 0" class="text-gray-500 text-center py-4">
                            No hay registros de movimientos del paciente.
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="(movimiento, index) in historialMovimientosOrdenado" :key="index" :class="['bg-white p-3 rounded border-l-4',
                                movimiento.tipo === 'INGRESO' || movimiento.tipo === 'CAPTADO' ? 'border-green-500' :
                                    movimiento.tipo === 'EGRESO' ? 'border-red-500' : 'border-blue-500']">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-medium text-sm text-gray-700">
                                            <span :class="[movimiento.tipo === 'INGRESO' || movimiento.tipo === 'CAPTADO' ? 'text-green-600' :
                                                movimiento.tipo === 'EGRESO' ? 'text-red-600' : 'text-blue-600']">
                                                {{ movimiento.tipo }}
                                            </span> - <strong>Fecha:</strong> {{ movimiento.fecha }}
                                        </div>
                                        <div class="text-sm text-gray-600 mt-1">
                                            <strong>Condición:</strong> {{ movimiento.condicion }}
                                        </div>
                                        <div v-if="movimiento.tipo === 'EGRESO' && movimiento.tipo_egreso"
                                            class="text-sm text-gray-600">
                                            <strong>Tipo de Egreso:</strong> {{ movimiento.tipo_egreso }}
                                        </div>
                                        <div v-if="movimiento.observaciones" class="text-sm text-gray-600">
                                            <strong>Observaciones:</strong> {{ movimiento.observaciones }}
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        {{ movimiento.periodo }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mt-6">
                    <button @click="abrirModuloInfeccion"
                        class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                        🦠 Módulo de Infección
                    </button>
                    <div class="flex gap-2">
                        <button class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                        <button class="bg-sky-500 text-white px-4 py-2 rounded" @click="postForm()">Registrar</button>
                    </div>
                </div>
            </div>

            <div class="w-80 p-4 border rounded shadow cursor-pointer" v-if="pacienteSeleccionado.value"
                @click="abrirHistorico">
                <div class="flex items-center justify-center mb-2">
                    <div class="bg-gray-300 rounded-full h-16 w-16"></div>
                </div>
                <p class="text-center font-bold">{{ pacienteSeleccionado.value.paciente }}</p>
                <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.value.documento }}</p>
                <ul class="text-sm text-gray-700 mt-4 space-y-1">
                    <li><strong>Edad:</strong> {{ edadPaciente }}</li>
                    <li><strong>Sexo:</strong> {{ pacienteSeleccionado.value.genero == "M" ? "Masculino" : "Femenino" }}
                    </li>
                    <li><strong>Tipo de Registro:</strong> {{ pacienteSeleccionado.value.id_modalidad
                        == 1 ? "Hemodialisis" : "Peritonial" }}</li>
                    <li><strong>Estado:</strong> {{ pacienteSeleccionado.value.estado }}</li>
                    <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
                </ul>
            </div>

            <div v-if="mostrarHistorico"
                class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                        @click="cerrarHistorico">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">Histórico del Paciente</h3>
                    <div v-if="historico.length === 0" class="text-gray-500 text-center">No hay registros históricos.
                    </div>
                    <ul v-else class="space-y-2">
                        <li v-for="item in historicoOrdenado" :key="item.id_registro" class="border rounded p-2">
                            <div><strong>Fecha:</strong> {{ item.fecha }}</div>
                            <div><strong>Detalle:</strong> {{ item.detalle }}</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="mostrarModalCaptar"
                class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                        @click="cerrarModalCaptar">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">➕ Captar Paciente</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Condición del Paciente en la
                                Unidad</label>
                            <select v-model="formCaptar.condicion" class="w-full border rounded p-2 text-sm" disabled>
                                <option value="">{{ condicionAutomatica }}</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">
                                {{ mensajeCondicion }}
                            </p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de
                                Ingreso/Reingreso</label>
                            <input v-model="formCaptar.fecha" type="date" class="w-full border rounded p-2 text-sm" />
                        </div>

                        <div v-if="condicionAutomatica === 'REINGRESO'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Registro de Egreso
                                Previo</label>
                            <div class="bg-gray-50 p-3 rounded border">
                                <div v-if="ultimoEgreso" class="text-sm">
                                    <p><strong>Tipo de Egreso:</strong> {{ ultimoEgreso.tipo_egreso }}</p>
                                    <p><strong>Fecha:</strong> {{ ultimoEgreso.fecha }}</p>
                                </div>
                                <div v-else class="text-red-500 text-sm">
                                    ⚠️ No se encontró un egreso previo
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                            <textarea v-model="formCaptar.observaciones" class="w-full border rounded p-2 text-sm"
                                rows="3" placeholder="Observaciones adicionales..."></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button @click="cerrarModalCaptar"
                            class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                        <button @click="captarPaciente" class="bg-green-500 text-white px-4 py-2 rounded">Captar
                            Paciente</button>
                    </div>
                </div>
            </div>

            <div v-if="mostrarModalEgresar"
                class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                        @click="cerrarModalEgresar">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">➖ Egresar Paciente</h3>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Egreso*</label>
                            <input v-model="formEgresar.fecha" type="date" class="w-full border rounded p-2 text-sm" />
                        </div>

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

                        <div v-if="formEgresar.tipo_egreso === 'Otros'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Especificar Motivo</label>
                            <input v-model="formEgresar.motivo_especifico" type="text"
                                class="w-full border rounded p-2 text-sm"
                                placeholder="Especifique el motivo del egreso" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                            <textarea v-model="formEgresar.observaciones" class="w-full border rounded p-2 text-sm"
                                rows="3" placeholder="Observaciones adicionales..."></textarea>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button @click="cerrarModalEgresar"
                            class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                        <button @click="egresarPaciente" class="bg-red-500 text-white px-4 py-2 rounded">Egresar
                            Paciente</button>
                    </div>
                </div>
            </div>

            <div v-if="mostrarModuloInfeccion"
                class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                        @click="cerrarModuloInfeccion">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">🦠 Módulo de Infección</h3>

                    <div class="space-y-6">
                        <div class="space-y-2">
                            <label class="block font-semibold text-sm text-gray-700">¿Presenta infecciones?</label>
                            <select v-model="formInfeccion.presentaInfecciones"
                                class="w-full border rounded p-2 text-sm">
                                <option value="">Seleccione una opción</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div v-if="formInfeccion.presentaInfecciones === 'si'" class="space-y-4">
                            <h4 class="font-medium text-gray-800">Detalles de la Infección</h4>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Tipo de Infección</label>
                                    <select v-model="formInfeccion.tipoInfeccion"
                                        class="w-full border rounded p-2 text-sm">
                                        <option value="">Seleccione una opción</option>
                                        <option value="bacteriana">Bacteriana</option>
                                        <option value="viral">Viral</option>
                                        <option value="fungica">Fúngica</option>
                                        <option value="otra">Otra</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Localización</label>
                                    <select v-model="formInfeccion.localizacion"
                                        class="w-full border rounded p-2 text-sm">
                                        <option value="">Seleccione una opción</option>
                                        <option value="acceso_vascular">Acceso Vascular</option>
                                        <option value="torrente_sanguineo">Torrente Sanguíneo</option>
                                        <option value="respiratoria">Respiratoria</option>
                                        <option value="urinaria">Urinaria</option>
                                        <option value="piel">Piel</option>
                                        <option value="otra">Otra</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                    <input v-model="formInfeccion.fechaInicio" type="date"
                                        class="w-full border rounded p-2 text-sm" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Fecha de Resolución</label>
                                    <input v-model="formInfeccion.fechaResolucion" type="date"
                                        class="w-full border rounded p-2 text-sm" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Tratamiento</label>
                                <textarea v-model="formInfeccion.tratamiento" class="w-full border rounded p-2 text-sm"
                                    rows="3" placeholder="Describa el tratamiento administrado..."></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700">Observaciones</label>
                                <textarea v-model="formInfeccion.observaciones"
                                    class="w-full border rounded p-2 text-sm" rows="2"
                                    placeholder="Observaciones adicionales..."></textarea>
                            </div>
                        </div>

                        <div class="mt-6">
                            <h4 class="font-medium text-gray-800 mb-3">Historial de Infecciones</h4>
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div v-if="historialInfecciones.length === 0" class="text-gray-500 text-center py-4">
                                    No hay registros de infecciones previas.
                                </div>
                                <div v-else class="space-y-3">
                                    <div v-for="(infeccion, index) in historialInfeccionesOrdenado" :key="index"
                                        class="bg-white p-3 rounded border-l-4 border-red-500">
                                        <div class="flex justify-between items-start">
                                            <div class="flex-1">
                                                <div class="font-medium text-sm text-gray-700">
                                                    <strong>Fecha:</strong> {{ infeccion.fecha }}
                                                </div>
                                                <div class="text-sm text-gray-600 mt-1">
                                                    <strong>Tipo:</strong> {{ infeccion.tipo }}
                                                </div>
                                                <div class="text-sm text-gray-600">
                                                    <strong>Localización:</strong> {{ infeccion.localizacion }}
                                                </div>
                                                <div v-if="infeccion.tratamiento" class="text-sm text-gray-600">
                                                    <strong>Tratamiento:</strong> {{ infeccion.tratamiento }}
                                                </div>
                                            </div>
                                            <div class="text-xs text-gray-400">
                                                {{ infeccion.estado }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button @click="cerrarModuloInfeccion"
                            class="bg-gray-400 text-white px-4 py-2 rounded">Cerrar</button>
                        <button @click="guardarInfeccion" class="bg-red-500 text-white px-4 py-2 rounded">Guardar
                            Infección</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const mostrarHistorico = ref(false);
const historico = ref([]);
const mostrarModuloInfeccion = ref(false);
const historialInfecciones = ref([]);
const mostrarModalCaptar = ref(false);
const mostrarModalEgresar = ref(false);
const historialMovimientos = ref([]);
const condicionAutomatica = ref('');
const mensajeCondicion = ref('');
const ultimoEgreso = ref(null);

const abrirHistorico = async () => {
    mostrarHistorico.value = true;
    // Aquí deberías hacer la petición real al backend para obtener el histórico del paciente
    // Ejemplo de datos mock:
    historico.value = [];
    try {
        // Reemplaza esta llamada por la real:
        // historico.value = await getAllIpress(`/historico_paciente/${pacienteSeleccionado.value.id_paciente}`);
        historico.value = [
            { id_registro: 1, fecha: '2024-01-15', detalle: 'Ingreso a unidad' },
            { id_registro: 2, fecha: '2024-06-10', detalle: 'Cambio de acceso' },
            { id_registro: 3, fecha: '2025-03-22', detalle: 'Egreso temporal' },
        ];
    } catch (e) {
        historico.value = [];
    }
};

const cerrarHistorico = () => {
    mostrarHistorico.value = false;
};

// Funciones para el módulo de infección
const abrirModuloInfeccion = () => {
    mostrarModuloInfeccion.value = true;
    fetchHistorialInfecciones();
};

const cerrarModuloInfeccion = () => {
    mostrarModuloInfeccion.value = false;
    // Limpiar formulario al cerrar
    Object.keys(formInfeccion).forEach(key => {
        formInfeccion[key] = '';
    });
};

const guardarInfeccion = async () => {
    if (formInfeccion.presentaInfecciones === 'si') {
        // Validar campos requeridos
        if (!formInfeccion.tipoInfeccion || !formInfeccion.localizacion || !formInfeccion.fechaInicio) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }
        
        // Agregar a historial local
        const nuevaInfeccion = {
            id: Date.now(),
            fecha: formInfeccion.fechaInicio,
            tipo: formInfeccion.tipoInfeccion,
            localizacion: formInfeccion.localizacion,
            tratamiento: formInfeccion.tratamiento,
            observaciones: formInfeccion.observaciones,
            estado: 'Registrada'
        };
        
        historialInfecciones.value.push(nuevaInfeccion);
        
        // Aquí deberías hacer la petición real al backend
        // await postAllIpress("/infecciones/", formInfeccion);
        
        alert('Infección registrada correctamente.');
        cerrarModuloInfeccion();
    } else {
        alert('No se registró ninguna infección.');
        cerrarModuloInfeccion();
    }
};

const fetchHistorialInfecciones = async () => {
    try {
        // Aquí deberías hacer la petición real al backend para obtener el historial de infecciones
        // Ejemplo: const respuesta = await getAllIpress(`/infecciones/${paciente.id_paciente}`);
        
        // Datos de ejemplo para demostración
        historialInfecciones.value = [
            {
                id: 1,
                fecha: '2024-03-15',
                tipo: 'Bacteriana',
                localizacion: 'Acceso Vascular',
                tratamiento: 'Vancomicina 1g IV cada 12h',
                observaciones: 'Infección en sitio de inserción del catéter',
                estado: 'Resuelta'
            },
            {
                id: 2,
                fecha: '2024-01-20',
                tipo: 'Viral',
                localizacion: 'Respiratoria',
                tratamiento: 'Sintomático',
                observaciones: 'Infección respiratoria leve',
                estado: 'Resuelta'
            }
        ];
    } catch (error) {
        console.error('Error al obtener historial de infecciones:', error);
        historialInfecciones.value = [];
    }
};

// Funciones para Modal de Captar Paciente
const abrirModalCaptar = async () => {
    await determinarCondicionPaciente();
    formCaptar.fecha = '';
    formCaptar.observaciones = '';
    mostrarModalCaptar.value = true;
};

const cerrarModalCaptar = () => {
    mostrarModalCaptar.value = false;
    Object.keys(formCaptar).forEach(key => {
        formCaptar[key] = '';
    });
};

const determinarCondicionPaciente = async () => {
    try {
        // Buscar si existe algún registro previo del paciente en PacienteRegistro
        const respuesta = await getAllIpress(`/PacienteRegistro/?paciente=${paciente.id_paciente}`);
        
        if (!respuesta || respuesta.length === 0) {
            // No hay registros previos = NUEVO
            condicionAutomatica.value = 'NUEVO';
            mensajeCondicion.value = 'Este es el primer registro del paciente en el sistema.';
            formCaptar.condicion = 'NUEVO';
        } else {
            // Buscar si hay un egreso previo
            const egresos = respuesta.filter(r => r.condicion === 'EGRESADO').sort((a, b) => 
                new Date(b.fecha_created) - new Date(a.fecha_created)
            );
            
            if (egresos.length > 0) {
                // Tiene egreso previo = REINGRESO
                condicionAutomatica.value = 'REINGRESO';
                mensajeCondicion.value = 'El paciente tiene un egreso previo registrado.';
                formCaptar.condicion = 'REINGRESO';
                ultimoEgreso.value = {
                    tipo_egreso: egresos[0].tipo_egreso || 'No especificado',
                    fecha: egresos[0].fecha_created
                };
            } else {
                // No tiene egreso = CONTINUADOR
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
    if (!formCaptar.fecha) {
        ElMessage({
            message: 'Por favor complete la fecha de ingreso/reingreso',
            type: 'warning',
            plain: true,
        });
        return;
    }

    // Validar que la fecha de captura esté dentro del periodo seleccionado
    const validacionPeriodo = await validarFechaPeriodo(formCaptar.fecha);
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

    // Validar que el punto de partida sea del cierre del mes anterior
    const validacionCierreMesAnterior = await validarCierreMesAnterior(formCaptar.fecha);
    if (!validacionCierreMesAnterior.valido) {
        ElMessage({
            message: validacionCierreMesAnterior.mensaje,
            type: 'warning',
            plain: true,
            duration: 5000
        });
    }

    try {
        const payload = {
            paciente: paciente.id_paciente,
            periodo: periodoSeleccionado,
            condicion: condicionAutomatica.value,
            fecha_ingreso: formCaptar.fecha,
            observaciones: formCaptar.observaciones
        };

        await postAllIpress("/PacienteRegistro/", payload);
        
        ElMessage({
            message: 'Paciente captado exitosamente',
            type: 'success',
            plain: true,
        });
        
        cerrarModalCaptar();
        await fetchHistorialMovimientos();
    } catch (error) {
        console.error('Error al captar paciente:', error);
        ElMessage({
            message: 'Error al captar paciente. Intente nuevamente.',
            type: 'error',
            plain: true,
        });
    }
};

// Funciones para Modal de Egresar Paciente
const abrirModalEgresar = () => {
    formEgresar.fecha = '';
    formEgresar.tipo_egreso = '';
    formEgresar.motivo_especifico = '';
    formEgresar.observaciones = '';
    mostrarModalEgresar.value = true;
};

const cerrarModalEgresar = () => {
    mostrarModalEgresar.value = false;
    Object.keys(formEgresar).forEach(key => {
        formEgresar[key] = '';
    });
};

const egresarPaciente = async () => {
    if (!formEgresar.fecha || !formEgresar.tipo_egreso) {
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

    // Validar que la fecha de egreso esté dentro del periodo seleccionado
    const validacionPeriodo = await validarFechaPeriodo(formEgresar.fecha);
    if (!validacionPeriodo.valido) {
        ElMessage({
            message: validacionPeriodo.mensaje,
            type: 'error',
            plain: true,
        });
        return;
    }

    // Validar que el punto de partida sea del cierre del mes anterior
    const validacionCierreMesAnterior = await validarCierreMesAnterior(formEgresar.fecha);
    if (!validacionCierreMesAnterior.valido) {
        ElMessage({
            message: validacionCierreMesAnterior.mensaje,
            type: 'warning',
            plain: true,
            duration: 5000
        });
    }

    try {
        const payload = {
            paciente: paciente.id_paciente,
            periodo: periodoSeleccionado,
            condicion: 'EGRESADO',
            tipo_egreso: formEgresar.tipo_egreso === 'Otros' ? formEgresar.motivo_especifico : formEgresar.tipo_egreso,
            fecha_egreso: formEgresar.fecha,
            observaciones: formEgresar.observaciones
        };

        await postAllIpress("/PacienteRegistro/", payload);
        
        ElMessage({
            message: 'Paciente egresado exitosamente',
            type: 'success',
            plain: true,
        });
        
        cerrarModalEgresar();
        await fetchHistorialMovimientos();
    } catch (error) {
        console.error('Error al egresar paciente:', error);
        ElMessage({
            message: 'Error al egresar paciente. Intente nuevamente.',
            type: 'error',
            plain: true,
        });
    }
};

// Función para obtener historial de movimientos
const fetchHistorialMovimientos = async () => {
    try {
        const respuesta = await getAllIpress(`/PacienteRegistro/?paciente=${paciente.id_paciente}`);
        historialMovimientos.value = respuesta.map(mov => ({
            tipo: mov.condicion === 'EGRESADO' ? 'EGRESO' : 
                  mov.condicion === 'NUEVO' || mov.condicion === 'REINGRESO' || mov.condicion === 'CONTINUADOR' ? 'INGRESO' : mov.condicion,
            condicion: mov.condicion,
            fecha: mov.fecha_created ? new Date(mov.fecha_created).toLocaleDateString() : 'N/A',
            tipo_egreso: mov.tipo_egreso,
            observaciones: mov.observaciones,
            periodo: mov.periodo || 'N/A'
        }));
    } catch (error) {
        console.error('Error al obtener historial de movimientos:', error);
        historialMovimientos.value = [];
    }
};

// Función para validar que la fecha esté dentro del periodo seleccionado
const validarFechaPeriodo = async (fecha) => {
    try {
        // Obtener el periodo seleccionado
        const periodo = periodos.value.find(p => p.id_periodo === periodoSeleccionado);
        if (!periodo) {
            return {
                valido: false,
                mensaje: 'No se pudo obtener información del periodo seleccionado'
            };
        }

        // Formato del periodo: "2025-01" (año-mes)
        const [year, month] = periodo.periodo.split('-');
        const fechaIngresada = new Date(fecha);
        const yearFecha = fechaIngresada.getFullYear();
        const monthFecha = fechaIngresada.getMonth() + 1; // Los meses van de 0-11

        if (yearFecha.toString() !== year || monthFecha.toString().padStart(2, '0') !== month) {
            return {
                valido: false,
                mensaje: `La fecha debe estar dentro del periodo ${periodo.periodo}`
            };
        }

        return { valido: true, mensaje: '' };
    } catch (error) {
        console.error('Error al validar periodo:', error);
        return { valido: true, mensaje: '' }; // Permitir continuar si hay error
    }
};

// Función para validar el cierre del mes anterior
const validarCierreMesAnterior = async (fecha) => {
    try {
        // Obtener el periodo actual
        const periodo = periodos.value.find(p => p.id_periodo === periodoSeleccionado);
        if (!periodo) {
            return { valido: true, mensaje: '' };
        }

        // Calcular el periodo anterior (mes anterior)
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

        // Verificar si existe un registro del paciente en el periodo anterior
        const registroPeriodoAnterior = await getAllIpress(`/PacienteRegistro/?paciente=${paciente.id_paciente}&periodo=${periodoAnterior.id_periodo}`);
        
        if (!registroPeriodoAnterior || registroPeriodoAnterior.length === 0) {
            return {
                valido: true,
                mensaje: `Nota: El paciente no tiene registros en el periodo anterior (${periodoAnteriorStr}). Verifique si esto es correcto.`
            };
        }

        // Si hay registros en el periodo anterior, verificar consistencia
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
        return { valido: true, mensaje: '' }; // Permitir continuar si hay error
    }
};
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed } from 'vue';
import { getAllIpress, patchAllIpress, postAllIpress, putAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';

// 👇 defineProps debe estar fuera de cualquier función
const { paciente, periodo,periodoIpress } = defineProps({
    paciente: {
        type: Object,
        required: true
    },
    periodo: {
        type: Number,
        required: true
    },
    periodoIpress: {
        type: Number,
        required: true
    }
})

const router = useRouter()
const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo
const idPeriodoIpress=periodoIpress
const periodoActual = ref([])
const historialAcceso = ref([])
console.log("ajlkdjflkasjdflkasdf",periodoIpress)

const form = reactive({
    fecha_creacion_acceso_actual: null,
    tipo_acceso_actual:null,
    localizacion_acceso_actual:null,
    cambio_acceso: 'false',
    motivo_cambio: null,
    fecha_creacion_acceso_nuevo:null,
    tipo_acceso_nuevo:null,
    localizacion_acceso_nuevo:null,
    id_periodo_ipress: periodoIpress,
    id_red: 1,
    id_paciente: paciente.id_paciente
})

// Formulario para el módulo de infección
const formInfeccion = reactive({
    presentaInfecciones: '',
    tipoInfeccion: '',
    localizacion: '',
    fechaInicio: '',
    fechaResolucion: '',
    tratamiento: '',
    observaciones: ''
})

// Formulario para captar paciente
const formCaptar = reactive({
    condicion: '',
    fecha: '',
    observaciones: ''
})

// Formulario para egresar paciente
const formEgresar = reactive({
    fecha: '',
    tipo_egreso: '',
    motivo_especifico: '',
    observaciones: ''
})
// Puedes usar props.paciente o hacer destructuring:

// Todas las opciones de localización están ahora disponibles para todos los tipos de acceso
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

const localizacionesFiltradas = computed(() => {
  return opcionesLocalizacion;
});

// Computed properties para ordenar por fecha
const historicoOrdenado = computed(() => {
  return [...historico.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const historialInfeccionesOrdenado = computed(() => {
  return [...historialInfecciones.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const historialMovimientosOrdenado = computed(() => {
  return [...historialMovimientos.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const minFechaNuevoAcceso = computed(() => {
  if (!form.fecha_creacion_acceso_actual) return null;
  const fecha = new Date(form.fecha_creacion_acceso_actual);
  fecha.setDate(fecha.getDate() + 1);
  return fecha.toISOString().split('T')[0]; // formato YYYY-MM-DD
});
const validarFormulario = () => {
  const camposObligatorios = [
    'fecha_creacion_acceso_nuevo',
    'tipo_acceso_nuevo',
    'localizacion_acceso_nuevo',
  ];

  for (const campo of camposObligatorios) {
    if (!form[campo]) {
      ElMessage({
        message: `Por favor complete el campo: ${campo}`,
        type: 'warning',
        plain: true,
      })
      return false;
    }
  }

  return true;
};
const postForm = async (url = null) => {
     if (!validarFormulario()) return;
    const formEnvio={
        fecha_creacion_acceso_actual:form.fecha_creacion_acceso_nuevo,
        tipo_acceso_actual:form.tipo_acceso_nuevo,
        localizacion_acceso_actual:form.localizacion_acceso_nuevo,
        cambio_acceso: null,
        motivo_cambio: null,
        fecha_creacion_acceso_nuevo:null,
        tipo_acceso_nuevo:null,
        localizacion_acceso_nuevo:null,
        id_periodo_ipress: periodoIpress,
        id_red: 1,
        id_paciente: paciente.id_paciente
    }
    try {
        await postAllIpress(url ?? "/unidadesActuales/", formEnvio);
        if(periodoActual.value[0]){
        console.log("editar")
            await editForm();
        }else{
            alert("Se registro con exito")
            window.location.reload()
        }

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const editForm = async (url = null) => {
    try {
        await patchAllIpress(url ?? "/unidadesActuales/"+periodoActual.value[0].id_unidad_actual+"/", form);
            alert("Se registro con exito")
            window.location.reload()
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchPeriodoActual = async (url = null) => {
    try {
        const respuesta = await getAllIpress( "/unidadesActuales/?id_periodo_ipress=" +periodoIpress);
        periodoActual.value = respuesta;
        form.fecha_creacion_acceso_actual = periodoActual.value[0].fecha_creacion_acceso_actual;
        form.tipo_acceso_actual = periodoActual.value[0].tipo_acceso_actual;
        form.localizacion_acceso_actual = periodoActual.value[0].localizacion_acceso_actual;
    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const fetchHistorialAcceso = async () => {
    try {
        // Aquí deberías hacer la petición real al backend para obtener el historial de acceso
        // Ejemplo: const respuesta = await getAllIpress(`/historial_acceso/${paciente.id_paciente}`);
        
        // Datos de ejemplo para demostración
        historialAcceso.value = [
            {
                fecha: '2024-01-15',
                tipo_acceso: 'Catéter Venoso Central Temporal',
                localizacion: '5. CVCT yugular derecha',
                motivo: 'Inicio de tratamiento',
                estado: 'Activo'
            },
            {
                fecha: '2024-06-10',
                tipo_acceso: 'Fístula Arteriovenosa',
                localizacion: '1. FAV radial derecha',
                motivo: 'Complicación infecciosa',
                estado: 'Activo'
            },
            {
                fecha: '2024-03-22',
                tipo_acceso: 'Catéter Venoso Central de Larga Permanencia',
                localizacion: '11. CVCLP yugular derecha',
                motivo: 'Prescripción Médica',
                estado: 'Inactivo'
            }
        ];
    } catch (error) {
        console.error('Error al obtener historial de acceso:', error);
        historialAcceso.value = [];
    }
};
const fetchPaciente = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;
        console.log("paientes seleccionado", pacienteSeleccionado)

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};
const periodos = ref([])
// Otros datos
const mes = 'JULIO'
const anio = '2025'
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const clinicaSeleccionada = clinicas[0]

const modalidad = 'Hemodiálisis'

const fetchPeriodo = async (url = null) => {
    try {
        const respuesta = await getAllIpress(url ?? "/periodos/");
        periodos.value = respuesta;

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};

const edadPaciente = computed(() => {
    if (!pacienteSeleccionado.value?.fecha_nacimiento) return ''

    const hoy = new Date()
    const nacimiento = new Date(pacienteSeleccionado.value.fecha_nacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
    }

    return `${edad} años`
})

onMounted(() => {
    fetchPaciente();
    fetchPeriodo();
    fetchPeriodoActual();
    fetchHistorialAcceso();
    fetchHistorialMovimientos();
});

</script>

<style scoped>
select,
input[type="text"],
input[type="date"] {
    font-size: 14px;
}
</style>