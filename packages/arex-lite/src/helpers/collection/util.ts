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

export function treeFindAllKeys(tree: any, allKeys = []) {
  for (const treeElement of tree) {
    // @ts-ignore
    allKeys.push(treeElement.key);
    if (treeElement.children) {
      treeFindAllKeys(treeElement.children, allKeys);
    }
  }
  return allKeys;
}
