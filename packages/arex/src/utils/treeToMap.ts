import { CollectionType } from '@/services/FileSystemService';
import { CollectionFlatMapType, CollectionFlatType } from '@/store/useCollections';

export default function treeToMap(
  tree?: CollectionType | null,
  map: CollectionFlatMapType = new Map<string, CollectionFlatType>(),
  pid?: string,
) {
  if (tree) {
    map.set(tree.infoId, {
      pid,
      ...tree,
    });
    if (tree.children) {
      tree.children.forEach((child) => {
        treeToMap(child, map, tree.infoId);
      });
    }
  }
  return map;
}
