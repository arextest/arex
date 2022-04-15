import {reactive} from "vue";
import {queryApps} from "@/request/regression";
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";

export default () => {
  const router = useRouter();
  const select = reactive({
    value: "",
    options: [],
    searching: false,
    showSearch: true
  });

  const onSearchApp = (value: string) => {
    select.searching = true;
    select.options.splice(0);
    queryApps().then((raws: any) => {
      if (raws && raws.length > 0) {
        const apps = (value ? raws.filter((row: any) => {
           return row.application.appId.includes(value) || row.application.appName.includes(value);
        }) : raws).slice(0, 15);
        select.options = apps.map((app: any) => {
          const { appId, appName } = app.application;
          return {
            label: `${appId} - ${appName}`,
            value: appId
          }
        })
      }
      select.searching = false;
    }).catch((err) => console.error(err));
  };

  const onClose = () => {
    select.value = "";
    select.options.splice(0);
  }

  const onConfirm = () => {
    location.href = router.resolve({ name: Route.REPORT, query: { appId: select.value } }).href;
    location.reload();
  }

  return {
    select,

    onSearchApp,
    onClose,
    onConfirm
  }
};
