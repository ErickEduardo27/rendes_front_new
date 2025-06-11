<template>
  <div>
    <v-container max-width="2500" style="max-width: 3000px !important">
      <v-card class="mx-auto my-5" max-width="2500">
        <v-system-bar class="py-5 px-3" color="#1973a5" style="color:#fff" dark> Lista de asginación </v-system-bar>
      </v-card>
      <v-card class="mx-auto my-5" max-width="2500">
        <v-row>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-text-field max-width="200" class="mx-3" v-model="searchUsuario" label="Usuario"
              prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
          </v-col>
          <v-col cols="6" sm="6" md="3" class="mx-3">
            <v-text-field max-width="200" class="mx-3" v-model="searchIpress" label="Ipress"
              prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
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
          <v-data-table :headers="headers" :items="filteredData" class="elevation-1" :search="searchUsuario"
            :sort-by.sync="sortBy">
            <template v-slot:[`item.actions`]="{ item }">
              <div style="display: flex;align-items: center;">
                <v-icon small class="mr-3" @click="editOpen(item)">
                  mdi-pencil
                </v-icon>
                <v-checkbox style="margin: 0;" v-model="item.estado" @click="deleteItem(item)"></v-checkbox>
              </div>
            </template>
          </v-data-table>
        </div>
        <v-dialog v-model="dialogEdit" v-if="dialogEdit" max-width="700px">
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title>
                <span class="text-h5">{{ titleCard }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-select label="Usuario" v-model="data.id_usuario" :items="arrayUsuarios" item-text="usuario"
                        item-value="url"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-autocomplete label="Ipress" v-model="data.id_ipress" :items="arrayIpress" item-text="ipress"
                        item-value="url"></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="editClose">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="editItem" v-if="statusEdit == true">
                  Guardar
                </v-btn>
                <v-btn color="blue darken-1" text @click="createItem" v-if="statusEdit == false">
                  Crear
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Esta seguro de dar de baja la asignación?</v-card-title>
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
import Swal from "sweetalert2"
export default {
  data() {
    return {
      dataUsuarioIpress: [],
      arrayIpress: [],
      arrayUsuarios: [],
      valor1: 15,
      valor2: 10,
      ver: false,
      searchIpress: "",
      searchUsuario: "",
      dataUsuario: [],
      dataEnvio: {
        fecha: null,
      },
      titleButton: "",
      titleCard: "",
      valid: true,
      data: {
        id_usuario: null,
        id_ipress: null,
        estado: true
      },
      cas: null,
      deleteUser: [],
      statusEdit: false,
      search: "",
      sortBy: [{ key: "cupos_disponible", order: "asc" }],
      headers: [
        {
          text: "Usuario",
          align: "start",
          value: "datosUsuario.usuario",
        },
        { text: "Ipress", value: "datosIpress.ipress" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialogEdit: false,
      dialogDelete: false,
      dataCas: [],
      dataPerfil: [],
      asignacionId: null
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
      this.titleCard = "Crear asignación";
      this.dialogEdit = true;
      this.statusEdit = false;
    },
    editOpen(item) {
      this.statusEdit = true;
      this.titleButton = "Aceptar";
      this.titleCard = "Editar asignación";
      this.dialogEdit = true;
      this.data.id_usuario = item.id_usuario;
      this.data.id_ipress = item.id_ipress;
      this.data.estado = item.estado;
      this.asignacionId = item.url;
    },
    editClose() {
      console.log("reporte usaurio", this.usuarioData);
      this.clearForm();
      this.statusEdit = false;
      this.dialogEdit = false;
    },
    deleteOpen(item) {
      this.deleteUser = item;
      this.data.id_ipress = item.id_ipress;
      this.data.id_usuario = item.id_usuario;
      Swal.fire({
        title: "¡Alerta!",
        text: "Se va dar de baja la asginación. ¿Esta seguro de continuar?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          // Lógica para cuando se presiona "Aceptar"
          this.deleteItem();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Lógica para cuando se presiona "Cancelar"

        }
      });
    },
    deleteClose() {
      this.dialogDelete = false;
    },
    createItem() {
      this.data.estado = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_API + "/usuarioIpress/", this.data,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("exito", res.status);
              this.editClose();
              this.dataInit();
              this.clearForm();
              this.loadUsuarioIpress();
              Swal.fire({
                title: "¡Exito!",
                text: "¡La ipress se asignó correctamente al usuario!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.dialogEdit = false;
            })
            .catch((res) => {
              Swal.fire({
                title: "¡Error!",
                text: "¡Ya exite un registro con la misma información!",
                icon: "error",
                confirmButtonText: "Ok",
              });
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
      this.data.estado = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_API + "/usuarioIpress/" + this.asignacionId.split("/")[4] + "/",
              this.data,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se editó correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              console.log("exito", res.status);
              this.editClose();
              this.loadUsuarioIpress();
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
          Swal.fire({
            title: "¡Error!",
            text: "¡No se editó correctamente!",
            icon: "error",
            confirmButtonText: "Ok",
          });
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
    deleteItem(item) {
      this.data.estado = item.estado;
      this.data.id_ipress = item.id_ipress;
      this.data.id_usuario = item.id_usuario;
      let text = item.estado ? "alta" : "baja"
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .patch(
              RUTA_API +
              "/usuarioIpress/" +
              item.url.split("/")[4] +
              "/",
              this.data
              ,
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              Swal.fire({
                title: "¡Exito!",
                text: "¡Se dió de " + text + " correctamente!",
                icon: "success",
                confirmButtonText: "Ok",
              });
              this.dialogDelete = false;
              this.loadUsuarioIpress();
              this.clearForm();
              this.dialogEdit = false;
            })
            .catch((res) => {
              Swal.fire({
                title: "¡Error!",
                text: "¡No se dió de " + text + " correctamente!",
                icon: "error",
                confirmButtonText: "Ok",
              });
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
              this.arrayUsuarios = res.data;
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
    loadUsuarioIpress() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/usuarioIpress/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res);
              this.dataUsuarioIpress = res.data;
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
    loadIpress() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/indexIpress/?estado=ACTIVO&ipress=", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exitocAS", res.data);
              const listaOrdenada = res.data.sort((a, b) => {
                const ipressA = a.ipress.toLowerCase();
                const ipressB = b.ipress.toLowerCase();

                if (ipressA < ipressB) {
                  return -1;
                }
                if (ipressA > ipressB) {
                  return 1;
                }
                return 0;
              });
              this.arrayIpress = listaOrdenada;
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
    clearForm() {
      this.data = {
        id_usuario: null,
        id_ipress: null,
      };
    },
  },
  mounted() { },
  computed: {
    /* normalizedUsuarios() {
      return this.arrayUsuarios.map(user => ({
        id_usuario: user.id_usuario,
        nombre: user.datosUsuario.nombre
      }));
    },
    normalizedIpress() {
      return this.arrayIpress.map(user => ({
        id_ipress: user.id_ipress,
        ipress: user.datosIpress.ipress
      }));
    }, */
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
      if (!this.searchUsuario && !this.searchIpress) {
        return this.dataUsuarioIpress;
      }
      let filtered = this.dataUsuarioIpress;
      if (this.searchUsuario) {
        filtered = filtered.filter(item => item.datosUsuario.usuario.toLowerCase().includes(this.searchUsuario.toLowerCase()));
      }
      if (this.searchIpress) {
        filtered = filtered.filter(item => item.datosIpress.ipress.toLowerCase().includes(this.searchIpress.toLowerCase()));
      }
      return filtered;
    },
  },
  created() {
    /* console.log("Hola"); */
    this.dataInit();
    this.loadUsuarioIpress();
    this.loadIpress();
    this.loadPerfiles();
  },
  components: {},
};
</script>