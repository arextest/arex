<template>
  <a-select
    class="header-history"
    :value="$t('historyReports')"
    :dropdownMatchSelectWidth="false"
  >
    <template #dropdownRender>
      <div class="header-history-content">
        <a-table
          class="content-table"
          :columns="columns"
          :data-source="plans"
          size="small"
          :pagination="false"
          :rowKey="(record) => record.id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'action'">
              <a @click="onClickCheck(record.appId, record.planId)">{{ $t('check') }}</a>
            </template>
          </template>
        </a-table>
      </div>
    </template>
  </a-select>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import { CloseOutlined } from "@/common/icon";
  import {useHeaderHistory} from "@/modules/report";

  import Pagination from "@/components/pagination/Pagination.vue";

  export default defineComponent({
    name: "HeaderHistoryRecord",
    props: {
      plan: {
        type: Object,
        default: () => { return {}; }
      }
    },
    setup: useHeaderHistory,
    components: {
      CloseOutlined,
      Pagination
    }
  });
</script>

<style scoped lang="less">
  .header-history {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .header-history-content {
    width: 460px;
    margin: 16px 24px;
  }
</style>
