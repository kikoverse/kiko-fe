<template>
  <app-header></app-header>
  <app-main></app-main>
</template>

<script setup>
import { onBeforeMount } from "vue";
import AppHeader from "./AppHeader.vue";
import AppMain from "./AppMain.vue";
import HOME_CONSTANTS from "@constants/home";

onBeforeMount(() => {
  const imgArr = [
    HOME_CONSTANTS.PLUTUS_CAT,
    HOME_CONSTANTS.RUNNING_CAT,
    HOME_CONSTANTS.THIRD_CAT,
    HOME_CONSTANTS.PHOTO_CAT,
    HOME_CONSTANTS.LIQUIDITY_CAT,
  ];
  const image = new Image();
  for (let k of imgArr) {
    image.src = k;
  }
});
</script>

<style lang="scss" module></style>
