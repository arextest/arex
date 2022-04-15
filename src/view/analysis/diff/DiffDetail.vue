<template>
  <a-card>
    <div class="diff-detail">
      <div class="title-wrap">
        <div class="page-title analysis-header-api-name">
          {{ $t('diffDetail') }}
        </div>
        <div>
          {{ $t('justLookAtFailure') }}：
          <a-switch v-model:checked="readFailOnly"/>
        </div>
      </div>
      {{ indexTab }}
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="(itemTab,indexTab) of tabs" :key="indexTab">
          <template #tab>
            <div>
              {{ itemTab.code + ' ' + $t('failure') + ':' }}
              <span
                  style="color: red">{{ computedCompareResults.filter(computedCompareResultsItem => computedCompareResultsItem.categoryType === itemTab.value && computedCompareResultsItem.diffResultCode !== 0).length }}</span>
            </div>
          </template>
          <div v-for="(item,index) of computedCompareResults.filter(i=>i.categoryType ===itemTab.value)" :key="index"
               class="compare-result-row">
            <div class="left" style="flex: 1">
              <div class="diff">
                <close-circle-outlined class="diff-icon" v-show="item.diffResultCode!==0"/>
                <check-circle-outlined class="diff-icon" style="color: #00BB74" v-show="item.diffResultCode===0"/>
                <div class="diff-title">
                  {{ $t('benchmark') }}: {{ item.operationName }}
                </div>
              </div>
              <JsonViewer :value="jsonParse(item.baseMsg)" copyable boxed sort theme="light"/>
            </div>
            <div style="width: 10px"></div>
            <div class="right" style="flex: 1">
              <div class="diff">
                <close-circle-outlined class="diff-icon" v-show="item.diffResultCode!==0"/>
                <check-circle-outlined class="diff-icon" style="color: #00BB74" v-show="item.diffResultCode===0"/>
                <div class="diff-title">
                  {{ $t('test') }}: {{ item.operationName }}
                </div>
              </div>
              <JsonViewer v-if="item.diffResultCode !== 2" :value="jsonParse(item.testMsg)" copyable boxed sort
                          theme="light"/>
              <p v-else style="border: 1px solid #eee;padding: 14px;border-radius: 8px">{{item.logs.map(item=>item.logInfo).join('\n')}}</p>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>

</template>
<script lang="ts">
import {computed, onMounted, ref} from "vue";
import {queryFullLinkMsg} from "../../../request/analysis";
import {useRoute} from "vue-router";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@/common/icon";

export default {
  components: {CheckCircleOutlined, CloseCircleOutlined},
  setup() {
    const route = useRoute()
    const categoryTypeMap = [
      {
        code: "MAIN_SERVICE",
        value: 0
      },
      {
        code: "SOA",
        value: 1
      },
      {
        code: "QMQ",
        value: 2
      },
      {
        code: "DB",
        value: 3
      },
      {
        code: "REDIS",
        value: 4
      },
      {
        code: "DYNAMIC",
        value: 5
      },
      {
        code: "HTTP",
        value: 6
      },
      {
        code: "ABT",
        value: 7
      },
      {
        code: "Q_CONFIG",
        value: 8
      },
      {
        code: "UNDEFINE",
        value: 9
      },
      {
        code: "MAIN_QMQ",
        value: 10
      },
      {
        code: "INVALID_CASE",
        value: 11
      }]
    const compareResults = ref<any>([])
    const readFailOnly = ref<Boolean>(false)
    const tabs = ref<any>([])

    // 初始化函数
    function init() {
      queryFullLinkMsg({recordId: route.query['recordId']}).then((res: any) => {
        compareResults.value = res.compareResults
        // 生成tabs数据 [{code,value}]
        tabs.value = [...new Set(res.compareResults.map((item: any) => item.categoryType))].map((item: any) => {
          if (categoryTypeMap[item]) {
            return categoryTypeMap[item]
          } else {
            return {
              code: item,
              value: item
            }
          }
        })
      })
    }

    onMounted(() => {
      init()
    })
    const computedCompareResults = computed(() => {
      // 根据"只看失败"的开关过滤数据
      if (readFailOnly.value) {
        return compareResults.value.filter((item: any) => item.diffResultCode !== 0)
      } else {
        return compareResults.value
      }
    })
    return {
      activeKey: ref(0),
      computedCompareResults,
      tabs,
      readFailOnly,
      jsonParse: function (str: any) {
        let json = {}
        try {
          json = JSON.parse(str)
        } catch (e) {
          json = {'0': str}
        }
        return json
      }
    }
  }
}
</script>

<style lang="less">
.diff-detail {
  background-color: white;

  .title-wrap {
    display: flex;
    align-items: center
  }

  .compare-result-row {
    display: flex;
  }

  .diff {
    display: flex;
    align-items: center;
    margin: 14px 0
  }

  .diff-icon {
    margin-right: 10px;
    color: red;
    font-size: 25px
  }

  .diff-title {
    font-weight: bolder;
    font-size: 14px
  }
}
</style>
