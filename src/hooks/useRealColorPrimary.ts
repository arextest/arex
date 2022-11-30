import { theme } from 'antd';

import defaultConfig from '../defaultConfig';
import useUserProfile from '../store/useUserProfile';
import { ColorPrimaryPalette, colorPrimaryPalette } from '../style/theme';

const { darkAlgorithm, defaultSeed } = theme;

// Get the real ColorPrimaryPalette effect by darkAlgorithm
const useRealColorPrimary = (): ColorPrimaryPalette => {
  const { colorPrimary, darkMode } = useUserProfile();
  const palette = colorPrimaryPalette.find((color) => color.name === colorPrimary);
  const defaultPalette = colorPrimaryPalette.find(
    (color) => color.name === defaultConfig.colorPrimary,
  );

  return darkMode
    ? {
        key: darkAlgorithm({
          ...defaultSeed,
          colorPrimary: palette?.key || defaultPalette!.key,
        }).colorPrimary,
        name: colorPrimary,
      }
    : (palette as ColorPrimaryPalette);
};

export default useRealColorPrimary;
