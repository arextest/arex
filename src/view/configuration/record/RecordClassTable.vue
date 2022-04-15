<template>
  <div class="record-class-table">
    <a-table
      :columns="columns"
      :data-source="form.dynamicClasses"
      :pagination="false"
      size="middle"
      :rowKey="(record) => record.id"
    >
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.dataIndex !== 'action'">
          <a-input v-if="adding && index === 0" v-model:value="record[column.dataIndex]" size="small" />
          <div v-else class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
        <template v-else-if="adding && index === 0">
          <div class="table-actions">
            <a class="green-a table-save-action" @click="onSave"><save-outlined /></a>
            <a @click="onCancel"><close-outlined /></a>
          </div>
        </template>
        <template v-else>
          <a class="red-a" @click="onDelete(record.id)"><delete-outlined /></a>
        </template>
      </template>
    </a-table>
    <pagination ref="paginationRef" size="small">
      <template #prefix>
        <a-button size="small" :disabled="adding" @click="onAdd"><plus-outlined />{{ $t("add") }}</a-button>
      </template>
    </pagination>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useRecordClassTable} from "@/modules/configuration";
  import { PlusOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@/common/icon";

  import Pagination from "@/components/pagination/Pagination.vue";

  export default defineComponent({
    name: "RecordClassTable",
    components: {
      PlusOutlined,
      DeleteOutlined,
      SaveOutlined,
      CloseOutlined,
      Pagination,
    },
    props: {
      form: {
        type: Object,
        default: () => ({})
      }
    },
    setup: useRecordClassTable
  })
</script>

<style scoped lang="less">
  .record-class-table :deep(.ant-btn) {
    color: var(--color-high-text);
    border: 1px solid var(--color-high-text);
    &:hover {
     opacity: 0.8;
    }
  }

  .record-class-table .table-actions {
    display: flex;
    flex-wrap: nowrap;
  }

  .record-class-table .table-save-action {
    margin-right: 16px;
  }
</style>
