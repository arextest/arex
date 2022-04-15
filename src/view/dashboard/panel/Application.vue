<template>
  <div class="application">
    <a-row class="app-select-row">
      <a-col span="12">
        <app-select-header @onChange="onSetApplication"/>
      </a-col>
    </a-row>
    <a-row class="detail-row">
      <a-col span="8" class="left-detail-card">
        <detail-basic-statistic :data="applicationBasicStatistic" :show-icon="false"/>
      </a-col>
      <a-col span="8" class="middle-detail-card">
        <detail-basic-statistic :data="operationSumBasicStatistic">
          <format-painter-outlined />
        </detail-basic-statistic>
      </a-col>
      <a-col span="8" class="right-detail-card">
        <detail-basic-statistic :data="replaySumStatistic">
          <rollback-outlined />
        </detail-basic-statistic>
      </a-col>
    </a-row>
    <a-row class="trend-chart-row">
      <a-col span="24">
        <a-card>
          <div class="chart-title">{{$t('lastCasePassRate')}}</div>
          <detail-pass-rate-trend-chart ref="detailPassRateTrendChartRef"/>
        </a-card>
      </a-col>
    </a-row>
    <a-row class="trend-chart-row">
      <a-col span="24">
        <a-card>
          <div class="chart-title">{{$t('last10Records')}}</div>
          <detail-last-records-list class="latest-records-table" :appId="currentAppId"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useApplication} from "@/modules/dashboard";
  import {RollbackOutlined, FormatPainterOutlined} from "@/common/icon";

  import DetailBasicStatistic from "@/view/dashboard/detail/DetailBasicStatistic.vue";
  import DetailPassRateTrendChart from "@/view/dashboard/detail/DetailPassRateTrendChart.vue";
  import DetailLastRecordsList from "@/view/dashboard/list/DetailLastRecordsList.vue";
  import AppSelectHeader from "@/view/dashboard/header/AppSelectHeader.vue";

  export default defineComponent({
    name: "Application",
    setup: useApplication,
    components: {
      AppSelectHeader,
      DetailBasicStatistic,
      DetailPassRateTrendChart,
      DetailLastRecordsList,
      RollbackOutlined,
      FormatPainterOutlined
    }
  });
</script>

<style scoped lang="less">
  .application :deep(.ant-card) {
    box-shadow: none;
  }

  .left-detail-card {
    padding-right: 12px;
  }

  .right-detail-card {
    padding-left: 12px;
  }

  .middle-detail-card {
    padding: 0 12px;
  }

  .content-app-proportion-chart {
    flex: 2;
  }

  .replay-title {
    color: #000000;
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    font-weight: 600;
    height: 22px;
    line-height: 22px;
    margin-right: 10px;
  }

  .detail-row {
    margin-bottom: 24px;
  }

  .app-select-row {
    margin-bottom: 16px;
  }

  .chart-title {
    color: var(--color-title-text);
    font-size: 16px;
    font-weight: 600;
    margin-top: -8px;
  }

  .trend-chart-row {
    margin-bottom: 24px;
  }

  .application .latest-records-table {
    margin-top: 16px;
  }
</style>
