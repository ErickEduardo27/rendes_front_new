<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
  
      <h2 class="text-xl font-semibold mb-1">EVENTOS INFECCIOSOS ASOCIADOS AL ACCESO DE DIÁLISIS</h2>
      
      <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id"
        class="border p-4 mb-4 rounded-lg shadow-sm">
        
        <h3 class="font-semibold text-lg mb-4">Evento Infeccioso #{{ index + 1 }}</h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block font-semibold text-sm text-gray-700">Fecha de Evento</label>
            <input v-model="evento.feEvento" type="date" class="w-full border rounded p-2 text-sm" />
          </div>
  
          <div class="space-y-2">
            <label class="block font-semibold text-sm text-gray-700">¿Tipo de Infección?</label>
            <select v-model="evento.tpInfeccion" class="w-full border rounded p-2 text-sm">
              <option value="">Seleccione una opción</option>
              <option value="1">Bacteremia</option>
              <option value="2">Local</option>
              <option value="4">Fungemia</option>
            </select>
          </div>
  
          <div class="flex flex-col lg:flex-row gap-4 w-full col-span-1 lg:col-span-2">
            
            <div class="flex-1 space-y-2">
              <label class="block font-semibold text-sm text-gray-700">Tratamiento antimicrobial IV</label>
              <div class="flex items-center gap-2">
                <span :class="!evento.tratamientoIV ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                <button @click="evento.tratamientoIV = !evento.tratamientoIV"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                  :class="evento.tratamientoIV ? 'bg-black' : 'bg-gray-300'">
                  <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                    :class="evento.tratamientoIV ? 'translate-x-6' : 'translate-x-1'" />
                </button>
                <span :class="evento.tratamientoIV ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
              </div>
            </div>
  
            <div class="flex-1 space-y-2">
              <label class="block font-semibold text-sm text-gray-700">Vancomicina IV</label>
              <div class="flex items-center gap-2">
                <span :class="!evento.vancomicinaIV ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                <button @click="evento.vancomicinaIV = !evento.vancomicinaIV"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                  :class="evento.vancomicinaIV ? 'bg-black' : 'bg-gray-300'">
                  <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                    :class="evento.vancomicinaIV ? 'translate-x-6' : 'translate-x-1'" />
                </button>
                <span :class="evento.vancomicinaIV ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
              </div>
            </div>
  
            <div class="flex-1 space-y-2">
              <label class="block font-semibold text-sm text-gray-700">Hemocultivo/cultivo positivo</label>
              <div class="flex items-center gap-2">
                <span :class="!evento.hemocultivoPositivo ? 'text-black font-semibold' : 'text-gray-400'">No</span>
                <button @click="evento.hemocultivoPositivo = !evento.hemocultivoPositivo"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                  :class="evento.hemocultivoPositivo ? 'bg-black' : 'bg-gray-300'">
                  <span class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
                    :class="evento.hemocultivoPositivo ? 'translate-x-6' : 'translate-x-1'" />
                </button>
                <span :class="evento.hemocultivoPositivo ? 'text-black font-semibold' : 'text-gray-400'">Sí</span>
              </div>
            </div>
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
              <option value="14">Hongos</option>
            </select>
          </div>
        </div>
  
        <div class="flex justify-end mt-4" v-if="eventosInfecciosos.length > 1">
          <button @click="removeEvento(index)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Eliminar Evento
          </button>
        </div>
      </div>
  
      <div class="flex-1 space-y-2 mt-6 border-t pt-4">
        <label class="block font-semibold text-sm text-gray-700">
          ¿La infección obligó a un cambio de acceso?
        </label>
  
        <div class="flex items-center gap-6 mt-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.obligoCambioAcceso" :value="true"
              class="w-4 h-4 text-black focus:ring-black border-gray-300">
            <span class="text-sm text-gray-700">Sí</span>
          </label>
  
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.obligoCambioAcceso" :value="false"
              class="w-4 h-4 text-black focus:ring-black border-gray-300">
            <span class="text-sm text-gray-700">No</span>
          </label>
        </div>
      </div>
  
      <button @click="guardarInfeccion"
        class="w-full bg-black text-white py-2 rounded hover:bg-gray-900 mt-8 transition-colors">
        Guardar
      </button>
    </div>
  </template>
  
  <script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; // Importar router
import { ElMessage } from 'element-plus'; // Importar notificaciones

// 1. Inicializar el Router
const router = useRouter();

const props = defineProps({ 
  habilitado: Boolean 
});

// 2. Variable reactiva para la pregunta "¿Obligó cambio de acceso?"
const form = reactive({
  obligoCambioAcceso: false // Inicializado en NO
});

// Datos de eventos infecciosos
const eventosInfecciosos = ref([
  {
    id: Date.now() + 1,
    feEvento: '',
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

// (Opcional) Array de Accesos si lo usas en otro lado
const accesosDialisis = ref([]);

const addEvento = () => {
  eventosInfecciosos.value.push({
    id: Date.now(),
    feEvento: '',
    accDialisis: '',
    tpInfeccion: '',
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tpGermen: '',
  });
};

const removeEvento = (index) => {
  eventosInfecciosos.value.splice(index, 1);
};

// --- FUNCIÓN GUARDAR CON REDIRECCIÓN ---
const guardarInfeccion = async () => {
  try {
    // 1. Validaciones básicas
    if (eventosInfecciosos.value.length > 0 && !eventosInfecciosos.value[0].feEvento) {
      ElMessage.warning('Por favor ingrese la fecha del evento infeccioso.');
      return;
    }

    // 2. Aquí va tu lógica de guardado al Backend (Axios/Fetch)
    // await api.post('/infecciones', { eventos: eventosInfecciosos.value, ...form });
    
    // Simulamos el guardado
    console.log("Datos Guardados:", eventosInfecciosos.value);
    console.log("¿Obligó cambio?:", form.obligoCambioAcceso);

    ElMessage.success('Infección registrada correctamente');

    // 3. Lógica de Redirección (AQUÍ ESTÁ LO QUE PEDISTE)
    if (form.obligoCambioAcceso === true) {
      
      // CASO SÍ: Redirigir a la página de Acceso de Diálisis
      // IMPORTANTE: Cambia '/accesos/nuevo' por la ruta real que tengas configurada en tu router/index.js
      router.push('/Form3Hemodialisis'); 
      
    } else {
      
      // CASO NO: Se queda en la pantalla o vuelve al listado
      console.log('Se mantiene en pantalla');
      // router.push('/lista-pacientes'); // Descomentar si quieres que vuelva al listado
    }

  } catch (error) {
    console.error(error);
    ElMessage.error('Error al guardar los datos');
  }
};
</script>