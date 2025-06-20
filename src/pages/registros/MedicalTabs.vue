<template>
    <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-1">Formularios Médicos</h2>
        <p class="text-sm text-gray-500 mb-4">Complete la información médica del paciente en las diferentes secciones
        </p>
        <TabGroup>
            <div class="w-full overflow-x-auto custom-scrollbar">
                <TabList class="flex space-x-2 mb-2 min-w-max md:min-w-0 border-b border-gray-200">
                    <Tab v-for="tab in tabs" :key="tab" v-slot="{ selected }">
                        <button :class="[
                            'flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-md transition-colors',
                            'whitespace-nowrap',
                            selected ? 'border-b-2 w-fit border-black text-black bg-gray-100' : 'text-gray-500 hover:text-black' // Esto es clave para que el texto no se rompa
                        ]">
                            {{ tab }}
                        </button>
                    </Tab>
                </TabList>
            </div>

            <TabPanels>
                <TabPanel>
                    <F1DialisisPaciente />
                </TabPanel>
                <TabPanel>
                    <!-- Formulario 2 -->
                    <component :is="tipoDialisis === 'hemodialisis' ? Form2Hemodialisis : Form2Peritoneal"
                        v-model:presentaInfeccion="presentaInfeccion" />
                </TabPanel>
                <TabPanel>
                    <!-- Formulario 3 -->
                    <component :is="tipoDialisis === 'hemodialisis' ? Form3Hemodialisis : Form3Peritoneal"
                        :habilitado="presentaInfeccion === 'si'" />
                </TabPanel>
                <TabPanel>
                    <Form4 />
                </TabPanel>
                <TabPanel>
                    <Form5 />
                </TabPanel>
                <TabPanel>
                    <Form6 />
                </TabPanel>
                <TabPanel>
                    <Form7 />
                </TabPanel>
            </TabPanels>
        </TabGroup>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import F1DialisisPaciente from '@/components/forms/f1_paciente_dialisis.vue'
import Form4 from '@/components/forms/Form4.vue'
import Form5 from '@/components/forms/Form5.vue'
import Form6 from '@/components/forms/Form6.vue'
import Form7 from '@/components/forms/Form7.vue'
import Form3Hemodialisis from '@/components/forms/typesForm3/Form3Hemodialisis.vue'
import Form3Peritoneal from '@/components/forms/typesForm3/Form3Peritoneal.vue'
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue'
import Form2Peritoneal from '@/components/forms/typesForm2/Form2Peritoneal.vue'

const props = defineProps({
    tipoDialisis: String
})


const tabs = ref(['REGISTRO DE PACIENTES EN DIALISIS', 'UNIDAD ACTUAL', 'EVENTOS DE INFECCIÓN', 'MORBILIDAD HOSPITALARIA', 'RESULTADOS CLÍNICOS', 'CALIDAD MICROBIOLOGICA DEL AGUA', 'VACUNACIÓN'])

const presentaInfeccion = ref('');

watch(presentaInfeccion, (val) => {
  console.log('¿Tiene infecciones?', val)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
    background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
    border: 1px solid transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>