<template>
    <div class="p-6 bg-white shadow rounded">
        <h2 class="text-xl font-semibold mb-4">Lista de IPRESS</h2>

        <!-- Filtros -->
        <UserTable :data-source="pacientes" />
    </div>
</template>

<script>
import { apiGetAutenticado } from '@/services/apiService/apiMethodService';
import UserTable from "../ipress/table.vue";
import { ref, onMounted } from 'vue'
export default {
  components: {
    UserTable
  },
  setup() {
    const pacientes = ref([]);

    async function fetchIpress() {
      try {
        const respuesta = await apiGetAutenticado('/ipress/');
        pacientes.value = respuesta;
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }

    onMounted(() => {
      fetchIpress();
    });

    return {
      pacientes
    };
  }
};
</script>
<!-- import { apiGetAutenticado } from '@/services/apiService/apiMethodService';
import UserTable from "../ipress/table.vue";
export default {
    name: 'PatientTable',
    components: {
        UserTable,
    },
    data() {
        return {
            pacientes: [],
            showModal: false,
            editingPaciente: null,
            form: {
                ipress: '',
                red: '',
            },
            filters: {
                ipress: '',
                red: '',
            },
        };
    },
    mounted() {
        this.fetchIpress();
    },
    methods: {
        async fetchIpress() {
            try {
                const respuesta = await apiGetAutenticado('/ipress/');
                this.pacientes = respuesta;
            } catch (error) {
                console.error('Error al enviar POST:', error);
            }
        },
        clearFilters() {
            this.filters.ipress = '';
            this.filters.red = '';
            this.fetchPacientes();
        },
        showCreateModal() {
            this.editingPaciente = null;
            this.form = { ipress: '', red: '' };
            this.showModal = true;
        },
        showEditModal(paciente) {
            this.editingPaciente = paciente;
            this.form = { ...paciente };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        async savePaciente() {
            try {
                if (this.editingPaciente) {
                    await axios.put(`http://10.0.54.88:8010/api/ipress/${this.editingPaciente.id}/`, this.form);
                } else {
                    await axios.post('http://10.0.54.88:8010/api/ipress/', this.form);
                }
                this.showModal = false;
                this.fetchPacientes();
            } catch (error) {
                console.error('Error al guardar IPRESS:', error);
            }
        },
        async deletePaciente(id) {
            if (confirm('¿Estás seguro de que quieres eliminar esta IPRESS?')) {
                try {
                    await axios.delete(`http://10.0.54.88:8010/api/ipress/${id}/`);
                    this.fetchPacientes();
                } catch (error) {
                    console.error('Error al eliminar IPRESS:', error);
                }
            }
        },
    },
};
</script> -->

<style scoped>
/* Puedes personalizar estilos aquí si quieres */
</style>