export default {
  setItem(k, v) {
    localStorage.setItem(k, v);
  },
  getItem(k) {
    return localStorage.getItem(k) || null;
  },
  removeItem(k) {
    localStorage.removeItem(k);
  },
  clear() {
    localStorage.clear();
  },
};
