<template>
  <div>
    <div v-if="!user">
      <a href="#" @click.prevent="openSignInDialog">Iniciar sesión</a>
    </div>
    <div v-else>
      <h3>{{ user.name }}</h3>
      <img :src="user.picture" alt="User photo" style="width: 50px; height: 50px; border-radius: 50%" /><br />
      <button @click="signOut">Sign out</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    async verifyTokenLocally() {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        axios
          .post("http://localhost:5000/users/validate-token", { token: authToken })
          .then((response) => {
            if (response.data.valid) {
              this.user = response.data.user; // Establecer datos del usuario
              console.log("Sesión válida");
              this.renewToken();              // Se renueva el token para alargar la sesión

              // Al recuperar del backend la imagen no funcionaba, con esto se corrige
              if (this.user.profilePicture) {
                this.user.picture = this.user.profilePicture;
              } else {
                this.user.picture = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
              }
            } else {
              console.warn("Token inválido o caducado. Se ha cerrado la sesión");
              this.signOut(); // Limpiar estado y redirigir
            }
          })
          .catch((error) => {
            console.error("Error al validar el token:", error);
            this.signOut();
          });
      } else {
        console.log("No hay token almacenado.");
        google.accounts.id.prompt();
      }
    },
    renewToken() {
      // Verificar y renovar el token si es necesario
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        console.log("Verificando token:", authToken);
        const decodedToken = JSON.parse(atob(authToken.split(".")[1])); // Decodificar el token
        const expirationTime = decodedToken.exp * 1000; // Convertir a milisegundos
        const currentTime = new Date().getTime();

        if (currentTime < expirationTime) {
          // Si el token no ha expirado, renovamos su expiración llamando al backend
          console.log("Token válido. Renovando...");

          // Realizamos una solicitud al backend para renovar el token
          axios
            .post("http://localhost:5000/users/renew-token", { token: authToken })
            .then((response) => {
              const newToken = response.data.newToken; // El nuevo token proporcionado por el backend
              localStorage.setItem("authToken", newToken); // Guardar el nuevo token
              console.log("Token renovado:", newToken);
            })
            .catch((error) => {
              console.error("Error al renovar el token:", error);
              this.signOut(); // Cerrar sesión si ocurre un error
            });
        } else {
          console.log("El token ha expirado.");
          this.signOut(); // Cerrar sesión si el token ha expirado
        }
      } else {
        console.log("No hay token almacenado.");
      }
    },
    handleCredentialResponse(response) {
      if (response.credential) {      // Token firmado de Google
        try {
          const idToken = response.credential;
          const decodedToken = JSON.parse(atob(idToken.split(".")[1])); // Decodificar el token JWT de Google

          // Enviar el token al backend para validación y recibir el token personalizado
          axios
            .post("http://localhost:5000/users/login", { token: idToken })
            .then((response) => {
              const serverResponse = response.data;

              if (serverResponse.customToken) {
                // Guardar el token personalizado en localStorage
                localStorage.setItem("authToken", serverResponse.customToken);

                // Asignar los datos del usuario al estado de la aplicación
                this.user = {
                  email: serverResponse.user.email,
                  name: serverResponse.user.name,
                  picture: decodedToken.picture || "", // Imagen del perfil desde el token de Google
                  id: serverResponse.user._id, // ID del usuario en nuestra base de datos
                };

                console.log("Usuario autenticado");
              } else {
                console.error("No se recibió un token personalizado del servidor.");
              }
            })
            .catch((error) => {
              console.error("Error al autenticar usuario:", error);
            });
        } catch (error) {
          console.error("Error al procesar el token:", error);
        }
      } else {
        console.error("No credential received.");
      }
    },
    openSignInDialog() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.prompt(); // Abre el cuadro de diálogo de inicio de sesión
      } else {
        console.error("Google Identity Services no está disponible.");
      }
    },
    signOut() {
      // Resetear la información del usuario en la aplicación
      localStorage.removeItem("authToken");
      this.user = null;

      console.log("Sesión cerrada localmente.");
    },
  },
  mounted() {
    // Cargar la biblioteca GIS
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      google.accounts.id.initialize({
        client_id: "182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com",
        callback: this.handleCredentialResponse,
        auto_select: true, // Permite iniciar sesión automáticamente si hay una sesión activa
      });

      // Verificar token al cargar
      this.verifyTokenLocally();
    };
    document.head.appendChild(script);
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
