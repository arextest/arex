// 数组转树通用方法
// import ss from '.../../../vv'
import { NodeList } from "../../vite-env";
export function arrToTree(arr: any, pid = 0) {
  const newArr: any = [];
  arr.forEach((item: any) => {
    if (item.pid === pid) {
      newArr.push({
        ...item,
        children: arrToTree(arr, item.id),
      });
    }
  });
  return newArr;
}

// 根据id查询返回每一级数据
import { Root, RootParadigmKey } from "../../services/CollectionService.type";

export function findPathByKey(
  tree: Root<RootParadigmKey>[],
  key: string,
  path?: Root<RootParadigmKey>[],
): any {
  if (typeof path === "undefined") {
    path = [];
  }
  for (let i = 0; i < tree.length; i++) {
    const tempPath = [...path];
    tempPath.push(tree[i]);
    if (tree[i].key === key) {
      return tempPath;
    }
    if (tree[i].children) {
      const result = findPathByKey(
        tree[i].children as Root<RootParadigmKey>[],
        key,
        tempPath,
      );
      if (result) {
        return result;
      }
    }
  }
}

export function collectionOriginalTreeToAntdTreeData(
  tree: any,
  nodeList: NodeList[] = [],
): NodeList[] {
  const nodes = tree;
  // const nodeList = []
  Object.keys(nodes)
    .forEach((value, index, array) => {
      nodeList.push({
        id: nodes[value].infoId,
        children: [],
        // 自定义
        title: nodes[value].nodeName,
        key: nodes[value].infoId,
        nodeType: nodes[value].nodeType,
        // isLeaf: nodes[value].nodeType === 2||nodes[value].children==null
        // icon: iconMap[nodes[value].nodeType],
      });
      if (
        nodes[value].children && Object.keys(nodes[value].children).length > 0
      ) {
        collectionOriginalTreeToAntdTreeData(
          nodes[value].children,
          nodeList[index].children,
        );
      }
    });
  return nodeList;
}

/**
 * 树转数组扁平化结构
 * 深度优先遍历  递归
 */
export function collectionTreeToArr(data: any) {
  const result: any = [];
  data.forEach((item: any) => {
    const loop = (data: any) => {
      result.push({
        key: data.key,
        title: data.title,
        pid: data.pid,
        nodeType: data.nodeType,
      });
      const child = data.children;
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return result;
}
