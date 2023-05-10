import { getLocalStorage, RoleEnum } from 'arex-core';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { EMAIL_KEY } from '@/constant';
import queryWorkspacesByUser from '@/services/FileSystemService/workspace/queryWorkspacesByUser';

export type Workspace = {
  id: string;
  workspaceName: string;
  role: RoleEnum;
};

export type WorkspaceState = {
  activeWorkspaceId: string;
  workspaces: Workspace[];
};

export type WorkspaceAction = {
  getWorkspaces: (id?: string) => Promise<Workspace[]>;
  setActiveWorkspaceId: (id: string) => void;
};

const initialState: WorkspaceState = {
  activeWorkspaceId: '',
  workspaces: [],
};

const useWorkspaces = create(
  subscribeWithSelector(
    persist<WorkspaceState & WorkspaceAction>(
      (set) => {
        async function getWorkspaces(id?: string) {
          const userName = getLocalStorage(EMAIL_KEY) as string;
          const workspaces = await queryWorkspacesByUser({ userName });
          set({ workspaces });
          id && set({ activeWorkspaceId: id });

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
