import { CollectionType } from '@/services/FileSystemService';
import { CollectionFlatMapType, CollectionFlatType } from '@/store/useCollections';

export function findAncestors(collections: CollectionFlatType[], id: string) {
  const res = [];
  let node = collections.find((item) => item.infoId === id);

  while (node && node.pid) {
    const parent = collections.find((item) => item.infoId === node?.pid);
    if (parent) {
      res.push(parent);
      node = parent;
    } else {
      node = undefined;
    }
  }
  return res;
}

export function treeToMap(
  tree?: CollectionType | null,
  map: CollectionFlatMapType = new Map<string, CollectionFlatType>(),
  pid?: string,
) {
  if (tree) {
    const { children, ...rest } = tree;
    map.set(tree.infoId, {
      pid,
      ...rest,
    });
    if (children) {
      tree.children.forEach((child) => {
        treeToMap(child, map, tree.infoId);
      });
    }
  }
  return map;
}

export function processTreeData(treeData: any, depthLimit = 10, currentDepth = 0) {
  if (currentDepth >= depthLimit) {
    // 达到递归深度上限，停止递归
    return treeData;
  }
  return treeData.map((c: any) => {
    return {
      title: c.nodeName,
      value: c.infoId,
      disabled: c.nodeType !== 3,
      nodeType: c.nodeType,
      children: processTreeData(c.children || [], depthLimit, currentDepth + 1), // 递归调用，增加当前深度
    };
  });
}
