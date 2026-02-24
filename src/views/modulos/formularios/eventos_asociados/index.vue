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
              <v-divider></v-divider>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <h4>Detalle</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="detalle.tipo_acceso_vascular" :items="['Nuevo', 'Continuador']"
                      label="Tipo de Acceso Vascular" :error-messages="erroresForm.tipo_acceso_vascular"
                      @keydown.enter.prevent :disabled="statusForm" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted1" label="Fecha de Evento" hint="" persistent-hint
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" @keydown.enter.prevent
                          :rules="[rules.required, rules.counter]" :error-messages="erroresForm.date1"
                          :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted2" label="Inicio de tratamiento antmicrobiel IV"
                          hint="" persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :error-messages="erroresForm.date2" :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu3" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted3" label="Inicio de vancomicia IV" hint=""
                          persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :error-messages="erroresForm.date3" :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="date3" no-title @input="menu3 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="detalle.hemocultivo_positivo" :items="['Positivo', 'Negativo']"
                      label="Hemocultivo Positivo" :error-messages="erroresForm.hemocultivo_positivo"
                      @keydown.enter.prevent :disabled="statusForm" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="detalle.estado_acceso_vascular" :items="['Positivo', 'Negativo']"
                      label="Pus, enrojecimiento o aumento de volumen en el lugar de AV."
                      :error-messages="erroresForm.estado_acceso_vascular" @keydown.enter.prevent :disabled="statusForm"
                      required></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="detalle.observaciones" label="Observaciones"
                      :error-messages="erroresForm.observaciones" @keydown.enter.prevent :disabled="statusForm"
                      required></v-text-field>
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
          <v-dialog v-model="dialogEdit" v-if="dialogEdit" max-width="900px">
            <RegistrarPaciente @editClose="editClose" :idPaciente="null" />
          </v-dialog>
        </template>
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
import eventosAccesoService from "../../../../services/eventosAcceso/eventosAccesoService";
import { obtenerToken } from "../../../../services/authService/authService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
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
      datos: {
        modalidad_inicio_trr: "",
        fecha_inicio_trr: "",
        subsistema_salud: "",
        tipo_acceso_vascular: "",
        fecha_creacion_acceso: "",
        fecha_primer_ingreso: "",
        comorbilidadOtros: "",
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
        id_paciente: null,
        tipo: "",
        numero: "",
        autogenerado: "",
        apellidosNombres: "",
        fecha_nacimiento: "",
        edad: "",
        sexo: "",
        id_fecha: "",
      },
      detalle: {
        fecha_evento: null,
        tipo_acceso_vascular: "",
        inicio_antmicrobial: "",
        inicio_vancomicina: "",
        hemocultivo_positivo: "",
        observaciones: "",
        estado_acceso_vascular: "",
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
      ipressData: {
        codigo_unico: null,
        ipress: null,
        ruc: null,
        tipo_institucion: null,
        ubigeo: null,
        direccion: null,
        codigo_disa: null,
        disa: null,
        codigo_red: null,
        red: null,
        codigo_microred: null,
        microred: null,
        categoria: null,
        telefono: null,
        inicio_actividades: null,
        horario_atencion: null,
        estado: 1,
      },
      docuemento: {
        documento: null,
        tipo_documento: null,
        autogenerado: null,
        paciente: null,
        fecha_nacimiento: null,
        genero: null,
        grado_instruccion: null,
      },
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

      const array = {
        id_modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
        id_usuario_ipress: sessionStorage
          .getItem("idUsuarioIpress")
          .split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_paciente: sessionStorage.getItem("itemPaciente").split("/")[4],
      };
      this.dialogLoader = true;
      const token = await obtenerToken();
      eventosAccesoService
        .get(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          if (datos.length !== 0) {
            this.formId = datos[0].url;
            this.detalle = datos[0];
            this.date1 = datos[0].fecha_evento;
            this.date2 = datos[0].inicio_antmicrobial;
            this.date3 = datos[0].inicio_vancomicina;
          }
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
        });
    },
    editClose(item) {
      console.log("valores de item desde el componente hijo", item);
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
        /* Swal.fire({
          title: "¡Alerta!",
          text: "¡El paciente no se encuentra registrado!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        this.dialogEdit = true;
        return; */
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
              this.dialogLoader = false;
              /* this.dataIpress.forEach((item) => {
                // Calcula el nombre completo y guárdalo en una nueva propiedad 'nombreCompleto'
                item.descripCas = `${item.datosCasOri.descripCas}`;
                item.descripMaestro = `${item.datosMaestro.descripMaestro}`;
              }); */
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialogLoader = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    loadPaciente() {
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
              this.dataPaciente = res.data;
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
    formatearFecha(fecha) {
      // Dividir la fecha en partes: año, mes y día
      const partes = fecha.split("-");
      // Crear una nueva fecha con el formato "mm-dd-yyyy"
      const nuevaFecha = new Date(`${partes[1]}/${partes[2]}/${partes[0]}`);
      // Obtener el mes, día y año de la nueva fecha
      const mes = nuevaFecha.getMonth() + 1;
      const dia = nuevaFecha.getDate();
      const año = nuevaFecha.getFullYear();
      // Formatear la fecha en el formato deseado
      return `${mes.toString().padStart(2, "0")}-${dia
        .toString()
        .padStart(2, "0")}-${año}`;
    },
    clearForm() {
      (this.date1 = new Date().toISOString().substr(0, 10)),
        (this.date2 = new Date().toISOString().substr(0, 10)),
        (this.date3 = new Date().toISOString().substr(0, 10)),
        (this.date4 = new Date().toISOString().substr(0, 10)),
        (this.datos = {
          modalidad_inicio_trr: "",
          fecha_inicio_trr: "",
          subsistema_salud: "",
          tipo_acceso_vascular: "",
          fecha_creacion_acceso: "",
          fecha_primer_ingreso: "",
          comorbilidadOtros: "",
        });
      this.documento = {
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
      };
      this.detalle = {
        fecha_evento: null,
        tipo_acceso_vascular: "",
        inicio_antmicrobial: "",
        inicio_vancomicina: "",
        hemocultivo_positivo: "",
        observaciones: "",
        estado_acceso_vascular: "",
      };
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
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
    async editForm() {
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      this.dialogLoader = true;
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.datos.id_estado = extractedUrl + "estados/" + 1 + "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
      };
      this.datos.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      this.detalle.fecha_evento = this.date1;
      this.detalle.inicio_antmicrobial = this.date2;
      this.detalle.inicio_vancomicina = this.date3;
      const dataEnvio1 = { ...this.documento, ...this.datos, ...this.detalle, ...array };

      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(RUTA_API + "/eventosAccesosVascularesPaginacion/" + this.formId.split("/")[4] + "/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.formId = res.data.url;
              this.dialogLoader = false;
              console.log("exito", res.status);
              this.id_unidadesActuales = res.data.url;
              this.e1 = 1;
              this.dialogEdit = false;
              /* this.clearForm(); */
              this.loadForm();
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialog = false;
              this.dialogLoader = false;
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    async envioDetalles() {
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
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.datos.id_estado = extractedUrl + "estados/" + 1 + "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
      };
      this.datos.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      this.detalle.fecha_evento = this.date1;
      this.detalle.inicio_antmicrobial = this.date2;
      this.detalle.inicio_vancomicina = this.date3;
      const dataEnvio1 = { ...this.documento, ...this.datos, ...this.detalle, ...array };

      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/eventosAccesosVascularesPaginacion/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.dialogLoader = false;
              console.log("exito", res.status);
              this.id_unidadesActuales = res.data.url;
              this.e1 = 1;
              this.dialogEdit = false;
              /* this.clearForm(); */
              this.loadForm();
            })
            .catch((res) => {
              console.log("Error:", res);
              this.dialog = false;
              this.dialogLoader = false;
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    validarCampos() {
      let status = false;

      if (!this.datos.modalidad_inicio_trr) {
        this.erroresForm.modalidad_inicio_trr = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.date1) {
        this.erroresForm.date1 = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.datos.subsistema_salud) {
        this.erroresForm.subsistema_salud = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.datos.tipo_acceso_vascular) {
        this.erroresForm.tipo_acceso_vascular = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.date2) {
        this.erroresForm.date2 = ["El campo es obligatorio."];
        status = true;
      }
      if (!this.date3) {
        this.erroresForm.date3 = ["El campo es obligatorio."];
        status = true;
      }
      if (status) {
        Swal.fire({
          title: "¡Error!",
          text: "¡Se debe completar todos los campos!",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      this.submitForm();
    },
    updateComorbilidad() {
      // Reinicia todos los campos de comorbilidad
      this.documento.enf_ateroesclerotica_cardiaca = "";
      this.documento.enf_insuficiencia_cardiaca_congestiva = "";
      this.documento.enf_vascular_periferica = "";
      this.documento.enf_cerebro_vascular = "";
      this.documento.enf_cancer = "";
      this.documento.enf_diabetes = "";
      this.documento.enf_hipertension = "";
      this.documento.enf_tuberculosis = "";

      // Asigna los valores seleccionados a los campos correspondientes
      for (const comorbilidad of this.e6) {
        switch (comorbilidad) {
          case "Enfermedades Ateroescleróticas cardiacas":
            this.documento.enf_ateroesclerotica_cardiaca = 1;
            break;
          case "Insuficiencia cardíaca congestiva":
            this.documento.enf_insuficiencia_cardiaca_congestiva = 1;
            break;
          case "Enfermedad vascular periférica":
            this.documento.enf_vascular_periferica = 1;
            break;
          case "Accidente cerebro vascular / accidente isquémico transitorio":
            this.documento.enf_cerebro_vascular = 1;
            break;
          case "Cáncer":
            this.documento.enf_cancer = 1;
            break;
          case "Diabetes":
            this.documento.enf_diabetes = 1;
            break;
          case "Hipertensión":
            this.documento.enf_hipertension = 1;
            break;
          case "Tuberculosis":
            this.documento.enf_tuberculosis = 1;
            break;
          default:
            break;
        }
      }
    },
  },
  mounted() {
    /* var input = document.getElementById("Num_doc");
    console.log(input);
    input.focus(); */
    /* input.add("focus"); */
  },
  computed: {
    subtotal() {
      return this.products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );
    },
    filteredData() {
      if (!this.searchRed && !this.searchIpress) {
        return this.dataIpress;
      }
      let filtered = this.dataIpress;
      if (this.searchIpress) {
        filtered = filtered.filter((item) =>
          item.ipress.toLowerCase().includes(this.searchIpress.toLowerCase())
        );
      }
      if (this.searchRed) {
        filtered = filtered.filter((item) =>
          item.red.toLowerCase().includes(this.searchRed.toLowerCase())
        );
      }
      return filtered;
    },
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
    customDateFormat() {
      return (val) => {
        const date = new Date(val);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Asegurarse de que el día y el mes tienen dos dígitos
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;

        return `${day}-${month}-${year}`;
      };
    },
    fechaFormateada: {
      get() {
        return this.datos.fecha_creacion_acceso;
      },
      set(value) {
        // Convierte la fecha al formato "dd-mm-yyyy"
        const date = new Date(value);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        // Asegurarse de que el día y el mes tienen dos dígitos
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;

        // Establece la fecha formateada de nuevo en el modelo
        this.datos.fecha_creacion_acceso = `${day}-${month}-${year}`;
      },
    },
  },
  created() {
    this.loadFecha();
    this.loadPaciente();
    this.dataInit();
    this.loadForm();
    this.datos.id_modalidad = sessionStorage.getItem("itemModalidad");
    this.datos.id_paciente = sessionStorage.getItem("itemPaciente");
    this.datos.id_periodo = sessionStorage.getItem("itemPeriodo");
    this.datos.id_usuario_ipress = sessionStorage.getItem("idUsuarioIpress");
  },
  components: {
    RegistrarPaciente,
  },
};
</script>