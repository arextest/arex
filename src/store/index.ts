import create from "zustand";
interface BaseState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  userinfo: any;
  setUserinfo: (a: any) => void;
    workspaces: any;
    setWorkspaces: (a: any) => void;
    currentWorkspaceId:any,
    setCurrentWorkspaceId:(a: any) => void
}
export const useStore = create<BaseState>(
  (set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
    userinfo: {},
    setUserinfo: (a: any) => {
      console.log(a);
      return set((state) => ({ userinfo: a }));
    },
      currentWorkspaceId:'',
      setCurrentWorkspaceId:(currentWorkspaceId: any) => {
          return set((state) => ({ currentWorkspaceId: currentWorkspaceId }));
      },
      workspaces:[],
      setWorkspaces:(workspaces: any) => {
          return set((state) => ({ workspaces: workspaces }));
      }
  }),
);
