import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {unWrap} from "@/common/utils";
import * as echarts from "echarts";

export default () => {
  const {t} = useI18n();
  const chart = ref();
  const eChart: any = echarts;
  const onRender = (data: any) => {
    chart.value = eChart.init(document.getElementById("detail-pass-rate-trend-chart"), 'roma');
    unWrap(chart.value).setOption({
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: "5%", right: "5%", top: "16%"
      },
      xAxis: {
        name: t('date'),
        data: data.map((item: any) => item.name)
      },
      yAxis: {
        name: '%'
      },
      dataZoom: [
        {
          startValue: '2014-06-01'
        },
        {
          type: 'inside'
        }
      ],
      series: {
        name: t('casePassRateAvg'),
        type: 'line',
        data: data.map((item: any) => item.value)
      }
    });
    window.addEventListener("resize", () => {
      chart.value.resize();
    });
  };
  return {
    onRender
  }
}
