import {ref, inject, nextTick, watch} from "vue";
import {useI18n} from "vue-i18n";
import {getPercent} from "@/common/utils";
import {checkCount} from "@/common/utils/content";
import {useGetters} from "vuex-composition-helpers";

export default (props: any) => {
  const { t } = useI18n();
  const { screenWidth } = useGetters(["screenWidth"]);
  const showMoreButton = ref(true);
  const showAllInfo = ref(false);
  const currentBasicItems: any = ref([]);
  const detailReplayChartRef = ref();

  const basicItems = [
    { label: t("reportName"), key: "planName" },
    { label: t("targetHost"), key: "targetHost" },
    { label: t("operator"), key: "creator" },
    { label: t("recordVersion"), key: "caseRecordVersion" },
    { label: t("replayVersion"), key: "coreVersion" },
  ];
  const caseItems = ref([
    { label: t("totalCase"), key: "totalCaseCount" },
    { label: t("successCase"), key: "successCaseCount" },
    { label: t("failureCase"), key: "failCaseCount" },
    { label: t("waitCase"), key: "waitCaseCount" },
    { label: t("invalidCase"), key: "errorCaseCount" },
  ]);
  const column = { xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 };

  const onSetDetail = async () => {
    await nextTick();
    let plan = props.plan;
    checkCount(plan);
    plan.casePassRate = getPercent(plan.successCaseCount, plan.totalCaseCount);
    plan.operationPassRate = getPercent(plan.successOperationCount, plan.totalOperationCount);
    basicItems.forEach((basicItem: any) => {
      basicItem.value = plan[basicItem.key];
    });
    currentBasicItems.value = onGetBasicItems();
    caseItems.value.forEach((caseItem: any) => {
      caseItem.value = plan[caseItem.key];
    });
    detailReplayChartRef.value.onRender(caseItems.value);
  };

  const onToggle = () => {
    showAllInfo.value = !showAllInfo.value;
    currentBasicItems.value = showAllInfo.value ? basicItems : basicItems.slice(0, screenWidth.value < 1600 ? 4 : 8);
  }

  const onGetBasicItems = () => {
    return showAllInfo.value ? basicItems : basicItems.slice(0, screenWidth.value < 1600 ? 4 : 8);
  }

  watch(screenWidth, () => {
    currentBasicItems.value = onGetBasicItems();
    showMoreButton.value = screenWidth.value < 1600;
  },  { immediate: true })

  return {
    column,
    currentBasicItems,
    caseItems,
    detailReplayChartRef,
    showMoreButton,
    showAllInfo,

    onSetDetail,
    onToggle
  }
}
