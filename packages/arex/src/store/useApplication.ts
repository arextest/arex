import { create } from 'zustand';

export type ApplicationState = {
  timestamp: number;
};

export type ApplicationAction = {
  setTimestamp: (timestamp: number) => void;
};

const useApplication = create<ApplicationState & ApplicationAction>((set, get) => ({
  timestamp: Date.now(),

  setTimestamp: (timestamp: number) => set({ timestamp }),
}));

export default useApplication;
