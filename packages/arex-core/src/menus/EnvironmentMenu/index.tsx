import React, { FC } from 'react';
export interface EnvironmentMenuProps {
  value: string;
  onSelect: () => void;
}
const EnvironmentMenu: FC<EnvironmentMenuProps> = () => {
  return <div>EnvironmentMenu</div>;
};

export default EnvironmentMenu;
