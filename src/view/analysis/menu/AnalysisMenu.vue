<template>
  <div class="analysis-menu">
    <menu-setting
      ref="menuSettingRef"
      :has-selected="hasSelected"
      :has-selected-all="hasSelectedAll"
      @onChange="onSetFilteredOperations"
      @onSelectAll="(checked) => onSelectOperations(undefined, checked)"
    />
    <div class="analysis-menu-items">
      <template v-for="(operationItem, operationIndex) in currentOperations" :key="operationIndex">
        <menu-operation-item
          :operation="operationItem"
          :is-current-operation="currentOperationIndex === operationIndex"
          @click="onClickOperation(operationIndex)"
          @onSelect="() => onSelectOperations(operationItem)"
        />
      </template>
    </div>
    <pagination
      v-show="currentOperations.length > 0"
      ref="paginationRef"
      :show-size-changer="false"
      :show-total="false"
      @onChange="onSetCurrentOperations"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useAnalysisMenu} from "@/modules/analysis";

import MenuSetting from "@/view/analysis/menu/MenuSetting.vue";
import MenuOperationItem from "@/view/analysis/menu/MenuOperationItem.vue";
import Pagination from "@/components/pagination/Pagination.vue";

export default defineComponent({
  name: "AnalysisMenu",
  components: {
    MenuSetting,
    MenuOperationItem,
    Pagination
  },
  setup: useAnalysisMenu,
});
</script>

<style scoped lang="less">
  .analysis-menu .analysis-menu-items {
    margin-top: -4px;
  }
</style>
