<template>
    <div>
      <h1>Iniciar sesión con OAuth</h1>
      <button @click="login">Iniciar sesión</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "OAuth",
    methods: {
      login() {
        // Redirige al usuario al endpoint OAuth del backend
        window.location.href = `${process.env.VUE_APP_API_URL}/auth/google`;
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
  }
  button:hover {
    background-color: #357ae8;
  }
  </style>
  