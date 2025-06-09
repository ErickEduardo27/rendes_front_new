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
                <li><strong>Teléfono:</strong> {{ paciente.telefono }}</li>
                <li><strong>Email:</strong> {{ paciente.email }}</li>
                <li><strong>Dirección:</strong> {{ paciente.direccion }}</li>
            </ul>
            <div class="mt-4">
                <p class="font-semibold text-sm">Contacto de Emergencia</p>
                <p class="text-sm">{{ paciente.contactoEmergencia }}</p>
                <p class="text-sm">{{ paciente.telefonoEmergencia }}</p>
            </div>
            <div class="mt-4">
                <p class="font-semibold text-sm">Observaciones</p>
                <p class="text-sm">dadsaa</p>
            </div>
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
