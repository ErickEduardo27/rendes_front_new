<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden">
    <div class="flex-1 flex flex-col h-full relative w-full overflow-hidden">
      
      <header class="flex-none bg-white border-b border-slate-200 shadow-sm z-20 px-6 py-4">
        
        <div class="mb-4">
          <button @click="irAlInicio" class="flex items-center gap-2 text-slate-500 hover:text-cyan-700 font-bold text-sm transition-colors group">
            <div class="bg-slate-100 group-hover:bg-cyan-50 p-1.5 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </div>
            Volver al Inicio
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-2 border-r border-slate-200 pr-6">
            <h2 class="text-xs font-bold text-slate-500 uppercase tracking-wide">Periodo:</h2>
            <el-config-provider :locale="locale">
              <el-date-picker
                v-model="fechaVisual"
                type="month"
                placeholder="Mes"
                format="YYYY-MM"
                value-format="YYYY-MM"
                :editable="false"
                :clearable="false"
                class="!w-32" 
                @change="procesarCambioPeriodo"
              />
            </el-config-provider>
          </div>
  
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-bold text-slate-500 uppercase tracking-wide">Clínica:</h2>
            <el-select 
              v-model="clinicaSeleccionada"
              placeholder="Seleccione clínica"
              filterable
              clearable
              class="!w-[280px]"
              @change="procesarCambioClinica"
            >
              <el-option
                v-for="item in listaClinicas"
                :key="item.id" 
                :label="item.nombre"
                :value="item.id"
              >
                <span style="float: left">{{ item.nombre }}</span>
                <span style="float: right; color: #8492a6; font-size: 12px; margin-left: 10px">{{ item.codigo }}</span>
              </el-option>
            </el-select>
          </div>
  
          <div class="flex items-center gap-2 border-l border-slate-200 pl-6">
            <h2 class="text-xs font-bold text-slate-500 uppercase tracking-wide">Modalidad:</h2>
            <el-select 
              v-model="modalidadSeleccionada"
              placeholder="Todas"
              clearable
              class="!w-36"
              @change="procesarCambioModalidad"
            >
              <el-option label="Hemodiálisis" value="HEMO" />
              <el-option label="Diálisis Peritoneal" value="DP" />
            </el-select>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6 w-full custom-scrollbar">
        <div class="max-w-7xl mx-auto space-y-6 pb-10">

          <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-base font-bold text-slate-800">Evento de Infección</h2>
              <p class="text-sm text-slate-500">¿El paciente presentó algún evento infeccioso en este periodo?</p>
            </div>
            
            <div class="flex gap-3">
               <label class="cursor-pointer">
                  <input type="radio" v-model="tieneInfeccion" :value="false" class="peer sr-only">
                  <div class="px-5 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-bold transition-all
                              peer-checked:bg-slate-700 peer-checked:text-white peer-checked:border-slate-700 peer-checked:shadow-md
                              hover:bg-slate-50 flex items-center gap-2 min-w-[100px] justify-center">
                     NO
                  </div>
               </label>

               <label class="cursor-pointer">
                  <input type="radio" v-model="tieneInfeccion" :value="true" class="peer sr-only">
                  <div class="px-5 py-2 rounded-lg border border-cyan-300 text-cyan-700 text-sm font-bold transition-all
                              peer-checked:bg-cyan-600 peer-checked:text-white peer-checked:border-cyan-600 peer-checked:shadow-md
                              hover:bg-cyan-50 flex items-center gap-2 min-w-[120px] justify-center">
                     SÍ, Registrar
                  </div>
               </label>
            </div>
          </div>

          <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
            <div v-if="tieneInfeccion" class="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              
              <div class="bg-cyan-600 px-6 py-4 flex justify-between items-center">
                <h3 class="text-white font-bold text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Eventos Infecciosos Asociados al Acceso de Diálisis
                </h3>
              </div>

              <div class="p-6 space-y-8">
                <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id" class="relative">
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="space-y-1">
                      <label class="block text-xs font-bold text-slate-500 uppercase">Fecha de Evento</label>
                      <input v-model="evento.feEvento" type="date" class="w-full border border-slate-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-700 bg-white" />
                    </div>

                    <div class="space-y-1 lg:col-span-3">
                       <label class="block text-xs font-bold text-slate-500 uppercase">Tipo de Infección</label>
                       <select v-model="evento.tpInfeccion" @change="resetearHemocultivo(index)" 
                         class="w-full border border-slate-300 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 text-slate-700">
                         <option value="">Seleccione...</option>
                         <option value="1">Bacteremia</option>
                         <option value="2">Local</option>
                         <option value="4">Fungemia</option>
                       </select>
                    </div>

                    <div class="lg:col-span-4 bg-slate-50 rounded-lg p-4 flex flex-wrap gap-x-12 gap-y-4 border border-slate-100">
                       
                       <div class="flex items-center gap-3">
                         <span class="text-sm font-semibold text-slate-700">Trat. Antimicrobial IV</span>
                         <button @click="evento.tratamientoIV = !evento.tratamientoIV"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.tratamientoIV ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.tratamientoIV ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-xs font-bold uppercase" :class="evento.tratamientoIV ? 'text-cyan-700' : 'text-slate-400'">{{ evento.tratamientoIV ? 'SÍ' : 'NO' }}</span>
                       </div>

                       <div class="flex items-center gap-3">
                         <span class="text-sm font-semibold text-slate-700">Vancomicina IV</span>
                         <button @click="evento.vancomicinaIV = !evento.vancomicinaIV"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.vancomicinaIV ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.vancomicinaIV ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-xs font-bold uppercase" :class="evento.vancomicinaIV ? 'text-cyan-700' : 'text-slate-400'">{{ evento.vancomicinaIV ? 'SÍ' : 'NO' }}</span>
                       </div>

                       <div class="flex items-center gap-3">
                         <span class="text-sm font-semibold text-slate-700">
                           {{ evento.tpInfeccion === '2' ? 'Cultivo (+)' : 'Hemocultivo (+)' }}
                         </span>
                         <button @click="toggleHemocultivo(evento, index)"
                           class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                           :class="evento.hemocultivoPositivo ? 'bg-cyan-600' : 'bg-slate-300'">
                           <span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                             :class="evento.hemocultivoPositivo ? 'translate-x-5' : 'translate-x-1'" />
                         </button>
                         <span class="text-xs font-bold uppercase" :class="evento.hemocultivoPositivo ? 'text-cyan-700' : 'text-slate-400'">{{ evento.hemocultivoPositivo ? 'SÍ' : 'NO' }}</span>
                       </div>
                    </div>

                    <div v-if="evento.hemocultivoPositivo" class="lg:col-span-4 animate-fadeIn">
                       <div class="bg-cyan-50 border border-cyan-100 rounded-lg p-3 flex items-center gap-4">
                          <label class="text-sm font-bold text-cyan-800 whitespace-nowrap">Germen Identificado:</label>
                          <select v-model="evento.tpGermen" class="w-full bg-transparent border-0 text-sm font-medium text-cyan-900 focus:ring-0 cursor-pointer">
                            <option value="">-- Seleccione --</option>
                            <option v-for="germen in getOpcionesGermenes(evento.tpInfeccion)" :key="germen.value" :value="germen.value">{{ germen.label }}</option>
                          </select>
                       </div>
                    </div>

                    <div class="lg:col-span-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                       <div>
                         <p class="text-sm font-bold text-slate-700">Impacto en el Acceso Vascular</p>
                         <p class="text-xs text-slate-500">¿Esta infección obligó a realizar un cambio de acceso?</p>
                       </div>
                       <div class="flex gap-3">
                          <label class="cursor-pointer">
                             <input type="radio" v-model="form.obligoCambioAcceso" :value="false" class="peer sr-only">
                             <div class="px-4 py-2 rounded-md border border-slate-300 text-slate-500 text-xs font-bold transition-all peer-checked:bg-slate-600 peer-checked:text-white peer-checked:border-slate-600 hover:bg-slate-50">
                                NO, se mantuvo
                             </div>
                          </label>
                          <label class="cursor-pointer">
                             <input type="radio" v-model="form.obligoCambioAcceso" :value="true" class="peer sr-only">
                             <div class="px-4 py-2 rounded-md border border-slate-300 text-slate-500 text-xs font-bold transition-all peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500 hover:bg-red-50">
                                SÍ, hubo cambio
                             </div>
                          </label>
                       </div>
                    </div>

                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button @click="guardarInfeccion" class="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-md transition-colors flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Guardar Registro
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 class="text-slate-700 font-bold text-sm uppercase tracking-wide">Historial de Infecciones del Periodo</h3>
              <span class="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{{ historialInfecciones.length }} Registros</span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left text-slate-600">
                <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-3 font-bold">Fecha</th>
                    <th class="px-6 py-3 font-bold">Tipo Infección</th>
                    <th class="px-6 py-3 font-bold">Germen</th>
                    <th class="px-6 py-3 font-bold text-center">Hemocultivo</th>
                    <th class="px-6 py-3 font-bold text-center">Cambio Acceso</th>
                    <th class="px-6 py-3 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="historialInfecciones.length === 0">
                    <td colspan="6" class="px-6 py-8 text-center text-slate-400 italic">No hay infecciones registradas en este periodo.</td>
                  </tr>
                  <tr v-for="(item, index) in historialInfecciones" :key="index" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-800">{{ item.feEvento }}</td>
                    <td class="px-6 py-4">
                      <span v-if="item.tpInfeccion === '1'">Bacteremia</span>
                      <span v-else-if="item.tpInfeccion === '2'">Local</span>
                      <span v-else-if="item.tpInfeccion === '4'">Fungemia</span>
                    </td>
                    <td class="px-6 py-4 italic text-slate-500">{{ getNombreGermen(item.tpGermen) || '-' }}</td>
                    <td class="px-6 py-4 text-center">
                      <span v-if="item.hemocultivoPositivo" class="text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded">POS (+)</span>
                      <span v-else class="text-slate-400 text-xs">NEG (-)</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                       <span v-if="item.obligoCambioAcceso" class="text-red-600 font-bold">SÍ</span>
                       <span v-else class="text-slate-400">NO</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button @click="eliminarDelHistorial(index)" class="text-red-400 hover:text-red-600 transition-colors p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import { ElMessage, ElConfigProvider } from 'element-plus'; 
