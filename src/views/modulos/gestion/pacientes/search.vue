<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important; padding: 0 !important">
      <v-card class="mx-auto" max-width="2500">
        <div style="max-height: 80vh">
          <template>
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">
                  Paciente
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <h4>Datos Paciente</h4>
                  <v-divider></v-divider>
                  <br />
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field ref="Num_doc" id="Num_doc" v-model="dataPaciente.numero" label="Nro de documento"
                        @input="updatePaciente" @keydown.enter.prevent :error-messages="erroresForm.numero"
                        @keydown.enter="continuePaciente()"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="dataPaciente.tipo" :items="['DNI', 'CARNET DE EXTRANJERÍA', 'RUC']"
                        label="Tipo Doc." disabled></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="dataPaciente.autogenerado" label="Autogenerado" disabled></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="dataPaciente.apellidosNombres" label="Apellidos y Nombres"
                        disabled></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="dataPaciente.fecha_nacimiento" label="Fec. Nac." disabled></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="dataPaciente.edad" label="Edad" disabled></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="dataPaciente.sexo" :items="['Masculino', 'Femenino']" label="Genero"
                        disabled></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <!-- <v-text-field v-model="dataPaciente.gradoInstruccion" label="Grado de Instrucción"
                        disabled></v-text-field> -->
                      <v-select v-model="dataPaciente.gradoInstruccion"
                        :items="['PRIMARIA', 'SECUNDARIA', 'SIN ESTUDIO', 'SUPERIOR']" label="Grado de Instrucción"
                        disabled></v-select>
                    </v-col>
                  </v-row>
                  <div class="d-flex justify-end ma-1">
                    <v-btn color="secundary" @click="cancelar" style="margin-right: 1rem">
                      Cancelar
                    </v-btn>
                    <v-btn color="primary" @click="continuePaciente">
                      Continue
                    </v-btn>
                  </div>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
            <v-dialog v-model="dialogNuevoPaciene" v-if="dialogNuevoPaciene" persistent width="800">
              <NuevoPaciente @closeNuevo="closeNuevo"></NuevoPaciente>
            </v-dialog>
            <v-dialog v-model="dialogLoader" persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Cargando Datos
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
          </template>
        </div>
      </v-card></v-container>
  </div>
</template>
<style scoped>
.v-dialog__content--active {
  background: #59595940;
  backdrop-filter: blur(1px);
}

.bg-primary-table {
  background: rgb(27 160 255 / 12%);
  font-weight: 400;
}

.text-start {
  font-size: 0.8rem !important;
}

.container {
  max-width: 3000px !important;
}

.v-label {
  margin-left: 0;
}

