import {ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {Route} from "@/common/constant";
import {useRouter} from "vue-router";
import {queryPlan} from "@/request/report";
import {formatTimestamp, getFormatElapsedTime} from "@/common/utils";
import {getCasePassRate} from "@/common/utils/business";

export default (props: any) => {
  const {t} = useI18n();
  const router = useRouter();
  const loading = ref(false);
  const recordList = ref([]);
  const columns = ref([
    {title: t("application"), dataIndex: 'app'},
    {title: t('reportName'), dataIndex: 'planName'},
    {title: t('totalCase'), dataIndex: 'totalCaseCount'},
    {title: t('successCase'), dataIndex: 'successCaseCount', class: "green-text"},
    {title: t('failureCase'), dataIndex: 'failCaseCount', class: "red-text"},
    {title: t('invalidCase'), dataIndex: 'errorCaseCount', class: "orange-text"},
    {title: t('waitCase'), dataIndex: 'waitCaseCount', class: "blue-text"},
    {title: t('casePassRate'), dataIndex: 'casePassRate'},
    {title: t('replayTimeConsumed'), dataIndex: 'elapsedTime'},
    {title: t('operator'), dataIndex: 'creator'},
    {title: t('replayStartTime'), dataIndex: 'replayStartTime'},
    {title: t('action'), dataIndex: 'action'}
  ]);

  const onClickReport = (record: any) => {
    window.open(router.resolve({name: Route.REPORT, query: {appId: record.appId, planId: record.planId}}).href);
  };

  const onSetLastRecordsList = (appId: any) => {
    loading.value = true;
    recordList.value = [];
    let params = {
      appId: appId,
      pageIndex: 0,
      pageSize: 10,
      needTotal: false
    };
    queryPlan(params).then((res: any) => {
      if (res && res.planStatisticList && res.planStatisticList.length > 0) {
        let tempList = res.planStatisticList;
        if (tempList.length > 0) {
          recordList.value = tempList.map((item: any) => {
            item.app = (item.appId || "") + (item.appName ? "_" + item.appName : "");
            item.successCaseCount = Number(item.successCaseCount);
            item.failCaseCount = Number(item.failCaseCount);
            item.errorCaseCount = Number(item.errorCaseCount);
            item.waitCaseCount = Number(item.waitCaseCount);
            item.totalCaseCount = Number(item.totalCaseCount);
            item.casePassRate = getCasePassRate(item.totalCaseCount, item.successCaseCount, item.errorCaseCount, true);
            item.elapsedTime = getFormatElapsedTime(item.replayStartTime, item.replayEndTime);
            item.replayStartTime = formatTimestamp(item.replayStartTime);
            return item;
          })
        }
      }
      loading.value = false;
    }).catch((err: any) => {
      loading.value = false;
      console.log(err)
    })
  };

  watch(props, () => {
    onSetLastRecordsList(props.appId);
  }, {deep: true, immediate: true});

  return {
    loading,
    columns,
    recordList,
    onClickReport,
    onSetLastRecordsList
  }
}
