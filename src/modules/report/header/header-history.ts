import { ref, nextTick } from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {queryPlan} from "@/request/report";
import {getPercent} from "@/common/utils";
import {Route} from "@/common/constant";

export default () => {
  const { t } = useI18n();
  const router = useRouter();
  const plans: any = ref([]);

  const columns = [
    { title: t("passRate"), dataIndex: "passRate" },
    { title: t("reportName"), dataIndex: "planName" },
    { title: t("action"), dataIndex: "action" },
  ];

  const onSetPlans = () => {
    plans.value.splice(0);
    let planId: any = router.currentRoute.value.query.planId;
    let params = {
      appId: router.currentRoute.value.query.appId,
      pageIndex: 1,
      pageSize: 10,
      needTotal: false
    };
    queryPlan(params).then(({ planStatisticList: resPlans }: any) => {
      if (resPlans && resPlans.length > 0) {
        resPlans.forEach((resPlanItem: any, resPlanIndex: number) => {
          if ((!planId && resPlanIndex > 0) || (planId && resPlanItem.planId !== parseInt(planId))) {
            plans.value.push({
              appId: resPlanItem.appId,
              planId: resPlanItem.planId,
              planName: resPlanItem.planName,
              passRate: getPercent(resPlanItem.successCaseCount, resPlanItem.totalCaseCount)
            });
          }
        })
      }
    }).catch((err) => {
      console.error(err)
    });
  };

  const onClickCheck = (appId: string, planId: string) => {
    location.href = router.resolve({ name: Route.REPORT, query: { appId, planId } }).href;
    location.reload();
  };

  return {
    columns,
    plans,

    onSetPlans,
    onClickCheck
  }
}
