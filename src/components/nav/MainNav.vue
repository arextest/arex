<template>
  <div class="main-nav">
    <a-menu
      class="main-nav-menu"
      theme="dark"
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      @click="onClick"
    >
      <a-menu-item v-for="navItem in navs" :key="navItem.name">{{ $t(navItem.name) }}</a-menu-item>
    </a-menu>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import { SET_ROUTES } from "@/store/mutation-types";
  import { useStore, useGetters } from "vuex-composition-helpers";
  import { Route } from "@/common/constant";

  export default defineComponent({
    name: "MainNav",
    setup: () => {
      const router = useRouter();
      const store = useStore();
      const { routes } = useGetters([Route.ROUTES]);
      const navs = router.options.routes[0].children;
      const selectedKeys: any = ref([]);

      const onSetSelectedKeys = () => {
        let name = routes.value[1].name;
        if (name === Route.PORTAL || name === Route.ERROR_404) {
          selectedKeys.value.splice(0);
        } else if (selectedKeys.value.length > 0) {
          selectedKeys.value[0] = name;
        } else {
          selectedKeys.value.push(name);
        }
      };

      watch(router.currentRoute, () => {
        let currentPath = router.currentRoute.value.path;
        let stack = [];
        stack.push({ routes: router.options.routes, index: 0 });
        while (stack.length > 0) {
          if (stack[stack.length - 1].path === currentPath) {
            break;
          }
          let currentStackItem: any = stack.pop();
          if (currentStackItem.index === currentStackItem.routes.length) {
            continue;
          }
          let route: any = currentStackItem.routes[currentStackItem.index];
          currentStackItem.index++;
          if (route && route.children) {
            let routes = currentStackItem.routes;
            currentStackItem.path = routes.length > currentStackItem.index ? routes[currentStackItem.index].path : "";
            stack.push(currentStackItem);
            stack.push({ routes: route.children, index: 0, path: route.children[0].path });
          } else if (currentStackItem.routes.length > currentStackItem.index) {
            stack.push({
              routes: currentStackItem.routes,
              index: currentStackItem.index,
              path: currentStackItem.routes[currentStackItem.index].path,
            });
          }
        }
        stack = stack.map((stackItem, stackIndex) => {
          let route =  stackItem.routes[stackIndex < stack.length - 1 ? stackItem.index - 1 : stackItem.index];
          return { name: route.name, path: route.path};
        });
        store.commit(SET_ROUTES, stack);
        onSetSelectedKeys()
      }, {deep: true, immediate: true});

      const onClick = ({ key }: any) => router.push({ name: key });

      return {
        navs,
        selectedKeys,

        onClick,
      };
    }
  });
</script>

<style scoped lang="less">
  .main-nav {
    margin: 12px 0;
    line-height: 40px;
  }

  .main-nav .main-nav-menu {
    background: transparent;
    border: none;
  }

  .main-nav :deep(.ant-menu-item) {
    border-radius: 4px;
    padding: 0 12px;
    margin: 0 12px;
    color: var(--color-card);
    font-size: 16px;
  }

  .main-nav :deep(.ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover) {
    background: #104C84;
  }

  .main-nav :deep(.ant-menu.ant-menu-dark .ant-menu-item-selected) {
    background: #104C84;
  }

  .main-nav :deep(.ant-menu.ant-menu-dark) {
    background: #092659;
  }
</style>
