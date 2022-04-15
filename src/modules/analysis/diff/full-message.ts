import {nextTick, ref} from "vue";
import {queryReplayMsg} from "@/request/analysis";

export default () => {
  const visible = ref(false);
  const messageTreeLeft = ref();
  const messageTreeRight = ref();

  const jsonData = ref({})

  const onOk = () => {
    onCancel();
  }
  const onCancel = () => {
    visible.value = false
  }
  const onShowFullMessageModal = async (compareResultId) => {
    visible.value = true
    await nextTick()
    jsonData.value = await queryReplayMsg({id: compareResultId})
  }

  return {
    visible,
    messageTreeLeft,
    messageTreeRight,
    onShowFullMessageModal,
    jsonData,

    onOk,
    onCancel
  }
}
