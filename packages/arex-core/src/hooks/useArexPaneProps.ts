import { useContext } from 'react';

import { PaneContext } from '../layout/ArexPanesContainer';

const useArexPaneProps = () => useContext(PaneContext);

export default useArexPaneProps;
