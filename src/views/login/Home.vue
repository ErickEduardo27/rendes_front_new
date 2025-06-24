<template>
  <section id="Animated-Login-Form">
    <img class="wave" src="../../assets/wave1.png" />
    <div class="containerW">
      <div class="img">
        <img src="../../assets/rendes.png" alt="" />
      </div>
      <div class="login-content">
        <div>
          <img src="../../assets/logo_cnsr.png" />
          <h2 class="titleW">RENDES</h2>
          <div class="input-div one">
            <div class="i">
              <i class="fas fa-user"></i>
            </div>
            <div class="div">
              <h5>Usuario</h5>
              <input type="text" class="input" id="input-user" v-model="usuario" />
            </div>
          </div>
          <div class="input-div passW">
            <div class="i">
              <i class="fas fa-user"></i>
            </div>
            <div class="div">
              <h5>Contraseña</h5>
              <input type="password" class="input" v-model="contra" @keyup.enter="iniciarSesion" />
            </div>
          </div>
          <div class="div" style="margin: 2.5rem 0">
            <v-autocomplete v-model="ipressSelect" :items="dataIpress" item-text="ipress" item-value="url"
              id="inputField" dense label="IPRESS"></v-autocomplete>
          </div>
          <button class="btn" @click="iniciarSesion">Iniciar sesión</button>
          <v-dialog v-model="dialog" persistent width="300">
            <v-card color="primary" dark>
              <v-card-text>
                Cargando Datos
                <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-alert dense outlined text :value="value" type="error">
            Datos incorrectos. Intentelo de nuevo.
          </v-alert>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.v-label {
  margin-left: 2.5rem;
}

/**/
.img img {
  filter: hue-rotate(20deg);
}

#Animated-Login-Form {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  overflow: hidden;
}

.wave {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 1;
}

.containerW {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 7rem;
  padding: 0 2rem;
  grid-gap: 15rem;
}

#Animated-Login-Form .img {
  display: flex;
  z-index: 2;
  justify-content: flex-end;
  align-items: center;
}

.login-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
}

#Animated-Login-Form .img img {
  width: 500px;
}

#Animated-Login-Form form {
  width: 360px;
}

.login-content img {
  height: 100px;
}

.login-content h2 {
  margin: 15px 0;
  color: #333;
  text-transform: uppercase;
  font-size: 2.9rem;
}

.login-content .input-div {
  position: relative;
  display: grid;
  grid-template-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one {
  margin-top: 0;
}

#Animated-Login-Form .i {
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
}

#Animated-Login-Form .i i {
  transition: 0.3s;
}

.input-div>div {
  position: relative;
  height: 45px;
}

.input-div>div>h5 {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
  transition: 0.3s;
}

.input-div:before,
.input-div:after {
  content: "";
  position: absolute;
  bottom: -2px;
  width: 0%;
  height: 2px;
  background-color: #3678b0;
  transition: 0.4s;
}

.input-div:before {
  right: 50%;
}

.input-div:after {
  left: 50%;
}

.input-div.focus:before,
.input-div.focus:after {
  width: 50%;
}

.input-div.focus>div>h5 {
  top: -5px;
  font-size: 15px;
}

.input-div.focus>.i>i {
  color: #3678b0;
}

.input-div>div>input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: #555;
  font-family: "poppins", sans-serif;
}

.input-div.passW {
  margin-bottom: 4px;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #3678b0;
}

#Animated-Login-Form .btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #3678b0, #76aad5, #4f91c9);

  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  margin: 1rem 0;
  cursor: pointer;
  transition: 0.5s;
}

#Animated-Login-Form .btn:hover {
  background-position: right;
}

@media screen and (max-width: 1440px) {
  .containerW {
    grid-gap: 5rem;
  }

  #Animated-Login-Form .img img {
    width: 400px;
  }

  .wave {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50%;
    z-index: 1;
  }
}

@media screen and (max-width: 1050px) {
  .containerW {
    grid-gap: 5rem;
  }

  #Animated-Login-Form .img img {
    width: 400px;
  }

  .wave {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50%;
    z-index: 1;
  }
}

