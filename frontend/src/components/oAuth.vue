<template>
  <div>
    <div v-if="!user">
      <a href="#" @click.prevent="openSignInDialog">Login</a>
    </div>
    <div v-else>
      <img v-if="this.user.profilePicture" :src="this.user.profilePicture" alt="User photo"
        style="width: 50px; height: 50px; border-radius: 50%" />
      <img v-else src="../assets/blank-profile-picture-973460_1280.webp" alt="User photo"
        style="width: 50px; height: 50px; border-radius: 50%" /><br/>
      <button @click="authStore.logout">Salir</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";

export default {
  computed: {
    authStore() {
      return useAuthStore();
    },
    user() {
      return this.authStore.getLoggedUser;
    },
  },
  methods: {
    openSignInDialog() {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        // Abre el cuadro de diálogo de inicio de sesión
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {    // Si por cualquier motivo no se muestra el cuadro de inicio de sesión
            console.log("El cuadro de inicio de sesión no se mostró.");
            document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";    // Elimina la cookie de cooldown

            const popup = window.open(
              "/window-login.html", // Ruta al archivo donde se ejecutará `windowLogin()`
              "_blank",
              "width=600,height=600"
            );

            if (!popup) {
              alert("No se pudo abrir la ventana de inicio de sesión. Por favor, desactiva el bloqueo de ventanas emergentes.");
            }
          }
        });
      } else {
        alert("Google Identity Services no está disponible.");
        console.error("Google Identity Services no está disponible.");
      }
    },
    async handleCredentialResponse(response) {
      console.log("Credencial recibida:", response.credential);

      try {
        await this.authStore.login(response.credential); // Llamar al store para manejar el inicio de sesión
      } catch (error) {
        console.error("Error al manejar el inicio de sesión:", error);
      }
    },
    handleStorageChange(event) {
      if (event.key === "sesion_iniciada" && event.newValue === "true") {
        console.log("Sesión iniciada desde la ventana emergente.");
        location.reload(); // Recargar la página para reflejar el inicio de sesión
      }
    },
    async verifySession() {
      try {
        await this.authStore.verifyTokenAndRestore(); // Verificar el token y restaurar la sesión si es válido
      } catch (error) {
        console.error("Error al verificar el token y restaurar la sesión:", error);
        localStorage.setItem("sesion_iniciada", "false");
      }
    },
    loadGoogleIdentityServices() {
      // Código existente para cargar Google Identity Services
      if (!document.querySelector("script[src='https://accounts.google.com/gsi/client']")) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.initialize({
              client_id: "182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com",
              callback: this.handleCredentialResponse,
              auto_select: false,
            });
            console.log("Google Identity Services inicializado.");
          } else {
            console.error("Google Identity Services no está disponible.");
          }
        };

        document.head.appendChild(script);
      }
    }
  },
  mounted() {
    // Añadir un listener para detectar cambios en el sessionStorage. 
    // Esto es útil para detectar si el usuario ha iniciado sesión en otra pestaña.
    window.addEventListener('storage', this.handleStorageChange);
    
    // Comprobar si el usuario ya ha iniciado sesión
    this.verifySession();

    this.loadGoogleIdentityServices();
  },
};
</script>