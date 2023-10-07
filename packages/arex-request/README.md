# AREX Request

AREX 中的调试 HTTP 请求的组件

## 重构 TODO 
1. 引入依赖 @arextest/arex-core
2. 将 http 重命名为 request

## 目录

1. [特色](#特色)
2. [安装](#安装)
3. [使用](#使用)
4. [例子](#例子)
5. [Props](#props)
6. [问题](#问题)

## 特色

- 可拆卸成细小组件使用
- 可整体集成使用

## 安装

```
npm i arex-request-core --save
yarn add arex-request-core
pnpm add arex-request-core
```

这个库适用于所有现代浏览器。它不适用于IE。

## 使用

```js
import { Http } from 'arex-request-core'
```

## 例子

```tsx
function MainBox({ src }) {
    const requestValue = {
      id: '1',
      preRequestScript: '',
      v: '',
      headers: [],
      name: '',
      body: { contentType: 'application/json', body: '' },
      auth: { authActive: false, authType: 'none' },
      testScript: '',
      endpoint: '{{url}}/get',
      method: 'GET',
      params: [],
    }
  return (
    <Http
      onSend={(request) => {
        return onSend(request, {
          name: 'dev',
          variables: [{ key: 'url', value: 'http://124.223.27.177:18080' }],
        });
      }}
      onSave={onSave}
      value={requestValue}
      environment={{ name: 'dev', variables: [{ key: 'url', value: 'http://124.223.27.177:18080' }] }}
      config={{}}
      breadcrumbItems={[{ title: 'Test' }, { title: 'hoppscotch' }, { title: 'echo' }]}
      onChange={({value}) => {
        console.log(value);
      }}
    />
  )
}
```

### Props

#### `Http`

| 参数      | Type   | Default | 说明                                                                    |
|:--------|:-------|:--------|:----------------------------------------------------------------------|
| value   | object |         | 整个组件的核心数据                                                             |
| height  | string | 100%    | 组件的高度                                                                 |
| disabled | boolean | false   | 是否禁用，只会禁用endpoint和method                                              |
| onSave  | (request: Request) => void |         | 点击保存按钮的时候会发生回调，会传递当前request所有数据                                       |
| onSend  | (request: Request) => Promise<{response,testResult}> |         | 点击发送按钮的时候会发生回调，会传递当前request所有数据。并且会返回请求的结果和测试结果，当然这些结果需要通过自己完成请求发送获得。 |

## Props

**`onSave: (request: Request) => void`**

点击保存按钮的时候会发生回调，会传递当前request所有数据

**`onSend: (request: Request) => Promise<{response,testResult}>`**

点击发送按钮的时候会发生回调，会传递当前request所有数据。并且会返回请求的结果和测试结果，当然这些结果需要通过自己完成请求发送获得。


**`value: Request`**

整个组件的核心数据

**`environment: ArexEnvironment`**

当前环境变量

**`breadcrumbItems?: {tittle:string}[]`**

当前request的目录路径

**`onChange: (value) => void`**

修改request时触发


## 问题

[AREX 如何实现纯web端完成各类API调试？](documentation/how-to-complete-debugging.md)
