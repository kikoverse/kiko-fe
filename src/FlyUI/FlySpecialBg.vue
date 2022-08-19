<template>
  <div class="special-bg">
    <SvgIcon
      name="beathImage"
      class="beathImage"
      :style="`transform: translate(${pos.left}px, ${pos.top}px)`"
    ></SvgIcon>
    <SvgIcon
      name="gradient"
      class="gradient"
      :style="`transform: translate(${posGradient.left}px, ${posGradient.top}px)`"
    ></SvgIcon>

    <!-- <template v-else class="avatarBg">
      <SvgIcon name="beathImage" class="avatarBg-breath"></SvgIcon>
      <SvgIcon name="gradient" class="avatarBg-gradient"></SvgIcon>
    </template>-->
    <div class="animation" v-if="props.showSquare">
      <SvgIcon name="squareLeft" class="squareLeft"></SvgIcon>
      <SvgIcon name="squareMiddle" class="squareMiddle"></SvgIcon>
      <SvgIcon name="squareRight" class="squareRight"></SvgIcon>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, defineProps } from "vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { debounce } from "lodash";
const props = defineProps({
  showSquare: {
    //是否显示方块，默认不显示
    type: Boolean,
    default: () => false,
  },
  // isAvatar: {
  //   type: Boolean,
  //   default: () => false,
  // },
});
const pos = reactive({
  left: -350,
  top: -179,
});
const posGradient = reactive({
  left: -778,
  top: document.documentElement.clientHeight - 707,
});
// let open = true;
const debouMove = debounce((e) => {
  const scroll_top = document.documentElement.scrollTop;

  pos.left = e.pageX - 350;
  pos.top = e.pageY - scroll_top - 179;

  posGradient.left = e.pageX - 778;
  posGradient.top = e.pageY - scroll_top - 707;
}, 2000);
onMounted(() => {
  document.addEventListener("mousemove", debouMove);

  pos.left = document.documentElement.clientWidth - 350;
  pos.top = document.documentElement.clientHeight - 179;

  posGradient.left = document.documentElement.clientWidth - 778;
  posGradient.top = -707;
});
onBeforeMount(() => {
  document.removeEventListener("mousemove", debouMove);
});
</script>

<style lang="scss" scoped>
.special-bg {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
  // 硬件加速
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  .beathImage {
    position: absolute;
    // top: v-bind("pos.top");
    // left: v-bind("pos.left");
    width: 700px;
    height: 358px;
    animation: 3s infinite beath;
    transform-origin: 50% 50%;
    transition: 50s all linear;
    left: 0;
    top: 0;
  }
  .gradient {
    position: absolute;
    left: 0;
    top: 0;
    // top: 100px;
    // left: 100px;
    width: 1557px;
    height: 1414px;
    transition: 50s all linear;
    opacity: 0.8;
  }
  .animation {
    position: relative;
    margin-left: -692px;
    .squareLeft {
      width: 152px;
      height: 245px;
      animation: 3s ease-in-out 1s infinite normal none running bRTaPl;
    }
    .squareMiddle {
      width: 32px;
      height: 68px;
      position: absolute;
      left: 2px;
      top: 77px;
      animation: 3s ease-in-out 0.66s infinite normal none running dwSZFG;
    }
    .squareRight {
      width: 135px;
      height: 138px;
      left: 62px;
      top: 54px;
      position: absolute;
      animation: 3s ease-in-out 0.33s infinite normal none running uvIwZ;
    }
  }
}

// .avatarBg-
.avatarBg-breath {
  position: absolute;
  right: -100px;
  bottom: -200px;
  width: 700px;
  height: 512px;
}
.avatarBg-gradient {
  position: absolute;
  right: -400px;
  bottom: -200px;
  width: 1000px;
  height: 500px;
}

@keyframes beath {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.3;
  }
}
@keyframes bRTaPl {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(5px, 30px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
@keyframes dwSZFG {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(8px, 16px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
@keyframes uvIwZ {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(9px, 11px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>
