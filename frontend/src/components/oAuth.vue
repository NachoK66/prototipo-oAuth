<template>
  <div id="oauth">
    <!-- Botón de inicio de sesión -->
    <div id="g_id_onload"
      data-client_id="182571812959-9dtpldakbn2bk4m15jd0ijmqoe50p4nb.apps.googleusercontent.com"
      data-context="signin"
      data-callback="handleCredentialResponse">
    </div>
    <div class="g_id_signin" data-type="standard"></div>

    <!-- Botón de cerrar sesión -->
    <button @click="signOut">Sign out</button>
  </div>
</template>


<script>
export default {
  name: "OAuth",
  methods: {
    handleCredentialResponse(response) {
      if (response.credential) {
        // Decodificar el token JWT para obtener datos del usuario
        const id_token = response.credential;
        const decodedToken = JSON.parse(atob(id_token.split(".")[1])); // Decodificación del payload
        console.log("ID Token:", id_token);
        console.log("Decoded Token Payload:", decodedToken);

        // Mostrar datos importantes para depuración
        console.log("User ID:", decodedToken.sub);
        console.log("User Email:", decodedToken.email);
        console.log("User Name:", decodedToken.name || "Name not provided");
        console.log("Picture URL:", decodedToken.picture || "No picture provided");
      } else {
        console.error("No credential received.");
      }
    },
    signOut() {
      console.log("Google Identity Services no tiene un método directo para cerrar sesión.");
      // Si necesitas implementar un flujo de cierre de sesión, tendrás que manejarlo manualmente
    },
  },
  mounted() {
    // Carga la biblioteca de Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Identity Services loaded.");
    };
    document.head.appendChild(script);
    window.handleCredentialResponse = this.handleCredentialResponse;
  },
};
</script>

<style>
/* Añade estilos si es necesario */
#g-signin2 {
  margin-bottom: 10px;
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