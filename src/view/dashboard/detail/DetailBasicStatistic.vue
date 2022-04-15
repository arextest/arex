<template>
  <div class="detail-basic-statistic">
    <a-card class="item-body">
      <div class="item-body-title">
        <div class="item-icon" v-if="showIcon"><slot /></div>
        <div>
          <div class="item-title">{{data.title}}</div>
          <div class="item-description ellipsis-text" :title="data.description"> {{data.description}}</div>
        </div>
      </div>
      <div class="item-count" v-if="showCount">{{data.count}}</div>
    </a-card>
  </div>

</template>

<script lang="ts">
  import {defineComponent} from "vue";

  export default defineComponent({
    name: "DetailBasicStatistic",
    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      showCount: {
        type: Boolean,
        default: true
      }
    }
  })
</script>

<style scoped lang="less">
  .detail-basic-statistic :deep(.ant-card) {
    box-shadow: none
  }

  .item-body {
    background: #ffffff;
    border-radius: 4px 4px 4px 4px;
    min-height: 106px;
  }

  .item-body .item-body-title {
    display: flex;
    flex-wrap: nowrap;
  }

  .item-count {
    color: var(--color-title-text);
    font-size: 24px;
    font-weight: normal;
    height: 18px;
    line-height: 18px;
    text-align: right;
  }

  .item-description {
    color: #9C9C9C;
    font-size: 14px;
    font-weight: normal;
    min-height: 22px;
    line-height: 22px;
  }

  .item-title {
    color: var(--color-title-text);
    font-size: 16px;
    font-weight: 600;
    height: 22px;
    line-height: 22px;
  }

  .item-icon {
    background: #eaf2f9;
    border-radius: 4px 4px 4px 4px;
    height: 41px;
    width: 42px;
    line-height: 38px;
    font-size: 20px;
    text-align: center;
    margin-right: 10px;
    color: var(--color-low-text);
  }
</style>
