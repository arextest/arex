import {reactive, ref} from "vue";
import {useI18n} from "vue-i18n";

export default (props: any, {emit}: any) => {
  const {t} = useI18n();
  const sortRef = ref();
  const select = reactive({
    value: -1,
    options: [
      {label: t("allTypes"), value: -1}
    ],
    placeholder: t("allTypes"),
    showSearch: false
  });
  const sort = reactive({
    label: t("failureRate"),
    key: "failureRate",
    array: props.filteredOperations
  })

  const onChange = () => emit("onChange");

  const onSort = (filteredOperations: any) => sortRef.value.onSort(filteredOperations);

  const onSelectAll = (event: any) => {
    emit("onSelectAll", event.target.checked);
  }

  return {
    select,
    sort,
    sortRef,

    onChange,
    onSort,
    onSelectAll
  }
}
