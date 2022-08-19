import { createRouter, createWebHistory } from "vue-router";
import routes from "./config";

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

export default router;
