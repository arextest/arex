<template>
  <div id="MsgWithDiffJsonEditorWrapper">
    <div id="containerLeft" ref="containerLeftRef"></div>
    <div id="containerRight" ref=containerRightRef></div>
    <ListKeyModal
        :out-params="listKeyModalOutParams"
        :visible="listKeyModalVisible"
        @changeVisible="fun"></ListKeyModal>
  </div>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import JSONEditor from 'jsoneditor'
import {useI18n} from "vue-i18n";
import ListKeyModal from './ListKeyModal.vue'

export default {
  components:{
    ListKeyModal
  },
  props:{
    queryMsg: {
      type: Object,
      default: () => { return {}; }
    },
    compareResultId:{
      type: String,
      default: ''
    },
  },
  setup(props){
    const getRightSearch = () => document.querySelector('#MsgWithDiffJsonEditorWrapper #containerRight > div > div.jsoneditor-menu > div > div.jsoneditor-frame > input[type=text]')
    const containerLeftRef = ref(null)
    const containerRightRef = ref(null)
    const { t } = useI18n();
    const listKeyModalVisible = ref(false)
    const listKeyModalOutParams = ref({
      "id": "",
      "listPath": "",
      "useTestMsg": false
    })

    function jsonParse(str) {
      let json = {}
      try {
        json = JSON.parse(str)
      } catch (e) {
        json = {'0':str}
      }
      return json
    }

    function fun(val) {
      console.log(val)
      listKeyModalVisible.value = val.visible
    }

    watch(()=>props.queryMsg,()=>{
      // 获取左右数据
      const leftData = jsonParse(props.queryMsg.baseMsg)
      const rightData = jsonParse(props.queryMsg.testMsg)
      // 获取差异点
      const logs = props.queryMsg.logs

      let containerLeft = containerLeftRef.value
      let containerRight = containerRightRef.value
      containerLeft.innerHTML = ''
      containerRight.innerHTML = ''

      function onClassName({ path, field, value }) {
        const allDiff = []
        for (let j = 0; j < logs.length; j++) {
          let leftArr = []
          for (let i = 0; i < logs[j].pathPair.leftUnmatchedPath.length; i++) {
            leftArr.push(logs[j].pathPair.leftUnmatchedPath[i].nodeName?logs[j].pathPair.leftUnmatchedPath[i].nodeName:logs[j].pathPair.leftUnmatchedPath[i].index)
          }
          allDiff.push(JSON.stringify(leftArr))
          let rightArr = []
          for (let i = 0; i < logs[j].pathPair.rightUnmatchedPath.length; i++) {
            rightArr.push(logs[j].pathPair.rightUnmatchedPath[i].nodeName?logs[j].pathPair.rightUnmatchedPath[i].nodeName:logs[j].pathPair.rightUnmatchedPath[i].index)
          }
          allDiff.push(JSON.stringify(rightArr))
        }
        if (allDiff.includes(JSON.stringify(path))){
          return 'different_element'
        } else {
          return 'the_same_element'
        }
        // const leftValue = _.get(jsonRight, path)
        // const rightValue = _.get(jsonLeft, path)
        // return _.isEqual(leftValue, rightValue)
        //     ? 'the_same_element'
        //     : 'different_element'
      }
      const optionsLeft = {
        mode: 'tree',
        onEditable:function (node) {
          return false;
        },
        onCreateMenu: function (items, node) {
          return [{
            className: "jsoneditor-append",
            click: function (e) {
              console.log(e)
            },
            text: t('omission'),
            title: t('omission')
          },
          {
            className: "jsoneditor-extract",
            click: function (e) {
              console.log(node,'node')
              listKeyModalOutParams.value = {
                "id": props.compareResultId,
                "listPath": node.path.join('\\'),
                "useTestMsg": false
              }
              listKeyModalVisible.value = true
            },
            text: t('listKey'),
            title: t('listKey')
          }]
        },
        onClassName: onClassName,
        onChangeJSON: function (j) {
          jsonLeft = j
          window.editorRight.refresh()
        },
        onEvent: function(node, event) {
          if (event.type === 'click'){
            function controlRightSearch(value) {
              if (getRightSearch()){
                getRightSearch().value = value
                getRightSearch().oninput()
              }
            }
            if (node.value){
              controlRightSearch(node.value)
            } else {
              controlRightSearch(node.path[node.path.length - 1])
            }
          }
        }
      }
      const optionsRight = {
        mode: 'tree',
        onEditable:function (node) {
          return false;
        },
        onClassName: onClassName,
        onChangeJSON: function (j) {
          jsonRight = j
          window.editorLeft.refresh()
        }
      }
      let jsonLeft = leftData
      let jsonRight = rightData
      window.editorLeft = new JSONEditor(containerLeft, optionsLeft, jsonLeft)
      window.editorLeft.expandAll()
      if (props.queryMsg.diffResultCode === 2){
        containerRight.innerHTML = `<p style="border: 1px solid #999;height: 500px;padding: 14px">${props.queryMsg.logs.map(item=>item.logInfo).join('<br/>')}</p>`
      } else {
        window.editorRight = new JSONEditor(containerRight, optionsRight, jsonRight)
        window.editorRight.expandAll()
      }
      if (getRightSearch()){
        getRightSearch().disabled = true
      }

    },{immediate:false})
    onMounted(()=>{
    })
    return {
      containerLeftRef,
      containerRightRef,
      props,
      listKeyModalVisible,
      fun,
      listKeyModalOutParams
    }
  }
}
</script>

<style lang="less">
#MsgWithDiffJsonEditorWrapper{
  display: flex;
  height: calc(100vh - 240px);
  //background-color: red;
  #containerLeft {
    height: 100%;
    width: 50%;
  }

  #containerRight {
    height: 100%;
    width: 50%;
  }
  #containerRight .different_element {
    background-color: pink;
  }
  #containerRight .different_element div.jsoneditor-field,
  #containerRight .different_element div.jsoneditor-value {
    color: red;
  }

  #containerLeft .different_element {
    background-color: pink;
  }
  #containerLeft .different_element div.jsoneditor-field,
  #containerLeft .different_element div.jsoneditor-value {
    color: red;
  }

  /*隐藏元素*/
  button.jsoneditor-button.jsoneditor-contextmenu-button{
    //display: none;
  }
  .jsoneditor-menu>button{
    display: none;
  }
  /*隐藏搜索框*/
  #containerRight > div > div.jsoneditor-menu > div > div.jsoneditor-frame > button.jsoneditor-refresh{
    display: none;
  }
  #containerRight > div > div.jsoneditor-menu > div > div.jsoneditor-frame > input[type=text]{
    cursor: not-allowed;
  }
}

.jsoneditor.jsoneditor-mode-tree{
  overflow-y: scroll;
}

.jsoneditor.jsoneditor-mode-tree{
  border-color: var(--color-line);
}
div.jsoneditor-value.jsoneditor-string{
  color: #000000;
}
div.jsoneditor-value.jsoneditor-number{
  color: #000000;
}
div.jsoneditor-value.jsoneditor-boolean{
  color: #000000;
}
div.jsoneditor-value.jsoneditor-null{
  color: #000000;
}

</style>
