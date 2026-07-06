<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-6">
    <div class="max-w-[100rem] mx-auto w-full">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span class="w-1.5 h-8 bg-[#008f9c] rounded-full"></span>
          Inicio de TRR
        </h1>
        <p class="text-slate-500 mt-1 text-sm">
          Pacientes en atención por periodo, IPRESS y modalidad. Use los filtros del encabezado para cargar la lista.
        </p>
      </div>

      <TablaPacientesAtencion />
    </div>
  </div>
</template>

<script setup>
import TablaPacientesAtencion from '@/components/pacientes/TablaPacientesAtencion.vue';
</script>
