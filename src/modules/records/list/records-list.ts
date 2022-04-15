import {ref, nextTick} from "vue";
import {useI18n} from "vue-i18n";
import {formatTimestamp, getPercent} from '@/common/utils';
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";
import {queryPlan} from "@/request/report";
import {checkCount} from "@/common/utils/content";

export default () => {
  const {t} = useI18n();
  const router = useRouter();
  const searchValue = ref("");
  const recordList: any = ref([]);
  const paginationRef: any = ref({});
  const loading = ref(false);

  const columns = [
    {title: t("application"), dataIndex: 'app'},
    {title: t('reportName'), dataIndex: 'planName'},
    {title: t('state'), dataIndex: 'state'},
    {title: t('successCase'), dataIndex: 'successCaseCount', class: "green-text"},
    {title: t('failureCase'), dataIndex: 'failCaseCount', class: "red-text"},
    {title: t('invalidCase'), dataIndex: 'errorCaseCount', class: "orange-text"},
    {title: t('waitCase'), dataIndex: 'waitCaseCount', class: "blue-text"},
    {title: t('operator'), dataIndex: 'creator'},
    {title: t('replayStartTime'), dataIndex: 'replayStartTime'},
    {title: t('action'), dataIndex: 'action'}
  ];

  const onClickReport = (record: any) => {
    window.open(router.resolve({name: Route.REPORT, query: {appId: record.appId, planId: record.planId}}).href);
  };

  const onSetRecordList = (value: string, searching: boolean = false) => {
    searchValue.value = value;
    recordList.value = [];
    loading.value = true;
    if (searching) {
      paginationRef.value.onReset();
    }
    const { current: pageIndex, pageSize } = paginationRef.value.pagination;
    let params = {
      appId: value,
      pageIndex,
      pageSize,
      needTotal: true
    };
    queryPlan(params).then(async (res: any) => {
      if (res) {
        if (res.planStatisticList && res.planStatisticList.length > 0) {
          recordList.value = res.planStatisticList.map((item: any) => {
            const { appId, appName,  replayStartTime, totalCaseCount, waitCaseCount} = item;
            item.app = (appId || "") + (appName ?  "_" + appName : "");
            item.replayStartTime = replayStartTime ? formatTimestamp(replayStartTime) : "";
            checkCount(item);
            item.percent = getPercent(totalCaseCount - waitCaseCount, totalCaseCount, false);
            return item;
          })
        }
        paginationRef.value.pagination.total = res.totalCount;
      }
      loading.value = false;
    }).catch((err) => console.error(err));
  };

  const onSetCurrentPlans = () => onSetRecordList(searchValue.value);

  return {
    recordList,
    paginationRef,
    loading,
    columns,

    onSetCurrentPlans,
    onClickReport,
    onSetRecordList
  }
}
