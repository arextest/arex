import {ref} from "vue";
import {useRouter} from "vue-router";
import {Route} from "@/common/constant";

export default (props: any, { emit }: any) => {
  const router = useRouter();
  const listReplayModalRef = ref();

  const onClickReplay = () => {
    listReplayModalRef.value.onShow(props.item.appId);
  }

  const onClickReport = () => {
    window.open(router.resolve({ name: Route.REPORT, query: { appId: props.item.appId } }).href, "_blank");
  }

  return {
    listReplayModalRef,

    onClickReplay,
    onClickReport
  }
};
