import {ref} from "vue";

export default () => {
  const selectedOption = ref("regressionTest");

  const options = ["regressionTest", "executionRecords", "basicConfiguration"];

  const onSelectOption = (value: string) => selectedOption.value = value;

  return {
    selectedOption,
    options,

    onSelectOption
  }
};
