<template>
    <div class="p-6 space-y-6">
        <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>

        <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
            <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
                <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
            </select>

            <label class="font-semibold ml-4">Clínica:</label>
            <label>{{ paciente.ipress }}</label>

            <label class="font-semibold ml-4">Modalidad de Diálisis:</label>
            <label>{{ paciente.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</label>
        </div>

        <div class="flex gap-6 mt-6">
            
            <div class="flex-1 space-y-8">
                
                <div class="bg-white rounded">
                    <div class="space-y-4">
                        <div style="width: 20rem;">
                            <label class="block text-sm font-semibold text-gray-700 mb-1">
                                ¿Ha presentado algún evento de infección?
                            </label>
                            <select v-model="habilitado" class="w-full border rounded p-2 text-sm">
                                <option :value="false">No</option>
                                <option :value="true">Sí</option>
                            </select>
                        </div>

                        <div v-if="habilitado" class="animate-fade-in-down border p-5 rounded-lg shadow-sm bg-gray-50">
                            <h2 class="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Registrar Evento Infeccioso</h2>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700">Fecha de Evento</label>
                                    <input v-model="eventosInfecciosos.fe_evento" type="date"
                                        class="w-full border rounded p-2 text-sm" />
                                </div>
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700">Tipo de Infección</label>
                                    <select v-model="eventosInfecciosos.tpInfeccion"
                                        class="w-full border rounded p-2 text-sm">
                                        <option value="">Seleccione una opción</option>
                                        <option value="1">Bacteriana asociada a CVC</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4 bg-white p-3 rounded border">
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" v-model="eventosInfecciosos.tratamientoIV" class="rounded text-blue-600 focus:ring-blue-500" />
                                    <label class="text-sm font-medium text-gray-700">Tratamiento Antimicrobiano IV</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" v-model="eventosInfecciosos.vancomicinaIV" class="rounded text-blue-600 focus:ring-blue-500" />
                                    <label class="text-sm font-medium text-gray-700">Inicio de Vancomicina IV</label>
                                </div>
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" v-model="eventosInfecciosos.hemocultivoPositivo" class="rounded text-red-600 focus:ring-red-500" />
                                    <label class="text-sm font-medium text-gray-700">Hemocultivo Positivo</label>
                                </div>
                            </div>

                            <div v-if="eventosInfecciosos.hemocultivoPositivo" class="bg-white p-4 rounded border border-gray-200 mb-4">
                                <h4 class="text-sm font-bold text-gray-800 mb-3">Detalle del Cultivo</h4>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Signo Clínico</label>
                                        <select v-model="eventosInfecciosos.tipoGram" class="w-full border rounded p-2 text-sm">
                                            <option value="">Seleccione</option>
                                            <option value="Pus">Pus</option>
                                            <option value="Enrojecimiento">Enrojecimiento</option>
                                            <option value="Aumento de volumen">Aumento de volumen en el lugar de AV.</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Tipo de Germen</label>
                                        <select v-model="eventosInfecciosos.tpGermen" class="w-full border rounded p-2 text-sm">
                                            <option value="">Seleccione</option>
                                            <option v-for="(nombre, id) in catalogoGermenes" :key="id" :value="id">{{ nombre }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Bacteria</label>
                                        <select v-model="eventosInfecciosos.bacteria" class="w-full border rounded p-2 text-sm">
                                            <option value="">Seleccione</option>
                                            <option value="1">Gram +</option>
                                            <option value="2">Gram -</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Observaciones</label>
                                        <input v-model="eventosInfecciosos.observaciones" type="text"
                                            class="w-full border rounded p-2 text-sm" placeholder="Observaciones adicionales..." />
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end gap-2 pt-4 border-t">
                                <button @click="habilitado = false" class="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 border">Cancelar</button>
                                
                                <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                                    @click="postForm(false)">
                                    Registrar
                                </button>

                                <button class="bg-sky-500 text-white px-4 py-2 rounded text-sm hover:bg-sky-600"
                                    @click="postForm(true)">
                                    Registrar y Volver a Llenar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Historial de Eventos Infecciosos</h3>
                    
                    <div v-if="historial.length === 0" class="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500">
                        No hay eventos registrados.
                    </div>

                    <div v-else class="space-y-3">
                        <div v-for="(item, index) in historial" :key="index" 
                             class="bg-white p-4 rounded shadow-sm border border-l-4 border-l-red-500 border-gray-200">
                            
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <div class="mb-2">
                                        <span class="block text-sm font-bold text-gray-700">Fecha: {{ item.fe_evento }}</span>
                                        <span class="block text-sm text-gray-600 mt-1">
                                            <span class="font-semibold">Tipo:</span> 
                                            {{ obtenerNombreInfeccion(item.tpInfeccion) }}
                                        </span>
                                    </div>

                                    <div class="text-sm text-gray-600 space-y-1">
                                        <div v-if="item.hemocultivoPositivo">
                                            <span class="font-semibold text-red-600">● Hemocultivo Positivo</span>
                                            <span class="ml-2 text-gray-500">({{ catalogoGermenes[item.tpGermen] || 'Germen no especif.' }})</span>
                                        </div>
                                        <div v-if="item.tratamientoIV">
                                            <span class="font-semibold text-blue-600">● Tratamiento IV</span>
                                        </div>
                                        <div v-if="item.vancomicinaIV">
                                            <span class="font-semibold text-purple-600">● Vancomicina</span>
                                        </div>
                                    </div>

                                    <div v-if="item.observaciones" class="mt-2 text-xs text-gray-500 italic">
                                        Observación: {{ item.observaciones }}
                                    </div>
                                </div>

                                <div class="text-right">
                                    <span class="text-xs font-medium text-gray-400">Registrado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-80 h-fit sticky top-6" v-if="pacienteSeleccionado">
                <div class="p-4 border rounded shadow bg-white">
                    <div class="flex items-center justify-center mb-2">
                        <div class="bg-gray-300 rounded-full h-16 w-16 flex items-center justify-center text-2xl text-white"></div>
                    </div>
                    <p class="text-center font-bold">{{ pacienteSeleccionado.paciente }}</p>
                    <p class="text-center text-sm text-gray-600">DNI: {{ pacienteSeleccionado.documento }}</p>
                    <hr class="my-3">
                    <ul class="text-sm text-gray-700 space-y-2">
                        <li class="flex justify-between"><strong>Edad:</strong> <span>{{ edadPaciente }}</span></li>
                        <li class="flex justify-between"><strong>Sexo:</strong> <span>{{ pacienteSeleccionado.genero == "M" ? "Masculino" : "Femenino" }}</span></li>
                        <li class="flex justify-between"><strong>Registro:</strong> <span>{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</span></li>
                        <li class="flex justify-between"><strong>Estado:</strong> <span class="text-green-600 font-semibold">{{ pacienteSeleccionado.estado }}</span></li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';

const { paciente, periodo } = defineProps({
    paciente: { type: Object, required: true },
    periodo: { type: Number, required: true }
})

// Variables
const pacienteSeleccionado = ref(null) 
const periodoSeleccionado = periodo
const periodos = ref([])
const habilitado = ref(false)
const historial = ref([]) 

// Catálogos
const catalogoGermenes = {
    1: "Staphylococcus aureus", 2: "Staphylococcus epidermidis", 3: "Escherichia coli",
    4: "Serratia marcescens", 5: "Klebsiella pneumoniae", 6: "Enterobacter cloacae",
    7: "Pseudomonas aeruginosa", 8: "Klebsiella oxytoca", 9: "Enterobacter aerogenes",
    10: "Proteus mirabilis", 11: "Enterobacter hormaechei", 12: "Staphylococcus haemolyticus",
    13: "Staphylococcus especies", 14: "Stenotrophomona maltophilia", 15: "Acinetobacter baumannii"
};

const catalogoInfecciones = {
    1: "Bacteriana asociada a CVC",
    2: "Peritonitis",
    3: "Infección del Orificio de Salida"
};

const eventosInfecciosos = reactive({
    fe_evento: '',
    tpInfeccion: '', // Aquí guardaremos "1" si el usuario selecciona Bacteriana
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tipoGram: '',
    tpGermen: '',
    bacteria: '',
    observaciones: '',
    id_periodo_ipress: 17, 
    id_red: 1,
    id_paciente: paciente.id_paciente
})

const obtenerNombreInfeccion = (id) => {
    return catalogoInfecciones[id] || 'Otro';
}

const fetchHistorialEventos = async () => {
    try {
        const respuesta = await getAllIpress(`/eventosAccesosVasculares/?id_paciente=${paciente.id_paciente}`);
        
        if (Array.isArray(respuesta)) {
            historial.value = respuesta.sort((a, b) => new Date(b.fe_evento) - new Date(a.fe_evento));
        } else {
            historial.value = [];
        }
    } catch (error) {
        console.error('Error al cargar historial:', error);
        historial.value = [];
    }
}

const postForm = async (volverALlenar = false) => {
    // Validaciones
    if (!eventosInfecciosos.fe_evento || !eventosInfecciosos.tpInfeccion) {
        alert("Por favor complete los campos obligatorios (Fecha y Tipo).");
        return;
    }

    try {
        await postAllIpress("/eventosAccesosVasculares/", eventosInfecciosos);
        
        if (typeof ElMessage !== 'undefined') ElMessage.success("Evento registrado correctamente.");
        else alert("Evento registrado correctamente.");
        
        await fetchHistorialEventos(); 
        
        // Limpiar formulario
        Object.assign(eventosInfecciosos, {
            fe_evento: '',
            tpInfeccion: '',
            tratamientoIV: false,
            vancomicinaIV: false,
            hemocultivoPositivo: false,
            tipoGram: '',
            tpGermen: '',
            bacteria: '',
            observaciones: ''
        });
        
        if (!volverALlenar) {
            habilitado.value = false;
        }

    } catch (error) {
        console.error('Error al registrar:', error);
        alert("Ocurrió un error al guardar.");
    }
};

const fetchPaciente = async () => {
    try {
        const respuesta = await getAllIpress("/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;
    } catch (error) {
        console.error('Error al obtener Paciente:', error);
    }
};

const fetchPeriodo = async () => {
    try {
        const respuesta = await getAllIpress("/periodos/");
        periodos.value = respuesta;
    } catch (error) {
        console.error('Error al obtener Periodos:', error);
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
    fetchHistorialEventos(); 
});
</script>

<style scoped>
@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out;
}
</style>