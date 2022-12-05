import { theme } from 'antd';

import useUserProfile from '../store/useUserProfile';
import { ColorPrimaryPalette } from '../theme';

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
