import { createRouter, createWebHistory } from 'vue-router'
import OAuth from '../components/oAuth.vue'
import Exito from '../views/exito.vue'

const routes = [
  {
    path: "/",
    name: "OAuth",
    component: OAuth,
  },
  {
    path: "/exito",
    name: "Exito",
    component: Exito,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router