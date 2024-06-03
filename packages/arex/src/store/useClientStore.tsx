import axios from 'axios';
import { create } from 'zustand';

import { isClient } from '@/constant';

export type ClientState = {
  organization: string;
};

export type ClientAction = {
  getOrganization: () => Promise<string>;
  setOrganization: (organization: string) => void;
  clearOrganization: () => void;
};

const useClientStore = create<ClientState & ClientAction>((set) => ({
  organization: '',
  getOrganization: async () => {
    const organization = isClient
      ? (await axios.get<{ organization: string }>('/api/organization')).data.organization
      : location.hostname.split('.')[0];

    set({ organization });
    return Promise.resolve(organization);
  },
  setOrganization: (organization) => set({ organization }),
  clearOrganization: async () => {
    set({ organization: '' });
    return (await axios.delete<{ organization: string }>('/api/organization')).data.organization;
  },
}));

export default useClientStore;
