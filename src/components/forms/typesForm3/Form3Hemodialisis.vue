<!-- <template>
    <div v-if="habilitado" class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">

        <h2 class="text-xl font-semibold mb-1">ACCESO PARA DIÁLISIS</h2>
        <div v-for="(acceso, index) in accesosDialisis" :key="acceso.id" class="border p-4 mb-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-4">Acceso #{{ index + 1 }}</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Fecha de Colocación</label>
                    <input v-model="acceso.feColocacion" type="date" class="w-full border rounded p-2 text-sm" />
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Motivo de Cambio</label>
                    <select v-model="acceso.mvtCambio" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Positivo</option>
                        <option value="2">Negativo</option>
                        <option value="3">Desconocido</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                    <select v-model="acceso.accActual" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">FAV</option>
                        <option value="2">CVCT</option>
                        <option value="3">CVCLP</option>
                        <option value="4">Injerto autólogo</option>
                        <option value="5">Injerto protésico</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Ubicación</label>
                    <select v-model="acceso.ubicacion" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option v-for="ubi in getUbicacionesFiltradas(acceso.accActual)" :key="ubi.value"
                            :value="ubi.value">
                            {{ ubi.label }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end mt-4" v-if="accesosDialisis.length > 1">
                <button @click="removeAcceso(index)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Eliminar Acceso
                </button>
            </div>
        </div>
        <button @click="addAcceso" class="bg-white border border-black hover:text-white px-4 py-2 rounded hover:bg-black mt-4 ml-4 transform transition duration-300 hover:scale-105">
            + Agregar Otro Acceso
        </button>

        <hr class="my-8 border-gray-300" />

        <h2 class="text-xl font-semibold mb-1">EVENTOS INFECCIOSOS ASOCIADOS AL ACCESO DE DIÁLISIS</h2>
        <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id"
            class="border p-4 mb-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg mb-4">Evento Infeccioso #{{ index + 1 }}</h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">Fecha de Evento</label>
                    <input v-model="evento.fe_evento" type="date" class="w-full border rounded p-2 text-sm" />
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Acceso Actual?</label>
                    <select v-model="evento.accDialisis" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">FAV</option>
                        <option value="2">CVCT</option>
                        <option value="3">CVCLP</option>
                        <option value="4">Injerto autólogo</option>
                        <option value="5">Injerto protésico</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Infección?</label>
                    <select v-model="evento.tpInfeccion" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Bacteriana asociada a CVC</option>
                        <option value="2">Infección de orificio de salida</option>
                        <option value="3">Infección del túnel</option>
                        <option value="4">Peritonitis</option>
                    </select>
                </div>

                <div class="flex flex-col lg:flex-row gap-4 w-full col-span-1 lg:col-span-2">
                    <div class="flex-1 space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">
                            Tratamiento antimicrobial IV
                        </label>
                        <div class="flex items-center gap-2">
                            <span
                                :class="!evento.tratamientoIV ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                            <button @click="evento.tratamientoIV = !evento.tratamientoIV"
                                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                                :class="evento.tratamientoIV ? 'bg-black' : 'bg-gray-300'">
                                <span
                                    class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                                    :class="evento.tratamientoIV ? 'translate-x-6' : 'translate-x-1'" />
                            </button>
                            <span :class="evento.tratamientoIV ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
                        </div>
                    </div>

                    <div class="flex-1 space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">
                            Vancomicina IV
                        </label>
                        <div class="flex items-center gap-2">
                            <span
                                :class="!evento.vancomicinaIV ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                            <button @click="evento.vancomicinaIV = !evento.vancomicinaIV"
                                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                                :class="evento.vancomicinaIV ? 'bg-black' : 'bg-gray-300'">
                                <span
                                    class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                                    :class="evento.vancomicinaIV ? 'translate-x-6' : 'translate-x-1'" />
                            </button>
                            <span :class="evento.vancomicinaIV ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
                        </div>
                    </div>

                    <div class="flex-1 space-y-2">
                        <label class="block font-semibold text-sm text-gray-700">
                            Hemocultivo positivo
                        </label>
                        <div class="flex items-center gap-2">
                            <span
                                :class="!evento.hemocultivoPositivo ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                            <button @click="evento.hemocultivoPositivo = !evento.hemocultivoPositivo"
                                class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                                :class="evento.hemocultivoPositivo ? 'bg-black' : 'bg-gray-300'">
                                <span
                                    class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                                    :class="evento.hemocultivoPositivo ? 'translate-x-6' : 'translate-x-1'" />
                            </button>
                            <span
                                :class="evento.hemocultivoPositivo ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
                        </div>
                        <div class="space-y-2 mt-4" v-if="evento.hemocultivoPositivo">
                            <label class="block font-semibold text-sm text-gray-700">Tipo</label>
                            <select v-model="evento.tipoGram" class="w-full border rounded p-2 text-sm">
                                <option value="">Seleccione una opción</option>
                                <option value="gramPositivo">GramPositivo (+)</option>
                                <option value="gramNegativo">GramNegativo (-)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Bacteria?</label>
                    <select v-model="evento.bacteria" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1"></option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Infección?</label>
                    <select v-model="evento.tpInfeccion2" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Pus</option>
                        <option value="2">Enrojecimiento</option>
                        <option value="3">Aumento de volumen en el lugar de AV</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block font-semibold text-sm text-gray-700">¿Tipo de Germen?</label>
                    <select v-model="evento.tpGermen" class="w-full border rounded p-2 text-sm">
                        <option value="">Seleccione una opción</option>
                        <option value="1">Staphylococcus aureus</option>
                        <option value="2">Staphylococcus epidermidis</option>
                        <option value="3">Escherichia coli</option>
                        <option value="4">Enterobacter cloacae</option>
                        <option value="5">Pseudomonas aeruginosa</option>
                        <option value="6">Klebsiella oxytoca</option>
                        <option value="7">Enterobacter aerogenes</option>
                        <option value="8">Proteus mirabilis</option>
                        <option value="9">Enterobacter hormaechei</option>
                        <option value="10">Staphylococcus haemolyticus</option>
                        <option value="11">Staphylococcus especies</option>
                        <option value="12">Stenotrophomona maltophilia</option>
                        <option value="13">Acinetobacter baumannii</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end mt-4" v-if="eventosInfecciosos.length > 1">
                <button @click="removeEvento(index)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Eliminar Evento
                </button>
            </div>
        </div>
        <button @click="addEvento" class="bg-white border border-black hover:text-white px-4 py-2 rounded hover:bg-black mt-4 ml-4 transform transition duration-300 hover:scale-105">
            + Agregar Otro Evento Infeccioso
        </button>

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900 mt-8">
            💾 Guardar Unidad Actual
        </button>
    </div>
    <div v-else class="text-gray-500 italic text-sm">
        Este formulario está deshabilitado porque el paciente no presenta infecciones.
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    habilitado: Boolean,
});

