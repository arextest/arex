import path from 'path';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import WebpackBar from 'webpackbar'
import webpack from 'webpack'
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
    enableTypeChecking: true,
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@components': path.resolve(__dirname, './src/components'),
    },
    // 以下代码！！！  与alias或babel同级
    configure: (webpackConfig: { output: any,plugins:any }, { env, paths }: any) => {
      // 修改build的生成文件名称
      paths.appBuild = 'dist';
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
      };
      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }
      webpackConfig.plugins.push(
        new MonacoWebpackPlugin()
      );
      webpackConfig.plugins.push(new webpack.ProgressPlugin())
      webpackConfig.plugins.push(new WebpackBar())
      return webpackConfig;
    },
  },
};
