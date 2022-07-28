import { useEffect } from 'react';

import { useStore } from '../../store';

const CheckChromeExtension = () => {
  useEffect(() => {
    if (!window.__AREX_EXTENSION_INSTALLED__) {
      useStore.setState({ extensionInstalled: false });
      console.info('[AREX] Extension not installed, please install it first.');
    } else {
      useStore.setState({ extensionInstalled: true });
      console.info('[AREX] Extension installed.');
    }
  }, []);

  return <></>;
};

export default CheckChromeExtension;
