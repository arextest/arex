import colorLib from '@kurkle/color';

const themeLight = {
  color: {
    primary: '#603BE3',
    active: '#f5f5f5',
    selected: colorLib('#603BE3').alpha(0.1).rgbString(),
    success: '#66bb6a',
    info: '#29b6f6',
    warning: '#ffa726',
    error: '#f44336',
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
      disabled: 'rgba(0,0,0,0.38)',
      watermark: 'rgba(0,0,0,0.1)',
      highlight: '#603BE3',
    },
    border: {
      primary: '#F0F0F0',
    },
  },
};

export default themeLight;
