import {computed, ref, nextTick, watch} from "vue";
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";

export { default as useRegressionHeader } from "./header/regression-header";
export { default as useRegressionList } from "./list/regression-list";
export { default as useListActions } from "./list/list-actions";
export { default as useListReplayModal } from "./list/list-replay-modal";

export const useRegression = () => {
  const { currentRoute } = useRouter();
  const showRegression = computed(() => currentRoute.value.name === Route.REGRESSION_TEST);
  const regressionListRef = ref();

  const onSearchApps = (value: string) => {
    regressionListRef.value.onFilterApps(value);
  };

  watch(currentRoute, async () => {
    if (showRegression.value) {
      await nextTick();
      setTimeout(() => regressionListRef.value.onSetApps());
    }
  }, {deep: true, immediate: true})

  return {
    showRegression,
    regressionListRef,

    onSearchApps
  }
}
