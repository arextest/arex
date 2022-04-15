<template>
  <div class="header-action">
    <a class="header-action-fold" @click="onToggle">
      <span>{{ $t(showDetail ? 'fold' : 'unfold') }}</span>
      <span class="fold-icon">
        <up-outlined v-if="showDetail" />
        <down-outlined v-else />
      </span>
    </a>
    <a-button danger @click="onRerun">{{ $t('rerun') }}</a-button>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import { DownOutlined, UpOutlined } from "@/common/icon";
  import {useHeaderAction} from "@/modules/report";

  export default defineComponent({
    name: "HeaderAction",
    components: {
      DownOutlined,
      UpOutlined
    },
    props: {
      plan: {
        type: Object,
        default: () => ({})
      },
    },
    setup: useHeaderAction,
  });
</script>

<style scoped lang="less">
  .header-action .header-action-fold {
    margin-right: 32px;
  }

  .header-action .fold-icon {
    font-size: 12px;
    margin-left: 4px;
  }
</style>
