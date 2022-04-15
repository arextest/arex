<template>
  <a-tree
    class="message-tree"
    :tree-data="data"
    :selectable="false"
  >
    <template #title="{ title, key }">
      <a-radio v-if="singleChoice" :checked="selectedKey === key" @change="(e) => onCheck(e.target.checked, key)">
        <span>{{ title }}</span>
      </a-radio>
      <a-checkbox v-else @change="(e) => onCheck(e.target.checked, key)">
        <span>{{ title }}</span>
      </a-checkbox>
    </template>
  </a-tree>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useComparisonTree} from "@/modules/configuration";

  export default defineComponent({
    name: "ComparisonTree",
    props: {
      data: {
        type: Array,
        default: () => []
      },
      singleChoice: {
        type: Boolean,
        default: false
      }
    },
    setup: useComparisonTree
  });
</script>

<style scoped>

</style>
