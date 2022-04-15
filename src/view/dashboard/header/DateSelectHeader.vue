<template>
  <div>
    <a-radio-group v-model:value="selectedValue" button-style="solid" @change="onChange">
      <a-radio-button value="seven-days">{{$t('sevenDays')}}</a-radio-button>
      <a-radio-button value="one-month">{{$t('oneMonth')}}</a-radio-button>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
  import {ref, defineComponent} from 'vue';
  import {useDateSelectHeader} from "@/modules/dashboard";

  export default defineComponent({
    name: "DateSelectHeader",
    setup: useDateSelectHeader,
  })
</script>

<style scoped>
</style>
