import colorLib from '@kurkle/color';

const themeDark = {
  color: {
    primary: '#ff4d4f',
    active: 'rgba(255, 255, 255, 0.08)',
    selected: colorLib('#ff4d4f').alpha(0.1).rgbString(),
    success: '#2e7d32',
    info: '#0288d1',
    warning: '#ed6c02',
    error: '#d32f2f',
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
      watermark: 'rgba(255, 255, 255, 0.1)',
      highlight: '#955cf4',
    },
    border: {
      primary: '#303030',
    },
  },
};

export default themeDark;
