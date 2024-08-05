import { getLocalStorage, i18n } from '@arextest/arex-core';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { EMAIL_KEY, RoleEnum } from '@/constant';
import { FileSystemService } from '@/services';
import { useCollections } from '@/store';

export type Workspace = {
  id: string;
  workspaceName: string;
  role: RoleEnum;
};

export type WorkspaceState = {
  activeWorkspaceId: string; // attention: activeWorkspaceId could be empty string !!!
  workspaces: Workspace[];
};

export type WorkspaceAction = {
  getWorkspaces: (id?: string) => Promise<Workspace[] | undefined>;
  setActiveWorkspaceId: (id: string) => void;
  changeActiveWorkspaceId: (id: string) => void;
  reset: () => void;
};

const initialState: WorkspaceState = {
  activeWorkspaceId: '',
  workspaces: [],
};

// 注意：对 useWorkspaces 的订阅监听存在于 useInit hook 中
const useWorkspaces = create(
  subscribeWithSelector(
    persist<WorkspaceState & WorkspaceAction>(
      (set, get) => {
        async function getWorkspaces(id?: string) {
          const userName = getLocalStorage<string>(EMAIL_KEY);
          if (!userName) return;

          let workspaces: Workspace[] = [];
          try {
            workspaces = await FileSystemService.queryWorkspacesByUser({ userName });
            // create default workspace if no workspace
            if (!workspaces.length) {
              const res = await FileSystemService.createWorkspace({
                userName,
                workspaceName: 'default',
              });
              get().getWorkspaces(res.workspaceId);
            }
          } catch (e) {
            window.message.error(i18n.t('workSpace.noPermissionOrInvalid', { ns: 'components' }));
          }
          set({ workspaces });
          const activeWorkspaceId = id || get().activeWorkspaceId || workspaces[0]?.id;

          if (activeWorkspaceId) {
            set({ activeWorkspaceId });
            useCollections.getState().getCollections(activeWorkspaceId);
          }

          return workspaces;
        }

        return {
          // initialState
          ...initialState,

          // actions
          getWorkspaces,
          setActiveWorkspaceId: (id) => {
            set({ activeWorkspaceId: id });
            useCollections.getState().getCollections(id);
          },
          changeActiveWorkspaceId: (id) => {
            useCollections.getState().reset();
            get().setActiveWorkspaceId(id);
          },
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
