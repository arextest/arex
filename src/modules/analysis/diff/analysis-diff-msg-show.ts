import {ref, watch, nextTick} from "vue";
import {Modal} from "ant-design-vue";
import {addIgnoreConfig} from "@/request/analysis";
import {useI18n} from "vue-i18n";

export default (props: any) => {
  const {t} = useI18n();
  const firstDIffRowNum = ref(-1);
  const showRowLines: any = ref([]);
  const showLineIndex = ref(0);
  const onProcessPath = (path: any) => {
    // 规则：[*]替换成 空, .替换成/
    let temp = path.replace(/\[\*\]/g, "");
    return "/" + temp.replace(/\./g, "/");
  };
  const onAddIgnore = (path: any) => {
    if (props.operationId === undefined || props.operationId === null || props.operationId === "" || props.operationId + "" === "-1" || props.operationId + "" === "0") {
      console.log("Illegal Argument Exception");
      return;
    }
    let longOperationId = parseFloat(props.operationId);
    if (props.operationId !== longOperationId + "") {
      console.log("operationId Conversion failure");
      return;
    }
    if (path === undefined || path === null || path === "") {
      Modal.error({content: "No ignore configuration is selected"});
      return;
    } else {
      let ignorePath = onProcessPath(path);
      // 请求
      const params = {
        taskid: longOperationId,
        configtype: 0,
        ignorelist: [ignorePath],
      };
      addIgnoreConfig(params).then((res: any) => {
        if (res == 1) {
          Modal.success({content: t("saveSuccess")});
        } else {
          Modal.error({content: t("saveFail")});
        }
      }).catch((err: any) => {
        console.error(err);
        Modal.error({content: err});
      });
    }
  };
  const onClearDiffInfo = () => {
    showRowLines.value = [];
    showLineIndex.value = 0;
    firstDIffRowNum.value = -1;
  };
  const onGetParentNode = (event: any, ancestorsFloor: any) => {
    if (event === undefined || event === null) {
      return null;
    }
    if (event.target === undefined || event.target === null) {
      return null;
    }

    let result = event.target;
    for (let i = 0; i < ancestorsFloor; i++) {
      if (result === undefined || result === null) {
        return null;
      }
      result = result.parentNode;
    }
    return result;
  };
  const onCreateFirstShowData = async () => {
    onClearDiffInfo();
    if (props.msgLineList.length > 0) {
      // 读取需要展示的原始数据在数组中的索引
      let showNumbers = [];
      for (let i = props.msgLineList.length - 1; i >= 0; i--) {
        if (props.msgLineList[i].type !== 0 && (props.msgLineList[i].ig === undefined || props.msgLineList[i].ig === null || props.msgLineList[i].ig === false)) {
          firstDIffRowNum.value = i;
        }
        if (i === props.msgLineList.length - 1 || i === 0) {
          showNumbers.unshift(i);
        } else if ((props.msgLineList[i].tag === 3 || props.msgLineList[i].tag === 4
          || props.msgLineList[i].tag === 5 || props.msgLineList[i].tag === 1) && props.msgLineList[i].lv === 1) {
          showNumbers.unshift(i);
        }
      }
      if (showNumbers.length > 0) {
        // 构造显示的数据
        for (let i = showNumbers.length - 1; i >= 0; i--) {
          let tempLine = props.msgLineList[showNumbers[i]];
          let currentData = onCreateOneDiffRowShowData(tempLine, true);
          if (currentData !== null) {
            showRowLines.value.unshift(currentData)
          }
        }
      }
      // 展开所有默认展开的对象或者数组
      for (let i = 0; i < showRowLines.value.length; i++) {
        if (showRowLines.value[i].expanded === 1) {
          onJsonExpend(i, true);
        }
      }
      if (firstDIffRowNum.value != -1) {
        await nextTick();
        let parentEleId = props.position + 'MsgBody';
        let parentEle = document.getElementById(parentEleId);
        let targetEleId = props.sceneSelectedIndex + props.position + firstDIffRowNum.value;
        let targetEle = document.getElementById(targetEleId);
        if (targetEle && parentEle) {
          parentEle.scrollTop = targetEle.offsetTop - parentEle.offsetTop;
        }
      }
    }
  };
  const onCreateOneDiffRowShowData = (oneRowData: any, init: any) => {
    let currentData = {
      rowNum: oneRowData.rowNum,
      fuzzyPath: oneRowData.fuzzyPath,
      type: oneRowData.type,
      tag: oneRowData.tag,
      ig: oneRowData.ig,
      key: oneRowData.key,
      row: oneRowData.row,
      rowKey: oneRowData.rowKey,
      rowColon: oneRowData.rowColon,
      val: oneRowData.val,
      ref: oneRowData.ref,
      rowValue: oneRowData.rowValue,
      path: oneRowData.path,
      lv: oneRowData.lv,
      expanded: init ? oneRowData.expanded : (oneRowData.expanded === 1 ? 2 : oneRowData.expanded),
      idIndex: showLineIndex.value,
      headExpend: false,
      startRow: oneRowData.tag === 3 || oneRowData.tag === 4 || oneRowData.tag === 5
    };
    showLineIndex.value++;
    if (currentData) {
      return currentData;
    } else {
      return null;
    }
  };
  const onJsonExpend = (clickIndex: any, init: any) => {
    let rowIndexList = onSetStartRowIndexAndEndRowIndex(clickIndex);
    if (rowIndexList[0] == -1 || rowIndexList[1] == -1) {
      return;
    }
    let startRowIndex = rowIndexList[0];
    let endRowIndex = rowIndexList[1];
    let currentIndex = showRowLines.value[clickIndex].rowNum;

    let needLevel = props.msgLineList[startRowIndex].lv + 1;
    for (let i = endRowIndex; i >= currentIndex + 1; i--) {
      let createRow = (needLevel === props.msgLineList[i].lv
        && (props.msgLineList[i].tag === 3
          || props.msgLineList[i].tag === 1 || props.msgLineList[i].tag === 4 || props.msgLineList[i].tag === 5 || props.msgLineList[i].tag === 6))
        || ((props.msgLineList[currentIndex].tag === 3 || props.msgLineList[currentIndex].tag === 5) && i === currentIndex + 1)
        || i === endRowIndex;
      if (createRow) {
        let currentData = onCreateOneDiffRowShowData(props.msgLineList[i], init);
        if (currentData !== null) {
          showRowLines.value.splice(clickIndex + 1, 0, currentData);
        }
      }
    }
    showRowLines.value[clickIndex].headExpend = true;
    showRowLines.value[clickIndex].expanded = 1;
  };
  const onPackUpJson = (event: any, id: any) => {
    event.stopPropagation();
    let haveAttrNode = onGetParentNode(event, 4);
    if (haveAttrNode === undefined || haveAttrNode === null) {
      return;
    }
    const idIndex = id;
    let clickIndex = onFindShowLineByIdIndex(idIndex);
    if (clickIndex !== -1 && showRowLines.value[clickIndex].headExpend) {
      let rowIndexList = onSetStartRowIndexAndEndRowIndex(clickIndex);
      if (rowIndexList[0] == -1 || rowIndexList[1] == -1) {
        return;
      }
      let endRowIndex = rowIndexList[1];

      let reduceCount = 0;
      for (let i = clickIndex + 1; i < showRowLines.value.length; i++) {
        if (showRowLines.value[i].rowNum > endRowIndex) {
          break;
        }
        reduceCount++;
      }
      if (reduceCount > 0) {
        showRowLines.value.splice(clickIndex + 1, reduceCount);
      }
      showRowLines.value[clickIndex].headExpend = false;
      showRowLines.value[clickIndex].expanded = 2;
    }
  };
  const onUnfoldJson = (event: any, id: any) => {
    event.stopPropagation();
    let haveAttrNode = onGetParentNode(event, 4);
    if (haveAttrNode === undefined || haveAttrNode === null) {
      return;
    }

    const idIndex = id;
    let clickIndex = onFindShowLineByIdIndex(idIndex);
    if (clickIndex !== -1 && !showRowLines.value[clickIndex].headExpend) {
      onJsonExpend(clickIndex, false);
    }
  };
  const onFindShowLineByIdIndex = (idIndex: any) => {
    let showLineIndex = -1;
    if (idIndex !== undefined && idIndex !== null && showRowLines.value.length > 0) {
      for (let i = 0; i < showRowLines.value.length; i++) {
        if (idIndex === showRowLines.value[i].idIndex) {
          showLineIndex = i;
          break;
        }
      }
    }
    return showLineIndex;
  };
  const onFormatRefKeys = (keys: any) => {
    return keys.split(',');
  };
  const onSetStartRowIndexAndEndRowIndex = (clickIndex: any) => {
    let currentIndex = showRowLines.value[clickIndex].rowNum;
    let startRowIndex = -1;
    if (props.msgLineList[currentIndex].tag === 3 || props.msgLineList[currentIndex].tag === 5) {
      startRowIndex = showRowLines.value[clickIndex].rowNum + 1;
    } else if (props.msgLineList[currentIndex].tag === 4) {
      startRowIndex = showRowLines.value[clickIndex].rowNum;
    } else {
      return [startRowIndex, -1];
    }
    let endRowIndex = -1;
    for (let i = startRowIndex + 1; i < props.msgLineList.length; i++) {
      if (props.msgLineList[i].tag === 2 && props.msgLineList[i].lv === props.msgLineList[startRowIndex].lv) {
        endRowIndex = i;
        break;
      }
    }
    return [startRowIndex, endRowIndex];
  };
  watch(props, () => {
    onCreateFirstShowData();
  });
  onCreateFirstShowData();

  return {
    showRowLines,
    showLineIndex,
    onAddIgnore,
    onPackUpJson,
    onUnfoldJson,
    onFormatRefKeys,
    onClearDiffInfo,
    onCreateFirstShowData
  }
}
