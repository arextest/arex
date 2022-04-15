<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="currentApps"
      :pagination="false"
      :rowKey="(record) => record.appId"
      :loading="loading"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'app'">
          <div class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'targetEnv'">
          <template v-for="env in text" :key="env">
            <a-tag class="grey-tag">{{ env }}</a-tag>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'accessCI'">
          <a-tag :class="text.class">{{ text.label }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <list-action :item="record" />
        </template>
      </template>
    </a-table>
    <pagination v-show="apps.length > 0" ref="paginationRef" @onChange="onSetCurrentApps" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useRegressionList} from "@/modules/regression";

import Pagination from "@/components/pagination/Pagination.vue";
import ListAction from "@/view/regression/list/ListAction.vue";

export default defineComponent({
  name: "RegressionList",
  setup: useRegressionList,
  components: {
    Pagination,
    ListAction,
  }
});
</script>

<style scoped lang="less">

</style>
