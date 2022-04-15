<template>
  <div class="report-list">
    <a-table
      :columns="columns"
      :data-source="currentPlanItems"
      :pagination="false"
      :rowKey="(record) => record.planItemId"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'serviceName' || column.dataIndex === 'operationName'">
          <div class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'state'">
          <state-progress :index="record.status" :percent="record.percent" />
        </template>
        <template v-else-if="column.dataIndex === 'successCaseCount' || column.dataIndex === 'failCaseCount' ||
                             column.dataIndex === 'waitCaseCount' || column.dataIndex === 'errorCaseCount'"
        >
          <div :class="text > 0 ? column.class : 'grey-text'" class="case-count">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <div class="flex">
            <a class="list-action-text" @click="onToAnalysis(record)">{{ $t("checkResult") }}</a>
            <a class="red-a" @click="onRerun(record)">{{ $t("rerun") }}</a>
          </div>
        </template>
      </template>
      <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <column-search
          :search="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          @onSearch="onSetFilteredPlanItems"
          @onReset="onSetFilteredPlanItems"
        />
      </template>
      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
    </a-table>
    <pagination v-show="currentPlanItems.length > 0" ref="paginationRef" @onChange="onSetCurrentPlanItems" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useReportList} from "@/modules/report";
  import { SearchOutlined } from "@/common/icon";

  import Pagination from "@/components/pagination/Pagination.vue";
  import StateProgress from "@/components/progress/StateProgress.vue";
  import ColumnSearch from "@/components/search/ColumnSearch.vue";

  export default defineComponent({
    name: "ReportList",
    components: {
      Pagination,
      StateProgress,
      ColumnSearch,
      SearchOutlined,
    },
    setup: useReportList
  });
</script>

<style scoped lang="less">
  .report-list .list-action {
    display: flex;
    flex-wrap: wrap
  }

  .report-list .list-action-text {
    margin-right: 32px;
  }

  .report-list .list-column-error {
    color: var(--color-error);
  }

  .report-list .list-column-warning {
    color: var(--color-warning);
  }
</style>
