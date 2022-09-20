import colorLib from '@kurkle/color';

import { ThemeName } from '../index';

const name = 'light-purple' as ThemeName;
const primaryColor = '#603be3';
const theme = {
  color: {
    primary: primaryColor,
    active: '#f5f5f5',
    selected: colorLib(primaryColor).alpha(0.1).rgbString(),
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.9)',
      secondary: 'rgba(0,0,0,0.7)',
      disabled: 'rgba(0,0,0,0.3)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: primaryColor,
    },
    border: {
      primary: '#F0F0F0',
    },
    background: {
      primary: '#ffffff',
      active: '#fafafa',
      hover: '#eee',
    },
  },
};

export default { name, theme, primaryColor };
