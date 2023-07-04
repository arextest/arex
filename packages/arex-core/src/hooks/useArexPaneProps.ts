import { useContext } from 'react';

import { PaneContext } from '../layout/ArexPanesContainer';

function useArexPaneProps<T = unknown>() {
  return useContext<{
    data?: T;
    paneKey: string;
  }>(PaneContext);
}

export default useArexPaneProps;
