<template>
  <div id="detail-replay-chart"></div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useDetailReplayChart} from "@/modules/report";

export default defineComponent({
  name: "DetailReplayChart",
  setup: useDetailReplayChart
});
</script>

<style scoped lang="less">
  #detail-replay-chart {
    height: 174px;
    margin-top: -8px;
  }
</style>
