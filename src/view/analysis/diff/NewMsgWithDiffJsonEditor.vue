<template>
  <div >
    <!--    图例-->
    <div style="display:flex;justify-content: space-between">
      <div class="MsgWithDiffLegend">
        <div>
          <div class="color-tag-green"></div>
          <span>{{$t('oneMoreNodeThan')}}</span>
        </div>
        <div>
          <div class="color-tag-pink"></div>
          <span>{{$t('sameNodeDifference')}}</span>
        </div>
        <div>
          <div class="color-tag-grey"></div>
          <span>{{$t('igNode')}}</span>
        </div>
      </div>
      <a-button style="margin-bottom: 10px" @click="onShowFullMessageExternal()">{{ $t("fullMsg") }}</a-button>
    </div>
    <!--    主对比界面-->
    <div id="MsgWithDiffJsonEditorWrapper">
      <div id="containerLeft" ref="containerLeftRef"></div>
      <div id="containerRight" ref=containerRightRef></div>
    </div>
    <!--    list key对话框-->
    <ListKeyModal
        v-if="props.planItem.appId"
        :visible="listKeyModalVisible"
        :outParams="listKeyModalOutParams"
        @changeVisible="changeVisible"
        :planItem="props.planItem"
        @isArr="listKeyModalIsArr"
    ></ListKeyModal>
  </div>
</template>
<script>
import {JSONEditor} from 'svelte-jsoneditor-plus/dist/jsoneditor.js'
import ListKeyModal from './ListKeyModal.vue'
import {computed, onMounted, ref, watch} from "vue";
import {comparisonModifyInsert, comparisonModifyRemove, comparisonUseResultAsList} from "@/request/analysis";
import {message} from "ant-design-vue";
import {useI18n} from "vue-i18n";

function listPathObserver(callback) {
  window.mainArea = document.querySelector("#containerLeft .jse-navigation-bar");
  MutationObserver = window.MutationObserver
  window.DocumentObserver = new MutationObserver(callback);
  window.DocumentObserverConfig = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };
  DocumentObserver.observe(mainArea, DocumentObserverConfig);
}

function listPathObserverRight(callback) {
  window.mainAreaRight = document.querySelector("#containerRight .jse-navigation-bar");
  MutationObserver = window.MutationObserver
  window.DocumentObserverRight = new MutationObserver(callback);
  window.DocumentObserverConfigRight = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };
  DocumentObserverRight.observe(mainAreaRight, DocumentObserverConfigRight);
}

