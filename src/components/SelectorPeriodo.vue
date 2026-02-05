<template>
  <div class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3 mb-6 transition-all duration-300">
    
    <div class="flex flex-wrap items-center justify-between gap-4">
      
      <div class="flex items-center gap-2 border-r border-gray-200 pr-4">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Periodo:</h2>
        
        <el-config-provider :locale="locale">
          <el-date-picker
            v-model="fechaVisual"
            type="month"
            placeholder="Seleccione mes"
            format="YYYY-MM"
            value-format="YYYY-MM"
            :editable="false"
            :clearable="false"
            style="width: 140px"
            :disabled-date="esFechaDeshabilitada" 
            @change="procesarCambioPeriodo"
          />
        </el-config-provider>
      </div>

      <div class="flex items-center gap-2 flex-1">
        <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Clínica:</h2>
        
        <el-select 
          v-model="clinicaSeleccionada"
          placeholder="Seleccione una Clínica"
          filterable
          clearable
          class="w-full max-w-md"
          @change="procesarCambioClinica"
        >
          <el-option
            v-for="item in listaClinicas"
            :key="item.id" 
            :label="item.nombre"
            :value="item.id"
          >
            <span style="float: left">{{ item.nombre }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.codigo }}</span>
          </el-option>
        </el-select>
      </div>

      </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { getAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage, ElConfigProvider } from 'element-plus';

// --- CONFIGURACIÓN DE IDIOMA ---
import es from 'element-plus/dist/locale/es.mjs'; 
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
dayjs.locale('es');

// PROPS Y EMITS
// Recibimos 'periodo' y 'clinica' desde el padre para sincronizar
const props = defineProps(['periodo', 'clinica']); 
const emit = defineEmits(['update:periodo', 'update:clinica', 'change']);

// VARIABLES
const locale = ref(es);
const periodos = ref([]);
const fechaVisual = ref('');

// Variables Nuevas para Clínicas
const listaClinicas = ref([]);
const clinicaSeleccionada = ref(null);

// ==========================================
// 1. LÓGICA DE PERIODO (Tu código original)
// ==========================================
const fetchPeriodos = async () => {
  try {
    const respuesta = await getAllIpress("/periodos/"); // Tu endpoint
    periodos.value = respuesta;
    sincronizarVisual(props.periodo); 
  } catch (error) {
    console.error("Error cargando periodos:", error);
  }
};

const esFechaDeshabilitada = (time) => {
  if (periodos.value.length === 0) return true;
  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, '0');
  const fechaCalendario = `${year}-${month}`;
  const existe = periodos.value.some(p => p.periodo === fechaCalendario);
  return !existe;
};

const procesarCambioPeriodo = (fecha) => {
  if (!fecha) return;
  const encontrado = periodos.value.find(p => p.periodo === fecha);
  
  if (encontrado) {
    emit('update:periodo', encontrado.id_periodo);
    // Emitimos evento general por si quieres guardar al instante
    emit('change', { tipo: 'periodo', valor: encontrado.id_periodo });
  } else {
    ElMessage.warning('El periodo seleccionado no está habilitado');
    setTimeout(() => {
        if(props.periodo) sincronizarVisual(props.periodo);
        else fechaVisual.value = '';
    }, 100);
  }
};

const sincronizarVisual = (id) => {
  if (id && periodos.value.length > 0) {
    const p = periodos.value.find(item => item.id_periodo === id);
    if (p) fechaVisual.value = p.periodo;
  }
};

// ==========================================
// 2. LÓGICA DE CLÍNICAS (Nuevo)
// ==========================================
const fetchClinicas = async () => {
    try {
        // Asumiendo que tienes un endpoint para listar todas las IPRESS/Clínicas
        // Si tu endpoint es diferente, cámbialo aquí.
        const respuesta = await getAllIpress("/ipress/"); 
        
        // Ajusta esto según cómo venga tu JSON (ej: respuesta.results o respuesta directo)
        listaClinicas.value = respuesta; 
        
        // Sincronizar valor inicial si viene por props
        if (props.clinica) {
            clinicaSeleccionada.value = props.clinica;
        }
    } catch (error) {
        console.error("Error cargando clínicas:", error);
        ElMessage.error("No se pudieron cargar las clínicas");
    }
};

const procesarCambioClinica = (valor) => {
    emit('update:clinica', valor);
    emit('change', { tipo: 'clinica', valor: valor });
};


// WATCHERS E INICIALIZACIÓN
watch(() => props.periodo, (newVal) => sincronizarVisual(newVal));
watch(() => props.clinica, (newVal) => clinicaSeleccionada.value = newVal);

onMounted(() => {
  fetchPeriodos();
  fetchClinicas(); // Cargamos las clínicas al iniciar
});
</script>