import {inject, ref} from "vue";
import {useI18n} from "vue-i18n";
import {Config, Result} from "@/common/constant";
import {addDynamicClass, deleteDynamicClass} from "@/request/configuration";
import {showNotification} from "@/common/utils";

export default (props: any, { emit }: any) => {
  const { t } = useI18n();
  const adding = ref(false);
  const app: any = inject(Config.APP);

  const columns = [
    { title: t("fullClassName"), dataIndex: "fullClassName" },
    { title: t("functionName"), dataIndex: "methodName" },
    { title: t("parameterTypes"), dataIndex: "parameterTypes" },
    { title: t("keyFormula"), dataIndex: "keyFormula" },
    { title: t("action"), dataIndex: "action" }
  ];

  const onAdd = () => {
    adding.value = true;
    props.form.dynamicClasses.unshift({
      appId: app.value.appId,
      configType: 0,
      fullClassName: "",
      methodName: "",
      parameterTypes: "",
      keyFormula: ""
    });
  };

  const onSave = () => {
    addDynamicClass(props.form.dynamicClasses[0]).then((raw: any) => {
      if (raw) {
        showNotification(t("saveSuccess"), "", Result.SUCCESS);
        adding.value = false;
        emit("onSet");
      } else {
        showNotification(t("saveFail"), "", Result.ERROR);
      }
    }).catch((err: any) => {
      console.error(err);
      showNotification(t("saveFail"), "", Result.ERROR);
    })
  };

  const onCancel = () => {
    adding.value = false;
    props.form.dynamicClasses.splice(0, 1)
  };

  const onDelete = (id: number) => {
    deleteDynamicClass({ appId: app.value.appId, id }).then((raw: any) => {
      if (raw) {
        showNotification(t("deletedSuccessfully"), "", Result.SUCCESS);
        emit("onSet");
      } else {
        showNotification(t("deleteFailed"), "", Result.ERROR);
      }
    }).catch((err: any) => {
      console.error(err);
      showNotification(t("deleteFailed"), "", Result.ERROR);
    });
  };

  return {
    columns,
    adding,

    onAdd,
    onSave,
    onCancel,
    onDelete
  }
};
