<template>
  <div class="flex">
    <template v-for="(action, index) in actions" :key="action">
      <a class="actions-item" @click="onClickAction(action)">{{ $t(action) }}</a>
      <a-divider v-if="index === 0" class="actions-divider" type="vertical" />
    </template>
    <configuration-modal ref="configurationModalRef" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useListConfigurationActions} from "@/modules/configuration";

  import ConfigurationModal from "@/view/configuration/modal/ConfigurationModal.vue";

  export default defineComponent({
    name: "ListActions",
    components: {
      ConfigurationModal
    },
    props: {
      app: {
        type: Object,
        default: () => { return {}; }
      }
    },
    setup: useListConfigurationActions
  });
</script>

<style scoped lang="less">
  .actions-item {
    margin-right: 24px;
  }

  .actions-divider {
    margin: 2px 24px 0 -4px;
    height: 24px;
  }
</style>
