import { create } from 'zustand';

import { SystemService } from '@/services';

type SystemConfig = {
  appAuth: boolean;
};

type Action = {
  getAppAuth: () => void;
};

const useSystemConfig = create<SystemConfig & Action>((set) => {
  return {
    appAuth: false,
    getAppAuth: async () => {
      const res = await SystemService.querySystemConfig('auth_switch');
      set({ appAuth: !!res.authSwitch });
    },
  };
});

export default useSystemConfig;