@media screen and (max-width: 1000px) {
  #Animated-Login-Form form {
    width: 290px;
  }

  .login-content h2 {
    font-size: 2.4rem;
    margin: 8px 0;
  }

  #Animated-Login-Form .img img {
    width: 400px;
  }

  .wave {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50%;
    z-index: 1;
  }
}

@media screen and (max-width: 900px) {
  .containerW {
    grid-template-columns: 1fr;
  }

  #Animated-Login-Form .img {
    display: none;
  }

  .wave {
    display: none;
  }

  .login-content {
    justify-content: center;
  }
}

/**/
.g-signin2 {
  background-color: red;
  color: white;
  width: 120px;
}

.cnsr-logo {
  margin: auto;
}
</style>
<script>
import axios from "axios";

export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
export default {
  /*directives: {
        GoogleSignInButton
    },
    components:{ GoogleLogin },*/
  data() {
    return {
      dialog: false,
      valid: false,
      usuario: "",
      contra: "",
      value: false,
      itemsIpress: [{ labe: "Clínica", value: 3 }],
      dataIpress: [],
      //Datos de formulario
      rules: {
        required: (value) => !!value || "Campo Obligatorio.",
        counter: (value) => value.length <= 20 || "Max 20 characters",
      },
      ipressSelect: "",
    };
  },
  methods: {
    dataInit() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/indexIpress/?estado=ACTIVO&ipress=" + this.ipressSelect, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res);
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
              this.dataIpress = listaOrdenada;

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
    loadIpress(value) {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/indexIpress/?ipress=" + value + "&estado=ACTIVO", {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              console.log("exito", res);
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
              this.dataIpress = listaOrdenada;
              this.dataIpress.forEach((item) => {
                // Calcula el nombre completo y guárdalo en una nueva propiedad 'nombreCompleto'
                item.ipressCompleta = `${item.ipress} - ${item.microred}`;
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
    addcl(input) {
      // console.log(input)
      let parent = input.parentNode.parentNode;
      parent.classList.add("focus");
    },
    remcl(input) {
      let parent = input.parentNode.parentNode;
      if (input.value == "") {
        parent.classList.remove("focus");
      }
    },
    onSuccess(googleUser) {
      console.log(googleUser);

      // This only gets the user information: id, name, imageUrl and email
      console.log(googleUser.getBasicProfile());
    },
    onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    },
    iniciarSesion() {
      this.loadIpressCarga();
      this.dialog = true;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/usuario/?search=" + this.usuario, {
              headers: { Authorization: this.auth },
            })
            .then((resp) => {
              axios
                .get(
                  RUTA_API +
                  "/usuarioIpressFilter/?id_usuario=" +
                  resp.data[0].url.split("/")[4],
                  {
                    headers: { Authorization: this.auth },
                  }
                )
                .then((res) => {
                  let status = false;
                  console.log("erro segunda linea ")
                  for (let i = 0; i < res.data.length; i++) {
                    console.log("erro segunda linea ", res.data[i].id_ipress.split("/")[4]);
                    console.log("erro segunda linea ", this.ipressSelect.split("/")[4]);
                    if (
                      res.data[i].id_ipress.split("/")[4] ==
                      this.ipressSelect.split("/")[4]
                    ) {
                      console.log("erro primera linea del codigo ")
                      sessionStorage.setItem(
                        "idUsuarioIpress",
                        res.data[i].url
                      );
                      sessionStorage.setItem(
                        "itemIpress",
                        res.data[i].id_ipress
                      );
                      console.log("itemIpress", res.data[i].id_ipress);
                      sessionStorage.setItem(
                        "itemUsuarioIpress",
                        res.data[i].url
                      );

                      const url = res.data[i].url;
                      const extractedUrl = url.match(/^http:\/\/[^\/]+\//)[0];
                      sessionStorage.setItem("dominioActual", extractedUrl);
                      status = true;
                    }
                  }
                  if (status === true) {
                    console.log("error prueba ");
                    sessionStorage.setItem("keyValue", response.data.access);
                    sessionStorage.setItem(
                      "dniUsuario",
                      resp.data[0].documento
                    );
                    sessionStorage.setItem("usuario", resp.data[0].usuario);
                    sessionStorage.setItem("nombre", resp.data[0].nombre);
                    sessionStorage.setItem(
                      "perfil",
                      resp.data[0].id_perfil.split("/")[4]
                    );
                    sessionStorage.setItem("url", resp.data[0].url);
                    sessionStorage.setItem(
                      "itemModalidad",
                      resp.data[0].url.match(/^http:\/\/[^\/]+\//)[0] +
                      "modalidades/1/"
                    );
                    if (resp.data[0].clave == this.contra) {
                      console.log("aqui pasamos bien todo bien hasta aqui ");
                      if (resp.data[0].id_perfil.split("/")[4] == "84") {
                        this.$router.push("/censo");
                      } else {
                        this.$router.push("/go/inicio");
                        this.loadFecha();
                        this.registrarPeriodoIpress();
                      }
                      this.dialog = false;
                    } else {
                      /* this.value = true; */
                      this.dialog = false;
                    }
                  } else {
                    this.value = true;
                    this.dialog = false;
                  }
                })
                .catch((res) => {
                  console.log("ERROR:", res);
                  this.value = true;
                  this.dialog = false;
                });
            })
            .catch((res) => {
              console.log("ERROR:", res);
              this.value = true;
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
          //this.value = true;
        });
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
              sessionStorage.setItem(
                "descripCas",
                res.data[0].datosIpress.ipress
              );
              sessionStorage.setItem("itemUsuarioIpress", res.url);
              console.log("datos de ipress", res);
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
        });
    },
    ingresar() {
      this.value = false;
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(RUTA_API + "/usuario/?search=" + this.usuario, {
              headers: { Authorization: this.auth },
            })
            .then((res) => {
              sessionStorage.setItem("keyValue", response.data.access);
              sessionStorage.setItem("dniUsuario", res.data[0].num_doc); /*new*/
              sessionStorage.setItem("usuario", res.data[0].usuario);
              sessionStorage.setItem("nombre", res.data[0].nombre);
              sessionStorage.setItem("perfil", res.data[0].perfil_id);
              sessionStorage.setItem("url", res.data[0].url);
              /* sessionStorage.setItem(
                "descripCas",
                res.data[0].datosCas.descripCas
              ); */
              sessionStorage.setItem("urlCas", res.data[0].datosCas.url);
              if (
                res.data[0].clave == this.contra &&
                res.data[0].perfil_id != "principal"
              ) {
                console.log("Ingreso exitoso");
                this.$router.push("/tramites");
              } else if (
                res.data[0].clave == this.contra &&
                res.data[0].perfil_id == "principal"
              ) {
                console.log("Ingreso principal");
                this.$router.push("/principaldsi");
              } else {
                this.value = true;
              }
            })
            .catch((res) => {
              console.warn("Erroress  :", res);
              this.value = true;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("Lo siento, no tenemos servicios")
            : console.warn("Error: ", response);
          this.value = true;
        });
    },

    actualizar() {
      this.value = false;
    },
    onSignIn(user) {
      const profile = user.getBasicProfile();
    },
    loadFecha() {
      axios
        .post(RUTA_API + "/api/token/", {
          username: USUARIO,
          password: PASSWORD,
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .post(
              RUTA_API + "/scritpFecha/",
              {},
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("Gracias", res.data);
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
  },
  mounted() {
    const inputField = document.getElementById("inputField");

    inputField.addEventListener("input", (event) => {
      console.log("Se está escribiendo...");
      /* this.dataInit(); */
      const valor = event.target.value;
      /* if(valor===null){
        this.loadIpress(valor);
      } */
      this.loadIpress(valor);
      console.log("Valor del input:", valor);
      // Tu lógica aquí
    });
    const inputs = this.$el.querySelectorAll(".input");

    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        let parent = input.parentNode.parentNode;
        parent.classList.add("focus");
      });
      input.addEventListener("blur", function () {
        let parent = input.parentNode.parentNode;
        if (input.value == "") {
          parent.classList.remove("focus");
        }
      });
    });
  },
  created() {
    console.log("estoy iniciando");
    this.dataInit();
  },
};
</script>
