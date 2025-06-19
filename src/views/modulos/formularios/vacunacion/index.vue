<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto" max-width="2500">
        <template>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Clínica
              </v-stepper-step>
              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">
                Vacuna
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <h4>Clínica</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete class="mt-5" v-model="detalle.red_asistencial" :items="dataRedes" item-text="red"
                      item-value="url" id="inputField" dense label="Red Asistencial"
                      :disabled="statusForm"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="detalle.turno" :items="['1', '2', '3']" label="Turno"
                      :disabled="statusForm"></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="detalle.frecuencia" :items="['L-M-V', 'M-J-S']" label="Frecuencia"
                      :disabled="statusForm"></v-select>
                  </v-col>
                </v-row>
                <div class="d-flex justify-content-right ma-1">
                  <!-- <v-btn text @click="e1 = 1"> Atrás </v-btn> -->
                  <v-btn color="primary" @click="consultaEnvio" :disabled="statusForm">
                    Continuar
                  </v-btn>
                </div>
              </v-stepper-content>
              <v-stepper-content step="3">
                <h4>Vacuna</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="e6" :items="itemsVacuna" label="Nombre de la vacuna" item-value="value"
                      item-text="label" :menu-props="{ maxHeight: '400' }" multiple chips hint="Seleccione"
                      persistent-hint @change="updateComorbilidad" :rules="[rules.required, rules.counter]"
                      :error-messages="erroresForm.e6" :disabled="statusForm"></v-select>
                  </v-col>
                </v-row>
                <v-row v-for="(item, index) in camposDinamicosTotales" :key="index">
                  <v-col cols="12" md="3">
                    <v-text-field v-model="camposDinamicosTotales[index][`tipo${index}`].value
                      " :label="item[`tipo${index}`].label"
                      :disabled="item[`tipo${index}`].disabled || statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select v-model="camposDinamicosTotales[index][`ultima_dosis${index}`]
                      .value
                      " :items="[
                        '1ra',
                        '2da',
                        '3ra',
                        '4ta',
                        '5ta',
                        '6ta',
                        '7ma',
                        '8va',
                        '9no',
                        '10mo',
                      ]" :label="item[`ultima_dosis${index}`].label" :disabled="statusForm"></v-select>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-menu v-model="camposDinamicosTotales[index][
                      `fecha_ultima_dosis${index}`
                    ].menu
                      " :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px"
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="camposDinamicosTotales[index][
                          `fecha_ultima_dosis${index}`
                        ].value
                          " label="Fecha de última dosis" hint="" persistent-hint prepend-icon="mdi-calendar" readonly
                          v-bind="attrs" v-on="on" @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="camposDinamicosTotales[index][
                        `fecha_ultima_dosis${index}`
                      ].date
                        " no-title @input="
                          computedDateFormattedCD(
                            index,
                            camposDinamicosTotales[index][
                              `fecha_ultima_dosis${index}`
                            ].date
                          )
                          "></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field v-model="camposDinamicosTotales[index][`motivo_vacuna${index}`]
                      .value
                      " :label="item[`motivo_vacuna${index}`].label" :disabled="statusForm" required></v-text-field>
                  </v-col>
                </v-row>
                <div class="d-flex justify-end" v-if="botonOtros">
                  <v-btn style="height: 2.5rem; width: 2.5rem; margin: 0.7rem" color="green" dark top right fab
                    @click="updateComorbilidadOtros" :disabled="statusForm">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn style="height: 2.5rem; width: 2.5rem; margin: 0.7rem" color="red" dark top right fab
                    @click="eliminateFields" :disabled="statusForm">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </div>
                <div class="d-flex justify-space-between ma-1">
                  <v-btn text @click="e1 = 1"> Atrás </v-btn>
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
import vacunacionService from "../../../../services/vacunacion/vacunacionService";
import { obtenerToken } from "../../../../services/authService/authService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
import consultaPeriodo from "../../../../services/script/consultaPeriodo";
export default {
  data() {
    return {
      camposDinamicosTotales: [],
      camposDinamicosOtros: [],
      countCamposOtros: 0,
      botonOtros: false,
      form: {
        ult_dosis_hepatitis: "Vacunación Contra Hepatitis B",
        ult_dosis_covid: "Vacunación contra COVID-19",
        ult_dosis_influenza: "Vacunación contra Influenza",
        ult_dosis_neumococo: "Vacunación contra Neumococo",
        otros: null,
      },
      dataRedes: [],
      countCampos: 0,
      camposDinamicos: [],
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
      itemsVacuna: [
        {
          label: "Vacunacion Contra Hepatitis B",
          value: "Vacunacion Contra Hepatitis B",
        },
        {
          label: "Vacunación contra COVID-19",
          value: "Vacunación contra COVID-19",
        },
        {
          label: "Vacunación contra Influenza",
          value: "Vacunación contra Influenza",
        },
        {
          label: "Vacunación contra Neumococo",
          value: "Vacunación contra Neumococo",
        },
        { label: "Otros", value: "Otros" },
      ],
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
        tipo_acceso: "",
        fecha_creacion_acceso: "",
        fecha_primer_ingreso: "",
        comorbilidadOtros: "",
      },
      menu1: false,
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
        red_asistencial: "",
        turno: "",
        frecuencia: "",
        id_modalidad: null,
        id_paciente: null,
        id_periodo: null,
        id_usuario_ipress: null,
        id_estado: null,
        id_red: null,
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
      casId: null,
      cas: null,
      maestro: null,
      deleteUser: [],
      statusEdit: false,
      date: new Date().toISOString().substr(0, 10),
      date1: new Date().toISOString().substr(0, 10),
      date2: new Date().toISOString().substr(0, 10),
      date3: new Date().toISOString().substr(0, 10),
      date4: new Date().toISOString().substr(0, 10),
      date5: new Date().toISOString().substr(0, 10),
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
      nuevoCodigo: false,
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataMaesto: [],
      isLoading: false,
      itemsTipSex: ["MASCULINO", "FEMENINO"],
      menu2: false,
      menu4: false,
      menu5: false,
      dataEtiologia: [],
      dataPaciente: [],
      erroresForm: [],
      fieldCount: null,
      id_vacunacion: null,
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
      vacunacionService
        .get(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          if (datos.length !== 0) {
            this.formId = datos[0].url;
            this.detalle = datos[0];
            this.detalle.red_asistencial = datos[0].datosRed.url;
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
    consultaEnvio() {
      Swal.fire({
        title: "¡Alerta!",
        text: "¿Desea registrar los cambios que se ingresaron hasta el momento?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.continueDetalle();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    },
    continueDetalle() {
      if (
        this.detalle.red_asistencial == "" ||
        this.detalle.turno == "" ||
        this.detalle.frecuencia == ""
      ) {
        Swal.fire({
          title: "¡Error!",
          text: "¡Debe completar todos los campos*!",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        this.envioForm1();
      }
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
    loadRedes() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/red/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              /*               this.dialogDataApi = true; */
              /* this.statusEdit=true; */
              console.log("exito", res.status);
              this.dataRedes = res.data;
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
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
              /* this.dataIpress.forEach((item) => {
                // Calcula el nombre completo y guárdalo en una nueva propiedad 'nombreCompleto'
                item.descripCas = `${item.datosCasOri.descripCas}`;
                item.descripMaestro = `${item.datosMaestro.descripMaestro}`;
              }); */
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
        (this.datos = {
          modalidad_inicio_trr: "",
          fecha_inicio_trr: "",
          subsistema_salud: "",
          tipo_acceso: "",
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
      (this.detalle = {
        red_asistencial: "",
        turno: "",
        frecuencia: "",
      }),
        (this.camposDinamicosTotales = []);
      this.camposDinamicosOtros = [];
      this.camposDinamicos = [];
      this.e6 = [];
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
    updateComorbilidad() {
      this.botonOtros = this.e6.includes("Otros") ? true : false;
      if (
        this.camposDinamicosTotales.length < 11 &&
        this.camposDinamicos.length == this.e6.length
      ) {
        this.camposDinamicosTotales = [];
        this.camposDinamicosOtros = [];
        this.camposDinamicosTotales.push(...this.camposDinamicos);
        this.camposDinamicosTotales.push(...this.camposDinamicosOtros);
      }
      if (
        this.camposDinamicosTotales.length < 11 &&
        this.camposDinamicos.length + 1 == this.e6.length
      ) {
        this.camposDinamicosOtros = [];
        let value_input =
          this.e6[this.e6.length - 1] == "Otros"
            ? ""
            : this.e6[this.e6.length - 1];
        let disable_input =
          this.e6[this.e6.length - 1] == "Otros" ? false : true;
        this.camposDinamicosTotales = [];
        const newDocumento = {};
        newDocumento[`tipo${this.camposDinamicos.length}`] = {
          value: `${value_input}`,
          label: "Tipo",
          disabled: disable_input,
        };
        newDocumento[`ultima_dosis${this.camposDinamicos.length}`] = {
          value: "",
          label: "Última dosis administrada",
        };
        newDocumento[`fecha_ultima_dosis${this.camposDinamicos.length}`] = {
          value: "",
          label: "Fecha de última dosis",
          date: new Date().toISOString().substr(0, 10),
          menu: false,
        };
        newDocumento[`motivo_vacuna${this.camposDinamicos.length}`] = {
          value: "",
          label: "Motivo de no vacunación",
        };
        this.camposDinamicos.push(newDocumento);
        this.camposDinamicosTotales.push(...this.camposDinamicos);
        this.camposDinamicosTotales.push(...this.camposDinamicosOtros);
      }
      if (
        this.camposDinamicosTotales.length < 11 &&
        this.camposDinamicos.length - 1 == this.e6.length
      ) {
        this.camposDinamicos = [];
        this.camposDinamicosOtros = [];
        this.countCampos = 0;
        for (let j = 0; j < this.e6.length; j++) {
          let value_input = this.e6[j] == "Otros" ? "" : this.e6[j];
          let disable_input = this.e6[j] == "Otros" ? false : true;
          const newDocumento = {};
          newDocumento[`tipo${this.camposDinamicos.length}`] = {
            value: `${value_input}`,
            label: "Tipo",
            disabled: disable_input,
          };
          newDocumento[`ultima_dosis${this.camposDinamicos.length}`] = {
            value: "",
            label: "Última dosis administrada",
          };
          newDocumento[`fecha_ultima_dosis${this.camposDinamicos.length}`] = {
            value: "",
            label: "Fecha de última dosis",
            date: new Date().toISOString().substr(0, 10),
            menu: false,
          };
          newDocumento[`motivo_vacuna${this.camposDinamicos.length}`] = {
            value: "",
            label: "Motivo de no vacunación",
          };
          this.camposDinamicos.push(newDocumento);
        }
        this.camposDinamicosTotales = [];
        this.camposDinamicosTotales.push(...this.camposDinamicos);
        this.camposDinamicosTotales.push(...this.camposDinamicosOtros);
      }
    },
    updateComorbilidadOtros() {
      if (this.camposDinamicosTotales.length < 10) {
        const newDocumento = {};
        newDocumento[`tipo${this.camposDinamicosTotales.length}`] = {
          value: "",
          label: "Tipo",
        };
        newDocumento[`ultima_dosis${this.camposDinamicosTotales.length}`] = {
          value: "",
          label: "Última dosis administrada",
          disabled: false,
        };
        newDocumento[
          `fecha_ultima_dosis${this.camposDinamicosTotales.length}`
        ] = {
          value: "",
          label: "Fecha de última dosis",
          date: new Date().toISOString().substr(0, 10),
          menu: false,
        };
        newDocumento[`motivo_vacuna${this.camposDinamicosTotales.length}`] = {
          value: "",
          label: "Motivo de no vacunación",
        };
        this.camposDinamicosOtros.push(newDocumento);
        this.camposDinamicosTotales = [];
        this.camposDinamicosTotales.push(...this.camposDinamicos);
        this.camposDinamicosTotales.push(...this.camposDinamicosOtros);
        this.countCamposOtros++;
      }
    },
    eliminateFields() {
      if (this.camposDinamicosOtros.length > 0) {
        this.camposDinamicosTotales = [];
        this.camposDinamicosOtros.pop();
        this.camposDinamicosTotales.push(...this.camposDinamicos);
        this.camposDinamicosTotales.push(...this.camposDinamicosOtros);
      }
    },
    computedDateFormattedCD(index, date) {
      this.camposDinamicos[index][`fecha_ultima_dosis${index}`].value =
        this.formatDate(date);
      this.camposDinamicos[index][`fecha_ultima_dosis${index}`].menu = false;
    },
    async envioForm1() {

      /* console.log("formulario", this.formId)
      return */
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
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.detalle.id_estado = extractedUrl + "estados/" + 1 + "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/"
      }
      this.detalle.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      this.detalle.id_red = this.detalle.red_asistencial;
      const dataEnvio1 = { ...this.documento, ...this.detalle, ...array };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/vacunaciones/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.$emit("loadPorcentajeForm");
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.formId = res.data.url;
              this.loadForm();
              this.id_vacunacion = res.data.url;
              this.e1 = 3;
              this.dialogEdit = false;
            })
            .catch((res) => {
              if (
                res.response.data.non_field_errors[0] ==
                "Los campos id_fecha, id_paciente deben formar un conjunto único."
              ) {
                Swal.fire({
                  title: "¡Error!",
                  text: "¡El paciente ya cuenta con un registro en el periodo actual!",
                  icon: "error",
                  confirmButtonText: "Ok",
                });
                this.dialogLoader = false;
                return;
              }
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
              this.dialogLoader = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    async editForm() {
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.detalle.id_estado = extractedUrl + "estados/" + 1 + "/";
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/"
      }
      this.detalle.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      this.detalle.id_red = this.detalle.red_asistencial;
      const dataEnvio1 = { ...this.documento, ...this.detalle, ...array };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(RUTA_API + "/vacunaciones/" + this.formId.split("/")[4] + "/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.loadForm();
              this.formId = res.data.url;
              this.id_vacunacion = res.data.url;
              this.e1 = 3;
              this.dialogEdit = false;
            })
            .catch((res) => {
              if (
                res.response.data.non_field_errors[0] ==
                "Los campos id_fecha, id_paciente deben formar un conjunto único."
              ) {
                Swal.fire({
                  title: "¡Error!",
                  text: "¡El paciente ya cuenta con un registro en el periodo actual!",
                  icon: "error",
                  confirmButtonText: "Ok",
                });
                this.dialogLoader = false;
                return;
              }
              Swal.fire({
                title: "¡Error!",
                text: "¡No se pudo registrar el formulario!",
                icon: "error",
                confirmButtonText: "Ok",
              });
              this.dialogLoader = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    envioDetalles() {
      for (let i = 0; i < this.camposDinamicosTotales.length; i++) {
        const element = this.camposDinamicosTotales[i];
        if (
          element[`tipo${i}`].value == "" ||
          element[`ultima_dosis${i}`].value == "" ||
          element[`fecha_ultima_dosis${i}`].value == "" ||
          element[`motivo_vacuna${i}`].value == ""
        ) {
          Swal.fire({
            title: "¡Error!",
            text: "¡Debe complpetar todos los campos!",
            icon: "error",
            confirmButtonText: "Ok",
          });
          return;
        }
      }
      for (let i = 0; i < this.camposDinamicosTotales.length; i++) {
        const element = this.camposDinamicosTotales[i];
        axios
          .post(RUTA_API + "/api/token/", {
            username: USUARIO,
            password: PASSWORD,
          })
          .then((response) => {
            this.auth = "Bearer " + response.data.access;
            axios
              .post(
                RUTA_API + "/vacunacionesDetalles/",
                {
                  id_vacunacion: this.id_vacunacion,
                  tipo_vacuna: element[`tipo${i}`].date,
                  nro_dosis: element[`ultima_dosis${i}`].value,
                  fecha_dosis: element[`fecha_ultima_dosis${i}`].date,
                  motivo_no_vacunacion: element[`motivo_vacuna${i}`].date,
                },
                {
                  headers: { Authorization: this.auth },
                }
              )
              .then((res) => {
                if (this.camposDinamicosTotales.length - 1 == i) {
                  Swal.fire({
                    title: "!Exito!",
                    text: "¡Se registró correctamente el formulario!",
                    icon: "success",
                    confirmButtonText: "Ok",
                  });
                  this.e1 = 1;
                  this.clearForm();
                  this.loadFecha();

                  this.documento.id_usuario_ipress =
                    sessionStorage.getItem("idUsuarioIpress");
                }
              })
              .catch((res) => {
                Swal.fire({
                  title: "¡Error!",
                  text: "¡Error al registrar!",
                  icon: "error",
                  confirmButtonText: "Ok",
                });
                this.dialogLoader = false;
                return;
              });
          })
          .catch((response) => {
            response === 404
              ? console.warn("lo sientimos no tenemos servicios")
              : console.warn("Error:", response);
          });
      }
    },
  },
  mounted() { },
  computed: {
    itemsArray() {
      // Convertir objeto en una matriz de objetos
      return Object.keys(this.itemsVacuna).map((key) => ({
        value: key,
        text: this.itemsVacuna[key],
      }));
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
    computedDateFormatted5() {
      return this.formatDate(this.date5);
    },
  },
  created() {
    this.loadFecha();
    this.loadPaciente();
    this.dataInit();
    this.loadRedes();
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