<template>
  <div :class="$style['content-container']">
    <div :class="$style['content-container-main']">
      <div
        v-for="(d, i) in state.main"
        :key="i"
        class="wow animate__animated animate__slideInUp"
        :class="$style['content-container-main-item']"
        @click="pushPage(d.isOuterLink, d.url)"
      >
        <img :src="d.img" />
        <p :class="$style['content-container-main-item-title']">
          {{
            d.isOpen
              ? $t(d.title)
              : $t(d.title) + ` (${i !== 5 ? $t("即将上线") : $t("建设中")})`
          }}
        </p>
        <p :class="$style['content-container-main-item-desc']">
          {{ renderDesc(i) }}
        </p>
      </div>
    </div>
    <div :class="$style['content-container-map-title']">
      <img
        src="../../assets/home/roadmap.png"
        class="wow animate__animated animate__slideInUp"
      />
    </div>
    <div
      :class="$style['content-container-map']"
      class="wow animate__animated animate__slideInUp"
    >
      <img
        src="../../assets/home/map.png"
        :class="$style['content-container-map-bg']"
        data-wow-delay="0.15s"
      />
      <img
        src="../../assets/home/stage1.png"
        :class="$style['content-container-map-phase1']"
        class="wow animate__animated animate__slideInUp"
        data-wow-delay="0.15s"
      />
      <img
        src="../../assets/home/stage2.png"
        :class="$style['content-container-map-phase2']"
        class="wow animate__animated animate__slideInUp"
        data-wow-delay="0.2s"
      />
      <img
        src="../../assets/home/stage3.png"
        :class="$style['content-container-map-phase3']"
        class="wow animate__animated animate__slideInUp"
        data-wow-delay="0.15s"
      />
      <img
        src="../../assets/home/stage4.png"
        :class="$style['content-container-map-phase4']"
        class="wow animate__animated animate__slideInUp"
        data-wow-delay="0.1s"
      />
    </div>

    <div
      :class="$style['content-container-datas']"
      v-if="state.dataSource && state.dataSource.length > 0"
    >
      <div
        v-for="(d, i) in state.dataSource"
        :key="i"
        :class="$style['content-container-datas-item']"
        class="wow animate__animated animate__slideInUp"
      >
        <fly-amount
          :value="d.value"
          :displayPreFix="i !== 2 ? '$' : ''"
          :formatOptions="{
            precision: 2,
            compact: true,
            grouped: true,
            trailingZero: false,
          }"
        ></fly-amount>
        <p>{{ $t(d.desc) }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { WOW } from "wowjs";
import utilsRouter from "@utils/router";
import utilsTool from "@utils/tool";
import FlyAmount from "@FlyUI/FlyAmount";
import commonApi from "@api/common";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
onMounted(async () => {
  let wow = new WOW({
    live: false,
    class: "content-container-main-item",
  });
  wow.init();

  const res = await commonApi.getVolumeData();
  if (res.code === 200) {
    let data = Object.entries(res.data);
    data = data.map((d, i) => {
      return {
        value: d[1],
        desc:
          i === 0 ? "总锁仓量" : i === 1 ? "总交易量" : i === 2 ? "用户数" : "",
      };
    });
    state.dataSource = data;
  }
});

const pushPage = (flag, url) => {
  if (!url) return;
  if (flag) {
    utilsTool.openNewWindow(url);
  } else {
    utilsRouter.push({
      path: url,
    });
  }
};

const renderDesc = (i) => {
  const keys = [
    "swap-desc",
    "liquidity-desc",
    "nft-market-desc",
    "farm-desc",
    "play-to-earn-desc",
    "add-more-desc",
  ];
  return t(keys[i]);
};
let state = reactive({
  main: [
    {
      title: "兑换",
      img: require("../../assets/home/Swap.png"),
      url: "/swap",
      isOuterLink: false,
      isOpen: true,
    },
    {
      title: "流动性",
      img: require("../../assets/home/Liquidity.png"),
      url: "/liquidity",
      isOuterLink: false,
      isOpen: true,
    },
    {
      title: "NFT市场",
      img: require("../../assets/home/NFTMarket.png"),
      url: "/nftblindbox",
      isOuterLink: false,
      isOpen: true,
    },
    {
      title: "农场",
      img: require("../../assets/home/Farm.png"),
      isOuterLink: false,
      isOpen: false,
    },
    {
      title: "玩赚",
      isOuterLink: false,
      isOpen: false,
      img: require("../../assets/home/Play-to-Earn.png"),
    },
    {
      url: "https://kiko-verse.gitbook.io/kiko-verse/products/and-more",
      isOuterLink: true,
      isOpen: false,
      title: "更多",
      img: require("../../assets/home/andmore.png"),
    },
  ],
  dataSource: [],
});
</script>
<style lang="scss" module>
.content-container {
  position: relative;
  width: 80%;
  margin-left: 10%;
  padding-top: 20px;
  .content-container-title {
    font-weight: 600px;
    text-align: center;
    color: $text-brown-color;
    font-weight: bold;
  }
  .content-container-main {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    margin: 0 auto;
    justify-content: space-around;
    .content-container-main-item {
      &:not(:nth-child(3n + 1)) {
        margin-left: 1%;
      }
      margin-top: 30px;
      width: 25%;
      &:hover {
        opacity: 0.7;
      }
      img {
        width: 100%;
        cursor: pointer;
      }
      p {
        color: $text-brown-color;
        text-align: left;
      }
      .content-container-main-item-title {
        font-weight: bolder;
        font-size: 18px;
        margin-top: 10px;
      }
      .content-container-main-item-desc {
        margin: 5px 0px 10px;
        font-size: 14px;
        color: #6d4f33;
      }
    }
  }
  .content-container-map-title {
    text-align: center;
    display: inline-block;
    margin-top: 120px;
    margin-bottom: 20px;
    width: 100%;
    img {
      width: 30%;
    }
    // width: 80%;
    // transform: scale(0.5);
  }
  .content-container-map {
    width: 100%;
    overflow: hidden;
    margin-top: 40px;
    padding-bottom: 120px;
    position: relative;
    text-align: center;
    img {
      user-select: none;
    }
    .content-container-map-bg {
      width: 100%;
    }

    .content-container-map-phase1 {
      position: absolute;
      top: 10%;
      left: 0px;
      width: 20%;
    }
    .content-container-map-phase2 {
      position: absolute;
      top: 20%;
      left: 25%;
      width: 20%;
    }
    .content-container-map-phase3 {
      position: absolute;
      top: 15%;
      left: 55%;
      width: 20%;
    }
    .content-container-map-phase4 {
      position: absolute;
      top: 40%;
      right: 5%;
      width: 20%;
    }
  }
  .content-container-datas {
    display: flex;
    justify-content: space-around;
    padding-bottom: 120px;
    .content-container-datas-item {
      padding: 50px 10px 100px;
      font-size: 50px;
      text-align: center;
    }
    p {
      font-size: 20px;
    }
    span {
      font-weight: 600;
    }
    p,
    span {
      font-weight: 600;
      font-family: Arial;
      color: $text-brown-color !important;
    }
  }
}
</style>
