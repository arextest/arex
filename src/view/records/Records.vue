<template>
  <div class="records">
    <a-card>
      <template #title>
        <regression-header @onSearch="onSearch" />
      </template>
      <records-list ref="recordsListRef" />
    </a-card>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {useRecords} from "@/modules/records";

  import RegressionHeader from "@/view/regression/header/RegressionHeader.vue";
  import RecordsList from "@/view/records/list/RecordsList.vue";

  export default defineComponent({
    name: "Records",
    components: {
      RegressionHeader,
      RecordsList,
    },
    setup: useRecords
  });
</script>

<style scoped lang="less">

</style>
