import {ref, watch} from "vue";
import { queryMsgWithDiff} from "@/request/analysis";

export default (props: any) => {
  const msgDetailResult = ref({});
  const sceneSelectedIndex = ref(0);
  const fullMessageRef = ref();
  const queryMsg = ref({})
  const compareResultId = ref('')
  const onViewRecordBat = (recordId: any, sourceEnv: any) => {
    let url = onSetBatUrl(sourceEnv);
    window.open(url + recordId, "_blank")
  };
  const onDebug = (recordId: any, appId: any) => {
    let url = '#/soa?replayId=' + recordId + '&appId=' + appId;
    window.open(url, "_blank")
  };
  const onViewReplayBat = (replayId: any, targetEnv: any) => {
    let url = onSetBatUrl(targetEnv);
    window.open(url + replayId, "_blank")
  };
  const onViewReplayLog = (recordId: any, planId: any) => {
    let url = '#/replaylog?replayId=' + recordId + '&recordid=' + planId;
    window.open(url, "_blank")
  };
  const onClickScene = (scene: any, index: any) => {
    msgDetailResult.value = {};
    sceneSelectedIndex.value = index;

    if (scene) {
      compareResultId.value = scene.compareResultId
      let params = {
        compareResultId: scene.compareResultId,
        logIndexes: scene.logIndexes
      };
      queryMsgWithDiff(params).then(res=>{
        queryMsg.value = res
      })
    }
  };
  const onSetBatUrl = (env: any) => {
    if (env === null || env == undefined) {
      return 'http://bat.fws.qa.nt.ctripcorp.com/logview/';
    } else if (env.toString().startsWith('pro')) {
      return 'http://bat.fx.ctripcorp.com/logview/'
    } else if (env.toString().startsWith('uat')) {
      return 'http://bat.uat.qa.nt.ctripcorp.com/logview/';
    }
    return 'http://bat.fws.qa.nt.ctripcorp.com/logview/';
  };
  const onShowFullMessage = (compareResultId:any) => {
    fullMessageRef.value.onShowFullMessageModal(compareResultId);
  }

  watch(props, () => {
    onClickScene(props.scenes[0], 0);
  });

  return {
    msgDetailResult,
    sceneSelectedIndex,
    fullMessageRef,
    onViewRecordBat,
    onDebug,
    onViewReplayBat,
    onViewReplayLog,
    onClickScene,
    onShowFullMessage,
    props,
    queryMsg,
    compareResultId
  }
}
