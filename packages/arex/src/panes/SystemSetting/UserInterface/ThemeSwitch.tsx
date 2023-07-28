import { Theme } from '@arextest/arex-core';
import { Switch } from 'antd';
import React, { FC } from 'react';

import { useUserProfile } from '@/store';

const ThemeSwitch: FC<{ value?: Theme; onChange?: (theme: Theme) => void }> = (props) => {
  const { setTheme } = useUserProfile();

  return (
    <Switch
      checkedChildren='🌛'
      unCheckedChildren='🌞'
      checked={props.value === Theme.dark}
      onChange={(dark) => {
        const theme = dark ? Theme.dark : Theme.light;
        props.onChange?.(theme);
        setTheme(theme);
      }}
    />
  );
};

export default ThemeSwitch;
