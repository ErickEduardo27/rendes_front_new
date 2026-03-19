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
        :placeholder="clinicaSeleccionada ? 'Modalidad de la IPRESS' : 'Seleccione una clínica'"
        :disabled="!clinicaSeleccionada"
        style="width: 180px"
        @change="procesarCambioModalidad"
      >
        <el-option
          v-for="m in modalidadDeLaIpress"
          :key="m.id_modalidad"
          :label="m.modalidad"
          :value="m.id_modalidad"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { getAllIpress } from "@/services/ipress/Ipress.service";
import { ElMessage, ElConfigProvider } from 'element-plus';
import { useAuthStore } from '@/store/auth';

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
const ultimoIdPeriodoEmitido = ref(null);

const listaClinicas = ref([]);
const clinicaSeleccionada = ref(null);
const modalidadSeleccionada = ref(null);

// Solo la modalidad de la IPRESS seleccionada (cada ipress tiene id_modalidad según el modelo)
const modalidadDeLaIpress = computed(() => {
  if (!clinicaSeleccionada.value) return [];
  const ipress = listaClinicas.value.find((c) => c.id_ipress === clinicaSeleccionada.value);
  if (!ipress) return [];
  const idModalidad = ipress.id_modalidad ?? ipress.datosModalidad?.id_modalidad;
  const nombreModalidad = ipress.datosModalidad?.modalidad ?? 'Modalidad';
  if (idModalidad == null) return [];
  return [{ id_modalidad: idModalidad, modalidad: nombreModalidad }];
});

// ==========================================
// 1. LÓGICA DE PERIODO (Tu código original)
// ==========================================
const fetchPeriodos = async () => {
  try {
    const respuesta = await getAllIpress("/periodos/");
    periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    sincronizarVisual(props.periodo);
    asegurarPeriodoValido();
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
    ultimoIdPeriodoEmitido.value = encontrado.id_periodo;
    emit('update:periodo', encontrado.id_periodo);
    // Emitimos evento general por si quieres guardar al instante
    emit('change', { tipo: 'periodo', valor: encontrado.id_periodo });
  } else {
    ElMessage.warning('El periodo seleccionado no está habilitado');
    setTimeout(() => {
      asegurarPeriodoValido();
    }, 100);
  }
};

const asegurarPeriodoValido = () => {
  if (periodos.value.length === 0) return;

  const periodoActual = props.periodo ?? ultimoIdPeriodoEmitido.value;
  const periodoValido = periodos.value.find((item) => item.id_periodo === periodoActual);

  if (periodoValido) {
    fechaVisual.value = periodoValido.periodo;
    ultimoIdPeriodoEmitido.value = periodoValido.id_periodo;
    return;
  }

  const primerPeriodo = periodos.value[0];
  fechaVisual.value = primerPeriodo.periodo;
  ultimoIdPeriodoEmitido.value = primerPeriodo.id_periodo;
  emit('update:periodo', primerPeriodo.id_periodo);
  emit('change', { tipo: 'periodo', valor: primerPeriodo.id_periodo });
};

const sincronizarVisual = (id) => {
  if (id && periodos.value.length > 0) {
    const p = periodos.value.find(item => item.id_periodo === id);
    if (p) {
      fechaVisual.value = p.periodo;
      ultimoIdPeriodoEmitido.value = p.id_periodo;
    }
  }
};

// ==========================================
// 2. LÓGICA DE CLÍNICAS
// Si el usuario tiene perfil Clínicas u Hospitales, solo se listan las IPRESS asignadas (usuarioIpress).
// ==========================================
const authStore = useAuthStore();

const esPerfilClinicasOHospitales = () => {
  const u = authStore.user;
  if (!u?.datosPerfil?.perfil) return false;
  const nombre = String(u.datosPerfil.perfil).toLowerCase();
  return nombre.includes('clínica') || nombre.includes('clinica') || nombre.includes('hospital');
};

const fetchClinicas = async () => {
  try {
    const respuesta = await getAllIpress("/ipress/");
    let lista = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);

    if (esPerfilClinicasOHospitales() && authStore.user?.id_usuario) {
      const asignaciones = await getAllIpress(`/usuarioIpressFilter/?id_usuario=${authStore.user.id_usuario}`);
      const listaAsig = Array.isArray(asignaciones) ? asignaciones : (asignaciones?.results || []);
      const idsAsignados = new Set(listaAsig.map((a) => a.id_ipress).filter(Boolean));
      lista = lista.filter((ip) => idsAsignados.has(ip.id_ipress));
    }

    listaClinicas.value = lista;
    if (props.clinica != null && props.clinica !== '') {
      clinicaSeleccionada.value = props.clinica;
      sincronizarModalidadDesdeClinica(props.clinica);
    } else if (listaClinicas.value.length > 0) {
      const primera = listaClinicas.value[0];
      clinicaSeleccionada.value = primera.id_ipress;
      emit('update:clinica', primera.id_ipress);
      sincronizarModalidadDesdeClinica(primera.id_ipress);
    }
  } catch (error) {
    console.error("Error cargando clínicas:", error);
    ElMessage.error("No se pudieron cargar las clínicas");
  }
};

const sincronizarModalidadDesdeClinica = (idIpress) => {
  if (idIpress == null || idIpress === '') {
    modalidadSeleccionada.value = null;
    emit('update:modalidad', null);
    return;
  }
  const ipress = listaClinicas.value.find((c) => c.id_ipress === idIpress);
  const idModalidad = ipress?.id_modalidad ?? ipress?.datosModalidad?.id_modalidad;
  if (idModalidad != null) {
    modalidadSeleccionada.value = idModalidad;
    emit('update:modalidad', idModalidad);
    emit('change', { tipo: 'modalidad', valor: idModalidad });
  } else {
    modalidadSeleccionada.value = null;
    emit('update:modalidad', null);
  }
};

const procesarCambioClinica = (valor) => {
  emit('update:clinica', valor);
  emit('change', { tipo: 'clinica', valor });
  sincronizarModalidadDesdeClinica(valor);
};

const procesarCambioModalidad = (valor) => {
  emit('update:modalidad', valor);
  emit('change', { tipo: 'modalidad', valor });
};

watch(() => props.periodo, (newVal) => {
  sincronizarVisual(newVal);
  if (newVal == null || newVal === '') {
    asegurarPeriodoValido();
  }
});
watch(() => props.clinica, (newVal) => clinicaSeleccionada.value = newVal);
watch(() => props.modalidad, (newVal) => modalidadSeleccionada.value = newVal);

onMounted(() => {
  fetchPeriodos();
  fetchClinicas();
});
</script>