<template>
  <div class="column-search">
    <a-input
      class="column-search-input"
      :placeholder="`${$t('search')} ${search.column.title}`"
      v-model:value="search.column.searchValue"
      @change="e => search.setSelectedKeys(e.target.value ? [e.target.value] : [])"
      @pressEnter="onSearch"
    />
    <a-button
      class="column-search-left-button"
      type="primary"
      size="small"
      @click="onSearch"
    >
      <search-outlined />{{ $t("search") }}
    </a-button>
    <a-button class="column-search-right-button" size="small" @click="onReset">
      {{ $t("reset") }}
    </a-button>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import { SearchOutlined } from "@/common/icon";

  export default defineComponent({
    name: "ColumnSearch",
    props: {
      search: {
        type: Object,
        default: {}
      }
    },
    setup: (props, { emit }) => {
      const onSearch = () => {
        props.search.confirm();
        emit("onSearch", props.search.selectedKeys[0], props.search.column);
      }

      const onReset = () => {
        props.search.clearFilters();
        props.search.column.searchValue = "";
        emit("onReset", props.search.column);
      }

      return {
        onSearch,
        onReset,
      }
    },
    components: {
      SearchOutlined
    }
  });
</script>

<style scoped lang="less">
  .column-search {
    padding: 8px;
  }

  .column-search .column-search-input {
    width: 188px;
    display: block;
    margin-bottom: 8px;
  }

  .column-search .column-search-left-button {
    width: 90px;
    margin-right: 8px;
  }

  .column-search .column-search-right-button {
    width: 90px;
  }
</style>
