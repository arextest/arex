<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="recordList"
      :pagination="false"
      :rowKey="(record) => record.planId"
      :loading="loading"
    >
      <template #bodyCell="{column,text,record}">
        <template v-if="column.dataIndex==='state'">
          <state-progress :index="record.status" :percent="record.percent" />
        </template>
        <template
          v-else-if="column.dataIndex === 'successCaseCount' || column.dataIndex === 'failCaseCount' ||
          column.dataIndex === 'waitCaseCount' || column.dataIndex === 'errorCaseCount'"
        >
          <div :class="text > 0 ? column.class : 'grey-text'" class="case-count">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex==='replayStartTime'">
          <span>{{text}}</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <a class="list-action-text" @click="onClickReport(record)">{{ $t("report") }}</a>
        </template>
        <template v-else-if="column.dataIndex === 'app'">
          <div class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
      </template>
    </a-table>
    <pagination v-show="recordList && recordList.length > 0" ref="paginationRef" @onChange="onSetCurrentPlans"/>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useRecordsList} from "@/modules/records";

  import Pagination from "@/components/pagination/Pagination.vue";
  import StateProgress from "@/components/progress/StateProgress.vue";

  export default defineComponent({
    name: "RegressionRecordsList",
    components: {
      Pagination,
      StateProgress
    },
    setup: useRecordsList,
  });
</script>

<style scoped>

</style>
