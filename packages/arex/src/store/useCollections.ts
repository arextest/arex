import { create } from 'zustand';

import { queryWorkspaceById } from '@/services/FileSystemService';

interface CollectionState {
  collections: Collection[];
  collectionsTreeData: any[];
}
interface CollectionAction {
  getCollections: () => Promise<Collection[]>;
}
interface Collection {
  id: string;
  pid: string; //父节点id，0为根节点
  title: string;
  nodeType: number;
  method: string;
  labelIds: string[];
  caseSourceType: number;
}
const initialState: CollectionState = {
  collections: [],
  collectionsTreeData: [],
};
function treeToArray(node, result, pid) {
  if (node != null) {
    result.push({
      id: node.id,
      pid: pid,
      title: node.title,
      nodeType: node.nodeType,
      method: node.method,
      labelIds: node.labelIds || [],
      caseSourceType: node.caseSourceType,
    }); // 将当前节点的值存储到数组中
    if (node.children != null) {
      node.children.forEach(function (child) {
        treeToArray(child, result, node.id); // 递归遍历子节点
      });
    }
  }
  return result; // 返回存储遍历结果的数组
}
const useCollections = create<CollectionState & CollectionAction>((set, get) => {
  async function getCollections(workspaceId: string) {
    const treeData = await queryWorkspaceById({ id: workspaceId });
    const collections = treeToArray({ id: '', children: treeData }, []);
    const collectionsTreeData = treeData;
    set({ collections, collectionsTreeData });
    return collections;
  }

  getCollections('644a282d3867983e29d1b8f5');

  return {
    // ...initialState,
    ...initialState,
    // actions
    getCollections,
    reset: () => {
      console.log('reset');
    },
  };
});

export default useCollections;
