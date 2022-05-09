import {reactive, ref, watch} from "vue";
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
  const analysisDiffOptions = ref<any>([]);
  const analysisDiffValue = ref('')
  const analysisDiffIndex = ref(0)
  const analysisDiffVisible = ref(false)
  const analysisDiffOnClose = ()=>{
    analysisDiffVisible.value = false
  }
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
    analysisDiffVisible.value = true
    scenes.value.splice(0);
    let operation: any = analysisMenuRef.value.getCurrentOperation();
    Object.assign(params, {
      categoryName: operation.categoryName,
      operationName: operation.operationName,
      planItemId: planItemId.value
    });
    queryScenes(params).then((res: any) => {
      if (res) {
        scenes.value = res.scenes;
      }
    }).catch(err => {
      console.error(err)
    });
  };

  watch(()=>analysisDetailRef?.value?.differences,()=>{
    analysisDiffOptions.value = analysisDetailRef.value.differences.map((item:any)=>({
      value: item.differenceName,
      label: item.differenceName
    }))
    analysisDiffValue.value = analysisDiffOptions.value[0]?.value
  },{
    deep:true
  })

  function onChangeDifferenceSelect(val:any) {
    onSetScenes({differenceName:val})
  }

  function onChangeAnalysisDiffIndex(val:string) {
    if (val ==='+'&&analysisDiffIndex.value<(analysisDiffOptions.value.length-1)){
      analysisDiffIndex.value ++
    } else if (val ==='-'&&analysisDiffIndex.value>0){
      analysisDiffIndex.value --
    }
    analysisDiffValue.value = analysisDiffOptions.value[analysisDiffIndex.value].value
    onChangeDifferenceSelect(analysisDiffValue.value)
  }
  onSetPlanItemId();
  onSetAnalysis();

  return {
    planItem,
    scenes,
    analysisMenuRef,
    analysisHeaderRef,
    analysisDetailRef,
    onSelectOperation,
    onSetScenes,
    analysisDiffVisible,
    analysisDiffOnClose,
    analysisDiffOptions,
    onChangeDifferenceSelect,
    analysisDiffIndex,
    analysisDiffValue,
    onChangeAnalysisDiffIndex
  }
};
