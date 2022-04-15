import {reactive, ref, readonly, computed} from "vue";
import {useI18n} from "vue-i18n";
import {Dates} from "@/common/constant";

export default (props: any) => {
  const { t } = useI18n();
  const formRef = ref();

  const onFormat = (value: number) => {
    return `${value} / 100s`
  };

  const onChange = (e: any, value: number) => {
    let checked = e.target.checked;
    if (!checked) {
      props.form.durations = props.form.durations.filter((duration: number) => duration !== value);
    } else if (value === 0) {
      props.form.durations = [0];
    } else {
      props.form.durations = props.form.durations.filter((duration: number) => duration !== 0);
      props.form.durations.push(value);
    }
  };

  return {
    formRef,
    dates: Dates,

    onFormat,
    onChange
  }
};
