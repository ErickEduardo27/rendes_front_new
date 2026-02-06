<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>

        <div class="flex flex-col gap-4">
            
            <FiltroSuperior
                v-model:periodo="periodoSeleccionado"
                v-model:clinica="clinicaFiltro"
                v-model:modalidad="modalidadFiltro"
                @change="procesarCambioFiltro"
            />

            <div class="flex justify-end gap-2">
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
                            <option value="Catéter Venoso Central de Larga Permanencia">Catéter Venoso Central de Larga Permanencia</option>
                            <option value="Fístula Arteriovenosa">Fístula Arteriovenosa</option>
                            <option value="Injerto Autólogo">Injerto Autólogo</option>
                            <option value="Injerto Protésico">Injerto Protésico</option>
                            <option value="Catéter peritoneal">Catéter peritoneal</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Localización de Acceso Vascular</label>
                        <select disabled v-model="form.localizacion_acceso_actual" class="w-full border px-2 py-1 rounded">
                            <option disabled value="">Seleccione una opción</option>
                            <option v-for="op in opcionesLocalizacion" :key="op.value" :value="op.label">
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
                            <option v-for="tipo in tiposAccesoNuevoFiltrados" :key="tipo.value" :value="tipo.value">
                                {{ tipo.label }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="text-sm">Localización de Nuevo Acceso Vascular</label>
                        <select 
                            v-model="form.localizacion_acceso_nuevo" 
                            class="w-full border px-2 py-1 rounded"
                            :disabled="!form.tipo_acceso_nuevo"
                        >
                            <option disabled value="">Seleccione una opción</option>
                            <option v-for="op in opcionesLocalizacionNuevoFiltradas" :key="op.value" :value="op.label">
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

            <div class="w-80 p-4 border rounded shadow cursor-pointer" v-if="pacienteSeleccionado"
                @click="abrirHistorico">
                <div class="flex items-center justify-center mb-2">
                    <div class="bg-gray-300 rounded-full h-16 w-16"></div>
                </div>
                <p class="text-center font-bold">{{ pacienteSeleccionado.paciente }}</p>
                <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.documento }}</p>
                <ul class="text-sm text-gray-700 mt-4 space-y-1">
                    <li><strong>Edad:</strong> {{ edadPaciente }}</li>
                    <li><strong>Sexo:</strong> {{ pacienteSeleccionado.genero == "M" ? "Masculino" : "Femenino" }}
                    </li>
                    <li><strong>Estado:</strong> {{ pacienteSeleccionado.estado }}</li>
                </ul>
            </div>

            <div v-if="mostrarHistorico" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[400px] max-h-[80vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" @click="cerrarHistorico">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">Histórico del Paciente</h3>
                    <div v-if="historico.length === 0" class="text-gray-500 text-center">No hay registros históricos.</div>
                    <ul v-else class="space-y-2">
                        <li v-for="item in historicoOrdenado" :key="item.id_registro" class="border rounded p-2">
                            <div><strong>Fecha:</strong> {{ item.fecha }}</div>
                            <div><strong>Detalle:</strong> {{ item.detalle }}</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="mostrarModalCaptar" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" @click="cerrarModalCaptar">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">➕ Captar Paciente</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                            <select v-model="formCaptar.condicion" class="w-full border rounded p-2 text-sm" disabled>
                                <option value="">{{ condicionAutomatica }}</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">{{ mensajeCondicion }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                            <input v-model="formCaptar.fecha" type="date" class="w-full border rounded p-2 text-sm" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                            <textarea v-model="formCaptar.observaciones" class="w-full border rounded p-2 text-sm" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button @click="cerrarModalCaptar" class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                        <button @click="captarPaciente" class="bg-green-500 text-white px-4 py-2 rounded">Captar</button>
                    </div>
                </div>
            </div>

            <div v-if="mostrarModalEgresar" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" @click="cerrarModalEgresar">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">➖ Egresar Paciente</h3>
                    <div class="space-y-4">
                        <div><label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label><input v-model="formEgresar.fecha" type="date" class="w-full border rounded p-2 text-sm" /></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label><select v-model="formEgresar.tipo_egreso" class="w-full border rounded p-2 text-sm"><option value="Hospitalización">Hospitalización</option><option value="Fallecimiento">Fallecimiento</option><option value="Trasplante">Trasplante</option><option value="Otros">Otros</option></select></div>
                        <div v-if="formEgresar.tipo_egreso === 'Otros'"><label class="block text-sm font-medium text-gray-700 mb-2">Especificar</label><input v-model="formEgresar.motivo_especifico" type="text" class="w-full border rounded p-2 text-sm" /></div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button @click="cerrarModalEgresar" class="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                        <button @click="egresarPaciente" class="bg-red-500 text-white px-4 py-2 rounded">Egresar</button>
                    </div>
                </div>
            </div>

            <div v-if="mostrarModuloInfeccion" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded shadow-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto relative">
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-black text-xl" @click="cerrarModuloInfeccion">&times;</button>
                    <h3 class="text-lg font-bold mb-4 text-center">🦠 Módulo de Infección</h3>
                    <div class="space-y-4">
                        <select v-model="formInfeccion.presentaInfecciones" class="w-full border p-2"><option value="si">Sí</option><option value="no">No</option></select>
                        <div v-if="formInfeccion.presentaInfecciones === 'si'">
                            <div class="grid grid-cols-2 gap-4">
                                <div><label>Tipo</label><select v-model="formInfeccion.tipoInfeccion" class="w-full border p-2"><option value="bacteriana">Bacteriana</option><option value="viral">Viral</option></select></div>
                                <div><label>Localización</label><select v-model="formInfeccion.localizacion" class="w-full border p-2"><option value="acceso_vascular">Acceso Vascular</option></select></div>
                            </div>
                            <input v-model="formInfeccion.fechaInicio" type="date" class="w-full border p-2 mt-2">
                            <textarea v-model="formInfeccion.observaciones" class="w-full border p-2 mt-2" placeholder="Observaciones"></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
                        <button @click="cerrarModuloInfeccion" class="bg-gray-400 text-white px-4 py-2 rounded">Cerrar</button>
                        <button @click="guardarInfeccion" class="bg-red-500 text-white px-4 py-2 rounded">Guardar</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed, watch } from 'vue'; 
