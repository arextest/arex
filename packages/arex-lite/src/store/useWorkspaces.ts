import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { RoleEnum } from '@/constant';

export type Workspace = {
  id: string;
  name: string;
  role: RoleEnum;
};

export type WorkspaceState = {
  activeWorkspaceId?: string;
  workspaces: Workspace[];
  timestamp: number;
};

export type WorkspaceAction = {
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspaceId: (id: string) => void;
  updateTimestamp: () => void;
};

const initialState: WorkspaceState = {
  // TODO mock types
  activeWorkspaceId: 'this-is-workspaces-id-1',
  workspaces: [
    { id: 'this-is-workspaces-id-1', role: RoleEnum.Admin, name: '演示工作区1' },
    { id: 'this-is-workspaces-id-2', role: RoleEnum.Admin, name: '演示工作区2' },
  ],
  timestamp: new Date().getTime(),
};

const useUserProfile = create(
  subscribeWithSelector<WorkspaceState & WorkspaceAction>((set) => ({
    ...initialState,
    setWorkspaces: (workspaces) => set({ workspaces }),
    setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
    updateTimestamp: () => set({ timestamp: new Date().getTime() }),
  })),
);

export default useUserProfile;
