import { useContext } from 'react';

import { RequestPropsContext } from '../providers/RequestPropsProvider';

export const useArexRequestProps = () => useContext(RequestPropsContext);
