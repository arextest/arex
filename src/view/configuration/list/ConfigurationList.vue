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
        <template v-else-if="column.dataIndex === 'replayable' || column.dataIndex === 'recordable'">
          <a-switch v-model:checked="record[column.dataIndex]" />
        </template>
        <template v-else-if="column.dataIndex === 'accessCI'">
          <a-tag :class="text.class">{{ text.label }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'configurationItems'">
          <list-configuration-actions :app="record" />
        </template>
      </template>
    </a-table>
    <pagination v-show="apps.length > 0" ref="paginationRef" @onChange="onSetCurrentApps" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useConfigurationList} from "@/modules/configuration";

  import ListConfigurationActions from "@/view/configuration/list/ListConfigurationActions.vue";
  import Pagination from "@/components/pagination/Pagination.vue";

  export default defineComponent({
    name: "ConfigurationList",
    components: {
      ListConfigurationActions,
      Pagination
    },
    setup: useConfigurationList
  });
</script>

<style scoped lang="less">

</style>
