<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto my-5" max-width="2500">
        <template>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Datos
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <h4>Datos de Registro</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-switch class="ml-3" v-model="form.control" :label="`Se realizó controles (Sí/No)`"
                      :disabled="statusForm"></v-switch>
                  </v-col>
                </v-row>
                <h4>Recuento Bacteriano en Agua Tratada (UFC/ML)</h4>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.salida_osmosis_ufc" label="Salida de la Ósmosis" type="number"
                      step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.anillo_circulacion_ufc" label="Retorno del Anillo de Circulación"
                      type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <h4>Nivel de endotoxinas en Agua Tratada (UE/ML)</h4>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.salida_osmosis_ue" label="Salida de la Ósmosis" type="number" step="any"
                      :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.anillo_circulacion_ue" label="Retorno del Anillo de Circulación"
                      type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <h4>Recuento Bacteriano en Líquido de Diálisis * (UFC/ML)</h4>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.maquina_1_ufc" label="Máquina de Hemodiálisis 1" type="number"
                      step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.maquina_2_ufc" label="Máquina de Hemodiálisis 2" type="number"
                      step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <h4>Nivel de endotoxinas en Líquido de Diálisis * (UE/ML)</h4>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.maquina_1_ue" label="Máquina de Hemodiálisis 1" type="number" step="any"
                      :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.maquina_2_ue" label="Máquina de Hemodiálisis 2" type="number" step="any"
                      :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <div class="d-flex justify-end ma-1">
                  <v-btn color="primary" @click="submitForm" :disabled="statusForm">
                    Enviar
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <v-dialog v-model="dialogEdit" v-if="dialogEdit" max-width="900px">
            <RegistrarPaciente @editClose="editClose" :idPaciente="null" />
          </v-dialog>
          <v-dialog v-model="dialogLoader" persistent width="300">
            <v-card color="primary" dark>
              <v-card-text>
                Cargando Datos
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
        </template> </v-card></v-container>
  </div>
