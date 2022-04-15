<template>
  <div class="regression-header">
<!--    <a-radio-group v-model:value="selectedValue" @change="onChange">
      <template v-for="option in options" :key="option.value">
        <a-radio-button :value="option.value" :disabled="option.disabled">{{ option.label }}</a-radio-button>
      </template>
    </a-radio-group>
    <a-divider class="header-divider" type="vertical" />-->
    <a-input-search
      class="header-search"
      v-model:value.trim="searchText"
      :placeholder="$t('searchApp')"
      @change="onSearch"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useRegressionHeader} from "@/modules/regression";

export default defineComponent({
  name: "RegressionHeader",
  setup: useRegressionHeader
});
</script>

<style scoped lang="less">
  .regression-header .header-divider {
    height: 33px;
    margin: 0 32px;
  }

  .regression-header .header-search {
    width: 30%;
  }
</style>
