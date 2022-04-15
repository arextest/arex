import {ref, inject} from "vue";
import {showNotification} from "@/common/utils";
import {useI18n} from "vue-i18n";
import {queryChildSchema, querySchema} from "@/request/configuration";

export default () => {
  const { t } = useI18n();
  const activeKey = ref("message");
  const msg = ref("");
  const tree = ref([]);
  const childTree = ref([]);
  const isSortView = ref(false);
  const selectedNodes: any = inject("selectedNodes");

  const onChangeTab = () => {
    tree.value.splice(0);
    childTree.value.splice(0);
    selectedNodes.value.splice(0);
    if (activeKey.value === "tree" && msg.value) {
      try {
        let params = { msg: JSON.stringify(JSON.parse(msg.value)), onlyArray: isSortView.value }
        querySchema(params).then((raw: any) => {
          if (raw.schema) {
            parseNode(JSON.parse(raw.schema).properties, tree.value, "");
          }
        }).catch((err: any) => console.error(err));
      } catch (err) {
        console.error(err);
        showNotification(t("incorrectJsonFormat"), "", "error");
      }
    }
  }

  const parseNode = (obj: any, tree: any, path: string) => {
    if (obj) {
      for (let key in obj) {
        let curPath = path + key + "/"
        tree.push({
          title: key,
          key: curPath,
          children: []
        });
        if (obj[key].items && obj[key].items.properties) {
          parseNode(obj[key].items.properties, tree[tree.length - 1].children, curPath);
        } else if (obj[key].properties) {
          parseNode(obj[key].properties, tree[tree.length - 1].children, curPath);
        }
      }
    }
  }

  const onCheckNode = (checked: boolean, path: string) => {
    if (isSortView.value) {
      if (checked) {
        selectedNodes.value[0].pathValue.push(path);
      } else {
        selectedNodes.value[0].pathValue = selectedNodes.value[0].pathValue.filter((selectedPath: any) => {
          return selectedPath !== path;
        })
      }
    } else {
      if (checked) {
        selectedNodes.value.push({ pathValue: [path] });
      } else {
        selectedNodes.value = selectedNodes.value.filter((selectedNode: any) => {
          return selectedNode.pathValue[0] !== path;
        })
      }
    }
  }

  const onCheckListNode = (path: string) => {
    let listPath = path.replaceAll("/", "\\")
    childTree.value.splice(0);
    selectedNodes.value.splice(0);
    queryChildSchema({ listPath, msg: msg.value }).then((raw: any) => {
      if (raw.schema) {
        parseNode(JSON.parse(raw.schema).properties, childTree.value, "");
        selectedNodes.value.push({ pathName: path, pathValue: [] })
      }
    }).catch((err: any) => console.error(err));
  }

  return {
    activeKey,
    msg,
    tree,
    childTree,
    selectedNodes,
    isSortView,

    onChangeTab,
    onCheckNode,
    onCheckListNode
  }
};