import { getAllIpress, patchAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';
import FiltroSuperior from '@/components/FiltroSuperior.vue'; // IMPORTACIÓN DEL FILTRO

const { paciente, periodo, periodoIpress } = defineProps({
    paciente: { type: Object, required: true },
    periodo: { type: Number, required: true },
    periodoIpress: { type: Number, required: true }
})

const router = useRouter()

// CORRECCIÓN 2: MOVER 'form' ARRIBA DE TODO
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
})

// Variables para el Filtro Superior
const clinicaFiltro = ref(null);
const modalidadFiltro = ref(null);

// Función dummy para el cambio de filtro (puedes conectarla a tu lógica si deseas)
const procesarCambioFiltro = (evento) => {
    console.log("Filtro cambió:", evento);
    // Aquí puedes llamar a fetchPeriodoActual() si quieres recargar al filtrar
};

const formInfeccion = reactive({ presentaInfecciones: '', tipoInfeccion: '', localizacion: '', fechaInicio: '', fechaResolucion: '', tratamiento: '', observaciones: '' })
const formCaptar = reactive({ condicion: '', fecha: '', observaciones: '' })
const formEgresar = reactive({ fecha: '', tipo_egreso: '', motivo_especifico: '', observaciones: '' })

// CORRECCIÓN 3: Inicializar como ref(null)
const pacienteSeleccionado = ref(null); 
const periodoSeleccionado = periodo
const idPeriodoIpress = periodoIpress
const periodoActual = ref([])
const historialAcceso = ref([])
const periodos = ref([])
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

// --- 2. LISTAS Y LÓGICA DEL ACTA (NUEVO ACCESO) ---

