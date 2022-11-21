### 如何添加新的主题色（以添加 Gold 色为例）

1. 在 src/style/theme 中复制其他主题色的深浅色样式文件夹，分别更改名称为 lightGold 和 darkGold
2. 分别修改深浅样式文件夹中的 index.less -> @primary-color 和 utils.ts -> name, primaryColor( 需符合 `[light|dark]-Gold` 格式)
3. 在 src/style/theme/utils.ts 中的 `PrimaryColor` `Theme` `primaryColorPalette` `themeMap` 添加新的主题信息
4. 在 config/themePreprocessorOptions 中的 `multipleScopeVars` 引入相关主题 less 文件
5. 重启服务
