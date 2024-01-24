# AREX 开发说明文档

## 开发环境

|      | 最低  | 推荐 |
| ---- | ----- | ---- |
| node | 16.14 | 18   |
| pnpm | 8     | 8    |



## 技术栈

* React 18

* AntDesign 5

* Zustand

* Emotion

* i18n

* pnpm

* ...

  

## 目录结构


```text
.
└── packages
    ├── arex							arex 主项目包
    ├── arex-core					arex 公共组件包 - 提供面向业务逻辑封装的重型组件
    ├── arex-request			arex 请求包 - 提供浏览器发送 http-rest 请求支持
    └── arex-lite					arex 精简版 - 提供 arex 项目结构及组件 demo 演示

```



## 本地开发

###  启动项目

`Fork` 并 `git clone` 仓库

```shell
git clone https://github.com/arextest/arex
cd arex
pnpm install
pnpm run dev
```

### 执行测试脚本

```shell
pnpm run test
```

### 打包构建

```shell
pnpm run build
```

