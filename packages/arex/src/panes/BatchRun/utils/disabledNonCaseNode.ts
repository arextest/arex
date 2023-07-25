import { CollectionNodeType } from '@/constant';
import { CollectionType } from '@/services/FileSystemService';

/**
 * 禁用无 case 的非 case 节点
 * @param nodeData
 */
export default function disabledNonCaseNode(nodeData: CollectionType[]) {
  nodeData.forEach((item) => {
    item.disabled =
      item.nodeType !== CollectionNodeType.case && item.children?.length
        ? !disabledNonCaseNode(item.children).hasCase
        : item.nodeType !== CollectionNodeType.case;
  });
  return { nodeData, hasCase: nodeData.some((item) => !item.disabled) };
}
