<template>
  <div :class="$style['full-screen-container']">
    <div :class="$style['full-screen-container-content']">
      <div :class="$style['full-screen-container-content-mask']">
        <div :class="$style['full-screen-container-content-main']">
          <div :class="$style['full-screen-container-content-main-core']">
            <img src="../../assets/igo/logo-B.png" :class="$style['logo']" />
            <div :class="$style['full-screen-container-content-main-desc']">
              <p>{{ $t("kgstarter.content") }}</p>
              <!-- <p>{{ $t("kgstarter.footer") }}</p> -->
            </div>
          </div>
        </div>
        <screen-data></screen-data>
      </div>
    </div>
    <!-- 预加载防止闪烁，后续写个方法 -->
    <img src="../../assets/igo/kg-bg-1.jpeg" style="display: none" />
    <img src="../../assets/igo/kg-bg-2.jpeg" style="display: none" />
  </div>
</template>
<script setup>
import ScreenData from "./ScreenData.vue";
</script>
<style scoped></style>
<style lang="scss" module>
.full-screen-container {
  position: absolute;
  left: 0;
  top: 72px;
  padding-top: 29px;
  width: 100%;
  height: calc(100% - 72px);
  z-index: 1;
  background-image: url("../../assets/igo/kg-bg-3.png");
  background-repeat: no-repeat;
  background-size: cover;
  .full-screen-container-content {
    // min-height: 550px;
    height: calc(100% - 306px);
    width: 1200px;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .full-screen-container-content-mask {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .full-screen-container-content-main {
      background-image: url("../../assets/igo/kg-content-header.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 563px;
      margin: 0 auto;
      margin-top: 20px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      text-align: center;
      .full-screen-container-content-main-core {
        // border: 3px solid green;
        height: 93%;
        width: 100%;
        margin-bottom: 15px;
        // overflow: scroll;
        position: relative;
        .logo {
          width: 200px;
          margin-top: 10px;
        }
        .full-screen-container-content-main-desc {
          width: 700px !important;
          font-size: 15px;
          color: #fff;
          text-align: center;
          padding: 10px 28px;
          opacity: 0.8;
          width: 100%;
          margin: 0 auto;
          margin-bottom: 20px;
          box-sizing: border-box;
          p {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
