import {watch, ref} from "vue";
import {querySlaveOperations} from "@/request/analysis";
import {getPercent} from "@/common/utils";

export default (props: any, {emit}: any) => {
  const filteredOperations: any = ref([]);
  const currentOperations = ref([]);
  const currentOperationIndex = ref(0);
  const menuSettingRef = ref();
  const paginationRef = ref();
  const hasSelectedAll = ref(false);
  const hasSelected = ref(false);

  let operations: any = [];
  const onSetOperations = (planItemId: string) => {
    querySlaveOperations({planItemId}).then(({categoryStatisticList: resOperations}: any) => {
      if (resOperations && resOperations.length > 0) {
        operations = resOperations;
        operations.forEach((operation: any) => {
          operation.typeLabel = operation.categoryName;
          operation.totalCaseCount = operation.totalCaseCount || 0;
          operation.failCaseCount = operation.failCaseCount || 0;
          operation.failureRate = getPercent(operation.failCaseCount, operation.totalCaseCount, false);
        })
      }
      onSetFilteredOperations();
    })
  };
  const onSetFilteredOperations = () => {
    let categoryName = menuSettingRef.value.select.value;
    filteredOperations.value = operations.filter((operation: any) => {
      operation.isSelected = false;
      if (operation.failCaseCount && (categoryName === -1 ||
          operation.categoryName === menuSettingRef.value.select.value)) {

        let filter = menuSettingRef.value.select.options.filter((opt: any) => {
          return opt.value === operation.categoryName
        })
        if (filter.length === 0) {
          menuSettingRef.value.select.options.push({label: operation.categoryName, value: operation.categoryName})
        }
        return true;
      }
      return false;
    });
    if (filteredOperations.value.length > 0) {
      menuSettingRef.value.onSort(filteredOperations.value);
      paginationRef.value.onReset();
      paginationRef.value.pagination.total = filteredOperations.value.length;
      paginationRef.value.pagination.pageSize = 5;
      onSetCurrentOperations();
      onClickOperation(0);
    }
  };
  const onSetCurrentOperations = () => {
    currentOperations.value = paginationRef.value.onSlice(filteredOperations.value);
    onClickOperation(0);
  }
  const onClickOperation = (operationIndex: number) => {
    currentOperationIndex.value = operationIndex;
    let operation: any = getCurrentOperation();
    emit("onSelectOperation", {categoryName: operation.categoryName, operationName: operation.operationName});
  };
  const onSelectOperations = (operationItem?: any, checked?: boolean) => {
    if (operationItem) {
      operationItem.isSelected = !operationItem.isSelected;
    } else {
      filteredOperations.value.forEach((filteredOperation: any) => {
        filteredOperation.isSelected = checked;
      })
    }
  }
  const getCurrentOperation = () => currentOperations.value[currentOperationIndex.value];
  watch(filteredOperations, () => {
    hasSelected.value = false;
    hasSelectedAll.value = true;
    filteredOperations.value.forEach((operation: any) => {
      if (operation.isSelected) {
        hasSelected.value = true;
      } else {
        hasSelectedAll.value = false;
      }
    })
  }, {deep: true, immediate: true})

  return {
    currentOperations,
    currentOperationIndex,
    menuSettingRef,
    paginationRef,
    hasSelected,
    hasSelectedAll,
    onSetOperations,
    onSetFilteredOperations,
    onSetCurrentOperations,
    onClickOperation,
    getCurrentOperation,
    onSelectOperations
  }
}
