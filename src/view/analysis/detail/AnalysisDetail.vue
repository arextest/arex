<template>
  <div class="analysis-detail">
    <a-table
        class="analysis-detail-table"
        :columns="columns"
        :data-source="differences"
        :rowKey="(record) => record.differenceName"
        :pagination="showPagination"
        :row-selection="{ selectedRowKeys: selectedDifferenceNames, onChange: onSelectChange }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <div class="flex">
            <a class="table-detail-text" @click="onClickScenes(record.differenceName)">{{ $t("scenes") }}</a>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useAnalysisDetail} from "@/modules/analysis";
import {PlusOutlined} from "@/common/icon";

export default defineComponent({
  name: "AnalysisDetail",
  setup: useAnalysisDetail,
  components: {
    PlusOutlined
  }
});
</script>

<style scoped lang="less">
.analysis .analysis-detail-title {
  margin-top: 16px;
}

.analysis .detail-title-plus {
  flex: 1;
  margin-left: 10px;
}

.analysis .analysis-detail-table {
  margin-top: 16px;
}

.analysis .table-detail-text {
  margin-right: 32px;
}
</style>
