import { CollectionType } from '@/services/FileSystemService';
import { CollectionFlatMapType } from '@/store/useCollections';

export default function treeToMap(
  tree?: CollectionType | null,
  map: CollectionFlatMapType = {},
  pid?: string,
) {
  if (tree) {
    map[tree.infoId] = {
      pid,
      ...tree,
    };
    if (tree.children) {
      tree.children.forEach((child) => {
        treeToMap(child, map, tree.infoId);
      });
    }
  }
  return map;
}
