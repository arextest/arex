import {useI18n} from "vue-i18n";
import {reactive, ref} from "vue";
import {diffResultCode} from "@/common/constant";

export default (props: any, {emit}: any) => {
  const {t} = useI18n();
  const searchKey = ref("");
  const diffResultOpt = [...diffResultCode];
  diffResultOpt.unshift({label: t("allStatus"), classCss: "", value: -1})

  const diffResultCodeSelect = reactive({
    value: -1,
    options: diffResultOpt.map(s => {
      return s;
    }),
    placeholder: t("allStatus"),
    showSearch: false
  })

  const onSearch = () => emit("onSearch");


  return {
    diffResultCodeSelect,
    searchKey,

    onSearch
  }
}
