import {nextTick, ref, provide, computed, watch} from "vue";
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";
import {queryPlan} from "@/request/report";

export {default as useReportHeader} from "./header/report-header";
export {default as useHeaderHistory} from "./header/header-history";
export {default as useHeaderAction} from "./header/header-action";
export {default as useHeaderAppSearch} from "./header/header-app-search";
export {default as useReportDetail} from "./detail/report-detail";
export {default as useReportList} from "./list/report-list";
export {default as useDetailReplayChart} from "./detail/detail-replay-chart";

export const useReport = () => {
  const router = useRouter();
  const plan: any = ref({});
  const reportHeaderRef = ref();
  const reportDetailRef = ref();
  const reportListRef = ref();
  const showReport = computed(() => router.currentRoute.value.name === Route.REPORT);
  const showDetail = ref(true);

  provide("showDetail", showDetail);

  const onSetAppId = () => {
    let appId = router.currentRoute.value.query.appId;
    if (!appId) {
      router.push({name: Route.ERROR_404});
    } else {
      plan.value.appId = appId;
      provide("appId", appId);
    }
  }

  const onSetReport = () => {
    let planId = router.currentRoute.value.query.planId;
    let params = {
      appId: plan.value.appId,
      planId,
      pageIndex: 1,
      pageSize: 1,
      needTotal: false
    };
    queryPlan(params).then(({ planStatisticList: resPlans }: any) => {
      if (resPlans && resPlans.length > 0) {
        plan.value = resPlans[0];
      }
      reportHeaderRef.value.onSetHeader();
      reportDetailRef.value.onSetDetail();
      reportListRef.value.onSetList(plan.value.planId);
    }).catch((err) => console.error(err));
  };

  watch(router.currentRoute, () => {
    if (showReport.value) {
      onSetAppId();
      onSetReport();
    }
  }, {deep: true, immediate: true})

  return {
    plan,
    reportHeaderRef,
    reportListRef,
    reportDetailRef,
    showReport,
    showDetail
  }
}
