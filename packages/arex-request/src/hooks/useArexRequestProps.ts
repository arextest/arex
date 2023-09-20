import { useContext } from 'react';

import { Context } from '../providers/RequestProvider';

const useArexRequestProps = () => useContext(Context);

export default useArexRequestProps;
