<template>
  <div class="analysis">
    <a-card>
      <analysis-header ref="analysisHeaderRef" :plan-item="planItem" />
      <div class="analysis-content">
        <analysis-menu class="analysis-content-menu" ref="analysisMenuRef" @onSelectOperation="onSelectOperation" />
        <analysis-detail class="analysis-content-detail" ref="analysisDetailRef" @onClickScenes="onSetScenes" />
      </div>
    </a-card>
    <a-card v-show="scenes.length > 0" class="analysis-diff" id="analysisDiffCard">
      <analysis-diff :planItem="planItem" :scenes="scenes" />
    </a-card>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useAnalysis} from "@/modules/analysis";

  import AnalysisHeader from "@/view/analysis/header/AnalysisHeader.vue";
  import AnalysisDiff from "@/view/analysis/diff/AnalysisDiff.vue";
  import AnalysisMenu from "@/view/analysis/menu/AnalysisMenu.vue";
  import AnalysisDetail from "@/view/analysis/detail/AnalysisDetail.vue";

  export default defineComponent({
    name: "Analysis",
    setup: useAnalysis,
    components: {
      AnalysisHeader,
      AnalysisMenu,
      AnalysisDetail,
      AnalysisDiff
    }
  });
</script>

<style scoped lang="less">
  .analysis .analysis-content {
    display: flex;
    flex-wrap: wrap;
    margin: 16px 0 8px;
  }

  .analysis .analysis-content-menu {
    flex: 1;
    min-width: 326px;
  }

  .analysis .analysis-content-detail {
    flex: 3;
    margin-left: 40px;
  }

  .analysis .analysis-diff {
    margin-top: 24px;
  }
</style>
