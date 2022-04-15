<template>
  <div class="msg-body" :id="position+'MsgBody'">
    <!--sourceType=0:以文本展示-->
    <div v-if="sourceType!==1">
      <div v-if="msgJsonResult==null||msgJsonResult===undefined||msgJsonResult.length===0">
        <a-empty class="msg-empty-icon"/>
      </div>
      <div v-else>
        <pre class="json-string-format">{{JSON.parse(msgJsonResult)}}</pre>
      </div>
    </div>
    <!--sourceType=1:按行展示-->
    <div v-else>
      <!--div方式：两列分别遍历，便于分别设置overflow-x-->
      <div v-for="(item) in showRowLines" class="div-flex"
           :key="item.idIndex" :title="item.path" :id="sceneSelectedIndex+position+item.rowNum"
           :class="[{'diff-line':(item.type!==0&&(item.ig===undefined||item.ig===null||item.ig===false))},{'ig-line':(item.type!==0&&item.ig===true)}]">
        <div class="row-number"><span>{{item.rowNum+1}}</span></div>
        <div class="caret-outlined">
          <caret-right-outlined v-if="item.expanded===2" @click="onUnfoldJson($event,item.idIndex)"/>
          <caret-down-outlined v-if="item.expanded===1" @click="onPackUpJson($event,item.idIndex)"/>
        </div>
        <div class="row-content">
          <div v-for="index of item.lv" :key="index">
            <!--新增忽略-->
            <span v-if="index===item.lv&&item.type!==0" class="ig-icon">
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click.prevent><menu-unfold-outlined/></a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item-group>
                      <div class="ig-path" slot="title">{{item.path}}</div>
                      <a-menu-divider/>
                      <a-menu-item>
                        <a-popconfirm :title='$t("makeSureNewOmission")' :ok-text='$t("confirm")'
                                      :cancel-text='$t("cancel")'
                                      @confirm="onAddIgnore(item.path)">{{$t("newOmission")}}</a-popconfirm>
                      </a-menu-item>
                    </a-menu-item-group>
                  </a-menu>
                </template>
              </a-dropdown>
            </span>
            <span v-else class="row-start">&nbsp;</span>
          </div>
          <div class="row-text">
            <!--行内容的key-->
            <div v-if="item.tag !== 4 || item.expanded!==2" class="row-key">{{item.rowKey}}</div>
            <div v-if="item.rowColon">:</div>
            <div v-if="item.expanded!==2" class="row-value">
              <span v-if="item.rowValue==null||item.rowValue===undefined||item.rowValue.length<100">
               {{item.rowValue}}
              </span>
              <span v-else>
                <!--行内容超长时，给出省略显示及查看“更多”的按钮-->
                <span>{{item.rowValue.substring(0,100)+"..."}}</span>
                <a-popover :title='$t("nodePath")+item.path'>
                  <template #content>
                    <a-row><div class="row-value-full">{{item.rowValue}}</div></a-row>
                  </template>
                  <span class="row-value-more-button">{{$t("more")}}</span>
                </a-popover>
            </span>
            </div>
            <div v-if="item.expanded===2">
              <span v-if="item.tag === 5">
                [<column-width-outlined color="white" class="column-width-outline"/>]</span>
              <span v-else>{<column-width-outlined color="white" class="column-width-outline"/>}</span>
            </div>
          </div>
          <!--查看原始字符串originalVal-->
          <a-popover :title='$t("originalValue")' v-if="item.val!==undefined&&item.val!==null&&item.val!==''">
            <template #content><p class="row-value-full">{{item.val}}</p></template>
            <info-circle-two-tone theme="twoTone"/>
          </a-popover>
          <!--reference-->
          <a-popover title="Reference Keys" v-if="item.key&&item.rowKey">
            <template #content><p class="row-value-full">{{onFormatRefKeys(item.key)}}</p></template>
            <a-tag class="ig-icon">ref_key</a-tag>
          </a-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    CaretRightOutlined,
    CaretDownOutlined,
    MenuUnfoldOutlined,
    InfoCircleTwoTone,
    ColumnWidthOutlined
  } from "@/common/icon";
  import {useAnalysisDiffMsgShow} from "@/modules/analysis";

  export default {
    name: "AnalysisDiffMsgShow",
    components: {
      CaretRightOutlined, CaretDownOutlined, MenuUnfoldOutlined, InfoCircleTwoTone, ColumnWidthOutlined
    },
    setup: useAnalysisDiffMsgShow,
    props: {
      operationId: {
        type: String,
        default: ''
      },
      sourceType: {
        type: Number,
        default: 0
      },
      msgJsonResult: {
        type: String,
        default: ''
      },
      msgLineList: {
        type: Array,
        default: []
      },
      position: {
        type: String,
        default: ""
      },
      sceneSelectedIndex: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style scoped lang="less">
  .msg-body {
    margin-top: 20px;
    overflow-x: scroll;
  }

  .msg-empty-icon {
    margin-top: 75px
  }

  .ig-line {
    background: yellow;
  }

  .ig-icon {
    font-size: 11px;
    vertical-align: middle;
    color: dodgerblue;
    font-weight: bold
  }

  .ig-path {
    color: #00aff0
  }

  .diff-line {
    background-color: #f9c1c1;
  }

  .path-div {
    display: inline;
    position: absolute;
    visibility: hidden;
    margin-left: -40px;
  }

  .path-span {
    border-radius: 5px !important;
    background-color: #47d54b;
    color: #fff;
    border: none;
    padding-left: 2px;
    padding-right: 2px;
  }

  .column-width-outline {
    font-size: 12px;
    vertical-align: middle;
    background-color: rgba(41, 41, 43, 0.56);
    border-radius: 4px !important;
    margin-left: 2px;
    margin-right: 2px;
    border: black solid 1px;
  }

  .json-string-format {
    color: black;
    vertical-align: middle;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .caret-outlined {
    width: 1%;
    margin-right: 1%;
    text-align: right;
    color: black;
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    vertical-align: middle;
  }

  .row-number {
    width: 2%;
    margin-right: 1%;
    text-align: right;
    display: inline-block;
  }

  .row-content {
    width: 95%;
    padding-right: 20px;
    display: flex;
  }

  .row-start {
    padding-right: 7px
  }

  .row-text {
    color: black;
    vertical-align: middle;
    display: flex;
  }

  .row-key {
    color: black;
    font-weight: bold;
    margin-left: 2px;
    margin-right: 2px;
  }

  .row-value {
    color: gray;
    margin-left: 3px;
  }

  .row-value-full {
    max-height: 400px;
    padding-bottom: 20px;
    overflow-y: scroll;
    width: 500px;
    word-break: break-all;
    word-wrap: break-word
  }

  .row-value-more-button {
    color: blue;
    cursor: pointer
  }

  .row-value-red {
    color: #c13b3b;;
  }

  .div-flex {
    display: flex
  }
</style>
