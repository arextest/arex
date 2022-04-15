<template>
  <a-select
    v-if="select.mode"
    v-model:value="select.values"
    :mode="select.mode"
    :disabled="select.disabled"
    :filter-option="false"
    :options="select.options"
    :placeholder="select.placeholder"
    :not-found-content="select.searching ? undefined : null"
    @search="onSearch"
  >
    <template v-if="select.searching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
  <a-select
    v-else-if="select.showSearch"
    v-model:value="select.value"
    :disabled="select.disabled"
    show-search
    :filter-option="false"
    :options="select.options"
    :placeholder="select.placeholder"
    :not-found-content="select.searching ? undefined : null"
    @search="onSearch"
    @select="onSelect"
  >
    <template v-if="select.searching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
  <a-select
    v-else
    v-model:value="select.value"
    :disabled="select.disabled"
    :filter-option="false"
    :options="select.options"
    :placeholder="select.placeholder"
    :not-found-content="select.searching ? undefined : null"
    @select="onSelect"
  >
    <template v-if="select.searching" #notFoundContent>
      <a-spin size="small" />
    </template>
  </a-select>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {debounce} from "@/common/utils";

  export default defineComponent({
    name: "Selector",
    props: {
      select: {
        type: Object,
        default: () => {
          return {
            mode: undefined,
            value: "",
            values: [],
            options: [],
            disabled: false,
            searching: false,
            placeholder: "",
            showSearch: true
          }
        }
      },
    },
    setup: (props: any, { emit }: any) => {
      const getOptions = debounce((value: string) => {
        emit('onSearch', value)
      }, 300);

      const onSearch = (value: string) => getOptions(value);

      const onSelect = (value: string) => emit('onSelect', value);

      return {
        onSearch,
        onSelect
      }
    }
  });
</script>

<style scoped lang="less">

</style>
