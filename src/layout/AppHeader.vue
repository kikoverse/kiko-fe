<template>
  <div :class="$style['app-header']">
    <div :class="$style['app-header-logo']" @click="pushPage('/')">
      <img src="../assets/home/new-home/cat-bottom.png" alt="" />
      <span>KikoVerse</span>
    </div>
    <div :class="$style['app-header-menu']">
      <div
        v-for="(d, i) in state.menus"
        :key="i"
        @click="pushPage(d?.defaultPath || d.path)"
        :class="[
          $style['app-header-menu-item'],
          {
            [$style['active']]: isActivePath(d.path),
          },
        ]"
      >
        <div>{{ $t(`${d.label}`) }}</div>
      </div>
    </div>
    <div :class="$style['app-header-settings']">
      <connect-wallet> </connect-wallet>
      <fly-drop-down
        :menus="state.languages"
        @clickEvent="changeLang"
        :activeValue="state.currLang"
      >
        <template #placeholder>
          <fly-button type="dark" :class="$style['app-header-settings-lang']">
            {{ lang }}
          </fly-button>
        </template>
      </fly-drop-down>
      <div
        :class="$style['app-header-settings-setting']"
        @click="() => store.commit('StoreApp/CHANGE_SETTING_VISIBLE', true)"
      >
        <svg-icon name="f-setting"></svg-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import menus from "./menu.js";
import { useRouter, useRoute } from "vue-router";
import FlyButton from "@FlyUI/FlyButton.vue";
import session from "@utils/session";
import ConnectWallet from "@FlyUI/FlyConnectWallet.vue";
import FlyDropDown from "@FlyUI/FlyDropDown.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import i18n from "../i18n";

const store = useStore();
const router = useRouter();
const route = useRoute();

let state = reactive({
  languages: computed(() => store.state.StoreApp.languages),
  currLang: computed(() => store.state.StoreApp.currLang),
  menus,
  currentRoute: computed(() => route.meta.url),
});
const lang = computed(() => {
  return state.languages.filter((d) => d.value === state.currLang)[0].label;
});

const changeLang = (value) => {
  if (value !== state.currLang) {
    session.setItem("language", value);
    store.dispatch("StoreApp/changeLanguage", value);
    i18n.global.locale.value = value;
  }
};

const pushPage = (path) => {
  router.push({
    path,
  });
};

const isActivePath = (path) => {
  if (Array.isArray(path)) {
    console.log("state.currentRoute", state.currentRoute);
    if (path.indexOf(state.currentRoute) > -1) {
      return true;
    }
  }
  return path === state.currentRoute;
};
</script>
<style lang="scss" module>
.app-header {
  background: $black;
  height: 73px;
  width: 100%;
  color: $white;
  position: fixed;
  border-bottom: 1px solid rgba(51, 51, 51, 1);
  box-sizing: content-box;
  top: 0;
  line-height: 73px;
  display: flex;
  padding: 0px 20px;
  z-index: 2000;
  .app-header-logo {
    display: flex;
    cursor: pointer;
    align-items: center;
    img {
      width: 47px;
      height: 37px;
      margin-right: 20px;
    }
    span {
      font-size: 25px;
    }
  }
  .app-header-menu {
    display: flex;
    font-size: 16px;
    margin-left: 30px;
    .app-header-menu-item {
      padding: 0px 15px;
      cursor: pointer;
      :hover {
        color: $theme-light-color;
      }
      &.active {
        color: $theme-light-color;
      }
    }
  }
  .app-header-settings {
    position: fixed;
    right: 20px;
    display: flex;
    align-items: center;
    height: 70px;
    .app-header-settings-lang {
      margin-left: 25px;
      box-sizing: border-box;
      height: 35px;
      line-height: 35px;
      padding: 0 16px;
      width: 100px;
    }
    .app-header-settings-setting {
      margin-left: 15px;
      width: 40px;
      height: 35px;
      background-color: $theme_gray_color;
      border-radius: 8px;
      text-align: center;
      line-height: 35px;
      &:hover {
        opacity: 0.7;
        cursor: pointer;
      }
      ::v-deep(.el-dialog__header) {
        text-align: left !important;
      }
      ::v-deep(.setting) {
        p {
          text-align: left;
        }
      }
    }
  }
}
</style>
