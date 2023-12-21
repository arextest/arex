import { icons, LucideProps } from 'lucide-react';
import React, { FC } from 'react';

export interface IconProps extends LucideProps {
  name: string;
  color?: string;
  size?: number;
}
const Icon: FC<IconProps> = (props) => {
  const { name, color, size = 14, style, ...restProps } = props;
  // @ts-ignore
  const LucideIcon = icons[name] || icons['HelpCircle'];

  return (
    <LucideIcon
      color={color}
      size={size}
      style={{ verticalAlign: 'text-bottom', ...style }}
      {...restProps}
    />
  );
};

export default Icon;
