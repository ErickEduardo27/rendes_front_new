<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important; padding: 0 !important">
      <v-card class="mx-auto" max-width="2500">
        <template>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Etiología
              </v-stepper-step>
              <v-divider></v-divider>

              <v-stepper-step step="2" :complete="e1 > 2">
                Comorbilidad
              </v-stepper-step>
              <v-divider></v-divider>

              <v-stepper-step step="3"> Registro Paciente </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <h4>Etiología</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="documento.etiologiaGeneral" :rules="[rules.required]"
                      :items="dataEtiologia" item-text="general" item-value="general" @change="updateCodEti" dense
                      :disabled="statusForm" label="Etiología General"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete v-model="documento.id_etiologia" :rules="[rules.required]"
                      :items="dataEtiologiaEspecifica" item-text="especifica" item-value="url" dense
                      :disabled="statusForm" label="Etiología Específica"></v-autocomplete>
                  </v-col>
                </v-row>
                <div class="d-flex justify-space-between ma-1">
                  <v-btn text @click="e1 = 1"> Atrás </v-btn>
                  <v-btn color="primary" @click="continueEliologia">
                    Continue
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <h4>Comorbilidad</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" sm="6" @keydown.enter="continueComorbilidad()">
                    <v-select v-model="e6" :items="comorbilidad" label="Comorbilidad" :menu-props="{ maxHeight: '400' }"
                      multiple chips hint="Seleccione" persistent-hint @change="updateComorbilidad"
                      @keydown.enter.prevent :rules="[rules.required, rules.counter]" :disabled="statusForm"
                      :error-messages="erroresForm.e6"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="documento.enf_otra" label="Otros" @keydown.enter.prevent
                      @keydown.enter="continueComorbilidad()" :disabled="statusForm"></v-text-field>
                  </v-col>
                </v-row>
                <div class="d-flex justify-space-between ma-1">
                  <v-btn text @click="e1 = 1"> Atrás </v-btn>
                  <v-btn color="primary" @click="continueComorbilidad">
                    Continue
                  </v-btn>
                </div>
              </v-stepper-content>
              <v-stepper-content step="3">
                <h4>Registro Paciente</h4>
                <v-divider></v-divider>
                <br />
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select v-model="datos.modalidad_inicio_trr"
                      :items="['Hemodialisis', 'Dialisis Peritoneal', 'Transplante renal']"
                      label="Modalidad de Inicio De TRR" :disabled="statusForm" @keydown.enter.prevent
                      required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted1" label="Fecha Inicio TRR" hint="" persistent-hint
                          prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on" @keydown.enter.prevent
                          :rules="[rules.required, rules.counter]" :error-messages="erroresForm.date1"
                          :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="datos.subsistema_salud"
                      :items="['Essalud', 'Minsa', 'EPS', 'FFAA', 'FFPP', 'Otros']"
                      label="Subsistema De Salud De Inicio De TRR" :error-messages="erroresForm.subsistema_salud"
                      @keydown.enter.prevent :disabled="statusForm" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="datos.tipo_acceso" :items="itemsTipoAcceso" label="Tipo De Acceso De Inicio"
                      :error-messages="erroresForm.tipo_acceso" @keydown.enter.prevent
                      :disabled="statusForm || statusModalidad" required></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition" offset-y
                      max-width="290px" min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="computedDateFormatted2" label="Fecha Creacion Acceso de Inicio" hint=""
                          persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
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
                        <v-text-field v-model="computedDateFormatted3" label="Fecha de primer ingreso a la unidad"
                          hint="" persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                          @keydown.enter.prevent :rules="[rules.required, rules.counter]"
                          :error-messages="erroresForm.date3" :disabled="statusForm"></v-text-field>
                      </template>
                      <v-date-picker v-model="date3" no-title @input="menu3 = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <div class="d-flex justify-space-between ma-1">
                  <v-btn text @click="e1 = 2"> Atrás </v-btn>
                  <v-btn color="primary" @click="validarCampos" :disabled="statusForm">
                    Enviar
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <v-dialog v-model="dialogListCodEti" max-width="900px">
            <ListaCodEti />
          </v-dialog>
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
          </v-dialog> </template></v-card></v-container>
  </div>
