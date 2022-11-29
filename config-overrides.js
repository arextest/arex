const { override, addBabelPreset, overrideDevServer } = require('customize-cra')
const addDevServerConfig = () => config => {
  // 在这里写你自己的配置
  return {
    ...config,
    client: {
      overlay: false,
    },
  };
}

module.exports = {
  devServer: overrideDevServer(addDevServerConfig()),
  webpack:override(
    addBabelPreset('@emotion/babel-preset-css-prop')
  )
}
