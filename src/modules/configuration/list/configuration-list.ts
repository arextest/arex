import {useI18n} from "vue-i18n";
import {ref, readonly} from "vue";
import {queryApps} from "@/request/regression";
import {Switch, Tag} from "@/common/constant";

export default () => {
  const { t } = useI18n();
  const apps: any = ref([]);
  const filterApps: any = ref([]);
  const currentApps = ref([]);
  const loading = ref(false);
  const paginationRef = ref();

  const columns = readonly([
    { title: t("application"), dataIndex: "app" },
    { title: t("recordable"), dataIndex: "recordable" },
    { title: t("replayable"), dataIndex: "replayable" },
    { title: t("accessCI"), dataIndex: "accessCI" },
    { title: t("configurationItems"), dataIndex: "configurationItems" }
  ]);

  const onSetApps = (params: any) => {
    loading.value = true;
    queryApps(params).then((raws: any) => {
      if (raws && raws.length > 0) {
        apps.value = raws.map((row: any) => {
          let {appId, appName, features, status, agentVersion} = row.application;
          return {
            appId,
            appName,
            app: (appId || "") + (appName ?  "_" + appName : ""),
            accessCI: {
              value: features & 1,
              label: (features & 1) === 1 ? Switch.ON : Switch.OFF,
              class: (features & 1) === 1 ? Tag.GREEN : Tag.GREY
            },
            recordable: (status & 2) === 2,
            replayable: (status & 1) === 1,
            version: agentVersion
          };
        })
        paginationRef.value.pagination.total = raws.length || 0;
      } else {
        apps.value.splice(0);
      }
      onSetFilterApps();
      loading.value = false;
    }).catch((err) => console.error(err));
  };

  const onSetFilterApps = (value?: string) => {
    filterApps.value = value ?
      apps.value.filter((app: any) => app.appId.includes(value) || app.appName.includes(value)) : apps.value;
    onSetCurrentApps();
  };

  const onSetCurrentApps = () => currentApps.value = paginationRef.value.onSlice(filterApps.value);

  return {
    apps,
    currentApps,
    columns,
    loading,
    paginationRef,

    onSetApps,
    onSetFilterApps,
    onSetCurrentApps
  };
};