const datosUbicaciones = {
    '1': [ // FAV
        { value: 'izq_radial', label: 'Izquierda Radial' },
        { value: 'der_radial', label: 'Derecha Radial' },
        { value: 'der_braquial_cubi', label: 'Braquial o cubital derecha' },
        { value: 'izq_braquial_cubi', label: 'Braquial o cubital izquierdo' },
    ],
    '2': [ // CVCT 
        { value: 'yugular_izq_temp', label: 'Yugular Izquierda' },
        { value: 'yugular_der_temp', label: 'Yugular Derecha' },
        { value: 'subclavia_izq_temp', label: 'Subclavia Izquierda' },
        { value: 'subclavia_der_temp', label: 'Subclavia Derecha' },
        { value: 'femoral_izq_temp', label: 'Femoral Izquierda' },
        { value: 'femoral_der_temp', label: 'Femoral Derecha' },
        { value: 'otra_cvct', label: 'Otra CVCT' },
    ],
    '3': [ // CVCLP
        { value: 'yugular_izq', label: 'Yugular Izquierda' },
        { value: 'yugular_der', label: 'Yugular Derecha' },
        { value: 'subclavia_izq', label: 'Subclavia Izquierda' },
        { value: 'subclavia_der', label: 'Subclavia Derecha' },
        { value: 'femoral_izq', label: 'Femoral Izquierda' },
        { value: 'femoral_der', label: 'Femoral Derecha' },
        { value: 'otra_cvcp', label: 'Otra CVCP' },
    ],
    '4': [ // Injerto autólogo
        { value: 'injer_autologo', label: 'Injerto autólogo' },
    ],
    '5': [ // Injerto protésico
        { value: 'injer_protesico', label: 'Injerto protésico' },
    ]
};


