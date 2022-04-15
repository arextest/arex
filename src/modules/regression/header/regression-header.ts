import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {debounce} from "@/common/utils";

export default (props: any, { emit }: any) => {
  const { t } = useI18n();
  const selectedValue = ref("all");
  const searchText = ref("");

  const options = [
    { label: t("myFocus"), value: "myFocus", disabled: true },
    { label: t("all"), value: "all" }
  ];

  const onChange = () => {
  }

  const onSearch = debounce(() => {
    emit("onSearch", searchText.value);
  })

  return {
    selectedValue,
    searchText,
    options,

    onChange,
    onSearch
  }
}
