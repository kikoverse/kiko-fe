<template>
  <div class="star-swap-card">
    <slot></slot>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.star-swap-card {
  background-image: url("../../src/assets/common/bg.png");
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 34px;
  width: 440px;
  padding: 30px 28px 40px;
}
</style>
