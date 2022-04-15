<template>
  <template v-if="showReport">
    <a-card class="report">
      <report-header ref="reportHeaderRef" :plan="plan" />
      <transition
        enter-active-class="animate__animated animate__flipInX"
        leave-active-class="animate__animated animate__flipOutX"
      >
        <report-detail class="report-detail" v-show="showDetail" ref="reportDetailRef" :plan="plan"/>
      </transition>
      <report-list class="report-list" ref="reportListRef" />
    </a-card>
  </template>
  <router-view v-else v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useReport} from "@/modules/report";

  import ReportHeader from "@/view/report/header/ReportHeader.vue";
  import ReportDetail from "@/view/report/detail/ReportDetail.vue";
  import ReportList from "@/view/report/list/ReportList.vue";

  export default defineComponent({
    name: "Report",
    setup: useReport,
    components: {
      ReportHeader,
      ReportDetail,
      ReportList
    }
  });
</script>

<style scoped lang="less">
  .report .report-detail {
    margin-top: 16px;
  }

  .report .report-list {
    margin-top: 24px;
  }

/*  .detail-enter-from, .detail-leave-to {
    transform: scale(0);
  }

  .detail-enter-active, .detail-leave-active {
    transition: transform 0.3s ease;
  }*/
</style>
