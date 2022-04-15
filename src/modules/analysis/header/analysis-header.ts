import { ref } from "vue";
import {getPercent} from "@/common/utils";
import {checkCount} from "@/common/utils/content";
import {useI18n} from "vue-i18n";

export default (props: any, {emit}: any) => {
  const {t} = useI18n();
  const headerMoreInfoRef = ref();
  const allCasesModalRef = ref();

  const onSetPlanItem = () => {
    let planItem = props.planItem;
    checkCount(planItem);
    planItem.percent = getPercent(planItem.totalCaseCount - planItem.waitCaseCount, planItem.totalCaseCount,
      false);
    headerMoreInfoRef.value.onSetInfo(planItem);
  };

  const onShowAllCases = () => {
    allCasesModalRef.value.onShow()
  }

  return {
    headerMoreInfoRef,
    allCasesModalRef,

    onSetPlanItem,
    onShowAllCases
  }
}
