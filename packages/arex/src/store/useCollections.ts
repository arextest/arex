import { create } from 'zustand';

import { treeToMap } from '@/helpers/collection/util';
import { CollectionType, queryWorkspaceById } from '@/services/FileSystemService';

export type CollectionFlatType = Omit<CollectionType, 'children'> & { pid?: string };
export type CollectionFlatMapType = Map<string, CollectionFlatType>;

export type CollectionState = {
  loading: boolean;
  collectionsTreeData: CollectionType[];
  collectionsFlatData: CollectionFlatMapType;
};

export type CollectionAction = {
  getCollections: (workspaceId?: string) => Promise<void>;
  getPath: (infoId: string) => string[];
  reset: () => void;
};

export type Collection = {
  id: string;
  pid: string; //父节点id
  title: string;
  nodeType: number;
  method: string;
  labelIds: string[];
  caseSourceType: number;
};

const initialState: CollectionState = {
  loading: false,
  collectionsFlatData: new Map(),
  collectionsTreeData: [],
};

import useWorkspaces from './useWorkspaces';
const useCollections = create<CollectionState & CollectionAction>((set, get) => {
  async function getCollections(workspaceId?: string) {
    const id = workspaceId || useWorkspaces.getState().activeWorkspaceId;
    if (!id) return;

    set({ loading: true });
    const data = await queryWorkspaceById({ id });
    const collectionsFlatData = treeToMap({
      caseSourceType: 0,
      labelIds: null,
      method: null,
      nodeName: 'root',
      nodeType: 3,
      infoId: '', // data.id,
      children: data.roots,
    });
    set({ collectionsFlatData, collectionsTreeData: data.roots, loading: false });
  }

  getCollections();

  /**
   * 获取路径
   * @param id
   * @param flatArray
   */
  function getPathInFlatArray(id: string, flatArray: CollectionFlatMapType) {
    const path: string[] = [];
    let node = flatArray.get(id);
    while (node && node.pid) {
      path.unshift(node.pid);
      node = flatArray.get(node.pid);
    }
    return path;
  }

  return {
    // State,
    ...initialState,

    // Action
    getCollections,
    getPath: (infoId: string) => {
      getPathInFlatArray(infoId, get().collectionsFlatData);
    },
    reset: () => {
      set(initialState);
    },
  };
});

export default useCollections;
