<template>
  <div id="detail-pass-rate-trend-chart">
  </div>
</template>

<script>
  import {useDetailPassRateTrendChart} from "@/modules/dashboard";

  export default {
    name: "DetailPassRateTrendChart",
    setup: useDetailPassRateTrendChart,
  }
</script>

<style scoped>
  #detail-pass-rate-trend-chart {
    height: 300px;
  }
</style>
