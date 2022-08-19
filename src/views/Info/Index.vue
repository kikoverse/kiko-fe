<template>
  <div :class="$style['container-assets']">
    <assets-list></assets-list>
  </div>
</template>
<script setup>
import AssetsList from "@components/Info/assetslist.vue";
</script>

<style lang="scss" module>
.container-assets {
  width: 1200px;
  margin: 0 auto;
}
</style>
