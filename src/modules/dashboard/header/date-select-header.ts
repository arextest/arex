import {ref} from "vue";
import {debounce} from "@/common/utils";

export default (props: any, {emit}: any) => {
  const selectedValue = ref<string>('seven-days');

  const onChange = debounce((e: any) => {
    selectedValue.value = e.target.value;
    emit("onChange", {value: selectedValue.value});
  });

  const onSetDefaultValue = () => {
    selectedValue.value = 'seven-days';
    emit("onChange", {value: selectedValue.value});
  };

  onSetDefaultValue();

  return {
    selectedValue,
    onChange
  };
}
