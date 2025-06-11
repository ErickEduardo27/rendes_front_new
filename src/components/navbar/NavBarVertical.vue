<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-avatar> </v-list-item-avatar>
      </v-list-item>
      <br>
      <img src="../../assets/logo_cnsr_3.png" alt="logo_rinon" style="height: 5.9rem;">
      <!-- <v-list-item link>
        <v-list-item-content>
          <img src="../../assets/logo_cnsr_3.png" alt="logo_rinon" style="height: 4.5rem;">
        </v-list-item-content>
        <v-list-item-action>
        </v-list-item-action>
      </v-list-item> -->
    </v-list>
    <v-divider></v-divider>
    <!-- <v-list nav dense>
      <v-list-item-group color="primary">
        <div v-for="(item, i) in itemsNavBar" :key="i">
          <router-link v-if="!item.children" :key="i" :to="item.route" exact>
            <v-list-item
              :class="{
                'v-list-item-navbar': true,
                'v-list-item--active': isActive(item.route),
              }"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <v-list-group
            :value="false"
            prepend-icon="mdi-folder"
            v-if="item.children"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </template>
<div class="ml-6">
  <router-link v-for="(item, i) in item.children" :key="i" :to="item.route" exact>
    <v-list-item :class="{
                    'v-list-item-navbar': true,
                    'v-list-item--active': isActive(item.route),
                  }">
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </router-link>
</div>
</v-list-group>
</div>
</v-list-item-group>
</v-list> -->
    <!--     <v-list nav dense>
      <v-list-item-group color="primary">
        <div v-for="(item, i) in itemsNavBar" :key="i">
          <router-link v-if="!item.children" :key="i" :to="item.route" exact>
            <v-list-item
              :class="{
                'v-list-item-navbar': true,
                'v-list-item--active': isExactActive(item.route),
              }"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <v-list-group
            :value="isGroupActive(item.children)"
            prepend-icon="mdi-folder"
            v-if="item.children"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </template>
            <div class="ml-6">
              <router-link
                v-for="(child, j) in item.children"
                :key="j"
                :to="child.route"
                exact
              >
                <v-list-item
                  :class="{
                    'v-list-item-navbar': true,
                    'v-list-item--active': isExactActive(child.route),
                  }"
                  @click.prevent
                >
                  <v-list-item-icon>
                    <v-icon>{{ child.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ child.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
            </div>
          </v-list-group>
        </div>
      </v-list-item-group>
    </v-list> -->
    <!--  <v-list nav dense>
      <v-list-item-group color="primary">
        <div v-for="(item, i) in itemsNavBar" :key="i">
          <router-link v-if="!item.children" :key="i" :to="item.route" exact>
            <v-list-item
              :class="{
                'v-list-item-navbar': true,
                'v-list-item--active': isExactActive(item.route),
              }"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <v-list-group
            :value="isGroupActive(item.children)"
            prepend-icon="mdi-folder"
            v-if="item.children"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </template>
            <div class="ml-6">
              <router-link
                v-for="(child, j) in item.children"
                :key="j"
                :to="child.route"
                exact
              >
                <v-list-item
                  :class="{
                    'v-list-item-navbar': true,
                    'v-list-item--active': isExactActive(child.route),
                  }"
                >
                  <v-list-item-icon>
                    <v-icon>{{ child.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ child.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
            </div>
          </v-list-group>
        </div>
      </v-list-item-group>
    </v-list> -->
    <v-list nav dense>
      <v-list-item-group color="primary">
        <div v-for="(item, i) in itemsNavBar" :key="i">
          <router-link v-if="!item.children" :key="i" :to="item.route" exact>
            <v-list-item :class="{
              'v-list-item-navbar': true,
              'v-list-item--active': isExactActive(item.route),
            }">
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <v-list-group :value="isGroupActive(item.children)" prepend-icon="mdi-folder" v-if="item.children"
            style="color: #ffff !important" color="#ffff">
            <template v-slot:activator>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </template>
            <div class="ml-6">
              <router-link v-for="(child, j) in item.children" :key="j" :to="child.route" exact>
                <v-list-item :class="{
                  'v-list-item-navbar': true,
                  'v-list-item--active': isExactActive(child.route),
                }">
                  <v-list-item-icon>
                    <v-icon>{{ child.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ child.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
            </div>
          </v-list-group>
        </div>
      </v-list-item-group>
    </v-list>
  </div>
</template>
<style scoped>
a {
  text-decoration: none;
}

.v-list-item--link:before {
  background: transparent !important;
}

::v-deep .theme--light.v-icon {
  color: rgba(255, 255, 255) !important;
}

::v-deep .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: rgba(203, 203, 203, 0.478);
}

.router-link-exact-active.router-link-active .v-list-item--active {
  background-color: #ffffff3b;
  color: #ffffff;
  font-weight: 400 !important;
}

.v-list-group div,
.v-list-item-navbar.v-list-item {
  color: #ffffff !important;
  font-weight: 400 !important;
}

.v-list-item-navbar {
  transition: background-color 0.3s, color 0.3s;
}

.v-list-item__title {
  text-align: left;
  font-weight: 400 !important;
}

.v-list-item__icon .v-icon.notranslate.mdi.mdi-folder.theme--light,
.v-list-item__icon .v-icon.notranslate.mdi.mdi-folder.theme--light,
.v-list-item__icon.v-list-group__header__prepend-icon .v-icon {
  color: white !important;
}

.v-list-group {
  color: white !important;
}

.v-list-item-navbar:hover {
  background-color: #ffffff10;
}
</style>
<script>
import Swal from "sweetalert2";
import { mapState } from "vuex";
export default {
  name: "navBarV",
  props: ["selectedItemBar"],
  data() {
    return {
      openGroups: [],
      status: false,
      selectedItem: null,
      itemModalidad: null,
      itemPeriodo: null,
      itemsNavBar: [
        { text: "Inicio", icon: "mdi-folder", route: "/go/inicio" },
        { text: "Registros", icon: "mdi-folder", route: "/go/registros" },
        {
          text: "Administración",
          icon: "mdi-folder",
          route: "",
          children: [
            { text: "Ipress", icon: "mdi-folder", route: "/go/ipress" },
            { text: "Pacientes", icon: "mdi-folder", route: "/go/pacientes" },
            { text: "Perfiles", icon: "mdi-folder", route: "/go/perfiles" },
            { text: "Usuarios", icon: "mdi-folder", route: "/go/usuarios" },
            { text: "Asignación", icon: "mdi-folder", route: "/go/asignacion" },
            {
              text: "Carga masiva",
              icon: "mdi-folder",
              route: "/go/carga-masiva-pacientes",
            },
          ],
        },
        {
          text: "Gestión",
          icon: "mdi-folder",
          route: "",
          children: [
            { text: "Pre carga", icon: "mdi-folder", route: "/go/pre-carga" },
            { text: "Cerrar mes", icon: "mdi-folder", route: "/go/cerrar-mes" },
            { text: "Abrir mes", icon: "mdi-folder", route: "/go/abrir-mes" },
          ],
        },
        { text: "Estadística", icon: "mdi-folder", route: "/go/estadistica" },
      ],
    };
  },
  watch: {
    $route() {
      // Fuerza la actualización del componente cuando la ruta cambia
      this.$forceUpdate();
      console.log("me estoy ejecuentado");
    },
  },
  computed: {
    ...mapState({
      activeRoute: (state) => state.activeRoute,
    }),
  },
  methods: {
    isExactActive(route) {
      return this.$route.path === route;
    },
    isGroupActive(children) {
      return children.some((child) => this.$route.path.startsWith(child.route));
    },
    toggleGroup(group) {
      if (this.openGroups.includes(group)) {
        this.openGroups = this.openGroups.filter((g) => g !== group);
      } else {
        this.openGroups.push(group);
      }
    },
    isGroupOpen(group) {
      return this.openGroups.includes(group);
    },
    isActive(route) {
      return this.$route.path === route;
    },
    updateItem(tipo, index) {
      const body = { index: index, tipo: tipo };
      this.status = !this.status;
      this.$emit("updateItemBar", body);
    },
  },
  created() {
    this.itemModalidad = sessionStorage.getItem("itemModalidad");
    this.itemPeriodo = sessionStorage.getItem("itemPeriodo");
    this.selectedItem = this.selectedItemBar;
    this.perfil = sessionStorage.getItem("perfil");
    this.nombre = sessionStorage.getItem("nombre");
  },
};
</script>