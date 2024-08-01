import { RequestMethodEnum } from '@arextest/arex-core';
import { cloneDeep } from 'lodash';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { CollectionNodeType } from '@/constant';
import { FileSystemService } from '@/services';
import { CollectionType, queryWorkspaceById } from '@/services/FileSystemService';

import useWorkspaces from './useWorkspaces';

export type CollectionState = {
  loading: boolean;
  expandedKeys: string[];
  loadedKeys: string[];
  collectionsTreeData: CollectionType[];
};

export type PathOrIndex = string[] | number[];

export type CollectionAction = {
  getCollections: (workspaceId?: string) => Promise<CollectionTreeType[]>;
  getPathByIndex: (index?: number[]) => string[];
  getNodePathByIndex: (index?: number[]) => CollectionTreeType[];
  getNodeByPath: (path: string[]) => CollectionType | undefined;
  setMethodByPath: (path: string[], method: RequestMethodEnum) => void;
  setExpandedKeys: (keys: string[]) => void;
  setLoadedKeys: (keys: string[]) => void;
  addCollectionNode: (params: {
    infoId: string;
    nodeName: string;
    nodeType: CollectionNodeType;
    caseSourceType?: CaseSourceType;
    pathOrIndex: PathOrIndex;
  }) => void;
  removeCollectionNode: (pathOrIndex: PathOrIndex) => void;
  renameCollectionNode: (pathOrIndex: PathOrIndex, nodeName: string) => void;
  duplicateCollectionNode: (pathOrIndex: PathOrIndex, newId: string) => void;
  createRootCollectionNode: (infoId: string) => void;
  moveCollectionNode: (params: { dragPos: number[]; dropPos: number[] }) => void;
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
  collectionsTreeData: [],
};