const accesosDialisis = ref([
    {
        id: Date.now(), 
        feColocacion: '',
        mvtCambio: '',
        accActual: '',
        ubicacion: '',
    }
]);


const eventosInfecciosos = ref([
    {
        id: Date.now() + 1, 
        fe_evento: '',
        accDialisis: '',
        tpInfeccion: '',
        tratamientoIV: false,
        vancomicinaIV: false,
        hemocultivoPositivo: false,
        tipoGram: '',
        bacteria: '',
        tpInfeccion2: '',
        tpGermen: '',
    }
]);


const addAcceso = () => {
    accesosDialisis.value.push({
        id: Date.now(),
        feColocacion: '',
        mvtCambio: '',
        accActual: '',
        ubicacion: '',
    });
};

const removeAcceso = (index) => {
    accesosDialisis.value.splice(index, 1);
};

const addEvento = () => {
    eventosInfecciosos.value.push({
        id: Date.now(), 
        fe_evento: '',
        accDialisis: '',
        tpInfeccion: '',
        tratamientoIV: false,
        vancomicinaIV: false,
        hemocultivoPositivo: false,
        tipoGram: '',
        bacteria: '',
        tpInfeccion2: '',
        tpGermen: '',
    });
};

const removeEvento = (index) => {
    eventosInfecciosos.value.splice(index, 1);
};

const getUbicacionesFiltradas = (accActualValue) => {
    return datosUbicaciones[accActualValue] || [];
};

</script> -->


<!-- <template>
  <div class="space-y-4 max-h-[700px] overflow-y-auto pr-2 mt-2">
    
    <div class="flex items-center gap-2">
      <input id="presentoInfeccion" type="checkbox" v-model="habilitado" />
      <label for="presentoInfeccion" class="text-sm font-semibold text-gray-700">
        Si
      </label>
    </div>

    <div v-if="habilitado">
      <h2 class="text-xl font-semibold mt-4">Eventos Infecciosos Asociados al Acceso de Diálisis</h2>

      <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id" class="border p-4 mb-4 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700">Fecha de Evento</label>
            <input v-model="evento.fe_evento" type="date" class="w-full border rounded p-2 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Tipo de Infección</label>
            <select v-model="evento.tpInfeccion" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Bacteriana asociada a CVC</option>
              <option value="2">Infección de orificio de salida</option>
              <option value="3">Infección del túnel</option>
              <option value="4">Peritonitis</option>
            </select>
          </div>
        </div>

        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">Inicio de Tratamiento Antimicrobiano IV</label>
            <input type="checkbox" v-model="evento.tratamientoIV" />
          </div>
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">Inicio de Vancomicina IV</label>
            <input type="checkbox" v-model="evento.vancomicinaIV" />
          </div>
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700">Hemocultivo Positivo</label>
            <input type="checkbox" v-model="evento.hemocultivoPositivo" />
          </div>
        </div>

        <div v-if="evento.hemocultivoPositivo" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700">Tipo</label>
          <select v-model="evento.tipoGram" class="w-full border rounded p-2 text-sm">
            <option value="">Seleccione una opción</option>
            <option value="gramPositivo">GramPositivo (+)</option>
            <option value="gramNegativo">GramNegativo (-)</option>
          </select>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div>
            <label class="block text-sm font-semibold text-gray-700">Tipo de Germen</label>
            <select v-model="evento.tpGermen" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Staphylococcus aureus</option>
              <option value="2">Staphylococcus epidermidis</option>
              
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Bacteria</label>
            <select v-model="evento.bacteria" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Gram +</option>
              <option value="2">Gram -</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700">Tipo</label>
            <select v-model="evento.tipoBacteria" :disabled="!evento.bacteria" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1" v-if="evento.bacteria === '1'">Estreptococo</option>
              <option value="2" v-if="evento.bacteria === '2'">E. coli</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const habilitado = ref(false)

