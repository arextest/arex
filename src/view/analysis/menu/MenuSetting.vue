<template>
  <div class="menu-setting">
    <div class="flex">
      <main-select class="setting-config-select" :select="select" @onSelect="onChange" />
      <sort ref="sortRef" :label="$t('failureRate')" sort-key="failureRate" @onClick="onChange" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useMenuSetting} from "@/modules/analysis";
import { PlusOutlined } from "@/common/icon";

import MainSelect from "@/components/select/MainSelect.vue";
import Sort from "@/components/sort/Sort.vue";

export default defineComponent({
  name: "MenuSetting",
  props: {
    hasSelected: {
      type: Boolean,
      default: false
    },
    hasSelectedAll: {
      type: Boolean,
      default: false
    }
  },
  setup: useMenuSetting,
  components: {
    MainSelect,
    PlusOutlined,
    Sort
  }
});
</script>

<style scoped lang="less">
.menu-setting .menu-setting-action {
  margin-top: 16px;
}

.menu-setting .setting-config-select {
  flex: 1;
  margin-right: 24px;
}

.menu-setting .setting-action-select {
  flex: 1;
  margin-left: 8px;
}

.menu-setting .setting-action-plus {
  flex: 4;
}
</style>
