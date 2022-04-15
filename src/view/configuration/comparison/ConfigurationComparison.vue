<template>
  <div class="configuration-comparison">
    <transition name="comparison" mode="out-in">
      <component
        :is="showMessage ? 'comparison-message' : 'comparison-tabs'"
        :ref="showMessage ? 'comparisonMessageRef' : 'comparisonTabsRef'"
        v-model:active-tab-key="activeTabKey"
        :items="items"
      />
    </transition>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useConfigurationComparison} from "@/modules/configuration";

  import ComparisonTabs from "@/view/configuration/comparison/ComparisonTabs.vue";
  import ComparisonMessage from "@/view/configuration/comparison/ComparisonMessage.vue";

  export default defineComponent({
    name: "ConfigurationComparison",
    components: {
      ComparisonTabs,
      ComparisonMessage,
    },
    setup: useConfigurationComparison
  });
</script>

<style scoped lang="less">
  .configuration-comparison .comparison-tabs {
    margin-top: -16px;
  }

  .configuration-comparison .comparison-enter-active {
    animation: flipInX .5s ease;
  }

  .configuration-comparison .comparison-leave-active {
    animation: flipOutX .5s ease;
  }
</style>