const eventosInfecciosos = ref([
  {
    id: Date.now(),
    fe_evento: '',
    tpInfeccion: '',
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tipoGram: '',
    tipoInfeccionLocal: '',
    tpGermen: '',
    bacteria: '',
    tipoBacteria: ''
  }
])
</script>
 -->

<template>
    <div class="p-6 space-y-6">
        <!-- Botón de regreso -->
        <div class="flex items-center text-sm cursor-pointer text-gray-600 hover:underline" @click="$emit('cancelar')">
            ← Volver al inicio
        </div>

        <!-- Filtros Superiores -->
        <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-lg font-semibold">Periodo de Reporte:</h2>
            <select v-model="periodoSeleccionado" class="border p-1 rounded" :disabled="true">
                <option v-for="per in periodos" :key="per.id_periodo" :value="per.id_periodo">{{ per.periodo }}</option>
            </select>

            <label>Clínica:</label>
            <label>{{ paciente.ipress }}</label>

            <label>Modalidad de Diálisis:</label>
            <label>{{ pacienteSeleccionado.id_modalidad == 1 ? "Hemodialisis" : "Peritonial" }}</label>
        </div>

        <!-- Contenedor principal en columnas -->
        <div class="flex gap-6 mt-6">
            <!-- Contenido principal -->
            <div class="flex-1 space-y-6">
                <div class="space-y-4 max-h-[700px] overflow-y-auto pr-2 mt-2">
                    <!-- PREGUNTA INICIAL -->
                    <div style="width: 20rem;">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">
                            ¿Ha presentado algún evento de infección?
                        </label>
                        <select v-model="habilitado" class="w-full border rounded p-2 text-sm">
                            <option :value="false">No</option>
                            <option :value="true">Sí</option>
                        </select>
                    </div>

                    <div v-if="habilitado">
                        <h2 class="text-xl font-semibold mt-4">Eventos Infecciosos Asociados al Acceso de Diálisis</h2>

                        <div class="border p-4 mb-4 rounded-lg shadow-sm">
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

                            <!-- SWITCHES -->
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700">Inicio de Tratamiento
                                        Antimicrobiano IV</label>
                                    <input type="checkbox" v-model="eventosInfecciosos.tratamientoIV" />
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700">Inicio de Vancomicina IV</label>
                                    <input type="checkbox" v-model="eventosInfecciosos.vancomicinaIV" />
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="text-sm font-medium text-gray-700">Hemocultivo Positivo</label>
                                    <input type="checkbox" v-model="eventosInfecciosos.hemocultivoPositivo"
                                        @click="prueba" />
                                </div>
                            </div>
                            <div v-if="eventosInfecciosos.hemocultivoPositivo">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Tipo</label>
                                        <select v-model="eventosInfecciosos.tipoGram"
                                            class="w-full border rounded p-2 text-sm">
                                            <option value="">Seleccione una opción</option>
                                            <option value="Pus">Pus</option>
                                            <option value="Enrojecimiento">Enrojecimiento</option>
                                            <option value="Aumento de volumen en el lugar de AV.">Aumento de volumen en
                                                el
                                                lugar de AV.</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Tipo de Germen</label>
                                        <select v-model="eventosInfecciosos.tpGermen"
                                            class="w-full border rounded p-2 text-sm">
                                            <option value="">Seleccione una opción</option>
                                            <option value="1">Staphylococcus aureus</option>
                                            <option value="2">Staphylococcus epidermidis</option>
                                            <option value="3">Escherichia coli</option>
                                            <option value="4">Serratia marcescens</option>
                                            <option value="5">Klebsiella pneumoniae</option>
                                            <option value="6">Enterobacter cloacae</option>
                                            <option value="7">Pseudomonas aeruginosa</option>
                                            <option value="8">Klebsiella oxytoca</option>
                                            <option value="9">Enterobacter aerogenes</option>
                                            <option value="10">Proteus mirabilis</option>
                                            <option value="11">Enterobacter hormaechei</option>
                                            <option value="12">Staphylococcus haemolyticus</option>
                                            <option value="13">Staphylococcus especies</option>
                                            <option value="14">Stenotrophomona maltophilia</option>
                                            <option value="15">Acinetobacter baumannii</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700">Bacteria</label>
                                        <select v-model="eventosInfecciosos.bacteria"
                                            class="w-full border rounded p-2 text-sm">
                                            <option value="">Seleccione una opción</option>
                                            <option value="1">Gram +</option>
                                            <option value="2">Gram -</option>
                                        </select>
                                    </div>
                                    <div class="mb-4">
                                        <label class="block text-sm font-semibold text-gray-700">Observaciones</label>
                                        <input v-model="eventosInfecciosos.observaciones" type="text"
                                            class="w-full border rounded p-2 text-sm" />
                                    </div>
                                </div>
                            </div>
                            <!-- Botones -->
                            <div class="flex justify-end gap-2">
                                <button class="bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm">Cancelar</button>
                                <button class="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                                    @click="postForm()">Registrar</button>
                                <button class="bg-blue-500 text-white px-4 py-2 rounded text-sm">Registrar y Volver a
                                    Llenar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Perfil del paciente al costado -->
            <div class="w-80 p-4 border rounded shadow" v-if="pacienteSeleccionado.value">
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
                    <li><strong>Estado:</strong> Nuevo</li>
                    <li><strong>Fecha de Ingreso:</strong> 15/06/2025</li>
                </ul>
               <!--  <div class="mt-4">
                    <label class="text-sm font-medium">Historial de Registros</label>
                    <select class="w-full border px-2 py-1 rounded">
                        <option>Registro 1</option>
                    </select>
                </div> -->
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { getAllIpress, postAllIpress } from "@/services/ipress/Ipress.service";