import { getAllIpress } from "@/services/ipress/Ipress.service"; 
import es from 'element-plus/dist/locale/es.mjs'; 
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
dayjs.locale('es');

const router = useRouter();
const locale = ref(es);
const periodos = ref([]);
const fechaVisual = ref('');
const listaClinicas = ref([]);
const clinicaSeleccionada = ref(null);
const modalidadSeleccionada = ref(null);

const tieneInfeccion = ref(null); 
const form = reactive({ obligoCambioAcceso: false });
const historialInfecciones = ref([]); // Lista para el historial

const eventosInfecciosos = ref([
  {
    id: Date.now(),
    feEvento: '',
    tpInfeccion: '',
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tpGermen: '',
  }
]);

const opcionesGermenes = [
  { value: '1', label: 'Staphylococcus aureus' },
  { value: '2', label: 'Staphylococcus epidermidis' },
  { value: '3', label: 'Escherichia coli' },
  { value: '4', label: 'Enterobacter cloacae' },
  { value: '5', label: 'Pseudomonas aeruginosa' },
  { value: '6', label: 'Klebsiella oxytoca' },
  { value: '7', label: 'Enterobacter aerogenes' },
  { value: '8', label: 'Proteus mirabilis' },
  { value: '9', label: 'Enterobacter hormaechei' },
  { value: '10', label: 'Staphylococcus haemolyticus' },
  { value: '11', label: 'Staphylococcus especies' },
  { value: '12', label: 'Stenotrophomona maltophilia' },
  { value: '13', label: 'Acinetobacter baumannii' },
  { value: '14', label: 'Hongos' }
];

