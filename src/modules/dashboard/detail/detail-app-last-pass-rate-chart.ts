import {ref, watch} from "vue";
import {useI18n} from "vue-i18n"

export default () => {
  const {t} = useI18n();
  const summary = ref("");
  const columns = ref([
    {title: t("application"), dataIndex: 'app'},
    {
      title: t('passRate'),
      dataIndex: 'passRate',
      sorter: (a: any, b: any) => a.passRate - b.passRate,
      defaultSortOrder: 'descend'
    }
  ]);
  const tableData = ref([]);

  const onRender = (data: any) => {
    tableData.value = data;
    summary.value = t("total") + " " + (data ? data.length : 0) + " " + t("item");
  };
  return {
    columns,
    summary,
    tableData,
    onRender
  }
}
