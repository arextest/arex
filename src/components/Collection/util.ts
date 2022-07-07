// 根据id查询返回每一级数据
import { Root, RootParadigmKey } from "../../api/FileSystem.type";

export function findPathByKey(
  tree: Root<RootParadigmKey>[],
  key: string,
  path?: Root<RootParadigmKey>[]
): any {
  console.log(tree,key)
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
        tempPath
      );
      if (result) {
        return result;
      }
    }
  }
}
