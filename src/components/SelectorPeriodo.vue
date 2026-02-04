<template>
    <div class="flex items-center gap-2">
      <h2 class="text-sm font-semibold text-gray-700">Periodo de Reporte:</h2>
      
      <el-config-provider :locale="locale">
        <el-date-picker
          v-model="fechaVisual"
          type="month"
          placeholder="Seleccione mes"
          format="YYYY-MM"
          value-format="YYYY-MM"
          :editable="false"
          :clearable="false"
          style="width: 160px"
          :disabled-date="esFechaDeshabilitada" 
          @change="procesarCambio"
        />
      </el-config-provider>
  
    </div>
  </template>
  
  <script setup>
import { ref, watch, onMounted } from 'vue';
import { getAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage } from 'element-plus';

// --- CONFIGURACIÓN DE IDIOMA (SOLUCIÓN DEFINITIVA) ---
import { ElConfigProvider } from 'element-plus';

// 1. Usamos la ruta 'dist' que suele funcionar mejor en Vite/WebPack cuando falla la normal
import es from 'element-plus/dist/locale/es.mjs'; 

// 2. Configuración profunda de Day.js (Núcleo de fechas)
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Cargar fichero de español
dayjs.locale('es');       // Forzar español globalmente

// Props y Emits
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'change']);

// Variables
const periodos = ref([]);
const fechaVisual = ref('');
const locale = ref(es); // Hacemos reactivo el idioma por seguridad

// 1. Cargar la lista de periodos desde la API
const fetchPeriodos = async () => {
  try {
    const respuesta = await getAllIpress("/periodos/");
    periodos.value = respuesta;
    sincronizarVisual(props.modelValue); 
  } catch (error) {
    console.error("Error cargando periodos:", error);
  }
};


// --- LÓGICA VISUAL DEL CALENDARIO ---
const esFechaDeshabilitada = (time) => {
  if (periodos.value.length === 0) return true;

  const year = time.getFullYear();
  const month = String(time.getMonth() + 1).padStart(2, '0');
  const fechaCalendario = `${year}-${month}`;

  // Si existe en la lista, NO deshabilitar (false). Si no, deshabilitar (true).
  const existe = periodos.value.some(p => p.periodo === fechaCalendario);
  return !existe;
};

const procesarCambio = (fecha) => {
  if (!fecha) return;
  
  // Buscar el periodo exacto
  const encontrado = periodos.value.find(p => p.periodo === fecha);
  
  if (encontrado) {
    emit('update:modelValue', encontrado.id_periodo);
    emit('change', encontrado.id_periodo);
  } else {
    ElMessage.warning('El periodo seleccionado no está habilitado');
    // Limpiar visualmente si fue inválido
    setTimeout(() => {
        if(props.modelValue) sincronizarVisual(props.modelValue);
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

watch(() => props.modelValue, (newVal) => {
  sincronizarVisual(newVal);
});

onMounted(() => {
  fetchPeriodos();
});
</script>