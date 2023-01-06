// Custom form item component
import { theme } from 'antd';
import React, { FC, useMemo } from 'react';
import { CirclePicker } from 'react-color';

import useUserProfile from '../../store/useUserProfile';
import { ColorPrimaryPalette, colorPrimaryPalette } from '../../theme';

const { defaultSeed, darkAlgorithm, defaultAlgorithm } = theme;

type ColorPickerProps = {
  value?: ColorPrimaryPalette;
  onChange?: (color: ColorPrimaryPalette) => void;
};
const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => {
  const { darkMode } = useUserProfile();

  const colors = useMemo(() => {
    const algorithm = darkMode ? darkAlgorithm : defaultAlgorithm;

    return colorPrimaryPalette.map(
      (color) => algorithm(Object.assign(defaultSeed, { colorPrimary: color.key })).colorPrimary,
    );
  }, [darkMode]);

  return (
    <div style={{ padding: '8px 0 0 0' }}>
      <CirclePicker
        width={'320px'}
        circleSize={20}
        color={value?.key}
        colors={colors}
        onChangeComplete={(color) => {
          const colorIndex = colors.findIndex((c) => c === color.hex);
          onChange?.(colorPrimaryPalette[colorIndex]);
        }}
      />
    </div>
  );
};

export default ColorPicker;
