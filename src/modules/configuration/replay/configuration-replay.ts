import {useI18n} from "vue-i18n";
import {inject, reactive, readonly, ref} from "vue";
import {Config, Dates} from "@/common/constant";
import {queryReplayConfiguration, updateReplayConfiguration} from "@/request/configuration";

export default () => {
  const { t } = useI18n();
  const app: any = inject(Config.APP);
  const form: any = reactive({
    version: app.value.version,
    source: 'pro',
    sourceOptions: readonly([
      { label: t("productionData"), value: "pro" },
      { label: t("testData"), value: "test" }
    ]),
    accessCI: false,
    onlyForRelease: false,
    durations: ["everyDay"],
    durationOptions: Dates.map((date: string) => { return { label: t(date), value: date }}),
    subscribers: [],
    offsetDays: 1
  });
  const formRef = ref();

  const onSetForm = () => {
    let appId = app.value.appId;
    queryReplayConfiguration(appId).then(({ offsetDays, targetEnv, sendMaxQps }: any) => {
      form.offsetDays = offsetDays;
      form.targetEnv = targetEnv || [];
      form.sendMaxQps = sendMaxQps || 0;
    }).catch((err: any) => console.error(err));
  };

  const onReset = () => {
    formRef.value.resetFields();
  }

  const onSave = () => {
    return new Promise((resolve: any, reject: any) => {
      const { offsetDays, targetEnv, sendMaxQps } = form;
      let params = {
        appId: app.value.appId,
        offsetDays,
        targetEnv,
        sendMaxQps
      }
      updateReplayConfiguration(params).then((raw: any) => {
        raw ? resolve() : reject();
      }).catch((err: any) => {
        console.error(err);
        reject();
      });
    })
  };

  const onFormat = (value: number) => `${value}${t('days')}`

  return {
    form,
    formRef,

    onFormat,
    onSetForm,
    onReset,
    onSave
  }
};
