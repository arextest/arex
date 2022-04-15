<template>
  <div class="menu-operation-item flex" :class="{'menu-operation-item-selected': isCurrentOperation}">
    <a-checkbox v-model:checked="operation.isSelected" @click.stop="onSelect" />
    <div class="operation-item-content" :title="operation.operationName">
      <div class="item-content-name ellipsis-text">{{ operation.operationName }}</div>
      <div class="flex item-content-info">
        <span>{{ operation.typeLabel }}</span>
        <span style="flex: 1; text-align: right">
          {{ $t("failureRate") }}&nbsp;&nbsp;{{ operation.failureRate }}%&nbsp;
          ({{ operation.failCaseCount }}/{{ operation.totalCaseCount }})
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useMenuOperationItem} from "@/modules/analysis";

export default defineComponent({
  name: "MenuOperationItem",
  props: {
    operation: {
      type: Object,
      default: {}
    },
    isCurrentOperation: {
      type: Boolean,
      default: false
    }
  },
  setup: useMenuOperationItem,
});
</script>

<style scoped lang="less">
  .menu-operation-item {
    background: var(--color-option-background);
    height: 71px;
    margin-top: 16px;
    border-radius: 3px;
    padding: 0 16px 0 8px;
    cursor: pointer;
  }

  .menu-operation-item-selected {
    background: var(--color-selected-background);
    border: 1px solid var(--color-high-text);
  }

  .menu-operation-item .operation-item-content {
    flex: 1;
    margin-left: 16px;
  }

  .menu-operation-item .item-content-name {
    font-weight: 600;
    color: var(--color-title-text);
  }

  .menu-operation-item .item-content-info {
    margin-top: 10px;
    font-size: 12px;
  }
</style>
