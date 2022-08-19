import router from "../router/index";
import { ref } from "vue";

// https://next.router.vuejs.org/zh/api/#routelocationraw
/**
 *
 * @param {
 * name: String,
 * query: Object,
 * params: Object,
 * path: String,
 * meta: String,
 *
 * } options
 */
function push(options) {
  router.push(options);
}

function back() {
  router.go(-1);
}

function getCurrentRoute() {
  return ref(router.currentRoute).value;
}

const encodePath = (str) => {
  return window.encodeURI(str);
};

const decodePath = (str) => {
  return window.decodeURI(str);
};
export default {
  push,
  back,
  getCurrentRoute,
  encodePath,
  decodePath,
};
