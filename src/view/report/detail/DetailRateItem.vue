<template>
  <div class="detail-rate-item">
    <div class="item-value">{{ value }}</div>
    <div class="item-label">{{ label }}</div>
    <div class="circle"></div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";

  export default defineComponent({
    name: "DetailRateItem",
    props: {
      label: {
        type: String,
        default: ""
      },
      value: {
        type: String,
        default: "0%"
      }
    },
  });
</script>

<style scoped lang="less">
  .detail-rate-item {
    position: relative;
    flex: 1;
    background: #EAF2F9;
    padding: 12px;
    border-radius: 2px;
    color: var(--color-title-text);
    display: block;
    overflow: hidden;
  }

  .detail-rate-item .item-value {
    font-size: 22px;
    font-weight: 600;
    line-height: 24px;
  }

  .detail-rate-item .circle {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 40px;
    height: 40px;
    background: #A4CCEF;
    -moz-border-radius: 47px;
    -webkit-border-radius: 47px;
    border-radius: 50%;
  }
</style>
