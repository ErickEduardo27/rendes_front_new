<template>
    <div class="flex items-center gap-2">
      <h2 class="text-sm font-semibold text-gray-700">Periodo de Reporte:</h2>
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
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { getAllIpress } from "@/services/ipress/Ipress.service";
  import { ElMessage } from 'element-plus';
  
  // Props: Recibe el ID seleccionado actualmente (v-model)
  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue', 'change']);
  
  const periodos = ref([]);
  const fechaVisual = ref('');
  
  // 1. Cargar la lista de periodos desde la API
  const fetchPeriodos = async () => {
    try {
      const respuesta = await getAllIpress("/periodos/");
      periodos.value = respuesta;
      sincronizarVisual(props.modelValue); // Si ya había un ID, mostrar la fecha
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };
  
  // --- NUEVA LÓGICA VISUAL ---
  // Esta función se ejecuta para cada día/mes del calendario.
  // Si devuelve TRUE, bloquea la fecha. Si devuelve FALSE, la deja libre.
  const esFechaDeshabilitada = (time) => {
    // 1. Si aún no cargan los periodos, bloqueamos todo por seguridad
    if (periodos.value.length === 0) return true;
  
    // 2. Convertimos la fecha del calendario (time) al formato "YYYY-MM"
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const fechaCalendario = `${year}-${month}`;
  
    // 3. Verificamos si esa fecha existe en tu lista de periodos permitidos
    const existe = periodos.value.some(p => p.periodo === fechaCalendario);
  
    // 4. Si existe, devolvemos false (NO deshabilitar). Si no existe, true (deshabilitar).
    return !existe;
  };
  // ---------------------------
  
  // 2. Lógica: Cuando el usuario elige una fecha -> Buscar ID -> Emitir ID
  const procesarCambio = (fecha) => {
    if (!fecha) return;
    
    const encontrado = periodos.value.find(p => p.periodo === fecha);
    if (encontrado) {
      emit('update:modelValue', encontrado.id_periodo);
      emit('change', encontrado.id_periodo);
    } else {
      // Este mensaje ya casi no saldrá porque las fechas inválidas estarán bloqueadas
      ElMessage.warning('El periodo seleccionado no está habilitado');
      fechaVisual.value = ''; 
    }
  };
  
  // 3. Lógica Inversa: Si el ID cambia desde afuera -> Actualizar visual
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