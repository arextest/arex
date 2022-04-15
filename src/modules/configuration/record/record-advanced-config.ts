import {readonly, ref} from "vue";

export default (props: any, { emit }: any) => {
  const formRef = ref();

  return {
    formRef,

    onSetDynamicClasses: () => emit("onSetDynamicClasses")
  }
};
