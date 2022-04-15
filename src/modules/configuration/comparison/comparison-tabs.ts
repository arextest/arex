import {computed, inject, nextTick, reactive, ref} from "vue";

export default (props: any, { emit }: any) => {
  const nodes: any = inject("nodes");
  const tabMap: any = reactive({
    inclusionsRef: {label: "Inclusions", count: 0, type: 1, category: 7, columnsName: "inclusionsColumns"},
    exclusionsRef: {label: "Exclusions", count: 0, type: 1, category: 0, columnsName: "exclusionsColumns"},
    sortKeysRef: {label: "SortKeys", count: 0, type: 0, category: 4, columnsName: "sortKeysColumns"},
    referencesRef: {label: "References", count: 0, type: 0, category: 5, columnsName: "sortKeysColumns"}
  });
  const activeKey = computed({
    get: () => props.activeTabKey,
    set: (value: string) => emit("update:activeTabKey", value)
  });

  const refRaw: any = {
    inclusionsRef: ref(),
    exclusionsRef: ref(),
    sortKeysRef: ref(),
    referencesRef: ref()
  }

  const onFormatTabName = (key: string) => `${tabMap[key].label} ( ${tabMap[key].count} )`

  const onChange = async () => {
    await nextTick();
    let category = tabMap[activeKey.value].category;
    let detail = props.items.find((item: any) => item.categoryType === category);
    if (detail && detail.detailsList) {
      nodes.value = detail.detailsList;
    } else {
      nodes.value = [];
    }
    const detailRef = refRaw[activeKey.value].value;
    detailRef.paginationRef.pagination.total = nodes.value.length;
    detailRef.onSetCurrentNodes();
  }

  return {
    activeKey,
    tabMap,
    ...refRaw,

    onFormatTabName,
    onChange,
  }
};
