<template>
  <a-select
    v-model:value="selectedAppId"
    show-search
    :placeholder="$t('selectAppId')"
    style="width: 200px"
    :options="options"
    :filter-option="filterOption"
    @change="onChange"/>
</template>

<script>
  import {useAppSelectHeader} from "@/modules/dashboard";

  export default {
    name: "AppSelectHeader",
    setup: useAppSelectHeader
  }
</script>

<style scoped>
</style>
