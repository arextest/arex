<template>
  <div class="system">
    <a-row>
      <a-col span="8" class="left-detail-card">
        <detail-basic-statistic :data="applicationSumBasicStatistic">
          <appstore-outlined />
        </detail-basic-statistic>
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
    <a-row class="date-select-row">
      <span class="replay-title">{{$t('replayData')}}</span>
      <date-select-header @onChange="onSetSystem"/>
    </a-row>
    <div class="app-chart-row">
      <a-card class="app-chart-card system-replay-left">
        <div class="chart-title">{{$t('appProportion')}}</div>
        <detail-app-proportion-chart class="content-app-proportion-chart" ref="detailAppProportionChartRef"/>
      </a-card>
      <a-card class="app-chart-card system-replay-right">
        <div class="chart-title">{{$t('appLastCasePassRate')}}</div>
        <detail-app-last-pass-rate-chart class="chart-card-table" ref="detailAppLastPassRateChartRef"/>
      </a-card>
    </div>
    <div class="trend-chart-row">
      <a-card>
        <div class="chart-title">{{$t('casePassRateAvg')}}</div>
        <detail-pass-rate-trend-chart ref="detailPassRateTrendChartRef"/>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useSystem} from "@/modules/dashboard";
  import {AppstoreOutlined, RollbackOutlined, FormatPainterOutlined} from "@/common/icon";

  import DetailBasicStatistic from "@/view/dashboard/detail/DetailBasicStatistic.vue";
  import DetailAppProportionChart from "@/view/dashboard/detail/DetailAppProportionChart.vue";
  import DetailAppLastPassRateChart from "@/view/dashboard/detail/DetailAppLastPassRateChart.vue";
  import DetailPassRateTrendChart from "@/view/dashboard/detail/DetailPassRateTrendChart.vue";
  import DateSelectHeader from "@/view/dashboard/header/DateSelectHeader.vue";

  export default defineComponent({
    name: "System",
    setup: useSystem,
    components: {
      DetailBasicStatistic,
      DetailAppProportionChart,
      DetailAppLastPassRateChart,
      DetailPassRateTrendChart,
      DateSelectHeader,
      AppstoreOutlined,
      RollbackOutlined,
      FormatPainterOutlined
    }
  });
</script>

<style scoped lang="less">
  .left-detail-card {
    padding-right: 12px;
  }

  .right-detail-card {
    padding-left: 12px;
  }

  .middle-Detail-Card {
    padding: 0 12px;
  }

  .content-app-proportion-chart {
    margin-top: 16px;
  }

  .replay-title {
    color: var(--color-antd-text);
    font-family: PingFangSC-Medium;
    font-size: 20px;
    font-weight: 600;
    margin-right: 10px;
    flex: 1;
  }

  .date-select-row {
    margin-top: 32px;
    display: flex;
    flex-wrap: nowrap;
  }

  .app-chart-row {
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 24px;
  }

  .app-chart-card {
    height: 390px;
  }

  .chart-title {
    color: var(--color-title-text);
    font-size: 16px;
    font-weight: 600;
    margin-top: -8px;
  }

  .trend-chart-row {
    margin-bottom: 20px;
  }

  .system-replay-left {
    margin-right: 24px;
    width: 33.3%;
  }

  .system-replay-right {
    flex: 1;
    width: 66.6%;
  }

  .system .chart-card-table {
    margin-top: 16px;
  }

  .system :deep(.ant-card) {
    box-shadow: none;
  }
</style>
