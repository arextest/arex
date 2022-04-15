import {inject, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import {queryAppServices} from "@/request/configuration";
import {Config} from "@/common/constant";

export default () => {
  const { t } = useI18n();
  const app: any = inject(Config.APP);
  const isApi = ref(true);
  const serviceSelect: any = reactive({
    value: undefined,
    options: [],
    showSearch: false,
    placeholder: t("pleaseSelectAService")
  });
  const operationSelect: any = reactive({
    value: undefined,
    options: [],
    showSearch: false,
    placeholder: t("pleaseSelectAnApi")
  })

  const onSetSelect = () => {
    serviceSelect.options.splice(0);
    operationSelect.options.splice(0);
    queryAppServices(app.value.appId).then((raws: any) => {
      if (raws) {
        raws.forEach((raw: any) => {
          const { serviceName, serviceKey, operationList } = raw;
          if (serviceKey) {
            serviceSelect.options.push({ label: serviceName, value: serviceKey });
          }
          if (operationList) {
            operationSelect.options = operationList.map((operation: any) => {
              let operationName = operation.operationName;
              return { label: operationName, value: operationName }
            })
          }
        })
      }
    })
  };

  return {
    isApi,
    serviceSelect,
    operationSelect,

    onSetSelect
  }
};
