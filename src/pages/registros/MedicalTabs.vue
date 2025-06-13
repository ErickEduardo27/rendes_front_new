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
                    <!-- Formulario 2 -->
                    <component :is="tipoDialisis === 'hemodialisis' ? Form2Hemodialisis : Form2Peritoneal" />
                </TabPanel>
                <TabPanel>
                    <!-- Formulario 3 -->
                    <component :is="tipoDialisis === 'hemodialisis' ? Form3Hemodialisis : Form3Peritoneal" />
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
import { ref } from 'vue'
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

</script>