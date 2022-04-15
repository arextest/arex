<template>
  <layout class="main-layout" :show-sider="false" :showHeader="true">
    <template #header>
      <div class="layout-main-header">
        <logo class="main-header-logo" />
        <main-nav class="main-header-nav" />
        <user-menu />
      </div>
      <template v-if="showSecondaryNav">
        <div class="layout-secondary-header" >
          <sub-nav />
        </div>
      </template>
    </template>
    <template #content>
      <div class="layout-content" :class="showSecondaryNav ? 'basic-content' : 'portal-content'">
        <router-view v-slot="{ Component }">
          <transition name="content" mode="out-in" appear>
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </template>
  </layout>
</template>

<script lang="ts">
  import {defineComponent, computed, ref} from "vue";

  import Layout from "@/components/layout/Layout.vue";
  import Logo from "@/components/logo/Logo.vue";
  import MainNav from "@/components/nav/MainNav.vue";
  import UserMenu from "@/components/menu/UserMenu.vue";
  import SubNav from "@/components/nav/SubNav.vue";
  import {useRoute} from "vue-router";
  import {Route} from "@/common/constant";

  export default defineComponent({
    name: "MainLayout",
    setup: () => {
      const route = useRoute();
      const showSecondaryNav = computed(() => route.name !== Route.PORTAL);

      return {
        showSecondaryNav
      };
    },
    components: {
      Layout,
      Logo,
      MainNav,
      UserMenu,
      SubNav
    }
  });
</script>

<style scoped lang="less">
  .main-layout {
    font-size: 16px;
  }

  .main-layout .layout-main-header {
    display: flex;
    background: #092659;
    justify-content: space-between;
    min-width: var(--min-width);
    overflow: hidden;
    color: var(--color-card);
  }

  .main-layout .main-header-logo {
    margin-right: 64px;
  }

  .main-layout .main-header-nav {
    flex: 1;
  }

  .main-layout .layout-secondary-header {
    display: flex;
    background: var(--color-card);
    height: 53px;
    line-height: 50px;
    box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.14);
  }

  .layout-content {
    position: absolute;
    left: 0;
    width: 100%;
    padding: 24px;
  }

  .main-layout .portal-content {
    top: 64px;
  }

  .main-layout .basic-content {
    top: 117px;
    background: #f0f2f5;
  }

  .main-layout .content-enter-active {
    animation: bounceInLeft .3s ease;
  }

  .main-layout .content-leave-active {
    animation: fadeOutRightBig .3s ease;
  }
</style>
