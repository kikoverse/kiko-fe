<template>
  <button class="star-button" :class="{ [props.type]: true }">
    <slot></slot>
  </button>
</template>
<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "normal",
  },
});
</script>
<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.star-button {
  padding: 15px 25px;
  text-align: center;
  border: none;
  outline: none;
  border-radius: 8px;
  box-sizing: content-box;
  font-weight: bold;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.3s ease-in-out;
  }
}
.star-button.normal {
  color: $text-orange-color;
  border: 1px solid $border-orange-color;
  background-color: transparent;
}
.star-button.dark {
  color: $white;
  background-color: $btn-orange-bgcolor;
}
.star-button.light {
  color: $text-orange-color2;
  border: 1px solid $orange;
  padding: 14px 25px;
  background: none;
}
.star-button.disabled {
  // background-color: $btn-gray-bgcolor;
  // color: $text-gary2-color;
  background: rgba(178, 178, 178, 0.11);
  color: #b2b2b2;
  border: 1px solid #d1d1d1;
}
.star-button.brown {
  background-color: $btn-light-brown-bgcolor;
  color: $text-brown-color;
}
.star-button.green {
  color: $text-green-color;
  border: 1px solid $border-green-color;
  background-color: #fff;
}
.star-button.red {
  color: $text-error-color;
  border: 1px solid $border-red-color;
  background-color: #fff;
}
</style>
