import axios from 'axios';
import { create } from 'zustand';

import { isClient } from '@/constant';

export type ClientState = {
  companyName: string;
};

export type ClientAction = {
  getCompanyName: () => Promise<void>;
};

const useClientStore = create<ClientState & ClientAction>((set) => ({
  companyName: '',
  getCompanyName: async () => {
    const companyName = isClient
      ? (await axios.get<{ companyName: string }>('/api/companyName')).data.companyName
      : location.hostname.split('.')[0];

    set({ companyName });
  },
}));

useClientStore.getState().getCompanyName();

export default useClientStore;
