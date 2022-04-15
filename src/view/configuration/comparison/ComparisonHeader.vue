<template>
  <div class="comparison-header">
    <a-radio-group class="comparison-header-radio" v-model:value="isApi">
      <a-radio-button :value="true">{{ $t("apiConfiguration") }}</a-radio-button>
      <a-radio-button :value="false">{{ $t("applicationConfiguration") }}</a-radio-button>
    </a-radio-group>
    <main-select class="comparison-header-select" :select="serviceSelect" />
    <main-select class="comparison-header-select" :select="operationSelect" />
    <a-button type="primary">{{ $t("query") }}</a-button>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useComparisonHeader} from "@/modules/configuration";

  import MainSelect from "@/components/select/MainSelect.vue";

  export default defineComponent({
    name: "ComparisonHeader",
    components: {
      MainSelect
    },
    setup: useComparisonHeader
  });
</script>

<style scoped lang="less">
  .comparison-header .comparison-header-radio {
    margin-right: 24px;
  }

  .comparison-header .comparison-header-select {
    min-width: 200px;
    width: 20%;
    margin-right: 8px;
  }
</style>
