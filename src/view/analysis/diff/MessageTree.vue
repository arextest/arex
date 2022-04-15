<template>
  <div class="MessageTree2" id="wrapper">
    <div id="containerLeft" ref="containerLeftRef"></div>
    <div id="containerRight" ref=containerRightRef></div>
  </div>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import JSONEditor from 'jsoneditor'
import _ from 'lodash-es'

export default {
  props:{
    jsonData: {
      type: Object,
      default: () => { return {}; }
    },
  },
  setup(props){
    const containerLeftRef = ref(null)
    const containerRightRef = ref(null)

    function jsonParse(str) {
      let json = {}
      try {
        json = JSON.parse(str)
      } catch (e) {
        json = {'0':str}
      }
      return json
    }

    watch(()=>props.jsonData,()=>{

      const leftData = jsonParse(props.jsonData.baseMsg)
      const rightData = jsonParse(props.jsonData.testMsg)

      let containerLeft = containerLeftRef.value
      let containerRight = containerRightRef.value
      containerLeft.innerHTML = ''
      containerRight.innerHTML = ''

      function onClassName({ path, field, value }) {
        const leftValue = _.get(jsonRight, path)
        const rightValue = _.get(jsonLeft, path)

        return _.isEqual(leftValue, rightValue)
          ? 'the_same_element'
          : 'different_element'
      }

      const optionsLeft = {
        mode: 'tree',
        onEditable:function (node) {
          return false;
        },
        onClassName: onClassName,
        onChangeJSON: function (j) {
          jsonLeft = j
          window.editorRight.refresh()
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
      window.editorRight = new JSONEditor(containerRight, optionsRight, jsonRight)

      const containerLeftInput = document.querySelector(".MessageTree2 #containerLeft > div > div.jsoneditor-menu > div > div.jsoneditor-frame > input[type=text]")
      const containerRightInput = document.querySelector(".MessageTree2 #containerRight > div > div.jsoneditor-menu > div > div.jsoneditor-frame > input[type=text]")

      if (props.jsonData.diffResultCode === 2){
        containerRight.innerHTML = `<p style="border: 1px solid #999;height: 500px;padding: 14px">${props.jsonData.logs}</p>`
      }
      containerRightInput.disabled = true
      containerLeftInput.addEventListener('input',function (val) {
        containerRightInput.value = containerLeftInput.value
        containerRightInput.onchange()
      })
    },{immediate:false})
    onMounted(()=>{
    })

    return {
      containerLeftRef,
      containerRightRef
    }
  }
}
</script>

<style lang="less">

.MessageTree2#wrapper {
  /*border: 1px solid salmon;*/
  background-color: #f5f5f5;
  width: 100%;
  display: flex;

  #containerLeft {
    /*display: inline-block;*/
    /*width: 500px;*/
    //flex: 1;
    height: 500px;
    width: 50%;
    //margin-right: 10px;
  }

  #containerRight {
    /*display: inline-block;*/
    /*width: 500px;*/
    //flex: 1;
    width: 50%;
    height: 500px;
  }
  #containerRight .different_element {
    /*background-color: #acee61;*/
  }
  #containerRight .different_element div.jsoneditor-field,
  #containerRight .different_element div.jsoneditor-value {
    /*color: red;*/
  }

  #containerLeft .different_element {
    /*background-color: pink;*/
  }
  #containerLeft .different_element div.jsoneditor-field,
  #containerLeft .different_element div.jsoneditor-value {
    /*color: red;*/
  }


  /*隐藏元素*/
  button.jsoneditor-button.jsoneditor-contextmenu-button{
    display: none;
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
</style>
