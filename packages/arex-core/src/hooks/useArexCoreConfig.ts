import { useContext } from 'react';

import { ArexCoreContext } from '../providers/ArexCoreProvider';

const useArexCoreConfig = () => useContext(ArexCoreContext);

export default useArexCoreConfig;
