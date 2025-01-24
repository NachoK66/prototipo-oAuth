<template>
    <h1>Sesión iniciada, cerrando ventana...</h1>
</template>

<script>
import { useAuthStore } from "../stores/auth";

export default {
    computed: {
        authStore() {
            return useAuthStore();
        }
    },
    async mounted() {
        // Extraer el token de acceso de la URL
        const hash = window.location.hash.substring(1); // Quita el '#'
        const params = new URLSearchParams(hash);
        const idToken = params.get("id_token");

        if (idToken) {
            // Llamar al store para manejar el inicio de sesión
            await this.authStore.login(idToken);
            localStorage.setItem("sesion_iniciada", "true");
        } else {
            console.error("No se encontró un token de acceso en la URL.");
            localStorage.setItem("sesion_iniciada", "false");
        }

        window.close(); // Cerrar la ventana actual
    }
};
</script>
