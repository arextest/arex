import {reactive, ref} from "vue";
import {Route} from "@/common/constant";
import {useRouter} from "vue-router";
import {queryPlanItems} from "@/request/report";
import {queryScenes} from "@/request/analysis";

export {default as useHeaderMoreInfo} from "./header/header-more-info";
export {default as useAnalysisDiff} from "./diff/analysis-diff";
export {default as useAnalysisDiffMsgShow} from "./diff/analysis-diff-msg-show";
export {default as useAnalysisHeader} from "./header/analysis-header";
export {default as useAnalysisMenu} from "./menu/analysis-menu";
export {default as useMenuSetting} from "./menu/menu-setting";
export {default as useMenuOperationItem} from "./menu/menu-operation-item";
export {default as useAnalysisDetail} from "./detail/analysis-detail";
export {default as useAnalysisModal} from "./modal/analysis-modal";
export {default as useCaseListFilter} from "./modal/case-list-filter";
export {default as useCaseListTable} from "./modal/case-list-table";
export {default as useFullMessage} from "./diff/full-message";

export const useAnalysis = () => {
  const router = useRouter();
  const planItemId = ref();
  const planItem: any = reactive({});
  const analysisHeaderRef = ref();
  const analysisMenuRef = ref();
  const analysisDetailRef = ref();
  const scenes = ref([]);

  const onSetPlanItemId = () => {
    planItemId.value = router.currentRoute.value.query.planItemId;
    if (!planItemId.value) {
      router.push({name: Route.ERROR_404});
    }
  };

  const onSetAnalysis = () => {
    queryPlanItems({planItemId: planItemId.value}).then(({planItemStatisticList: planItems}: any) => {
      if (planItems && planItems.length > 0) {
        Object.assign(planItem, planItems[0]);
      }
      analysisHeaderRef.value.onSetPlanItem();
      analysisMenuRef.value.onSetOperations(planItemId.value);
    }).catch((err) => console.error(err));
  };

  const onSelectOperation = (params: any) => {
    params.planItemId = planItemId.value;
    analysisDetailRef.value.onSetDifferences(params);
  };

  const onSetScenes = (params: any) => {
    scenes.value.splice(0);
    let operation: any = analysisMenuRef.value.getCurrentOperation();
    Object.assign(params, {
      categoryType: operation.categoryType,
      operationName: operation.operationName,
      planItemId: planItemId.value
    });
    queryScenes(params).then((res: any) => {
      if (res) {
        scenes.value = res.scenes;
      }
    }).catch(err => console.error(err));
  };

  onSetPlanItemId();
  onSetAnalysis();

  return {
    planItem,
    scenes,
    analysisMenuRef,
    analysisHeaderRef,
    analysisDetailRef,

    onSelectOperation,
    onSetScenes
  }
};