const opcionesLocalizacion = [
  { value: '1', label: '1. FAV radial derecha' }, { value: '2', label: '2. FAV radial izquierda' },
  { value: '3', label: '3. FAV braquial o cubital derecha' }, { value: '4', label: '4. FAV braquial o cubital izquierda' },
  { value: '5', label: '5. CVCT yugular derecha' }, { value: '6', label: '6. CVCT yugular izquierdo' },
  { value: '7', label: '7. CVCT subclavio derecho' }, { value: '8', label: '8. CVCT subclavio izquierdo' },
  { value: '9', label: '9. CVCT femoral derecho' }, { value: '10', label: '10. CVCT femoral izquierdo' },
  { value: '11', label: '11. CVCLP yugular derecha' }, { value: '12', label: '12. CVCLP yugular izquierdo' },
  { value: '13', label: '13. CVCLP femoral derecho' }, { value: '14', label: '14. CVCLP femoral izquierdo' },
  { value: '15', label: '15. CVCLP translumbar' }, { value: '16', label: '16. CVCLP transhepático' },
  { value: '17', label: '17. Injerto autólogo' }, { value: '18', label: '18. Injerto protésico' },
  { value: '19', label: '19. Catéter peritoneal' }
];

// Listas para el formulario de NUEVO ACCESO (Según Acta 1-19)
const listaTiposNuevo = [
  { value: 'Catéter Venoso Central Temporal', label: 'Catéter Venoso Central Temporal' },
  { value: 'Catéter Venoso Central de Larga Permanencia', label: 'Catéter Venoso Central de Larga Permanencia' },
  { value: 'Fístula Arteriovenosa', label: 'Fístula Arteriovenosa' },
  { value: 'Injerto Autólogo', label: 'Injerto Autólogo' },
  { value: 'Injerto Protésico', label: 'Injerto Protésico' },
  { value: 'Catéter peritoneal', label: 'Catéter peritoneal' }
];

const listaLocalizacionesNuevo = [
  { value: '1. FAV radial derecha', label: '1. FAV radial derecha', tipo: 'Fístula Arteriovenosa' },
  { value: '2. FAV radial izquierda', label: '2. FAV radial izquierda', tipo: 'Fístula Arteriovenosa' },
  { value: '3. FAV braquial o cubital derecha', label: '3. FAV braquial o cubital derecha', tipo: 'Fístula Arteriovenosa' },
  { value: '4. FAV braquial o cubital izquierda', label: '4. FAV braquial o cubital izquierda', tipo: 'Fístula Arteriovenosa' },
  { value: '5. CVCT yugular derecha', label: '5. CVCT yugular derecha', tipo: 'Catéter Venoso Central Temporal' },
  { value: '6. CVCT yugular izquierdo', label: '6. CVCT yugular izquierdo', tipo: 'Catéter Venoso Central Temporal' },
  { value: '7. CVCT subclavio derecho', label: '7. CVCT subclavio derecho', tipo: 'Catéter Venoso Central Temporal' },
  { value: '8. CVCT subclavio izquierdo', label: '8. CVCT subclavio izquierdo', tipo: 'Catéter Venoso Central Temporal' },
  { value: '9. CVCT femoral derecho', label: '9. CVCT femoral derecho', tipo: 'Catéter Venoso Central Temporal' },
  { value: '10. CVCT femoral izquierdo', label: '10. CVCT femoral izquierdo', tipo: 'Catéter Venoso Central Temporal' },
  { value: '11. CVCLP yugular derecha', label: '11. CVCLP yugular derecha', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '12. CVCLP yugular izquierdo', label: '12. CVCLP yugular izquierdo', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '13. CVCLP femoral derecho', label: '13. CVCLP femoral derecho', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '14. CVCLP femoral izquierdo', label: '14. CVCLP femoral izquierdo', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '15. CVCLP translumbar', label: '15. CVCLP translumbar', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '16. CVCLP transhepático', label: '16. CVCLP transhepático', tipo: 'Catéter Venoso Central de Larga Permanencia' },
  { value: '17. Injerto autólogo', label: '17. Injerto autólogo', tipo: 'Injerto Autólogo' },
  { value: '18. Injerto protésico', label: '18. Injerto protésico', tipo: 'Injerto Protésico' },
  { value: '19. Catéter peritoneal', label: '19. Catéter peritoneal', tipo: 'Catéter peritoneal' }
];

const tiposAccesoNuevoFiltrados = computed(() => {
  const idModalidad = pacienteSeleccionado.value?.id_modalidad || 1;
  if (idModalidad == 1) { // Hemodiálisis
    return listaTiposNuevo.filter(t => t.value !== 'Catéter peritoneal');
  } else { // Peritoneal
    return listaTiposNuevo.filter(t => t.value === 'Catéter peritoneal');
  }
});

