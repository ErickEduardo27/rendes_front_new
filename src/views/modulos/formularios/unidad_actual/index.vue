<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important; padding: 0">
      <v-card max-width="2500">
        <template>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Condiciones
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2" :complete="e1 > 2">
                Egreso/Reingreso
              </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <h4>Condiciones</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted1" label="Fecha Ingreso/ Reingreso a Unidad" hint=""
                          persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :error-messages="erroresForm.date1" :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <!-- <v-col cols="12" md="6">
                    <v-select
                      v-model="condiciones.condicion_paciente"
                      :items="['Nuevo', 'Continuador']"
                      label="Condición del Paciente en Unidad"
                      @keydown.enter.prevent
                      :disabled="statusForm"
                      required
                    ></v-select>
                  </v-col> -->
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.condicion_paciente" :items="arrayTipoPaciente" label="Tipo paciente"
                      item-text="tipo_paciente" item-value="url"></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="condiciones.id_red" :items="dataRedes" item-text="red" item-value="url"
                      id="inputField" dense :disabled="statusForm" label="Hospital de Procedencia"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.VHB" :items="['Positivo', 'Negativo']" label="VHB"
                      :error-messages="erroresForm.VHB" @keydown.enter.prevent :disabled="statusForm"
                      required></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.VHC" :items="['Positivo', 'Negativo']" label="VHC"
                      :error-messages="erroresForm.VHC" @keydown.enter.prevent :disabled="statusForm"
                      required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.VHI" :items="['Positivo', 'Negativo']" label="VHI"
                      :error-messages="erroresForm.VHI" @keydown.enter.prevent :disabled="statusForm"
                      required></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.AcHBs" :items="['< 10 UI/L', '> = 10 UI/L', 'Desconocido']"
                      label="Título De AcHBs" :error-messages="erroresForm.AcHBs" @keydown.enter.prevent
                      :disabled="statusForm" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.tipo_acceso" :items="['CVCT', 'FAV', 'CVCP']"
                      label="Tipo de Acceso Actual" :error-messages="erroresForm.tipo_acceso" @keydown.enter.prevent
                      :disabled="statusForm" required></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="condiciones.motivo_cambio_acceso" :items="['', 'Prescripción Médica']"
                      label="Motivo Cambio de Acceso" :error-messages="erroresForm.motivo_cambio_acceso"
                      @keydown.enter.prevent :disabled="statusForm" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted2" label="Fecha Creación de Acceso Actual" hint=""
                          persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" :disabled="statusForm"
                          v-on="on" @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :error-messages="erroresForm.date2"></v-text-field>
                      </template>
                      <v-date-picker v-model="date2" no-title @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <div class="d-flex justify-space-between ma-1">
                  <v-btn color="primary" @click="consultaEnvio" :disabled="statusForm">
                    Continuar
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <h4>Egreso/Reingreso</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" sm="4">
                    <h4>¿El paciente egresó?</h4>
                    <div class="d-flex">
                      <v-checkbox v-model="titularSi" :label="`Sí`" style="margin-right: 1rem"
                        @click="updateEstado('titularSi')"></v-checkbox>
                      <v-checkbox v-model="titularNo" :label="`No`" @click="updateEstado('titularNo')"></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
                <v-row v-for="(item, index) in camposDinamicos" :key="index">
                  <v-col cols="12" sm="4">
                    <v-menu v-model="camposDinamicos[index][`fecha_egreso${index}`].menu
                      " :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px"
                      min-width="auto" :disabled="!titularSi || statusForm">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="camposDinamicos[index][`fecha_egreso${index}`].value
                          " label="Fecha Creación de Acceso Actual" hint="" persistent-hint prepend-icon="mdi-calendar"
                          readonly v-bind="attrs" v-on="on" :disabled="!titularSi || statusForm" @keydown.enter.prevent
                          :rules="[rules.required, rules.counter]"></v-text-field>
                      </template>
                      <v-date-picker v-model="camposDinamicos[index][`fecha_egreso${index}`].date
                        " no-title @input="
                          computedDateFormatted5(
                            index,
                            camposDinamicos[index][`fecha_egreso${index}`].date
                          )
                          "></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field v-model="camposDinamicos[index][`tipo_egreso${index}`].value
                      " :label="item[`tipo_egreso${index}`].label" :disabled="!titularSi || statusForm"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-menu v-model="camposDinamicos[index][`fecha_reingreso${index}`].menu
                      " :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px"
                      min-width="auto" :disabled="!titularSi">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="camposDinamicos[index][`fecha_reingreso${index}`]
                          .value
                          " :label="item[`fecha_reingreso${index}`].label" hint="" persistent-hint
                          prepend-icon="mdi-calendar" readonly :disabled="!titularSi || statusForm" v-bind="attrs"
                          v-on="on" @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :error-messages="erroresForm.date0"></v-text-field>
                      </template>
                      <v-date-picker v-model="camposDinamicos[index][`fecha_reingreso${index}`].date
                        " no-title @input="
                          computedDateFormatted6(
                            index,
                            camposDinamicos[index][`fecha_reingreso${index}`]
                              .date
                          )
                          "></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <div class="d-flex justify-end" v-if="titularSi">
                  <v-btn style="height: 2.5rem; width: 2.5rem; margin: 0.7rem" color="green" dark top right fab
                    @click="duplicateFields" :disabled="statusForm">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn style="height: 2.5rem; width: 2.5rem; margin: 0.7rem" color="red" dark top right fab
                    @click="eliminateFields" :disabled="statusForm">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </div>
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
import unidadActualService from "../../../../services/unidadActual/unidadActualService";
import { obtenerToken } from "../../../../services/authService/authService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
import consultaPeriodo from "../../../../services/script/consultaPeriodo";
import tipoPacienteService from '../../../../services/tipoPaciente/tipoPacienteService';
export default {
  data() {
    return {
      arrayTipoPaciente: [],
      condiciones: {
        fecha_creacion_acceso: null,
        condicion_paciente: null,
        hospital_proce: null,
        id_red: null,
        VHB: null,
        VHC: null,
        VHI: null,
        AcHBs: null,
        tipo_acceso: null,
        motivo_cambio_acceso: null,
        fecha_acceso: null,
        id_modalidad: null,
        id_paciente: null,
        id_periodo: null,
        id_usuario_ipress: null,
      },
      titularSi: false,
      titularNo: true,
      dialogLoader: false,
      dataRedes: [],
      countCampos: 1,
      camposDinamicos: [
        {
          fecha_egreso0: {
            value: "",
            label: "Fecha Egreso",
            date: new Date().toISOString().substr(0, 10),
            menu: false,
          },
          tipo_egreso0: { value: "", label: "Tipo Egreso" },
          fecha_reingreso0: {
            value: "",
            label: "Fecha Reingreso",
            date: new Date().toISOString().substr(0, 10),
            menu: false,
          },
        },
      ],
      e1: 1,
      step: 1,
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
      menu2: false,
      menu3: false,
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
    async loadTipoPacientes() {
      this.dialogLoader = true;
      const token = await obtenerToken();
      tipoPacienteService
        .getTipoPacientes(token)
        .then((res) => {
          this.dialogLoader = false;
          this.arrayTipoPaciente = res.data;
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false;
        });
    },
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
      unidadActualService
        .get(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          if (datos.length !== 0) {
            this.formId = datos[0].url;
            this.condiciones = datos[0];
            this.date1 = datos[0].fecha_ingreso;
            this.date2 = datos[0].fecha_creacion_acceso;
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
    updateEstado(selectedCheckbox) {
      if (selectedCheckbox === "titularSi" && !this.titularSi) {
        this.titularNo = true;
      } else if (selectedCheckbox === "titularNo" && !this.titularNo) {
        this.titularSi = true;
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
    duplicateFields() {
      if (this.camposDinamicos.length < 11) {
        const newDocumento = {};
        newDocumento[`fecha_egreso${this.countCampos}`] = {
          value: "",
          label: "Fecha Egreso",
          date: new Date().toISOString().substr(0, 10),
          menu: false,
        };
        newDocumento[`tipo_egreso${this.countCampos}`] = {
          value: "",
          label: "Tipo Egreso",
        };
        newDocumento[`fecha_reingreso${this.countCampos}`] = {
          value: "",
          label: "Fecha Reingreso",
          date: new Date().toISOString().substr(0, 10),
          menu: false,
        };
        this.camposDinamicos.push(newDocumento);
        this.countCampos++;
      }
    },
    eliminateFields() {
      if (this.camposDinamicos.length > 1) {
        this.countCampos--;
        this.camposDinamicos.pop();
      }
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
          if (this.formId) {
            this.editForm();
          } else {
            this.envioForm1();
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    },
    async envioForm1() {
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      this.condiciones.fecha_creacion_acceso = this.date2;
      this.condiciones.fecha_ingreso = this.date1;
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/"
      }
      this.condiciones.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.condiciones.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const dataEnvio1 = { ...this.documento, ...this.condiciones, ...array, id_tipo_paciente: this.condiciones.condicion_paciente };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/unidadesActuales/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res.status);
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.id_unidadesActuales = res.data.url;
              this.e1 = 2;
              this.dialogEdit = false;
              this.loadForm();
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
      this.condiciones.fecha_creacion_acceso = this.date2;
      this.condiciones.fecha_ingreso = this.date1;
      const url = sessionStorage.getItem("dominioActual");
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/"
      }
      this.condiciones.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.condiciones.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const dataEnvio1 = { ...this.documento, ...this.condiciones, ...array, id_tipo_paciente: this.condiciones.condicion_paciente };
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(RUTA_API + "/unidadesActuales/" + this.formId.split("/")[4] + "/", dataEnvio1, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res.status);
              this.formId = res.data.url;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró el formulario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.id_unidadesActuales = res.data.url;
              this.e1 = 2;
              this.dialogEdit = false;
              this.loadForm();
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
    loadRedes() {
      this.dialogLoader = true;
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
              console.log("exito", res.status);
              this.dialogLoader = false;
              this.dataRedes = res.data;
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialogLoader = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    dataInit() {
      this.dialogLoader = true;
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
              this.dialogLoader = false;
              console.log("exito", res);
              this.isLoading = false;
              this.dataIpress = res.data;
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
              this.dataPaciente = res.data;
              this.dialogLoader = false;
            })
            .catch((res) => {
              this.dialogLoader = false;
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
      this.dialogLoader = true;
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
              this.dialogLoader = false;
              this.documento.id_fecha = res.data[0].url;
            })
            .catch((res) => {
              this.dialogLoader = false;
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
        (
          this.datos = {
            modalidad_inicio_trr: "",
            fecha_inicio_trr: "",
            subsistema_salud: "",
            tipo_acceso: "",
            fecha_creacion_acceso: "",
            fecha_primer_ingreso: "",
            comorbilidadOtros: "",
          }
        );
      (this.titularSi = false),
        (this.titularNo = true),
        (this.documento = {
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
        });
      (this.camposDinamicos = [
        {
          fecha_egreso0: {
            value: "",
            label: "Fecha Egreso",
            date: new Date().toISOString().substr(0, 10),
            menu: false,
          },
          tipo_egreso0: { value: "", label: "Tipo Egreso" },
          fecha_reingreso0: {
            value: "",
            label: "Fecha Reingreso",
            date: new Date().toISOString().substr(0, 10),
            menu: false,
          },
        },
      ]);
    },
    formatDate(date) {
      if (!date) return null;
      console.log("feha data", date);
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
    envioDetalles() {
      if (this.titularSi) {
        for (let i = 0; i < this.camposDinamicos.length; i++) {
          const element = this.camposDinamicos[i];
          if (
            element[`fecha_egreso${i}`].value == "" ||
            element[`fecha_reingreso${i}`].value == "" ||
            element[`tipo_egreso${i}`].value == ""
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
        for (let i = 0; i < this.camposDinamicos.length; i++) {
          const element = this.camposDinamicos[i];
          axios
            .post(RUTA_API + "/api/token/", {
              username: USUARIO,
              password: PASSWORD,
            })
            .then((response) => {
              this.auth = "Bearer " + response.data.access;
              axios
                .post(
                  RUTA_API + "/unidadesActualesDetalles/",
                  {
                    id_unidad_actual: this.id_unidadesActuales,
                    fecha_egreso: element[`fecha_egreso${i}`].date,
                    tipo_egreso: element[`tipo_egreso${i}`].value,
                    fecha_reingreso: element[`fecha_reingreso${i}`].date,
                  },
                  {
                    headers: { Authorization: this.auth },
                  }
                )
                .then((res) => {
                  if (this.camposDinamicos.length - 1 == i) {
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
      } else {
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
    },
    computedDateFormatted5(index, date) {
      this.camposDinamicos[index][`fecha_egreso${index}`].value =
        this.formatDate(date);
      this.camposDinamicos[index][`fecha_egreso${index}`].menu = false;
    },
    computedDateFormatted6(index, date) {
      this.camposDinamicos[index][`fecha_reingreso${index}`].value =
        this.formatDate(date);
      this.camposDinamicos[index][`fecha_reingreso${index}`].menu = false;
    },
  },
  mounted() { },
  computed: {
    computedDateFormatted1() {
      return this.formatDate(this.date1);
    },
    computedDateFormatted2() {
      return this.formatDate(this.date2);
    },
  },
  watch: {
    titularSi(newValue) {
      // Si titularSi está marcado como "Sí", deselecciona titularNo
      if (newValue) {
        this.titularNo = false;
      }
    },
    titularNo(newValue) {
      // Si titularNo está marcado como "No", deselecciona titularSi
      if (newValue) {
        this.titularSi = false;
      }
    },
  },
  created() {
    this.loadForm();
    this.loadFecha();
    this.loadPaciente();
    this.loadTipoPacientes();
    this.dataInit();
    this.idUsuarioIpress = sessionStorage.getItem("idUsuarioIpress");
    this.documento.id_usuario_ipress = this.idUsuarioIpress;
    this.loadRedes();
    this.condiciones.id_modalidad = sessionStorage.getItem("itemModalidad");
    this.condiciones.id_paciente = sessionStorage.getItem("itemPaciente");
    this.condiciones.id_periodo = sessionStorage.getItem("itemPeriodo");
    this.condiciones.id_usuario_ipress =
      sessionStorage.getItem("idUsuarioIpress");
  },
  components: {
    RegistrarPaciente,
  },
};
</script>