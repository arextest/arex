import {inject, reactive, ref, toRefs, watch, readonly} from "vue";
import {Config, Date, Dates, options} from "@/common/constant";
import {useI18n} from "vue-i18n";
import dayjs, { Dayjs } from 'dayjs';
import {queryDynamicClasses, queryRecordConfiguration, updateRecordConfiguration} from "@/request/configuration";

export default () => {
  const { t } = useI18n();
  const activeKey = ref<string>("1");
  const app: any = inject(Config.APP);
  const form: any = reactive({
    version: app.value.version,
    durations: [0],
    period: [dayjs("12:01:00", Date.HH_MM_SS), dayjs("11:59:00", Date.HH_MM_SS)],
    frequency: 1,
    typeOptions: readonly(options),
    apiToRecord: { mode: "tags", values: [] },
    apiNotToRecord: { mode: "tags", values: [] },
    dependentApiNotToRecord: { mode: "tags", values: [] },
    servicesToRecord: { mode: "tags", values: [] },
    dependentServicesNotToRecord: { mode: "tags", values: [] },
    timeClasses: ([
      { label: "java.time.Instant(now)", value: false },
      { label: "java.time.LocalDate(now)", value: false },
      { label: "java.time.LocalTime(now)", value: false },
      { label: "java.time.LocalDateTime(now)", value: false },
      { label: "java.util.Date(Date)", value: false },
      { label: "java.lang.System(currentTimeMillis)", value: false },
    ]),
    dynamicClasses: [],
    isChanged: false
  });
  const el = reactive({ recordBasicConfigRef: ref(), recordAdvancedConfigRef: ref() });

  const onSetForm = () => {
    let appId = app.value.appId;
    queryRecordConfiguration(appId).then((
      {
        allowDayOfWeeks,
        allowTimeOfDayFrom,
        allowTimeOfDayTo,
        sampleRate,
        excludeDependentOperationSet,
        excludeDependentServiceSet,
        excludeOperationSet,
        includeServiceSet,
        includeOperationSet
      }: any) => {
      if (allowTimeOfDayFrom && allowTimeOfDayTo) {
        form.period = [dayjs(allowTimeOfDayFrom, Date.HH_MM), dayjs(allowTimeOfDayTo, Date.HH_MM)];
      }
      form.frequency = sampleRate || 1;
      form.durations.splice(0);
      if (allowDayOfWeeks) {
        for (let i = 1; i < Dates.length; i++) {
          allowDayOfWeeks >>= 1;
          if (allowDayOfWeeks & 1) {
            form.durations.push(i);
          } else if (!allowDayOfWeeks) {
            break;
          }
        }
      } else {
        form.durations.push(0);
      }
      form.apiToRecord.values = includeOperationSet || [];
      form.apiNotToRecord.values = excludeOperationSet || [];
      form.dependentApiNotToRecord.values = excludeDependentOperationSet || [];
      form.servicesToRecord.values = includeServiceSet || [];
      form.dependentServicesNotToRecord.values = excludeDependentServiceSet || [];
    }).catch((err) => console.error(err));
  };

  const onSave = () => {
    return new Promise((resolve: any, reject: any) => {
      let allowDayOfWeeks = 0;
      if (!form.durations.includes(0)) {
        form.durations.forEach((duration: number) => {
          allowDayOfWeeks += (1 << duration);
        })
      }
      let params = {
        appId: app.value.appId,
        sampleRate: form.frequency,
        allowDayOfWeeks,
        allowTimeOfDayFrom: form.period[0].format(Date.HH_MM),
        allowTimeOfDayTo: form.period[1].format(Date.HH_MM),
        includeOperationSet: form.apiToRecord.values,
        excludeOperationSet: form.apiNotToRecord.values,
        excludeDependentOperationSet: form.dependentApiNotToRecord.values,
        includeServiceSet: form.servicesToRecord.values,
        excludeDependentServiceSet: form.dependentServicesNotToRecord.values
      };
      updateRecordConfiguration(params).then((raw) => {
        raw ? resolve() : reject();
      }).catch((err) => {
        console.error(err);
        reject();
      })
    })
  };

  const onReset = () => {
    const { recordBasicConfigRef: basicRef, recordAdvancedConfigRef: advanceRef } = el;
    if (basicRef) {
      basicRef.formRef.resetFields();
    }
    if (advanceRef) {
      advanceRef.formRef.resetFields();
    }
    activeKey.value = "1";
  }

  const onChange = (key: string) => {
    if (key === "2") {
      queryDynamicClasses(app.value.appId).then((raws: any) => {
        if (raws) {
          form.dynamicClasses = raws;
        }
      }).catch((err: any) => console.error(err));
    }
  };

  return {
    activeKey,
    ...toRefs(el),
    form,

    onSave,
    onSetForm,
    onReset,
    onChange
  }
};
