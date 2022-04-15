import {nextTick, ref} from "vue";
import {getPercent} from "@/common/utils";

export default (props: any) => {
  const headerHistoryRef = ref();

  const onSetHeader = async () => {
    await nextTick();
    headerHistoryRef.value.onSetPlans();
    let plan = props.plan;
    plan.percent = getPercent(plan.totalCaseCount - plan.waitCaseCount, plan.totalCaseCount, false);
  }

  return {
    headerHistoryRef,

    onSetHeader
  }
}
