<template>
  <div class="nft-status">
    <div
      class="nft-status-item"
      v-for="(d, i) in state.radios"
      :key="i"
      @click="clickRadio(i)"
    >
      <div class="nft-status-item-circle">
        <div
          class="nft-status-item-circle-inner"
          :class="d.isOpen ? ' active' : ''"
        ></div>
      </div>
      <span>
        {{ $t(d.name) }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { reactive, defineEmits } from "vue";
// import { ElTooltip } from "element-plus";

let state = reactive({
  radios: [
    {
      name: "盲盒",
      isOpen: true,
    },
    {
      name: "NFT",
      isOpen: true,
    },
  ],
});

//未打开已打开点击效果
let clickRadio = (i) => {
  state.radios[i].isOpen = !state.radios[i].isOpen;
  emits("clickRadio", state.radios);
};

const emits = defineEmits(["clickRadio"]);
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.nft-status {
  display: flex;
  color: $white;
  position: absolute;
  right: 0;
  top: 7px;
  .nft-status-item {
    display: flex;
    margin-right: 24px;
    span {
      color: $white;
    }
    .nft-status-item-circle {
      user-select: none;
      cursor: pointer;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      margin-right: 8px !important;
      .nft-status-item-circle-inner {
        width: 14px;
        height: 14px;
        background: rgba(251, 168, 0, 0.2);
        border-radius: 50%;
        &.active {
          background: #fba800;
        }
      }
    }
  }
}
</style>
