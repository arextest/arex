import { CollectionType } from '@/services/FileSystemService';
import { CollectionFlatType } from '@/store/useCollections';

export function treeToArray(
  node?: CollectionType | null,
  result: CollectionFlatType[] = [],
  pid?: string,
) {
  if (node) {
    const { children, ...rest } = node;
    result.push({
      pid,
      ...rest,
    }); // 将当前节点的值存储到数组中
    if (children) {
      node.children.forEach((child) => {
        treeToArray(child, result, node.infoId); // 递归遍历子节点
      });
    }
  }
  return result; // 返回存储遍历结果的数组
}
