import { getLocalStorage, setLocalStorage } from 'arex-core';

import { EMAIL_KEY } from '@/constant';
import { useEnvironments, useMenusPanes, useUserProfile, useWorkspaces } from '@/store';

import useCollections from '../store/useCollections';

const globalStoreReset = () => {
  const email = getLocalStorage<string>(EMAIL_KEY);

  useCollections.getState().reset();
  useMenusPanes.getState().reset();
  useEnvironments.getState().reset();
  useWorkspaces.getState().reset();
  useUserProfile.getState().reset();

  localStorage.clear();
  email?.startsWith('GUEST') && setLocalStorage(EMAIL_KEY, email);
};

export default globalStoreReset;
