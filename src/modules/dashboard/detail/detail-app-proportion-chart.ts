import {ref} from "vue";
import {useI18n} from "vue-i18n";
import * as echarts from "echarts";
import {unWrap} from "@/common/utils";

export default () => {
  const {t} = useI18n();
  const chart = ref();
  const eChart: any = echarts;

  const onRender = (chartData: any) => {
    let graphicValue = "";
    let graphicTopMark = "";
    let data = [];
    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i].label === "graphicValue") {
        graphicValue = chartData[i].value;
      } else if (chartData[i].label === "graphicTopMark") {
        graphicTopMark = chartData[i].value;
      } else {
        data.push({name: chartData[i].label, value: chartData[i].value});
      }
    }
    chart.value = eChart.init(document.getElementById("detail-app-proportion-chart"), 'roma');
    unWrap(chart.value).setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
      },
      graphic: [{
        type: "text",
        left: "center",
        top: "70",
        style: {
          text: graphicTopMark,
          textAlign: "center",
          fill: "#9C9C9C",
          fontSize: 14
        }
      }, {
        type: "text",
        left: "center",
        top: "95",
        style: {
          text: graphicValue,
          textAlign: "center",
          fill: "#010101",
          fontSize: 30
        }
      }],
      color: ["#1890ff", "#13c2c2", "#8543e0", "#facc14", "#f04864", "#2fc25b"],
      series: [
        {
          type: 'pie',
          radius: ["50%", "65%"],
          center: ["50%", "35%"],
          label: {
            show: false
          },
          tooltip: {
            formatter: '{b}<br />' + t("appProportion") + ': {d}%<br />' + t("appCount") + ': {c}'
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          data
        }
      ]
    });
    window.addEventListener("resize", () => {
      chart.value.resize();
    });
  };

  return {
    onRender
  }
}
