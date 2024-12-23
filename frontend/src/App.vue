<template>
  <div id="app">
    <OAuth />
    Hola, mundo!
  </div>
  <div>
    <h1>Iniciar sesión con OAuth</h1>
    <button @click="login">Iniciar sesión</button>
  </div>
</template>

<script>
import OAuth from './components/oAuth.vue';

export default {
  name: 'App',
  components: {
    OAuth, // Registro del componente OAuth
  },
};
</script>

<style>
/* Estilos básicos o deja vacío si no necesitas diseño adicional */
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: #f9f9f9; /* Fondo blanco limpio */
  color: #2c3e50;
}
</style>
