<template>
  <div>
    <v-app-bar dense style="
        position: fixed;
        z-index: 10;
        height: 52px;
        top: 0;
        align-content: center;
        box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
        background-color: linear-gradient(
          135deg,
          rgb(25 115 165),
          rgb(20 145 215),
          #0d67aa,
          #00304e
        ) !important;
      ">
      <v-app-bar-nav-icon @click="toggleDrawer" class="responsive-button"></v-app-bar-nav-icon>
      <div style="
          display: flex;
          flex-wrap: nowrap;
          width: 35rem;
          align-items: center;
        ">
        Bienvenido {{ nombre }} estas logueado a:
        <v-select style="
            margin-left: 0.5rem;
            margin-top: 1.4rem;
            width: 0.4rem;
            font-size: 0.95rem;
            color: white;
          " v-model="ipressItem" :items="itemsIpress" item-value="url" item-text="datosIpress.ipress" height="25"
          @change="updateIpress"></v-select>
      </div>
      <v-spacer></v-spacer>
      <div style="
          display: flex;
          flex-wrap: wrap;
          width: 10rem;
          align-items: center;
          margin-right: 1rem;
        ">
        Periodo:
        <v-select class="white-color" id="white-color" style="
            color: white;
            margin-left: 0.5rem;
            margin-top: 1rem;
            width: 0.4rem;
            font-size: 0.95rem;
          " v-model="selectedPeriodo" :items="arrayPeriodos" item-value="id_periodo" item-text="periodo" dense
          height="25" @change="updatePeriodo"></v-select>
      </div>
      <div style="font-size: 1.5rem">|</div>
      <div style="
          display: flex;
          flex-wrap: wrap;
          width: 19rem;
          align-items: center;
          margin-left: 1rem;
        ">
        Modalidad:
        <v-select style="
            color: white;
            margin-left: 0.5rem;
            margin-top: 1rem;
            width: 30px;
            font-size: 0.95rem;
            border-color: aliceblue;
          " v-model="modalidadItem" :items="itemsModalidad" item-value="url" item-text="modalidad" dense height="25"
          @change="updateModalidad"></v-select>
      </div>
      <v-tooltip bottom color="success">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="actionPrincipal" v-bind="attrs" v-on="on" style="color: white">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>Inicio</span>
      </v-tooltip>
      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-tooltip v-bind="attrs" v-on="on" bottom color="error">
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="actionSalir" dark v-bind="attrs" v-on="on" icon>
                <v-icon dark left>mdi-logout</v-icon>
              </v-btn>
            </template>
            <span>Cerrar sesión</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-card-title class="text-h5"> ¿Cerrar la sesión? </v-card-title>
          <v-card-text>Ud. esta apunto de salir del sistema</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text :dialog="dialog" @click="actionOut">
              Aceptar
            </v-btn>
            <v-btn color="green darken-1" text @click="dialog = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
  </div>
</template>
<style scoped>
::v-deep .v-application .primary--text {
  color: white !important;
  caret-color: white !important;
}

#white-color {
  color: white !important;
}

#white-color .v-input__control .v-input__slot:before {
  color: white !important;
  border-color: white;
}

::v-deep .theme--light.v-icon {
  color: white !important;
}

::v-deep .theme--light.v-input input,
.theme--light.v-input textarea {
  color: white !important;
}

::v-deep.theme--light.v-select .v-select__selections {
  color: white !important;
}

::v-deep .theme--light.v-text-field .v-input__control .v-input__slot:before {
  border-color: rgb(255, 255, 255) !important;
}

.theme--light.v-input {
  color: rgb(255, 255, 255) !important;
}

.theme--light.v-select .v-select__selections {
  color: white !important;
}

@media (max-width: 768px) {
  .v-app-bar__nav-icon {
    display: block;
  }
}

/* Opcional: Mostrar el botón solo en pantallas mayores a 1024px (ej. desktops) */
@media (min-width: 1024px) {
  .v-app-bar__nav-icon {
    display: none;
  }
}

