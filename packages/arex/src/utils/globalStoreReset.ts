import { getLocalStorage, setLocalStorage } from '@arextest/arex-core';

import { EMAIL_KEY } from '@/constant';
import { useClientStore, useMenusPanes, useUserProfile, useWorkspaces } from '@/store';

import useCollections from '../store/useCollections';

const globalStoreReset = () => {
  const email = getLocalStorage<string>(EMAIL_KEY);

  useCollections.getState().reset();
  useMenusPanes.getState().reset();
  useWorkspaces.getState().reset();
  useUserProfile.getState().reset();

  localStorage.clear();
  email?.startsWith('GUEST') && setLocalStorage(EMAIL_KEY, email);
  useClientStore.getState().clearOrganization();
};

export default globalStoreReset;
