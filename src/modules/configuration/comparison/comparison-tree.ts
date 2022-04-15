import {ref} from "vue";

export default (props: any, { emit }: any) => {
  const selectedKey = ref("");

  const onCheck = (checked: boolean, key: string) => {
    if (props.singleChoice) {
      selectedKey.value = key;
      emit("onCheckListNode", key);
    } else {
      emit("onCheckNode", checked, key);
    }
  }

  return {
    selectedKey,

    onCheck,
  }
};
