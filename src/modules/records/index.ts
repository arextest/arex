import {nextTick, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";

export { default as useRecordsList } from "./list/records-list";

export const useRecords = () => {
  const { currentRoute } = useRouter();
  const recordsListRef = ref();

  const onSearch = (value: string) => {
    recordsListRef.value.onSetRecordList(value, true);
  };

  watch(currentRoute, async () => {
    await nextTick();
    if (currentRoute.value.name === Route.EXECUTION_RECORDS) {
      setTimeout(() => recordsListRef.value.onSetRecordList());
    }
  }, {deep: true, immediate: true})

  return {
    recordsListRef,

    onSearch
  }
};
