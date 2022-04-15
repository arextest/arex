import {inject, ref, provide, nextTick} from "vue";
import {addComparisonConfigurationItem, queryComparisonConfiguration} from "@/request/configuration";
import {Config} from "@/common/constant";
import {emitter, ON_SET_ITEMS} from "@/mitt";

export default () => {
  const items = ref([]);
  const showMessage = ref(false);
  const app: any = inject(Config.APP);
  const activeTabKey = ref("exclusionsRef");
  const selectedNodes: any = ref([]);
  const nodes: any = ref([]);

  provide("selectedNodes", selectedNodes);
  provide("nodes", nodes);

  const refRaw: any = {comparisonTabsRef: ref(), comparisonMessageRef: ref() };
  const categoryMap: any = {
    inclusionsRef: 7,
    exclusionsRef: 0,
    sortKeysRef: 4,
    referencesRef: 5
  }

  const onSetItems = () => {
    let appId = app.value.appId;
    queryComparisonConfiguration(appId).then((raws: any) => {
      if (raws) {
        items.value = raws;
        const {tabMap, onChange} = refRaw.comparisonTabsRef.value;
        onChange();
        for (let tabKey in tabMap) {
          let tabItem = tabMap[tabKey];
          let detail = raws.find((rawItem: any) => rawItem.categoryType === tabItem.category);
          if (detail) {
            tabItem.count = detail.detailsList ? detail.detailsList.length : 0;
            tabItem.id = detail.id;
          }
        }
      }
    }).catch((err: any) => console.error(err));
  };

  const onReset = () => {
    showMessage.value = false;
    setTimeout(() => {
      if (refRaw.comparisonTabsRef.value) {
        refRaw.comparisonTabsRef.value.onChange();
      }
    }, 600)
  };

  const onShowMessage = (type: boolean) => {
    showMessage.value = true;
    setTimeout(() => {
      if (refRaw.comparisonMessageRef.value) {
        refRaw.comparisonMessageRef.value.isSortView = !type;
      }
    }, 600)
  };

  const onSave = () => {
    return new Promise((resolve: any, reject: any) => {
      if (selectedNodes.value.length > 0) {
        let params = {
          appId: app.value.appId,
          categoryType: categoryMap[activeTabKey.value],
          detailsList: selectedNodes.value.map((node: any) => {
            return {
              pathName: node.pathName || "",
              pathValue: node.pathValue
            }
          })
        }
        addComparisonConfigurationItem(params).then((raw: any) => {
          raw ? resolve() : reject();
        }).catch((err: any) => {
          console.error(err);
          reject();
        });
      } else {
        resolve();
      }
    })
  };

  emitter.on(ON_SET_ITEMS, () => onSetItems());

  return {
    items,
    showMessage,
    ...refRaw,
    activeTabKey,

    onSetForm: onSetItems,
    onReset,
    onShowMessage,
    onSave,
  }
};
