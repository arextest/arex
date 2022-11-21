// vite-plugin-theme-preprocessor 插件配置 - 预设主题模式
// https://github.com/GitOfZGT/vite-plugin-theme-preprocessor/blob/master/README.zh.md#%E9%A2%84%E8%AE%BE%E4%B8%BB%E9%A2%98%E6%A8%A1%E5%BC%8F
import path from 'path';

import defaultConfig from '../src/defaultConfig.ts';
// @ts-ignore
import DarkGreen from '../src/style/theme/darkGreen';
import DarkPurple from '../src/style/theme/darkPurple';
import DarkRed from '../src/style/theme/darkRed';
import LightGreen from '../src/style/theme/lightGreen';
import LightPurple from '../src/style/theme/lightPurple';
import LightRed from '../src/style/theme/lightRed';

const includeStyles = {
  '.ant-btn-text': {
    border: 'none',
    'box-shadow': 'none',
  },
  '.ant-input-borderless': {
    border: 'none',
    'box-shadow': 'none',
  },
  '.ant-input-affix-wrapper > .ant-input': {
    border: 'none',
  },
  '.ant-menu': {
    'box-shadow': 'none',
  },
};

export default {
  // 使用Less
  less: {
    // 此处配置自己的主题文件
    multipleScopeVars: [
      {
        scopeName: LightPurple.name,
        path: path.resolve('src/style/theme/lightPurple/index.less'),
        includeStyles,
      },
      {
        scopeName: DarkPurple.name,
        path: path.resolve('src/style/theme/darkPurple/index.less'),
        includeStyles,
      },
      {
        scopeName: LightRed.name,
        path: path.resolve('src/style/theme/lightRed/index.less'),
        includeStyles,
      },
      {
        scopeName: DarkRed.name,
        path: path.resolve('src/style/theme/darkRed/index.less'),
        includeStyles,
      },
      {
        scopeName: LightGreen.name,
        path: path.resolve('src/style/theme/lightGreen/index.less'),
        includeStyles,
      },
      {
        scopeName: DarkGreen.name,
        path: path.resolve('src/style/theme/darkGreen/index.less'),
        includeStyles,
      },
    ],
    defaultScopeName: defaultConfig.theme, // 默认取 multipleScopeVars[0].scopeName
    includeStyleWithColors: [
      {
        // color也可以是array，如 ["#ffffff","#000"]
        color: '#ffffff',
        // 排除属性，如 不提取背景色的#ffffff
        // excludeCssProps:["background","background-color"]
        // 排除选择器，如 不提取以下选择器的 #ffffff
        // excludeSelectors: [
        //   ".ant-btn-link:hover, .ant-btn-link:focus, .ant-btn-link:active",
        // ],
      },
    ],
    // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
    extract: true,
    // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
    outputDir: '',
    // 会选取defaultScopeName对应的主题css文件在html添加link
    themeLinkTagId: 'theme-link-tag',
    // "head"||"head-prepend" || "body" ||"body-prepend"
    themeLinkTagInjectTo: 'head',
    // 是否对抽取的css文件内对应scopeName的权重类名移除
    removeCssScopeName: false,
    // 可以自定义css文件名称的函数
    customThemeCssFileName: (scopeName) => scopeName,
  },
};
