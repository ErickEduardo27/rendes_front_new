<template>
    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <h2 class="text-xl font-semibold mb-1">Datos Iniciales </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hb (gr/ld) *</label>
                <input v-model="hb" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Calcio (mg/dl) *</label>
                <input v-model="calcio" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Fosforo (mg/dl) *</label>
                <input v-model="fosforo" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">PTHi (pg/ml) *</label>
                <input v-model="pthi" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Alb (gr/dl) *</label>
                <input v-model="alb" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Calcio corregido (mg/dl)</label>
                <input v-model="calcioCorregido" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Kt/v *</label>
                <input v-model="kt" type="text" placeholder="Buscar por descripción..."
                    class="w-full border rounded p-2 text-sm" />
            </div>
        </div>

        <hr />
        <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Tiempo de Dialisis (horas) *</label>
                <select v-model="tmpDialisis" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Epicrisis</option>
                    <option value="2">Informe de Alta</option>
                    <option value="3">Otro</option>
                </select>
            </div>
        <hr />

        <h2 class="text-xl font-semibold mb-1">Tratamientos </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Eritropoyetina *</label>
                <select v-model="eritropoyetina" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hierro *</label>
                <select v-model="hierro" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="block font-semibold text-sm text-gray-700">Hiper paratiroidismo *</label>
                <select v-model="hiperparatiroidismo" class="w-full border rounded p-2 text-sm">
                    <option value="">Seleccione una opción</option>
                    <option value="1">Si</option>
                    <option value="2">No</option>
                </select>
            </div>
        </div>

        <button class="w-full bg-black text-white py-2 rounded hover:bg-gray-900">
            💾 Guardar Unidad Actual
        </button>
    </div>
</template>

<script>
import { ref } from 'vue';

const hb = ref('');
const calcio = ref('');
const fosforo = ref('');
const pthi = ref('');
const alb = ref('');
const calcioCorregido = ref('');
const kt = ref('');
const tmpDialisis = ref('');
const eritropoyetina = ref('');
const hierro = ref('');
const hiperparatiroidismo = ref('');

export default {
  setup() {
    return {
      hb,
      calcio,
      fosforo,
      pthi,
      alb,
      calcioCorregido,
      kt,
      tmpDialisis,
      eritropoyetina,
      hierro,
      hiperparatiroidismo,
    };
  },
};
</script>