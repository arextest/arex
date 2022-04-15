<template>
  <div class="configuration-record">
    <a-tabs v-model:activeKey="activeKey" animated @change="onChange">
      <a-tab-pane :tab="$t('basicConfig')" key="1">
        <record-basic-config ref="recordBasicConfigRef" :form="form" />
      </a-tab-pane>
      <a-tab-pane :tab="$t('advancedConfig')" key="2">
        <record-advanced-config ref="recordAdvancedConfigRef" :form="form" @onSetDynamicClasses="onChange('2')" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useConfigurationRecord} from "@/modules/configuration";

  import RecordBasicConfig from "@/view/configuration/record/RecordBasicConfig.vue";
  import RecordAdvancedConfig from "@/view/configuration/record/RecordAdvancedConfig.vue";

  export default defineComponent({
    name: "ConfigurationRecord",
    components: {
      RecordBasicConfig,
      RecordAdvancedConfig
    },
    setup: useConfigurationRecord
  });
</script>

<style scoped lang="less">
  .configuration-record {
    margin-top: -12px;
  }

  .configuration-record :deep(.ant-tabs-top > .ant-tabs-nav::before) {
    border: none;
  }
</style>
