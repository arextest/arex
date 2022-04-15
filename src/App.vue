<template>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import enUS from "ant-design-vue/es/locale/en_US";
  import zhCN from "ant-design-vue/es/locale/zh_CN";
  import {getLocale} from "@/common/locale";;

  export default defineComponent({
    name: "App",
    setup: () => {
      return {
        locale: getLocale(),
        enUS,
        zhCN
      }
    }
  });
</script>

<style scoped>

</style>
