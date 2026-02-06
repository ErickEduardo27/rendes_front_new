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
              :key="item.id" 
              :label="item.nombre"
              :value="item.id"
            >
              <span style="float: left">{{ item.nombre }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px">{{ item.codigo }}</span>
            </el-option>
          </el-select>
        </div>
  
        <div class="flex items-center gap-2 border-l border-gray-200 pl-4">
          <h2 class="text-sm font-bold text-gray-700 uppercase tracking-wide">Modalidad:</h2>
          
          <el-select 
            v-model="modalidadSeleccionada"
            placeholder="Todas"
            clearable
            style="width: 180px"
            @change="procesarCambioModalidad"
          >
            <el-option label="Hemodiálisis" value="HEMO" />
            <el-option label="Diálisis Peritoneal" value="DP" />
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
  
  const listaClinicas = ref([]);
  const clinicaSeleccionada = ref(null);
  const modalidadSeleccionada = ref(null);
  
  // ==========================================
  // 1. LÓGICA DE PERIODO
  // ==========================================
  const fetchPeriodos = async () => {
    try {
      const respuesta = await getAllIpress("/periodos/");
      periodos.value = respuesta;
      sincronizarVisual(props.periodo); 
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };
  
  // NOTA: Se eliminó la función "esFechaDeshabilitada" para dejar todos los meses libres.
  
  const procesarCambioPeriodo = (fecha) => {
    if (!fecha) return;
    
    // Buscamos si el periodo existe en la lista cargada
    const encontrado = periodos.value.find(p => p.periodo === fecha);
    
    if (encontrado) {
      // Si existe, mandamos el ID (Lógica normal)
      emit('update:periodo', encontrado.id_periodo);
      emit('change', { tipo: 'periodo', valor: encontrado.id_periodo });
    } else {
      // Si NO existe (mes nuevo o futuro), mandamos la FECHA TEXTO
      // y NO bloqueamos ni mostramos error.
      emit('update:periodo', fecha); 
      emit('change', { tipo: 'periodo', valor: fecha });
    }
  };
  
  const sincronizarVisual = (idOFecha) => {
    // Sincronización inteligente:
    // 1. Si es ID, busca en la lista.
    // 2. Si es string de fecha (YYYY-MM), lo pone directo.
    if (!idOFecha) return;
  
    if (typeof idOFecha === 'number' && periodos.value.length > 0) {
       const p = periodos.value.find(item => item.id_periodo === idOFecha);
       if (p) fechaVisual.value = p.periodo;
    } else {
       // Asumimos que es un string "2025-08" si no es ID numérico
       fechaVisual.value = idOFecha;
    }
  };
  
  // ==========================================
    // 2. LÓGICA DE CLÍNICAS (SOLUCIÓN: ID CORRECTO)
  // ==========================================
  const fetchClinicas = async () => {
      // CAMBIO IMPORTANTE: Usamos el ID 62877 para que coincida con el valor seleccionado
      const clinicaFija = { 
          id: 62877,  // <--- ¡AQUÍ ESTÁ LA CLAVE!
          nombre: "CENTRO NACIONAL DE SALUD RENAL", 
          codigo: "CNSR" 
      };

      try {
          const respuesta = await getAllIpress("/ipress/"); 
          
          if (Array.isArray(respuesta) && respuesta.length > 0) {
              listaClinicas.value = respuesta;

              // Buscamos si el ID 62877 ya viene en la lista de la API
              // (Puede que venga como número o string, comparamos seguro)
              const existe = listaClinicas.value.find(c => c.id == clinicaFija.id);
              
              if (!existe) {
                  // Si no está, lo agregamos al principio
                  listaClinicas.value.unshift(clinicaFija);
              }
          } else {
              // Si la API falla, usamos el fijo
              listaClinicas.value = [clinicaFija];
          }

      } catch (error) {
          listaClinicas.value = [clinicaFija];
      }

      // Lógica de selección
      if (props.clinica) {
          clinicaSeleccionada.value = props.clinica;
      } else {
          // Por defecto seleccionamos el ID 62877
          clinicaSeleccionada.value = clinicaFija.id;
          emit('update:clinica', clinicaFija.id);
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
  });
  </script>