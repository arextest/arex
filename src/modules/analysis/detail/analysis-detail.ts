import {ref, computed} from "vue";
import {useI18n} from "vue-i18n";
import {queryDifferences} from "@/request/analysis";

export default (props: any, {emit}: any) => {
  const {t} = useI18n();
  const differences = ref([]);
  const selectedDifferenceNames = ref<string[]>([]);
  const showPagination = computed(() => differences.value.length > 10);
  const hasSelected = computed(() => selectedDifferenceNames.value.length > 0);

  const columns = [
    {title: t("pointOfDifference"), dataIndex: "differenceName"},
    {title: t("sceneCount"), dataIndex: "sceneCount"},
    {title: t("caseCount"), dataIndex: "caseCount"},
    {title: t("action"), dataIndex: "action"},
  ];

  const onSetDifferences = (params: any) => {
    queryDifferences(params).then((res: any) => {
      differences.value = res.differences || [];
    }).catch((err: any) => {
      console.error(err);
    })
  };

  const onSelectChange = (selectedRowKeys: string[]) => {
    selectedDifferenceNames.value = selectedRowKeys;
  };

  const onClickScenes = (differenceName: string) => {
    emit("onClickScenes", {differenceName});
    const analysisDiffCard: any = document.querySelector("#analysisDiffCard");
    window.scrollTo({
      top: analysisDiffCard.offsetTop + 50,
      behavior: "smooth"
    });
  };

  return {
    columns,
    differences,
    showPagination,
    selectedDifferenceNames,
    hasSelected,

    onSetDifferences,
    onSelectChange,
    onClickScenes
  }
};
