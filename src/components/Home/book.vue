<template>
  <div :class="$style['book-container']">
    <div v-show="state.isShow">
      <div :class="$style['book-container-box']" ref="boxDOM">
        <img
          :src="
            state.currLang === 'en'
              ? CONSTANTS_HOME.BOOK
              : CONSTANTS_HOME.BOOK_ZH
          "
          :class="$style['book-container-box-img']"
          ref="imgDOM"
        />
      </div>
      <div ref="btnDOM">
        <fly-button :class="$style.btn" type="dark" @click="pushPage">
          <span>{{ $t("了解更多") }}</span>
        </fly-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  onMounted,
  defineProps,
  watch,
  ref,
  nextTick,
  reactive,
  computed,
} from "vue";
import CONSTANTS_HOME from "@constants/home";
import FlyButton from "@FlyUI/FlyButton.vue";
import utilsDOM from "@utils/dom";
import utilsTool from "@utils/tool";
import { useStore } from "vuex";

const store = useStore();

const TRANS_FORM = utilsDOM.prefixStyle("transform");

let imgDOM = ref();
let boxDOM = ref();
let btnDOM = ref();

const props = defineProps({
  percentage: {
    type: String,
    default: "",
  },
});
const state = reactive({
  isShow: false,
  currLang: computed(() => store.state.StoreApp.currLang),
});

watch(
  () => props.percentage,
  (n) => {
    if (n) {
      seAnimation(n);
    }
  }
);

onMounted(() => {
  nextTick(() => {
    seAnimation();
  });
});

const pushPage = () => {
  utilsTool.openNewWindow("https://kiko-verse.gitbook.io/");
};

const seAnimation = (percentage) => {
  if (!percentage) return;
  if (percentage > 0.3) {
    state.isShow = true;
    boxDOM.value.style.opacity = percentage;
    btnDOM.value.style.opacity = percentage;
    const r = Math.max(1, 2 - percentage);
    boxDOM.value.style[TRANS_FORM] = `scale(${r})`;
    imgDOM.value.style[TRANS_FORM] = `rotateX(${
      50 - Math.min(1, percentage) * 40
    }deg)`;
  }
};
</script>
<style lang="scss" module>
.book-container {
  height: 100vh;
  width: 100%;
  padding-top: 80px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .book-container-box {
    transform: scale(2.5);
    perspective: 800px;
    .book-container-box-img {
      transform: rotateX(50deg);
      display: inline-block;
    }
  }
  .btn {
    position: relative;
    left: 50%;
    top: -50px;
    transform: translate(-50%, 0%);
    span {
      color: #fff;
      font-weight: 500;
      font-size: 25px;
    }
  }
}
</style>
