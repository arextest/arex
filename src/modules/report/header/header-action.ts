import {inject} from "vue";
import {showMessage, showNotification} from "@/common/utils";
import {useI18n} from "vue-i18n";
import {Env} from "@/common/constant";
import {addPlan} from "@/request/regression";

export default (props: any) => {
  const { t } = useI18n();
  const showDetail: any = inject("showDetail");

  const onToggle = () => {
    showDetail.value = !showDetail.value;
  }

  const onRerun = () => {
    showMessage(t("areYouSureToRerun"), "", t("yes"), t("no"), () => {
      const { appId, sourceHost, targetHost } = props.plan;
      let params = {
        appId,
        sourceEnv: sourceHost || Env.PRO,
        targetEnv: targetHost || Env.PRO,
        operator: "Visitor",
        replayPlanType: 0
      };
      addPlan(params).then(({ result, desc }: any) => {
        if (result === 1) {
          showNotification(t("startedSuccessfully"), "", "success");
        } else {
          showNotification(t("startFailed"), desc, "error");
        }
      }).catch(err => console.error(err));
    })
  }

  return {
    showDetail,

    onToggle,
    onRerun
  }
}
