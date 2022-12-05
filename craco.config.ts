import path from 'path';

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
  typescript: {
    enableTypeChecking: false,
  },
  webpack: {
    alias: {

    },
    // 以下代码！！！  与alias或babel同级
    configure:(webpackConfig: { output: any; }, {env, paths}: any) => {
      // 修改build的生成文件名称
      paths.appBuild = 'dist';
      webpackConfig.output ={
        ...webpackConfig.output,
        path:path.resolve(__dirname,'dist'),
        publicPath:'/'
      }
      return webpackConfig;
    }
  }
};
