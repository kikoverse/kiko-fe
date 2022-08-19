<template>
  <section
    :class="route.path === '/' ? $style['app-main-home'] : $style['app-main']"
  >
    <router-view
      :class="$style['container']"
      v-slot="{ Component }"
      :key="route.path"
    >
      <slot></slot>
      <component :is="Component" />
    </router-view>
  </section>
</template>

<script setup>
import { watchEffect } from "vue";
import { useRoute } from "vue-router";
import utilsFormat from "@utils/format";

const route = useRoute();
watchEffect(() => {
  document.title =
    utilsFormat.computedLangCtx(route.meta.title).value + " | KikoVerse";
});
</script>

<style lang="scss" module>
.app-main-home {
  width: 100%;
  height: calc(100vh - 74px);
  padding-top: 74px;
}
.app-main {
  margin: 0 auto;
  padding-top: 100px;
  width: 1200px;
  padding-bottom: 80px;
  display: grid;
  height: calc(100vh - 180px);
}
</style>
