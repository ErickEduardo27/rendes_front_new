<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important;background:white">
      <v-card class="mx-auto my-5" max-width="2500">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title>
                <span class="text-h5">{{ titleCard }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Num. Doc."
                        v-model="pacienteData.documento"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="pacienteData.tipo_documento"
                        :items="['DNI', 'CARNET DE EXTRANJERÍA','RUC']"
                        label="Tipo Doc."
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Autogenerado"
                        v-model="pacienteData.autogenerado"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Paciente"
                        v-model="pacienteData.paciente"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="pacienteData.genero"
                        :items="['Masculino', 'Femenino']"
                        label="Genero"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        ref="menu1"
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="computedDateFormatted1"
                            label="Fec. Nacimiento"
                            hint=""
                            persistent-hint
                            readonly
                            prepend-icon="mdi-calendar"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date1"
                          no-title
                          @input="menu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-select
                        v-model="pacienteData.grado_instruccion"
                        :items="['SIN INSTRUCCIÓN', 'PRIMARIA', 'SECUNDARIA','SUPERIOR']"
                        label="Grado Instrucción"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="editClose">
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="editItem"
                  v-if="statusEdit"
                >
                  Guardar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="createItem"
                  v-if="!statusEdit"
                >
                  Crear
                </v-btn>
              </v-card-actions>
            </v-form>
      </v-card>
    </v-container>
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
  margin-left: 0;
}
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
export default {
  props: ['idPaciente'],
  data() {
    return {
      menu1:false,
      valor1: 15,
      valor2: 10,
      ver: false,
      searchIpress: "",
      searchRed: "",
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
        estado:null,
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
        { text: "Docuemnto", value: "documento" },
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
    editClose() {
        this.$emit("editClose",this.pacienteData);
        this.clearForm();
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
              this.pacienteData.estado=true;
              this.editClose();
              this.dialogEdit = false;
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
              this.pacienteData.estado=false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
      /*} else {
        this.dialogEdit = false;
        this.dialogAvisoEditar = true;
      }*/
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
              RUTA_API + "/paciente/" + this.idPaciente + "/",
              this.pacienteData,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              /*               this.dialogDataApi = true; */
              /* this.statusEdit=true; */
              console.log("exito", res.status);
              this.editClose();
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
    loadCas() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
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
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
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
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    clearForm() {
      this.pacienteData = {
        documento: null,
        tipo_documento: null,
        autogenerado: null,
        paciente: null,
        genero: null,
        grado_instruccion: null
      }
      this.pacienteData.documento="";

    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    loadPaciente(){
        axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/paciente/?search="+this.idPaciente, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exitoPaciente", res.data);
              this.pacienteData.documento=res.data[0].documento;
              this.pacienteData.autogenerado=res.data[0].autogenerado;
              this.pacienteData.fecha_nacimiento=res.data[0].fecha_nacimiento;
              this.pacienteData.genero=res.data[0].genero;
              this.pacienteData.grado_instruccion=res.data[0].grado_instruccion;
              this.pacienteData.paciente=res.data[0].paciente;
              this.pacienteData.tipo_documento=res.data[0].tipo_documento;
              this.date1=res.data[0].fecha_nacimiento;
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
    }
  },
  mounted() {},
  computed: {
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
    console.log("paciente ID",this.idPaciente)
    if(this.idPaciente!==null){
        this.statusEdit=true;
        this.titleButton = "Aceptar";
        this.titleCard = "Editar Paciente";
        this.loadPaciente();
    }else{
        
        this.statusEdit=false;
        this.titleButton = "Crear";
        this.titleCard = "Crear Paciente";
    }
    this.loadCas();
    this.loadMaestro();
  },
  components: {},
};
</script>