export default {
  babel: {
    presets: ['@emotion/babel-preset-css-prop'],
  },
  devServer: {
    client: {
      overlay: false,
    },
    port: 8888,
    open: false,
  },
};
