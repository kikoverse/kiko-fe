<template>
  <!-- 物品详情操作部分 -->
  <div class="nft-goods-detail-action">
    <!-- 我的NFT 未出售 -->
    <div class="sell-blind" v-if="props.action_type === 'UNSOLD'">
      <!-- 盲盒未开启 -->
      <div
        class="buttons buttons-box-status button-style"
        v-if="!props.isNFT"
        style="margin-top: 10px"
      >
        <span class="cancel-bg-normal" @click="actionsCall('OpenBlinkBox')">
          {{ $t("打开盲盒") }}
        </span>
        <span class="sell-blind-box" @click="actionsCall('SellBlinkBox')">
          {{ $t("出售") }}
        </span>
      </div>
      <!-- 我的NFT nft-->
      <div class="buttons button-style" v-else>
        <div
          class="open-blind-box actions-button"
          @click="actionsCall('SellNFT')"
          style="margin-top: 10px"
        >
          {{ $t("出售") }}
        </div>
      </div>
    </div>
    <!-- 购买者视角 出售中 -->
    <div class="on-offer-blind" v-if="props.action_type === 'BUYERSELL'">
      <!-- 最高出价 && 售价 -->
      <nft-bid-info
        :box_detail="props.box_detail"
        :sellType="props.box_detail.sellType"
      ></nft-bid-info>
      <div class="buttons-box-status button-style" v-if="props.box_detail">
        <span
          class="purchase"
          v-if="props.box_detail.sellType === 1"
          @click="actionsCall('Purchase')"
        >
          {{
            formatPriceWithLength(
              props.box_detail.sellingPrice,
              props.box_detail.payTokenPrecision
            )
          }}
          {{ utilsFormat.getTokenCurrency(props.box_detail.payToken) }}
          {{ $t("购买") }}</span
        >
        <span
          class="bid"
          v-if="props.box_detail.sellType === 2"
          @click="actionsCall('BidPrice')"
          >{{ $t("出价") }}</span
        >
      </div>
    </div>
    <!-- 拥有者视角 出售中 -->
    <div class="on-offer-blind" v-if="props.action_type === 'OWNERSELL'">
      <nft-bid-info
        :box_detail="props.box_detail"
        :sellType="props.box_detail.sellType"
      ></nft-bid-info>
      <div
        class="buttons-box-status button-style"
        v-if="props.box_detail.onSell"
      >
        <span class="cancel-bg-normal" @click="actionsCall('CancelSell')">{{
          $t("取消出售")
        }}</span>
        <span
          v-if="props.box_detail.sellType === 2"
          :style="{
            cursor: props.box_detail.topBidPrice <= 0 ? 'default' : 'pointer',
          }"
          :class="
            props.box_detail.topBidPrice === 0
              ? 'accept-bid disabled-status'
              : 'accept-bid'
          "
          @click="
            () => {
              if (props.box_detail.topBidPrice > 0) {
                actionsCall('AcceptBid');
              }
            }
          "
          >{{ $t("接受报价") }}
        </span>
      </div>
      <div v-else>
        <div class="sold-out button-style">
          <span class="sold-out-action all-horizontal">{{ $t("售罄") }}</span>
        </div>
      </div>
    </div>
    <!-- 售罄 -->
    <div class="sold-out button-style" v-if="props.action_type === 'SOLDOUT'">
      <span class="sold-out-action all-horizontal">{{ $t("售罄") }}</span>
    </div>
    <!-- 回收状态 -->
    <div class="blind-recovery" v-if="props.action_type === 'RECOVERY'">
      <div class="recovery-price-count">
        <p class="recovery-price price-content-style">
          <span> {{ $t("回收价格") }}:</span>
          <span
            >{{ props.box_detail.buyPrice }}
            {{ props.box_detail.payToekn || "STC" }}</span
          >
        </p>
        <p class="holding-count price-content-style">
          <span>{{ $t("持有数量") }}:</span>
          <span> {{ props.box_detail.userHoldAmount }}</span>
        </p>
      </div>
      <div
        class="recovery-actions all-horizontal button-style"
        @click="
          () => {
            if (props.box_detail.userHoldAmount > 0) {
              actionsCall('Recovery');
            }
          }
        "
        :style="{
          cursor: props.box_detail.userHoldAmount === 0 ? 'default' : 'pointer',
        }"
        :class="{
          'disabled-status': props.box_detail.userHoldAmount === 0,
        }"
      >
        <span class="sell">{{ $t("出售") }}</span>
      </div>
    </div>
    <search-currency
      :dialogVisible="state.isShowSearchDialog"
      @handleClose="handleClose"
      @handleSelect="handleSelectCurrency"
    ></search-currency>
  </div>
