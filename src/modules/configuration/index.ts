import {nextTick, ref, watch} from "vue";
import {useRouter} from "vue-router";

export { default as useConfigurationList } from "./list/configuration-list";
export { default as useListConfigurationActions } from "./list/list-configuration-actions";
export { default as useConfigurationModal } from "./modal/configuration-modal";
export { default as useConfigurationRecord } from "./record/configuration-record";
export { default as useRecordBasicConfig } from "./record/record-basic-config";
export { default as useRecordAdvancedConfig } from "./record/record-advanced-config";
export { default as useRecordClassTable } from "./record/record-class-table";
export { default as useConfigurationReplay } from "./replay/configuration-replay";
export { default as useConfigurationTemplate } from "./template/configuration-template";
export { default as useConfigurationComparison } from "./comparison/configuration-comparison";
export { default as useComparisonHeader } from "./comparison/comparison-header";
export { default as useComparisonTabs } from "./comparison/comparison-tabs";
export { default as useComparisonDetail } from "./comparison/comparison-detail";
export { default as useComparisonMessage } from "./comparison/comparison-message";
export { default as useComparisonTree } from "./comparison/comparison-tree";

export const useConfiguration = () => {
  const { currentRoute } = useRouter();
  const configurationListRef = ref();

  const onSearchApps = (value: string) => {
    configurationListRef.value.onSetFilterApps(value);
  };

  watch(currentRoute, async () => {
    await nextTick();
    setTimeout(() => {
      if (configurationListRef.value) {
        configurationListRef.value.onSetApps();
      }
    });
  }, { deep: true, immediate: true });

  return {
    configurationListRef,

    onSearchApps
  }
};
