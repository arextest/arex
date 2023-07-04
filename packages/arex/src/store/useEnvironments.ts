import { getLocalStorage, setLocalStorage } from '@arextest/arex-core';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import { EnvironmentService } from '@/services';

import useWorkspaces from './useWorkspaces';

export type EnvironmentKeyValues = { key: string; value: string; active?: boolean };

export type Environment = {
  envName: string;
  id: string;
  keyValues?: EnvironmentKeyValues[];
  workspaceId?: string;
};

export type EnvironmentState = {
  environments: Environment[];
  activeEnvironment?: Environment;
  timestamp?: number;
};

export type EnvironmentAction = {
  getEnvironments: (workspaceId?: string) => Promise<Environment[] | undefined>;
  setActiveEnvironment: (environment?: Environment | string) => void;
  reset: () => void;
};

export type WorkspaceEnvironmentPair = { [workspaceId: string]: string };
// 保存工作空间和环境变量的对应关系至 localStorage
const updateWorkspaceEnvironmentLS = (workspaceId: string, environmentId: string) => {
  let workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
    WORKSPACE_ENVIRONMENT_PAIR_KEY,
  );
  if (!workspaceEnvironmentPair) {
    workspaceEnvironmentPair = { [workspaceId]: environmentId };
  } else if (workspaceEnvironmentPair[workspaceId] === environmentId) {
    return;
  } else {
    workspaceEnvironmentPair[workspaceId] = environmentId;
  }
  setLocalStorage(WORKSPACE_ENVIRONMENT_PAIR_KEY, workspaceEnvironmentPair);
};

export const DefaultEnvironment = { envName: 'No Environment', id: '0' };

const initialState: EnvironmentState = {
  environments: [],
  activeEnvironment: DefaultEnvironment,
  timestamp: Date.now(), // 记录最后一次更新的时间戳, 用于强制刷新
};

const useEnvironments = create(
  persist<EnvironmentState & EnvironmentAction>(
    (set, get) => {
      async function getEnvironments(workspaceId?: string) {
        const _workspaceId = workspaceId || useWorkspaces.getState().activeWorkspaceId;
        if (!_workspaceId) {
          // window.message.info('please select a workspace first');
          return;
        }

        const environments = await EnvironmentService.getEnvironments({
          workspaceId: _workspaceId as string,
        });
        set({ environments, timestamp: Date.now() });
        return environments;
      }

      return {
        // ...initialState,
        ...initialState,

        // actions
        getEnvironments,

        setActiveEnvironment: (environment) => {
          const workspaceId = useWorkspaces.getState().activeWorkspaceId;
          if (!workspaceId) {
            window.message.info('please select a workspace first');
            return;
          }

          // 从 localStorage 中读取工作空间的缓存值
          if (!environment) {
            // 先设置为默认值，后面再可能设置为有效值，避免有效值不存在时环境变量仍属于上一个工作空间
            set({ activeEnvironment: DefaultEnvironment });

            const workspaceEnvironmentPair = getLocalStorage<WorkspaceEnvironmentPair>(
              WORKSPACE_ENVIRONMENT_PAIR_KEY,
            );
            const environmentId = workspaceEnvironmentPair?.[workspaceId];
            environmentId && get().setActiveEnvironment(environmentId);
          }
          // 根据 id 从 environmentTreeData 中读取保存
          else if (typeof environment === 'string') {
            const environmentTreeData = get().environments;
            const activeEnvironment =
              environment === DefaultEnvironment.id
                ? DefaultEnvironment
                : environmentTreeData.find((i) => i.id === environment);
            if (activeEnvironment) {
              set({
                activeEnvironment,
              });
              updateWorkspaceEnvironmentLS(workspaceId, activeEnvironment.id);
            }
          }
          // 直接保存
          else {
            set({ activeEnvironment: environment });
            updateWorkspaceEnvironmentLS(workspaceId, environment.id);
          }
        },

        reset: () => {
          set(initialState);
          get()
            .getEnvironments()
            .then(() => get().setActiveEnvironment());
        },
      };
    },
    {
      name: 'environments-storage',
    },
  ),
);

export default useEnvironments;
