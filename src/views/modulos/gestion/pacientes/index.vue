<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto my-5" max-width="2500">
        <v-system-bar
          class="py-5 px-3"
          color="#1973a5"
          style="color: #fff"
          dark
        >
          Pacientes
        </v-system-bar>
      </v-card>
      <v-card class="mx-auto my-5 elevation-1" max-width="2100">
        <v-row>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-text-field
              max-width="200"
              class="mx-3"
              v-model="searchNombre"
              label="Nombre"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-text-field
              max-width="200"
              class="mx-3"
              v-model="searchDNI"
              label="DNI"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-btn
              color="#1973a5"
              dark
              class="mb-2"
              @click="createOpen"
              style="margin-top: 1rem"
            >
              Nuevo
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mx-auto my-5" max-width="2500">
        <div style="max-height: 70vh; overflow-y: scroll">
          <v-data-table
            :headers="headers"
            :items="filteredData"
            class="elevation-1"
            :sort-by.sync="sortBy"
            :search="searchNombre"
            :loading="isLoading"
            loading-text="Loading... Please wait"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-3" @click="editOpen(item)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-3" @click="deleteOpen(item)">
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </div>
        <!-- <v-dialog v-model="dialogEdit" v-if="dialogEdit" max-width="700px">
          <EditPaciente  @editClose="editClose" :idPaciente="idPaciente"/>
        </v-dialog> -->
        <v-dialog v-model="dialogEdit" v-if="dialogEdit" max-width="700px">
          <EditPaciente  @closeNuevo="editClose" :idPaciente="idPaciente"/>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Esta seguro de eliminar registro?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteClose"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItem">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </div>
</template>
<style scoped>
  table tr th{
    color: white !important;
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
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import EditPaciente from "./create.vue";
import { obtenerToken } from '../../../../services/authService/authService';
export default {
  data() {
    return {
      idPaciente:null,
      menu1:false,
      valor1: 15,
      valor2: 10,
      ver: false,
      searchNombre: "",
      searchDNI: "",
      dataIpress: [],
      dataEnvio: {
        fecha: null,
      },
      titleButton: "",
      titleCard: "",
      valid: true,
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
      search: "",
      sortBy: [{ key: "codigo_unico", order: "asc" }],
      headers: [
        { text: "Documento", value: "documento" },
        { text: "Tip. Doc.", value: "tipo_documento" },
        { text: "Autogenerado", value: "autogenerado" },
        { text: "Paciente", value: "paciente" },
        { text: "Fec. Nac", value: "fecha_nacimiento" },
        { text: "Genero", value: "genero" },
        { text: "Grado Inst.", value: "grado_instruccion" },
        { text: "Actions", align: "center", value: "actions", sortable: false },
      ],
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataMaesto: [],
      isLoading: false,
      itemsTipSex: ["MASCULINO", "FEMENINO"],
    };
  },
  methods: {
    createOpen() {
      this.idPaciente=null;
      this.dialogEdit = true;
    },
    editOpen(item) {
      this.idPaciente=item.url.split("/")[4];
      this.statusEdit = true;
      this.titleButton = "Aceptar";
      this.titleCard = "Editar Paciente";
      this.dialogEdit = true;
      this.pacienteData.user_id = item.url.split("/")[4];
    },
    editClose() {
      this.loadCas();
      this.loadMaestro();
      this.dataInit();
      this.statusEdit = false;
      this.dialogEdit = false;
    },
    deleteOpen(item) {
      this.deleteUser = item;
      this.dialogDelete = true;
    },
    deleteClose() {
      this.dialogDelete = false;
    },
    createItem() {
      this.pacienteData.fecha_nacimiento = this.date1;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/paciente/", this.pacienteData, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res.status);
              this.editClose();
              this.dataInit();
              this.clearForm();
              this.dialogEdit = false;
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
    editItem() {
      this.pacienteData.fecha_nacimiento = this.date1;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_API + "/paciente/" + this.pacienteData.user_id + "/",
              this.pacienteData,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.editClose();
              this.dataInit();
              this.clearForm();
              this.statusEdit = false;
              this.dialogEdit = false;
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
    deleteItem() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .delete(
              RUTA_API + "/paciente/" + this.deleteUser.url.split("/")[4] + "/",
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.dialogDelete = false;
              this.dataInit();
              this.dialogEdit = false;
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialogDelete = false;
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    async dataInit() {
      this.isLoading = true;
      const token = await obtenerToken(); // Obtén el token
      this.auth = "Bearer " + token;
        axios
          .get(RUTA_API + "/paciente/", {
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
    },
    async loadCas() {
      const token = await obtenerToken();
      this.auth = "Bearer " + token;
        axios
          .get(RUTA_API + "/cas/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            console.log("exitocAS", res.data);
            this.dataCas = res.data;
          })
          .catch((res) => {
            console.log("Error:", res);
          });
    },
    loadMaestro() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/maestro/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exitocAS", res.data);
              this.dataMaesto = res.data;
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
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    clearForm() {
      (this.pacienteData = {
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
      }),
        (this.cas = null);
      this.maestro = null;
      this.date1=null;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
  },
  mounted() {},
  computed: {
    filteredData() {
      if (!this.searchDNI && !this.searchNombre) {
        return this.dataIpress;
      }
      let filtered = this.dataIpress;
      if (this.searchDNI) {
        filtered = filtered.filter((item) =>
          item.documento.toLowerCase().includes(this.searchDNI.toLowerCase())
        );
      }
      if (this.searchNombre) {
        filtered = filtered.filter((item) =>
          item.paciente.toLowerCase().includes(this.searchNombre.toLowerCase())
        );
      }
      return filtered;
    },
    dateFormatted() {
      return this.formatDate(
        new Date().toISOString().substr(0, 10)
      );
    },
    computedDateFormatted1() {
      return this.formatDate(this.date1);
    },
  },
  created() {
    this.loadCas();
    this.loadMaestro();
    this.dataInit();
  },
  components: {
    EditPaciente
  },
};
</script>