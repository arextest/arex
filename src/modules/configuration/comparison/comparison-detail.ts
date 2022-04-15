import {useI18n} from "vue-i18n";
import {inject, readonly, ref} from "vue";
import {emitter, ON_CLICK_SELECT_FROM_MESSAGE, ON_SET_ITEMS} from "@/mitt";
import {Config, Result} from "@/common/constant";
import {addComparisonConfigurationItem, deleteComparisonConfigurationItem} from "@/request/configuration";
import {showNotification} from "@/common/utils";

export default (props: any, { emit }: any) => {
  const { t } = useI18n();
  const loading = ref(false);
  const path = ref("");
  const nodes: any = inject("nodes");
  const currentNodes = ref([]);
  const paginationRef = ref();
  const app: any = inject(Config.APP);

  const column = readonly({
    inclusionsColumns: [
      { title: t("includedNode"), dataIndex: "pathValue" },
      /*{ title: t("validityPeriod"), dataIndex: "validityPeriod" },
      { title: t("state"), dataIndex: "state" },*/
      { title: t("action"), dataIndex: "action", width: 150 }
    ],
    exclusionsColumns: [
      { title: t("ignoredNode"), dataIndex: "pathValue" },
      { title: t("action"), dataIndex: "action", width: 150 }
    ],
    sortKeysColumns: [
      { title: t("sortListNode"), dataIndex: "pathName", width: "40%" },
      { title: t("sortNode"), dataIndex: "pathValue", width: "40%" },
      { title: t("action"), dataIndex: "action" }
    ]
  })

  const onClickSelectFromMessage = () => {
    emitter.emit(ON_CLICK_SELECT_FROM_MESSAGE, props.tab.type);
  };

  const onAddManually = () => {
    if (path.value) {
      let params = {
        appId: app.value.appId,
        categoryType: props.tab.category,
        detailsList: [
          { pathName: "", pathValue: [path.value] }
        ]
      }
      addComparisonConfigurationItem(params).then((raw: any) => {
        if (raw) {
          path.value = "";
          showNotification(t("saveSuccess"), "", Result.SUCCESS);
        } else {
          showNotification(t("saveFail"), "", Result.ERROR);
        }
        emitter.emit(ON_SET_ITEMS);
      }).catch((err: any) => {
        console.error(err);
        showNotification(t("saveFail"), "", Result.ERROR);
      });
    }
  };

  const onSetCurrentNodes = () => currentNodes.value = paginationRef.value.onSlice(nodes.value);

  const onDelete = (node: any) => {
    let params = {
      id: props.tab.id,
      appId: app.value.appId,
      categoryType: props.tab.category,
      detailsList: [
        { id: node.id }
      ]
    }
    deleteComparisonConfigurationItem(params).then((raw: any) => {
      raw ? showNotification(t("deletedSuccessfully"), "", Result.SUCCESS) :
        showNotification(t("deleteFailed"), "", Result.ERROR);
      emitter.emit(ON_SET_ITEMS);
    }).catch((err: any) => {
      console.error(err);
      showNotification(t("deleteFailed"), "", Result.ERROR);
    });
  };

  return {
    nodes,
    currentNodes,
    column,
    loading,
    path,
    paginationRef,

    onClickSelectFromMessage,
    onAddManually,
    onSetCurrentNodes,
    onDelete
  }
};