const opcionesLocalizacionNuevoFiltradas = computed(() => {
  const tipoElegido = form.tipo_acceso_nuevo;
  if (!tipoElegido) return [];
  // Filtro de validación cruzada
  return listaLocalizacionesNuevo.filter(op => op.tipo === tipoElegido);
});

// Watcher al final, porque ahora 'form' ya existe
watch(() => form.tipo_acceso_nuevo, (val) => {
    form.localizacion_acceso_nuevo = '';
    if (val === 'Catéter peritoneal') form.localizacion_acceso_nuevo = '19. Catéter peritoneal';
});

// --- FIN LOGICA ---

const localizacionesFiltradas = computed(() => {
    return opcionesLocalizacion;
});

// Computed properties para ordenar por fecha
const historicoOrdenado = computed(() => {
    return [...(historico.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const historialInfeccionesOrdenado = computed(() => {
    return [...(historialInfecciones.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const historialMovimientosOrdenado = computed(() => {
    return [...(historialMovimientos.value || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

const minFechaNuevoAcceso = computed(() => {
    if (!form.fecha_creacion_acceso_actual) return null;
    const fecha = new Date(form.fecha_creacion_acceso_actual);
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0]; // formato YYYY-MM-DD
});
const validarFormulario = () => {
    const camposObligatorios = ['fecha_creacion_acceso_nuevo', 'tipo_acceso_nuevo', 'localizacion_acceso_nuevo'];
    for (const campo of camposObligatorios) {
        if (!form[campo]) {
            ElMessage({ message: `Por favor complete el campo: ${campo}`, type: 'warning', plain: true })
            return false;
        }
    }
    return true;
};

const postForm = async (url = null) => {
    if (!validarFormulario()) return;
    const formEnvio = {
        fecha_creacion_acceso_actual: form.fecha_creacion_acceso_nuevo,
        tipo_acceso_actual: form.tipo_acceso_nuevo,
        localizacion_acceso_actual: form.localizacion_acceso_nuevo,
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

// Normaliza localizacion: si la API devuelve "5" o número, convierte a "5. CVCT yugular derecha"
const normalizarLocalizacion = (valor) => {
    if (!valor) return null;
    const str = String(valor).trim();
    const op = opcionesLocalizacion.find(o => o.value === str || o.value === valor);
    if (op) return op.value;
    const porNumero = opcionesLocalizacion.find(o => o.value.startsWith(str + '.') || o.value.startsWith(str + ' '));
    return porNumero?.value ?? valor;
};

const fetchPeriodoActual = async (url = null) => {
    try {
        const respuesta = await getAllIpress("/unidadesActuales/?id_periodo_ipress=" + periodoIpress);
        periodoActual.value = respuesta;
        // VALIDACIÓN DE SEGURIDAD
        if (periodoActual.value && periodoActual.value.length > 0) {
            form.fecha_creacion_acceso_actual = periodoActual.value[0].fecha_creacion_acceso_actual;
            form.tipo_acceso_actual = periodoActual.value[0].tipo_acceso_actual;
            const locApi = periodoActual.value[0].localizacion_acceso_actual;
            form.localizacion_acceso_actual = normalizarLocalizacion(locApi) ?? locApi;
        }
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
            { fecha: '2024-01-15', tipo_acceso: 'Catéter Venoso Central Temporal', localizacion: '5. CVCT yugular derecha', motivo: 'Inicio de tratamiento', estado: 'Activo' }
        ];
    } catch (error) { historialAcceso.value = []; }
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

const abrirHistorico = async () => { mostrarHistorico.value = true; };
const cerrarHistorico = () => { mostrarHistorico.value = false; };
const abrirModuloInfeccion = () => { mostrarModuloInfeccion.value = true; fetchHistorialInfecciones(); };
const cerrarModuloInfeccion = () => { mostrarModuloInfeccion.value = false; };
const guardarInfeccion = async () => { cerrarModuloInfeccion(); };
const fetchHistorialInfecciones = async () => { historialInfecciones.value = []; };
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

onMounted(() => {
    fetchPaciente();
    fetchPeriodo();
    fetchPeriodoActual();
    fetchHistorialAcceso();
    fetchHistorialMovimientos();
});
</script>

<style scoped>
select, input[type="text"], input[type="date"] { font-size: 14px; }
</style>