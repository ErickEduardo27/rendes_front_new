<template>
  <div class="bg-white p-4 rounded-xl shadow-sm">
    <h2 class="text-lg font-semibold mb-4">Actividad Reciente</h2>
    <ul class="space-y-2 text-sm text-gray-700">
      <li v-for="(actividad, i) in actividades" :key="i">
        <p>{{ actividad.descripcion }}</p>
        <p class="text-xs text-gray-400">{{ actividad.tiempo }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
const actividades = [
  { descripcion: 'Nuevo paciente registrado: Ana Martínez', tiempo: 'Hace 5 minutos' },
  { descripcion: 'Cita completada con Carlos Ruiz', tiempo: 'Hace 15 minutos' },
  { descripcion: 'Historial médico actualizado - María Silva', tiempo: 'Hace 30 minutos' },
  { descripcion: 'Signos vitales registrados - José Hernández', tiempo: 'Hace 1 hora' }
]
</script>