.v-dialog__content--active {
  background: #59595940;
  backdrop-filter: blur(1px);
}
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import Swal from "sweetalert2";
import { obtenerToken } from "@services/authService/authService";
import pacienteService from "@services/pacientes/pacienteService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
import avancePacienteService from "../../../../services/script/avancePacienteService";
import NuevoPaciente from "../pacientes/create.vue"
export default {
  data() {
    return {
      dialogNuevoPaciene: false,
      dialogLoader: false,
      e1: 1,
      step: 1,
      dialog: false,
      menu1: false,
      menu2: false,
      menu3: false,
      titleButton: "",
      titleCard: "",
      valid: true,
      dataPaciente: {
        id_paciente: null,
        id_etiologia: null,
        tipo: "",
        numero: "",
        autogenerado: "",
        apellidosNombres: "",
        fecha_nacimiento: "",
        edad: "",
        sexo: "",
        gradoInstruccion: "",
        etiologiaCodigo: "",
        etiologiaGeneral: "",
        etiologiaEspecifica: "",
        enf_otra: "",
        id_usuario_ipress: "",
        id_fecha: "",
      },
      cas: null,
      maestro: null,
      deleteUser: [],
      statusEdit: false,
      search: "",
      sortBy: [{ key: "codigo_unico", order: "asc" }],
      headers: [
        { text: "Codigo Unic", value: "codigo_unico" },
        { text: "Ipress", value: "ipress" },
        { text: "Ruc", value: "ruc" },
        { text: "Tipo Inst.", value: "tipo_institucion" },
        { text: "Ubigeo", value: "ubigeo" },
        { text: "Dirección", value: "direccion" },
        { text: "Cod. Disa", value: "codigo_disa" },
        { text: "Disa", value: "disa" },
        { text: "Cod. Red", value: "codigo_red" },
        { text: "Red", value: "red" },
        { text: "Actions", align: "center", value: "actions", sortable: false },
      ],
      erroresForm: [],
      dataPacientes: [],
      porcentajeGroup: {},
      itemModalidad: null,
      itemPeriodo: null,
      itemUsuarioIpress: null,
      itemPaciente: null,
    };
  },
  methods: {
    closeNuevo() {
      this.dialogNuevoPaciene = false;
      this.loadPaciente();
    },
    cancelar() {
      // MODO_SIN_BACK//
      /* this.closeForm();
      return; */
      this.$router.push("/go/inicio");
    },
    updatePacientes() {
      this.$emit("updatePaciente", this.dataPaciente);
      this.closeForm();
    },
    updatePorcentaje() {
      this.$emit("porcentajeForm", this.porcentajeGroup);
    },
    closeForm() {
      this.$emit("closeForm");
    },
    continuePaciente() {
      if (this.dataPaciente.numero == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡Ingrese el número de documento del paciente!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (this.dataPaciente.apellidosNombres == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡El paciente no se encuentra registrado!¿Desea registrar un nuevo paciente?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogNuevoPaciene = true;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
        return;
      }
      sessionStorage.setItem("itemPaciente", this.dataPaciente.id_paciente);
      this.calculateFormPorcentaje();
    },
    async calculateFormPorcentaje() {
      this.dialogLoader = true;
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("itemUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
        paciente: this.dataPaciente.id_paciente.split("/")[4],
      };
      avancePacienteService
        .postCalcularAvance(array)
        .then((res) => {
          this.updatePacientes();
          this.porcentajeGroup = res.data[0];
          console.log("porcentajesssssss", this.porcentajeGroup);
          this.updatePorcentaje();
          this.dialogLoader = false;
        })
        .catch((res) => {
          this.dialogLoader = false;

          console.log("Error:", res);
        });
    },

    async loadPaciente() {
      this.dialogLoader = true;
      const token = await obtenerToken();
      pacienteService
        .getPacientes(token)
        .then((res) => {
          this.dialogLoader = false;
          this.dataPacientes = res.data;
          const url = this.dataPacientes[0].url;
          const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
          sessionStorage.setItem("dominioActual", extractedUrl);
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
        });
    },
    updatePaciente() {
      for (const i in this.dataPacientes) {
        const element = this.dataPacientes[i];
        // Tu lógica aquí
        if (element.documento == this.dataPaciente.numero) {
          this.dataPaciente.tipo = element.tipo_documento;
          this.dataPaciente.autogenerado = element.autogenerado;
          this.dataPaciente.apellidosNombres = element.paciente;
          this.dataPaciente.fecha_nacimiento = this.formatDates(
            element.fecha_nacimiento
          );
          this.dataPaciente.edad = this.calculateAge(element.fecha_nacimiento);
          this.dataPaciente.sexo = element.genero;
          this.dataPaciente.gradoInstruccion = element.grado_instruccion;
          this.dataPaciente.id_paciente = element.url;
          break;
        }
        if (element.documento != this.dataPaciente.numero) {
          this.dataPaciente.tipo = "";
          this.dataPaciente.autogenerado = "";
          this.dataPaciente.apellidosNombres = "";
          this.dataPaciente.fecha_nacimiento = "";
          this.dataPaciente.edad = "";
          this.dataPaciente.sexo = "";
          this.dataPaciente.gradoInstruccion = "";
        }
      }
      console.log("paciente seleccionado", this.dataPaciente);
    },
    formatDates(dateString) {
      const parts = dateString.split("-");
      const day = parts[2];
      const month = parts[1];
      const year = parts[0];
      return `${day}-${month}-${year}`;
    },
    calculateAge(dateString) {
      const parts = dateString.split("-");
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Los meses en JavaScript se cuentan desde 0
      const day = parseInt(parts[2]);

      const birthDate = new Date(year, month, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    },
  },
  mounted() { },
  computed: {},
  created() {
    this.itemModalidad = sessionStorage.getItem("itemModalidad");
    this.itemPeriodo = sessionStorage.getItem("itemPeriodo");
    this.itemUsuarioIpress = sessionStorage.getItem("itemUsuarioIpress");
    this.itemPaciente = sessionStorage.getItem("itemPaciente");
    this.loadPaciente();
  },
  components: {
    NuevoPaciente
  },
};
</script>