export default {
  components:{
    ListKeyModal
  },
  props: {
    queryMsg: {
      type: Object,
      default: () => {
        return {};
      }
    },
    planItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    compareResultId: {
      type: String,
      default: ''
    },
  },
  setup(props,{emit}) {
    const {t} = useI18n();
    function genAllDiff(logs) {
      const allDiff = []
      for (let j = 0; j < logs.length; j++) {
        let leftArr = []
        for (let i = 0; i < logs[j].pathPair.leftUnmatchedPath.length; i++) {
          leftArr.push(logs[j].pathPair.leftUnmatchedPath[i].nodeName ? logs[j].pathPair.leftUnmatchedPath[i].nodeName : logs[j].pathPair.leftUnmatchedPath[i].index)
        }
        allDiff.push(leftArr)
        let rightArr = []
        for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
          rightArr.push(logs[j].pathPair.rightUnmatchedPath[i].nodeName ? logs[j].pathPair.rightUnmatchedPath[i].nodeName : logs[j].pathPair.rightUnmatchedPath[i].index)
        }
        allDiff.push(rightArr)
      }
      return allDiff
    }
    function genAllDiffByType(logs) {
      let allDiff = {
        diff012: [],
        diff3: [],
        diff012Ig:[],
        diff3Ig:[]
      }
      for (let j = 0; j < logs.length; j++) {
        let leftArr = []
        for (let i = 0; i < logs[j].pathPair.leftUnmatchedPath.length; i++) {
          leftArr.push(logs[j].pathPair.leftUnmatchedPath[i].nodeName ? logs[j].pathPair.leftUnmatchedPath[i].nodeName : logs[j].pathPair.leftUnmatchedPath[i].index)
        }
        let rightArr = []
        for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
          rightArr.push(logs[j].pathPair.rightUnmatchedPath[i].nodeName ? logs[j].pathPair.rightUnmatchedPath[i].nodeName : logs[j].pathPair.rightUnmatchedPath[i].index)
        }
        const unmatchedTypes = [0, 1, 2]

        if (logs[j].logTag.ig){
          if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
            allDiff.diff012Ig.push(leftArr.length > rightArr.length ? leftArr : rightArr)
          } else {
            allDiff.diff3Ig.push(leftArr)
            allDiff.diff3Ig.push(rightArr)
          }
        } else {
          if (unmatchedTypes.includes(logs[j].pathPair.unmatchedType)) {
            allDiff.diff012.push(leftArr.length > rightArr.length ? leftArr : rightArr)
          } else {
            allDiff.diff3.push(leftArr)
            allDiff.diff3.push(rightArr)
          }
        }
      }
      return allDiff
    }
    function isContained(aa,bb){
      if(!(aa instanceof Array)||!(bb instanceof Array)||((aa.length < bb.length))){undefined
        return false;
      }
      var aaStr = aa.toString();
      for (var i = 0 ;i < bb.length;i++) {undefined
        if(aaStr.indexOf(bb[i]) < 0) return false;
      }
      return true;
    }
    function isContaineds(aa,bbs) {
      for (let i = 0; i < bbs.length; i++) {
        if (isContained(aa,bbs[i])){
          return true
        }
      }
      return false
    }
    function isContainedInAllDiff(arr, p) {
      const arrJoin = arr.map(item=>item.join('.'))
      const pJoin = p.join('.')
      for (let i = 0; i < arrJoin.length; i++) {
        if (arrJoin[i].match(pJoin)){
          return true
        }
      }
      return false
    }
    function getElementByAttr(tag, dataAttr) {
      let aElements = document.getElementsByTagName(tag);
      let aEle = [];
      for (let i = 0; i < aElements.length; i++) {
        let ele = aElements[i].getAttribute(dataAttr);
        if (ele) {
          aEle.push(aElements[i]);
        }
      }
      return aEle;
    }
    function jsonParse(str) {
      let json = {}
      try {
        json = JSON.parse(str)
      } catch (e) {
        json = {'0': str}
      }
      return json
    }
    window.sjeIgnoreText = t('omission')
    window.sjeListKeyText = t('listKey')
    window.sjeIgnore = function () {
      const matchRules = igDetailsList.value.filter(item=> {
        return JSON.stringify(item.pathValue[0].split('/')) === JSON.stringify(listPath.value.split('/'))
      })
      if (matchRules.length > 0){
        Promise.all(matchRules.map(item=>{
          comparisonModifyRemove({
            "id": comparisonUseResult.id,
            "appId": props.planItem.appId,
            "operationId": props.planItem.operationId,
            "categoryType": 0,
            "detailsList": [
              {
                "id": item.id
              }
            ]
          })
        })).then(res=>{

          // "cancelIgnore": "取消忽略",
          //     "cancelRuleSucceeded": "取消规则功能"
          message.success(t('cancelRuleSucceeded'))
          renderEditor()
        })
      } else {
        comparisonModifyInsert({
          "appId": props.planItem.appId,
          "operationId": props.planItem.operationId,
          "categoryType": 0,
          "detailsList": [
            {
              "pathName": "",
              "pathValue": [
                listPath.value
              ]
            }
          ]
        }).then(res=>{
          if (res){
            message.success(t('addIgnoredNodeSuccess',{ listPath: listPath.value }))
            renderEditor()
          }
        })
      }
    }
    window.sjeListKey = function () {
      listKeyModalVisible.value = true
    }
    const containerLeftRef = ref(null)
    const containerRightRef = ref(null)
    const listKeyModalOutParams = ref({})
    const listKeyModalVisible = ref(false)
    const listPath = ref('')
    const igDetailsList = ref([])
    const comparisonUseResult = ref({})
    const listKeyModalArr = ref(true)
    function listKeyModalIsArr(val) {
      listKeyModalArr.value = val
      if (!val){
        if (document.querySelector("#containerLeft > div.absolute-popup > div > div > div:nth-child(2)")){
          document.querySelector("#containerLeft > div.absolute-popup > div > div > div:nth-child(2)").style.display = 'none'
        }
      }
    }
    function renderEditor(){
      comparisonUseResultAsList({appId:props.planItem.appId}).then((res)=>{
        comparisonUseResult.value = res[0]
        igDetailsList.value = res[0].detailsList.filter(item=>item.pathName === '')
        // 获取左右数据
        const leftData = jsonParse(props.queryMsg.baseMsg)
        const rightData = jsonParse(props.queryMsg.testMsg)
        // 获取差异点
        const logs = props.queryMsg.logs
        let containerLeft = containerLeftRef.value
        let containerRight = containerRightRef.value
        containerLeft.innerHTML = ''
        containerRight.innerHTML = ''
        const allDiff = genAllDiff(logs)
        const allDiffByType = genAllDiffByType(logs)
        function onClassName(path) {
          return [
            [...allDiffByType.diff012Ig,...allDiffByType.diff3Ig].map(item => JSON.stringify(item)).includes(JSON.stringify(path)) ? 'different_element_ig' : '',
            isContaineds(path,igDetailsList.value.map(item=>{
              return item.pathValue[0].split('/')
            })) ? 'different_element_ig' : '',
            allDiffByType.diff012.map(item => JSON.stringify(item)).includes(JSON.stringify(path)) ? 'different_element_012' : '',
            allDiffByType.diff3.map(item => JSON.stringify(item)).includes(JSON.stringify(path)) ? 'different_element' : '',
          ]
        }
        window.editor = new JSONEditor({
          target: containerLeft,
          props: {
            content: {
              text: undefined,
              json: leftData
            },
            onClassName: onClassName,
            // readOnly: true,
            mainMenuBar: false
          }
        })

        window.rightEditor = new JSONEditor({
          target: containerRight,
          props: {
            content: {
              text: undefined,
              json: rightData
            },
            onClassName: onClassName,
            // readOnly: true,
            mainMenuBar: false
          }
        })

        let dataPathDivs = getElementByAttr('div', 'data-path');
        for (let i = 0; i < dataPathDivs.length; i++) {
          dataPathDivs[i].onclick = function (event) {
            let scrollToPath = []
            let navBarItems = document.getElementsByClassName('jse-navigation-bar-item')
            for (let j = 0; j < navBarItems.length; j++) {
              let buttonValue = navBarItems[j].getElementsByTagName('button')[1]?.innerText
              if (buttonValue) {
                if (!Number.isNaN(Number(buttonValue))) {
                  scrollToPath.push(Number(buttonValue))
                } else {
                  scrollToPath.push(buttonValue)
                }
              }
            }
            window.rightEditor.scrollTo(scrollToPath)
            window.editor.scrollTo(scrollToPath)
            event.stopPropagation();
          }
        }

        function callback(el) {
          const scrollToPath = []
          const navBarItems = document.querySelectorAll(`${el}`)
          for (let j = 0; j < navBarItems.length; j++) {
            let buttonValue = navBarItems[j].getElementsByTagName('button')[1]?.innerText
            if (buttonValue) {
              if (!Number.isNaN(Number(buttonValue))) {
              } else {
                scrollToPath.push(buttonValue)
              }
            }
          }
          listPath.value = scrollToPath.join('/')
          listKeyModalOutParams.value = {
            "id": props.compareResultId,
            "listPath": listPath.value.replace(/\//g,'\\'),
            "useTestMsg": false
          }
        }

        function callbackLeft() {
          callback('#containerLeft .jse-navigation-bar-item')
        }
        function callbackRight() {
          callback('#containerRight .jse-navigation-bar-item')
        }
        listPathObserver(callbackLeft)
        listPathObserverRight(callbackRight)
        setTimeout(() => {
          const isExpand = path => {
            if (isContainedInAllDiff(allDiff, path)) {
              return true
            } else {
              return false
            }
          }
          window.editor.expand(isExpand)
          window.rightEditor.expand(isExpand)
          const leftArr = []
          for (let i = 0; i < logs[0].pathPair.leftUnmatchedPath.length; i++) {
            leftArr.push(logs[0].pathPair.leftUnmatchedPath[i].nodeName ? logs[0].pathPair.leftUnmatchedPath[i].nodeName : logs[0].pathPair.leftUnmatchedPath[i].index)
          }
          const rightArr = []
          for (let i = 0; i < logs[0].pathPair.rightUnmatchedPath.length; i++) {
            rightArr.push(logs[0].pathPair.rightUnmatchedPath[i].nodeName ? logs[0].pathPair.rightUnmatchedPath[i].nodeName : logs[0].pathPair.rightUnmatchedPath[i].index)
          }
          window.rightEditor.scrollTo(leftArr)
          window.editor.scrollTo(rightArr)

          const container = document.querySelector('.json-node')
          container.addEventListener('contextmenu', function (e) {
            if (e.button === 2){
              setTimeout(()=>{
                for (let i = 0; i < igDetailsList.value.length; i++) {
                  if (JSON.stringify(igDetailsList.value[i].pathValue[0].split('/')) === JSON.stringify(listPath.value.split('/'))){
                    document.querySelector("#containerLeft > div.absolute-popup > div > div > div:nth-child(1) > button").innerHTML = document.querySelector("#containerLeft > div.absolute-popup > div > div > div:nth-child(1) > button").innerHTML.split(t('omission'))[0] + t('cancelIgnore')
                  }
                }
              },0)
            }
          })
        }, 100)
      })
    }
    function onShowFullMessageExternal() {
      emit('onShowFullMessageExternal',{})
    }
    watch(() => props.queryMsg, () => {
      renderEditor()
    }, {immediate: false})
    return {
      containerLeftRef,
      containerRightRef,
      props,
      listKeyModalOutParams,
      listKeyModalVisible,
      listPath,
      changeVisible:function (val) {
        listKeyModalVisible.value = val.visible
      },
      listKeyModalIsArr,
      onShowFullMessageExternal
    }
  }
}
</script>


