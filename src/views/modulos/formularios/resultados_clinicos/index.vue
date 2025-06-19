<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto" max-width="2500">
        <template>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-divider></v-divider>
              <v-stepper-step :complete="e1 > 1" step="1">
                Condiciones
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <h4>Detalle</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.Hb" label="Hb (gr/dl)" :error-messages="erroresForm.Hb" required
                      type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.calcio" label="Calcio (mg/dl)" :error-messages="erroresForm.calcio"
                      required type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.fosforo" label="Fosforo (mg/dl)"
                      :error-messages="erroresForm.fosforo" required type="number" step="any"
                      :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.PTHi" label="PTHi (pg/ml)" :error-messages="erroresForm.PTHi"
                      required type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.Alb" label="Alb (gr/dl)" :error-messages="erroresForm.Alb" required
                      type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.calcio_corregido" label="Calcio corregido (mg/dl)"
                      :error-messages="erroresForm.calcio_corregido" required type="number" step="any"
                      :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.ktv" label="Kt/v (gr/dl)" :error-messages="erroresForm.ktv" required
                      type="number" step="any" :disabled="statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.tiempo_dialisis" label="Tiempo de dialisis (horas)" value="12:30:00"
                      type="time" :error-messages="erroresForm.tiempo_dialisis" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <h4>Tramientos</h4>
                <v-divider></v-divider>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-switch v-model="detalle.eritoproyetina" :label="`Eritoproyetina`"
                      :disabled="statusForm"></v-switch>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch v-model="detalle.hierro" :label="`Hierro`" :disabled="statusForm"></v-switch>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-switch v-model="detalle.hiperparatioidismo" :label="`Hiperparatioidismo`"
                      :disabled="statusForm"></v-switch>
                  </v-col>
                </v-row>
                <div class="d-flex justify-space-between ma-1">
                  <v-btn color="primary" @click="envioDetalles" :disabled="statusForm">
                    Enviar
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </template>
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
        </v-dialog> </v-card></v-container>
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
import resultClinicoService from "../../../../services/resultClinicos/resultClinicoService";
import { obtenerToken } from "../../../../services/authService/authService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
import consultaPeriodo from "../../../../services/script/consultaPeriodo";
export default {
  data() {
    return {
      dialogLoader: false,
      e1: 1,
      step: 1,
      ver: false,
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
      menu1: false,
      menu2: false,
      menu3: false,
      titleButton: "",
      titleCard: "",
      valid: true,
      documento: {
        id_paciente: null,
        tipo: "",
        numero: "",
        autogenerado: "",
        apellidosNombres: "",
        fecha_nacimiento: "",
        edad: "",
        sexo: "",
        id_usuario_ipress: "",
        id_fecha: "",
      },
      detalle: {
        Hb: "",
        calcio: "",
        fosforo: "",
        PTHi: "",
        Alb: "",
        calcio_corregido: "",
        ktv: "",
        tiempo_dialisis: "",
        eritoproyetina: false,
        hierro: false,
        hiperparatioidismo: false,
        id_modalidad: null,
        id_paciente: null,
        id_periodo: null,
        id_usuario_ipress: null,
      },
      cas: null,
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
      dataCas: [],
      dataMaesto: [],
      isLoading: false,
      menu1: false,
      menu2: false,
      menu4: false,
      dataPaciente: [],
      erroresForm: [],
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
      resultClinicoService
        .get(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          if (datos.length !== 0) {
            this.formId = datos[0].url;
            this.detalle = datos[0];
            this.date1 = datos[0].fecha_inicio_trr;
            this.date2 = datos[0].fecha_creacion_acceso;
            this.date3 = datos[0].fecha_primer_ingreso;
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
    editClose(item) {
      if (item.estado == true) {
        Swal.fire({
          title: "¡Exito!",
          text: "¡Se registró correctamente al paciente!",
          icon: "success",
          confirmButtonText: "Ok",
        });
        this.documento.numero = item.documento;
        this.documento.tipo = item.tipo_documento;
        this.documento.apellidosNombres = item.paciente;
        this.documento.autogenerado = item.autogenerado;
        this.documento.sexo = item.genero;
        this.documento.edad = this.calculateAge(item.fecha_nacimiento);
        this.documento.fecha_nacimiento = item.fecha_nacimiento;
        this.documento.gradoInstruccion = item.grado_instruccion;
      } else if (item.estado == false) {
        Swal.fire({
          title: "¡Error!",
          text: "¡No registró correctamente al paciente!",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
      this.loadFecha();
      this.loadPaciente();
      this.dataInit();
      this.dialogEdit = false;
    },
    continuePaciente() {
      if (this.documento.numero == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡Ingrese el número de documento del paciente!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (this.documento.apellidosNombres == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡El paciente no se encuentra registrado!¿Desea registrar un nuevo paciente?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogEdit = true;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Aquí colocas la lógica que se ejecutará si el usuario hace clic en "No" o fuera del modal
            console.log("El usuario hizo clic en No o cerró el modal");
          }
        });
        return;
      }
      this.e1 = 2;
    },
    dataInit() {
      this.isLoading = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/ipress/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res);
              this.isLoading = false;
              this.dataIpress = res.data;
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
    loadPaciente() {
      this.dialogLoader = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/paciente/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exitocAS", res.data);
              this.dialogLoader = false;
              this.dataPaciente = res.data;
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialogLoader = false;
            });
        })
        .catch((response) => {
          this.dialogLoader = false;
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    updatePaciente() {
      for (const i in this.dataPaciente) {
        const element = this.dataPaciente[i];
        // Tu lógica aquí
        if (element.documento == this.documento.numero) {
          this.documento.tipo = element.tipo_documento;
          this.documento.autogenerado = element.autogenerado;
          this.documento.apellidosNombres = element.paciente;
          this.documento.fecha_nacimiento = this.formatDates(
            element.fecha_nacimiento
          );
          this.documento.edad = this.calculateAge(element.fecha_nacimiento);
          this.documento.sexo = element.genero;
          this.documento.gradoInstruccion = element.grado_instruccion;
          this.documento.id_paciente = element.url;
          break;
        }
        if (element.documento != this.documento.numero) {
          this.documento.tipo = "";
          this.documento.autogenerado = "";
          this.documento.apellidosNombres = "";
          this.documento.fecha_nacimiento = "";
          this.documento.edad = "";
          this.documento.sexo = "";
          this.documento.gradoInstruccion = "";
        }
      }
    },
    loadFecha() {
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
      (this.date1 = new Date().toISOString().substr(0, 10)),
        (this.date2 = new Date().toISOString().substr(0, 10)),
        (this.date3 = new Date().toISOString().substr(0, 10)),
        (this.date4 = new Date().toISOString().substr(0, 10)),
        (this.documento = {
          id_paciente: null,
          tipo: "",
          numero: "",
          autogenerado: "",
          apellidosNombres: "",
          fecha_nacimiento: "",
          edad: "",
          sexo: "",
          id_usuario_ipress: "",
          id_fecha: "",
        }),
        (this.detalle = {
          Hb: "",
          calcio: "",
          fosforo: "",
          PTHi: "",
          Alb: "",
          calcio_corregido: "",
          ktv: "",
          tiempo_dialisis: "",
          eritoproyetina: false,
          hierro: false,
          hiperparatioidismo: false,
        });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    formatDates(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
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
    async envioDetalles() {
      if (this.formId) {
        this.editForm();
        return;
      }
      this.dialogLoader = true;
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.detalle.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.detalle.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
      };
      const dataEnvio1 = { ...this.documento, ...this.detalle, ...array };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/resultadosClinicos/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dialogLoader = false;
              console.log("exito", res.status);
              this.formId = res.data.url;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.loadForm();
              this.id_unidadesActuales = res.data.url;
              this.e1 = 1;
              this.dialogEdit = false;
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialogLoader = false;
              this.dialog = false;
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
        });
    },
    async editForm() {
      this.dialogLoader = true;
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.detalle.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.detalle.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
      };
      const dataEnvio1 = { ...this.documento, ...this.detalle, ...array };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(RUTA_API + "/resultadosClinicos/" + this.formId.split("/")[4] + "/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dialogLoader = false;
              console.log("exito", res.status);
              this.formId = res.data.url;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.loadForm();
              this.id_unidadesActuales = res.data.url;
              this.e1 = 1;
              this.dialogEdit = false;
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialogLoader = false;
              this.dialog = false;
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
        });
    },
  },
  mounted() { },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
    computedDateFormatted1() {
      return this.formatDate(this.date1);
    },
    computedDateFormatted2() {
      return this.formatDate(this.date2);
    },
    computedDateFormatted3() {
      return this.formatDate(this.date3);
    },
    computedDateFormatted4() {
      return this.formatDate(this.date4);
    },
  },
  created() {
    this.loadFecha();
    this.loadPaciente();
    this.dataInit();
    this.loadForm();
    this.detalle.id_modalidad = sessionStorage.getItem("itemModalidad");
    this.detalle.id_paciente = sessionStorage.getItem("itemPaciente");
    this.detalle.id_periodo = sessionStorage.getItem("itemPeriodo");
    this.detalle.id_usuario_ipress = sessionStorage.getItem("idUsuarioIpress");
  },
  components: {
    RegistrarPaciente,
  },
};
</script>