</template>
<style>
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
import ListaCodEti from "./lista_cod_eti.vue";
import RegistrarPaciente from "../../gestion/pacientes/edit.vue";
import pacienteDialisisService from "@services/pacieneDialisis/pacienteDialisisService";
import { obtenerToken } from "@services/authService/authService";
import { periodoIpress } from "../../../../services/periodoIpress/periodoIpress";
import consultaPeriodo from "../../../../services/script/consultaPeriodo";
export default {
  data() {
    return {
      statusModalidad: false,
      dialogLoader: false,
      dialogListCodEti: false,
      e1: 1,
      step: 1,
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
        tipo_acceso: "",
        fecha_creacion_acceso: "",
        fecha_primer_ingreso: "",
        comorbilidadOtros: "",
      },
      menu1: false,
      menu2: false,
      menu3: false,
      titleButton: "",
      titleCard: "",
      valid: true,
      documento: {
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
        id_periodo: null,
        id_modalidad: null,
        id_estado: 1,
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
      pacienteData: {
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
      menu1: false,
      menu2: false,
      menu4: false,
      dataEtiologia: [],
      dataPaciente: [],
      erroresForm: [],
      dataEtiologiaEspecifica: [],
      statusForm: false,
      itemsTipoAcceso: ['FAV', 'Autoinjerto', 'Injerto', 'CVCP', 'CVCT'],
      formId: null
    };
  },
  methods: {
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
      this.loadEti();
      this.loadPaciente();
      this.dataInit();
      this.dialogEdit = false;
    },
    closeListCodEti() {
      this.dialogListCodEti = false;
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
    continueEliologia() {
      console.log("dcodigo eti", this.documento.etiologiaEspecifica);
      if (this.documento.id_etiologia == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡Ingrese el código de etiología!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (this.documento.etiologiaGeneral == "") {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡El código no es correcto!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        return;
      }
      this.e1 = 2;
    },
    continueComorbilidad() {
      this.e1 = 3;
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
      pacienteDialisisService
        .get(token, array)
        .then((res) => {
          this.dialogLoader = false;
          const datos = res.data;
          this.documento = datos;
          if (datos.length !== 0) {
            this.formId = datos[0].url;
            this.datos = datos[0];
            this.date1 = datos[0].fecha_inicio_trr;
            this.date2 = datos[0].fecha_creacion_acceso;
            this.date3 = datos[0].fecha_primer_ingreso;
            this.documento.etiologiaGeneral = datos[0].datosEti.general;
            this.updateCodEti();
            this.documento.id_etiologia = datos[0].datosEti.url;
          }
        })
        .catch((res) => {
          console.log("Error:", res);
          this.dialogLoader = false; // Asegúrate de manejar el error ocultando el loader
        });
    },
    dataInit() {
      this.loadForm();
      this.dialogLoader = true;
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
              this.dialogLoader = false;
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
    loadEti() {
      this.dialogLoader = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/etiologia/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dialogLoader = false;
              this.dataEtiologia = res.data;
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
    updateCodEti() {
      const arraEspecifica = [];
      for (const i in this.dataEtiologia) {
        const element = this.dataEtiologia[i];
        // Tu lógica aquí
        if (element.general == this.documento.etiologiaGeneral) {
          arraEspecifica.push(element);
        }
      }
      console.log("array especifica", arraEspecifica);
      this.dataEtiologiaEspecifica = arraEspecifica;
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
              this.dialogLoader = false;
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
      this.documento.enf_ateroesclerotica_cardiaca = "";
      this.documento.enf_insuficiencia_cardiaca_congestiva = "";
      this.documento.enf_vascular_periferica = "";
      this.documento.enf_cerebro_vascular = "";
      this.documento.enf_cancer = "";
      this.documento.enf_diabetes = "";
      this.documento.enf_hipertension = "";
      this.documento.enf_tuberculosis = "";
      this.e6 = [];
      this.erroresForm.modalidad_inicio_trr = "";
      this.erroresForm.date1 = "";
      this.erroresForm.tipo_acceso = "";
      this.erroresForm.date2 = "";
      this.erroresForm.numero = "";
      this.erroresForm.etiologiaCodigo = "";
      this.pacienteData = {
        documento: null,
        tipo_documento: null,
        autogenerado: null,
        paciente: null,
        fecha_nacimiento: null,
        genero: null,
        grado_instruccion: null,
      };
    },
    formatDate(date) {
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
    async editForm() {
      this.datos.fecha_inicio_trr = this.date1;
      this.datos.fecha_creacion_acceso = this.date2;
      this.datos.fecha_primer_ingreso = this.date3;
      console.log("imprimiendo fecha", this.date2)
      if (!(this.date2 <= this.date1 && this.date1 <= this.date3)) {
        Swal.fire({
          title: "¡Alerta!",
          html: "¡La fecha de acceso debe ser menor que la fecha de inicio!<br> ¡La fecha de inicio debe ser menor que la fecha de primer ingreso!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        this.dialogLoader = false;
        return;
      }
      this.dialog = true;
      this.documento.id_usuario_ipress =
        sessionStorage.getItem("idUsuarioIpress");
      const url = sessionStorage.getItem("idUsuarioIpress")
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.documento.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.documento.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
        id_paciente: sessionStorage.getItem("itemPaciente"),
        id_usuario_ipress: sessionStorage.getItem("idUsuarioIpress"),
      }
      const dataEnvio = Array.prototype.push.apply(array, this.datos);
      console.log("datops aciente", dataEnvio)
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(RUTA_API + "/pacientesDialisis/" + this.formId.split("/")[4] + "/", {
              modalidad_inicio_trr: this.datos.modalidad_inicio_trr,
              fecha_inicio_trr: this.datos.fecha_inicio_trr,
              subsistema_salud: this.datos.subsistema_salud,
              tipo_acceso: this.datos.tipo_acceso,
              fecha_creacion_acceso: this.datos.fecha_creacion_acceso,
              fecha_primer_ingreso: this.datos.fecha_primer_ingreso,
              comorbilidadOtros: this.datos.comorbilidadOtros,
              id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
              id_paciente: sessionStorage.getItem("itemPaciente"),
              id_usuario_ipress: sessionStorage.getItem("idUsuarioIpress"),
              id_etiologia: this.documento.id_etiologia
            }, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dialogLoader = false;
              console.log("no estra")
              this.formId = res.data.url;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.dialog = false;
              /* this.clearForm(); */
              this.loadForm();
              this.calculateFormPorcentaje();
              this.dialogEdit = false;
              this.e1 = 1;
            })
            .catch((res) => {
              console.log("data", res)
              if (res.data[0]) {
                Swal.fire({
                  title: "¡Exito!",
                  text: "¡Se registró correctamente!",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                this.loadForm();
                this.calculateFormPorcentaje();
              }
              this.dialogLoader = false;
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
          this.dialog = false;
          Swal.fire({
            title: "¡Error!",
            text: "¡No se registró correctamente!",
            icon: "error",
            confirmButtonText: "Ok",
          });
          this.dialogLoader = false;
        });
    },
    async submitForm() {
      this.datos.fecha_inicio_trr = this.date1;
      this.datos.fecha_creacion_acceso = this.date2;
      this.datos.fecha_primer_ingreso = this.date3;
      console.log("imprimiendo fecha", this.date2)
      if (!(this.date2 <= this.date1 && this.date1 <= this.date3)) {
        Swal.fire({
          title: "¡Alerta!",
          text: "¡La fecha de acceso debe ser menor que la fecha de inicio, y esta debe ser menor que la fecha de primer ingreso!",
          icon: "warning",
          confirmButtonText: "Ok",
        });
        this.dialogLoader = false;
        return;
      }
      this.dialog = true;
      this.documento.id_usuario_ipress =
        sessionStorage.getItem("idUsuarioIpress");
      const url = sessionStorage.getItem("idUsuarioIpress")
      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
      this.documento.id_estado = extractedUrl + "estados/" + 1 + "/";
      this.documento.id_periodo =
        extractedUrl +
        "periodos/" +
        sessionStorage.getItem("itemPeriodo").split("/")[4] +
        "/";
      const body = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
        id_periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
        id_estado: null
      };
      const idPeriodoIpress = await periodoIpress(body);
      const array = {
        id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
        id_paciente: sessionStorage.getItem("itemPaciente"),
        id_usuario_ipress: sessionStorage.getItem("idUsuarioIpress"),
      }
      const dataEnvio = Array.prototype.push.apply(array, this.datos);
      console.log("datops aciente", array)
      console.log("datops aciente", dataEnvio)
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/pacientesDialisis/", {
              modalidad_inicio_trr: this.datos.modalidad_inicio_trr,
              fecha_inicio_trr: this.datos.fecha_inicio_trr,
              subsistema_salud: this.datos.subsistema_salud,
              tipo_acceso: this.datos.tipo_acceso,
              fecha_creacion_acceso: this.datos.fecha_creacion_acceso,
              fecha_primer_ingreso: this.datos.fecha_primer_ingreso,
              comorbilidadOtros: this.datos.comorbilidadOtros,
              id_periodo_ipress: extractedUrl + "periodoIpress/" + idPeriodoIpress + "/",
              id_paciente: sessionStorage.getItem("itemPaciente"),
              id_usuario_ipress: sessionStorage.getItem("idUsuarioIpress"),
              id_etiologia: this.documento.id_etiologia
            }, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.dialogLoader = false;
              this.formId = res.data.url;
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se registró correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.dialog = false;
              /* this.clearForm(); */
              this.loadForm();
              this.calculateFormPorcentaje();
              this.dialogEdit = false;
              this.e1 = 1;
            })
            .catch((res) => {
              this.dialogLoader = false;
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
          this.dialog = false;
          Swal.fire({
            title: "¡Error!",
            text: "¡No se registró correctamente!",
            icon: "error",
            confirmButtonText: "Ok",
          });
          this.dialogLoader = false;
        });
    },
    updatePorcentaje() {
      this.$emit("porcentajeForm", this.porcentajeGroup);
    },
    async calculateFormPorcentaje() {
      this.dialogLoader = true;
      const token = await obtenerToken();
      this.auth = "Bearer " + token;
      axios
        .post(
          RUTA_API + "/calcular_avance_por_paciente/",
          {
            periodo: sessionStorage.getItem("itemPeriodo").split("/")[4],
            modalidad: sessionStorage.getItem("itemModalidad").split("/")[4],
            usuario_ipress: sessionStorage.getItem("itemUsuarioIpress").split("/")[4],
            paciente: sessionStorage.getItem("itemPaciente").split("/")[4],
          },
          {
            headers: { Authorization: this.auth },
          }
        )
        .then((res) => {
          this.updatePorcentaje();
          this.porcentajeGroup.pacienteHemo = res.data[0].porcentaje_1;
          this.porcentajeGroup.unidadActual = res.data[0].porcentaje_2;
          this.porcentajeGroup.accesoVascular = res.data[0].porcentaje_3;
          this.porcentajeGroup.morbiHospi = res.data[0].porcentaje_4;
          this.porcentajeGroup.resultadosCli = res.data[0].porcentaje_5;
          this.porcentajeGroup.calidadMicro = res.data[0].porcentaje_6;
          this.porcentajeGroup.vacunacion = res.data[0].porcentaje_7;
        })
        .catch((res) => {
          console.log("Error:", res);
        });
    },
    validarCampos() {
      let status = false;
      this.dialogLoader = true;
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
      if (!this.datos.tipo_acceso) {
        this.erroresForm.tipo_acceso = ["El campo es obligatorio."];
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
        this.dialogLoader = false;
        Swal.fire({
          title: "¡Error!",
          text: "¡Se debe completar todos los campos!",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (this.formId) {
        this.editForm();
      } else {
        this.submitForm();
      }
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
    }


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
    this.documento.id_modalidad = sessionStorage.getItem("itemModalidad");
    this.statusModalidad = sessionStorage.getItem("itemModalidad").split("/")[4] == "2" ? true : false;
    if (sessionStorage.getItem("itemModalidad").split("/")[4] == "2") {
      this.itemsTipoAcceso = ['CATETER PERITONEAL'];
      this.datos.tipo_acceso = 'CATETER PERITONEAL';
    }
    this.documento.id_paciente = sessionStorage.getItem("itemPaciente");
    this.documento.id_periodo = sessionStorage.getItem("itemPeriodo");
    this.documento.id_usuario_ipress = sessionStorage.getItem("idUsuarioIpress");
    this.loadEti();
    this.loadPaciente();
    this.dataInit();
  },
  components: {
    ListaCodEti,
    RegistrarPaciente,
  },
};
</script>