import { isEqual, omit } from 'lodash';
import React, { createContext, FC, PropsWithChildren, useMemo, useRef } from 'react';

import { RequestProps } from '../components/Request';

export const RequestPropsContext = createContext<RequestProps>({});

const RequestPropsProvider: FC<PropsWithChildren<RequestProps>> = (props) => {
  const value = omit(props, 'children');
  const valueRef = useRef(value);

  const cacheValue = useMemo(() => {
    if (!isEqual(value, valueRef)) {
      valueRef.current = value;
    }
    return valueRef.current;
  }, [value, valueRef]);

  return (
    <RequestPropsContext.Provider value={cacheValue}>{props.children}</RequestPropsContext.Provider>
  );
};

export default RequestPropsProvider;
