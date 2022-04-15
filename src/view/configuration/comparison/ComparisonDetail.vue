<template>
  <div class="comparison-detail">
    <a-table
      :columns="column[tab.columnsName]"
      :data-source="currentNodes"
      :pagination="false"
      size="middle"
      :rowKey="(record) => record.id"
      :loading="loading"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <a-popconfirm
            :title="$t('areYouSureToDelete')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            @confirm="onDelete(record)"
          >
            <a class="red-a">{{ $t("delete") }}</a>
          </a-popconfirm>
        </template>
        <template v-else-if="column.dataIndex === 'pathName'">
          <div class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'pathValue'">
          <div>
            <a-tag v-for="value in text" :key="value" class="comparison-detail-tag">{{ value }}</a-tag>
          </div>
        </template>
      </template>
    </a-table>
    <pagination ref="paginationRef" @onChange="onSetCurrentNodes">
      <template #prefix>
        <div class="comparison-detail-actions">
          <a-button class="message-action" size="small" @click="onClickSelectFromMessage">
            <plus-outlined />{{ $t("selectFromMessage") }}
          </a-button>
          <popover
            v-if="tab.type"
            placement="bottomLeft"
            :title="$t('newIgnoredContent') + '-' + tab.label"
            :width="480"
            @onConfirm="onAddManually"
          >
            <template #center>
              <a-textarea v-model:value.trim="path" />
            </template>
            <a-button size="small"><plus-outlined />{{ $t("addManually") }}</a-button>
          </popover>
        </div>
      </template>
    </pagination>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useComparisonDetail} from "@/modules/configuration";
  import { CalendarOutlined, PlusOutlined } from "@/common/icon";

  import Popover from "@/components/popover/Popover.vue";
  import Pagination from "@/components/pagination/Pagination.vue";

  export default defineComponent({
    name: "ComparisonTable",
    components: {
      Popover,
      Pagination,
      PlusOutlined,
      CalendarOutlined
    },
    props: {
      tab: {
        type: Object,
        default: () => ({})
      },
    },
    setup: useComparisonDetail
  });
</script>

<style scoped lang="less">
  .table-action-content {
    margin: -8px -16px -16px -8px;
  }

  .table-action-content .content-radio-item {
    margin-bottom: 8px;
    font-size: 16px;
  }

  .comparison-detail-actions {
    margin-top: 4px;
  }

  .comparison-detail-actions :deep(.ant-btn) {
    color: var(--color-high-text);
    border: 1px solid var(--color-high-text);
    &:hover {
      opacity: 0.8;
    }
  }

  .comparison-detail-actions .message-action {
    margin-right: 16px;
  }

  .comparison-detail .comparison-detail-tag {
    color: var(--color-antd-text);
  }
</style>
