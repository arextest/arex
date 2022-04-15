<template>
  <div class="configuration-tag">
    <a-textarea v-model:value="configTemplate" :rows="24" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useConfigurationTemplate} from "@/modules/configuration";

  export default defineComponent({
    name: "ConfigurationTag",
    setup: useConfigurationTemplate
  });
</script>

<style scoped lang="less">
  .configuration-tag {
    margin-top: -8px;
  }

  .configuration-tag .configuration-tag-actions {
    text-align: right;
    margin-bottom: 16px;
  }

  .configuration-tag .tag-table-edit {
    margin-right: 24px;
  }
</style>
