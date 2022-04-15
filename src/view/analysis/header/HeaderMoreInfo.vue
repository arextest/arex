<template>
  <popover placement="bottom" :footer="false" :width="260">
    <template #center>
      <description class="header-more-info" :column="1" :items="basicItems" />
    </template>
    <a class="header-more">{{ $t('more') }}</a>
  </popover>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import {useHeaderMoreInfo} from "@/modules/analysis";

  import Popover from "@/components/popover/Popover.vue";
  import Description from "@/components/description/Description.vue";

  export default defineComponent({
    name: "HeaderMoreInfo",
    setup: useHeaderMoreInfo,
    components: {
      Popover,
      Description
    }
  });
</script>

<style scoped lang="less">
  .header-more {
    text-decoration: underline;
  }

  .header-more-info {
    margin: -8px 0 -24px;
  }
</style>
