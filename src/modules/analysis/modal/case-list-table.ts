import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {queryReplayCases} from "@/request/analysis";
import {diffResultCode} from "@/common/constant";

export default (props: any) => {
  const {t} = useI18n();
  const loading = ref(false);
  const paginationRef = ref();
  const items = ref([]);
  const keyWord = ref();
  const searchDiffCode = ref();

  const columns = [
    {title: t("recordId"), dataIndex: "recordId"},
    {title: t("replayId"), dataIndex: "replayId"},
    {title: t("caseStatus"), dataIndex: "diffResultCode"},
    {title: t("action"), dataIndex: "action"}
  ]
  const requestParams = {
    needTotal: true,
    pageIndex: 1,
    pageSize: 10
  };

  const onSetItems = (params: any) => {
    loading.value = true;
    params.planItemId = props.planItemId;
    params.keyWord = keyWord.value;
    params.diffResultCode = searchDiffCode.value;
    Object.assign(requestParams, params)

    queryReplayCases(requestParams).then((res: any) => {
      if (res && res.result) {
        items.value = res.result.map((row: any) => {
          let code = {label: "", classCss: "", value: -1}
          diffResultCode.forEach((c) => {
            if (c.value === row.diffResultCode) {
              code = c
            }
          })
          return {
            recordId: row.recordId,
            replayId: row.replayId,
            diffResultCode: {
              label: t(code.label),
              class: code.classCss
            }
          }
        })
      }
      paginationRef.value.pagination.total = res.totalCount || 0;
      loading.value = false;
    })

  }

  function goToDiffDetail(record: any) {
    const href = `/#/regression/report/diffDetail?recordId=${record.recordId}`
    window.open(href, "_blank");
  }

  return {
    columns,
    items,
    paginationRef,
    loading,
    keyWord,
    searchDiffCode,
    goToDiffDetail,
    onSetItems
  }
}
