<template>
  <div>
    <NavBar @updateNavBar="updateNavBar" />
    <div class="row">
      <div class="col-sm-1">
        <v-card class="drawer-bar mx-auto" width="100%" height="100vh" tile style="position: fixed">
          <v-navigation-drawer permanent>
            <NavBarVertical />
          </v-navigation-drawer>
        </v-card>
      </div>
      <v-navigation-drawer v-model="drawerBar" absolute temporary @input="updateDrawerState" style="padding-top: 5rem">
        <NavBarVertical />
      </v-navigation-drawer>
      <div class="main-responsive" style="width: 100%; padding-right: 1.5rem; margin-top: 3.5rem">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style scoped>
.theme--light.v-select,
.v-select__selections {
  color: white !important;
}

a {
  text-decoration: none;
}

.v-divider.theme--light {
  border-color: rgb(255 255 255 / 25%);
}

a:hover {
  background-color: #ffffff10;
}

.v-list-item__title.text-h6,
.v-list-item__subtitle {
  color: white !important;
  text-decoration: none;
}

.v-list-item-navbar:hover {
  background-color: #ffffff10;
}

.v-list-item-navbar {
  margin: 0.5rem 0;
}

.v-list-item__icon .v-icon.notranslate.mdi.mdi-folder.theme--light,
.v-list-item__icon .v-icon.notranslate.mdi.mdi-folder.theme--light,
.v-list-item__icon.v-list-group__header__prepend-icon .v-icon {
  color: white !important;
  text-decoration: none;
}

.v-list-group {
  color: white !important;
}

.v-list-group__header :hover {
  background-color: #ffffff10;
}

.v-navigation-drawer {
  background: linear-gradient(135deg,
      rgb(25 115 165),
      rgb(20 145 215),
      #0d67aa,
      #00304e) !important;
  color: white !important;
}

.main-responsive {
  margin-left: 18rem;
}

@media (max-width: 1024px) {
  .main-responsive {
    margin-left: 0rem;
    padding-left: 1.5rem;
  }
}

tbody tr td {
  font-size: 0.7rem;
}

.v-expansion-panel-header {
  padding: 0.5rem !important;
}

@media (max-width: 1024px) {
  .drawer-bar {
    display: none;
  }
}

/* Opcional: Mostrar el botón solo en pantallas mayores a 1024px (ej. desktops) */
@media (min-width: 1024px) {
  .drawer-bar {
    display: block;
  }
}
</style>
<script>
import NavBar from "@components/navbar/NavBar.vue";
import NavBarVertical from "@components/navbar/NavBarVertical.vue";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      perfil: "",
      nombre: "",
    };
  },
  methods: {
    updateNavBar(datos) {
      this.drawerBar = datos;
    },
    ...mapActions(["setDrawerBar"]),
    ...mapActions(["updateActiveRoute"]),
    handleRouteChange() {
      this.setDrawerBar(false);
    },
    updateDrawerState(value) {
      this.setDrawerBar(value);
    },
  },
  computed: {
    ...mapState(["drawerBar"]),
  },
  mounted() { },
  created() {
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
    this.updateActiveRoute(this.$route.fullPath);
    this.$router.afterEach(() => {
      this.handleRouteChange();
    });
  },
  components: {
    NavBar,
    NavBarVertical,
  },
};
</script>