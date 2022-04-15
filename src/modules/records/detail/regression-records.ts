import {nextTick, ref} from "vue";

export {default as useRegressionRecordsHeader} from "@/modules/records/header/regression-records-header";
export {default as useRegressionRecordsList} from "@/modules/records/list/records-list";

export const useRegressionRecords = () => {
  const regressionRecordListRef = ref();

  const onSetRegressionRecords = async (params: any = {}) => {
    await nextTick();
    regressionRecordListRef.value.onSetRecordList(params.search, 1, 10)
  };
  return {
    regressionRecordListRef,
    onSetRegressionRecords
  }
};
