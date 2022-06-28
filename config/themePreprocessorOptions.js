// vite-plugin-theme-preprocessor 插件配置 - 预设主题模式
// https://github.com/GitOfZGT/vite-plugin-theme-preprocessor/blob/master/README.zh.md#%E9%A2%84%E8%AE%BE%E4%B8%BB%E9%A2%98%E6%A8%A1%E5%BC%8F
import path from "path";

import { Color, DefaultTheme } from "../src/style/theme";

const includeStyles = {
  ".ant-btn-text": {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
  },
  ".ant-input-borderless": {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
  },
  ".ant-btn-primary": {
    borderColor: Color.primaryColor,
    background: Color.primaryColor,
  },
};

module.exports = {
  // 使用Less
  less: {
    // 此处配置自己的主题文件
    multipleScopeVars: [
      {
        scopeName: "light",
        path: path.resolve("src/style/theme/light.less"),
        includeStyles,
      },
      {
        scopeName: "dark",
        path: path.resolve("src/style/theme/dark.less"),
        includeStyles,
      },
    ],
    defaultScopeName: DefaultTheme, // 默认取 multipleScopeVars[0].scopeName
    includeStyleWithColors: [
      {
        // color也可以是array，如 ["#ffffff","#000"]
        color: "#ffffff",
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
    outputDir: "",
    // 会选取defaultScopeName对应的主题css文件在html添加link
    themeLinkTagId: "theme-link-tag",
    // "head"||"head-prepend" || "body" ||"body-prepend"
    themeLinkTagInjectTo: "head",
    // 是否对抽取的css文件内对应scopeName的权重类名移除
    removeCssScopeName: false,
    // 可以自定义css文件名称的函数
    customThemeCssFileName: (scopeName) => scopeName,
  },
};
