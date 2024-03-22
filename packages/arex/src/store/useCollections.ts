import { enableMapSet } from 'immer';
import { cloneDeep } from 'lodash';
import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
      parentIds?: string[];
      infoId?: string;
      nodeType?: CollectionNodeType;
    },
    options?: {
      merge?: boolean;
    },
  ) => Promise<void>;
  setExpandedKeys: (keys: string[]) => void;
  setLoadedKeys: (keys: string[]) => void;
  getPath: (infoId: string) => CollectionPath[];
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
  loading: false,
  expandedKeys: [],
  loadedKeys: [],
  collectionsFlatData: {},
  collectionsTreeData: [],
};

const generateRootNode = (children: CollectionType[]) => ({
  caseSourceType: 0,
  labelIds: null,
  method: null,
  nodeName: 'root',
  nodeType: CollectionNodeType.folder,
  infoId: '', // types.id,
  key: '__root__', //
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
  children: CollectionType[],
  parentPath: string[],
): CollectionType[] => {
  parentPath.reduce<CollectionType[]>((treeArray, path, index) => {
    const node = treeArray.find((item) => item.infoId === path);
    if (!node) return treeArray;
    if (index === parentPath.length - 1) {
      node.children = children;
      node.existChildren = true;
      node.isLeaf = false;
    } else {
      treeArray = node.children || [];
    }
    return treeArray;
  }, tree);

  return cloneDeep(tree);
};

// TODO: 存在问题
function mergeTreeData(
  rootTree: CollectionType[],
  childrenTree: CollectionType[],
  nodePath: string[],
): CollectionType[] {
  console.log(rootTree, childrenTree, nodePath);

  let currentRoot = rootTree;
  let currentChildren = childrenTree;

  nodePath.forEach((path, index) => {
    const rootNode = currentRoot.find((item) => item.infoId === path);
    const childrenNode = currentChildren.find((item) => item.infoId === path);
    console.log(index);
    if (!childrenNode) {
      console.error(currentChildren, path);
      return;
      // throw new Error('childrenNode not found, infoId: ' + path + 'index: ' + index);
    }

    if (!rootNode) {
      console.log('rootNode not found, infoId: ' + index + path);
      currentRoot.push(...currentChildren);
      return;
    }

    currentRoot = rootNode.children || [];
    currentChildren = childrenNode.children || [];
  });

  return cloneDeep(rootTree);
}

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

enableMapSet();

const useCollections = create(
  persist(
    immer<CollectionState & CollectionAction>((set, get) => {
      /**
       * 获取路径
       * @param id
       * @param flatArray
       */
      function getPathInFlatArray(id: string, flatArray: CollectionFlatMapType) {
        let node: CollectionFlatType | undefined = flatArray[id];

        const path: CollectionPath[] = [];

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
          { workspaceId, parentIds, infoId, nodeType } = {},
          { merge = true } = {},
        ) => {
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

          const treeData = get().collectionsTreeData;

          let mergedData = isLeafNest(data);

          if (merge) {
            if (infoId) {
              // mergedData = mergeTreeData(
              //   treeData,
              //   mergedData,
              //   getPathInFlatArray(infoId, treeToMap(generateRootNode(mergedData))).map(
              //     (item) => item.id,
              //   ),
              // );
            } else if (parentIds?.length) {
              const parentId = parentIds[parentIds.length - 1];
              mergedData = appendChildrenByParent(
                treeData,
                mergedData,
                getPathInFlatArray(parentId, get().collectionsFlatData).map((item) => item.id),
              );
            } else {
              mergedData = mergeRootLevel(treeData, mergedData);
            }
          }

          console.log(mergedData);

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

            const toParentPath = parentId
              ? getPathInFlatArray(parentId, flatData).map((item) => item.id)
              : [];
            const parentChildren = parentId ? flatData[parentId]?.children : treeData;
            if (!parentChildren) return;

            const toIndex = parentChildren.findIndex((item) => item.infoId === id);

            console.log({
              id: workspaceId,
              fromNodePath,
              toParentPath,
              toIndex,
            });
            FileSystemService.moveCollectionItem({
              id: workspaceId,
              fromNodePath,
              toParentPath,
              toIndex,
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
    {
      name: 'collections-storage', // unique name
    },
  ),
);

useCollections.getState().getCollections();

export default useCollections;
