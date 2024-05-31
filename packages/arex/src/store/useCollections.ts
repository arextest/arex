import { RequestMethodEnum } from '@arextest/arex-core';
import { cloneDeep } from 'lodash';
import React from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { CollectionNodeType } from '@/constant';
import { FileSystemService } from '@/services';
import {
  CollectionType,
  getCollectionItem,
  getCollectionItemTree,
} from '@/services/FileSystemService';
import { treeToMap } from '@/utils';

import useWorkspaces from './useWorkspaces';

export type CollectionFlatType = CollectionType & { pid?: string };
export type CollectionFlatMapType = Record<string, CollectionFlatType>;

export type CollectionState = {
  loading: boolean;
  expandedKeys: string[];
  loadedKeys: string[];
  collectionsTreeData: CollectionType[];
  collectionsFlatData: CollectionFlatMapType;
};

export type CollectionPath = { name: string; id: string };

export type CollectionAction = {
  // 不传参数或只传 workspaceId 时默认获取当前 workspace 下的根节点
  // 传递 parentIds 时获取指定路径下的节点
  // 传递 infoId 和 nodeType 时获取指定 infoId 节点
  // 当 params 不为空时 workspaceId 必传
  getCollections: (
    params?: {
      workspaceId?: string;
      infoId?: string;
      nodeType?: CollectionNodeType;
    },
    options?: {
      mode?: 'search' | 'click';
      merge?: boolean;
    },
  ) => Promise<void>;
  setExpandedKeys: (keys: string[]) => void;
  setLoadedKeys: (keys: string[]) => void;
  getPath: (infoId: string) => CollectionPath[];
  addCollectionNode: (params: {
    infoId: string;
    nodeName: string;
    parentId?: string;
    nodeType: CollectionNodeType;
    caseSourceType?: CaseSourceType;
  }) => void;
  removeCollectionNode: (infoId: string) => void;
  renameCollectionNode: (infoId: string, newName: string) => void;
  duplicateCollectionNode: (infoId: string, newId: string) => void;
  createRootCollectionNode: (infoId: string) => void;
  moveCollectionNode: (
    dragKey: React.Key,
    dropKey: React.Key,
    dropToGap: boolean,
    dropPosition: number, // the drop position relative to the drop node, inside 0, top -1, bottom 1
  ) => void;
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
  loading: true,
  expandedKeys: [],
  loadedKeys: [],
  collectionsFlatData: {},
  collectionsTreeData: [],
};

const ROOT_KEY = '__root__';

const generateRootNode = (children: CollectionType[]) => ({
  caseSourceType: 0,
  labelIds: null,
  method: null,
  nodeName: 'root',
  nodeType: CollectionNodeType.folder,
  infoId: '', // types.id,
  key: ROOT_KEY, //
  children,
});

const generateNewFolder = (infoId: string, nodeName = 'New Collection') => ({
  key: infoId,
  nodeName,
  nodeType: CollectionNodeType.folder,
  infoId,
  method: null,
  caseSourceType: 0,
  labelIds: null,
  children: [],
  existChildren: false,
  isLeaf: true,
});

const appendChildrenByParent = (
  tree: CollectionType[],
  children: CollectionType | CollectionType[],
  parentPath: string[],
): CollectionType[] => {
  const _tree = cloneDeep(tree);
  parentPath.reduce<CollectionType[]>((treeArray, path, index) => {
    const node = treeArray.find((item) => item.infoId === path);
    if (!node) return treeArray;
    if (index === parentPath.length - 1) {
      if (Array.isArray(children)) {
        node.children = children;
        node.existChildren = !!children.length;
        node.isLeaf = !children.length;
      } else {
        if (node.children?.length) node.children.unshift(children);
        else node.children = [children];
        node.existChildren = true;
        node.isLeaf = false;
      }
    } else {
      treeArray = node.children || [];
    }
    return treeArray;
  }, _tree);

  return _tree;
};

function mergeRootLevel(tree: CollectionType[], rootLevel: CollectionType[]) {
  return rootLevel.map((item) => {
    const node = tree.find((root) => root.infoId === item.infoId);
    if (!node) return item;
    else {
      return { ...item, children: node.children } as CollectionType;
    }
  });
}

const isLeafNest = (obj: CollectionType[]) => {
  obj.map((item) => {
    item.isLeaf = !item.existChildren;
    if (item.children) {
      isLeafNest(item.children);
    }
  });
  return obj;
};

