import {provide, ref} from "vue";
import {Config} from "@/common/constant";

export default (props: any) => {
  const configurationModalRef = ref();
  const app = ref({});

  const actions = ["templateConfiguration", "recordConfiguration", "replayConfiguration", "comparisonConfiguration"];

  provide(Config.APP, app);

  const onClickAction = (action: string) => {
    configurationModalRef.value.onShow(action);
    app.value = props.app;
  }

  return {
    actions,
    configurationModalRef,

    onClickAction,
  }
};
