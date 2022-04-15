import {ref, watch} from "vue";
import * as echarts from "echarts";
import {unWrap} from "@/common/utils";
import {useGetters} from "vuex-composition-helpers";
import {Style} from "@/common/constant";

export default () => {
  const { screenWidth } = useGetters([Style.SCREEN_WIDTH])
  const chart = ref();
  const eChart: any = echarts;

  watch(screenWidth, () => chart.value.resize());

  const onRender = (caseItems: any) => {
    let data = [];
    for (let i = 1; i < caseItems.length; i++) {
      data.push({ name: caseItems[i].label, value: caseItems[i].value < 0 ? 0 : caseItems[i].value });
    }
    chart.value = eChart.init(document.getElementById("detail-replay-chart"), 'roma');
    unWrap(chart.value).setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        top: "middle",
        right: "65%"
      },
      color: ["rgb(145, 204, 117)", "rgb(238, 102, 102)", "rgb(250, 200, 88)", "rgb(115, 192, 222)"],
      series: [
        {
          name: "Cases",
          type: 'pie',
          radius: '78%',
          center: ["65%", "50%"],
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }

  return {
    onRender
  }
}
