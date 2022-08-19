module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    // defineEmits和defineProps在<script setup>中自动可用，无需导入
    defineEmits: true,
    defineProps: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
