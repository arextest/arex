<template>
  <div>
    <div id="analysisDiffContent">
      <a-row>
        <a-col span="3" class="scene-list">
          <a-list :data-source="scenes">
            <template #renderItem="{ item,index }">
              <a-list-item v-if="sceneSelectedIndex===index" class="scene-item-select">
                {{ $t("scene") }} {{ (index + 1) }}
              </a-list-item>
              <a-list-item v-else class="scene-item-normal" @click="onClickScene(item,index)">
                {{ $t("scene") }} {{ (index + 1) }}
              </a-list-item>
            </template>
          </a-list>
        </a-col>
        <a-col span="21">
          <NewMsgWithDiffJsonEditor
              :planItem="planItem" :compareResultId="compareResultId" :query-msg="queryMsg"
              @onShowFullMessageExternal="onShowFullMessage(props.scenes[0].compareResultId)"
          ></NewMsgWithDiffJsonEditor>
        </a-col>
      </a-row>
    </div>
    <component is="full-message" ref="fullMessageRef"/>
  </div>
</template>

<script>
import {useAnalysisDiff} from "@/modules/analysis";
import AnalysisDiffMsgShow from "@/view/analysis/diff/AnalysisDiffMsgShow.vue";
import FullMessage from "@/view/analysis/diff/FullMessage.vue";
import NewMsgWithDiffJsonEditor from './NewMsgWithDiffJsonEditor.vue'

export default {
  name: "AnalysisDiff",
  components: {FullMessage, AnalysisDiffMsgShow,NewMsgWithDiffJsonEditor},
  setup: useAnalysisDiff,
  props: {
    scenes: {
      type: Object,
      default: () => []
    },
    analysis: {
      type: Object,
      default: {}
    },
    planItem: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style scoped lang="less">
.diff-title {
  margin-bottom: 20px;
}

.diff-title .diff-title-right-button {
  flex: 1;
  text-align: right;
}

.diff-title-name {
  font-size: 20px;
  color: black;
  font-weight: 500;
  line-height: 22px;
  margin-right: 10px;
}

.diff-title-remark {
  font-size: 14px;
  color: #9C9C9C;
  line-height: 24px;
}

.diff-content-height {
  max-height: 600px;
  overflow-y: scroll;
}

.scene-list {
  width: 200px;
  .diff-content-height
}

.scene-item-normal {
  background: #f4f4f4;
  .scene-item
}

.scene-item-select {
  background: #eaf2f9;
  border: 1px solid #75BCF7;
  .scene-item
}

.scene-item {
  border-radius: 3px 3px 3px 3px;
  height: 44px;
  padding-left: 30px;
  cursor: pointer;
}

.diff-divider {
  border-radius: 0 0;
  height: 100%;
  width: 2px;
}

.msg-content {
  .diff-content-height
}

.msg-title {
  color: #000000;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
  height: 24px;
  line-height: 24px;
  width: 93px;
}

.msg-title-extra {
  float: right;
  margin-right: 20px
}

.msg-operation-button {
  color: slategray;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: normal;
  height: 22px;
  line-height: 22px;
  width: 42px;
  cursor: pointer;
  border: 1px solid var(--color-line);
  padding: 3px 3px;
  margin-right: 5px;
}

</style>