.v-app-bar {
  background: linear-gradient(135deg,
      rgb(25 115 165),
      rgb(20 145 215),
      #0d67aa,
      #00304e);
  color: white !important;
}

/* .theme--light.v-input input {
  color: white !important;
} */
@media (max-width: 1024px) {
  .responsive-button {
    display: block !important;
  }
}

/* Opcional: Mostrar el botón solo en pantallas mayores a 1024px (ej. desktops) */
@media (min-width: 1024px) {
  .responsive-button {
    display: none !important;
  }
}
</style>
<script>
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
/* import { obtenerToken } from "@services/authService/authService"; */
/* import consultaPeriodo from "@services/script/consultaPeriodo"; */
/* import { mapActions, mapState } from "vuex"; */
export default {
  props: ["statusVariablesGlobal"],
  data() {
    return {
      drawer: null,
      dialog: false,
      perfil: "",
      nombre: "",
      descripCas: "",
      itemsIpress: [],
      /* ipressPeriodo: [], */
      arrayPeriodos: [],
      itemsModalidad: [],
      ipressItem: null,
      /* periodoItem: null, */
      modalidadItem: null,
      statusGlobal: false,
      selectedItem: null,
      selectedPeriodo: null,
      items2: [{ text: "Formularios", icon: "mdi-folder" }],
    };
  },
  computed: {
    /* ...mapState(["drawerBar"]),
    ...mapState({
      arrayPeriodos: (state) => state.arrayPeriodos,
    }),
    selectedPeriodo: {
      get() {
        return this.$store.state.periodoSelect;
      },
      set(value) {
        this.setPeriodoSelect(value);
      },
    }, */
  },
  created() {
    this.statusGlobal = this.statusVariablesGlobal;
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    this.usuario = sessionStorage.getItem("usuario");
    this.descripCas = sessionStorage.getItem("descripCas");
    this.ipressItem = sessionStorage.getItem("itemUsuarioIpress");
    this.modalidadItem = sessionStorage.getItem("itemModalidad");
    this.selectedPeriodo = parseInt(sessionStorage.getItem("itemPeriodo").split("/")[4], 10);
    this.loadIpressCarga();
    this.loadPeriodo();
    this.loadModalidades();
  },
  methods: {
    ...mapActions(["setPeriodoSelect"]),
    updatePeriodo(value) {
      this.setPeriodoSelect(Number(value));
    },
    updateIpress() {
      sessionStorage.setItem("itemUsuarioIpress", this.ipressItem);
      const ipressSelect = this.itemsIpress.find(
        (e) => e.url === this.ipressItem
      );
      sessionStorage.setItem("itemIpress", ipressSelect.id_ipress);
      sessionStorage.removeItem("itemPeriodo");
      window.location.reload();
    },
    updateNavBar() {
      this.drawer = !this.drawer;
      this.$emit("updateNavBar", this.drawer);
    },
    ...mapActions(["toggleDrawerBar"]),
    toggleDrawer() {
      console.log("estoy dando click");
      this.toggleDrawerBar();
    },
    updatePeriodo() {
      sessionStorage.setItem("itemPeriodo", this.periodoItem.split("/")[4]);
      window.location.reload();
    },
    updateModalidad() {
      sessionStorage.setItem("itemModalidad", this.modalidadItem);
      window.location.reload();
    },
    loadIpressCarga() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/usuarioIpress/?search=" + this.usuario, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.itemsIpress = res.data;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
        });
    },
    async loadPeriodo() {
      /* const array = {
        id_ipress: sessionStorage.getItem("itemIpress").split("/")[4],
      };
      const token = await obtenerToken();
      await consultaPeriodo
        .consultaPeriodo(token, array)
        .then((res) => {
          this.arrayPeriodos = res.data;
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
        }); */
    },
    loadModalidades() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/modalidades/", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              this.itemsModalidad = res.data;
              console.log("madalidades", this.itemsModalidad);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
        });
    },
    actionSalir() {
      this.dialog = true;
    },
    actionOut() {
      
    },
    actionPrincipal() {
      this.$router.push("/go");
    },
  },
  components: {},
};
</script>