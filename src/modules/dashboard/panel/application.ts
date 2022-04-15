import {ref, nextTick, watch} from "vue";
import {useI18n} from 'vue-i18n'
import {getCasePassRate} from "@/common/utils/business";
import {queryAllAppDailyResults, querySummary} from "@/request/dashboard";
import moment from "moment";

export default () => {
  const {t} = useI18n();
  const currentAppId: any = ref("");
  const applicationBasicStatistic = ref({
    title: t('basicInfo'),
    description: t('appOwner') + ": ",
  });
  const operationSumBasicStatistic = ref({
    title: t('operationConfigTotalCount'),
    description: t('operationConfigTotalCountDesc'),
    count: 0
  });
  const replaySumStatistic = ref({
    title: t('replayTotalCount'),
    description: t('replayTotalCountDesc'),
    count: 0
  });

  const detailPassRateTrendChartRef = ref();
  const passRateTrendChartData: any = ref([]);

  const onSetBasicStatistic = (appId: any) => {
    applicationBasicStatistic.value.description = t('appOwner') + ": ";
    operationSumBasicStatistic.value.count = 0;
    replaySumStatistic.value.count = 0;
    let params = {
      appId: appId
    };
    querySummary(params).then((res: any) => {
      if (res && res.appDescription) {
        let result = res.appDescription;
        applicationBasicStatistic.value.description = result.owner;
        operationSumBasicStatistic.value.count = result.operationCount;
        replaySumStatistic.value.count = result.replayCount;
      }
    }).catch((err: any) => {
      console.log(err);
    });
  };
  const onSetPassRateTrendChart = async (appId: any) => {
    passRateTrendChartData.value = [];
    let now = new Date();
    let oneDayAgo = moment(now).add(-0, "days");
    let sevenDaysAgo = moment(now).add(-7, "days");
    let endTime = oneDayAgo.endOf("day").valueOf();
    let startTime = sevenDaysAgo.startOf("day").valueOf();
    let params = {
      appId: appId,
      startTime: startTime,
      endTime: endTime
    };
    queryAllAppDailyResults(params).then(async (res: any) => {
      if (res && res.caseResults && res.caseResults.length > 0) {
        res.caseResults.forEach((item: any) => {
          if (item) {
            let passRateAvg: any = 0;
            if (item.caseResults) {
              let totalCaseTotalCount = 0;
              let successCaseTotalCount = 0;
              let errorCaseTotalCount = 0;
              item.caseResults.forEach((item: any) => {
                totalCaseTotalCount += item.totalCaseCount;
                successCaseTotalCount += item.successCaseCount;
                errorCaseTotalCount += item.errorCaseCount;
              });
              passRateAvg = getCasePassRate(totalCaseTotalCount, successCaseTotalCount, errorCaseTotalCount, false);
            }
            let temp = {
              name: item.date,
              value: passRateAvg
            };
            passRateTrendChartData.value.push(temp);
          }
        })
      }
      await nextTick();
      detailPassRateTrendChartRef.value.onRender(passRateTrendChartData.value)
    }).catch((err) => {
      console.error(err);
    });
  };
  const onSetApplication = (params: any = {}) => {
    currentAppId.value = params.appId;
  };
  watch(currentAppId, () => {
    onSetPassRateTrendChart(currentAppId.value);
    onSetBasicStatistic(currentAppId.value);
  }, {deep: true, immediate: true});
  return {
    currentAppId,
    applicationBasicStatistic,
    operationSumBasicStatistic,
    replaySumStatistic,
    detailPassRateTrendChartRef,
    onSetApplication
  }
}