// 👇 defineProps debe estar fuera de cualquier función
const { paciente, periodo } = defineProps({
    paciente: {
        type: Object,
        required: true
    },
    periodo: {
        type: Number,
        required: true
    }
})
const pacienteSeleccionado = paciente
const periodoSeleccionado = periodo

const periodos = ref([])
const postForm = async (url = null) => {
    try {
        const respuesta = await postAllIpress(url ?? "/eventosAccesosVasculares/", eventosInfecciosos);
        alert("Se registro con exito")
        window.location.reload()

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};
const fetchPaciente = async (url = null) => {
    try {
        const respuesta = await getAllIpress(url ?? "/pacientes/" + paciente.id_paciente);
        pacienteSeleccionado.value = respuesta;

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};
const fetchPeriodo = async (url = null) => {
    try {
        const respuesta = await getAllIpress(url ?? "/periodos/");
        periodos.value = respuesta;

    } catch (error) {
        console.error('Error al obtener IPRESS:', error);
    }
};
const habilitado = ref(false)
const mes = 'JULIO'
const anio = '2025'
const clinicas = ['DA VIDA SAC.', 'NEFROLOGÍA S.A.C.', 'CLÍNICA DE RENALIS']
const clinicaSeleccionada = clinicas[0]
const modalidad = 'Hemodiálisis'


function prueba() {
    console.log("pruebaaaa", eventosInfecciosos.hemocultivoPositivo)
}
const eventosInfecciosos =
    reactive({
        fe_evento: '',
        tpInfeccion: '',
        tratamientoIV: false,
        vancomicinaIV: false,
        hemocultivoPositivo: false,
        tipoGram: '',
        tipoInfeccionLocal: '',
        tpGermen: '',
        bacteria: '',
        tipoBacteria: '',
        observaciones: '',
        id_periodo_ipress: 17,
        id_red: 1,
        id_paciente: paciente.id_paciente
    })

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
});

</script>