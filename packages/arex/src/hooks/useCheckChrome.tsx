import { useEffect } from 'react';

import { getChromeVersion } from '@/utils';

const useCheckChrome = () => {
  useEffect(() => {
    setTimeout(getChromeVersion, 500);
  }, []);
};

export default useCheckChrome;
