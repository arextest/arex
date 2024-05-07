import axios from 'axios';
import { create } from 'zustand';

import { isClient } from '@/constant';

export type ClientState = {
  companyName: string;
};

export type ClientAction = {
  getCompanyName: () => Promise<string>;
};

const useClientStore = create<ClientState & ClientAction>((set) => ({
  companyName: '',
  getCompanyName: async () => {
    const companyName = isClient
      ? (await axios.get<{ companyName: string }>('/api/companyName')).data.companyName
      : location.hostname.split('.')[0];

    set({ companyName });
    return Promise.resolve(companyName);
  },
}));

export default useClientStore;
