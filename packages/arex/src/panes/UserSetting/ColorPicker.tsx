import { theme } from 'antd';
import { ColorPrimaryPalette, colorPrimaryPalette, Theme } from 'arex-core';
import React, { FC, useMemo } from 'react';
import { CirclePicker } from 'react-color';

import useUserProfile from '../../store/useUserProfile';

const { defaultSeed, darkAlgorithm, defaultAlgorithm } = theme;

type ColorPickerProps = {
  value?: ColorPrimaryPalette;
  onChange?: (color: ColorPrimaryPalette) => void;
};
const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => {
  const { theme } = useUserProfile();

  const colors = useMemo(() => {
    const algorithm = theme === Theme.dark ? darkAlgorithm : defaultAlgorithm;

    return colorPrimaryPalette.map(
      (color) => algorithm(Object.assign(defaultSeed, { colorPrimary: color.key })).colorPrimary,
    );
  }, [theme]);

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
