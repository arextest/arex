<template>
  <div class="flex case-list-filter">
    <div class="case-list-filter-label">{{ $t("caseStatus") }}:</div>
    <div class="case-list-filter-value">
      <main-select class="case-list-filter-controller-width" :select="diffResultCodeSelect"/>
    </div>
    <div class="case-list-filter-label">{{ $t("caseKeyWord") }}:</div>
    <div class="case-list-filter-value">
      <a-input class="case-list-filter-controller-width" v-model:value="searchKey"/>
    </div>
    <div class="case-list-filter-search">
      <a-button type="primary" @click="onSearch">{{ $t("search") }}</a-button>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {useCaseListFilter} from "@/modules/analysis";
import MainSelect from "@/components/select/MainSelect.vue";

export default defineComponent({
  name: "CaseListFilter",
  setup: useCaseListFilter,
  components: {
    MainSelect
  }
})
</script>


<style scoped lang="less">
.case-list-filter .case-list-filter-label {
  margin-right: 8px;
}

.case-list-filter .case-list-filter-value {
  margin-right: 16px;
}

.case-list-filter .case-list-filter-controller-width {
  width: 300px;
}

.case-list-filter .case-list-filter-search {

}
</style>
