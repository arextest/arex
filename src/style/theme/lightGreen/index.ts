import colorLib from '@kurkle/color';

import { ThemeName } from '../index';

const name = 'light-green' as ThemeName;
const primaryColor = '#5b8c00';
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
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
      disabled: 'rgba(0,0,0,0.38)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: primaryColor,
    },
    border: {
      primary: '#F0F0F0',
    },
  },
};

export default { name, theme, primaryColor };
