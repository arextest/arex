import React from 'react';
import { create } from 'zustand';

import { CollectionNodeType } from '@/constant';
import {
  CollectionType,
  getCollectionItem,
  getCollectionItemTree,
} from '@/services/FileSystemService';
import { treeToMap } from '@/utils';

import useWorkspaces from './useWorkspaces';

export type CollectionFlatType = CollectionType & { pid?: string };
export type CollectionFlatMapType = Map<string, CollectionFlatType>;

export type CollectionState = {
  loading: boolean;
  collectionsTreeData: CollectionType[];
  collectionsFlatData: CollectionFlatMapType;
};

export type CollectionPath = { name: string; id: string };

export type CollectionAction = {
  // 不传参数或只传 workspaceId 时默认获取当前 workspace 下的根节点
  // 传递 parentIds 时获取指定路径下的节点
  // 传递 infoId 和 nodeType 时获取指定 infoId 节点
  // 当 params 不为空时 workspaceId 必传
  getCollections: (params?: {
    workspaceId?: string;
    parentIds?: string[];
    infoId?: string;
    nodeType?: CollectionNodeType;
  }) => Promise<void>;
  getPath: (infoId: string) => CollectionPath[];
  reset: () => void;
};

export enum CaseSourceType {
  CASE_DEPRECATED = 0,
  AREX,
  CASE,
}

export type Collection = {
  id: string;
  pid: string; //父节点id
  title: string;
  nodeType: number;
  method: string;
  labelIds: string[];
  caseSourceType: CaseSourceType;
};

const initialState: CollectionState = {
  loading: false,
  collectionsFlatData: new Map(),
  collectionsTreeData: [],
};

const updateTreeData = (
  list: CollectionType[],
  key: React.Key,
  children: CollectionType[],
): CollectionType[] =>
  list.map((node) => {
    if (node.infoId === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

const isLeafNest = (obj: CollectionType[]) => {
  obj.map((item) => {
    item.isLeaf = !item.existChildren;
    if (item.children) {
      isLeafNest(item.children);
    }
  });
  return obj;
};
const useCollections = create<CollectionState & CollectionAction>((set, get) => {
  const getCollections: CollectionAction['getCollections'] = async ({
    workspaceId,
    parentIds,
    infoId,
    nodeType,
  } = {}) => {
    const id = workspaceId || useWorkspaces.getState().activeWorkspaceId;
    if (!id) return;

    set({ loading: true });

    let data;
    if (!!infoId && !!nodeType) {
      // click search
      data = (await getCollectionItemTree({ workspaceId: id, infoId, nodeType })).roots;
    } else if (typeof parentIds !== 'string') {
      // click collection
      data = (await getCollectionItem({ workspaceId: id, parentIds })).children;
    }

    if (!data) return;

    const treeData = useCollections.getState().collectionsTreeData;

    let mergedData = isLeafNest(data);
    if (parentIds?.length) {
      mergedData = updateTreeData(treeData, parentIds[parentIds.length - 1], mergedData);
    }

    const collectionsFlatData = treeToMap({
      caseSourceType: 0,
      labelIds: null,
      method: null,
      nodeName: 'root',
      nodeType: CollectionNodeType.folder,
      infoId: '', // types.id,
      key: '__root__', //
      children: mergedData,
    });
    set({
      collectionsFlatData,
      collectionsTreeData: mergedData,
      loading: false,
    });

    useWorkspaces.setState({ activeWorkspaceId: id });
  };

  /**
   * 获取路径
   * @param id
   * @param flatArray
   */
  function getPathInFlatArray(id: string, flatArray: CollectionFlatMapType) {
    let node = flatArray.get(id);

    const path: CollectionPath[] = [];

    while (node) {
      path.unshift({ name: node.nodeName, id: node.infoId });
      node = node.pid ? flatArray.get(node.pid) : undefined;
    }

    return path;
  }

  return {
    // State,
    ...initialState,

    // Action
    getCollections,
    getPath: (infoId: string) => getPathInFlatArray(infoId, get().collectionsFlatData),
    reset: () => {
      set(initialState);
    },
  };
});

export default useCollections;
