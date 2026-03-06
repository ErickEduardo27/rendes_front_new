<template>
  <div class="flex flex-wrap items-center gap-4">
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

    <div class="flex items-center gap-2 flex-1 min-w-0">
      <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide shrink-0">Clínica:</h2>
      <el-select
        v-model="clinicaSeleccionada"
        placeholder="Seleccione una Clínica"
        filterable
        clearable
        class="w-full max-w-xs"
        @change="procesarCambioClinica"
      >
        <el-option
          v-for="item in listaClinicas"
          :key="item.id_ipress"
          :label="item.nombre_corto || item.ipress"
          :value="item.id_ipress"
        >
          <span style="float: left">{{ item.nombre_corto || item.ipress }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ipress }}</span>
        </el-option>
      </el-select>
    </div>

    <div class="flex items-center gap-2 border-l border-gray-200 pl-4">
      <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide shrink-0">Modalidad:</h2>
      <el-select
        v-model="modalidadSeleccionada"
        placeholder="Todas"
        clearable
        filterable
        style="width: 180px"
        @change="procesarCambioModalidad"
      >
        <el-option
          v-for="m in listaModalidades"
          :key="m.id_modalidad"
          :label="m.modalidad"
          :value="m.id_modalidad"
        />
      </el-select>
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
const props = defineProps(['periodo', 'clinica', 'modalidad']);
const emit = defineEmits(['update:periodo', 'update:clinica', 'update:modalidad', 'change']);

// VARIABLES
const locale = ref(es);
const periodos = ref([]);
const fechaVisual = ref('');

const listaClinicas = ref([]);
const clinicaSeleccionada = ref(null);
const listaModalidades = ref([]);
const modalidadSeleccionada = ref(null);

// ==========================================
// 1. LÓGICA DE PERIODO (Tu código original)
// ==========================================
const fetchPeriodos = async () => {
  try {
    const respuesta = await getAllIpress("/periodos/");
    periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
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
    const respuesta = await getAllIpress("/ipress/");
    listaClinicas.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    if (props.clinica != null && props.clinica !== '') {
      clinicaSeleccionada.value = props.clinica;
    } else if (listaClinicas.value.length > 0) {
      clinicaSeleccionada.value = listaClinicas.value[0].id_ipress;
      emit('update:clinica', listaClinicas.value[0].id_ipress);
    }
  } catch (error) {
    console.error("Error cargando clínicas:", error);
    ElMessage.error("No se pudieron cargar las clínicas");
  }
};

const procesarCambioClinica = (valor) => {
  emit('update:clinica', valor);
  emit('change', { tipo: 'clinica', valor });
};

const fetchModalidades = async () => {
  try {
    const respuesta = await getAllIpress("/modalidades/");
    listaModalidades.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    if (props.modalidad != null && props.modalidad !== '') {
      modalidadSeleccionada.value = props.modalidad;
    } else if (listaModalidades.value.length > 0) {
      modalidadSeleccionada.value = listaModalidades.value[0].id_modalidad;
      emit('update:modalidad', listaModalidades.value[0].id_modalidad);
    }
  } catch (error) {
    console.error("Error cargando modalidades:", error);
    listaModalidades.value = [];
  }
};

const procesarCambioModalidad = (valor) => {
  emit('update:modalidad', valor);
  emit('change', { tipo: 'modalidad', valor });
};

watch(() => props.periodo, (newVal) => sincronizarVisual(newVal));
watch(() => props.clinica, (newVal) => clinicaSeleccionada.value = newVal);
watch(() => props.modalidad, (newVal) => modalidadSeleccionada.value = newVal);

onMounted(() => {
  fetchPeriodos();
  fetchClinicas();
  fetchModalidades();
});
</script>