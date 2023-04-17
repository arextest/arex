import { Button } from 'antd';
import React, { FC } from 'react';
export interface EnvironmentMenuProps {
  value: string;
  onSelect: (value: string) => void;
}
const EnvironmentMenu: FC<EnvironmentMenuProps> = (props) => {
  return <Button onClick={() => props.onSelect('123321')}>EnvironmentMenu</Button>;
};

export default EnvironmentMenu;
