<template>
  <div class="p-6">
    <FormularioPaciente v-if="mostrarFormulario == 1" 
      :periodoInicial="periodoSeleccionado" 
      :idPeriodoIpressInicial="idPeriodoIpress"
      :idClinicaInicial="idClinicaSeleccionada"
      :nombreClinicaInicial="nombreClinicaSeleccionada"
      @cancelar="mostrarFormulario = 4" />
    <CaptarPaciente v-if="mostrarFormulario == 2" @cancelar="mostrarFormulario = 4" />
    <EgresoPacientes v-if="mostrarFormulario == 3" @cancelar="mostrarFormulario = 4" />
    <ListaPacientes v-if="mostrarFormulario == 4" @form2="abrirFormulario" @form3="abrirFormulario"
      @form4="abrirFormulario" @form5="abrirFormulario" @form7="abrirFormulario" @nuevo-registro="abrirNuevoRegistro"
      @captar-paciente="mostrarFormulario = 2"
      @egresar-paciente="mostrarFormulario = 3"
    />

    <Form2Hemodialisis v-if="mostrarFormulario == 5 && modalidad==1" :paciente="pacienteSeleccionado" :periodo="periodoSeleccionado" :periodoIpress="idPeriodoIpress"
      :id-paciente-atencion="pacienteSeleccionado?.id_paciente_atencion"
      @cancelar="mostrarFormulario = 4" />
    <Form2Peritoneal v-if="mostrarFormulario == 5 && modalidad==2" :paciente="pacienteSeleccionado"  :periodo="periodoSeleccionado" :periodoIpress="idPeriodoIpress"
      @cancelar="mostrarFormulario = 4" />
    <Form3Hemodialisis v-if="mostrarFormulario == 6"  :paciente="pacienteSeleccionado" :periodo="periodoSeleccionado" :periodoIpress="idPeriodoIpress"
      :id-paciente-atencion="pacienteSeleccionado?.id_paciente_atencion"
      @cancelar="mostrarFormulario = 4" />
    <Form4 v-if="mostrarFormulario == 7" :paciente="pacienteSeleccionado" :periodo="periodoSeleccionado"  :periodoIpress="idPeriodoIpress"
      :id-paciente-atencion="pacienteSeleccionado?.id_paciente_atencion"
      @cancelar="mostrarFormulario = 4" />
    <Form5 v-if="mostrarFormulario == 8" :paciente="pacienteSeleccionado" :periodo="periodoSeleccionado" :periodoIpress="idPeriodoIpress"
      :id-paciente-atencion="pacienteSeleccionado?.id_paciente_atencion"
      @cancelar="mostrarFormulario = 4" />
    <Form7 v-if="mostrarFormulario == 9" :paciente="pacienteSeleccionado" :periodo="periodoSeleccionado" :periodoIpress="idPeriodoIpress" @cancelar="mostrarFormulario = 4" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListaPacientes from './ListaPacientes.vue'
import FormularioPaciente from './FormularioPaciente.vue'
import CaptarPaciente from './CaptarPaciente.vue'
import EgresoPacientes from './EgresoPacientes.vue'
import Form2Hemodialisis from '@/components/forms/typesForm2/Form2Hemodialisis.vue'
import Form3Hemodialisis from '@/components/forms/typesForm3/Form3Hemodialisis.vue'
import Form4 from '@/components/forms/Form4.vue'
import Form5 from '@/components/forms/Form5.vue'
import Form7 from '@/components/forms/Form7.vue'
import Form2Peritoneal from '@/components/forms/typesForm2/Form2Peritoneal.vue'

const mostrarFormulario = ref(4)
const pacienteSeleccionado = ref(null)
const periodoSeleccionado = ref(null)
const idPeriodoIpress = ref(null)
const idClinicaSeleccionada = ref(null)
const nombreClinicaSeleccionada = ref('')
const modalidad = ref(null)

const abrirFormulario = ({ paciente, numeroFormulario, periodo, periodoIpress }) => {
  console.log("se enviasdhkajshdasd", periodoIpress)
  pacienteSeleccionado.value = paciente
  modalidad.value = paciente.modalidad
  mostrarFormulario.value = numeroFormulario + 4 // adapta según tu lógica
  periodoSeleccionado.value = periodo
  idPeriodoIpress.value = periodoIpress
}

const abrirNuevoRegistro = (datos) => {
  periodoSeleccionado.value = datos.periodo
  idPeriodoIpress.value = datos.idPeriodoIpress
  idClinicaSeleccionada.value = datos.idClinica
  nombreClinicaSeleccionada.value = datos.nombreClinica
  mostrarFormulario.value = 1
}

</script>