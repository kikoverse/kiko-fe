<template>
  <div v-if="state.goods_history_list && state.goods_history_list.length > 0">
    <fly-scroller
      :noMore="false"
      :loading="false"
      @loadMore="loadMore"
      height="200px"
    >
      <template #list>
        <div
          class="specific-history-item"
          v-for="(d, i) in state.goods_history_list"
          :key="i"
        >
          <span class="date">{{
            d.createTime && dayjs(d.createTime).format("YYYY-MM-DD hh:mm:ss")
          }}</span>
          <span class="user-address">{{ d.address }}</span>
          <span class="action">{{ d.status && $t(d.status) }}</span>
          <span>{{
            d.type === "NFTMintEvent" || d.type === "NFTOfflineEvent"
              ? d.desc && $t(d.desc)
              : d.desc && $t(d.desc) + d.str
          }}</span>
        </div>
      </template>
    </fly-scroller>
  </div>
</template>
<script setup>
import { onMounted, reactive, watch, ref } from "vue";
import utilsFormat from "@utils/format";
import dayjs from "dayjs";
import commonApi from "@api/common";
import FlyScroller from "@FlyUI/FlyScroller.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const state = reactive({
  history_list_params: {
    nextId: 0,
    pageSize: 20,
    hasNext: true,
  },
  goods_history_list: [],
});
const props = defineProps({
  box_detail: {
    default: () => {},
    type: Object,
  },
});

onMounted(() => {
  if (props.box_detail && props.box_detail.nftId && props.box_detail.id) {
    getBoxHistoryRecord({ nftId: props.box_detail.id }, true);
  }
});

watch(
  () => props.box_detail,
  () => {
    if (props.box_detail && props.box_detail.nftId && props.box_detail.id) {
      getBoxHistoryRecord({ nftId: props.box_detail.id }, true);
    }
  }
);

const formatStr = (type) => {
  type = type.indexOf("V2") !== -1 ? type.replace("V2", "") : type;
  const obj = {
    NFTMintEvent: {
      status: "铸造",
      desc: "",
    },
    NFTSellEvent: {
      status: "上架",
      desc: "售价",
    },
    NFTBidEvent: {
      status: "报价",
      desc: "出价",
    },
    NFTBuyEvent: {
      status: "获得",
      desc: "成交价",
    },
    NFTAcceptBidEvent: {
      status: "获得",
      desc: "成交价",
    },
    NFTOfflineEvent: {
      status: "下架",
      desc: "",
    },
    NFTChangePriceEvent: {
      status: "修改售价",
      desc: "售价",
    },
  };
  return obj[type];
};
const getBoxHistoryRecord = async ({ nftId, nextId = 0 }, flag) => {
  if (!nftId || !state.history_list_params.hasNext) return;
  state.history_list_params = Object.assign({}, state.history_list_params, {
    nextId,
    type: ref(route.query.type).value,
    id: nftId,
  });

  let res = await commonApi.getBoxHistoryRecord(state.history_list_params);
  if (res.code === 200) {
    let result = res.data.map((d) => {
      const { createTime, address, type, price, currencyName } = d;
      const obj = formatStr(type);
      let str = "";
      if (type !== "NFTMintEvent" && type !== "NFTOfflineEvent") {
        str = " " + utilsFormat.formatPrice(price) + " " + currencyName;
      }
      return {
        createTime,
        address: address ? address.slice(0, 6) + "..." + address.slice(-4) : "",
        status: obj && obj.status,
        desc: obj && obj.desc,
        str,
        type,
        id: d.id,
      };
    });
    state.history_list_params.hasNext = res.hasNext;
    if (result && result.length) {
      state.history_list_params.nextId = result[result.length - 1].id;
      if (flag) {
        state.goods_history_list = result;
      } else {
        return result;
      }
    }
    return [];
  }
};

const loadMore = async () => {
  const data = await getBoxHistoryRecord(
    {
      nextId: state.history_list_params.nextId,
      nftId: state.history_list_params.id,
    },
    false
  );
  if (data && data.length) {
    state.goods_history_list = state.goods_history_list.concat(data);
  }
};
</script>
<style lang="scss" scoped>
.specific-history-item {
  font-weight: 400;
  color: #fff;
  margin-bottom: 16px;
  display: flex;
  span {
    text-align: left;
  }
  span:nth-child(1) {
    width: 170px;
  }
  span:nth-child(2) {
    width: 130px;
  }
  span:nth-child(3) {
    width: 120px;
  }
  span:nth-child(4) {
    width: 200px;
  }
}
</style>
