<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="recordList"
      :pagination="false"
      :rowKey="(record) => record.planId"
      :loading="loading">
      <template #bodyCell="{column,text,record}">
        <template v-if="column.dataIndex === 'action'">
          <div class="flex">
            <a class="list-action-text" @click="onClickReport(record)">{{ $t("report") }}</a>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'app'">
          <div class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'successCaseCount' || column.dataIndex === 'failCaseCount' ||
                             column.dataIndex === 'waitCaseCount' || column.dataIndex === 'errorCaseCount'"
        >
          <div :class="text > 0 ? column.class : 'grey-text'" class="case-count">{{ text }}</div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {useDetailLastRecordsList} from "../../../modules/dashboard";

  export default {
    name: "DetailLastRecordsList",
    setup: useDetailLastRecordsList,
    props: {
      appId: {
        type: String,
        default: ""
      }
    }
  }
</script>

<style scoped>

</style>
