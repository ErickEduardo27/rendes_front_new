<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto my-5" max-width="2500">
        <v-system-bar  class="py-5 px-3" color="#1973a5" style="color:#fff" dark> Lista de usuariossss </v-system-bar>
      </v-card>
       <v-card class="mx-auto my-5" max-width="2500">
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
              v-model="searchClinica"
              label="Clínica"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-btn color="#1973a5" dark class="mb-2" @click="createOpen" style="margin-top: 1rem;">
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
            :search="searchNombre"
            :sort-by.sync="sortBy"
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
                      <v-text-field
                        label="Nombre"
                        v-model="usuarioData.nombre"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="Usuario"
                        v-model="usuarioData.usuario"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <!-- <v-autocomplete
                        v-model="cas"
                        :items="dataCas"
                        item-text="descripCas"
                        item-value="url"
                        dense
                        label="Clinica"
                      ></v-autocomplete> -->
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Num. Doc"
                        v-model="usuarioData.documento"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Clave"
                        v-model="usuarioData.clave"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <!-- <v-text-field
                        label="Perfil"
                        v-model="usuarioData.id_perfil"
                      ></v-text-field> -->
                       <v-autocomplete style="margin-top:1.3rem;"
                        v-model="usuarioData.id_perfil"
                        :items="dataPerfil"
                        item-text="perfil"
                        item-value="url"
                        dense
                        label="Perfil"
                      ></v-autocomplete> 
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
                  v-if="statusEdit==true"
                >
                  Guardar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="createItem"
                  v-if="statusEdit==false"
                >
                  Crear
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
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
        <!-- <v-dialog transition="dialog-top-transition" max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on">From the top</v-btn>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar color="primary" dark>Opening from the top</v-toolbar>
              <v-card-text>
                <div class="text-h2 pa-12">Hello world!</div>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text @click="dialog.value = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog> -->
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
      searchClinica: "",
      searchNombre: "",
      dataUsuario: [],
      dataEnvio: {
        fecha: null,
      },
      titleButton: "",
      titleCard: "",
      valid: true,
      usuarioData: {
        nombre: null,
        documento: null,
        usuario: null,
        clave: null,
        id_perfil: null,
        perfil: null,
        id_user: null,
        estado:1
      },
      cas: null,
      deleteUser: [],
      statusEdit: false,
      date: new Date(
        Date.now() - 2592000000 - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      search: "",
      sortBy: [{ key: "cupos_disponible", order: "asc" }],
      headers: [
        {
          text: "Nombre",
          align: "start",
          value: "nombre",
        },
        { text: "Usuario", value: "usuario" },
        { text: "Num. Doc", value: "documento" },
        { text: "Clave", value: "clave" },
        { text: "Perfil", value: "perfil" },
        { text: "Estado", value: "estado" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataPerfil:[]
    };
  },
  methods: {
    filtro() {
      this.dataEnvio.fecha = this.date;
      this.dataEnvio.fecha = this.formatearFecha(this.date);
      console.log(this.formatearFecha(this.date));
      this.dataInit();
    },
    createOpen() {
      this.clearForm();
      this.titleButton = "Aceptar";
      this.titleCard = "Crear Usuario";
      this.dialogEdit = true;
      this.statusEdit = false;
    },
    editOpen(item) {
      this.statusEdit = true;
      this.titleButton = "Aceptar";
      this.titleCard = "Editar Usuario";
      this.dialogEdit = true;
      this.usuarioData.nombre = item.nombre;
      this.usuarioData.documento = item.documento;
      this.usuarioData.nombre = item.nombre;
      this.usuarioData.usuario = item.usuario;
      this.usuarioData.clave = item.clave;
      this.usuarioData.id_perfil = item.id_perfil;
      this.usuarioData.id_user = item.url.split("/")[4];
    },
    editClose() {
      console.log("reporte usaurio", this.usuarioData);
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
      const perfilUser=this.dataPerfil.filter(p => {
        return p.url == this.usuarioData.id_perfil;
      });
      console.log(perfilUser);
      this.usuarioData.perfil=perfilUser[0].perfil;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_API + "/usuario/",this.usuarioData,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              /*               this.dialogDataApi = true; */
              /*  this.statusEdit=true; */
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
              RUTA_API + "/usuario/" + this.usuarioData.id_user + "/",
              this.usuarioData,
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
              RUTA_API +
                "/usuario/" +
                this.deleteUser.url.split("/")[4] +
                "/",
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              this.dialogDelete = false;
              this.dataInit();
              this.clearForm();
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
      /*} else {
        this.dialogEdit = false;
        this.dialogAvisoEditar = true;
      }*/
    },
    dataInit() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/usuario/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res);
              this.loadCas();
              this.dataUsuario = res.data;
              this.dataUsuario.forEach((item) => {
                item.perfil = `${item.datosPerfil.perfil}`;
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
    loadPerfiles() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/perfil/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exitoPerfil", res.data);
              this.dataPerfil = res.data;
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
      this.usuarioData = {
        nombre: null,
        documento: null,
        usuario: null,
        clave: null,
        id_perfil: null,
        id_user: null,
        estado:1
      };
    },
  },
  mounted() {},
  computed: {
    dataCasOptions() {
      // Formatear los elementos del objeto según lo requerido por v-select
      return this.dataCas.map((item) => ({
        text: item.descripCas,
        value: item.url,
      }));
    },
    itemClass() {
      return (item) => {
        if (item.cupos_disponible === 0) {
          return ""; // Aplica la clase "bg-primary" para el color #007bff
        } else {
          return "bg-primary-table primary--text"; // No se aplica ninguna clase
        }
      };
    },
    filteredData() {
        if (!this.searchNombre && !this.searchClinica) {
            return this.dataUsuario;
        }
        let filtered = this.dataUsuario;
        if (this.searchNombre) {
            filtered = filtered.filter(item => item.nombre.toLowerCase().includes(this.searchNombre.toLowerCase()));
        }
        if (this.searchClinica) {
            filtered = filtered.filter(item => item.cas_nombre.toLowerCase().includes(this.searchClinica.toLowerCase()));
        }
        return filtered;
    },
  },
  created() {
    /* console.log("Hola"); */
    this.dataInit();
    this.loadPerfiles();
  },
  components: {},
};
</script>