<template>
  <div id="detail-app-proportion-chart">
  </div>
</template>

<script>
  import {useDetailAppProportionChart} from "@/modules/dashboard";

  export default {
    name: "DetailAppProportionChart",
    setup: useDetailAppProportionChart
  }
</script>

<style scoped lang="less">
  #detail-app-proportion-chart {
    height: 300px;
  }
</style>
