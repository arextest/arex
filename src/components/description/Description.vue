<template>
  <a-descriptions class="description" :column="column">
    <a-descriptions-item v-for="item in items" :key="item.key" :label="item.label">
      <div class="description-item" :class="{ collapsed }" :title="item.value" @click="onCollapse">
        {{ item.value }}
      </div>
    </a-descriptions-item>
  </a-descriptions>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "Description",
  props: {
    column: {
      type: [Object, Number],
      default: () => { return {}; }
    },
    items: {
      type: Object,
      default: () => { return {}; }
    },
  },
  setup: () => {
    const collapsed = ref(true);

    const onCollapse = () => collapsed.value = !collapsed.value;

    return {
      collapsed,

      onCollapse
    }
  }
});
</script>

<style scoped lang="less">
  .description :deep(.ant-descriptions-item-label) {
    color: var(--color-antd-text);
    font-weight: 500;
  }

  .description :deep(.ant-descriptions-item-content) {
    color: var(--color-antd-text);
  }

  .description .description-item {
    margin-right: 16px;
  }

  .description .collapsed {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
</style>
