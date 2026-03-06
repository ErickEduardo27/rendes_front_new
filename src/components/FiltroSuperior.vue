<template>
    <div class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 py-3 mb-6 transition-all duration-300">
      
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
              @change="procesarCambioPeriodo"
            />
          </el-config-provider>
        </div>
  
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Clínica:</h2>
          
          <el-select 
            v-model="clinicaSeleccionada"
            placeholder="Todas las clínicas"
            filterable
            clearable
            style="width: 300px" 
            @change="procesarCambioClinica"
          >
            <el-option
              v-for="item in listaClinicas"
              :key="item.id_ipress"
              :label="item.nombre_corto || item.ipress"
              :value="item.id_ipress"
            >
              <span style="float: left">{{ item.nombre_corto || item.ipress }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px">{{ item.ipress }}</span>
            </el-option>
          </el-select>
        </div>
  
        <div class="flex items-center gap-2 border-l border-gray-200 pl-4">
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Modalidad:</h2>
          
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
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { getAllIpress } from "@/services/ipress/Ipress.service";
  import { ElConfigProvider, ElMessage } from 'element-plus';
  
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
  /** Último id_periodo válido emitido (para que todos los formularios usen siempre el id) */
  const ultimoIdPeriodoEmitido = ref(null);
  
  const listaClinicas = ref([]);
  const clinicaSeleccionada = ref(null);
  const listaModalidades = ref([]);
  const modalidadSeleccionada = ref(null);
  
  // ==========================================
  // 1. LÓGICA DE PERIODO
  // ==========================================
  const fetchPeriodos = async () => {
    try {
      const respuesta = await getAllIpress("/periodos/");
      periodos.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
      sincronizarVisual(props.periodo);
      // Si no hay periodo inicial desde el padre, fijamos el primero de la tabla y emitimos su id para todo el sistema
      if (props.periodo == null || props.periodo === '' || props.periodo === undefined) {
        if (periodos.value.length > 0) {
          const primerPeriodo = periodos.value[0];
          fechaVisual.value = primerPeriodo.periodo;
          ultimoIdPeriodoEmitido.value = primerPeriodo.id_periodo;
          emit('update:periodo', primerPeriodo.id_periodo);
          emit('change', { tipo: 'periodo', valor: primerPeriodo.id_periodo });
        }
      }
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

  /**
   * Al seleccionar un mes en el date-picker se busca en la tabla periodos el id que coincida
   * y se emite ese id para que todos los formularios del sistema lo usen (nunca la fecha texto).
   */
  const procesarCambioPeriodo = (fecha) => {
    if (!fecha) return;
    console.log("imprimiendo valor de fecha", fecha)
    const encontrado = periodos.value.find(p => p.periodo === fecha);

    if (encontrado) {
      ultimoIdPeriodoEmitido.value = encontrado.id_periodo;
      emit('update:periodo', encontrado.id_periodo);
      emit('change', { tipo: 'periodo', valor: encontrado.id_periodo });
    } else {
      ElMessage.warning('Ese mes no está registrado como periodo. Elija un mes que exista en el sistema.');
      // Dejar el date-picker en el último periodo válido para que siempre haya un id coherente
      if (ultimoIdPeriodoEmitido.value != null && periodos.value.length > 0) {
        const p = periodos.value.find(item => item.id_periodo === ultimoIdPeriodoEmitido.value);
        if (p) fechaVisual.value = p.periodo;
      } else if (periodos.value.length > 0) {
        fechaVisual.value = periodos.value[0].periodo;
        ultimoIdPeriodoEmitido.value = periodos.value[0].id_periodo;
        emit('update:periodo', periodos.value[0].id_periodo);
        emit('change', { tipo: 'periodo', valor: periodos.value[0].id_periodo });
      }
    }
  };

  const sincronizarVisual = (idOFecha) => {
    if (idOFecha == null || idOFecha === '') return;

    if (typeof idOFecha === 'number' && periodos.value.length > 0) {
      const p = periodos.value.find(item => item.id_periodo === idOFecha);
      if (p) {
        fechaVisual.value = p.periodo;
        ultimoIdPeriodoEmitido.value = idOFecha;
      }
    } else if (typeof idOFecha === 'string') {
      const p = periodos.value.find(item => item.periodo === idOFecha);
      if (p) {
        fechaVisual.value = p.periodo;
        ultimoIdPeriodoEmitido.value = p.id_periodo;
      } else {
        fechaVisual.value = idOFecha;
      }
    }
  };
  
// ==========================================
  // 2. LÓGICA DE CLÍNICAS (IPRESS desde el back)
  // ==========================================
  const fetchClinicas = async () => {
    try {
      const respuesta = await getAllIpress("/ipress/");
      const list = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
      listaClinicas.value = list;
    } catch (error) {
      console.error("Error cargando clínicas (IPRESS):", error);
      listaClinicas.value = [];
    }
    if (props.clinica != null && props.clinica !== '') {
      clinicaSeleccionada.value = props.clinica;
    } else if (listaClinicas.value.length > 0) {
      clinicaSeleccionada.value = listaClinicas.value[0].id_ipress;
      emit('update:clinica', listaClinicas.value[0].id_ipress);
    } else {
      clinicaSeleccionada.value = null;
    }
  };

  // ==========================================
  // 2b. MODALIDADES desde el back
  // ==========================================
  const fetchModalidades = async () => {
    try {
      const respuesta = await getAllIpress("/modalidades/");
      listaModalidades.value = Array.isArray(respuesta) ? respuesta : (respuesta?.results || []);
    } catch (error) {
      console.error("Error cargando modalidades:", error);
      listaModalidades.value = [];
    }
    if (props.modalidad != null && props.modalidad !== '') {
      modalidadSeleccionada.value = props.modalidad;
    } else if (listaModalidades.value.length > 0) {
      modalidadSeleccionada.value = listaModalidades.value[0].id_modalidad;
      emit('update:modalidad', listaModalidades.value[0].id_modalidad);
    } else {
      modalidadSeleccionada.value = null;
    }
  };
  const procesarCambioClinica = (valor) => {
      emit('update:clinica', valor);
      emit('change', { tipo: 'clinica', valor: valor });
  };
  
  // ==========================================
  // 3. LÓGICA DE MODALIDAD
  // ==========================================
  const procesarCambioModalidad = (valor) => {
      emit('update:modalidad', valor);
      emit('change', { tipo: 'modalidad', valor: valor });
  };
  
  // WATCHERS E INICIALIZACIÓN
  watch(() => props.periodo, (newVal) => sincronizarVisual(newVal));
  watch(() => props.clinica, (newVal) => clinicaSeleccionada.value = newVal);
  watch(() => props.modalidad, (newVal) => modalidadSeleccionada.value = newVal);
  
  onMounted(() => {
    fetchPeriodos();
    fetchClinicas();
    fetchModalidades();
  });
  </script>