</template>
<script setup>
/* eslint-disable */
import { reactive, computed, defineEmits, defineProps, onMounted } from "vue";
import FlyInput from "@FlyUI/FlyInput.vue";
import SvgIcon from "@components/SvgIcon/Index.vue";
import SearchCurrency from "@components/SearchCurrency";
import { useRoute } from "vue-router";
const route = useRoute();
import { useStore } from "vuex";
const store = useStore();
import utilsFormat from "@utils/format";
import NftBidInfo from "./DetailsUI/NFTBidInfo.vue";
let state = reactive({
  value: "",
  isShowSearchDialog: false, // 是否出现币种弹窗
  buy_back_price: "", // 平台回购单独取价格
  accounts: computed(() => store.state.StoreWallet.accounts),
});
const props = defineProps({
  box_detail: {}, // 详情信息
  action_type: String, // 操作类型  SELL 出售 OWNERSELL 本人出售 BUYERSELL 购买者 SOLDOUT售罄 RECOVERY回收
  isNFT: Boolean, // 盲盒是否开启
  isOwner: {
    type: Boolean,
  },
  isOnSell: {
    type: Boolean,
  },
});

console.log(props.action_type)
const formatPriceWithLength = (price, precision) => {
  const t = utilsFormat.formatPrice(price, precision, { grouped: false });
  if (t && t.length > 3) {
    return t.slice(0, 3) + "...";
  }
  return t;
};

