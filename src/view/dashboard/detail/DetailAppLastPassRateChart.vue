<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :scroll="{ y:240 }"
      :pagination="false"
      size="small"
      bordered
    >
<!--      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell :index="0">{{summary}}</a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>-->
      <template #bodyCell="{ column, text,record }">
        <template v-if="column.dataIndex === 'passRate'">
          <a-row>
            <a-col span="3">{{text}}%</a-col>
            <a-col span="21">
              <div>
                <a-progress :percent="text" :show-info="false" strokeColor="#0086F6"/>
              </div>
            </a-col>
          </a-row>
        </template>
        <template v-else-if="column.dataIndex === 'app'">
          <div class="ellipsis-text" :title="text">{{ text }}</div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script>
  import {defineComponent} from 'vue';
  import {useDetailAppLastPassRateChart} from "@/modules/dashboard";

  export default defineComponent({
    name: "DetailAppLastPassRateChart",
    setup: useDetailAppLastPassRateChart
  });
</script>

<style scoped>
</style>