const getOpcionesGermenes = (tipoInfeccion) => {
  if (tipoInfeccion === '4') return opcionesGermenes.filter(g => g.value === '14'); 
  return opcionesGermenes.filter(g => g.value !== '14'); 
};

const getNombreGermen = (valor) => {
  const g = opcionesGermenes.find(op => op.value === valor);
  return g ? g.label : '';
};

// Opción recomendada: router.back()
const irAlInicio = () => {
  router.back(); 
};

const resetearHemocultivo = (index) => {
  if (eventosInfecciosos.value[index]) {
    const evento = eventosInfecciosos.value[index];
    evento.hemocultivoPositivo = false;
    evento.tpGermen = '';
  }
};

const toggleHemocultivo = (evento, index) => {
  evento.hemocultivoPositivo = !evento.hemocultivoPositivo;
  if (!evento.hemocultivoPositivo) evento.tpGermen = '';
};

const guardarInfeccion = async () => {
  try {
    const eventoActual = eventosInfecciosos.value[0];
    
    if (!eventoActual.feEvento || !eventoActual.tpInfeccion) {
      ElMessage.warning('Complete la fecha y el tipo de infección.');
      return;
    }

    // Agregar al historial
    historialInfecciones.value.push({
      ...eventoActual,
      obligoCambioAcceso: form.obligoCambioAcceso
    });

    ElMessage.success('Infección registrada en el historial.');

    // Resetear formulario para nueva carga si se desea
    tieneInfeccion.value = false;
    eventosInfecciosos.value = [{
      id: Date.now(),
      feEvento: '',
      tpInfeccion: '',
      tratamientoIV: false,
      vancomicinaIV: false,
      hemocultivoPositivo: false,
      tpGermen: '',
    }];
    form.obligoCambioAcceso = false;

    if (form.obligoCambioAcceso === true) {
      ElMessage.info('Redirigiendo al formulario de Acceso...');
      router.push('/Form3Hemodialisis'); 
    } 
  } catch (error) {
    ElMessage.error('Error al guardar');
  }
};

const eliminarDelHistorial = (index) => {
  historialInfecciones.value.splice(index, 1);
  ElMessage.success('Registro eliminado del historial.');
};

// ... Fetch functions (fetchPeriodos, fetchClinicas) se mantienen igual ...
// Solo asegúrate de llamarlas en onMounted

onMounted(() => {
    // Llama a tus fetch aquí
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
</style>