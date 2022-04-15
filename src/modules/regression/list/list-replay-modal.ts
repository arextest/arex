import {reactive, ref, computed} from "vue";
import {useI18n} from "vue-i18n";
import {queryEnvs, addPlan} from "@/request/regression";
import {showNotification} from "@/common/utils";

export default (props: any) => {
  const { t } = useI18n();
  const visible = ref(false);
  const form: any = reactive({
    targetEnv: { value: "", options: [] }
  });
  const formRef = ref();
  const title = computed(() => `${t('startReplay')} - ${form.appId}`)

  const rules = {
    targetEnv: [
      {
        validator: () => form.targetEnv.value ?
          Promise.resolve() : Promise.reject(t("targetHost") + t("canNotBeEmpty")),
      }
    ]
  };

  const onShow = (appId: string) => {
    form.appId = appId;
    visible.value = true;
  };

  const onOk = () => {
    formRef.value.validate().then(() => {
      let params = {
        appId: form.appId,
        sourceEnv: "pro",
        targetEnv: form.targetEnv.value,
        operator: "Visitor",
        replayPlanType: props.planType
      };
      addPlan(params).then(({ result, desc }: any) => {
        if (result === 1) {
          showNotification(t("startedSuccessfully"), "", "success");
        } else {
          showNotification(t("startFailed"), desc, "error");
        }
        onCancel();
      }).catch(err => console.error(err));
    }).catch((err: any) => console.error(err));
  };

  const onCancel = () => {
    visible.value = false;
    formRef.value.resetFields();
  }

  const onValidate = (name: string) => formRef.value.validate([name]);

  return {
    visible,
    form,
    rules,
    formRef,
    title,

    onShow,
    onOk,
    onCancel,
    onValidate
  }
}
