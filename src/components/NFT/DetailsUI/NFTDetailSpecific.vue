<template>
  <div class="rarevalue-total" v-if="!type">
    <div class="total-score">
      <span class="title">{{ $t("得分") }}</span
      ><br />
      <span class="value">{{ rarevalue_total_score }}</span>
    </div>
    <div class="total-ranking">
      <span class="title">{{ $t("得分排名") }}</span>
      <span>({{ props.box_detail?.seriesName }})</span>
      <br />
      <span class="value">
        <span class="origin">{{ props.box_detail?.rank }}</span
        >/{{ props.box_detail?.quantity }}</span
      >
    </div>
  </div>
  <div class="rarevalue-table">
    <template v-if="state.rarevalue_list && state.rarevalue_list.length > 0">
      <div
        class="rarevalue-table-item"
        v-for="(r, i) in state.rarevalue_list"
        :key="i"
      >
        <span class="rarevalue-project">{{ r.title }}</span>
        <span class="rarevalue-project-value">{{ r.value }}</span>
        <span class="rarevalue-project-score">{{ r.score }}</span>
      </div></template
    >
  </div>
</template>
<script setup>
/* eslint-disable */
import { computed, watchEffect, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import nftProto from "../nftproto";
const route = useRoute();
const type = route.query.type;
let rarevalue_list = ref([]);
let state = reactive({
  rarevalue_list: [],
});
const props = defineProps({
  box_detail: Object,
});

const setList = (protos) => {
  if (protos.properties && protos.properties.value.length) {
    rarevalue_list = protos.properties.value.filter((d) => d.value !== "--");
    state.rarevalue_list = rarevalue_list;
  }
};

watchEffect(() => {
  if (props.box_detail.seriesType == 1) {
    if (props.box_detail.attributes) {
      const data = props.box_detail.attributes.map((item) => {
        return {
          title:item.attribute,
          value:item.value,
          score: "--",
        };
      });
      state.rarevalue_list = data
    }
  } else {
    if (
      props.box_detail &&
      props.box_detail.nftType === "COMPOSITE_CARD" &&
      props.box_detail?.compositeElements?.length > 0
    ) {
      const list = props.box_detail.compositeElements.reduce((pre, curr) => {
        let t = curr.type.replace(/\s+/gi, "");
        t = t[0].toLowerCase() + t.slice(1);
        return Object.assign({}, pre, {
          [t]: curr.property,
          [t + "Score"]: curr.score,
        });
      }, {});
      const protos = nftProto({ properties: list });
      setList(protos);
    }
    if (
      props.box_detail &&
      props.box_detail.properties &&
      props.box_detail.nftType !== "COMPOSITE_CARD"
    ) {
      const protos = nftProto(props.box_detail);
      setList(protos);
    }
  }
});

// 稀有值分数
const rarevalue_total_score = computed(() => {
  return props.box_detail.score;
});
</script>
<style lang="scss" scoped>
.specific-rarevalue {
  .rarevalue-total {
    display: flex;
    margin-bottom: 16px;
    .total-score {
      margin-right: 20px;
      padding: 14px 20px;
      width: 250px;
      border-radius: 8px;
      background: rgba(250, 250, 250, 0.2);
    }
    .value {
      margin-top: 6px;
      font-size: 24px;
      font-weight: bold;
      .origin {
        color: rgba(251, 168, 0, 1);
      }
    }
    .total-ranking {
      padding: 14px 20px;
      width: 250px;
      border-radius: 8px;
      background: rgba(250, 250, 250, 0.2);
    }
  }
  .rarevalue-table {
    max-width: 700px;
    .rarevalue-table-item {
      height: 48px;
      line-height: 48px;
      box-shadow: 0px 0.5px 0px 0px #2e2e2e;
      display: flex;
      justify-content: space-between;
      span {
        display: inline-block;
        flex: 1;
      }
    }
  }
}
</style>
