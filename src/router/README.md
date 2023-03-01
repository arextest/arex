# 自定义路由跳转方法

## useCustomNavigate

```js
// 在panes中
// 使用customNavigate统一跳转

// 路由跳转
const customNavigate = useCustomNavigate()

customNavigate(`/${params.workspaceId}/${PagesType.Setting}/${'SETTING'}`);
// 或者
customNavigate({
  path: `/${params.workspaceId}/${PagesType.Replay}/${app.id}`,
  query: {
    data: encodeURIComponent(JSON.stringify(app)),
    planId: customSearchParams.query.planId,
  },
});

// 在组件中，路由参数获取

const customSearchParams = useCustomSearchParams();

const a = {
  path: customSearchParams.pathname,
  query: {
    data: customSearchParams.query.data,
  },
}

```
