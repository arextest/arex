### 旧版项目代码/架构/开发模式问题与缺陷总结:
1. 同步代码冲突. 公司版基于开源版代码进行二次开发, 但是由于业务逻辑的差异, 且开源版代码的自定义扩展能力有限, 导致公司版对开源版代码进行了大量的修改. 这违背了开源版"增量二次开发"的目标, 同时也导致公司版代码同步开源版代码经常出现大量冲突的情况, 解决冲突非常耗费时间精力.
2. 组件复用性. 由于文档与交流沟通的缺乏, 许多已经实现的组件被反复开发, 造成了大量的重复工作.
3. 项目架构的拓展能力. 新 Menu 和 新 Pane 的灵活配置, 插件化开发模式
4. 标准性. 名词统一, Menu/Pane标准结构, Pane路由模式, 页面恢复方案, 数据状态管理方案(zustand vs useContent)


### 名词
* **touched** Field is considered to be touched when user focused it or its value was changed programmatically with form.setFieldValue handler
* **dirty** Field is considered to be dirty when its value was changed and new value is different from field value specified in initialValues (compared with fast-deep-equal)


- 技术选型pnpm多仓库模式、vite库模式、react+ts
- vite库模式的ts类型打包，编辑器联想
- pnpm多仓库模式包引用
- pnpm包别名切换引用
- github pnpm包发布
- 代码编辑器使用monaco
