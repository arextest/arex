### 改动点

#### 全局状态管理模块拆封重构
1. useMenusPanes —— 菜单面板状态管理
1.1

### 难点
1. Menu/Pane 组件组册，动态渲染，类型支持、**所有注册组件枚举获取 (决定在 arex-core 中不再提供 menus/panes)**


### 问题记录
1. Menu/Pane label 涉及多语言, 原本打算通过 createMenu/Pane 方法的get方法封装在对象属性内部, 但是无法动态更新,于是打算在外部调用 FC.name 属性作为 t 翻译方法的 key. 但是考虑到当 FC 为匿名函数组件时 FC.name 为空存在隐患, 最终决定将 Menu/Pane 的 type 属性作为 t 翻译方法的 key
