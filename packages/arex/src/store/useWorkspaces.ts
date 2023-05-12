import { getLocalStorage, i18n, RoleEnum } from 'arex-core';
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
  getWorkspaces: (id?: string) => Promise<Workspace[] | undefined>;
  setActiveWorkspaceId: (id: string) => void;
  reset: () => void;
};

const initialState: WorkspaceState = {
  activeWorkspaceId: '',
  workspaces: [],
};

const useWorkspaces = create(
  subscribeWithSelector(
    persist<WorkspaceState & WorkspaceAction>(
      (set, get) => {
        async function getWorkspaces(id?: string) {
          const userName = getLocalStorage<string>(EMAIL_KEY);
          if (!userName) return;

          let workspaces: Workspace[] = [];
          try {
            workspaces = await queryWorkspacesByUser({ userName });
          } catch (e) {
            window.message.error(i18n.t('workSpace.noPermissionOrInvalid', { ns: 'components' }));
          }
          set({ workspaces });
          const activeWorkspaceId = id || get().activeWorkspaceId || workspaces[0]?.id;
          activeWorkspaceId && set({ activeWorkspaceId: activeWorkspaceId });

          return workspaces;
        }

        return {
          // initialState
          ...initialState,

          // actions
          getWorkspaces,
          setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
          reset: () => set(initialState),
        };
      },
      {
        name: 'workspaces-storage', // unique name
      },
    ),
  ),
);

export default useWorkspaces;
