<template>
  <div class="report-header">
    <header-app-search :plan="plan" />
    <state-progress class="header-state" :index="plan.status" :percent="plan.percent" />
    <header-history ref="headerHistoryRef" />
    <header-action class="header-action" :plan="plan" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useReportHeader} from "@/modules/report";
  import { Loading3QuartersOutlined } from "@/common/icon";

  import HeaderAppSearch from "@/view/report/header/HeaderAppSearch.vue";
  import HeaderHistory from "@/view/report/header/HeaderHistory.vue";
  import HeaderAction from "@/view/report/header/HeaderAction.vue";
  import StateProgress from "@/components/progress/StateProgress.vue";

  export default defineComponent({
    name: "ReportHeader",
    components: {
      HeaderAppSearch,
      HeaderHistory,
      HeaderAction,
      StateProgress,
      Loading3QuartersOutlined
    },
    props: {
      plan: {
        type: Object,
        default: () => ({})
      },
    },
    setup: useReportHeader,
  });
</script>

<style scoped lang="less">
  .report-header {
    display: flex;
    align-items: center;
  }

  .report-header .header-state {
    margin-right: 32px;
  }

  .report-header .header-state-icon {
    color: #FF7300;
    font-size: 16px;
    margin-right: 4px;
  }

  .report-header .header-state-percent {
    vertical-align: 1px;
  }

  .report-header .header-action {
    flex: 1;
    text-align: right;
  }
</style>
