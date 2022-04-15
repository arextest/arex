import { ref } from "vue";
import {useI18n} from "vue-i18n";

export default () => {
  const { t } = useI18n();

  const basicItems = ref([
    { label: t("appId"), key: "appId" },
    { label: t("planItemId"), key: "planItemId" },
    { label: t("totalCase"), key: "totalCaseCount" },
    { label: t("successCase"), key: "successCaseCount" },
    { label: t("failureCase"), key: "failCaseCount" },
    { label: t("waitCase"), key: "waitCaseCount" },
    { label: t("invalidCase"), key: "errorCaseCount" },
  ]);

  const onSetInfo = (planItem: any) => {
    basicItems.value.forEach((basicItem: any) => {
      basicItem.value = planItem[basicItem.key];
    });
  };

  return {
    basicItems,

    onSetInfo
  }
}
