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
