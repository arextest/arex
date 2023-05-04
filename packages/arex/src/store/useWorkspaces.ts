import { getLocalStorage, RoleEnum } from 'arex-core';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { EMAIL_KEY } from '../constant';
import queryWorkspacesByUser from '../services/FileSystemService/queryWorkspacesByUser';

export type Workspace = {
  id: string;
  workspaceName: string;
  role: RoleEnum;
};

export type WorkspaceState = {
  activeWorkspaceId?: string;
  workspaces: Workspace[];
};

export type WorkspaceAction = {
  getWorkspaces: () => Promise<Workspace[]>;
  setActiveWorkspaceId: (id: string) => void;
};

const initialState: WorkspaceState = {
  activeWorkspaceId: undefined,
  workspaces: [],
};

const useWorkspaces = create(
  subscribeWithSelector(
    persist<WorkspaceState & WorkspaceAction>(
      (set) => {
        async function getWorkspaces() {
          const userName = getLocalStorage(EMAIL_KEY) as string;
          const workspaces = await queryWorkspacesByUser({ userName });
          set({ workspaces });
          // TODO set activeWorkspaceId
          return workspaces;
        }

        getWorkspaces();

        return {
          // initialState
          ...initialState,

          // actions
          getWorkspaces,
          setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
        };
      },
      {
        name: 'workspaces-storage', // unique name
      },
    ),
  ),
);

export default useWorkspaces;
