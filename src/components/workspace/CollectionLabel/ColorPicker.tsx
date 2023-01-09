import { Button, Tag } from 'antd';
import { PresetColorTypes } from 'antd/es/_util/colors';
import React, { FC } from 'react';

export const LabelColor = ['default', ...PresetColorTypes] as const;

export type ColorPickerProps = {
  value?: (typeof LabelColor)[number];
  onChange?: (value: (typeof LabelColor)[number]) => void;
};

const ColorPicker: FC<ColorPickerProps> = (props) => {
  return (
    <>
      {LabelColor.map((color) => (
        <Button
          size='small'
          type={props.value === color ? 'primary' : 'text'}
          key={color}
          onClick={() => props.onChange?.(color)}
          style={{ marginBottom: '8px' }}
        >
          <Tag color={color} style={{ margin: 0 }}>
            {color}
          </Tag>
        </Button>
      ))}
    </>
  );
};

export default ColorPicker;
