<template>
  <div class="analysis-header flex">
    <div class="page-title analysis-header-api-name">
      {{ $t("serviceMainApi") }} :&nbsp;&nbsp;{{ planItem.operationName }}
    </div>
    <component is="state-progress" class="analysis-header-state" :index="planItem.status" :percent="planItem.percent"/>
    <header-more-info ref="headerMoreInfoRef"/>
    <div class="analysis-header-action">
      <a-button @click="onShowAllCases">{{ $t("case") }}</a-button>
    </div>
    <analysis-modal ref="allCasesModalRef" :planItemId="planItem.planItemId"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useAnalysisHeader} from "@/modules/analysis";

import StateProgress from "@/components/progress/StateProgress.vue";
import HeaderMoreInfo from "@/view/analysis/header/HeaderMoreInfo.vue";
import AnalysisModal from "@/view/analysis/modal/AnalysisModal.vue";

export default defineComponent({
  name: "Analysis",
  props: {
    planItem: {
      type: Object,
      default: () => ({})
    }
  },
  setup: useAnalysisHeader,
  components: {
    StateProgress,
    HeaderMoreInfo,
    AnalysisModal
  }
});
</script>

<style scoped lang="less">
.analysis-header .analysis-header-api-name {
  cursor: text;
  user-select: text;
}

.analysis-header .analysis-header-state, .analysis-header-action-defect {
  margin-right: 32px;
}

.analysis-header .analysis-header-action {
  flex: 1;
  text-align: right;
}
</style>
