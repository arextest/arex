// @ts-ignore
import { toggleTheme } from "@zougt/vite-plugin-theme-preprocessor/dist/browser-utils";
import create from "zustand";

import { DefaultTheme, Theme } from "../style/theme";

interface BaseState {
  theme: Theme;
  changeTheme: (theme?: Theme) => void;
  userinfo: any;
  setUserinfo: (a: any) => void;
  workspaces: any;
  setWorkspaces: (a: any) => void;
  currentWorkspaceId: any;
  setCurrentWorkspaceId: (a: any) => void;
  collectionTree:any
  setCollectionTree:(a: any) => void
  httpPanes: {
    title:string
    key:string
  }[];
  setHttpPanes: (a: any) => void;
  httpActiveKey: any;
  setHttpActiveKey: (a: any) => void;
  collectionCreateAndUpdateModalVisible: boolean,
  setCollectionCreateAndUpdateModalVisible:(a: any) => void;
  collectionCreateAndUpdateModalFolderName: '',
  setCollectionCreateAndUpdateModalFolderName: (a: any) => void;
  collectionCreateAndUpdateModalMode: 'create',
  setCollectionCreateAndUpdateModalMode: (a: any) => void;
  collectionCreateAndUpdateModalId: '',
  setCollectionCreateAndUpdateModalId: (a: any) => void;
  collectionSaveRequest: {
    isModalVisible: boolean
    randomId: string
  },
  setCollectionSaveRequest: (a: any) => void;
}
export const useStore = create<BaseState>((set, get) => ({
  theme: DefaultTheme,
  changeTheme: (theme?: Theme) => {
    set((state) => {
      const newTheme =
        theme || (state.theme === Theme.light ? Theme.dark : Theme.light);
      toggleTheme({
        scopeName: newTheme,
      });
      localStorage.setItem("theme", newTheme);
      return {
        theme: newTheme,
      };
    });
  },
  userinfo: {},
  setUserinfo: (a: any) => {
    console.log(a);
    return set(() => ({ userinfo: a }));
  },
  // 这边要按模块分，之后再拆
  // Workspace
  currentWorkspaceId: "",
  setCurrentWorkspaceId: (currentWorkspaceId: any) => {
    return set(() => ({ currentWorkspaceId }));
  },
  workspaces: [],
  setWorkspaces: (workspaces: any) => {
    return set(() => ({ workspaces }));
  },
  // Rest
  httpPanes: [],
  httpActiveKey: "0",
  setHttpPanes: (httpPanes: any) => {
    return set(() => ({ httpPanes }));
  },
  setHttpActiveKey: (httpActiveKey: any) => {
    return set(() => ({ httpActiveKey }));
  },
  // Collection
  collectionTree: [],
  setCollectionTree: (collectionTree:any) => {
    return set(() => ({ collectionTree }));
  },
  collectionCreateAndUpdateModalVisible: false,
  setCollectionCreateAndUpdateModalVisible: (collectionCreateAndUpdateModalVisible:any) => {
    return set(() => ({ collectionCreateAndUpdateModalVisible }));
  },
  collectionCreateAndUpdateModalFolderName: '',
  setCollectionCreateAndUpdateModalFolderName: (collectionCreateAndUpdateModalFolderName:any) => {
    return set(() => ({ collectionCreateAndUpdateModalFolderName }));
  },
  collectionCreateAndUpdateModalMode: 'create',
  setCollectionCreateAndUpdateModalMode: (collectionCreateAndUpdateModalMode:any) => {
    return set(() => ({ collectionCreateAndUpdateModalMode }));
  },
  collectionCreateAndUpdateModalId: '',
  setCollectionCreateAndUpdateModalId: (collectionCreateAndUpdateModalId:any) => {
    return set(() => ({ collectionCreateAndUpdateModalId }));
  },
  // CollectionSaveRequest
  collectionSaveRequest: {
    isModalVisible: false,
    randomId: ''
  },
  setCollectionSaveRequest: (collectionSaveRequest:any) => {
    return set(() => ({ collectionSaveRequest }));
  },
}));