const useCollections = create(
  immer<CollectionState & CollectionAction>((set, get) => {
    /**
     * 获取路径
     * @param id
     * @param flatArray
     */
    function getPathInFlatArray(id: string | undefined, flatArray: CollectionFlatMapType) {
      const path: CollectionPath[] = [];
      if (!id) return path;

      let node: CollectionFlatType | undefined = flatArray[id];

      while (node) {
        path.unshift({ name: node.nodeName, id: node.infoId });
        node = node.pid ? flatArray[node.pid] : undefined;
      }

      return path;
    }

    return {
      // State,
      ...initialState,

      // Action
      getCollections: async (
        { workspaceId, infoId, nodeType } = {},
        { merge = true, mode = 'click' } = {},
      ) => {
        const id = workspaceId || useWorkspaces.getState().activeWorkspaceId;
        if (!id) return;

        if (!get().loading) set({ loading: true });

        let data;
        if (mode === 'click') {
          // click collection
          data = (
            await getCollectionItem({
              workspaceId: id,
              parentInfoId: infoId,
              parentNodeType: nodeType,
            })
          ).children;
        } else if (mode === 'search' && infoId && nodeType) {
          // click search
          data = (await getCollectionItemTree({ workspaceId: id, infoId, nodeType })).roots;
        }

        if (!data) return;

        let mergedData = isLeafNest(data);

        const treeData = get().collectionsTreeData;

        if (merge) {
          if (!infoId || !nodeType) {
            mergedData = mergeRootLevel(treeData, mergedData);
          } else if (mode === 'click') {
            mergedData = appendChildrenByParent(
              treeData,
              mergedData,
              getPathInFlatArray(infoId, get().collectionsFlatData).map((item) => item.id),
            );
          } else {
            const path = getPathInFlatArray(infoId, treeToMap(generateRootNode(mergedData)))
              .map((item) => item.id)
              .filter((item) => item !== infoId);
            get().setLoadedKeys(path);
            get().setExpandedKeys(path);
          }
        }

        const collectionsFlatData = treeToMap(generateRootNode(mergedData));
        set({
          collectionsFlatData,
          collectionsTreeData: mergedData,
          loading: false,
        });

        useWorkspaces.setState({ activeWorkspaceId: id });
      },
      setExpandedKeys: (keys) => {
        set({ expandedKeys: keys });
      },
      setLoadedKeys: (keys) => {
        set({ loadedKeys: keys });
      },
      getPath: (infoId) => getPathInFlatArray(infoId, get().collectionsFlatData),

      addCollectionNode: ({ infoId, nodeName, nodeType, parentId, caseSourceType }) => {
        function createNode(params: {
          infoId: string;
          nodeName: string;
          nodeType: CollectionNodeType;
          caseSourceType?: CaseSourceType;
        }): CollectionType {
          return params.nodeType === CollectionNodeType.folder
            ? generateNewFolder(params.infoId, params.nodeName)
            : {
                key: infoId,
                nodeName,
                nodeType: params.nodeType,
                infoId,
                method: RequestMethodEnum.GET,
                caseSourceType: params.caseSourceType || CaseSourceType.CASE,
                labelIds: null,
                children: [],
                existChildren: false,
                isLeaf: true,
              };
        }

        set((state) => {
          const treeData = state.collectionsTreeData;
          const flatData = state.collectionsFlatData;
          const node = createNode({ infoId, nodeName, nodeType, caseSourceType });
          state.collectionsTreeData = appendChildrenByParent(
            treeData,
            node,
            getPathInFlatArray(parentId, get().collectionsFlatData).map((item) => item.id),
          );
          flatData[infoId] = { pid: parentId || ROOT_KEY, ...node };
        });
      },
      removeCollectionNode: (infoId) => {
        set((state) => {
          const treeData = state.collectionsTreeData;
          const flatData = state.collectionsFlatData;

          // delete node from treeData
          const parentPath = get().getPath(infoId).slice(0, -1);
          if (parentPath.length) {
            // delete sub node
            parentPath.reduce((value, object, index) => {
              const data = value.find((item) => item.infoId === object.id)!;
              if (index === parentPath.length - 1) {
                const i = data.children.findIndex((item) => item.infoId === infoId);
                data.children.splice(i, 1);
                if (!data.children.length) {
                  data.isLeaf = true;
                  data.existChildren = false;
                }
              }

              return data.children;
            }, treeData);
          } else {
            // delete root node
            const i = treeData.findIndex((item) => item.infoId === infoId);
            treeData.splice(i, 1);
          }

          // delete node from flatData
          const flatNode = flatData[infoId];
          const flatParent = flatData[flatNode?.pid || ''];
          if (!flatNode || !flatParent) return;
          const i = flatParent.children?.findIndex((item) => item.infoId === infoId);
          flatParent.children.splice(i, 1);

          delete flatData[infoId];
        });
      },
      renameCollectionNode: (infoId, newName) => {
        set((state) => {
          const treeData = state.collectionsTreeData;
          const flatData = state.collectionsFlatData;

          // rename node from treeData
          const path = get().getPath(infoId);
          path.reduce((value, object, index) => {
            const data = value.find((item) => item.infoId === object.id)!;
            if (index === path.length - 1) {
              data.nodeName = newName;
            }
            return data.children;
          }, treeData);

          // rename node from flatData
          const flatNode = flatData[infoId];
          if (!flatNode) return;
          flatNode.nodeName = newName;
        });
      },
      duplicateCollectionNode: (infoId, newId) => {
        set((state) => {
          const treeData = state.collectionsTreeData;
          const flatData = state.collectionsFlatData;

          // duplicate node from treeData
          const parentPath = get().getPath(infoId).slice(0, -1);
          if (parentPath.length) {
            // duplicate sub node
            parentPath.reduce((value, object, index) => {
              const data = value.find((item) => item.infoId === object.id)!;
              if (index === parentPath.length - 1) {
                const i = data.children.findIndex((item) => item.infoId === infoId);
                const duplicateNode = cloneDeep(data.children[i]);
                duplicateNode.infoId = newId;
                duplicateNode.nodeName = duplicateNode.nodeName + '_copy';
                data.children.splice(i + 1, 0, duplicateNode);
              }

              return data.children;
            }, treeData);
          } else {
            // duplicate root node
            const i = treeData.findIndex((item) => item.infoId === infoId);
            const duplicateTreeNode = cloneDeep(treeData[i]);
            duplicateTreeNode.infoId = newId;
            duplicateTreeNode.nodeName = duplicateTreeNode.nodeName + '_copy';
            treeData.splice(i + 1, 0, duplicateTreeNode);
          }

          // duplicate node from flatData
          const flatNode = flatData[infoId];
          if (!flatNode) return;
          const duplicateFlatNode = cloneDeep(flatNode);
          duplicateFlatNode.infoId = newId;
          duplicateFlatNode.nodeName = duplicateFlatNode.nodeName + '_copy';
          flatData[newId] = duplicateFlatNode;
        });
      },

      createRootCollectionNode: (infoId) => {
        set((state) => {
          const newCollection = generateNewFolder(infoId);
          state.collectionsTreeData.unshift(newCollection);
          state.collectionsFlatData[infoId] = newCollection;
        });
      },
      moveCollectionNode: (dragKey, dropKey, dropToGap, dropPosition) => {
        const workspaceId = useWorkspaces.getState().activeWorkspaceId;
        const fromNodePath = get()
          .getPath(dragKey.toString())
          .map((path) => path.id);

        set((state) => {
          const treeData = state.collectionsTreeData;

          // Find dragObject
          let dragObj: CollectionType;
          const loop = (
            data: CollectionType[],
            key: React.Key,
            callback: (node: CollectionType, i: number, data: CollectionType[]) => void,
          ) => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].infoId === key) {
                return callback(data[i], i, data);
              }
              if (data[i].children) {
                loop(data[i].children!, key, callback);
              }
            }
          };

          loop(treeData, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
          });

          if (!dropToGap) {
            // Drop on the content
            loop(treeData, dropKey, (item) => {
              item.children = item.children || [];
              // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
              item.children.unshift(dragObj);
            });
          } else {
            let ar: CollectionType[] = [];
            let i: number;
            loop(treeData, dropKey, (_item, index, arr) => {
              ar = arr;
              i = index;
            });
            if (dropPosition === -1) {
              // Drop on the top of the drop node
              ar.splice(i!, 0, dragObj!);
            } else {
              // Drop on the bottom of the drop node
              ar.splice(i! + 1, 0, dragObj!);
            }
          }

          const flatData = treeToMap(generateRootNode(treeData));
          state.collectionsFlatData = flatData;

          // update backend data
          const path = getPathInFlatArray(dragKey.toString(), flatData).map((item) => item.id);
          const id = path.pop();
          const parentId = path.pop();

          const parentChildren = parentId ? flatData[parentId]?.children : treeData;
          if (!parentChildren) return;

          const toIndex = parentChildren.findIndex((item) => item.infoId === id);

          FileSystemService.moveCollectionItem({
            id: workspaceId,
            toIndex,
            fromInfoId: dragKey.toString(),
            fromNodeType: dragObj!.nodeType,
            toParentInfoId: parentId,
            toParentNodeType: parentId ? flatData[parentId]?.nodeType : undefined,
          }).then((success) => {
            if (!success) {
              // move failed, reset state
              get().getCollections();
            }
          });
        });
      },
      reset: () => {
        set(initialState);
      },
    };
  }),
);

export default useCollections;

import { mountStoreDevtool } from 'simple-zustand-devtools';
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('useCollection', useCollections);
}
