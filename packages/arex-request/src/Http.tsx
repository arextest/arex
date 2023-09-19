import { FC, forwardRef } from 'react';

import HttpIndex, { HttpProps } from './components/http';
import ConfigProvider from './providers/ConfigProvider';

const Http: FC<HttpProps & { theme: string; locale: string }> = (props, ref) => {
  return (
    <ConfigProvider {...props}>
      <HttpIndex {...props} ref={ref} />
    </ConfigProvider>
  );
};

// @ts-ignore
export default forwardRef(Http);
