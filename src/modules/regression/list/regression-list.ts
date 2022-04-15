import {ref} from "vue";
import {useI18n} from "vue-i18n";
import {queryApps} from "@/request/regression";
import {Env, Switch, Tag} from "@/common/constant";

export default () => {
  const { t } = useI18n();
  const apps: any = ref([]);
  const filterApps: any = ref([]);
  const currentApps = ref([]);
  const loading = ref(false);
  const paginationRef = ref();

  const columns = [
    { title: t("application"), dataIndex: "app" },
    /*{ title: t("team"), dataIndex: "team" },*/
    { title: t("targetEnv"), dataIndex: "targetEnv" },
    { title: t("accessCI"), dataIndex: "accessCI" },
    { title: t("caseCount"), dataIndex: "caseCount" },
    { title: t("action"), dataIndex: "action" }
  ];

  const onSetApps = (params: any) => {
    loading.value = true;
    queryApps(params).then((raws: any) => {
      if (raws && raws.length > 0) {
        apps.value = raws.map((row: any) => {
          let {appId, appName, features, recordedCaseCount}  = row.application;
          let config = row.regressionConfiguration;
          return {
            appId,
            appName,
            app: (appId || "") + (appName ?  "_" + appName : ""),
            /*team: info.groupName,*/
            targetEnv: config.targetEnv,
            accessCI: {
              value: features & 1,
              label: (features & 1) === 1 ? Switch.ON : Switch.OFF,
              class: (features & 1) === 1 ? Tag.GREEN : Tag.GREY
            },
            caseCount: recordedCaseCount,
          }
        });
      } else {
        apps.value.splice(0);
      }
      paginationRef.value.pagination.total = apps.value.length || 0;
      onFilterApps();
      loading.value = false;
    }).catch((err) => console.error(err));
  };

  const onFilterApps = (value?: string) => {
    filterApps.value = value ?
      apps.value.filter((app: any) => app.appId.includes(value) || app.appName.includes(value)) : apps.value;
    onSetCurrentApps();
  };

  const onSetCurrentApps = () => currentApps.value = paginationRef.value.onSlice(filterApps.value);

  return {
    columns,
    apps,
    currentApps,
    loading,
    paginationRef,

    onSetApps,
    onFilterApps,
    onSetCurrentApps
  }
}