// 输入框赋值
const inputEvent = (e) => {
  // state.value = e;
  props.box_detail.sellingPrice = e;
};
// 展示币种筛选
const showCurrencyListDialog = () => {
  state.isShowSearchDialog = true;
};
// 选择币种
const handleSelectCurrency = (item) => {
  const { shortName } = item;
  state.isShowSearchDialog = false;
};
// 关闭币种选择弹窗
const handleClose = () => {
  state.isShowSearchDialog = false;
};
// 所有操作跟父组件交互
const emits = defineEmits(["actionsCall", "getUpdateValue"]);
const actionsCall = (action) => {
  emits("actionsCall", { action: action });
};
const updatePrice = () => {
  state.isShowQuotationDialog = true;
};
const inputEventQuotation = (e) => {
  state.quotationMsg.priceValue = e;
};
const handleConfirm = () => {
  state.isShowQuotationDialog = false;
  emits("getUpdateValue", state.quotationMsg.priceValue);
};
const handleCloseQuotation = () => {
  state.isShowQuotationDialog = false;
};
</script>
<style lang="scss" scoped>
.edit-icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}
.nft-goods-detail-action {
  flex: 1;
  position: relative;
  margin-top: 15px;
}
.sell-blind {
  // border: 1px solid red;
  display: flex;
  flex-flow: column;
  height: 100%;
  justify-content: space-between;
  position: relative;
  // padding-top: 30px;
  .sell-blind-box {
    color: #a03300 !important;
  }
}
.trade-input {
  width: 100%;
  height: 60px;
  position: relative;
  border: 1px solid #ededed;
  background: #ffffff;
  border-radius: 4px;

  .trade-fly-input {
    height: 60px;
    line-height: 60px;
    position: absolute;
    left: 18px;
    top: 0;
    font-size: 24px;
    font-weight: 500px;
    ::v-deep(.el-input__inner) {
      border: none;
      color: #000;
    }
  }
  &:hover {
    border: 2px solid #ededed;
  }
  &:focus-within {
    border: 2px solid #000000;
  }
  .currency-select {
    height: 60px;
    line-height: 60px;
    position: absolute;
    right: 18px;
    top: 0;
    font-weight: 500;
    font-size: 20px;
    color: #000000;
    cursor: pointer;
  }
}
.actions-button {
  width: 100%;
  border-radius: 4px;
  height: 46px;
  line-height: 46px;
  text-align: center;
  font-weight: 600;
  color: #a03300;
  cursor: pointer;
  background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
  box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
}
.button-style {
  width: 100%;
}
.on-offer-blind {
  height: 100%;
  justify-content: space-between;
  position: relative;
}
.blind-offer-price {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #000000;
  .sell-price {
    // margin-bottom: 16px;
    text-align: left;
    span {
      display: block;
    }
    :first-child {
      font-size: 14px;
      color: #3f1c09;
    }
  }
  .lastest-price {
    text-align: left;
    span {
      display: block;
    }
    :first-child {
      font-size: 14px;
      color: #3f1c09;
    }
  }
}
.buttons-box-status {
  display: flex;
  justify-content: space-between;
  margin-top: 36px;
  :first-child {
    margin-right: 17px;
  }
  span {
    cursor: pointer;
    flex: 1;
    display: inline-block;
    height: 56px;
    line-height: 56px;
    text-align: center;
    border-radius: 8px;
    background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
    box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
    color: #a03300;
    font-size: 16px;
    font-weight: 600;
  }
}

.buttons-box-status {
  display: flex;
  justify-content: space-between;
  margin-top: 36px;
  :first-child {
    margin-right: 17px;
  }
  span {
    cursor: pointer;
    flex: 1;
    display: inline-block;
    height: 56px;
    line-height: 56px;
    text-align: center;
    border-radius: 8px;
    background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
    box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
    color: #a03300;
    font-size: 16px;
    font-weight: 600;
  }
}
.cancel-bg-normal {
  cursor: pointer;
  background: none !important;
  box-shadow: none !important;
  border: 1px solid #fba800;
  color: #fba800 !important;
}
.sold-out {
  flex: 1;
  // height: 100%;
  display: flex;
  align-items: flex-end;
}
.accept-bid {
  cursor: pointer;
}
.all-horizontal {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 46px;
  background: #d1d1d1;
  border-radius: 4px;
  text-align: center;
  line-height: 46px;
  color: #9e9e9e;
  font-weight: 500;
}
.disabled-status {
  background: #d1d1d1 !important;
  color: #9e9e9e !important;
  box-shadow: none !important;
}
.blind-recovery {
  height: 100%;
  justify-content: space-between;
  position: relative;
  .recovery-price-count {
    width: 505px;
    height: 43px;
    display: flex;
    text-align: left;
    font-weight: 500;
    justify-content: space-between;
    padding: 18px 0;
    background: #37322c;
    border-radius: 8px;
    padding-left: 16px;
    .recovery-price {
      font-size: 20px;
      color: #ffffff;
      flex: 1;
      span {
        display: block;
      }
      :first-child {
        font-size: 12px;
      }
    }
    .holding-count {
      font-size: 20px;
      flex: 1;
      color: #ffffff;
      span {
        display: block;
      }
      :first-child {
        font-size: 12px;
      }
    }
  }
  .recovery-actions {
    background: linear-gradient(256deg, #fdd300 0%, #fba800 100%);
    box-shadow: 0px 12px 15px 0px rgba(253, 168, 0, 0.39);
    color: #a03300;
    margin-top: 36px;
  }
  .price-content-style {
    text-align: left;
  }
}
</style>
