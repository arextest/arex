import { CollectionNodeType } from '@/constant';
import { CollectionType } from '@/services/FileSystemService';

export default function disabledNonCaseNode(nodeData: CollectionType[]) {
  nodeData.forEach((item) => {
    item.disabled =
      item.nodeType !== CollectionNodeType.case && item.children?.length
        ? !disabledNonCaseNode(item.children).hasCase
        : item.nodeType !== CollectionNodeType.case;
  });
  return { nodeData, hasCase: nodeData.some((item) => !item.disabled) };
}
