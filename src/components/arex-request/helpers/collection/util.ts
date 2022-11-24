// @ts-nocheck
// 数组转树通用方法
// import { NodeList } from "../../vite-env";
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

export function treeFindPath(tree: any, func: any, path: any = []): any {
  if (!tree) {
    return [];
  }
  for (const data of tree) {
    // 假设满足条件,直接放到数组里
    path.push({
      title: data.title,
      key: data.key,
      nodeType: data.nodeType,
    });
    if (func(data)) {
      return path;
    }
    if (data.children) {
      const res = treeFindPath(data.children, func, path);
      if (res.length) {
        return res;
      }
    }
    path.pop();
  }
  return [];
}

export function treeFind(tree: any, func: any): any {
  for (const data of tree) {
    //相当于func = node => node.id == '2-1'
    if (func(data)) {
      return data;
    }
    if (data.children) {
      const res = treeFind(data.children, func);
      if (res) {
        return res;
      }
    }
  }
  return null;
}

export function collectionOriginalTreeToAntdTreeData(tree: any, nodeList: any[] = []): any[] {
  const nodes = tree;
  Object.keys(nodes).forEach((value, index, array) => {
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
    if (nodes[value].children && Object.keys(nodes[value].children).length > 0) {
      collectionOriginalTreeToAntdTreeData(nodes[value].children, nodeList[index].children);
    }
  });
  return nodeList;
}
