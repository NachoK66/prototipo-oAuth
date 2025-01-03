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
    handleCredentialResponse(response) {
      if (response.credential) {
        try {
          // Decodificar el token JWT
          const idToken = response.credential;
          const decodedToken = JSON.parse(atob(idToken.split(".")[1]));

          // Asignar datos del usuario a la variable
          this.user = {
            email: decodedToken.email,
            picture: decodedToken.picture || "",
            name: decodedToken.name || "",
            id: decodedToken.sub, // Usamos el ID único asignado por Google
          };

          // Enviar el token al backend para validación
          axios.post("http://localhost:5000/users/login", { token: idToken })
            .then((response) => {
              console.log("Respuesta del servidor:", response.data);
              if (!response.data || response.data.length === 0) {
                console.log("Creando");
                // Si la respuesta es una lista vacía, crear un nuevo usuario
                axios.post("http://localhost:5000/users/", {
                  oauthId: decodedToken.sub,  // ID único proporcionado por Google
                  name: decodedToken.name,
                  email: decodedToken.email
                })
                .then((createResponse) => {
                  console.log("Usuario creado con éxito:", createResponse.data);
                })
                .catch((error) => {
                  console.error("Error al crear el usuario:", error);
                });
              } else {
                console.log("Usuario autenticado:", this.user);
              }
            })
          .catch((error) => {
            console.error("Error al autenticar usuario:", error);
          });
          
          console.log("Usuario autenticado:", this.user);
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
      this.user = null;

      this.initializeGoogleSignIn();

      console.log("Sesión cerrada localmente.");
    },
    initializeGoogleSignIn() {
      // Volver a inicializar GIS si es necesario
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
        client_id: "182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com",
          callback: this.handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.querySelector(".g_id_signin"),
          { theme: "outline", size: "large" }
        );
      }
    },
  },
  mounted() {
    // Cargar la biblioteca GIS
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
      console.log("Google Identity Services loaded.");
    };
    document.head.appendChild(script);

    // Asignar el callback al scope global
    window.handleCredentialResponse = this.handleCredentialResponse;
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
