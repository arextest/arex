<template>
  <a-card>
    <template #title>
      <regression-header @onSearch="onSearchApps" />
    </template>
    <configuration-list ref="configurationListRef" />
  </a-card>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';

  import RegressionHeader from "@/view/regression/header/RegressionHeader.vue";
  import ConfigurationList from "@/view/configuration/list/ConfigurationList.vue";
  import {useConfiguration} from "@/modules/configuration";

  export default defineComponent({
    name: "Configuration",
    components: {
      RegressionHeader,
      ConfigurationList
    },
    setup: useConfiguration
  });
</script>

<style scoped lang="less">

</style>
