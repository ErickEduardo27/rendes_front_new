<template>
  <div class="p-6 bg-gray-50 flex flex-col min-h-full">

    <router-link to="/" class="mb-4 flex items-center gap-2 text-gray-700 hover:underline">
      <ArrowUturnLeftIcon class="w-6 h-6" />
      Volver al Inicio
    </router-link>

    <h1 class="text-2xl font-bold mb-1">Expediente Médico</h1>
    <p class="text-gray-600 mb-6">Información completa del paciente y formularios médicos</p>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="col-span-1">
        <PatientInfo :paciente="pacienteRegistrado"/>
      </div>
      <div class="col-span-4">
        <MedicalTabs :tipoDialisis="pacienteRegistrado?.tipoDialisis" />
      </div>
    </div>

    <PatientRegistrationModal
      :isOpen="showModal"
      @close="closeModal"
      :onPatientRegistered="handlePatientRegistered"
    />
  </div>
</template>

<script>
import { ArrowUturnLeftIcon } from '@heroicons/vue/24/outline'
import PatientInfo from '@/pages/registros/PatientInfo.vue'
import MedicalTabs from '@/pages/registros/MedicalTabs.vue'
import PatientRegistrationModal from '@/components/modals/PatientRegistrationModal.vue'
export default {
  name: 'Patient',
  components: {
    PatientInfo,
    MedicalTabs,
    PatientRegistrationModal,
    ArrowUturnLeftIcon
  },
  data() {
    return {
      showModal: false,
      pacienteRegistrado: null,
    };
  },
  watch: {
    '$route.path'(newPath) {
      this.showModal = newPath === '/newpatient';
    }
  },
  mounted() {
    if (this.$route.path === '/newpatient') {
      this.showModal = true;
    }
  },
  methods: {
    closeModal() {
      this.showModal = false;
      
      if (!this.pacienteRegistrado) {
        this.$router.push('/');
      }
    },
    handlePatientRegistered(data) {
      this.pacienteRegistrado = data;
    }
  }
}
</script>
