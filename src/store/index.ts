import create from "zustand";
interface BaseState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  userinfo: any;
  setUserinfo: (a: any) => void;
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
  }),
);
