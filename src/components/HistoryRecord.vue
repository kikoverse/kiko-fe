<template>
  <div class="fly-history">
    <Fly-dialog
      :title="props.historyType === 'swap' ? $t('兑换记录') : $t('流动性记录')"
      :dialogVisible="state.visible"
      @handleClose="handleClose"
      :width="440"
    >
      <template #content>
        <div class="list trade-list" v-show="props.historyType === 'swap'">
          <ul>
            <li class="item" v-for="(item, i) in state.totalSwapList" :key="i">
              <div class="item-node info">
                <p>
                  <span class="token-number">{{
                    utilsNumber.formatNumberMeta(
                      utilsFormat.formatBalance(
                        Math.max(item.tokenInX, item.tokenInY),
                        9
                      ),
                      {
                        precision: 9,
                        trailingZero: false,
                        round: "floor",
                      }
                    ).text
                  }}</span>
                  <span class="token-currency">{{
                    item.tokenInX > 0 ? item.tokenCodeX : item.tokenCodeY
                  }}</span>
                </p>
                <svg-icon name="f-arrows" class="icon"></svg-icon>
                <p class="text-right">
                  <span class="token-number">{{
                    utilsNumber.formatNumberMeta(
                      utilsFormat.formatBalance(
                        Math.max(item.tokenOutX, item.tokenOutY),
                        9
                      ),
                      {
                        precision: 9,
                        trailingZero: false,
                        round: "floor",
                      }
                    ).text
                  }}</span>
                  <span class="token-currency">{{
                    item.tokenOutX > 0 ? item.tokenCodeX : item.tokenCodeY
                  }}</span>
                </p>
              </div>
              <div class="item-node date">
                {{ utilsDate.Format(item.swapTime, "yyyy-MM-dd hh:mm:ss") }}
              </div>
            </li>
          </ul>
          <ElEmpty
            v-if="state.totalSwapList.length === 0"
            :description="$t('暂无数据')"
          >
            <template v-slot:image>
              <svg-icon
                name="empty"
                style="width: 100%; height: 80px"
              ></svg-icon>
            </template>
          </ElEmpty>
        </div>
        <div
          class="list liquidity-list"
          v-show="props.historyType === 'liquidity'"
        >
          <ul>
            <li
              class="item"
              v-for="(item, i) in state.totalLiquidityList"
              :key="i"
            >
              <div class="item-node info">
                <p class="p-l">
                  <span
                    class="status-btn"
                    :class="item.direction === 1 ? 'add' : 'remove'"
                    >{{ item.direction === 1 ? $t("添加") : $t("移除") }}</span
                  >
                  <span class="amount">{{
                    utilsNumber.formatNumberMeta(
                      utilsFormat.formatBalance(item.amountX, 9),
                      {
                        precision: 9,
                        trailingZero: false,
                      }
                    ).text
                  }}</span>
                  <span class="m-l-0 m-token">{{ item.tokenCodeX }}</span>
                </p>
                <svg-icon name="f-cross" class="icon"></svg-icon>
                <p class="p-r">
                  <span class="m-r-0 m-token">{{ item.tokenCodeY }}</span>
                  <span class="amount">{{
                    utilsNumber.formatNumberMeta(
                      utilsFormat.formatBalance(item.amountY, 9),
                      {
                        precision: 9,
                        trailingZero: false,
                      }
                    ).text
                  }}</span>
                </p>
              </div>
              <div class="date end">
                {{
                  utilsDate.Format(item.liquidityTime, "yyyy-MM-dd hh:mm:ss")
                }}
              </div>
            </li>
          </ul>
          <ElEmpty
            v-if="state.totalLiquidityList.length === 0"
            :description="$t('暂无数据')"
          >
            <template v-slot:image>
              <svg-icon
                name="empty"
                class="icon"
                style="width: 100%; height: 80px"
              ></svg-icon>
            </template>
          </ElEmpty>
        </div>
      </template>
    </Fly-dialog>
  </div>
</template>

