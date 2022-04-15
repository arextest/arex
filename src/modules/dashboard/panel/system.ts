import {ref, nextTick} from "vue";
import {useI18n} from 'vue-i18n'
import {getCasePassRate} from "@/common/utils/business";
import {queryAllAppDailyResults, queryAllAppResults, querySummary} from "@/request/dashboard";
import moment from "moment";

export default () => {
  const {t} = useI18n();
  const applicationSumBasicStatistic = ref({
    title: t('applicationConfigTotalCount'),
    description: t('applicationConfigTotalCountDesc'),
    count: 0
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

  const appLastReplayList: any = ref([]);

  const detailAppProportionChartRef = ref();
  const appProportionChartData: any = ref([
    {label: "0~60% " + t("passRate"), value: 0},
    {label: "60%~70% " + t("passRate"), value: 0},
    {label: "70%~80% " + t("passRate"), value: 0},
    {label: "80%~90% " + t("passRate"), value: 0},
    {label: "90%~95% " + t("passRate"), value: 0},
    {label: "95%~100% " + t("passRate"), value: 0},
    {label: "graphicValue", value: '0%'},
    {label: "graphicTopMark", value: t("passRateAvg")},
  ]);

  const detailAppLastPassRateChartRef = ref();
  const appLastPassRateChartData: any = ref([]);

  const detailPassRateTrendChartRef = ref();
  const passRateTrendChartData: any = ref([]);

  const onSetBasicStatistic = () => {
    applicationSumBasicStatistic.value.count = 0;
    operationSumBasicStatistic.value.count = 0;
    replaySumStatistic.value.count = 0;
    let params = {};
    querySummary(params).then((res: any) => {
      if (res && res.appDescription) {
        let result = res.appDescription;
        applicationSumBasicStatistic.value.count = result.appCount;
        operationSumBasicStatistic.value.count = result.operationCount;
        replaySumStatistic.value.count = result.replayCount;
      }
    }).catch((err: any) => {
      console.log(err);
    });

  };
  const onSetAppProportionChart = async () => {
    let totalCaseTotalCount = 0;
    let successCaseTotalCount = 0;
    let errorCaseTotalCount = 0;
    let appTotalCount = appLastReplayList.value ? appLastReplayList.value.length : 0;
    if (appTotalCount > 0) {
      appLastReplayList.value.forEach((item: any) => {
        totalCaseTotalCount += item.totalCaseCount;
        successCaseTotalCount += item.successCaseCount;
        errorCaseTotalCount += item.errorCaseCount;
        let totalPassRate = getCasePassRate(totalCaseTotalCount, successCaseTotalCount, errorCaseTotalCount, true);
        let tempItem = {
          appId: item.appId,
          passRate: getCasePassRate(item.totalCaseCount, item.successCaseCount, item.errorCaseCount, false),
        };
        appProportionChartData.value.forEach((data: any) => {
          if (data.label === 'graphicValue') {
            data.value = totalPassRate;
          }
          if ((data.label === "0~60% " + t("passRate")) && tempItem.passRate >= 0 && tempItem.passRate < 60) {
            data.value++;
          }
          if ((data.label === "60%~70% " + t("passRate")) && tempItem.passRate >= 60 && tempItem.passRate < 70) {
            data.value++;
          }
          if ((data.label === "70%~80% " + t("passRate")) && tempItem.passRate >= 70 && tempItem.passRate < 80) {
            data.value++;
          }
          if ((data.label === "80%~90% " + t("passRate")) && tempItem.passRate >= 80 && tempItem.passRate < 90) {
            data.value++;
          }
          if ((data.label === "90%~95% " + t("passRate")) && tempItem.passRate >= 90 && tempItem.passRate < 95) {
            data.value++;
          }
          if ((data.label === "95%~100% " + t("passRate")) && tempItem.passRate >= 95 && tempItem.passRate <= 100) {
            data.value++;
          }
        });
      })
    }
    await nextTick();
    detailAppProportionChartRef.value.onRender(appProportionChartData.value);
  };

  const onSetAppLastPassRateChart = async () => {
    appLastPassRateChartData.value = appLastReplayList.value.map((item: any) => {
      item.app = (item.appId || "") + (item.appName ? "_" + item.appName : "");
      item.passRate = getCasePassRate(item.totalCaseCount, item.successCaseCount, item.errorCaseCount, false);
      return item;
    });
    await nextTick();
    detailAppLastPassRateChartRef.value.onRender(appLastPassRateChartData.value);
  };

  const onSetPassRateTrendChart = async (startTime: any, endTime: any) => {
    passRateTrendChartData.value = [];
    let params = {
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

  const onSetAppLastReplayList = async (startTime: any, endTime: any) => {
    appLastReplayList.value = [];
    let params = {
      startTime: startTime,
      endTime: endTime
    };
    queryAllAppResults(params).then((res: any) => {
      if (res && res.caseResults && res.caseResults.length > 0) {
        appLastReplayList.value = res.caseResults.map((item: any) => {
          item.date = moment(item.createTime).format("YYYY-MM-DD");
          return item;
        });
        onSetAppProportionChart();
        onSetAppLastPassRateChart();
      }
    }).catch((err: any) => console.error(err))
  };

  const onSetSystem = (params: any = {}) => {
    let now = new Date();
    let oneDayAgo = moment(now).add(-0, "days");
    let endTime = oneDayAgo.endOf("day").valueOf();
    let startTime = 0;
    if (params.value === 'seven-days') {
      let sevenDaysAgo = moment(now).add(-7, "days");
      startTime = sevenDaysAgo.startOf("day").valueOf();
    } else if (params.value === 'one-month') {
      let thirtyDaysAgo = moment(now).add(-30, "days");
      startTime = thirtyDaysAgo.startOf("day").valueOf();
    }
    onSetAppLastReplayList(startTime, endTime);
    onSetPassRateTrendChart(startTime, endTime);
  };

  onSetBasicStatistic();

  return {
    applicationSumBasicStatistic,
    operationSumBasicStatistic,
    replaySumStatistic,
    detailAppProportionChartRef,
    detailAppLastPassRateChartRef,
    detailPassRateTrendChartRef,
    onSetSystem
  }
}
