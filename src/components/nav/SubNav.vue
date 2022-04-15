<template>
  <div class="sub-nav">
    <template v-if="isDashboard">
      <a-menu class="sub-nav-menu" v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" @click="onClick">
        <template v-for="navItem in navs" :key="navItem.name">
          <a-menu-item>
            <span class="menu-label">{{ $t(navItem.name) }}</span>
            <a-divider v-show="selectedKeys.length > 0 && navItem.name === selectedKeys[0]" />
          </a-menu-item>
        </template>
      </a-menu>
    </template>
    <template v-else>
      <a-breadcrumb class="sub-nav-breadcrumb" separator="">
        <a-breadcrumb-item>{{ $t("currentLocation") }}</a-breadcrumb-item>
        <a-breadcrumb-item> : </a-breadcrumb-item>
        <a-breadcrumb-item v-for="(navItem, navIndex) in navs" :key="navItem.path">
          <span>{{ $t(navItem.name) }}</span>
          <template v-if="navIndex < navs.length - 1">
            <span class="breadcrumb-item-split">/</span>
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </template>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, watch} from "vue";
  import {useRouter} from "vue-router";
  import {Route} from "@/common/constant";
  import {useGetters} from "vuex-composition-helpers";

  export default defineComponent({
    name: "SubNav",
    setup: () => {
      const router = useRouter();
      const { routes } = useGetters([Route.ROUTES]);
      const navs: any = ref([]);
      const isDashboard = ref();
      const selectedKeys: any = ref([]);

      watch(router.currentRoute, () => {
        navs.value.splice(0);
        if (router.currentRoute.value.path.includes(Route.DASHBOARD)) {
          const children: any = router.options.routes[0].children;
          const grandChildren = children[0].children;
          if (children) {
            navs.value = navs.value.concat(grandChildren);
          }
          if (!grandChildren.find((grandChild: any) => selectedKeys.value[0] === grandChild.name)) {
            selectedKeys.value.push(grandChildren[0].name);
          }
          isDashboard.value = true;
        } else {
          navs.value = routes.value.slice(1);
          isDashboard.value = false;
          selectedKeys.value.splice(0)
        }
      }, { immediate: true });

      const onClick = ({ key }: any) => router.push({ name: key });

      return {
        navs,
        isDashboard,
        selectedKeys,

        onClick
      }
    }
  });
</script>

<style scoped lang="less">
  .sub-nav :deep(.sub-nav-menu) {
    background: transparent;
    border: none;
    padding-left: 216px;
  }

  .sub-nav :deep(.ant-menu-item) {
    color: rgba(0, 0, 0, 0.45);
    padding: 0 12px;
    margin: 0 12px;
    font-size: 16px;
    font-weight: 500;
  }

  .sub-nav :deep(.ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover) {
    background: var(--color-card);
    color: var(--color-high-text);
  }

  .sub-nav :deep(.ant-menu.ant-menu-dark .ant-menu-item-selected) {
    background: var(--color-card);
    color: var(--color-high-text);
  }

  .sub-nav :deep(.ant-divider) {
    border-top: 2px solid var(--color-high-text);
    margin: -8px 0 0 0;
  }

  .sub-nav .sub-nav-breadcrumb {
    line-height: 53px;
    padding-left: 29px;
  }

  .sub-nav .breadcrumb-item-split {
    margin: 0 8px;
  }
</style>