<script setup>
import FlyDialog from "@FlyUI/FlyDialog.vue";
import {
  reactive,
  defineProps,
  defineEmits,
  computed,
  onUpdated,
  watch,
} from "vue";
// import { ElEmpty } from "element-plus";
import SvgIcon from "@components/SvgIcon/Index.vue";
import { useStore } from "vuex";
import utilsDate from "@utils/date";
import utilsFormat from "@utils/format";
import utilsNumber from "@utils/number";
const store = useStore();
let state = reactive({
  visible: props.dialogVisible,

  accounts: computed(() => store.state.StoreWallet.accounts),
  totalSwapList: computed(() => store.state.StoreSwap.totalSwapList),
  totalLiquidityList: computed(
    () => store.state.StoreLiquidity.totalLiquidityList
  ),
  nextId: 0,
  ccSwap: 1,
  ccLiu: 1,
});

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
  historyType: {
    type: String,
    default: "",
  },
});

onUpdated(() => {
  if (props.historyType === "swap") {
    let el = document.getElementsByClassName("list")[0];
    if (el) {
      el.onscroll = () => {
        if (el.scrollHeight - el.scrollTop === el.clientHeight) {
          store.dispatch("StoreSwap/getExchangeHistoryList", {
            userAddress: state.accounts[0],
            pageSize: 6,
            nextId: state.totalSwapList[state.totalSwapList.length - 1].id,
          });
        }
      };
    }
  } else if (props.historyType === "liquidity") {
    let el = document.getElementsByClassName("list")[1];
    if (el) {
      el.onscroll = () => {
        if (el.scrollHeight - el.scrollTop === el.clientHeight) {
          store.dispatch("StoreLiquidity/getLiquidityHistoryList", {
            userAddress: state.accounts[0],
            pageSize: 6,
            nextId:
              state.liquidityHistory[state.totalLiquidityList.length - 1].id,
          });
        }
      };
    }
  }
});

watch(
  () => props.dialogVisible,
  (n) => {
    state.visible = n;
  }
);
const emits = defineEmits(["handleClose"]);

const handleClose = () => {
  emits("handleClose", false);
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.fly-history {
  ::v-deep(.el-dialog) {
    background-image: url("../../src/assets/common/bg.png");
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100%;
  }
  ::v-deep(.el-dialog__body) {
    padding: 15px 28px;
  }
  .list {
    height: 400px;
    overflow: auto;
    .item {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      list-style: none;
      margin-bottom: 25px;
      overflow: hidden;
      .item-node {
        overflow: hidden;
        display: flex;
      }
      .date {
        font-size: 14px;
        color: $text-gray2-color;
        line-height: 20px;
        float: left;
      }
    }
  }
  .trade-list {
    .item-node {
      justify-content: space-between;
    }
    .text-right {
      text-align: right;
    }
    p {
      width: 240px;
      float: left;
      .token-number {
        display: inline-block;
      }
    }
    .token-currency {
      max-width: 75px;
      white-space: nowrap;
      overflow: hidden;
      margin-right: 0;
    }
    svg {
      float: left;
      position: relative;
      top: 3px;
      cursor: default;
    }
    span {
      font-size: 16px;
      color: $text-gray2-color;
      line-height: 22px;
      margin-right: 10px;
    }
  }
  .liquidity-list {
    .item-node {
      width: 100%;
      display: block !important;
      font-size: 16px;
      font-weight: bold;
      .add {
        color: #26bb8f;
      }
      .remove {
        color: #f36346;
      }
      .icon {
        margin: 1px 10px;
      }
      p {
        float: left;
        overflow: hidden;
        color: $text-white-color;
        .amount {
          width: auto;
          max-width: 163px;
          white-space: nowrap;
          overflow: hidden;
          margin-right: 10px;
        }
        .m-token {
          width: auto;
          max-width: 76px;
          white-space: nowrap;
          overflow: hidden;
          float: left;
          margin-right: 0;
        }
      }
      .p-l {
        width: 52%;
        .status-btn {
          width: auto;
          max-width: 72px;
          margin-right: 10px;
        }
      }
      .p-r {
        width: 40%;
        float: right;
        color: $text-white-color;
        .amount {
          text-align: right;
          float: right;
        }
        .m-token {
          float: right;
        }
      }
    }

    span,
    .icon {
      margin-right: 10px;
      cursor: default;
      width: 10px;
      float: left;
    }
  }
}
</style>
