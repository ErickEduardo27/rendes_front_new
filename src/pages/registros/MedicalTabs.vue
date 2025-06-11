<template>
    <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-1">Formularios Médicos</h2>
        <p class="text-sm text-gray-500 mb-4">Complete la información médica del paciente en las diferentes secciones
        </p>
        <TabGroup>
            <div class="w-full overflow-x-auto md:overflow-x-visible">
                <TabList
                    class="flex flex-nowrap md:flex-wrap space-x-2 md:space-x-0 md:gap-2 border-b mb-4 min-w-max md:min-w-0">
                    <Tab v-for="tab in tabs" :key="tab" v-slot="{ selected }">
                        <button :class="[
                            'pb-2 px-4 text-sm font-medium rounded-t-md transition-colors',
                            selected ? 'border-b-2 border-black text-black bg-gray-100' : 'text-gray-500 hover:text-black'
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
                    <Form2 />
                </TabPanel>
                <TabPanel>
                    <p class="text-gray-500 text-sm">Sección "EVENTOS DE INFECCIÓN" en construcción.</p>
                </TabPanel>
                <TabPanel>
                    <p class="text-gray-500 text-sm">Sección "MORBILIDAD HOSPITALARIA" en construcción.</p>
                </TabPanel>
                <TabPanel>
                    <p class="text-gray-500 text-sm">Sección "RESULTADOS CLÍNICOS" en construcción.</p>
                </TabPanel>
                <TabPanel>
                    <p class="text-gray-500 text-sm">Sección "CALIDAD MICROBIOLOGICA DEL AGUA" en construcción.</p>
                </TabPanel>
                <TabPanel>
                    <p class="text-gray-500 text-sm">Sección "VACUNACIÓN" en construcción.</p>
                </TabPanel>
            </TabPanels>
        </TabGroup>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import F1DialisisPaciente from '@/components/forms/f1_paciente_dialisis.vue'
import Form2 from '@/components/forms/Form2.vue'


const tabs = ref(['REGISTRO DE PACIENTES EN DIALISIS', 'UNIDAD ACTUAL', 'EVENTOS DE INFECCIÓN', 'MORBILIDAD HOSPITALARIA', 'RESULTADOS CLÍNICOS', 'CALIDAD MICROBIOLOGICA DEL AGUA', 'VACUNACIÓN'])

</script>