import {useI18n} from "vue-i18n";
import {reactive, ref, inject, nextTick, provide} from "vue";
import {Config, Lang, Result} from "@/common/constant";
import {showMessage, showNotification} from "@/common/utils";
import { emitter, ON_CLICK_SELECT_FROM_MESSAGE } from "@/mitt";

export default () => {
  const { t, locale } = useI18n();
  const visible = ref(false);
  const title = ref("");
  const component: any = reactive({});
  const app: any = inject(Config.APP);
  const showArrow = ref(false);

  const components: any = {
    recordConfiguration: { is: "configuration-record", ref: "configurationRecordRef", el: ref() },
    replayConfiguration: { is: "configuration-replay", ref: "configurationReplayRef", el: ref() },
    comparisonConfiguration: { is: "configuration-comparison", ref: "configurationComparisonRef", el: ref() },
    templateConfiguration: { is: "configuration-template", ref: "configurationTemplateRef", el: ref() },
  };

  const onShow = async (action: string) => {
    showArrow.value = false;
    Object.assign(component, components[action]);
    visible.value = true;
    await nextTick();
    title.value = `${t(action)} ${locale.value === Lang.EN ? 'Configuration' : ''} - ${app.value.appId}`;
    if (component.el.onSetForm) {
      component.el.onSetForm();
    }
  };

  const onSave = (isComparisonConfiguration: boolean = false) => {
    component.el.onSave().then(() => {
      if (isComparisonConfiguration) {
        onBack(isComparisonConfiguration);
      } else {
        visible.value = false;
        component.el.onReset();
      }
      showNotification(t("saveSuccess"), "", Result.SUCCESS);
    }).catch((err: any) => {
      console.error(err);
      showNotification(t("saveFail"), "", Result.ERROR)
    });
  };

  const onCancel = () => {
    const { form, onReset } = component.el;
    if (form && form.isChanged) {
      showMessage(t("modificationsHaveNotBeenSavedAreYouSureToClose"), "", t("yes"), t("no"),
        () => {
          setTimeout(() => {
            visible.value = false;
            onReset();
          }, 600);
        }, () => {})
    } else {
      visible.value = false;
      onReset();
    }
  };

  const onClose = () => visible.value = false;

  emitter.on(ON_CLICK_SELECT_FROM_MESSAGE,  (type) => {
    title.value = t("selectFromMessage");
    showArrow.value = true;
    if (component.el) {
      component.el.onShowMessage(type);
    }
  })

  const onBack = (isComparisonConfiguration: boolean) => {
    showArrow.value = false;
    title.value = `${t("comparisonConfiguration")} ${locale.value === Lang.EN ? 'Configuration' : ''} - ${app.value.appId}`;
    if (isComparisonConfiguration) {
      component.el.showMessage = false;
      setTimeout(() => component.el.onSetForm(), 600);
    } else {
      component.el.onReset();
    }
  };

  return {
    visible,
    title,
    component,
    configurationRecordRef: components.recordConfiguration.el,
    configurationReplayRef: components.replayConfiguration.el,
    configurationComparisonRef: components.comparisonConfiguration.el,
    configurationTemplateRef: components.templateConfiguration.el,
    showArrow,

    onShow,
    onSave,
    onCancel,
    onClose,
    onBack,
  }
};
