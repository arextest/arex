import { useSystemConfig, useUserProfile, useWorkspaces } from '@/store';

/**
 * TODO 可行性待验证
 * 核心思想是将 store 数据初始化和更新方法放在 store 中，
 * 外部调用者只从 store 中获取数据，以及触发 store 中的更新方法。
 * 如果将数据初始化方法直接放在 store 中，可能会导致在 /login 等非工作页面被调用
 * 故这些方法提取出来，提供给工作页面初始化时调用
 */
const globalStoreInit = () => {
  useWorkspaces.getState().getWorkspaces();
  useUserProfile.getState().getUserProfile();
  useSystemConfig.getState().getAppAuth();
};

export default globalStoreInit;
