<template>
    <div class="bg-white p-6 rounded shadow">
        <div v-if="paciente && paciente.nombres">
            <div class="flex flex-col items-center mb-6">
                <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
                    👤
                </div>
                <p class="mt-4 font-semibold text-center">{{ paciente.nombres }} {{ paciente.apellidos }}</p>
                <p class="text-sm text-gray-500">{{paciente.tipoId}}: {{paciente.numeroId}}</p>
            </div>

            <ul class="space-y-2 text-sm text-gray-700">
                <li><strong>Edad:</strong> {{paciente.edad}}</li>
                <li><strong>Género:</strong> {{ paciente.genero }}</li>
                <li><strong>Tipo de Registro:</strong> {{paciente.tipoDialisis}}</li>
                <li><strong>Autogenerado:</strong> EN PROCESO </li>
                <li><strong>Condición:</strong> EN PROCESO </li>
                <li><strong>Fecha de Ultima Diálisis:</strong> EN PROCESO </li>
            </ul>
            
        </div>
        <div v-else>
            <p class="text-gray-500 italic">No se ha registrado ningún paciente aún.</p>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'PatientInfo',
    props: {
        paciente: {
            type: Object,
            default: () => ({})
        }
    }
}
</script>
