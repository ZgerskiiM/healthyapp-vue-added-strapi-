import { createRouter, createWebHistory } from "vue-router";
import Main from "/src/components/Main.vue";
import Graph from "/src/components/Graph.vue";
import ProductList from "/src/components/ProductList.vue";
import UserData from "/src/components/UserData.vue";

export const router = createRouter({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
    },
    {
      path: "/graph",
      name: "Graph",
      component: Graph,
    },
    {
      path: "/list",
      name: "List",
      component: ProductList,
    },
    {
      path: "/data",
      name: "Data",
      component: UserData,
    },
  ],
  history: createWebHistory(),
});
