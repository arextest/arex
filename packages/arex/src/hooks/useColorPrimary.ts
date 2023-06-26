import { theme } from 'antd';
import { ColorPrimaryPalette } from '@arextest/arex-core';

import useUserProfile from '../store/useUserProfile';

const useColorPrimary = (): ColorPrimaryPalette => {
  const { colorPrimary: name } = useUserProfile();
  const {
    token: { colorPrimary: key },
  } = theme.useToken();

  return {
    key,
    name,
  };
};

export default useColorPrimary;
