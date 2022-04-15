<template>
  <a-card v-if="showRegression">
    <template #title>
      <regression-header @onSearch="onSearchApps" />
    </template>
    <regression-list ref="regressionListRef" />
  </a-card>
  <router-view v-else v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { useRegression } from "@/modules/regression";

import RegressionHeader from "@/view/regression/header/RegressionHeader.vue";
import RegressionList from "@/view/regression/list/RegressionList.vue";

export default defineComponent({
  name: "Regression",
  setup: useRegression,
  components: {
    RegressionHeader,
    RegressionList
  }
});
</script>

<style scoped lang="less">

</style>