const generateNewFolder = (infoId: string, nodeName = 'New Collection'): CollectionTreeType => ({
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
  parentPathOrIndex: PathOrIndex, // path: string[], index: number[]
): CollectionType[] => {
  const _tree = cloneDeep(tree);
  parentPathOrIndex.reduce<CollectionType[]>((treeArray, pathOrIndex, index) => {
    const node =
      typeof pathOrIndex === 'string'
        ? treeArray.find((item) => item.infoId === pathOrIndex)
        : treeArray[pathOrIndex];
    if (!node) return treeArray;
    if (index === parentPathOrIndex.length - 1) {
      if (Array.isArray(children)) {
        node.children = children; // TODO deep merge
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

const isLeafNest = (obj: CollectionType[]) => {
  obj.map((item) => {
    item.isLeaf = !item.existChildren;
    if (item.children) {
      isLeafNest(item.children);
    }
  });
  return obj;
};

function reduceNodeByPos(
  tree: WritableDraft<CollectionType[]>,
  pathOrIndex: PathOrIndex,
  callback: (node: WritableDraft<CollectionType>, index: number) => void,
) {
  const isPath = typeof pathOrIndex[0] === 'string';
  let node = isPath
    ? tree.find((node) => node.infoId === pathOrIndex[0])
    : tree[pathOrIndex[0] as number];
  callback(node!, 0);

  for (let i = 1; i < pathOrIndex.length; i++) {
    node = isPath
      ? node?.children.find((node) => node.infoId === pathOrIndex[i])
      : node?.children?.[pathOrIndex[i] as number];
    node && callback(node, i);
  }
}

const convertIndexToId = (treeData: CollectionTreeType[], index: number[]) => {
  const idList: string[] = [];
  if (!index.length) return idList;
  reduceNodeByPos(treeData, index, (node) => {
    node && idList.push(node.infoId);
  });

  return idList;
};

const useCollections = create(
  immer<CollectionState & CollectionAction>((set, get) => {
    return {
      // State,
      ...initialState,

      // Action
      getCollections: async (workspaceId) => {
        const id: string | undefined = workspaceId || useWorkspaces.getState().activeWorkspaceId;
        if (!id) return [];
        set({
          loading: true,
        });
        const fsTree = await queryWorkspaceById({ id });
        set({
          loading: false,
          collectionsTreeData: fsTree.roots,
        });

        return fsTree.roots;
      },
      getPathByIndex: (index) => {
        return index ? convertIndexToId(get().collectionsTreeData, index) : [];
      },
      getNodePathByIndex: (index) => {
        const nodeList: CollectionTreeType[] = [];
        if (!index) return nodeList;
        reduceNodeByPos(get().collectionsTreeData, index, (node) => {
          node && nodeList.push(node);
        });
        return nodeList;
      },
      getNodeByPath: (path) => {
        let node: CollectionTreeType | undefined = undefined;

        reduceNodeByPos(get().collectionsTreeData, path, (n, index) => {
          index === path.length - 1 && (node = n);
        });

        return node;
      },
      setMethodByPath: (path, method) => {
        set((draft) => {
          reduceNodeByPos(draft.collectionsTreeData, path, (node, index) => {
            if (index === path.length - 1) node.method = method;
          });
        });
      },
      setExpandedKeys: (keys) => {
        set({ expandedKeys: keys });
      },
      setLoadedKeys: (keys) => {
        set({ loadedKeys: keys });
      },
      addCollectionNode: ({ infoId, nodeName, nodeType, caseSourceType, pathOrIndex }) => {
        function createNode(params: {
          infoId: string;
          nodeName: string;
          nodeType: CollectionNodeType;
          caseSourceType?: CaseSourceType;
        }): CollectionTreeType {
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

        try {
          set((state) => {
            const treeData = state.collectionsTreeData;
            const node = createNode({ infoId, nodeName, nodeType, caseSourceType });
            const parentPath = pathOrIndex;
            state.collectionsTreeData = appendChildrenByParent(treeData, node, parentPath);
            const isPath = typeof parentPath[0] === 'string';
            const path = isPath ? (parentPath as string[]) : [];
            if (!isPath) {
              // convert index array to string array
              reduceNodeByPos(state.collectionsTreeData, parentPath as number[], (node, i) => {
                path.push(node.infoId);
              });
            }
            state.expandedKeys = path;
            state.loadedKeys = path;
          });
        } catch (error) {
          return console.error('failed to add collection node.', error);
        }
      },
      removeCollectionNode: (pathOrIndex) => {
        set((state) => {
          try {
            reduceNodeByPos(state.collectionsTreeData, pathOrIndex, (parent, i) => {
              const isPath = typeof pathOrIndex[0] === 'string';
              if (!pathOrIndex.length) return;
              else if (pathOrIndex.length === 1) {
                // delete root node
                const index = isPath
                  ? state.collectionsTreeData.findIndex((node) => node.infoId === pathOrIndex[0])
                  : (pathOrIndex[0] as number);
                state.collectionsTreeData.splice(index, 1);
              } else if (i === pathOrIndex.length - 2 && parent) {
                const index = isPath
                  ? state.collectionsTreeData.findIndex(
                      (node) => node.infoId === pathOrIndex[pathOrIndex.length - 1],
                    )
                  : (pathOrIndex[pathOrIndex.length - 1] as number);
                parent.children.splice(index, 1);
                if (!parent.children.length) {
                  parent.isLeaf = true;
                  parent.existChildren = false;
                }
              }
            });
          } catch (error) {
            return console.error('failed to remove collection node.', error);
          }
        });
      },
      renameCollectionNode: (pathOrIndex, nodeName) => {
        if (!pathOrIndex.length) return;

        try {
          set((state) => {
            reduceNodeByPos(state.collectionsTreeData, pathOrIndex, (node, i) => {
              i === pathOrIndex.length - 1 && (node.nodeName = nodeName);
            });
          });
        } catch (error) {
          return console.error('failed to rename collection node.', error);
        }
      },
      duplicateCollectionNode: (pathOrIndex, newId) => {
        set((state) => {
          const treeData = state.collectionsTreeData;

          // duplicate node from treeData
          const parentPathOrIndex = pathOrIndex.slice(0, -1);
          const childrenPathOrIndex = pathOrIndex[pathOrIndex.length - 1];
          if (parentPathOrIndex.length) {
            try {
              // duplicate sub node
              reduceNodeByPos(treeData, parentPathOrIndex, (parent, i) => {
                if (i === parentPathOrIndex.length - 1) {
                  const childrenIndex =
                    typeof childrenPathOrIndex === 'string'
                      ? parent.children!.findIndex((node) => node.infoId === childrenPathOrIndex)
                      : childrenPathOrIndex;
                  const node = parent.children![childrenIndex];
                  const duplicateNode = cloneDeep(node);
                  duplicateNode.infoId = newId;
                  duplicateNode.nodeName = duplicateNode.nodeName + '_copy';
                  parent.children!.splice(childrenIndex + 1, 0, duplicateNode);
                }
              });
            } catch (error) {
              return console.error('failed to duplicate collection node.', error);
            }
          } else {
            // duplicate root node
            const childrenIndex =
              typeof childrenPathOrIndex === 'string'
                ? treeData.findIndex((node) => node.infoId === childrenPathOrIndex)
                : childrenPathOrIndex;
            const duplicateTreeNode = cloneDeep(treeData[childrenIndex]);
            duplicateTreeNode.infoId = newId;
            duplicateTreeNode.nodeName = duplicateTreeNode.nodeName + '_copy';
            treeData.splice(childrenIndex + 1, 0, duplicateTreeNode);
          }
        });
      },

      createRootCollectionNode: (infoId) => {
        set((state) => {
          const newCollection = generateNewFolder(infoId);
          state.collectionsTreeData.unshift(newCollection);
        });
      },
      moveCollectionNode: ({ dragPos, dropPos }) => {
        const getNodeByPos = (
          data: CollectionType[],
          pos: number[],
        ): CollectionType | CollectionType[] => {
          let node: CollectionType | CollectionType[] = data as CollectionType[];
          for (let i = 1; i < pos.length; i++) {
            node = Array.isArray(node) ? node[pos[i]] : node;
            if (i !== pos.length - 1) node = node?.children || [];
          }
          // return type CollectionType[] when pos is [0]
          // else return type CollectionType
          return node;
        };

        const treeData = cloneDeep(get().collectionsTreeData);

        console.log(dragPos);
        const fromNodePath = convertIndexToId(treeData, dragPos.slice(1));

        const dragParentNode = getNodeByPos(treeData, dragPos.slice(0, -1));
        const dragNode = (
          Array.isArray(dragParentNode) ? dragParentNode : dragParentNode.children
        ).splice(dragPos[dragPos.length - 1], 1)[0];

        const dropParentNode = getNodeByPos(treeData, dropPos.slice(0, -1));

        if (!Array.isArray(dragParentNode) && !dragParentNode.children?.length) {
          dragParentNode.isLeaf = true;
          dragParentNode.existChildren = false;
        }

        if (!Array.isArray(dropParentNode) && !dropParentNode.existChildren) {
          dropParentNode.isLeaf = false;
          dropParentNode.existChildren = true;
        }

        // 校验拖拽节点是否合规
        const fromNodeType = dragNode.nodeType;
        const toParentNodeType = Array.isArray(dropParentNode)
          ? CollectionNodeType.folder
          : dropParentNode.nodeType;

        if (
          Array.isArray(dropParentNode) // drop 到根节点
        ) {
          // 根节点只允许存在 folder 类型
          if (fromNodeType !== CollectionNodeType.folder)
            return console.error('Dragging nodes is not compliant');
        } else if (
          //  folder 只能防置于 folder 或者根节点
          (fromNodeType === CollectionNodeType.folder &&
            toParentNodeType !== CollectionNodeType.folder) ||
          // interface 只能放置于 folder 中
          (fromNodeType === CollectionNodeType.interface &&
            toParentNodeType !== CollectionNodeType.folder) ||
          // case 只能放置于 interface 中
          (fromNodeType === CollectionNodeType.case &&
            toParentNodeType !== CollectionNodeType.interface)
        )
          return console.error('Dragging nodes is not compliant');

        const toIndex = dropPos[dropPos.length - 1];
        (Array.isArray(dropParentNode) ? dropParentNode : dropParentNode.children)?.splice?.(
          toIndex,
          0,
          dragNode,
        ) || ((dropParentNode as CollectionType).children = [dragNode]);

        const toParentPath = convertIndexToId(treeData, dropPos.slice(1, -1));

        set({
          collectionsTreeData: treeData,
        });

        // update backend data
        FileSystemService.moveCollectionItem({
          id: useWorkspaces.getState().activeWorkspaceId,
          toIndex,
          fromNodePath,
          toParentPath,
        }).then((success) => {
          if (!success) {
            // move failed, reset state
            get().getCollections();
          }
        });
      },
      reset: () => {
        set(initialState);
      },
    };
  }),
);

export default useCollections;

import { WritableDraft } from 'immer/dist/types/types-external';
import { mountStoreDevtool } from 'simple-zustand-devtools';

import { CollectionTreeType } from '@/components/CollectionSelect';
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('useCollection', useCollections);
}
