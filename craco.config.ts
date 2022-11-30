export default {
  babel: {
    presets: ['@emotion/babel-preset-css-prop'],
  },
  devServer: {
    client: {
      overlay: false,
    },
    port: 8000,
    open: false,
  },
};
