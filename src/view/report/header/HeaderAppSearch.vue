<template>
  <popover
    placement="bottomLeft"
    :title="$t('switchApp')"
    :width="460"
    @onClose="onClose"
    @onConfirm="onConfirm"
  >
    <template #center>
      <div class="header-app-search">
        <div class="search-label">{{ $t("appId") }} :</div>
        <main-select class="search-select" :select="select" @onSearch="onSearchApp" />
      </div>
    </template>
    <div class="header-app page-title">
      <span>{{ plan.appId }}</span> <caret-down-outlined />
    </div>
  </popover>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useHeaderAppSearch} from "@/modules/report";
  import { CaretDownOutlined } from "@/common/icon";

  import Popover from "@/components/popover/Popover.vue";
  import MainSelect from "@/components/select/MainSelect.vue";

  export default defineComponent({
    name: "HeaderAppSearch",
    components: {
      Popover,
      MainSelect,
      CaretDownOutlined
    },
    setup: useHeaderAppSearch,
    props: {
      plan: {
        type: Object,
        default: () => ({})
      }
    },

  });
</script>

<style scoped lang="less">
  .header-app-search {
    display: flex;
    align-items: center;
  }

  .header-app-search .search-label {
    margin-right: 8px;
  }

  .header-app-search .search-select {
    flex: 1;
  }

  .report-header .header-app {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
</style>
