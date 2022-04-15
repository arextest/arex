<template>
  <div>
    <a-table
      class="case-list-table"
      :columns="columns"
      :data-source="items"
      :rowKey="(record) => items.key"
      :pagination="false"
      :loading="loading"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'diffResultCode'">
          <a-tag :class="text.class">{{ text.label }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="flex">
            <a class="table-detail-text">{{ $t("replayLog") }}</a>
            <a @click="goToDiffDetail(record)">{{ $t("detail") }}</a>
          </div>
        </template>
      </template>
    </a-table>
    <pagination v-show="items.length > 0" ref="paginationRef" @onChange="onSetItems"/>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {useCaseListTable} from "@/modules/analysis";

import Pagination from "@/components/pagination/Pagination.vue";

export default defineComponent({
  name: "CaseListTable",
  components: {Pagination},
  setup: useCaseListTable,
  props: {
    planItemId: {
      type: Number,
      default: false
    }
  }
})
</script>

<style scoped>

.case-list-table .table-detail-text {
  margin-right: 32px;
}

</style>
