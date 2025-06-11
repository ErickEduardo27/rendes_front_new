<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto my-5" max-width="2500">
        <v-system-bar class="py-5 px-3" color="#1973a5" style="color: #fff" dark>
          Ipress
        </v-system-bar>
      </v-card>
      <v-card class="mx-auto my-5 elevation-1" max-width="2100">
        <v-row>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-text-field max-width="200" class="mx-3" v-model="searchIpress" label="Ipress"
              prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-text-field max-width="200" class="mx-3" v-model="searchRed" label="Red" prepend-inner-icon="mdi-magnify"
              variant="outlined" hide-details single-line></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-btn color="#1973a5" dark class="mb-2" @click="createOpen" style="margin-top: 1rem">
              Nuevo
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="mx-auto my-5" max-width="2500">
        <div style="max-height: 70vh; overflow-y: scroll">
          <v-data-table :headers="headers" :items="filteredData" class="elevation-1" :sort-by.sync="sortBy"
            :search="searchIpress" :loading="isLoading" loading-text="Loading... Please wait">
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
        <v-dialog v-model="dialogEdit" max-width="700px">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title>
                <span class="text-h5">{{ titleCard }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Cod. Unico" v-model="ipressData.codigo_unico"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Ipress" v-model="ipressData.ipress"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Ruc" v-model="ipressData.ruc"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Tipo Inst." v-model="ipressData.tipo_institucion"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="Ubigeo" v-model="ipressData.ubigeo"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="Dirección" v-model="ipressData.direccion"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Cod. Disa" v-model="ipressData.codigo_disa"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Disa" v-model="ipressData.disa"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field label="Cod. Red" v-model="ipressData.codigo_red"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Red" v-model="ipressData.red"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Cod. Micro" v-model="ipressData.codigo_microred"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Micro red" v-model="ipressData.microred"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Categoria" v-model="ipressData.categoria"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Teléfono" v-model="ipressData.telefono"></v-text-field>
                    </v-col>
                    <v-col cols="12" lg="6">
                      <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition"
                        offset-y max-width="290px" min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="computedDateFormatted1" label="Inicio actividades" hint=""
                            persistent-hint prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                            @keydown.enter.prevent></v-text-field>
                        </template>
                        <v-date-picker v-model="date1" no-title @input="menu1 = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field label="Horario de atención" v-model="ipressData.horario_atencion"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="editClose">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="editItem" v-if="statusEdit">
                  Guardar
                </v-btn>
                <v-btn color="blue darken-1" text @click="createItem" v-if="!statusEdit">
                  Crear
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Esta seguro de eliminar registro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="deleteClose">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItem">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
export default {
  data() {
    return {
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
      cas: null,
      maestro: null,
      deleteUser: [],
      statusEdit: false,
      date: new Date(
        Date.now() - 2592000000 - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      date1: new Date().toISOString().substr(0, 10),
      search: "",
      sortBy: [{ key: "codigo_unico", order: "asc" }],
      headers: [
        { text: "Ipress", value: "ipress" },
        { text: "Distrito", value: "distrito" },
        { text: "Provincia", value: "provincia" },
        { text: "Departamento", value: "departamento" },
        { text: "Modalidad", value: "modalidad" },
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
    };
  },
  methods: {
    createOpen() {
      this.clearForm();
      this.titleButton = "Aceptar";
      this.titleCard = "Crear Ipress";
      this.dialogEdit = true;
    },
    editOpen(item) {
      this.statusEdit = true;
      this.titleButton = "Aceptar";
      this.titleCard = "Editar Ipress";
      this.dialogEdit = true;
      this.ipressData.user_id = item.url.split("/")[4];
      this.ipressData.codigo_unico = item.codigo_unico;
      this.ipressData.ipress = item.ipress;
      this.ipressData.ruc = item.ruc;
      this.ipressData.tipo_institucion = item.tipo_institucion;
      this.ipressData.ubigeo = item.ubigeo;
      this.ipressData.direccion = item.direccion;
      this.ipressData.codigo_disa = item.codigo_disa;
      this.ipressData.disa = item.disa;
      this.ipressData.codigo_red = item.codigo_red;
      this.ipressData.red = item.red;
      this.ipressData.codigo_microred = item.codigo_microred;
      this.ipressData.microred = item.microred;
      this.ipressData.categoria = item.categoria;
      this.ipressData.telefono = item.telefono;
      this.ipressData.inicio_actividades = item.inicio_actividades;
      this.ipressData.horario_atencion = item.horario_atencion;
    },
    editClose() {
      console.log("reporte paciente", this.ipressData);
      this.clearForm();
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
      this.ipressData.inicio_actividades = this.date1;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(RUTA_API + "/ipress/", this.ipressData, {
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
      /*} else {
        this.dialogEdit = false;
        this.dialogAvisoEditar = true;
      }*/
    },
    editItem() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_API + "/ipress/" + this.ipressData.user_id + "/",
              this.ipressData,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              /*               this.dialogDataApi = true; */
              /* this.statusEdit=true; */
              console.log("exito", res.status);
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
      /*} else {
        this.dialogEdit = false;
        this.dialogAvisoEditar = true;
      }*/
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
              RUTA_API + "/ipress/" + this.deleteUser.url.split("/")[4] + "/",
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
              this.dataIpress.forEach((item) => {
                // Calcula el nombre completo y guárdalo en una nueva propiedad 'nombreCompleto'
                item.ubigeo_inei = `${item.datosUbigeo.ubigeo_inei}`;
                item.distrito = `${item.datosUbigeo.distrito}`;
                item.provincia = `${item.datosUbigeo.provincia}`
                item.departamento = `${item.datosUbigeo.departamento}`
                item.modalidad = `${item.datosModalidad.modalidad}`
                item.red = `${item.datosRed.red}`
              });
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
    clearForm() {
      (this.ipressData = {
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
    },
    formatDate(date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
  },
  mounted() { },
  computed: {
    dateFormatted() {
      return this.formatDate(
        new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      );
    },
    computedDateFormatted1() {
      return this.formatDate(this.date1);
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
      return this.formatDate(this.date)
    }
  },
  watch: {
    /* date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }, */
  },
  created() {
    this.loadCas();
    this.loadMaestro();
    this.dataInit();
  },
  components: {},
};
</script>