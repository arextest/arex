<template>
  <a-modal
    class="analysis-modal"
    v-model:visible="visible"
    :title="$t('allCases')"
    :closable="false"
    @ok="onOk"
    @cancel="onCancel"
    width="70%"
  >
    <case-list-filter ref="caseListFilterRef" @onSearch="onSearch"/>
    <case-list-table ref="caseListTableRef" :planItemId="planItemId"/>
  </a-modal>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useAnalysisModal} from "@/modules/analysis";

  import CaseListFilter from "@/view/analysis/modal/CaseListFilter.vue"
  import CaseListTable from "@/view/analysis/modal/CaseListTable.vue"

  export default defineComponent({
    name: "AnalysisModal",
    setup: useAnalysisModal,
    components: {
      CaseListFilter,
      CaseListTable
    },
    props: {
      planItemId: {
        type: Number
      }
    }
  });
</script>

<style scoped lang="less">
  .analysis-modal {
    margin: 8px 0 -8px;
  }

  .analysis-modal .modal-table {
    margin-top: 16px;
  }
</style>
