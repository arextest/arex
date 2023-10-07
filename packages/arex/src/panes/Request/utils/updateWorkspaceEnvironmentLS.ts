// 保存工作空间和环境变量的对应关系至 localStorage
import { getLocalStorage, setLocalStorage } from '@arextest/arex-core';

import { WORKSPACE_ENVIRONMENT_PAIR_KEY } from '@/constant';
import { WorkspaceEnvironmentPair } from '@/panes/Request/EnvironmentDrawer';

export function updateWorkspaceEnvironmentLS(workspaceId: string, environmentId: string) {
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
}
