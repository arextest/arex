import { useContext } from 'react';

import { RequestStoreContext } from '../providers/RequestStoreProvider';

export const useArexRequestStore = () => useContext(RequestStoreContext);
