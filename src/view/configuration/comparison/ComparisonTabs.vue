<template>
  <div class="comparison-tabs">
    <a-tabs v-model:activeKey="activeKey" animated @change="onChange">
      <a-tab-pane key="exclusionsRef" :tab="onFormatTabName('exclusionsRef')">
        <comparison-detail ref="exclusionsRef" :tab="tabMap.exclusionsRef" />
      </a-tab-pane>
      <a-tab-pane key="divider" disabled>
        <template #tab>
          <a-divider class="comparison-tabs-divider" type="vertical" />
        </template>
      </a-tab-pane>
      <a-tab-pane key="inclusionsRef" :tab="onFormatTabName('inclusionsRef')">
        <comparison-detail ref="inclusionsRef" :tab="tabMap.inclusionsRef" />
      </a-tab-pane>
      <a-tab-pane key="divider" disabled>
        <template #tab>
          <a-divider class="comparison-tabs-divider" type="vertical" />
        </template>
      </a-tab-pane>
      <a-tab-pane key="sortKeysRef" :tab="onFormatTabName('sortKeysRef')">
        <comparison-detail ref="sortKeysRef" :tab="tabMap.sortKeysRef" />
      </a-tab-pane>
      <a-tab-pane key="referencesRef" :tab="onFormatTabName('referencesRef')">
        <comparison-detail ref="referencesRef" :tab="tabMap.referencesRef" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useComparisonTabs} from "@/modules/configuration";

  import ComparisonDetail from "@/view/configuration/comparison/ComparisonDetail.vue";

  export default defineComponent({
    name: "ComparisonTabs",
    components: {
      ComparisonDetail,
    },
    props: {
      activeTabKey: {
        type: String,
        required: true
      },
      items: {
        type: Array,
        default: () => []
      }
    },
    setup: useComparisonTabs
  });
</script>

<style scoped lang="less">
  .comparison-tabs :deep(.ant-tabs-top > .ant-tabs-nav::before) {
    border: none;
  }

  .comparison-tabs :deep(.ant-tabs-tab) {
    margin-right: 16px;
  }

  .comparison-tabs .comparison-tabs-divider {
    height: 32px;
    margin-bottom: -8px;
    cursor: default;
  }
</style>
