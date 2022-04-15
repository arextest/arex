<template>
  <div class="regression-header">
    <a-input-search
      class="header-search"
      v-model:value="searchText"
      :placeholder="$t('searchApp')"
      @search="onSearch"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts">
  import {useRegressionRecordsHeader} from "@/modules/records/detail/regression-records";

  export default {
    name: "RegressionRecordsHeader",
    setup: useRegressionRecordsHeader
  }
</script>

<style scoped lang="less">
  .regression-header .header-divider {
    height: 33px;
    margin: 0 32px;
  }

  .regression-header .header-search {
    width: 30%;
  }
</style>
