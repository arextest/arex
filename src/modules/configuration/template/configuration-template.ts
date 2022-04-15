import {inject, readonly, ref} from "vue";
import {useI18n} from "vue-i18n";
import {addConfigTemplate, queryConfigTemplate} from "@/request/configuration";

export default () => {
  const { t } = useI18n();
  const configTemplate = ref("");
  const app: any = inject("app");

  const onSetConfigTemplate = () => {
    queryConfigTemplate({ appId: app.value.appId }).then((raw: any) => {
      configTemplate.value = raw.configTemplate;
    }).catch(((err: any) => console.error(err)));
  }

  const onReset = () => {}

  const onSave = () => {
    return new Promise((resolve: any, reject: any) => {
      if (configTemplate.value) {
        addConfigTemplate({
          appId: app.value.appId,
          configTemplate: configTemplate.value
        }).then(({ success }: any) => {
          success ? resolve() : reject();
        }).catch(((err: any) => {
          console.error(err);
          reject();
        }));
      } else {
        resolve();
      }
    })
  }

  return {
    configTemplate,

    onReset,
    onSave,
    onSetForm: onSetConfigTemplate
  }
};
