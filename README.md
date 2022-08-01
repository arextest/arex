# AREX前端

## 前端应用架构

| 区域     | 功能                                     |
|--------|----------------------------------------|
| Header | workspace选择区、应用设置入口、个人信息入口             |
| 左侧tab栏 | 选择需要操作的功能模块，例如集合、环境变量，选完以后向右侧主区域push数据 |
| 主区域    | 多tab栏形式，可同时容纳多个不同页面，可关闭，带有状态（编辑过）      |
| 底部操作栏  | 提供折叠按钮入口、应用代理请求的方式（chrome插件/http代理）    |

## 项目文件结构


| 区域         | 功能                                                           |
|------------|--------------------------------------------------------------|
| components | 页面所有的组件                                                      |
| helpers    | 与components对应，存放components组件中复杂的一些逻辑处理代码                     |
| pages      | 主区域的页面组件，类似于路由的pages。命名规范：Environment.tsx，组件名EnvironmentPage |
| layouts    | MainBox.tsx是主要容器                                             |
0
