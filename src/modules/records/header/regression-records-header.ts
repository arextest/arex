import {useI18n} from "vue-i18n";
import {ref} from "vue";
import {debounce} from "@/common/utils";

export default (props: any, {emit}: any) => {
  const {t} = useI18n();
  const selectedValue = ref("all");
  const searchText = ref("");

  const options = [
    {label: t("myFocus"), value: "myFocus", disabled: true},
    {label: t("all"), value: "all"}
  ];

  const onFocusTabChange = () => {

  };

  const onChange = debounce(() => {
    if (searchText.value.trim() === "") {
      emit("onChange", {search: searchText.value});
    }
  });

  const onSearch = debounce(() => {
    emit("onSearch", {search: searchText.value});
  });

  return {
    selectedValue,
    searchText,
    options,

    onFocusTabChange,
    onChange,
    onSearch
  }
}
