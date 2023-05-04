interface NodeObject {
  id: string;
  children: NodeObject[];
  title: string;
  key: string;
  nodeType: number;
  method: string;
  labelIds: string[] | null;
  caseSourceType: number;
}
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

export function treeFindPath<T>(
  tree: T[],
  func: (item: T) => boolean,
  path: any = [],
): {
  title: string;
  key: string;
  nodeType: number;
}[] {
  if (!tree) {
    return [];
  }
  for (const data of tree) {
    // 假设满足条件,直接放到数组里

    path.push({
      // @ts-ignore
      title: data.title,
      // @ts-ignore
      key: data.key,
      // @ts-ignore
      nodeType: data.nodeType,
    });
    if (func(data)) {
      return path;
    }
    // @ts-ignore
    if (data.children) {
      // @ts-ignore
      const res = treeFindPath(data.children, func, path);
      if (res.length) {
        return res;
      }
    }
    path.pop();
  }
  return [];
}

export function treeFind<T>(tree: T[], func: (item: T) => boolean): T | undefined {
  for (const data of tree) {
    if (func(data)) return data;
    // @ts-ignore
    if (data.children) {
      // @ts-ignore
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return undefined;
}

export function collectionOriginalTreeToAntdTreeData(
  tree: any,
  nodeList: NodeObject[] = [],
): NodeObject[] {
  const nodes = tree;
  Object.keys(nodes).forEach((value, index) => {
    nodeList.push({
      id: nodes[value].infoId,
      children: [],
      // 自定义
      labelIds: nodes[value].labelIds,
      title: nodes[value].nodeName,
      key: nodes[value].infoId,
      nodeType: nodes[value].nodeType,
      method: nodes[value].method,
      caseSourceType: nodes[value].caseSourceType,
      // isLeaf: nodes[value].nodeType === 2||nodes[value].children==null
      // icon: iconMap[nodes[value].nodeType],
    });
    if (nodes[value].children && Object.keys(nodes[value].children).length > 0) {
      collectionOriginalTreeToAntdTreeData(nodes[value].children, nodeList[index].children);
    }
  });
  return nodeList;
}
