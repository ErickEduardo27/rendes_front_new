<template>
  <div class="bg-white p-4 rounded-xl shadow-sm">
    <h2 class="text-lg font-semibold mb-4">Citas de Hoy</h2>
    <div v-for="cita in citas" :key="cita.nombre" class="flex justify-between py-2 border-b last:border-none">
      <div>
        <p class="font-semibold">{{ cita.nombre }}</p>
        <p class="text-sm text-gray-500">{{ cita.doctor }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span :class="statusClass(cita.estado)" class="text-xs font-medium px-2 py-0.5 rounded-full">
          {{ cita.estado }}
        </span>
        <p class="text-sm text-gray-600">{{ cita.hora }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const citas = [
  { nombre: 'Ana Martínez', doctor: 'Dr. López · Consulta General', hora: '09:00', estado: 'confirmada' },
  { nombre: 'Carlos Ruiz', doctor: 'Dr. García · Cardiología', hora: '10:30', estado: 'en-curso' },
  { nombre: 'María Silva', doctor: 'Dr. Rodríguez · Pediatría', hora: '11:15', estado: 'pendiente' },
  { nombre: 'José Hernández', doctor: 'Dr. López · Traumatología', hora: '14:00', estado: 'confirmada' }
]

function statusClass(estado) {
  switch (estado) {
    case 'confirmada':
      return 'bg-green-100 text-green-700'
    case 'en-curso':
      return 'bg-blue-100 text-blue-700'
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700'
  }
}
</script>
