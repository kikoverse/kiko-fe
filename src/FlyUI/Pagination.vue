<!-- pagination -->
<template>
  <!-- :class="$style['white-list-tool']" -->
  <!-- eslint-disable vue/no-deprecated-dollar-listeners-api -->
  <div class="white-list-tool">
    <ElPagination
      background
      hide-on-single-page
      :page-size="10"
      layout="prev, pager, next"
      :prev-text="$t('上一页')"
      :next-text="$t('下一页')"
      v-bind="$attrs"
    ></ElPagination>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.white-list-tool {
  ::v-deep(.el-pagination) {
    background-color: rgba(255, 255, 255, 0.15);
    padding: 6px;
    .btn-prev {
      width: 48px;
      background: none;
      color: rgba(255, 255, 255, 0.15);
      // color: #fff;
      &:not(:disabled):hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
    .btn-prev:disabled {
      background: none;
    }
    .btn-next {
      width: 48px;
      background: none;
      color: rgba(255, 255, 255, 0.15);
      // color: #fff;
      &:not(:disabled):hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
    .btn-next:disabled {
      background: none;
      // color: rgba(255, 255, 255, 0.5);
    }
    .el-pager li {
      background: none;
      color: rgba(255, 255, 255, 0.5);

      &:not(.disabled) {
        &.active {
          background: none;
          color: #fff;
        }
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        &.active:hover {
          color: #fff;
        }
      }
      &.active {
        color: #fff;
        cursor: default;
      }
    }

    .btn-next .el-icon-arrow-right {
      margin: 0 auto;
    }
    .btn-prev .el-icon-arrow-left {
      margin: 0 auto;
    }
  }
}
</style>
