import { ColorPrimaryPalette } from '@arextest/arex-core';
import { theme } from 'antd';
import { useMemo } from 'react';

import useUserProfile from '../store/useUserProfile';

const useColorPrimary = (): ColorPrimaryPalette => {
  const { colorPrimary: name } = useUserProfile();
  const {
    token: { colorPrimary: key },
  } = theme.useToken();

  return useMemo(
    () => ({
      key,
      name,
    }),
    [key, name],
  );
};

export default useColorPrimary;
