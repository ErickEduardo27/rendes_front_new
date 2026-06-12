<template>
  <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 mt-2">
    <h2 class="text-xl font-semibold mb-1">Eventos Infecciosos Asociados al Acceso de Diálisis</h2>

    <div v-for="(evento, index) in eventosInfecciosos" :key="evento.id" class="border p-4 mb-4 rounded-lg shadow-sm space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700">Fecha de Evento</label>
          <input
            v-model="evento.feEvento"
            type="date"
            class="w-full border rounded p-2 text-sm"
            @change="onCambioFechaEvento(index)"
          />
        </div>
      </div>

      <div v-if="evento.feEvento" class="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p class="text-xs font-bold text-slate-500 uppercase mb-2">Acceso vascular vigente en la fecha del evento</p>
        <template v-if="accesoVigenteEnFechaEvento(evento.feEvento)">
          <p class="text-sm font-semibold text-slate-800">
            {{ accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso || accesoVigenteEnFechaEvento(evento.feEvento).tipo_acceso_actual || '—' }}
          </p>
          <p class="text-xs text-slate-600">
            {{ accesoVigenteEnFechaEvento(evento.feEvento).localizacion_acceso || accesoVigenteEnFechaEvento(evento.feEvento).localizacion_acceso_actual || '—' }}
          </p>
          <p class="text-xs text-slate-500 mt-1">
            Fecha creación:
            {{ accesoVigenteEnFechaEvento(evento.feEvento).fecha_creacion_acceso || accesoVigenteEnFechaEvento(evento.feEvento).fecha_creacion_acceso_actual || '—' }}
          </p>
        </template>
        <p v-else class="text-sm text-slate-400 italic">No hay registro de acceso para esta fecha.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700">Tipo de Infección</label>
          <select
            v-model="evento.tpInfeccion"
            class="w-full border rounded p-2 text-sm"
            :disabled="!evento.feEvento"
            @change="resetearCamposCultivo(index)"
          >
            <option value="">Seleccione una opción</option>
            <option
              v-for="op in opcionesInfeccionPeritoneal"
              :key="op.value"
              :value="op.value"
            >{{ op.label }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">Inicio de Tratamiento Antimicrobiano IV</label>
          <input v-model="evento.tratamientoIV" type="checkbox" />
        </div>
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">Inicio de Vancomicina IV</label>
          <input v-model="evento.vancomicinaIV" type="checkbox" />
        </div>
        <div v-if="mostrarHemocultivo(evento)" class="flex items-center gap-4">
          <label class="text-sm font-medium text-gray-700">Hemocultivo Positivo</label>
          <input v-model="evento.hemocultivoPositivo" type="checkbox" @change="onCambioHemocultivo(index)" />
        </div>
      </div>

      <div v-if="evento.hemocultivoPositivo && mostrarHemocultivo(evento)" class="mb-2">
        <label class="block text-sm font-semibold text-gray-700">Germen identificado</label>
        <select v-model="evento.tpGermen" class="w-full border rounded p-2 text-sm">
          <option value="">Seleccione una opción</option>
          <option v-for="g in germenesPorInfeccion(evento.tpInfeccion)" :key="g.value" :value="g.value">{{ g.label }}</option>
        </select>
      </div>

      <div v-if="evento.tpInfeccion === 'Infección de orificio de salida'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700">Tipo de infección local</label>
          <select v-model="evento.tipoInfeccionLocal" class="w-full border rounded p-2 text-sm">
            <option value="">Seleccione una opción</option>
            <option value="1">Pus</option>
            <option value="2">Enrojecimiento</option>
            <option value="3">Aumento de volumen</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700">Tipo de Germen</label>
          <select v-model="evento.tpGermen" class="w-full border rounded p-2 text-sm">
            <option value="">Seleccione una opción</option>
            <option v-for="g in germenesBacterianos" :key="g.value" :value="g.value">{{ g.label }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllIpress } from '@/services/ipress/Ipress.service';

const props = defineProps({
  paciente: { type: Object, default: null },
  idPacienteAtencion: { type: [Number, String], default: null },
});

const unidadesPaciente = ref([]);

const opcionesInfeccionPeritoneal = [
  { value: 'Infección de orificio de salida', label: 'Infección de orificio de salida' },
  { value: 'Túnelitis', label: 'Túnelitis' },
  { value: 'Peritonitis', label: 'Peritonitis' },
  { value: 'Fungemia', label: 'Fungemia' },
];

const germenesBacterianos = [
  { value: 'Staphylococcus aureus', label: 'Staphylococcus aureus' },
  { value: 'Staphylococcus epidermidis', label: 'Staphylococcus epidermidis' },
  { value: 'Escherichia coli', label: 'Escherichia coli' },
  { value: 'Pseudomonas aeruginosa', label: 'Pseudomonas aeruginosa' },
];

const eventosInfecciosos = ref([
  {
    id: Date.now(),
    feEvento: '',
    tpInfeccion: '',
    tratamientoIV: false,
    vancomicinaIV: false,
    hemocultivoPositivo: false,
    tipoInfeccionLocal: '',
    tpGermen: '',
  },
]);

async function fetchUnidadesActualesPaciente() {
  const idPaciente = props.paciente?.id_paciente;
  if (!idPaciente) {
    unidadesPaciente.value = [];
    return;
  }
  try {
    const res = await getAllIpress(`/unidadesActuales/?id_paciente=${idPaciente}`);
    unidadesPaciente.value = Array.isArray(res) ? res : (res?.results || []);
  } catch {
    unidadesPaciente.value = [];
  }
}

function accesoVigenteEnFechaEvento(fechaEvento) {
  if (!fechaEvento || !unidadesPaciente.value.length) return null;
  const ordenados = [...unidadesPaciente.value]
    .filter((u) => u.fecha_creacion_acceso || u.fecha_creacion_acceso_actual)
    .map((u) => ({ ...u, fecha: u.fecha_creacion_acceso || u.fecha_creacion_acceso_actual }))
    .filter((u) => u.fecha <= fechaEvento)
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  return ordenados[0] || null;
}

function mostrarHemocultivo(evento) {
  const tp = String(evento?.tpInfeccion || '');
  return tp === 'Bacteremia' || tp === 'Fungemia';
}

function germenesPorInfeccion(tpInfeccion) {
  if (tpInfeccion === 'Fungemia') return [{ value: 'Hongos', label: 'Hongos' }];
  return germenesBacterianos;
}

function onCambioHemocultivo(index) {
  const evento = eventosInfecciosos.value[index];
  if (!evento?.hemocultivoPositivo) evento.tpGermen = '';
}

function resetearCamposCultivo(index) {
  const evento = eventosInfecciosos.value[index];
  if (!evento) return;
  evento.hemocultivoPositivo = false;
  evento.tpGermen = '';
  evento.tipoInfeccionLocal = '';
}

function onCambioFechaEvento(index) {
  const evento = eventosInfecciosos.value[index];
  if (!evento) return;
  evento.tpInfeccion = '';
  resetearCamposCultivo(index);
}

onMounted(() => {
  if (props.paciente?.id_paciente) {
    fetchUnidadesActualesPaciente();
  }
});
</script>
