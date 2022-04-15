<template>
  <div class="report-detail">
    <a-card class="detail-card detail-card-gap">
      <div class="card-title">{{ $t('basicInfo') }}</div>
      <div class="card-content">
        <detail-rate-item class="content-rate-item" :label="$t('casePassRate')" :value="plan.casePassRate" />
        <detail-rate-item :label="$t('apiPassRate')" :value="plan.operationPassRate" />
      </div>
      <div class="content-basic-info">
        <description class="basic-info-description" :items="currentBasicItems" :column="column" />
        <transition
          enter-active-class="animate__animated animate__zoomIn"
          leave-active-class="animate__animated animate__zoomOut"
        >
          <template v-if="showMoreButton">
            <a class="basic-info-more" @click="onToggle">{{ $t( showAllInfo ? "fold" : "moreInfo") }}</a>
          </template>
        </transition>
      </div>
    </a-card>
    <a-card class="detail-card">
      <div class="card-title">{{ $t('replayPassRate') }}</div>
      <div class="card-content">
        <detail-replay-chart class="content-replay-chart" ref="detailReplayChartRef" />
        <description class="content-case-info" :items="caseItems" :column="1" />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useReportDetail} from "@/modules/report";

  import DetailRateItem from "@/view/report/detail/DetailRateItem.vue";
  import DetailReplayChart from "@/view/report/detail/DetailReplayChart.vue";
  import Description from "@/components/description/Description.vue";

  export default defineComponent({
    name: "ReportDetail",
    props: {
      plan: {
        type: Object,
        default: () => {}
      }
    },
    setup: useReportDetail,
    components: {
      DetailRateItem,
      DetailReplayChart,
      Description
    }
  });
</script>

<style scoped lang="less">
  .report-detail {
    display: flex;
    flex-wrap: wrap;
  }

  .report-detail .detail-card {
    flex: 1;
    border-radius: 3px;
    border: 1px solid var(--color-line);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12);
  }

  .report-detail .detail-card-gap {
    margin-right: 32px;
  }

  .report-detail :deep(.ant-card-body) {
    padding: 12px;
  }

  .report-detail .card-title {
    font-weight: 500;
    color: var(--color-title-text);
  }

  .report-detail .card-content {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .report-detail .content-rate-item {
    margin-right: 12px;
  }

  .report-detail .content-basic-info {
    display: flex;
    align-items: end;
    margin-top: 12px;
    background: #F7F7F7;
    border-radius: 3px;
    padding: 12px 12px 0 12px;
  }

  .report-detail .basic-info-more {
    margin: 0 3px 16px 0;
    text-decoration: underline;
  }

  .report-detail .content-replay-chart {
    flex: 2;
  }

  .report-detail .content-case-info, .basic-info-description {
    flex: 1;
  }

  .report-detail .content-case-info {
    margin-top: -12px;
    margin-bottom: -8px;
    height: 80%;
  }
</style>