<style lang="less">
#MsgWithDiffJsonEditorWrapper {
  display: flex;
  height: calc(100vh - 240px);

  #containerLeft {
    height: 100%;
    width: 50%;
    margin-right: 14px;
  }

  #containerRight {
    height: 100%;
    width: 50%;
  }

  #containerRight .different_element {
    background-color: pink;
  }

  #containerLeft .different_element {
    background-color: pink;
  }

  #containerRight .different_element_012 {
    background-color: #00BB74;
  }

  #containerLeft .different_element_012 {
    background-color: #00BB74;
  }

  #containerLeft .different_element_ig{
    background-color: rgb(191, 191, 191);
  }

  #containerRight .different_element_ig{
    background-color: rgb(191, 191, 191);
  }

  .jsoneditor-main {
    border: 1px solid #eee;

    .value {
      color: #1a1a1a;
    }
  }
}

div.jsoneditor-value.jsoneditor-string {
  color: #000000;
}

div.jsoneditor-value.jsoneditor-number {
  color: #000000;
}

div.jsoneditor-value.jsoneditor-boolean {
  color: #000000;
}

div.jsoneditor-value.jsoneditor-null {
  color: #000000;
}

.MsgWithDiffLegend{
  display: flex;
  margin: 10px 0 0 10px;
}

.MsgWithDiffLegend > div{
  display: flex;
  margin-right: 14px;
}

.MsgWithDiffLegend>div> .color-tag-pink{
  width: 20px;
  height: 20px;
  background-color: pink;
  margin-right: 8px;
}

.MsgWithDiffLegend>div> .color-tag-green{
  width: 20px;
  height: 20px;
  background-color: #00BB74;
  margin-right: 8px;
}

.MsgWithDiffLegend>div> .color-tag-grey{
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.25);
  margin-right: 8px;
}

.jsoneditor-contextmenu > div:nth-child(2){
}


.insert-area{
  display: none !important;
}

.context-menu-button-anchor{
  display: none;
}
.jse-navigation-bar{
  height: 32px !important;
}
.jsoneditor-contextmenu .row{
  width: 150px;
  padding: 4px 0;

}
.jsoneditor-contextmenu .row button{
  text-align: left;
}
</style>