</template>
<style>
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
  margin-left: 0 !important;
}
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import Swal from "sweetalert2";
import RegistrarPaciente from "../../gestion/pacientes/edit.vue";
import calidadMicroService from "../../../../services/calidadMicro/calidadMicroService";
import { obtenerToken } from "../../../../services/authService/authService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
import consultaPeriodo from "../../../../services/script/consultaPeriodo";
export default {
  data() {
    return {
      dialogLoader: false,
      dataRedes: [],
      countCampos: 1,
      camposDinamicos: [
        {
          fecha_egreso: {
            value: "fecha_egreso",
            label: "Fecha Egreso",
            menuDinamico: false,
            computedDateFormatted: `formatDates`,
          },
          tipo_egreso: {
            value: "tipo_egreso",
            label: "Tipo Egreso",
            menuDinamico: false,
          },
          fecha_reingreso: {
            value: "fecha_reingreso",
            label: "Fecha Reingreso",
            menuDinamico: false,
          },
        },
      ],
      e1: 1,
      shipping: 0,
      step: 1,
      items: ["Review Order", "Select Shipping", "Submit"],
      products: [
        {
          name: "Product 1",
          price: 10,
          quantity: 2,
        },
        {
          name: "Product 2",
          price: 15,
          quantity: 10,
        },
      ],
      valor1: 15,
      valor2: 10,
      ver: false,
      searchIpress: "",
      searchRed: "",
      dataIpress: [],
      dataEnvio: {
        fecha: null,
      },
      rules: {
        required: (value) => !!value || "Required.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
        counterDocumento: (value) => value.length <= 10 || "Max 10 characters",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      dialog: false,
      form: {
        control: false,
        salida_osmosis_ufc: "",
        anillo_circulacion_ufc: "",
        salida_osmosis_ue: "",
        anillo_circulacion_ue: "",
        maquina_1_ufc: "",
        maquina_2_ufc: "",
        maquina_1_ue: "",
        maquina_2_ue: "",
        id_modalidad: null,
        id_paciente: null,
        id_periodo: null,
        id_usuario_ipress: null,
      },
      menu1: false,
      menu2: false,
      menu3: false,
      titleButton: "",
      titleCard: "",
      valid: true,
      documento: {
        id_usuario_ipress: "",
        id_fecha: "",
      },
      e6: [],
      // Esto es para almacenar las opciones seleccionadas
      comorbilidad: [
        "Enfermedades Ateroescleróticas cardiacas",
        "Insuficiencia cardíaca congestiva",
        "Enfermedad vascular periférica",
        "Accidente cerebro vascular / accidente isquémico transitorio",
        "Cáncer",
        "Diabetes",
        "Hipertensión",
        "Tuberculosis",
      ],
      cas: null,
      maestro: null,
      deleteUser: [],
      statusEdit: false,
      date: new Date().toISOString().substr(0, 10),
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      date3: new Date().toISOString().substr(0, 10),
      date4: new Date().toISOString().substr(0, 10),
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
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataMaesto: [],
      isLoading: false,
      itemsTipSex: ["MASCULINO", "FEMENINO"],
      menu1: false,
      menu2: false,
      menu4: false,
      dataEtiologia: [],
      dataPaciente: [],
      erroresForm: [],
      fieldCount: null,
      id_unidadesActuales: null,
      statusForm: false,
      formId: null
    };
  },
  methods: {
    async loadForm() {
      this.loadStatusForm();
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_usuario_ipress: sessionStorage
          .getItem("idUsuarioIpress")
          .split("/")[4],
        id_periodo_ipress: idPeriodoIpress,
        id_paciente: sessionStorage.getItem("itemPaciente").split("/")[4],
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      calidadMicroService
        .get(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          if (datos !== 0) {
            this.formId = datos[0].url;
            this.form = datos[0];
          }
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
        });
    },
    async loadStatusForm() {
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_periodo_ipress: idPeriodoIpress,
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      consultaPeriodo.consultaPeriodoEstado(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          this.statusForm =
            datos[0].numero == 1 ? false : true;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
        });
    },
    loadFecha() {
      console.log("fecha de hoy a la misma hora ", this.date);
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/fecha/?search=" + this.date, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito Data fecha", res.data);
              this.documento.id_fecha = res.data[0].url;
            })
            .catch((res) => {
              console.log("Error:", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    clearForm() {
      this.documento = {
        id_usuario_ipress: "",
        id_fecha: "",
      };
      this.form = {
        control: false,
        salida_osmosis_ufc: "",
        anillo_circulacion_ufc: "",
        salida_osmosis_ue: "",
        anillo_circulacion_ue: "",
        maquina_1_ufc: "",
        maquina_2_ufc: "",
        maquina_1_ue: "",
        maquina_2_ue: "",
      };
    },
    async submitForm() {
      if (this.formId) {
        this.editForm();
        return;
      }
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      this.dialogLoader = true;
      this.documento.id_usuario_ipress =
        sessionStorage.getItem("idUsuarioIpress");
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.form.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.form.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/"
      }
      const dataEnvio = { ...this.documento, ...this.form, ...array };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/calidadMicrobiologicas/", dataEnvio, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.formId = res.data.url;
              this.dialogLoader = false;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.loadForm();
              this.e1 = 1;
            })
            .catch((res) => {
              this.dialogLoader = false;
              console.log("Error: 88 ", res.response.data.non_field_errors[0]);
              if (
                res.response.data.non_field_errors[0] ==
                "Los campos id_fecha, id_usuario_ipress deben formar un conjunto único."
              ) {
                Swal.fire({
                  title: "¡Error!",
                  text: "¡El paciente ya cuenta con un registro en el periodo actual!",
                  icon: "error",
                  confirmButtonText: "Ok",
                });
                return;
              }
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
            });
        })
        .catch((response) => {
          this.dialogLoader = false;
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
          this.dialog = false;
          Swal.fire({
            title: "¡Error!",
            text: "¡No se registró correctamente!",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    },
    async editForm() {
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      this.dialogLoader = true;
      this.documento.id_usuario_ipress =
        sessionStorage.getItem("idUsuarioIpress");
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.form.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.form.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/"
      }
      const dataEnvio = { ...this.documento, ...this.form, ...array };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(RUTA_API + "/calidadMicrobiologicas/" + this.formId.split("/")[4] + "/", dataEnvio, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.formId = res.data.url;
              this.dialogLoader = false;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.loadForm();
              this.e1 = 1;
            })
            .catch((res) => {
              this.dialogLoader = false;
              console.log("Error: 88 ", res.response.data.non_field_errors[0]);
              if (
                res.response.data.non_field_errors[0] ==
                "Los campos id_fecha, id_usuario_ipress deben formar un conjunto único."
              ) {
                Swal.fire({
                  title: "¡Error!",
                  text: "¡El paciente ya cuenta con un registro en el periodo actual!",
                  icon: "error",
                  confirmButtonText: "Ok",
                });
                return;
              }
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
            });
        })
        .catch((response) => {
          this.dialogLoader = false;
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
          this.dialog = false;
          Swal.fire({
            title: "¡Error!",
            text: "¡No se registró correctamente!",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    },
  },
  mounted() { },
  computed: {},
  created() {
    this.loadForm();
    this.loadFecha();
    this.form.id_modalidad = sessionStorage.getItem("itemModalidad");
    this.form.id_paciente = sessionStorage.getItem("itemPaciente");
    this.form.id_periodo = sessionStorage.getItem("itemPeriodo");
    this.form.id_usuario_ipress = sessionStorage.getItem("idUsuarioIpress");
  },
  components: {
    RegistrarPaciente,
  },
};
</script>