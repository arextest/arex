import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {Env, Route} from "@/common/constant";
import {queryPlanItems} from "@/request/report";
import {getPercent, showMessage, showNotification} from "@/common/utils";
import {addPlan} from "@/request/regression";
import {checkCount} from "@/common/utils/content";

export default () => {
  const {t} = useI18n();
  const router = useRouter();
  const planItems: any = ref([]);
  const filteredPlanItems = ref([]);
  const currentPlanItems = ref([]);
  const paginationRef = ref();
  const columns = ref([
    {title: t("planItemId"), dataIndex: "planItemId"},
    {title: t("apiName"), dataIndex: "operationName", customFilterDropdown: true},
    {title: t("state"), dataIndex: "state"},
    {title: t("replayTimeConsumed"), dataIndex: "replayTimeConsumed"},
    {title: t("totalCase"), dataIndex: "totalCaseCount"},
    {title: t("successCase"), dataIndex: "successCaseCount", class: "green-text"},
    {title: t("failureCase"), dataIndex: "failCaseCount", class: "red-text"},
    {title: t("invalidCase"), dataIndex: "errorCaseCount", class: "orange-text"},
    {title: t("waitCase"), dataIndex: "waitCaseCount", class: "blue-text"},
    {title: t("action"), dataIndex: "action"}
  ]);

  const onSetList = (planId: string) => {
    planItems.value.splice(0);
    queryPlanItems({planId}).then((res: any) => {
      if (res && res.planItemStatisticList && res.planItemStatisticList.length > 0) {
        planItems.value = res.planItemStatisticList;
        planItems.value.forEach((planItem: any) => {
          checkCount(planItem);
          const { totalCaseCount, waitCaseCount, replayStartTime, replayEndTime } = planItem;
          planItem.percent = getPercent(totalCaseCount - waitCaseCount, totalCaseCount, false);
          planItem.replayTimeConsumed = (replayStartTime && replayEndTime) ? (replayEndTime - replayStartTime) / 1000 : 0;

        });
      }
      onSetFilteredPlanItems();
    }).catch((err) => console.error(err));
  };

  const onSetFilteredPlanItems = () => {
    filteredPlanItems.value = planItems.value;
    columns.value.forEach((column: any) => {
      if (column.customFilterDropdown) {
        let dataIndex = column.dataIndex;
        let searchValue = column.searchValue;
        if (searchValue) {
          filteredPlanItems.value = filteredPlanItems.value.filter((filteredTask: any) => {
            return filteredTask[dataIndex].toString().toLowerCase().includes(searchValue.toLowerCase());
          });
        }
      }
    });
    paginationRef.value.onReset();
    paginationRef.value.pagination.total = filteredPlanItems.value.length;
    onSetCurrentPlanItems();
  };

  const onSetCurrentPlanItems = () => currentPlanItems.value = paginationRef.value.onSlice(filteredPlanItems.value);

  const onToAnalysis = (planItem: any) => {
    const { planItemId } = planItem;
    window.open(router.resolve({name: Route.DETAIL_ANALYSIS, query: {planItemId}}).href);
  };

  const onRerun = (plaItem: any) => {
    showMessage(t("areYouSureToRerun"), "", t("yes"), t("no"), () => {
      const { appId, sourceHost, targetHost, caseSourceType, operationId } = plaItem;
      let params = {
        appId,
        sourceEnv: sourceHost || Env.PRO,
        targetEnv: targetHost || Env.PRO,
        operator: "Visitor",
        replayPlanType: 1,
        caseSourceType,
        operationCaseInfoList: [ { operationId } ]
      };
      addPlan(params).then(({ result, desc }: any) => {
        if (result === 1) {
          showNotification(t("startedSuccessfully"), "", "success");
        } else {
          showNotification(t("startFailed"), desc, "error");
        }
      }).catch(err => console.error(err));
    })
  }

  return {
    columns,
    planItems,
    currentPlanItems,
    paginationRef,

    onSetList,
    onSetFilteredPlanItems,
    onSetCurrentPlanItems,
    onToAnalysis,
    onRerun
  }
}
