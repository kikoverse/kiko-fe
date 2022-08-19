<template>
  <div class="fly-swap-card">
    <slot></slot>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.fly-swap-card {
  background-image: url("../../src/assets/common/bg.png");
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 16px;
  width: 440px;
  padding: 30px 28px 40px;
}
</style>
