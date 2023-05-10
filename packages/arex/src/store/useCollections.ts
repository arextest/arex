import { create } from 'zustand';

import { treeToArray } from '@/helpers/collection/util';
import { CollectionType, queryWorkspaceById } from '@/services/FileSystemService';

export type CollectionFlatType = Omit<CollectionType, 'children'> & { pid?: string };

export type CollectionState = {
  loading: boolean;
  collectionsFlatData: CollectionFlatType[];
  collectionsTreeData: CollectionType[];
};

export type CollectionAction = {
  getCollections: (workspaceId?: string) => Promise<void>;
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
  collectionsFlatData: [],
  collectionsTreeData: [],
};

import useWorkspaces from './useWorkspaces';
const useCollections = create<CollectionState & CollectionAction>((set, get) => {
  async function getCollections(workspaceId?: string) {
    const id = workspaceId || useWorkspaces.getState().activeWorkspaceId;
    if (!id) return;

    set({ loading: true });
    const data = await queryWorkspaceById({ id });
    const collectionsFlatData = treeToArray({
      caseSourceType: 0,
      labelIds: null,
      method: null,
      nodeName: 'root',
      nodeType: 3,
      infoId: data.id,
      children: data.roots,
    });
    set({ collectionsFlatData, collectionsTreeData: data.roots, loading: false });
  }

  getCollections();

  return {
    // State,
    ...initialState,

    // Action
    getCollections,
    reset: () => {
      set(initialState);
    },
  };
});

export default useCollections;
